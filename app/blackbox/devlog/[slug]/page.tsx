// app/blackbox/devlog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getAllDevlogSlugs, getDevlogBySlug } from '@/lib/devlog';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = getAllDevlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamic = 'force-static';

export default function DevlogEntryPage({ params }: Props) {
  const devlog = getDevlogBySlug(params.slug);

  if (!devlog) {
    notFound();
  }

  const date = new Date(devlog.date);

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
          Devlog
        </p>
        <h1 className="text-3xl font-bold">{devlog.title}</h1>
        <p className="text-xs text-neutral-500">
          {date.toLocaleDateString()} · {devlog.tags?.join(' · ')}
        </p>
      </header>

      <div className="prose prose-invert max-w-none prose-sm">
        <ReactMarkdown>{devlog.content}</ReactMarkdown>
      </div>
    </article>
  );
}
