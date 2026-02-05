import Link from 'next/link';

export default function About() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="inline-block mb-8 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        ← 목록으로 돌아가기
      </Link>

      <article className="space-y-12">
        {/* 소개 */}
        <section>
          <h1 className="text-4xl font-bold mb-6">About Me</h1>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              안녕하세요! 저는 풀스택 웹 개발자이며, 기술적인 성장과 학습을 항상
              추구하고 있습니다.
            </p>
            <p>
              React, Next.js, TypeScript를 주로 사용하여 사용자 경험에 집중한 웹
              애플리케이션을 개발하고 있습니다.
            </p>
            <p>
              이 블로그는 제가 배운 것들을 정리하고, 다른 개발자들과 지식을
              나누기 위해 만들었습니다.
            </p>
          </div>
        </section>

        {/* 기술 스택 */}
        <section>
          <h2 className="text-2xl font-bold mb-4">기술 스택</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-zinc-900">Frontend</h3>
              <ul className="space-y-1 text-zinc-600 text-sm">
                <li>• React / Next.js</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• React Hooks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-zinc-900">Backend</h3>
              <ul className="space-y-1 text-zinc-600 text-sm">
                <li>• Node.js</li>
                <li>• Express</li>
                <li>• PostgreSQL</li>
                <li>• REST API</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 경력 */}
        <section>
          <h2 className="text-2xl font-bold mb-4">경력</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-zinc-300 pl-4">
              <h3 className="font-semibold text-zinc-900">Product Engineer</h3>
              <p className="text-sm text-zinc-500">2023.08 - 2025.08</p>
              <p className="text-zinc-600 mt-1">
                - 린 개발 환경에서 다수의 제품 피벗과 MVP 출시 경험 (글쓰기 SaaS
                타이피, 가이드 문서 SaaS 리더블 등)
              </p>
              <p className="text-zinc-600 mt-1">
                - 기획–개발–운영 전 과정 End-to-End 참여
              </p>
              <p className="text-zinc-600 mt-1">
                - Tiptap 기반 에디터 커스터마이징 및 안정성 개선
              </p>
              <p className="text-zinc-600 mt-1">
                - 대용량 데이터 렌더링 성능 최적화로 렌더링 부하 약 70~80% 감소
              </p>
              <p className="text-zinc-600 mt-1">
                - 웹 접근성, SEO 개선을 통해 Lighthouse 전 항목 100점 달성
              </p>
              <p className="text-zinc-600 mt-1">
                - 디자인 시스템 구축 및 운영으로 UI 일관성 및 개발 효율 향상
              </p>
              <p className="text-zinc-600 mt-1">
                - Flutter 기반 멀티플랫폼(iOS/Android) 앱 개발 경험
              </p>
              <p className="text-zinc-600 mt-1">
                - AI 기반 개발·코드 리뷰 환경을 활용한 개발 생산성 향상
              </p>
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-zinc-600">📧</span>
              <a
                href="mailto:radult951@gmail.com"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                radult951@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-600">🔗</span>
              <a
                href="https://github.com/Seohyun-Roh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                GitHub
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-600">💼</span>
              <a
                href="https://www.linkedin.com/in/%EC%84%9C%ED%98%84-%EB%85%B8-828a57211/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
