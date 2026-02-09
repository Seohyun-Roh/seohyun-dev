import Link from 'next/link';
import { getPosts } from './lib/post';

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-3">Seohyun's Log</h1>
        <p className="text-lg text-zinc-600">기술적인 성장과 개발 경험을 기록하는 공간입니다.</p>
      </section>

      <section>
        <div className="space-y-8">
          {posts.length === 0 && <p className="text-zinc-600">게시물이 없습니다.</p>}

          {posts.map(post => (
            <article key={post.slug} className="border-b border-zinc-200 pb-8 last:border-b-0">
              <Link href={`/${post.slug}`}>
                <h2 className="text-2xl font-semibold mb-2 hover:text-zinc-600 transition-colors">{post.title}</h2>
              </Link>
              <div className="flex items-center gap-4 mb-3 text-sm text-zinc-500">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded">{post.category}</span>
              </div>
              <p className="text-zinc-600 leading-relaxed">{post.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
