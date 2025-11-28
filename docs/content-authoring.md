# Content Authoring Guide

새 글(학습 노트/워크숍)을 추가할 때 따라야 할 구조와 순서를 정리했습니다.

## 1) 예제 코드 폴더 만들기

- 위치: `src/examples/<tech>/<example-key>/`
- HTML 예제
  - 필수: `index.html`
  - 선택: `style.css`, `script.js`
  - `meta.json` 예시:
    ```json
    {
      "title": "hidden vs display vs visibility",
      "tech": "html",
      "description": "요소 숨김 속성이 레이아웃/렌더링에 주는 차이 비교"
    }
    ```
- React 예제
  - 필수: `index.jsx`(또는 `index.js`, 이 파일이 엔트리)
  - 필요 시 `App.jsx` 등 추가 파일
  - `meta.json` 예시:
    ```json
    {
      "title": "useState toggle & counter",
      "tech": "react",
      "description": "두 개의 상태를 함께 관리하는 기본 패턴"
    }
    ```
  - `index.jsx`에서는 `ReactDOM.createRoot(document.getElementById('root')).render(<App />)` 형태로 렌더링.

> `tech` 값은 HTML이면 `html`, React이면 `react`로 소문자 사용. `example` prop으로 넘길 때 `html/foo-bar` 혹은 `react/foo-bar`처럼 이 경로를 그대로 사용합니다.

## 2) MDX/페이지 파일 추가

- 위치: `src/pages/<slug>.mdx` (또는 TSX/JSX 페이지)
- 상단 메타 선언:
  ```js
  export const meta = {
    title: '문서 제목',
    summary: '짧은 요약',
    tech: 'HTML', // 혹은 'React'
    type: 'Post', // Post(게시글) | Lab(실습) | Mixed(혼합)
    slug: '/your-path',
    tags: ['tag1', 'tag2'],
  }
  ```
- MDX 본문에서 플레이그라운드 연결:
  ```mdx
  import Playground from '../components/playground/Playground.jsx'

  <Playground example="html/hidden-display-visibility" />
  ```
- `example` 값은 1단계에서 만든 예제 폴더 경로(`tech/example-key`)와 일치해야 합니다.

## 3) 라우팅 등록

- 파일: `src/mainRoutes.jsx`
- 새 페이지를 import 후 routes 배열에 추가:
  ```js
  import MyNewPage from './pages/my-new-page.mdx'

  const routes = [
    // ...
    {
      path: '/your-path',      // meta.slug와 동일
      element: <MyNewPage />,
      label: '문서 제목',      // 네비용 라벨
      tech: 'HTML',            // 카테고리 표기
    },
  ]
  ```

## 4) 홈 카드 노출

- `src/pages/Home.jsx`는 `src/pages/*.mdx`의 `meta.slug`가 있는 항목을 자동 카드화합니다.
- MDX가 아닌 TSX/JSX 페이지는 `Home.jsx`의 `extraEntries`에 수동으로 추가해야 목록에 보입니다.

## 5) 작성 순서 체크리스트

1. `src/examples/<tech>/<example-key>/`에 예제 파일과 `meta.json` 작성.
2. `src/pages/<slug>.mdx` 생성, `meta` 선언 후 본문에서 `<Playground example="<tech>/<example-key>" />` 연결.
3. `src/mainRoutes.jsx`에 라우트 추가(`path`는 `meta.slug`와 동일).
4. (필요 시) `Home.jsx`의 `extraEntries`에 추가해 카드 노출 확인.
5. 실행: `npm run dev` 후 페이지 이동 → 코드 수정/미리보기 동작 확인.
