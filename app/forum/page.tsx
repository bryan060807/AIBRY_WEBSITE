import Link from 'next/link';

export const metadata = {
  title: "Community Forum | AIBRY",
  description: "A safe space for the AIBRY community to connect, share stories, and support each other.",
};

export default function ForumPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="mb-4 text-4xl font-bold text-white">AIBRY Community Forum</h1>
      <p className="mb-12 text-lg text-gray-400">
        Welcome to our safe space. This is a place to connect, share your stories, and find support. You are not alone.
      </p>

      <section className="space-y-8">
        {/* Forum Board 1: Share Your Story */}
        <Link href="/forum/story" className="block">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-left shadow-lg transition hover:border-[#629aa9] hover:bg-gray-800 cursor-pointer">
            <h2 className="text-2xl font-semibold text-white">Share Your Story</h2>
            <p className="mt-2 text-gray-400">
              Post about your personal journey with mental health and recovery. Your story could inspire someone else.
            </p>
          </div>
        </Link>

        {/* Forum Board 2: Finding Hope */}
        <Link href="/forum/hope" className="block">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-left shadow-lg transition hover:border-[#629aa9] hover:bg-gray-800 cursor-pointer">
            <h2 className="text-2xl font-semibold text-white">Finding Hope</h2>
            <p className="mt-2 text-gray-400">
              A space for sharing positive moments, celebrating progress, and discussing coping mechanisms.
            </p>
          </div>
        </Link>

        {/* Forum Board 3: Ask for Support */}
        <Link href="/forum/support" className="block">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-left shadow-lg transition hover:border-[#629aa9] hover:bg-gray-800 cursor-pointer">
            <h2 className="text-2xl font-semibold text-white">Ask for Support</h2>
            <p className="mt-2 text-gray-400">
              This is a safe space to ask for advice or a listening ear. The community is here for you.
            </p>
          </div>
        </Link>
      </section>
    </main>
  );
}