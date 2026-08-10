import Link from "next/link";
import { NewPostForm } from "@/components/forms";
import {
  getForumTopic,
  listForumPosts,
  type ForumPostSummary,
} from "@/lib/server/forum";

interface ForumTopicPageProps {
  topic: "story" | "hope" | "support";
}

export default async function ForumTopicPage({ topic }: ForumTopicPageProps) {
  const topicMeta = getForumTopic(topic);
  let posts: ForumPostSummary[] = [];
  let unavailable = false;

  try {
    posts = await listForumPosts(topic);
  } catch {
    unavailable = true;
    posts = [];
  }

  if (!topicMeta) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <Link
          href="/forum"
          className="mb-8 inline-block text-sm font-semibold text-gray-400 transition hover:text-white"
        >
          ← Back to Forum
        </Link>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
              Forum Topic
            </p>
            <h1 className="text-4xl font-black text-white md:text-5xl">
              {topicMeta.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-400">
              {topicMeta.description}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950/80 px-5 py-4 text-sm text-gray-400">
            <p className="font-semibold text-white">Topic Stats</p>
            <p className="mt-1">{unavailable ? "—" : posts.length} threads</p>
          </div>
        </div>

        <NewPostForm topic={topicMeta.slug} />
      </section>

      <section className="border-y border-gray-900 bg-gray-950/60 py-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black/70">
            <div className="hidden grid-cols-[1fr_190px] border-b border-gray-800 bg-gray-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 md:grid">
              <span>Threads</span>
              <span>Started</span>
            </div>

            {unavailable ? (
              <p className="p-6 text-center text-gray-400">
                The forum service is unavailable right now. Please try again soon.
              </p>
            ) : posts.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="grid gap-3 px-5 py-5 transition hover:bg-gray-950 md:grid-cols-[1fr_190px] md:items-center"
                  >
                    <div>
                      <h2 className="truncate text-xl font-semibold text-white">
                        <Link href={`/forum/${post.topic}/${post.id}`} className="transition hover:text-[#83c0cc]">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                        {post.content || "No preview available."}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        Started by{" "}
                        {post.author.username ? (
                          <Link href={`/u/${post.author.username}`} className="text-gray-300 transition hover:text-[#83c0cc]">
                            {post.author.displayName}
                          </Link>
                        ) : (
                          <span className="text-gray-300">{post.author.displayName}</span>
                        )}
                      </p>
                    </div>

                    <p className="text-sm text-gray-500" suppressHydrationWarning>
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="p-8 text-center text-gray-500">{topicMeta.emptyMessage}</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
