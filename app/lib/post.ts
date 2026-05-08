import fs from 'fs';
import matter from 'gray-matter';
import type { LanguageFn } from 'highlight.js';
import hljsSvelte from 'highlightjs-svelte';
import { common } from 'lowlight';
import path from 'path';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

let svelteSyntax: LanguageFn | undefined;
hljsSvelte({
  registerLanguage: (_name: string, syntax: LanguageFn) => {
    svelteSyntax = syntax;
  },
} as never);

const postsDir = path.join(process.cwd(), 'blog');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category?: string;
  summary?: string;
};

export async function getPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  const posts = files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(postsDir, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(raw);

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      category: data.category || '',
      summary: data.summary || '',
    } as PostMeta;
  });

  posts.sort((a, b) => {
    const da = new Date(a.date).getTime() || 0;
    const db = new Date(b.date).getTime() || 0;

    return db - da;
  });

  return posts;
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark()
    .use(gfm)
    .use(remarkRehype)
    .use(rehypeHighlight, {
      languages: { ...common, ...(svelteSyntax ? { svelte: svelteSyntax } : {}) },
    })
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    meta: {
      title: data.title || slug,
      date: data.date || '',
      category: data.category || '',
      summary: data.summary || '',
    },
    content: contentHtml,
  };
}
