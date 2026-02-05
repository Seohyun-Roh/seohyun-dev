import Link from 'next/link';

interface BlogPostDetail {
  slug: string;
  title: string;
  date: string;
  category: string;
  content: string;
}

const blogPostsData: Record<string, BlogPostDetail> = {
  'nextjs-blog-setup': {
    slug: 'nextjs-blog-setup',
    title: 'Next.js로 블로그 만들기',
    date: '2025-02-05',
    category: '기술',
    content: `# Next.js로 블로그 만들기

Next.js는 현대적인 리액트 프레임워크로, 서버 사이드 렌더링과 정적 사이트 생성 기능을 제공합니다.

## 왜 Next.js를 선택했나?

- **성능**: 자동 코드 분할과 최적화
- **개발자 경험**: 직관적인 파일 기반 라우팅
- **확장성**: 다양한 배포 옵션 지원

## 블로그의 특징

이 블로그는 다음과 같은 특징을 가지고 있습니다:

1. **미니멀한 디자인** - Medium 스타일의 깔끔한 UI
2. **빠른 로딩** - 정적 컨텐츠 기반
3. **SEO 최적화** - Next.js의 Meta 태그 자동 지원

## 다음 단계

앞으로 다음 기능들을 추가할 예정입니다:
- 마크다운 파일 기반 글 작성
- 검색 기능
- 댓글 기능

블로그를 통해 배운 것들을 공유하고, 더 많은 개발자들과 소통할 수 있기를 기대합니다.`,
  },
  '2024-retrospective': {
    slug: '2024-retrospective',
    title: '2024년 회고',
    date: '2025-01-15',
    category: '회고',
    content: `# 2024년 회고

2024년은 많은 성장과 배움이 있었던 한 해였습니다.

## 주요 성과

### 기술 성장
이 해에 다양한 기술을 배우고 경험할 수 있었습니다.

- Next.js를 통한 풀스택 개발 경험
- TypeScript를 활용한 타입 안전성 확보
- React의 깊이 있는 이해

### 프로젝트 완성
여러 프로젝트를 완성할 수 있었고, 각각에서 많은 것을 배웠습니다.

## 어려웠던 점들

모든 것이 순탄하지만은 않았습니다. 몇 가지 어려운 시기가 있었지만, 이를 통해 더욱 성장할 수 있었습니다.

## 2025년의 목표

- 더 깊이 있는 기술 학습
- 오픈소스 프로젝트 기여
- 개발자 커뮤니티와의 소통

새로운 해에도 계속 성장해나갈 것을 기대합니다!`,
  },
  'react-hooks-guide': {
    slug: 'react-hooks-guide',
    title: 'React Hooks 완벽 가이드',
    date: '2024-12-20',
    category: '기술',
    content: `# React Hooks 완벽 가이드

React Hooks는 함수형 컴포넌트에서 상태와 다른 React 기능을 사용할 수 있게 해주는 기능입니다.

## 기본 Hooks

### useState
상태를 관리하는 가장 기본적인 Hook입니다.

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

### useEffect
부작용(side effects)을 처리하는 Hook입니다.

\`\`\`javascript
useEffect(() => {
  // 컴포넌트가 마운트된 후 또는 의존성이 변할 때 실행
}, [dependencies]);
\`\`\`

## 고급 Hooks

### useContext
Context API와 함께 전역 상태를 관리합니다.

### useReducer
복잡한 상태 로직을 관리할 때 사용합니다.

### Custom Hooks
로직을 재사용 가능한 Hook으로 만들 수 있습니다.

## 베스트 프랙티스

1. Hook은 항상 컴포넌트의 최상단에서 호출하세요
2. 의존성 배열을 올바르게 설정하세요
3. 필요에 따라 커스텀 Hook을 만드세요

Hooks를 잘 이해하고 사용하면 더 깔끔하고 유지보수하기 쉬운 React 코드를 작성할 수 있습니다.`,
  },
};

export default async function BlogPost({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPostsData[slug];

  if (!post) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">글을 찾을 수 없습니다</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      {/* 뒤로가기 버튼 */}
      <Link
        href="/"
        className="inline-block mb-8 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        ← 목록으로 돌아가기
      </Link>

      {/* 글 헤더 */}
      <article>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-zinc-500 border-b border-zinc-200 pb-4">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded">
              {post.category}
            </span>
          </div>
        </header>

        {/* 글 내용 */}
        <div className="prose prose-sm max-w-none space-y-4">
          {post.content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return (
                <h2 key={index} className="text-3xl font-bold mt-8 mb-4">
                  {line.replace('# ', '')}
                </h2>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h3 key={index} className="text-2xl font-bold mt-6 mb-3">
                  {line.replace('## ', '')}
                </h3>
              );
            }
            if (line.startsWith('```')) {
              return null;
            }
            if (line.startsWith('- ')) {
              return (
                <li key={index} className="ml-6 text-zinc-700 leading-relaxed">
                  {line.replace('- ', '')}
                </li>
              );
            }
            if (line.trim()) {
              return (
                <p key={index} className="text-zinc-700 leading-relaxed">
                  {line}
                </p>
              );
            }
            return null;
          })}
        </div>
      </article>

      {/* 구분선 */}
      <div className="border-t border-zinc-200 my-12" />

      {/* 푸터 */}
      <footer className="text-center">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          ← 목록으로 돌아가기
        </Link>
      </footer>
    </main>
  );
}
