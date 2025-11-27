import HiddenDisplayVisibility from './pages/hidden-display-visibility.mdx'
import UseStateTogglePage from './pages/UseStateTogglePage'
import Home from './pages/Home'

const routes = [
  {
    path: '/',
    element: <Home />,
    label: '홈',
    tech: 'Index',
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
