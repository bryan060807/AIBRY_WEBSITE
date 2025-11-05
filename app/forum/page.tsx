import Link from 'next/link';
import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Forum | AIBRY',
  description:
    'Welcome to the AIBRY community forum. Share your story, find hope, or ask for support.',
};

// Keep static until you wire up Supabase for dynamic posts
export const revalidate = 0;

interface ForumCardProps {
  href: string;
  title: string;
  description: string;
}

function ForumCard({ href, title, description }: ForumCardProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="block rounded-xl bg-[#18181b] p-6 text-left shadow-lg transition-all border border-gray-800 hover:border-[#629aa9] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
      aria-label={`Visit ${title} forum`}
    >
      <h2 className="mb-2 text-2xl font-semibold text-white">{title}</h2>
      <p className="text-gray-300">{description}</p>
    </Link>
  );
}

export default async function ForumPage() {
  // Placeholder for future Supabase integration
  // const supabase = createSupabaseServerClient();

  const boards = [
    {
      href: '/forum/story',
      title: 'Share Your Story',
      description:
        'A place to connect and share personal journeys with mental health and recovery.',
    },
    {
      href: '/forum/hope',
      title: 'Finding Hope',
      description:
        'Share positive moments, celebrate progress, and discuss coping mechanisms.',
    },
    {
      href: '/forum/support',
      title: 'Ask for Support',
      description:
        'A safe space to ask for advice or a listening ear. The community is here for you.',
    },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-gray-100">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Community Forum</h1>
        <p className="text-lg text-gray-300">
          A safe space to connect, share, and support one another.
        </p>
      </header>

      <section aria-labelledby="forum-categories" className="space-y-6">
        <h2 id="forum-categories" className="sr-only">
          Forum Categories
        </h2>

        {boards.map((board) => (
          <ForumCard key={board.href} {...board} />
        ))}
      </section>
    </main>
  );
}
