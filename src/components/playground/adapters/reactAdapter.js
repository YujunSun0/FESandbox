import * as esbuild from 'esbuild-wasm'

const ESBUILD_FLAG = '__esbuild_wasm_initialized__'
let initialized = false

const ensureEsbuild = async () => {
  if (initialized || (globalThis && globalThis[ESBUILD_FLAG])) {
    initialized = true
    return
  }
  try {
    await esbuild.initialize({
      wasmURL: '/esbuild.wasm',
      worker: true,
    })
    initialized = true
    if (globalThis) {
      globalThis[ESBUILD_FLAG] = true
    }
  } catch (err) {
    // esbuild-wasm throws if initialize is called twice; treat as initialized
    if (String(err?.message || '').includes('initialize')) {
      initialized = true
      if (globalThis) {
        globalThis[ESBUILD_FLAG] = true
      }
      return
    }
    throw err
  }
}

const resolvePath = (importer, target) => {
  if (!target.startsWith('.')) return target
  const base = importer.replace(/^\//, '')
  const parts = base.split('/').slice(0, -1)
  const segments = target.split('/')
  segments.forEach((segment) => {
    if (!segment || segment === '.') return
    if (segment === '..') {
      parts.pop()
    } else {
      parts.push(segment)
    }
  })
  return parts.join('/')
}

const normalizePath = (value) => (value.startsWith('/') ? value : `/${value}`)

const virtualFsPlugin = (files) => ({
  name: 'virtual-fs',
  setup(build) {
    build.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'globals' }))
    build.onResolve({ filter: /^react-dom\/client$/ }, () => ({ path: 'react-dom/client', namespace: 'globals' }))

    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.path === args.importer) return null
      const resolved = args.importer ? resolvePath(args.importer, args.path) : args.path
      return { path: normalizePath(resolved), namespace: 'virtual' }
    })

    build.onLoad({ filter: /^react$/, namespace: 'globals' }, () => ({
      contents: `export default window.React; export const useState = window.React.useState; export const useEffect = window.React.useEffect;`,
      loader: 'js',
    }))

    build.onLoad({ filter: /^react-dom\/client$/, namespace: 'globals' }, () => ({
      contents: `export const createRoot = window.ReactDOM.createRoot; export default { createRoot };`,
      loader: 'js',
    }))

    build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => {
      const key = args.path.replace(/^\//, '')
      const contents = files[key]
      if (contents == null) {
        return {
          errors: [
            {
              text: `File not found: ${key}`,
            },
          ],
        }
      }
      const ext = args.path.split('.').pop()
      const loader = ext === 'jsx' || ext === 'js' ? 'jsx' : 'js'
      return { contents, loader }
    })
  },
})

export const buildReactSandbox = async (files = {}) => {
  await ensureEsbuild()
  const entryName = files['index.jsx'] ? 'index.jsx' : 'index.js'
  const entry = normalizePath(entryName)
  if (!files[entryName]) {
    throw new Error('엔트리 포인트(index.js 또는 index.jsx)를 찾을 수 없습니다.')
  }
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'esm',
    sourcemap: 'inline',
    define: { 'process.env.NODE_ENV': '"development"' },
    absWorkingDir: '/',
    plugins: [virtualFsPlugin(files)],
  })

  const bundle = result.outputFiles[0].text

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script src="/react.development.js"></script>
    <script src="/react-dom.development.js"></script>
    <script>
      window.onerror = function(message, source, lineno, colno) {
        parent?.postMessage({ type: 'iframe-error', message: String(message), source, line: lineno, column: colno }, '*')
      };
      window.addEventListener('unhandledrejection', (event) => {
        parent?.postMessage({ type: 'iframe-error', message: String(event.reason) }, '*')
      });
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      try {
        ${bundle}
      } catch (err) {
        parent?.postMessage({ type: 'iframe-error', message: err?.message || 'Unknown error' }, '*')
        throw err;
      }
    </script>
  </body>
</html>`
}
