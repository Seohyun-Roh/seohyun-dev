import Link from 'next/link';

export default function About() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="inline-block mb-8 text-sm text-zinc-700 hover:text-zinc-900 transition-colors">
        ← 목록으로 돌아가기
      </Link>

      <article className="space-y-12">
        <section>
          <h1 className="text-4xl font-bold mb-6">About Me</h1>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              저는 3년 차 프론트엔드 엔지니어로, SvelteKit/TypeScript 기반의 여러 SaaS 제품을 설계하고 개발해왔습니다.
            </p>

            <p>
              에디터 커스터마이징, 가상화 기반 성능 개선, 접근성 최적화 등을 통해 사용자 경험을 개선해왔으며, 재사용
              가능한 컴포넌트와 디자인 시스템을 설계하며 유지 가능한 구조를 고민합니다.
            </p>

            <p>이 공간에는 제가 만들고, 실패하고, 개선하며 배운 것들을 정리합니다.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-zinc-900">Web</h3>
              <ul className="space-y-1 text-zinc-600 text-sm">
                <li>- React / Next.js</li>
                <li>- Svelte / SvelteKit</li>
                <li>- TypeScript, JavaScript(ES6+)</li>
                <li>- GraphQL, tRPC, REST API</li>
                <li>- Tailwind CSS, Panda CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-zinc-900">Mobile</h3>
              <ul className="space-y-1 text-zinc-600 text-sm">
                <li>- Flutter</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Development Workflow</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-zinc-900">AI / Productivity</h3>
              <ul className="space-y-1 text-zinc-600 text-sm">
                <li>- Claude Code</li>
                <li>- Cursor IDE</li>
                <li>- ChatGPT</li>
                <li>- CodeRabbit</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-zinc-900">Collaboration / Workflow</h3>
              <ul className="space-y-1 text-zinc-600 text-sm">
                <li>- Git / GitHub</li>
                <li>- Figma</li>
                <li>- Notion</li>
                <li>- Linear</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Experience</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-zinc-300 pl-4">
              <h3 className="text-lg font-semibold text-zinc-900">PENXLE COMPANY</h3>
              <h4 className="font-medium text-zinc-700">Product Engineer</h4>
              <p className="text-sm text-zinc-500">2023.08 - 2025.08 (2년 1개월)</p>
              <p className="text-zinc-700 mt-1">- 제품 기획부터 개발, 운영까지 전 과정을 End-to-End로 경험</p>
              <p className="text-zinc-700 mt-1">- 다수의 제품 피벗 및 MVP 출시 경험 보유</p>
              <p className="text-zinc-700 mt-1">- Tiptap 에디터 커스터마이징 및 대용량 데이터 성능 최적화 경험</p>
              <p className="text-zinc-700 mt-1">- 웹 접근성, SEO 개선으로 Lighthouse 전 항목 100점 달성</p>
              <p className="text-zinc-700 mt-1">- 디자인 시스템 구축 및 운영 경험</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <div className="space-y-3 flex gap-6">
            <a
              href="mailto:radult951@gmail.com"
              className="text-blue-600 hover:text-blue-800 transition-colors underline"
            >
              Email
            </a>
            <a
              href="https://github.com/Seohyun-Roh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/seohyun-roh/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors underline"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
