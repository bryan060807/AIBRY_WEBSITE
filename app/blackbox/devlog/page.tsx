// app/blackbox/devlog/page.tsx
import Link from 'next/link';
import { getAllDevlogs } from '@/lib/devlog';

export const dynamic = 'force-static';

export default function DevlogIndexPage() {
  const devlogs = getAllDevlogs();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Emotional Black Box Devlog</h1>
        <p className="text-sm text-neutral-400">
          Behind the scenes of building the machine that turns chaos into cassette tapes.
        </p>
      </header>

      <div className="space-y-4">
        {devlogs.map((log) => (
          <article
            key={log.slug}
            className="border border-neutral-800 rounded-lg p-4 bg-black/40 hover:bg-black/60 transition"
          >
            <div className="flex items-center justify-between gap-4 mb-1">
              <h2 className="text-lg font-semibold">
                <Link href={`/blackbox/devlog/${log.slug}`}>
                  {log.title}
                </Link>
              </h2>
              <span className="text-xs text-neutral-500">
                {new Date(log.date).toLocaleDateString()}
              </span>
            </div>

            {log.tags && log.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {log.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase border border-neutral-700 rounded px-1 py-[1px] text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm text-neutral-300 line-clamp-3">
              {/* quick preview: first 180 chars */}
              {log.content.slice(0, 180)}
              {log.content.length > 180 ? '…' : ''}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
