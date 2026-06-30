/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  getPublicProfileActivityByUsername,
  getPublicProfileByUsername,
  type PublicProfileCommentActivity,
  type PublicProfilePostActivity,
} from "@/lib/server/profile";
import { DEFAULT_PROFILE_AVATAR_URL } from "@/lib/websiteProfile";

interface PublicProfilePageProps {
  params: { username: string };
}

function formatActivityDate(value: string | null) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function safeExternalHref(value: string) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  return `https://${text}`;
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const profile = await getPublicProfileByUsername(params.username).catch(() => null);

  if (!profile) {
    return {
      title: "Profile not found | AIBRY",
      description: "This AIBRY profile could not be found.",
    };
  }

  return {
    title: `${profile.displayName || profile.username || params.username} | AIBRY`,
    description: profile.bio || `View ${profile.displayName || profile.username || params.username}'s public AIBRY profile.`,
  };
}

export default async function PublicProfile({ params }: PublicProfilePageProps) {
  const [profile, activity] = await Promise.all([
    getPublicProfileByUsername(params.username).catch(() => null),
    getPublicProfileActivityByUsername(params.username, 5).catch(() => ({ posts: [], comments: [] })),
  ]);

  if (!profile || !profile.username) {
    notFound();
  }

  const links = [
    profile.websiteUrl ? { label: "Website", href: safeExternalHref(profile.websiteUrl) } : null,
    profile.instagram ? { label: "Instagram", href: safeExternalHref(profile.instagram) } : null,
    profile.tiktok ? { label: "TikTok", href: safeExternalHref(profile.tiktok) } : null,
    profile.spotify ? { label: "Spotify", href: safeExternalHref(profile.spotify) } : null,
    profile.soundcloud ? { label: "SoundCloud", href: safeExternalHref(profile.soundcloud) } : null,
    profile.bandcamp ? { label: "Bandcamp", href: safeExternalHref(profile.bandcamp) } : null,
    profile.facebook ? { label: "Facebook", href: safeExternalHref(profile.facebook) } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  const hasActivity = activity.posts.length > 0 || activity.comments.length > 0;
  const profileStats = [
    { label: "Threads", value: activity.posts.length },
    { label: "Replies", value: activity.comments.length },
    { label: "Links", value: links.length },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-gray-100">
      <section className="mx-auto max-w-5xl">
        <Link href="/forum" className="mb-8 inline-block text-sm font-semibold text-gray-400 transition hover:text-white">
          ← Back to Forum
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-950/70 shadow-2xl shadow-black/30">
            <div className="h-28 bg-[radial-gradient(circle_at_top_left,_rgba(131,192,204,0.32),_transparent_24rem),linear-gradient(135deg,_rgba(98,154,169,0.24),_rgba(0,0,0,0.1))]" />
            <div className="p-8 pt-0">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end lg:flex-col lg:items-start">
                <img
                  src={profile.avatarUrl || DEFAULT_PROFILE_AVATAR_URL}
                  alt={`${profile.displayName || profile.username} avatar`}
                  width={128}
                  height={128}
                  className="-mt-16 h-32 w-32 rounded-full border-4 border-gray-950 bg-black object-cover shadow-xl shadow-black/40"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#83c0cc]">AIBRY Profile</p>
                  <h1 className="mt-3 break-words text-4xl font-black text-white">{profile.displayName || profile.username}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                    <span className="rounded-full border border-gray-800 bg-black/40 px-3 py-1">@{profile.username}</span>
                    {profile.location ? <span className="rounded-full border border-gray-800 bg-black/40 px-3 py-1">{profile.location}</span> : null}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {profileStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-gray-800 bg-black/40 p-4 text-center">
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {profile.bio ? (
                <p className="mt-8 whitespace-pre-wrap rounded-2xl border border-gray-800 bg-black/30 p-5 text-lg leading-8 text-gray-300">{profile.bio}</p>
              ) : (
                <p className="mt-8 rounded-2xl border border-gray-800 bg-black/40 p-5 text-gray-500">
                  This user has not added a bio yet.
                </p>
              )}

              {links.length ? (
                <div className="mt-8">
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Public links</h2>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:border-[#83c0cc]/70 hover:bg-[#83c0cc]/10"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-800 bg-gray-950/70 p-6 shadow-2xl shadow-black/30">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#83c0cc]">Forum Activity</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Recent activity</h2>
                </div>
                <Link href="/forum" className="text-sm font-semibold text-gray-400 transition hover:text-white">
                  Browse forum →
                </Link>
              </div>

              {!hasActivity ? (
                <p className="mt-6 rounded-2xl border border-gray-800 bg-black/40 p-5 text-gray-500">
                  This user has not posted public forum activity yet.
                </p>
              ) : null}

              {activity.posts.length ? (
                <ActivitySection title="Recent Threads">
                  {activity.posts.map((post) => (
                    <ThreadActivityCard key={post.id} post={post} />
                  ))}
                </ActivitySection>
              ) : null}

              {activity.comments.length ? (
                <ActivitySection title="Recent Replies">
                  {activity.comments.map((comment) => (
                    <ReplyActivityCard key={comment.id} comment={comment} />
                  ))}
                </ActivitySection>
              ) : null}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function ActivitySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-gray-500">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function ThreadActivityCard({ post }: { post: PublicProfilePostActivity }) {
  return (
    <Link
      href={post.href || "/forum"}
      className="block rounded-2xl border border-gray-800 bg-black/40 p-5 transition hover:border-[#83c0cc]/50 hover:bg-[#83c0cc]/5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            {post.topic.title || "Forum"} · {formatActivityDate(post.createdAt)}
          </p>
          <h4 className="mt-2 text-lg font-black text-white">{post.title}</h4>
        </div>
        <span className="rounded-full border border-gray-800 px-3 py-1 text-xs font-semibold text-gray-400">
          {post.commentCount} {post.commentCount === 1 ? "reply" : "replies"}
        </span>
      </div>
      {post.excerpt ? <p className="mt-3 text-sm leading-6 text-gray-400">{post.excerpt}</p> : null}
    </Link>
  );
}

function ReplyActivityCard({ comment }: { comment: PublicProfileCommentActivity }) {
  return (
    <Link
      href={comment.href || "/forum"}
      className="block rounded-2xl border border-gray-800 bg-black/40 p-5 transition hover:border-[#83c0cc]/50 hover:bg-[#83c0cc]/5"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        Reply in {comment.topic.title || "Forum"} · {formatActivityDate(comment.createdAt)}
      </p>
      <h4 className="mt-2 text-lg font-black text-white">{comment.postTitle}</h4>
      {comment.excerpt ? <p className="mt-3 text-sm leading-6 text-gray-400">{comment.excerpt}</p> : null}
      <p className="mt-3 text-xs font-semibold text-gray-500">
        {comment.likeCount} {comment.likeCount === 1 ? "like" : "likes"}
      </p>
    </Link>
  );
}
