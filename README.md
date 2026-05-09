# seohyun-dev

[seohyun.dev](https://seohyun.dev) — 개인 기술 블로그 및 회고 공간.

`/blog` 디렉터리의 마크다운 파일을 빌드 시점에 읽어 정적으로 렌더링합니다. 별도의 CMS나 데이터베이스 없이, 파일 추가 → 커밋 → 배포만으로 글이 게시되는 단순한 구조를 지향합니다.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, github-markdown-css
- **Markdown**:
  - gray-matter — 프런트매터 파싱
  - remark + remark-gfm — GFM 지원
  - rehype-highlight + highlight.js — 코드 블록 신택스 하이라이팅 (Svelte 포함)
- **Storage**: Vercel Blob — 이미지 업로드
- **Tooling**: ESLint, Prettier
- **Package manager**: pnpm
- **Deployment**: Vercel

## Project Structure

```
.
├── app/
│   ├── [slug]/        # 글 상세 페이지 (동적 라우트)
│   ├── about/         # 소개 페이지
│   ├── api/upload/    # Vercel Blob 업로드 엔드포인트
│   ├── components/    # 공용 컴포넌트 (Header 등)
│   ├── lib/post.ts    # 마크다운 로딩 / 파싱 로직
│   ├── layout.tsx
│   └── page.tsx       # 글 목록 (홈)
├── blog/              # 마크다운 글 원본
└── public/
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Writing a Post

`blog/` 디렉터리에 `.md` 파일을 추가합니다. 파일명이 그대로 URL slug가 됩니다.

```markdown
---
title: '글 제목'
date: '2026-05-06'
category: 'FE'
summary: '목록에 노출될 한 줄 요약'
---

본문 내용...
```

## Scripts

| Command       | 설명                |
| ------------- | ------------------- |
| `pnpm dev`    | 개발 서버 실행      |
| `pnpm build`  | 프로덕션 빌드       |
| `pnpm start`  | 빌드 결과 서빙      |
| `pnpm lint`   | ESLint 검사         |
| `pnpm format` | Prettier 포매팅     |
