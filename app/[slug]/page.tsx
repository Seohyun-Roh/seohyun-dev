import Link from 'next/link';
import { getPostBySlug } from '../lib/post';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

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

  const { meta, content } = post;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="inline-block mb-8 text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
        ← 목록으로 돌아가기
      </Link>

      <article>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{meta.title}</h1>
          <div className="flex items-center gap-4 text-sm text-zinc-500 border-b border-zinc-200 pb-4">
            <time dateTime={meta.date}>
              {new Date(meta.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded">{meta.category}</span>
          </div>
        </header>

        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      <div className="border-t border-zinc-200 my-12" />

      <footer className="text-center">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
          ← 목록으로 돌아가기
        </Link>
      </footer>
    </main>
  );
}
