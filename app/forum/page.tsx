import Link from "next/link";

export const metadata = {
  title: "Community Forum | AIBRY",
  description:
    "Connect, share, and support one another in the AIBRY community forum.",
};

function ForumCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`Visit ${title} forum`}
      className="block rounded-xl bg-gray-900 p-6 text-left shadow-md border border-gray-800 hover:border-blue-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
    >
      <h2 className="mb-2 text-2xl font-semibold text-white">{title}</h2>
      <p className="text-gray-400">{description}</p>
    </Link>
  );
}

export default function ForumPage() {
  const categories = [
    {
      href: "/forum/story",
      title: "Share Your Story",
      description:
        "Connect with others through shared experiences in mental health and recovery.",
    },
    {
      href: "/forum/hope",
      title: "Finding Hope",
      description:
        "Celebrate progress, exchange coping strategies, and inspire resilience.",
    },
    {
      href: "/forum/support",
      title: "Ask for Support",
      description:
        "A space for questions, advice, and listening ears. You’re not alone.",
    },
  ];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-gray-100">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Community Forum</h1>
        <p className="text-lg text-gray-300">
          A safe place to connect, share, and support one another.
        </p>
      </header>

      <nav aria-label="Forum categories" className="space-y-6">
        {categories.map((cat) => (
          <ForumCard key={cat.href} {...cat} />
        ))}
      </nav>

      <div className="mt-10 text-center">
        <Link
          href="/forum/new"
          className="inline-block bg-blue-600 px-5 py-3 rounded-lg text-white font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Start a Discussion
        </Link>
      </div>
    </main>
  );
}
