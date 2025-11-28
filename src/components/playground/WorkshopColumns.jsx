import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { buildHtmlSandbox } from './adapters/htmlAdapter'
import { buildReactSandbox } from './adapters/reactAdapter'

const fileRegistry = Object.entries(
  import.meta.glob('../../examples/**/*.{html,css,js,jsx}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
).reduce((acc, [path, contents]) => {
  const key = path.split('/examples/')[1]
  acc[key] = contents
  return acc
}, {})

const loadExampleFiles = (exampleKey) => {
  const prefix = `${exampleKey}/`
  const entries = Object.entries(fileRegistry).filter(([key]) => key.startsWith(prefix))
  const files = {}
  entries.forEach(([key, value]) => {
    files[key.replace(prefix, '')] = value
  })
  return files
}

const detectLanguage = (fileName = '') => {
  if (fileName.endsWith('.html')) return 'html'
  if (fileName.endsWith('.css')) return 'css'
  if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) return 'javascript'
  return 'javascript'
}

export const WorkshopColumns = ({ example, meta: metaProp, layout }) => {
  const meta =
    metaProp || { tech: example.startsWith('react') ? 'react' : 'html', title: example, slug: example }
  const [files, setFiles] = useState(loadExampleFiles(example))
  const pristineRef = useRef(loadExampleFiles(example))
  const [activeFile, setActiveFile] = useState(Object.keys(files)[0] ?? '')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [iframeError, setIframeError] = useState('')
  const runTimer = useRef(null)
  const [isMobileStack, setIsMobileStack] = useState(false)
  const [viewMode, setViewMode] = useState('preview') // 'code' | 'preview'

  useEffect(() => {
    const fresh = loadExampleFiles(example)
    pristineRef.current = fresh
    setFiles(fresh)
    setActiveFile(Object.keys(fresh)[0] ?? '')
  }, [example])

  useEffect(() => {
    const listener = (event) => {
      if (event.data?.type === 'iframe-error') {
        setIframeError(event.data.message || 'Runtime error in preview')
      }
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const handler = (e) => {
      setIsMobileStack(e.matches)
      if (e.matches) {
        setViewMode('preview')
      }
    }
    setIsMobileStack(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const triggerRun = async (nextFiles = files) => {
    if (runTimer.current) {
      clearTimeout(runTimer.current)
      runTimer.current = null
    }
    setStatus('running')
    setError('')
    setIframeError('')
    try {
      if (meta.tech === 'react') {
        const html = await buildReactSandbox(nextFiles)
        setOutput(html)
      } else {
        setOutput(buildHtmlSandbox(nextFiles))
      }
      setStatus('idle')
    } catch (err) {
      setStatus('error')
      setError(err?.message ?? '미리보기 생성 중 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    if (runTimer.current) clearTimeout(runTimer.current)
    runTimer.current = setTimeout(() => triggerRun(files), 400)
    return () => {
      if (runTimer.current) clearTimeout(runTimer.current)
    }
  }, [files, meta.tech])

  const onChange = (value) => {
    setFiles((prev) => ({ ...prev, [activeFile]: value ?? '' }))
  }

  const reset = () => {
    const fresh = pristineRef.current
    setFiles(fresh)
    setActiveFile(Object.keys(fresh)[0] ?? '')
    triggerRun(fresh)
  }

  const codePane = (
    <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Code</span>
          <span className="text-sm text-slate-700">{meta.title}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-700 hover:border-emerald-200 hover:text-emerald-700 transition"
          >
            초기화
          </button>
          <button
            onClick={() => triggerRun(files)}
            className="px-3 py-1.5 text-sm rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
          >
            실행
          </button>
        </div>
      </div>
      <div className="flex gap-2 border-b border-slate-200 px-4 py-2 overflow-x-auto bg-slate-50 rounded-t-2xl">
        {Object.keys(files).map((file) => (
          <button
            key={file}
            onClick={() => setActiveFile(file)}
            className={`text-sm px-3 py-1 rounded-md transition ${
              activeFile === file ? 'bg-white shadow border border-slate-200' : 'text-slate-600 hover:bg-white/80'
            }`}
          >
            {file}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-[520px] rounded-b-2xl overflow-hidden">
        {activeFile ? (
          <Editor
            theme="light"
            language={detectLanguage(activeFile)}
            value={files[activeFile]}
            onChange={onChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              smoothScrolling: true,
              scrollBeyondLastLine: false,
            }}
          />
        ) : (
          <div className="p-6 text-slate-500 text-sm">파일을 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  )

  const previewPane = (
    <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Preview</span>
          <span className="px-2 py-1 text-[11px] rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {meta.tech?.toUpperCase()}
          </span>
        </div>
        <div
          className={`text-xs px-2 py-1 rounded-full ${
            status === 'running'
              ? 'bg-amber-100 text-amber-700'
              : status === 'error'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {status === 'running' ? '빌드 중' : status === 'error' ? '오류' : '준비'}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {error ? (
          <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-b-2xl min-h-[520px]">
            {error}
          </div>
        ) : (
          <iframe
            title={`${example}-preview`}
            className="w-full flex-1 min-h-[520px] border-0 bg-white rounded-b-2xl"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={output}
          />
        )}
        {iframeError && (
          <div className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            {iframeError}
          </div>
        )}
      </div>
    </div>
  )

  if (layout && !isMobileStack) {
    const CodePane = () => codePane
    const PreviewPane = () => previewPane
    return layout({ CodePane, PreviewPane })
  }

  return (
    <>
      {isMobileStack ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border ${
                viewMode === 'preview'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              프리뷰
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border ${
                viewMode === 'code'
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              코드
            </button>
          </div>
          {viewMode === 'preview' ? previewPane : codePane}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {codePane}
          {previewPane}
        </div>
      )}
    </>
  )
}
