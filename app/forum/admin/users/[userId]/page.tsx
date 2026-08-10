import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSiteAdminUserDetail,
  type SiteAdminUserActivityComment,
  type SiteAdminUserActivityPost,
  type SiteAdminUserDetail,
} from "@/lib/server/site-admin";
import { WebsiteApiError } from "@/lib/server/websiteApi";

export const metadata = {
  title: "User Detail | Forum Admin | AIBRY",
  description: "Review a user's forum activity.",
};

export default async function ForumAdminUserPage({
  params,
}: {
  params: { userId: string };
}) {
  let detail: SiteAdminUserDetail;

  try {
    const result = await getSiteAdminUserDetail(params.userId);
    if (!result) notFound();
    detail = result;
  } catch (error) {
    if (error instanceof WebsiteApiError && error.status === 404) {
      notFound();
    }

    if (error instanceof WebsiteApiError) {
      return <AdminUserError error={error} />;
    }

    throw error;
  }

  const { user, posts, comments } = detail;

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <Link
          href="/forum/admin"
          className="mb-8 inline-block text-sm font-semibold text-[#83c0cc] transition hover:text-white"
        >
          ← Back to Forum Admin
        </Link>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
          User Detail
        </p>
        <h1 className="text-4xl font-black text-white md:text-6xl">{user.displayName}</h1>

        <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm text-gray-400 sm:grid-cols-2 lg:grid-cols-3">
          <UserField label="Email" value={user.email} />
          <UserField label="Role" value={user.role} />
          <UserField label="Username" value={user.username ? `@${user.username}` : "Not set"} />
          <UserField label="Joined" value={formatDate(user.createdAt)} />
          <UserField
            label="Latest activity"
            value={user.latestActivityAt ? formatDate(user.latestActivityAt) : "No forum activity"}
          />
        </dl>
      </section>

      <section className="border-y border-gray-900 bg-gray-950/60 py-10">
        <div className="mx-auto max-w-7xl space-y-8 px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Threads" value={user.forumPostCount} detail="Forum threads created" />
            <MetricCard label="Replies" value={user.forumCommentCount} detail="Forum replies posted" />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ActivityPanel title="Recent Threads" description="The user's latest forum threads.">
              {posts.length ? (
                <div className="divide-y divide-gray-800">
                  {posts.map((post) => <ThreadItem key={post.id} post={post} />)}
                </div>
              ) : (
                <EmptyMessage>No recent threads found.</EmptyMessage>
              )}
            </ActivityPanel>

            <ActivityPanel title="Recent Replies" description="The user's latest forum replies.">
              {comments.length ? (
                <div className="divide-y divide-gray-800">
                  {comments.map((comment) => <ReplyItem key={comment.id} comment={comment} />)}
                </div>
              ) : (
                <EmptyMessage>No recent replies found.</EmptyMessage>
              )}
            </ActivityPanel>
          </div>
        </div>
      </section>
    </main>
  );
}

function UserField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">{label}</dt>
      <dd className="mt-1 text-gray-300" suppressHydrationWarning>{value}</dd>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm text-gray-400">{detail}</p>
    </div>
  );
}

function ActivityPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-black/70 p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ThreadItem({ post }: { post: SiteAdminUserActivityPost }) {
  return (
    <article className="py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/forum/${post.topicSlug}/${post.id}`}
          className="font-semibold text-white transition hover:text-[#83c0cc]"
        >
          {post.title}
        </Link>
        {post.pinnedAt ? <StatusBadge label="Pinned" tone="cyan" /> : null}
        {post.hiddenAt ? <StatusBadge label="Hidden" tone="amber" /> : null}
        {post.lockedAt ? <StatusBadge label="Locked" tone="purple" /> : null}
        {post.deletedAt ? <StatusBadge label="Deleted" tone="red" /> : null}
        {!post.pinnedAt && !post.hiddenAt && !post.lockedAt && !post.deletedAt ? (
          <StatusBadge label="Visible" tone="green" />
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
        {post.body || "No preview available."}
      </p>
      <p className="mt-2 text-xs text-gray-600" suppressHydrationWarning>
        {post.topicTitle} · {post.commentCount} replies · {formatDate(post.createdAt)}
      </p>
    </article>
  );
}

function ReplyItem({ comment }: { comment: SiteAdminUserActivityComment }) {
  return (
    <article className="py-4 first:pt-0 last:pb-0">
      <Link
        href={`/forum/${comment.topicSlug}/${comment.postId}#comment-${comment.id}`}
        className="font-semibold text-white transition hover:text-[#83c0cc]"
      >
        {comment.postTitle}
      </Link>
      <div className="mt-2 flex flex-wrap gap-2">
        {comment.hiddenAt ? <StatusBadge label="Hidden" tone="amber" /> : null}
        {comment.deletedAt ? <StatusBadge label="Deleted" tone="red" /> : null}
        {!comment.hiddenAt && !comment.deletedAt ? <StatusBadge label="Visible" tone="green" /> : null}
      </div>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
        {comment.body || "No preview available."}
      </p>
      <p className="mt-2 text-xs text-gray-600" suppressHydrationWarning>
        {comment.topicTitle} · {comment.likeCount} likes · {formatDate(comment.createdAt)}
      </p>
    </article>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "cyan" | "amber" | "purple" | "red";
}) {
  const tones = {
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    cyan: "border-[#83c0cc]/40 bg-[#83c0cc]/10 text-[#b6edf5]",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-200",
    red: "border-red-500/30 bg-red-500/10 text-red-200",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {label}
    </span>
  );
}

function EmptyMessage({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-500">
      {children}
    </div>
  );
}

function AdminUserError({ error }: { error: WebsiteApiError }) {
  const restricted = error.status === 401 || error.status === 403;

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <Link
          href="/forum/admin"
          className="mb-8 inline-block text-sm font-semibold text-[#83c0cc] transition hover:text-white"
        >
          ← Back to Forum Admin
        </Link>
        <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
          <h1 className="text-2xl font-bold text-white">
            {restricted ? "Restricted access" : "User detail unavailable"}
          </h1>
          <p className="mt-3 text-gray-400">
            {restricted
              ? "You need an admin or operator account to view this user."
              : error.message || "This user detail could not load right now."}
          </p>
        </div>
      </section>
    </main>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
