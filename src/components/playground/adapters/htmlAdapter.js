export const buildHtmlSandbox = (files = {}) => {
  const html = files['index.html'] ?? '<div class="p-6 text-slate-900">No HTML found</div>'
  const css = files['style.css'] ?? ''
  const js = files['script.js'] ?? ''

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>
      window.onerror = function(message, source, lineno, colno) {
        parent?.postMessage({ type: 'iframe-error', message: String(message), source, line: lineno, column: colno }, '*')
      };
      window.addEventListener('unhandledrejection', (event) => {
        parent?.postMessage({ type: 'iframe-error', message: String(event.reason) }, '*')
      });
      try {
        ${js}
      } catch (err) {
        parent?.postMessage({ type: 'iframe-error', message: err?.message || 'Unknown error' }, '*')
        throw err;
      }
    </script>
  </body>
</html>`
}
