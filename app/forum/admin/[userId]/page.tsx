import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteAdminUserDetail } from "@/lib/server/site-admin";
import { WebsiteApiError } from "@/lib/server/websiteApi";

export default async function ForumAdminUserPage({
  params,
}: {
  params: { userId: string };
}) {
  let detail;

  try {
    detail = await getSiteAdminUserDetail(params.userId);
  } catch (error) {
    if (error instanceof WebsiteApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  if (!detail) {
    notFound();
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

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <UserField label="Email" value={user.email} />
          <UserField label="Role" value={user.role} />
          <UserField label="Username" value={user.username ? `@${user.username}` : "Not set"} />
          <UserField label="Forum posts" value={String(user.forumPostCount)} />
          <UserField label="Forum comments" value={String(user.forumCommentCount)} />
          <UserField
            label="Latest activity"
            value={user.latestActivityAt ? formatDate(user.latestActivityAt) : "No forum activity"}
          />
        </dl>
      </section>

      <section className="border-y border-gray-900 bg-gray-950/60 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
          <ActivityList title="Recent posts" emptyMessage="No recent posts.">
            {posts.map((post) => (
              <li key={post.id} className="border-b border-gray-800 py-4 last:border-0">
                <Link
                  href={`/forum/${post.topicSlug}/${post.id}`}
                  className="font-semibold text-white transition hover:text-[#83c0cc]"
                >
                  {post.title}
                </Link>
                <p className="mt-2 text-sm text-gray-500">
                  {post.topicTitle} · {formatDate(post.createdAt)}
                </p>
              </li>
            ))}
          </ActivityList>

          <ActivityList title="Recent comments" emptyMessage="No recent comments.">
            {comments.map((comment) => (
              <li key={comment.id} className="border-b border-gray-800 py-4 last:border-0">
                <Link
                  href={`/forum/${comment.topicSlug}/${comment.postId}#comment-${comment.id}`}
                  className="font-semibold text-white transition hover:text-[#83c0cc]"
                >
                  {comment.postTitle}
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-gray-400">{comment.body}</p>
                <p className="mt-2 text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
              </li>
            ))}
          </ActivityList>
        </div>
      </section>
    </main>
  );
}

function UserField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">{label}</dt>
      <dd className="mt-2 text-gray-300">{value}</dd>
    </div>
  );
}

function ActivityList({
  title,
  emptyMessage,
  children,
}: {
  title: string;
  emptyMessage: string;
  children: React.ReactNode[];
}) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-black/70 p-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {children.length ? (
        <ul className="mt-4">{children}</ul>
      ) : (
        <p className="mt-4 text-sm text-gray-500">{emptyMessage}</p>
      )}
    </section>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
