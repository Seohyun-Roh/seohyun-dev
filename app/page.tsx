import Link from 'next/link';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: '기술' | '회고';
}

const blogPosts: BlogPost[] = [
  {
    slug: 'nextjs-blog-setup',
    title: 'Next.js로 블로그 만들기',
    date: '2025-02-05',
    excerpt:
      'Next.js와 Tailwind CSS를 활용하여 미니멀한 블로그를 만드는 과정을 소개합니다.',
    category: '기술',
  },
  {
    slug: '2024-retrospective',
    title: '2024년 회고',
    date: '2025-01-15',
    excerpt: '지난 한 해 동안의 성장과 배움에 대해 정리해봅니다.',
    category: '회고',
  },
  {
    slug: 'react-hooks-guide',
    title: 'React Hooks 완벽 가이드',
    date: '2024-12-20',
    excerpt:
      'useState, useEffect부터 커스텀 Hook까지 React Hooks의 모든 것을 알아봅니다.',
    category: '기술',
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      {/* 헤더 섹션 */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-3">Seohyun's Log</h1>
        <p className="text-lg text-zinc-600">
          기술적인 성장과 개발 경험을 기록하는 공간입니다.
        </p>
      </section>

      {/* 글 목록 */}
      <section>
        <div className="space-y-8">
          {blogPosts.map(post => (
            <article
              key={post.slug}
              className="border-b border-zinc-200 pb-8 last:border-b-0"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold mb-2 hover:text-zinc-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <div className="flex items-center gap-4 mb-3 text-sm text-zinc-500">
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
              <p className="text-zinc-600 leading-relaxed">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
