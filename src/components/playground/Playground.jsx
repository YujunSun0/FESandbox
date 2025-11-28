import { useEffect, useMemo, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { buildHtmlSandbox } from './adapters/htmlAdapter'
import { buildReactSandbox } from './adapters/reactAdapter'

const metaRegistry = Object.entries(
  import.meta.glob('../../examples/**/meta.json', { eager: true }),
).reduce((acc, [path, mod]) => {
  const key = path.split('/examples/')[1].replace('/meta.json', '')
  acc[key] = mod.default || mod
  return acc
}, {})

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

const detectLanguage = (fileName) => {
  if (fileName.endsWith('.html')) return 'html'
  if (fileName.endsWith('.css')) return 'css'
  if (fileName.endsWith('.jsx')) return 'javascript'
  return 'javascript'
}

const loadExampleFiles = (exampleKey) => {
  const prefix = `${exampleKey}/`
  const entries = Object.entries(fileRegistry).filter(([key]) => key.startsWith(prefix))
  const files = {}
  entries.forEach(([key, value]) => {
    files[key.replace(prefix, '')] = value
  })
  return files
}

const Playground = ({ example }) => {
  const meta = metaRegistry[example] ?? { tech: example.startsWith('react') ? 'react' : 'html', title: example }
  const initialFiles = useMemo(() => loadExampleFiles(example), [example])
  const pristineRef = useRef(initialFiles)
  const [files, setFiles] = useState(initialFiles)
  const [activeFile, setActiveFile] = useState(Object.keys(initialFiles)[0] ?? '')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [iframeError, setIframeError] = useState('')
  const [autoRun, setAutoRun] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [theme, setTheme] = useState('light')
  const runTimer = useRef(null)
  const containerId = useMemo(() => `sandbox-${example.replace(/[^a-z0-9]/gi, '-')}`, [example])

  useEffect(() => {
    const fresh = loadExampleFiles(example)
    pristineRef.current = fresh
    setFiles(fresh)
    setActiveFile(Object.keys(fresh)[0] ?? '')
    setShowEditor(false)
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
    if (!autoRun) return
    if (runTimer.current) clearTimeout(runTimer.current)
    runTimer.current = setTimeout(() => {
      triggerRun()
    }, 400)
    return () => {
      if (runTimer.current) clearTimeout(runTimer.current)
    }
  }, [files, meta.tech, autoRun])

  const handleChange = (value) => {
    setFiles((prev) => ({ ...prev, [activeFile]: value ?? '' }))
  }

  const resetFiles = () => {
    const fresh = pristineRef.current
    setFiles(fresh)
    setActiveFile(Object.keys(fresh)[0] ?? '')
    setError('')
    setIframeError('')
  }

  const triggerRun = async () => {
    if (runTimer.current) {
      clearTimeout(runTimer.current)
      runTimer.current = null
    }
    setStatus('running')
    setError('')
    setIframeError('')
    try {
      if (meta.tech === 'react') {
        const html = await buildReactSandbox(files)
        setOutput(html)
      } else {
        setOutput(buildHtmlSandbox(files))
      }
      setStatus('idle')
    } catch (err) {
      setStatus('error')
      setError(err?.message ?? '미리보기 생성 중 오류가 발생했습니다.')
    }
  }

  const hasDirtyFiles = Object.keys(files).some((file) => files[file] !== pristineRef.current[file])

  const iconForFile = (name) => {
    if (name.endsWith('.html')) return '📄'
    if (name.endsWith('.css')) return '🎨'
    if (name.endsWith('.js')) return '🟨'
    if (name.endsWith('.jsx')) return '⚛️'
    return '📄'
  }

  const PreviewPane = (
    <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Preview</span>
          <span className="px-2 py-1 text-[11px] rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {meta.tech?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">{autoRun ? '자동 실행' : '수동 실행'}</span>
          <span
            className={`px-2 py-1 rounded-full ${
              status === 'running'
                ? 'bg-amber-100 text-amber-700'
                : status === 'error'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {status === 'running' ? '빌드 중' : status === 'error' ? '오류' : '준비'}
          </span>
        </div>
      </div>
      {error ? (
        <div className="p-6 text-sm text-rose-700 whitespace-pre-wrap bg-rose-50 border border-rose-100 rounded-b-2xl">
          {error}
        </div>
      ) : (
        <iframe
          key={containerId}
          title={`${example}-preview`}
          className="w-full h-[560px] border-0 bg-white rounded-b-2xl"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={output}
        />
      )}
      {(iframeError || error) && (
        <div className="absolute bottom-0 left-0 right-0 bg-rose-50 text-rose-700 text-sm border-t border-rose-200 px-4 py-3 rounded-b-2xl">
          <div className="font-semibold mb-1">Preview Error</div>
          <div className="whitespace-pre-wrap">{iframeError || error}</div>
        </div>
      )}
    </div>
  )

  const CodePane = (
    <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Code</span>
          <span className="text-sm text-slate-700">{meta.title}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetFiles}
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
        {Object.keys(files).map((file) => {
          const dirty = files[file] !== pristineRef.current[file]
          return (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`text-sm px-3 py-1 rounded-md transition inline-flex items-center gap-2 ${
                activeFile === file ? 'bg-white shadow border border-slate-200' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{iconForFile(file)}</span>
              <span>{file}</span>
              {dirty && <span className="text-emerald-500">●</span>}
            </button>
          )
        })}
      </div>
      <div className="h-[560px]">
        {activeFile ? (
          <Editor
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            language={detectLanguage(activeFile)}
            value={files[activeFile]}
            onChange={handleChange}
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

  return (
    <div className="card-strong border border-slate-200 rounded-3xl overflow-hidden shadow-lg bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 bg-white/80 backdrop-blur border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest">Playground</div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold text-slate-900">{meta.title ?? example}</div>
            <span className="px-2.5 py-1 text-[11px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              {meta.tech?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowEditor((v) => !v)}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-700 hover:border-emerald-200 hover:text-emerald-700 transition bg-white"
          >
            {showEditor ? '코드 닫기' : '코드 보기'}
          </button>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              className="accent-indigo-500"
            />
            자동 실행
          </label>
          <div className="flex gap-2">
            <button
              onClick={resetFiles}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-700 hover:border-emerald-200 hover:text-emerald-700 transition disabled:opacity-50 bg-white"
              disabled={!hasDirtyFiles}
            >
              초기화
            </button>
            <button
              onClick={triggerRun}
              className="px-3 py-1.5 text-sm rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
            >
              실행
            </button>
          </div>
          <button
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-700 hover:border-emerald-200 hover:text-emerald-700 transition bg-white"
          >
            {theme === 'dark' ? '라이트' : '다크'}
          </button>
        </div>
      </div>

      {showEditor ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white border-t border-slate-200 p-3 lg:p-4">
          <div className="order-1 lg:order-2">{PreviewPane}</div>
          <div className="order-2 lg:order-1">{CodePane}</div>
        </div>
      ) : (
        <div className="bg-white border-t border-slate-200 p-3 lg:p-4">{PreviewPane}</div>
      )}
    </div>
  )
}

export default Playground
