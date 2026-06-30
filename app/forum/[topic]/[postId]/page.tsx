/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/forms";
import LikeButton from "@/components/ui/LikeButton";
import { getForumThread, getForumTopic } from "@/lib/server/forum";
import { DEFAULT_PROFILE_AVATAR_URL } from "@/lib/websiteProfile";

interface ForumThreadPageProps {
  params: {
    topic: string;
    postId: string;
  };
}

export async function generateMetadata({
  params,
}: ForumThreadPageProps): Promise<Metadata> {
  const thread = await getForumThread(params.topic, params.postId).catch(() => null);

  if (!thread) {
    return {
      title: "Forum Thread | AIBRY",
    };
  }

  return {
    title: `${thread.title} | AIBRY Forum`,
    description: thread.content.slice(0, 150),
  };
}

export default async function ForumThreadPage({ params }: ForumThreadPageProps) {
  const topic = getForumTopic(params.topic);
  let thread = null;

  try {
    thread = await getForumThread(params.topic, params.postId);
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-gray-100">
        <Link
          href={topic ? `/forum/${topic.slug}` : "/forum"}
          className="mb-8 inline-block text-gray-400 hover:text-white transition"
        >
          &larr; Back to Forum
        </Link>
        <p className="rounded-lg border border-gray-800 bg-gray-950 p-5 text-gray-400">
          The forum service is unavailable right now. Please try again soon.
        </p>
      </main>
    );
  }

  if (!topic || !thread) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-gray-100">
      <Link
        href={`/forum/${topic.slug}`}
        className="mb-8 inline-block text-gray-400 hover:text-white transition"
      >
        &larr; Back to {topic.title}
      </Link>

      <article className="rounded-lg border border-gray-800 bg-[#18181b] p-6">
        <p className="section-label mb-3">{topic.title}</p>
        <h1 className="text-4xl font-bold text-white">{thread.title}</h1>
        <ForumAuthorLine
          displayName={thread.author.displayName}
          username={thread.author.username}
          avatarUrl={thread.author.avatarUrl}
          createdAt={thread.createdAt}
        />
        <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-200">
          {thread.content}
        </p>
      </article>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">
          Replies ({thread.comments.length})
        </h2>

        <div className="mt-5 space-y-4">
          {thread.comments.length > 0 ? (
            thread.comments.map((comment) => (
              <article
                key={comment.id}
                id={`comment-${comment.id}`}
                className="scroll-mt-24 rounded-lg border border-gray-800 bg-gray-950 p-5"
              >
                <ForumAuthorLine
                  displayName={comment.author.displayName}
                  username={comment.author.username}
                  avatarUrl={comment.author.avatarUrl}
                  createdAt={comment.createdAt}
                  small
                />
                <p className="mt-4 whitespace-pre-wrap text-gray-300">{comment.content}</p>
                <div className="mt-4">
                  <LikeButton
                    commentId={comment.id}
                    postId={thread.id}
                    topic={thread.topic}
                    initialCount={comment.likeCount}
                    initialLiked={comment.likedByCurrentUser}
                  />
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-lg border border-gray-800 bg-gray-950 p-5 text-gray-500">
              No replies yet. Be the first to respond.
            </p>
          )}
        </div>
      </section>

      <CommentForm postId={thread.id} topic={thread.topic} />
    </main>
  );
}

function ForumAuthorLine({
  displayName,
  username,
  avatarUrl,
  createdAt,
  small = false,
}: {
  displayName: string;
  username: string | null;
  avatarUrl: string;
  createdAt: string;
  small?: boolean;
}) {
  const avatarSize = small ? 36 : 44;

  return (
    <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
      <img
        src={avatarUrl || DEFAULT_PROFILE_AVATAR_URL}
        alt={`${displayName} avatar`}
        width={avatarSize}
        height={avatarSize}
        className="rounded-full border border-gray-800 object-cover"
        loading="lazy"
      />
      <div>
        {username ? (
          <Link href={`/u/${username}`} className="font-semibold text-gray-200 transition hover:text-[#83c0cc]">
            {displayName}
          </Link>
        ) : (
          <p className="font-semibold text-gray-200">{displayName}</p>
        )}
        <p suppressHydrationWarning>{new Date(createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
