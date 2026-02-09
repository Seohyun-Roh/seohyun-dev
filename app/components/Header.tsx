'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname() || '/';
  const isHome = pathname === '/';
  const isAbout = pathname === '/about';

  return (
    <header className="border-b border-zinc-200">
      <nav className="mx-auto max-w-2xl px-6 h-[62px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="text-lg font-semibold hover:text-zinc-700 transition-colors">
            Seohyun's Log
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className={
                isHome
                  ? 'text-sm text-zinc-900 font-semibold'
                  : 'text-sm text-zinc-600 hover:text-zinc-900 transition-colors'
              }
            >
              Home
            </Link>
            <Link
              href="/about"
              className={
                isAbout
                  ? 'text-sm text-zinc-900 font-semibold'
                  : 'text-sm text-zinc-600 hover:text-zinc-900 transition-colors'
              }
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
