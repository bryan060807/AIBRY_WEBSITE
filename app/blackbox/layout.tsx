// app/blackbox/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function BlackboxLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
            Emotional Black Box
          </p>
          <p className="text-xs text-neutral-500">
            AIBRY // Experimental Emotion Engine
          </p>
        </div>

        <nav className="flex items-center gap-4 text-xs uppercase tracking-wide">
          <Link href="/blackbox" className="text-neutral-300 hover:text-white">
            Hub
          </Link>
          <Link href="/blackbox/devlog" className="text-neutral-300 hover:text-white">
            Devlog
          </Link>
          <Link href="/blackbox/podcast" className="text-neutral-500 hover:text-neutral-200">
            Podcast
          </Link>
          <Link
            href="/blackbox/lore"
            className="hidden sm:inline text-neutral-500 hover:text-neutral-200"
          >
            Lore
          </Link>
          <Link
            href="/blackbox/alpha"
            className="px-3 py-1 border border-neutral-600 rounded-full text-neutral-100 hover:bg-neutral-100 hover:text-black transition"
          >
            Alpha Access
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
