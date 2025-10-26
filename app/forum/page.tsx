// app/forum/page.tsx

import Link from 'next/link';

export const metadata = {
  title: "Forum | AIBRY",
  description: "Welcome to the AIBRY community forum. Share your story, find hope, or ask for support.",
};

// Reusable component for the forum board links
const ForumCard = ({ href, title, description }: { href: string, title: string, description: string }) => (
  <Link 
    href={href} 
    className="block rounded-lg bg-[#18181b] p-6 text-left shadow-lg transition duration-300 border border-gray-800 hover:border-[#629aa9] hover:bg-gray-800"
  >
    <h2 className="mb-2 text-2xl font-semibold text-white">{title}</h2>
    <p className="text-gray-400">{description}</p>
  </Link>
);

export default function ForumPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      
      <h1 className="mb-4 text-center text-4xl font-bold text-white">
        Community Forum
      </h1>
      <p className="mb-12 text-center text-lg text-gray-400">
        A safe space to connect, share, and support one another.
      </p>

      <div className="space-y-6">
        <ForumCard
          href="/forum/story"
          title="Share Your Story"
          description="A place to connect and share personal journeys with mental health and recovery."
        />
        <ForumCard
          href="/forum/hope"
          title="Finding Hope"
          description="Share positive moments, celebrate progress, and discuss coping mechanisms."
        />
        <ForumCard
          href="/forum/support"
          title="Ask for Support"
          description="A safe space to ask for advice or a listening ear. The community is here for you."
        />
      </div>

    </main>
  );
}