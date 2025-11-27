import { MDXProvider } from '@mdx-js/react'
import type { HTMLAttributes } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import routes from './mainRoutes'
import './style.css'

const mdxComponents = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-semibold text-slate-900 mb-4" {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold text-slate-900 mt-6 mb-3" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-slate-700 leading-7 mb-3" {...props} />
  ),
}

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const mainClass = isHome
    ? 'max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-8'
    : 'w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-8'

  return (
    <MDXProvider components={mdxComponents}>
      <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-4 h-14 flex items-center justify-between">
            <NavLink to="/" className="text-lg font-bold text-emerald-600">
              Frontend Lab
            </NavLink>
            <nav className="flex items-center gap-3 text-sm text-slate-600">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg transition ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-100'
                  }`
                }
              >
                홈
              </NavLink>
            </nav>
          </div>
        </header>

        <main className={mainClass}>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>
      </div>
    </MDXProvider>
  )
}

export default App
