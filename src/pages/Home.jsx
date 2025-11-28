import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const mdxModules = import.meta.glob('./*.mdx', { eager: true })

const mdxPosts = Object.entries(mdxModules)
  .map(([, mod]) => {
    const meta = mod.meta || {}
    if (!meta.slug) return null
    return {
      ...meta,
      path: meta.slug,
    }
  })
  .filter(Boolean)

const extraEntries = [
  {
    title: 'useState Toggle',
    summary: 'React 상태 토글/카운터 기본 예제를 바로 실행해 보세요.',
    tech: 'React',
    slug: '/react/useState-toggle',
    type: '실습',
    tags: ['react', 'state'],
    path: '/react/useState-toggle',
  },
]

function translateType(typeValue) {
  const lower = String(typeValue || '').toLowerCase()
  if (lower === 'post') return '게시글'
  if (lower === 'lab') return '실습'
  if (lower === 'mixed') return '혼합'
  return '혼합'
}

const posts = [...mdxPosts, ...extraEntries].map((post) => ({
  type: translateType(post.type),
  ...post,
}))

const typeOptions = [
  { key: 'all', label: '전체' },
  { key: '게시글', label: '게시글' },
  { key: '실습', label: '실습' },
  { key: '혼합', label: '혼합' },
]

const typeBadge = {
  게시글: 'bg-slate-900 text-white border-slate-900',
  실습: 'bg-emerald-600 text-white border-emerald-600',
  혼합: 'bg-indigo-600 text-white border-indigo-600',
}

const featureIcons = [
  { icon: '⚡', title: '바로 실행', desc: '코드 수정 후 즉시 프리뷰' },
  { icon: '🧭', title: '러닝 가이드', desc: 'MDX 문서 + 실습 병행' },
  { icon: '📂', title: '예제 라이브러리', desc: 'HTML · React 주요 패턴' },
  { icon: '🎯', title: '단계별 학습', desc: '핵심 주제별 큐레이션' },
]

const Home = () => {
  const [filterType, setFilterType] = useState('all')

  const filtered = useMemo(() => {
    if (filterType === 'all') return posts
    return posts.filter((p) => p.type === filterType)
  }, [filterType])

  const spotlight = filtered.filter((p) => p.type === '실습').slice(0, 3)
  const latest = filtered.slice(0, 6)

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-10 space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-6 lg:p-10 shadow-lg">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold text-emerald-700">Frontend Lab</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            블로그처럼 읽고, 바로 실습하는
            <br />
            인터랙티브 러닝 허브
          </h1>
          <p className="text-slate-600 text-lg leading-8">
            HTML/React 예제와 MDX 문서를 한 화면에서. 학습 동선을 끊지 않고 코드와 프리뷰를 함께 경험하세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/browser-rendering"
              className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 text-white shadow hover:bg-slate-800 transition"
            >
              브라우저 렌더링 실습 시작
            </Link>
            <Link
              to="/hidden-display-visibility"
              className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-800 bg-white hover:border-emerald-200 hover:text-emerald-700 transition"
            >
              HTML 기본 살펴보기
            </Link>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featureIcons.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur px-4 py-3 flex flex-col gap-1 shadow-sm"
            >
              <span className="text-xl">{f.icon}</span>
              <div className="text-sm font-semibold text-slate-900">{f.title}</div>
              <div className="text-xs text-slate-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-strong p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="section-header mb-1">콘텐츠 타입</p>
            <h2 className="text-xl font-bold text-slate-900">필터로 원하는 형태만 보기</h2>
          </div>
          <span className="text-sm text-slate-500">{filtered.length}개</span>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {typeOptions.map((opt) => {
            const active = filterType === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => setFilterType(opt.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                  active
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 6).map((post) => (
            <Link
              key={post.path}
              to={post.path}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                    {post.tech}
                  </span>
                  <span
                    className={`px-2 py-1 text-[11px] rounded-full border ${
                      typeBadge[post.type] || 'bg-slate-900 text-white border-slate-900'
                    }`}
                  >
                    {post.type}
                  </span>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-700 transition">바로가기</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
              <p className="text-slate-600 text-sm leading-6 line-clamp-2">{post.summary}</p>
              <div className="flex gap-2 flex-wrap mt-4">
                {post.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-1 rounded-full bg-white/80 text-slate-700 border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-header mb-1">실습 스포트라이트</p>
            <h3 className="text-2xl font-bold text-slate-900">바로 실행하며 익히기</h3>
          </div>
          <Link to="/browser-rendering" className="text-sm font-semibold text-emerald-700 hover:underline">
            더 많은 실습 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spotlight.map((post) => (
            <Link
              key={post.path}
              to={post.path}
              className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-emerald-50/60 to-white p-5 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {post.tech}
                </span>
                <span className="px-2 py-1 text-[11px] rounded-full border bg-emerald-600 text-white border-emerald-600">
                  {post.type}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h4>
              <p className="text-slate-600 text-sm leading-6 line-clamp-2">{post.summary}</p>
              <div className="flex gap-2 flex-wrap mt-4">
                {post.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-1 rounded-full bg-white/80 text-slate-700 border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
