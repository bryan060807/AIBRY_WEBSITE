import type { ReactNode } from "react";
import Link from "next/link";
import {
  setForumThreadHidden,
  setForumThreadLocked,
  setForumThreadPinned,
  softDeleteForumThread,
} from "@/actions/forum-admin-actions";
import { deleteContactMessage } from "@/actions/site-admin-actions";
import {
  listForumAdminThreads,
  type ForumAdminThread,
} from "@/lib/server/forum";
import {
  getSiteAdminUserDetail,
  listContactAdminMessages,
  listSiteAdminUsers,
  toDashboardError,
  type ContactAdminMessageSummary,
  type SiteAdminUser,
  type SiteAdminUserDetail,
} from "@/lib/server/site-admin";
import { WebsiteApiError } from "@/lib/server/websiteApi";

export const metadata = {
  title: "Forum Admin | AIBRY",
  description: "Forum moderation tools for AIBRY administrators.",
};

export default async function ForumAdminPage({
  searchParams,
}: {
  searchParams?: { user?: string };
}) {
  let threads: ForumAdminThread[] = [];
  let users: SiteAdminUser[] = [];
  let selectedUserDetail: SiteAdminUserDetail | null = null;
  let contactMessages: ContactAdminMessageSummary[] = [];
  let error: WebsiteApiError | null = null;
  let usersError: WebsiteApiError | null = null;
  let selectedUserError: WebsiteApiError | null = null;
  let contactError: WebsiteApiError | null = null;

  try {
    threads = await listForumAdminThreads();
  } catch (caught) {
    if (caught instanceof WebsiteApiError) {
      error = caught;
    } else {
      error = new WebsiteApiError("Forum admin tools are unavailable.", 500, "FORUM_ADMIN_UNAVAILABLE");
    }
  }

  const [usersResult, contactResult] = await Promise.allSettled([
    listSiteAdminUsers(50),
    listContactAdminMessages(8),
  ]);

  if (usersResult.status === "fulfilled") {
    users = usersResult.value;
  } else {
    usersError = toDashboardError(usersResult.reason, "User data is unavailable.");
  }

  if (searchParams?.user) {
    try {
      selectedUserDetail = await getSiteAdminUserDetail(searchParams.user);
    } catch (caught) {
      selectedUserError = toDashboardError(caught, "Selected user detail is unavailable.");
    }
  }

  if (contactResult.status === "fulfilled") {
    contactMessages = contactResult.value;
  } else {
    contactError = toDashboardError(contactResult.reason, "Contact submissions are unavailable.");
  }

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <Link
          href="/forum"
          className="mb-8 inline-block text-sm font-semibold text-[#83c0cc] transition hover:text-white"
        >
          ← Back to Forum
        </Link>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
              Site Operations
            </p>
            <h1 className="text-4xl font-black text-white md:text-6xl">Forum Admin</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
              Review moderation work, watch recent community activity, check new users,
              and keep an eye on contact submissions from the same website admin surface.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950/80 px-5 py-4 text-sm text-gray-400">
            <p className="font-semibold text-white">Admin View</p>
            <p className="mt-1">{threads.length} threads loaded</p>
            <p className="mt-1">{users.length} database users shown</p>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-900 bg-gray-950/60 py-10">
        <div className="mx-auto max-w-7xl space-y-8 px-6">
          <ForumAdminOverview threads={threads} users={users} contactMessages={contactMessages} />
          <ForumAdminDashboard
            users={users}
            usersError={usersError}
            contactMessages={contactMessages}
            contactError={contactError}
          />
          {selectedUserDetail || selectedUserError ? (
            <SelectedUserDetailPanel detail={selectedUserDetail} error={selectedUserError} />
          ) : null}
          {error ? <ForumAdminError error={error} /> : <ForumAdminTable threads={threads} />}
        </div>
      </section>
    </main>
  );
}

function ForumAdminOverview({
  threads,
  users,
  contactMessages,
}: {
  threads: ForumAdminThread[];
  users: SiteAdminUser[];
  contactMessages: ContactAdminMessageSummary[];
}) {
  const hiddenThreads = threads.filter((thread) => thread.hiddenAt && !thread.deletedAt).length;
  const lockedThreads = threads.filter((thread) => thread.lockedAt && !thread.deletedAt).length;
  const deletedThreads = threads.filter((thread) => thread.deletedAt).length;
  const replies = threads.reduce((total, thread) => total + thread.commentCount, 0);
  const openContacts = contactMessages.filter((message) => !message.handledAt && message.status !== "archived").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <MetricCard label="Threads" value={threads.length} detail={`${replies} replies tracked`} />
      <MetricCard label="Needs Review" value={hiddenThreads + lockedThreads} detail={`${hiddenThreads} hidden · ${lockedThreads} locked`} />
      <MetricCard label="Soft Deleted" value={deletedThreads} detail="Hidden from public forum views" />
      <MetricCard label="Users" value={users.length} detail="Database users loaded" />
      <MetricCard label="Open Contacts" value={openContacts} detail="Recent contact submissions" />
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

function ForumAdminDashboard({
  users,
  usersError,
  contactMessages,
  contactError,
}: {
  users: SiteAdminUser[];
  usersError: WebsiteApiError | null;
  contactMessages: ContactAdminMessageSummary[];
  contactError: WebsiteApiError | null;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <DashboardPanel title="Database Users" description="Live users from the Website database with forum participation counts.">
        {usersError ? (
          <InlineAdminError error={usersError} />
        ) : users.length ? (
          <div className="divide-y divide-gray-800">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/forum/admin?user=${user.id}`} className="font-semibold text-white transition hover:text-[#83c0cc]">
                    {user.displayName}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {user.username ? `@${user.username} · ` : ""}{user.role}
                  </p>
                  <p className="mt-1 text-xs text-gray-600" suppressHydrationWarning>
                    Joined {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm text-gray-400 sm:text-right">
                  <p>{user.forumPostCount} threads</p>
                  <p>{user.forumCommentCount} replies</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyPanelMessage>No users found.</EmptyPanelMessage>
        )}
      </DashboardPanel>

      <DashboardPanel title="Contact Submissions" description="Recent inbound messages without showing full message bodies.">
        {contactError ? (
          <InlineAdminError error={contactError} />
        ) : contactMessages.length ? (
          <div className="divide-y divide-gray-800">
            {contactMessages.map((message) => (
              <div key={message.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-white">{message.subject}</p>
                  <StatusBadge label={message.status} tone={message.handledAt ? "green" : "amber"} />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {message.name}{message.email ? ` · ${message.email}` : ""}
                </p>
                <p className="mt-1 text-xs text-gray-600" suppressHydrationWarning>
                  Received {new Date(message.createdAt).toLocaleString()}
                </p>
                <details className="mt-3 rounded-xl border border-gray-800 bg-gray-950/80 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[#83c0cc] transition hover:text-white">
                    View full message
                  </summary>
                  <div className="mt-4 whitespace-pre-wrap rounded-lg border border-gray-800 bg-black/70 p-4 text-sm leading-6 text-gray-300">
                    {message.message || "No message body available."}
                  </div>
                </details>
                <form action={deleteContactMessage.bind(null, message.id)} className="mt-3">
                  <button
                    type="submit"
                    className="rounded-full border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
                  >
                    Delete message
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <EmptyPanelMessage>No contact submissions found.</EmptyPanelMessage>
        )}
      </DashboardPanel>
    </div>
  );
}

function DashboardPanel({
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

function InlineAdminError({ error }: { error: WebsiteApiError }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
      {error.status === 401 || error.status === 403
        ? "Your account needs admin or operator access for this data."
        : error.status === 404
          ? "This admin data endpoint is not available yet."
          : error.message || "This dashboard data could not load."}
    </div>
  );
}

function EmptyPanelMessage({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-500">{children}</div>;
}

function SelectedUserDetailPanel({
  detail,
  error,
}: {
  detail: SiteAdminUserDetail | null;
  error: WebsiteApiError | null;
}) {
  if (error) {
    return (
      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 text-amber-100">
        <h2 className="text-2xl font-bold text-white">Selected user detail unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-amber-100/80">{error.message || "The selected user could not load."}</p>
      </section>
    );
  }

  if (!detail) return null;
  const { user } = detail;

  return (
    <section className="rounded-2xl border border-gray-800 bg-black/70 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#83c0cc]">Selected User</p>
          <h2 className="mt-2 text-3xl font-black text-white">{user.displayName}</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-400">
            {user.username ? <span>@{user.username}</span> : null}
            <span>{user.email}</span>
            <StatusBadge label={user.role} tone="cyan" />
          </div>
          <p className="mt-2 text-sm text-gray-500" suppressHydrationWarning>
            Joined {new Date(user.createdAt).toLocaleString()}
          </p>
          {user.latestActivityAt ? (
            <p className="mt-1 text-sm text-gray-500" suppressHydrationWarning>
              Latest activity {new Date(user.latestActivityAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 text-sm font-semibold">
          {user.username ? (
            <Link href={`/u/${user.username}`} className="rounded-full border border-[#83c0cc]/50 px-4 py-2 text-[#83c0cc] transition hover:bg-[#83c0cc]/10">
              Public profile
            </Link>
          ) : null}
          <Link href="/forum/admin" className="rounded-full border border-gray-700 px-4 py-2 text-gray-200 transition hover:border-[#83c0cc]/60">
            Clear selection
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <MetricCard label="User Threads" value={user.forumPostCount} detail="Non-deleted forum threads" />
        <MetricCard label="User Replies" value={user.forumCommentCount} detail="Non-deleted forum replies" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <AdminUserActivityList title="Recent Threads" empty="No threads found.">
          {detail.posts.map((post) => (
            <article key={post.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-white">{post.title}</h3>
                {post.pinnedAt ? <StatusBadge label="Pinned" tone="cyan" /> : null}
                {post.lockedAt ? <StatusBadge label="Locked" tone="purple" /> : null}
                {post.hiddenAt ? <StatusBadge label="Hidden" tone="amber" /> : null}
                {post.deletedAt ? <StatusBadge label="Deleted" tone="red" /> : null}
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">{post.body || "No preview available."}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>{post.topicTitle}</span>
                <span>{post.commentCount} replies</span>
                <span suppressHydrationWarning>{new Date(post.createdAt).toLocaleString()}</span>
                {post.topicSlug ? (
                  <Link href={`/forum/${post.topicSlug}/${post.id}`} className="font-semibold text-[#83c0cc] hover:text-white">
                    View thread
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </AdminUserActivityList>

        <AdminUserActivityList title="Recent Replies" empty="No replies found.">
          {detail.comments.map((comment) => (
            <article key={comment.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-white">Reply on {comment.postTitle}</h3>
                {comment.hiddenAt ? <StatusBadge label="Hidden" tone="amber" /> : null}
                {comment.deletedAt ? <StatusBadge label="Deleted" tone="red" /> : null}
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">{comment.body || "No preview available."}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>{comment.topicTitle}</span>
                <span>{comment.likeCount} likes</span>
                <span suppressHydrationWarning>{new Date(comment.createdAt).toLocaleString()}</span>
                {comment.topicSlug && comment.postId ? (
                  <Link href={`/forum/${comment.topicSlug}/${comment.postId}#comment-${comment.id}`} className="font-semibold text-[#83c0cc] hover:text-white">
                    View reply
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </AdminUserActivityList>
      </div>
    </section>
  );
}

function AdminUserActivityList({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  const hasItems = items.some(Boolean);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-5">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <div className="mt-4 divide-y divide-gray-800">
        {hasItems ? children : <EmptyPanelMessage>{empty}</EmptyPanelMessage>}
      </div>
    </div>
  );
}

function ForumAdminError({ error }: { error: WebsiteApiError }) {
  const restricted = error.status === 401 || error.status === 403;
  const missingEndpoint = error.status === 404;

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/70 p-6 text-gray-300">
      <h2 className="text-2xl font-bold text-white">
        {restricted
          ? "Restricted access"
          : missingEndpoint
            ? "Forum admin backend not available yet"
            : "Forum admin unavailable"}
      </h2>
      <p className="mt-3 max-w-3xl leading-7 text-gray-400">
        {restricted
          ? "You need an admin or operator account to use forum moderation tools."
          : missingEndpoint
            ? "The frontend page is ready, but the Fedora Website API moderation endpoints need the migration and service restart before this page can load data."
            : error.message || "The forum admin tools could not load right now."}
      </p>
    </div>
  );
}

function ForumAdminTable({ threads }: { threads: ForumAdminThread[] }) {
  if (!threads.length) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-black/70 p-8 text-center text-gray-400">
        No forum threads found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black/70">
      <div className="hidden grid-cols-[1fr_160px_140px_320px] border-b border-gray-800 bg-gray-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 lg:grid">
        <span>Thread</span>
        <span>Topic</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-gray-800">
        {threads.map((thread) => (
          <article
            key={thread.id}
            className="grid gap-5 px-5 py-5 lg:grid-cols-[1fr_160px_140px_320px] lg:items-start"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-white">{thread.title}</h2>
                {thread.pinnedAt ? <StatusBadge label="Pinned" tone="cyan" /> : null}
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                {thread.content || "No preview available."}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>By {thread.author.displayName}</span>
                <span suppressHydrationWarning>{new Date(thread.createdAt).toLocaleString()}</span>
                <span>{thread.commentCount} replies</span>
                <Link
                  href={`/forum/${thread.topic}/${thread.id}`}
                  className="font-semibold text-[#83c0cc] hover:text-white"
                >
                  View public thread
                </Link>
              </div>
            </div>

            <div className="text-sm text-gray-300">
              <p className="font-semibold text-white">{thread.topicTitle}</p>
              <p className="mt-1 text-xs text-gray-500">/{thread.topic}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {thread.hiddenAt ? <StatusBadge label="Hidden" tone="amber" /> : null}
              {thread.lockedAt ? <StatusBadge label="Locked" tone="purple" /> : null}
              {thread.deletedAt ? <StatusBadge label="Deleted" tone="red" /> : null}
              {!thread.hiddenAt && !thread.lockedAt && !thread.deletedAt ? (
                <StatusBadge label="Visible" tone="green" />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <AdminActionButton
                action={setForumThreadHidden.bind(null, thread.id, thread.topic, !thread.hiddenAt)}
                disabled={Boolean(thread.deletedAt)}
                label={thread.hiddenAt ? "Unhide" : "Hide"}
              />
              <AdminActionButton
                action={setForumThreadLocked.bind(null, thread.id, thread.topic, !thread.lockedAt)}
                disabled={Boolean(thread.deletedAt)}
                label={thread.lockedAt ? "Unlock" : "Lock"}
              />
              <AdminActionButton
                action={setForumThreadPinned.bind(null, thread.id, thread.topic, !thread.pinnedAt)}
                disabled={Boolean(thread.deletedAt)}
                label={thread.pinnedAt ? "Unpin" : "Pin"}
              />
              <AdminActionButton
                action={softDeleteForumThread.bind(null, thread.id, thread.topic)}
                disabled={Boolean(thread.deletedAt)}
                label={thread.deletedAt ? "Soft-deleted" : "Soft-delete thread"}
                danger
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: "green" | "cyan" | "amber" | "purple" | "red" }) {
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

function AdminActionButton({
  action,
  label,
  disabled = false,
  danger = false,
}: {
  action: () => Promise<void>;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        disabled={disabled}
        className={`rounded-full border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
          danger
            ? "border-red-500/40 text-red-200 hover:bg-red-500/10"
            : "border-gray-700 text-gray-200 hover:border-[#83c0cc]/70 hover:bg-[#83c0cc]/10"
        }`}
      >
        {label}
      </button>
    </form>
  );
}
