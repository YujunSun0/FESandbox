📘 PRD — Interactive Web Development Learning Hub

버전: 1.0
작성자: 선유준
목표 출시일: 미정
문서 목적: 본 프로젝트의 목적·기능·기술 요구사항을 명확히 정의하고, 디자인·개발·운영의 기준을 제공한다.

1. 📌 프로젝트 개요
1.1 목적

웹 개발 학습 과정에서 얻은 지식들을 단순히 텍스트로 기록하는 것이 아니라,
직접 실행해볼 수 있는 코드 예제 + 설명 + 시각화 형태로 정리해두는 플랫폼을 만든다.

본인의 학습 아카이브 자동 생성

다른 개발자들이 참고할 수 있는 살아있는 교본

인터랙티브한 학습 경험 제공

HTML/CSS/JS 뿐 아니라 React JSX 등 다양한 기술 스택의 예제 실행 가능

1.2 핵심 컨셉

“코드 실행 가능한 프론트엔드 학습 노트”
→ 블로그처럼 읽고, CodeSandbox처럼 실행하고, 문서처럼 정리된 형태.

2. 🎯 핵심 가치 제안 (Value Proposition)
✔ 본인은

학습 기록이 자연스럽게 쌓임

글과 코드가 분리되지 않아 복습이 쉬움

자신의 학습 성장 로그로 활용 가능

기술 포트폴리오로 사용 가능

✔ 다른 개발자들은

개념 설명 + 즉시 실행 가능한 예제 제공

코드 수정 후 바로 결과 확인 가능

실험 기반 학습(Experiment-based Learning) 가능

3. 🧱 주요 기능 요구사항 (Features)
3.1 예제 관리 (Examples)
✔ 지원 포맷

HTML/CSS/JS

React JSX

추후 Vue, Svelte 등 기술 확장 가능

✔ 예제 파일 구조

예제는 다음 구조로 관리:

examples/
  html/
    example-name/
      index.html
      style.css
      script.js
      meta.json
  react/
    example-name/
      App.jsx
      index.js
      meta.json

✔ meta.json 내용
{
  "title": "hidden vs display vs visibility",
  "tech": "html",
  "description": "렌더 트리 차이를 보여주는 예제"
}

3.2 Playground (코드 실행 환경)
✔ HTML용 Sandbox

iframe 기반

HTML + CSS + JS 파일을 합쳐서 iframe.srcdoc으로 실행

완전 격리되어 예제 간 충돌 없는 구조

✔ React JSX용 Sandbox

ESBuild WASM을 사용하여 브라우저에서 실시간 번들링

JSX → JS 변환 지원

React, ReactDOM 자동 주입

번들 결과를 iframe으로 렌더링

✔ 공통 기능

코드 편집 기능 (Monaco Editor)

Auto-save 또는 로컬 실행

Reset 버튼

다중 파일 구조 지원(탭)

3.3 문서(학습 페이지) 작성 시스템
✔ MDX 기반 학습 페이지

Markdown 처럼 작성 가능

JSX 삽입으로 Playground 호출 가능

예제 파일을 불러와 실행 가능

예제:

# Hidden vs Display vs Visibility

<Playground example="html/hidden-display-visibility" />

이 속성들은 렌더 트리에서 다음과 같은 차이가 있다...

✔ 페이지 구조

제목

설명

Playground

배운 점 요약

참고 링크

3.4 UI/UX 요구사항
✔ 사이드바 네비게이션

HTML

CSS

JS

React

Browser Theory
이런 기준으로 분류

✔ Playground 레이아웃

좌측: 코드 편집기

우측: 실행 결과 (iframe)

파일 탭 UI 지원 (index.html, style.css 등)

✔ 다크모드 지원

코드 에디터 연동

4. 🧩 기술 스택 요구사항
4.1 Frontend

React + Vite

MDX (mdx-bundler 또는 @mdx-js/react)

Monaco Editor

ESBuild WASM (React 예제 번들링용)

TailwindCSS (선택)

4.2 Bundling & Runtime

HTML 예제 → iframe sandbox

React 예제 → esbuild-wasm을 이용해 브라우저 번들링

4.3 Directory 구조
project-root/
 ├─ src/
 │   ├─ components/
 │   │   └─ Playground/
 │   ├─ pages/
 │   ├─ styles/
 │   └─ main.tsx
 ├─ examples/
 │   ├─ html/
 │   ├─ react/
 └─ public/

5. ⚙️ 비기능적 요구사항 (NFR)
5.1 성능

HTML 예제는 즉시 로드

React 예제의 빌드는 1초 이하 목표

예제 실행은 완전히 격리된 환경 유지(iframe sandbox)

5.2 확장성

tech 값만 추가하면 Vue/Svelte 등도 수용 가능

예제 파일 구조 동일하게 유지

5.3 유지보수성

Playground 컴포넌트는 tech마다 adapter 사용

htmlAdapter

reactAdapter

(추후) vueAdapter …

6. 🧭 사용자 흐름 (User Flow)

개발자가 개념을 학습함

예제 HTML/React 코드를 examples/ 폴더에 생성

meta.json으로 예제 정보를 등록

MDX 문서에서 <Playground example="html/hidden-display-visibility" /> 호출

사용자는 MDX 페이지에서 설명을 읽고, 바로 코드 수정하며 학습

예제가 GitHub를 통해 공개되면 다른 개발자도 동일하게 학습 가능

7. 🚀 MVP 범위
포함

HTML iframe sandbox

React esbuild wasm bundler

Monaco Editor 탑재

예제 파일 로딩

MDX 문서 렌더링

사이드바 네비게이션

제외

사용자 계정 시스템

예제 온라인 업로드 기능

버전 관리 자동화 시스템

서버 API

8. 📅 로드맵 (초기 버전 기준)
1주차

프로젝트 세팅(Vite, React, Tailwind, MDX 연결)

Playground 기본 UI 구조 생성

2주차

HTML sandbox adapter 구현

다중 파일 탭 UI 구현

3주차

React adapter(esbuild-wasm) 구현

React 예제 렌더링 성공

4주차

사이드바/라우팅 구조 구현

첫 학습 페이지 제작 및 전체 QA 진행

9. 📌 성공 기준 (Success Metrics)

개발자가 예제 10개 이상 안정적으로 기록 가능

사용자가 예제를 열었을 때 3초 이내 실행 가능

React 예제 번들링 평균 1초 이하

GitHub에서 프로젝트 Star 50개 이상 (공개 시)

✔️ 마지막 요약

이 프로젝트는 단순 문서 형태가 아닌
**“실행 가능한 학습 경험”**을 제공하는 새로운 형태의 프론트엔드 학습 레퍼런스 플랫폼이다.

HTML & React 코드 모두 지원

실행 가능한 샌드박스 제공

문서 + 코드가 통합된 MDX 페이지

본인의 학습 로그를 체계적으로 축적 가능

다른 개발자에게도 도움이 되는 오픈소스 형태