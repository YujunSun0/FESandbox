# 프런트엔드 랩 — 제품 방향 & PRD (2025-11-27)

인터랙티브 웹 학습 허브: 블로그처럼 읽고, 같은 화면에서 실습하는 경험을 목표로 합니다. 현재 상태, 목표 UX, 그리고 Supabase 기반 서버 계획을 한눈에 볼 수 있도록 정리했습니다.

## 0. 현재 상태
- 프런트 스택: Vite + React 18, MDX, Tailwind CSS, Monaco Editor, esbuild-wasm.
- 플레이그라운드: HTML iframe 샌드박스, React(esm build) 샌드박스, 코드/프리뷰 토글, reset/run.
- 콘텐츠: `src/pages/*.mdx` 글, `src/examples/<tech>/<example>/` 실습(meta.json 포함).
- 라우팅: `src/mainRoutes.jsx`; Home은 MDX meta 기반 카드 자동 노출.

## 1. 목표 경험
- 콘텐츠 타입: 게시글(텍스트 우선), 실습(Playground 중심), 혼합(텍스트+실습 병행).
- 공통 메타: `title`, `summary`, `slug`, `tags`, `tech`, `type`, `author`, `publishedAt`, `hero?`, `estimatedTime?`.
- UX: 본문 우선 + 우측 실습 패널. 데스크톱: 본문 + 오른쪽 패널(프리뷰 기본, 코드 토글). 모바일: 본문 → 프리뷰 → 코드 스택.
- 탐색/발견: 목차, 태그, 검색, 타입 필터(Post/Lab/Mixed), 관련 글/실습 추천.
- 어서링/관리: 대시보드(목록/필터, draft/published), 에디터(MDX WYSIWYG 또는 스플릿), 메타 입력, 실습 파일 편집+프리뷰, 자동저장. 역할: admin/editor.

## 2. 아키텍처(계획)
- 프런트: React + MDX 렌더러, 프리뷰 우선 탭형 Playground, API 기반 데이터 로딩을 고려한 추상화.
- 백엔드(Supabase):
  - Auth: Supabase Auth(이메일+비밀번호, 매직링크, 필요 시 OAuth), 역할 클레임.
  - DB: Supabase Postgres + RLS.
  - 스토리지: Supabase Storage(히어로/에셋 버킷, 퍼블릭/프라이빗 분리).
  - Functions(Edge): 슬러그 중복 체크, 발행 플로우, 이미지 유틸 등.
  - Realtime: 초안 협업 알림 정도로 선택적 활용.

## 3. 데이터 모델(초안)
- `posts`: id, slug, title, summary, body_mdx, type(Post/Lab/Mixed), tech, tags[], hero?, author_id, status(draft/published), published_at, updated_at.
- `labs`: id, key(tech/path), files json[{filename, content}], meta json{title, tech, description}, linked_post_id?, created_at, updated_at.
- `users`: id, email, role(admin/editor) — 인증은 Supabase Auth가 관리.
- `assets`: id, url, meta, owner_id, created_at.

## 4. UX 레이아웃 계획
- 글 상세: 헤더(제목/요약/메타) → 본문 → 우측 실습 패널(프리뷰 기본, 코드 탭) → 관련 콘텐츠.
- Playground: 프리뷰 우선, 코드 탭/토글, Reset/Run, Auto-run, 에러 표시, 섹션 앵커/점프.
- 홈/목록: 타입 필터(Post/Lab/Mixed), 태그 칩, 검색. 현재 홈 톤앤매너 유지.

## 5. 로드맵(순차)
1) UX 리팩(프런트): 프리뷰 우선 Playground, 본문+우측 패널 레이아웃, type 메타/필터 적용.
2) API 스켈레톤(Supabase): Auth + posts CRUD + labs CRUD, 프런트 fetch 훅을 Supabase로 교체.
3) Admin UI: 대시보드/에디터/발행, 실습 파일 편집+프리뷰, draft/published 플로우.
4) 스토리지/배포: Supabase DB+Storage, 프런트 배포(Vercel/Netlify/S3+CF), CDN 자산.
5) 검색/추천: 태그/텍스트 검색, 연관 게시글/실습 추천.

## 6. 디렉터리 컨벤션(현재)
- Pages: `src/pages/<slug>.mdx` (상단에 `export const meta`).
- Labs: `src/examples/<tech>/<example-key>/` + `meta.json`; HTML(index/style/script), React(index.jsx + App.jsx 등).
- Routes: `src/mainRoutes.jsx`에 등록, Home은 meta.slug로 카드 자동 노출.

## 7. 오픈 질문
- 에디터: MDX 지원 WYSIWYG vs 스플릿 코드 편집(지원할 MDX 컴포넌트 범위)?
- Auth: 이메일/비번만 우선? OAuth(Google/GitHub) 초기부터 도입?
- 퍼블릭/어드민 분리 배포 여부?
- 실습 상태 저장: 로컬/세션만? 사용자 계정 기반 저장/공유?

## 8. Supabase 구현 메모
- 테이블/인덱스:
  - `posts`: slug, status, tags(GIN), published_at 인덱스.
  - `labs`: key, linked_post_id 인덱스.
  - `users`: role 컬럼(Supabase auth 사용자와 동기화).
  - `assets`: 스토리지 URL 레퍼런스.
- RLS 정책:
  - 익명: `posts.status = 'published'`만 조회.
  - 인증(editor/admin): 자신의 draft 읽기/쓰기, admin은 전체 발행 가능.
  - Labs: 발행된 글과 연결된 랩은 공개 조회, 작성자는 CRUD.
- 스토리지:
  - 버킷 예시: `hero-public`, `assets-public`(공개), `draft-private`(제한).
  - 업로드 후 URL을 메타에 저장.
- Edge Functions 후보:
  - `slug-check`: 발행 전 슬러그 유니크 검증.
  - `publish-post`: 권한/상태 검증, published_at 세팅, 필요 시 웹훅.
  - `image-proxy/resize`: 썸네일 최적화(선택).
- 프런트 연동:
  - 클라이언트는 anon 키 + RLS로 보호, 필요한 경우 서버(Edge)에서 서비스 롤 사용.
  - 게시물/랩은 REST/RPC로 조회, MDX는 프런트에서 렌더.

## 9. 다음 단계(단기)
- UX 리팩 초안: Playground 프리뷰 우선 탭, 본문+우측 패널 시안 적용.
- 메타 필드에 `type` 추가, 홈/목록 필터 연동.
- Supabase 스키마/RLS 초안 작성(posts/labs/users/assets).
- 퍼블릭 읽기용 fetch 훅을 Supabase에 연결(발행 상태만 노출).

---

# English Version — Product Direction & PRD (2025-11-27)

Interactive web learning hub: read like a blog, practice in-place with live sandboxes. Current state, target UX, and a Supabase-backed server plan.

## 0. Current State
- Frontend: Vite + React 18, MDX, Tailwind CSS, Monaco Editor, esbuild-wasm.
- Playground: HTML iframe sandbox; React sandbox (esbuild-wasm); code/preview toggles, reset/run.
- Content: `src/pages/*.mdx` articles; `src/examples/<tech>/<example>/` labs with `meta.json`.
- Routing: `src/mainRoutes.jsx`; Home auto-lists MDX via meta.

## 1. Target Experience
- Types: Post (text-first), Lab (exercise-first), Mixed (text + embedded labs).
- Meta: `title`, `summary`, `slug`, `tags`, `tech`, `type`, `author`, `publishedAt`, `hero?`, `estimatedTime?`.
- UX: Content-first; right lab panel. Desktop: content + right panel (Preview default, Code toggle). Mobile: content → preview → code stack.
- Discovery: TOC, tags, search, filters (Post/Lab/Mixed), related posts/labs.
- Authoring/Admin: dashboard (list/filter, draft/published), editor (MDX WYSIWYG or split), meta form, lab file editor + preview, autosave. Roles: admin/editor.

## 2. Architecture (planned)
- Frontend: React + MDX renderer; preview-first Playground tabs; API-friendly data loading.
- Backend (Supabase):
  - Auth: Supabase Auth (email+password, magic link, optional OAuth), role claims.
  - DB: Supabase Postgres + RLS.
  - Storage: Supabase Storage (hero/assets buckets, public/private).
  - Edge Functions: slug check, publish flow, image utilities.
  - Realtime: optional for draft collaboration signals.

## 3. Data Model (draft)
- `posts`: id, slug, title, summary, body_mdx, type(Post/Lab/Mixed), tech, tags[], hero?, author_id, status(draft/published), published_at, updated_at.
- `labs`: id, key(tech/path), files json[{filename, content}], meta json{title, tech, description}, linked_post_id?, created_at, updated_at.
- `users`: id, email, role(admin/editor) — auth handled by Supabase.
- `assets`: id, url, meta, owner_id, created_at.

## 4. UX Layout Plan
- Post detail: header → body → right lab panel (Preview default, Code tab) → related content.
- Playground: preview-first; code tab/toggle; Reset/Run; Auto-run; error surface; anchors/jumps.
- Home/List: type filters (Post/Lab/Mixed), tag chips, search; keep current visual tone.

## 5. Roadmap (incremental)
1) UX refactor: preview-first Playground; content + right panel; type meta/filters.
2) API skeleton (Supabase): Auth + posts CRUD + labs CRUD; swap frontend fetch hooks to Supabase.
3) Admin UI: dashboard/editor/publish; lab file edit + preview; draft/published flow.
4) Storage/Deploy: Supabase DB+Storage; frontend deploy (Vercel/Netlify/S3+CF); CDN assets.
5) Search/Recommendation: tag/text search; related Post/Lab suggestions.

## 6. Directory Conventions (current)
- Pages: `src/pages/<slug>.mdx` with `export const meta`.
- Labs: `src/examples/<tech>/<example-key>/` + `meta.json`; HTML (index/style/script), React (index.jsx + App.jsx etc.).
- Routes: `src/mainRoutes.jsx`; Home auto-cards MDX via meta.slug.

## 7. Open Questions
- Editor: MDX-capable WYSIWYG vs split code editor (supported MDX components)?
- Auth: email/password first, or add OAuth (Google/GitHub) from day 1?
- Public vs admin deployment separation?
- Lab state save: local/session only vs user-owned saves/shares?

## 8. Supabase Implementation Notes
- Tables/Indexes:
  - `posts`: slug, status, tags (GIN), published_at indexes.
  - `labs`: key, linked_post_id indexes.
  - `users`: role column synced with Supabase auth.
  - `assets`: storage URL reference.
- RLS:
  - Anonymous: read `posts` where status = 'published'.
  - Auth (editor/admin): CRUD own drafts; admin can publish all.
  - Labs: public read for published-linked labs; authors CRUD their labs.
- Storage:
  - Buckets: `hero-public`, `assets-public` (public), `draft-private` (restricted).
  - Store URLs in meta after upload.
- Edge Functions:
  - `slug-check` for unique slug before publish.
  - `publish-post` for role/status validation and published_at set; optional webhooks.
  - `image-proxy/resize` optional for thumbs.
- Frontend integration:
  - Client uses anon key + RLS; service role only in server/edge paths if needed.
  - Fetch posts/labs via REST/RPC; render MDX on the client.

## 9. Next Steps (near term)
- UX refactor draft: preview-first Playground tabs; content + right panel layout.
- Add `type` to meta; hook filters on Home/List.
- Draft Supabase schema/RLS (posts/labs/users/assets).
- Hook public read fetchers to Supabase (published only).
