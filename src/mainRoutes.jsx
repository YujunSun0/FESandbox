import Home from './pages/Home'
import BrowserRendering from './pages/browser-rendering.mdx'
import HiddenDisplayVisibility from './pages/hidden-display-visibility.mdx'
import UseStateTogglePage from './pages/UseStateTogglePage'

const routes = [
  {
    path: '/',
    element: <Home />,
    label: 'Home',
    tech: 'Index',
  },
  {
    path: '/browser-rendering',
    element: <BrowserRendering />,
    label: 'Browser Rendering',
    tech: 'HTML',
  },
  {
    path: '/hidden-display-visibility',
    element: <HiddenDisplayVisibility />,
    label: 'Hidden vs Display vs Visibility',
    tech: 'HTML',
  },
  {
    path: '/react/useState-toggle',
    element: <UseStateTogglePage />,
    label: 'useState Toggle',
    tech: 'React',
  },
]

export default routes
