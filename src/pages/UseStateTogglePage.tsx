import Playground from '../components/playground/Playground.jsx'

const UseStateTogglePage = () => {
  return (
    <div className="p-6 space-y-4">
      <div>
        <p className="section-header mb-2">React</p>
        <h2 className="text-2xl font-semibold text-slate-900">useState Toggle & Counter</h2>
        <p className="text-slate-600">
          상태 토글과 카운터를 동시에 다루는 React 기본 예제입니다.
        </p>
      </div>
      <Playground example="react/useState-toggle" />
    </div>
  )
}

export default UseStateTogglePage
