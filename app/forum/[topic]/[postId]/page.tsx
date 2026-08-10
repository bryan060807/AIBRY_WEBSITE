/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteForumCommentAction,
  updateForumCommentAction,
} from "@/actions/comment-actions";
import {
  deleteForumPostAction,
  updateForumPostAction,
} from "@/actions/forum-actions";
import { CommentForm } from "@/components/forms";
import LikeButton from "@/components/ui/LikeButton";
import {
  getForumThread,
  getForumTopic,
  type ForumComment,
  type ForumThread,
} from "@/lib/server/forum";
import { getCurrentProfile } from "@/lib/server/profile";
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

  const currentProfile = await getCurrentProfile().catch(() => null);
  const currentUserId = currentProfile?.id ?? null;
  const currentRole = currentProfile?.role?.toLowerCase() ?? "";
  const canViewAdminDetails = currentRole === "admin" || currentRole === "operator";
  const canManageThread = Boolean(currentUserId && currentUserId === thread.author.id);

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
          bio={thread.author.bio}
          websiteUrl={thread.author.websiteUrl}
          bandcamp={thread.author.bandcamp}
          adminUserId={canViewAdminDetails ? thread.author.id : null}
          createdAt={thread.createdAt}
        />
        <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-200">
          {thread.content}
        </p>
        {canManageThread ? <ThreadOwnerControls thread={thread} /> : null}
      </article>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">
          Replies ({thread.comments.length})
        </h2>

        <div className="mt-5 space-y-4">
          {thread.comments.length > 0 ? (
            thread.comments.map((comment) => {
              const canManageComment = Boolean(
                currentUserId && currentUserId === comment.author.id
              );

              return (
                <article
                  key={comment.id}
                  id={`comment-${comment.id}`}
                  className="scroll-mt-24 rounded-lg border border-gray-800 bg-gray-950 p-5"
                >
                  <ForumAuthorLine
                    displayName={comment.author.displayName}
                    username={comment.author.username}
                    avatarUrl={comment.author.avatarUrl}
                    bio={comment.author.bio}
                    websiteUrl={comment.author.websiteUrl}
                    bandcamp={comment.author.bandcamp}
                    adminUserId={canViewAdminDetails ? comment.author.id : null}
                    createdAt={comment.createdAt}
                    small
                  />
                  <p className="mt-4 whitespace-pre-wrap text-gray-300">{comment.content}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <LikeButton
                      commentId={comment.id}
                      postId={thread.id}
                      topic={thread.topic}
                      initialCount={comment.likeCount}
                      initialLiked={comment.likedByCurrentUser}
                    />
                  </div>
                  {canManageComment ? (
                    <CommentOwnerControls
                      comment={comment}
                      postId={thread.id}
                      topic={thread.topic}
                    />
                  ) : null}
                </article>
              );
            })
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

function ThreadOwnerControls({ thread }: { thread: ForumThread }) {
  return (
    <details className="mt-6 rounded-lg border border-gray-800 bg-black/30 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-[#83c0cc]">
        Edit or delete your thread
      </summary>
      <form
        action={updateForumPostAction.bind(null, thread.id, thread.topic)}
        className="mt-4 space-y-3"
      >
        <label className="block text-sm font-semibold text-gray-300" htmlFor="thread-title">
          Title
        </label>
        <input
          id="thread-title"
          name="title"
          defaultValue={thread.title}
          required
          maxLength={160}
          className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none transition focus:border-[#83c0cc]"
        />
        <label className="block text-sm font-semibold text-gray-300" htmlFor="thread-content">
          Post
        </label>
        <textarea
          id="thread-content"
          name="content"
          defaultValue={thread.content}
          required
          rows={6}
          maxLength={15000}
          className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none transition focus:border-[#83c0cc]"
        />
        <button
          type="submit"
          className="rounded-full bg-[#83c0cc] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#6eb5c0]"
        >
          Save thread
        </button>
      </form>
      <form action={deleteForumPostAction.bind(null, thread.id, thread.topic)} className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <p className="text-sm font-semibold text-red-100">Delete this thread?</p>
        <p className="mt-1 text-xs leading-5 text-red-200/70">
          This hides the thread and its replies from public forum views.
        </p>
        <label className="mt-3 flex items-start gap-2 text-xs text-red-100/90">
          <input type="checkbox" required className="mt-0.5" />
          <span>I understand this thread will be removed from public view.</span>
        </label>
        <button
          type="submit"
          className="mt-3 rounded-full border border-red-500/60 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
        >
          Delete thread
        </button>
      </form>
    </details>
  );
}

function CommentOwnerControls({
  comment,
  postId,
  topic,
}: {
  comment: ForumComment;
  postId: string;
  topic: string;
}) {
  return (
    <details className="mt-4 rounded-lg border border-gray-800 bg-black/30 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-[#83c0cc]">
        Edit or delete your reply
      </summary>
      <form
        action={updateForumCommentAction.bind(null, comment.id, topic, postId)}
        className="mt-4 space-y-3"
      >
        <label className="block text-sm font-semibold text-gray-300" htmlFor={`comment-${comment.id}-content`}>
          Reply
        </label>
        <textarea
          id={`comment-${comment.id}-content`}
          name="content"
          defaultValue={comment.content}
          required
          rows={4}
          maxLength={8000}
          className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none transition focus:border-[#83c0cc]"
        />
        <button
          type="submit"
          className="rounded-full bg-[#83c0cc] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#6eb5c0]"
        >
          Save reply
        </button>
      </form>
      <form action={deleteForumCommentAction.bind(null, comment.id, topic, postId)} className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <p className="text-sm font-semibold text-red-100">Delete this reply?</p>
        <p className="mt-1 text-xs leading-5 text-red-200/70">
          This removes the reply from public thread views.
        </p>
        <label className="mt-3 flex items-start gap-2 text-xs text-red-100/90">
          <input type="checkbox" required className="mt-0.5" />
          <span>I understand this reply will be removed from public view.</span>
        </label>
        <button
          type="submit"
          className="mt-3 rounded-full border border-red-500/60 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
        >
          Delete reply
        </button>
      </form>
    </details>
  );
}

function ForumAuthorLine({
  displayName,
  username,
  avatarUrl,
  bio,
  websiteUrl,
  bandcamp,
  adminUserId,
  createdAt,
  small = false,
}: {
  displayName: string;
  username: string | null;
  avatarUrl: string;
  bio: string;
  websiteUrl: string;
  bandcamp: string;
  adminUserId: string | null;
  createdAt: string;
  small?: boolean;
}) {
  const avatarSize = small ? 36 : 44;
  const hasLinks = Boolean(username || websiteUrl || bandcamp);

  return (
    <div className="mt-4 rounded-xl border border-gray-800 bg-black/30 p-4 text-sm text-gray-400">
      <div className="flex items-start gap-3">
        <img
          src={avatarUrl || DEFAULT_PROFILE_AVATAR_URL}
          alt={`${displayName} avatar`}
          width={avatarSize}
          height={avatarSize}
          className="rounded-full border border-gray-800 object-cover"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          {username ? (
            <Link href={`/u/${username}`} className="font-semibold text-gray-200 transition hover:text-[#83c0cc]">
              {displayName}
            </Link>
          ) : (
            <p className="font-semibold text-gray-200">{displayName}</p>
          )}
          {username ? <p className="mt-0.5 text-xs text-gray-500">@{username}</p> : null}
          <p className="mt-1 text-xs text-gray-500" suppressHydrationWarning>
            {new Date(createdAt).toLocaleString()}
          </p>
          {bio ? <p className="mt-3 line-clamp-3 leading-6 text-gray-300">{bio}</p> : null}
          {hasLinks ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              {username ? (
                <Link href={`/u/${username}`} className="rounded-full border border-[#83c0cc]/40 px-3 py-1 text-[#83c0cc] transition hover:bg-[#83c0cc]/10">
                  View profile
                </Link>
              ) : null}
              {websiteUrl ? (
                <a href={websiteUrl} target="_blank" rel="noreferrer" className="rounded-full border border-gray-700 px-3 py-1 text-gray-200 transition hover:border-[#83c0cc]/60">
                  Website
                </a>
              ) : null}
              {bandcamp ? (
                <a href={bandcamp} target="_blank" rel="noreferrer" className="rounded-full border border-gray-700 px-3 py-1 text-gray-200 transition hover:border-[#83c0cc]/60">
                  Bandcamp
                </a>
              ) : null}
              {adminUserId ? (
                <Link href={`/forum/admin?user=${adminUserId}`} className="rounded-full border border-purple-500/40 px-3 py-1 text-purple-200 transition hover:bg-purple-500/10">
                  Admin detail
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
