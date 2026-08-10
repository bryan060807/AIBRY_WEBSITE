import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, FolderOpen, Search, ShieldCheck, Wrench } from "lucide-react";
import {
  FORUM_TOPICS,
  listForumPosts,
  searchForum,
  type ForumPostSummary,
  type ForumSearchResult,
} from "@/lib/server/forum";
import { getCurrentServerUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Forum | AIBRY",
  description: "AIBRY community forum topics, threads, and support discussions.",
};

const forumAdminRoles = new Set(["admin", "operator"]);

const topicIcons = {
  story: MessageSquare,
  hope: FolderOpen,
  support: Wrench,
};

type TopicRow = {
  topic: (typeof FORUM_TOPICS)[number];
  posts: ForumPostSummary[];
  unavailable: boolean;
};

type ForumHomePageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function ForumHomePage({ searchParams }: ForumHomePageProps) {
  const rawSearchQuery = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const searchQuery = rawSearchQuery.slice(0, 120);
  const shouldSearch = searchQuery.length >= 2;

  const [{ user }, rows, searchState] = await Promise.all([
    getCurrentServerUser(),
    Promise.all(
      FORUM_TOPICS.map(async (topic) => {
        try {
          const posts = await listForumPosts(topic.slug);
          return { topic, posts, unavailable: false };
        } catch {
          return { topic, posts: [], unavailable: true };
        }
      })
    ),
    shouldSearch
      ? searchForum(searchQuery)
          .then((results) => ({ results, unavailable: false }))
          .catch(() => ({ results: [] as ForumSearchResult[], unavailable: true }))
      : Promise.resolve({ results: [] as ForumSearchResult[], unavailable: false }),
  ]);
  const canModerateForum = Boolean(user?.role && forumAdminRoles.has(user.role));
  const searchResults = searchState.results;

  const totalThreads = rows.reduce((count, row) => count + row.posts.length, 0);

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
              AIBRY Forum
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
              Topics and threads.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
              A simple community forum for AIBRY projects, music, support,
              updates, and general discussion.
            </p>

            {canModerateForum ? (
              <Link
                href="/forum/admin"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#83c0cc]/50 px-5 py-3 text-sm font-semibold text-[#83c0cc] transition hover:border-[#83c0cc] hover:bg-[#83c0cc]/10 hover:text-white"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Forum Admin
              </Link>
            ) : null}
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950/80 px-5 py-4 text-sm text-gray-400">
            <p className="font-semibold text-white">Forum Stats</p>
            <p className="mt-1">{FORUM_TOPICS.length} topics</p>
            <p>{totalThreads} threads</p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-950/70 p-4 md:p-5">
          <form action="/forum" className="flex flex-col gap-3 md:flex-row">
            <label className="sr-only" htmlFor="forum-search">
              Search forum
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input
                id="forum-search"
                name="q"
                type="search"
                minLength={2}
                maxLength={120}
                defaultValue={searchQuery}
                placeholder="Search threads and replies"
                className="w-full rounded-full border border-gray-800 bg-black px-11 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#83c0cc] focus:ring-2 focus:ring-[#83c0cc]/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-[#83c0cc] px-6 py-3 text-sm font-bold text-black transition hover:bg-white"
            >
              Search
            </button>
          </form>

          {searchQuery && searchQuery.length < 2 ? (
            <p className="mt-3 text-sm text-amber-300">Use at least 2 characters to search the forum.</p>
          ) : null}
        </div>

        {shouldSearch ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-800 bg-black/70">
            <div className="border-b border-gray-800 bg-gray-950 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Search Results
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {searchState.unavailable
                  ? "Forum search is unavailable right now."
                  : `${searchResults.length} result${searchResults.length === 1 ? "" : "s"} for “${searchQuery}”`}
              </p>
            </div>

            {searchState.unavailable ? null : searchResults.length ? (
              <div className="divide-y divide-gray-800">
                {searchResults.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.href}
                    className="block px-5 py-5 transition hover:bg-gray-950"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#83c0cc]">
                      <span>{result.type === "comment" ? "Reply" : "Thread"}</span>
                      <span className="text-gray-700">/</span>
                      <span>{result.topicTitle}</span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-white">{result.title}</h2>
                    {result.snippet ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">{result.snippet}</p>
                    ) : null}
                    <p className="mt-3 text-xs text-gray-500" suppressHydrationWarning>
                      {new Date(result.createdAt).toLocaleDateString()} by {result.author.displayName}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-5 py-8 text-sm text-gray-400">No matching public forum posts or replies yet.</p>
            )}
          </div>
        ) : null}
      </section>

      <section className="border-y border-gray-900 bg-gray-950/60 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black/70">
            <div className="hidden grid-cols-[1fr_120px_260px] border-b border-gray-800 bg-gray-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 md:grid">
              <span>Topic</span>
              <span className="text-center">Threads</span>
              <span>Latest</span>
            </div>

            <div className="divide-y divide-gray-800">
              {rows.map(({ topic, posts, unavailable }) => {
                const Icon = topicIcons[topic.slug];
                const latest = posts[0];

                return (
                  <Link
                    key={topic.slug}
                    href={`/forum/${topic.slug}`}
                    className="grid gap-4 px-5 py-5 transition hover:bg-gray-950 md:grid-cols-[1fr_120px_260px] md:items-center"
                  >
                    <div className="flex gap-4">
                      <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#83c0cc]/30 bg-[#83c0cc]/10 text-[#83c0cc]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{topic.title}</h2>
                        <p className="mt-1 leading-6 text-gray-400">{topic.description}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 md:text-center">
                      <span className="font-semibold text-white">
                        {unavailable ? "—" : posts.length}
                      </span>{" "}
                      threads
                    </div>

                    <div className="text-sm text-gray-400">
                      {unavailable ? (
                        <span>Forum service unavailable</span>
                      ) : latest ? (
                        <div>
                          <p className="truncate font-semibold text-gray-200">{latest.title}</p>
                          <p className="mt-1 text-xs text-gray-500" suppressHydrationWarning>
                            {new Date(latest.createdAt).toLocaleDateString()} by {latest.author.displayName}
                          </p>
                        </div>
                      ) : (
                        <span>No threads yet</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
