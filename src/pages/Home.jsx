import { Link } from 'react-router-dom'

const mdxModules = import.meta.glob('./*.mdx', { eager: true })

const mdxPosts = Object.entries(mdxModules)
  .map(([path, mod]) => {
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
    summary: 'React 상태 토글과 카운트 예제를 실시간으로 돌려보세요.',
    tech: 'React',
    slug: '/react/useState-toggle',
    tags: ['react', 'state'],
    path: '/react/useState-toggle',
  },
]

const posts = [...mdxPosts, ...extraEntries]

const tagColors = ['#22d3ee', '#a855f7', '#34d399', '#f97316']

const cardBg = [
  'linear-gradient(135deg, rgba(34,211,238,0.16), rgba(99,102,241,0.16))',
  'linear-gradient(135deg, rgba(94,234,212,0.14), rgba(14,165,233,0.14))',
  'linear-gradient(135deg, rgba(244,114,182,0.14), rgba(79,70,229,0.16))',
]

const Home = () => {
  return (
    <div className="max-w-[1440px] px-4 py-10 space-y-10">
      <section className="card-strong p-8 flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex-1 space-y-3">
          <p className="section-header">학습 허브</p>
          <h1 className="text-4xl font-bold text-slate-900">실습형 프론트엔드 가이드</h1>
          <p className="prose-lead">
            카테고리에서 원하는 주제를 고르고, 블로그처럼 읽은 뒤 코드를 바로 실행하세요. 설치 없이
            브라우저에서 학습을 끝낼 수 있습니다.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              HTML/React
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              MDX 문서
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              실시간 실행
            </span>
          </div>
        </div>
        <div className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-400/15 to-sky-300/20 border border-slate-200 p-6 shadow-lg">
          <div className="text-sm text-slate-700 mb-2">카테고리</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-emerald-700 mb-1">HTML</div>
              <div className="text-xs text-slate-600">레이아웃/렌더링</div>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-sky-700 mb-1">React</div>
              <div className="text-xs text-slate-600">상태/컴포넌트</div>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-indigo-700 mb-1">Playground</div>
              <div className="text-xs text-slate-600">코드/프리뷰</div>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-amber-700 mb-1">Docs</div>
              <div className="text-xs text-slate-600">MDX 기반</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[240px_1fr]">
        <div className="card-surface p-4">
          <div className="text-base font-semibold mb-3">카테고리</div>
          <div className="space-y-2 text-sm">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold">
              전체
            </button>
            <div className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 cursor-default">HTML</div>
            <div className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 cursor-default">CSS</div>
            <div className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 cursor-default">JavaScript</div>
            <div className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 cursor-default">React</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">포스트 목록</h2>
            <div className="text-sm text-slate-500">{posts.length}개</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((post, idx) => (
              <Link
                key={post.path}
                to={post.path}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition"
                style={{ backgroundImage: cardBg[idx % cardBg.length] }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {post.tech}
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-slate-700 transition">
                    바로가기 →
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
                <p className="text-slate-600 text-sm leading-6 line-clamp-2">{post.summary}</p>
                <div className="flex gap-2 flex-wrap mt-4">
                  {post.tags?.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2 py-1 rounded-full bg-white/80 text-slate-700 border border-slate-200"
                      style={{ color: tagColors[tIdx % tagColors.length] }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
