"use client";

import { useEffect, useState } from "react";

type ForumAdminPost = {
  id: string;
  topicId: string;
  title: string;
  body: string;
  createdAt: string;
  commentCount: number;
  hidden?: boolean;
  locked?: boolean;
  pinned?: boolean;
  author?: {
    displayName?: string;
    email?: string | null;
  };
};

function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === "string") return record.message;
  if (typeof record.error === "string") return record.error;
  if (record.error && typeof record.error === "object") {
    const message = (record.error as Record<string, unknown>).message;
    if (typeof message === "string") return message;
  }
  return fallback;
}

function getPosts(payload: unknown): ForumAdminPost[] {
  if (Array.isArray(payload)) return payload as ForumAdminPost[];
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.posts)) return record.posts as ForumAdminPost[];
  if (record.data && typeof record.data === "object") {
    const posts = (record.data as Record<string, unknown>).posts;
    if (Array.isArray(posts)) return posts as ForumAdminPost[];
  }
  return [];
}

export default function ForumAdminPanel() {
  const [posts, setPosts] = useState<ForumAdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/forum/admin/posts", {
        credentials: "include",
        cache: "no-store",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(getErrorMessage(payload, "Unable to load forum admin posts."));
      }
      setPosts(getPosts(payload));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load forum admin posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  async function updatePost(post: ForumAdminPost, changes: Partial<ForumAdminPost>) {
    setBusyId(post.id);
    setMessage("");
    try {
      const response = await fetch(`/api/forum/admin/posts/${encodeURIComponent(post.id)}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(getErrorMessage(payload, "Unable to update thread."));
      }
      await loadPosts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update thread.");
    } finally {
      setBusyId(null);
    }
  }

  async function deletePost(post: ForumAdminPost) {
    if (!window.confirm(`Delete thread: ${post.title}?`)) return;
    setBusyId(post.id);
    setMessage("");
    try {
      const response = await fetch(`/api/forum/admin/posts/${encodeURIComponent(post.id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(getErrorMessage(payload, "Unable to delete thread."));
      }
      await loadPosts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete thread.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-950/70 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#629aa9]">Forum Admin</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Threads</h2>
          <p className="mt-2 text-sm text-gray-400">
            Hide, lock, pin, or soft-delete forum threads.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadPosts()}
          disabled={loading}
          className="rounded-md border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-100 transition hover:border-[#629aa9] hover:text-[#629aa9]"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {message ? (
        <p className="mt-4 rounded-md border border-amber-700/50 bg-amber-950/30 p-3 text-sm text-amber-200">
          {message}
        </p>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-xl border border-gray-800">
        {loading ? (
          <p className="p-5 text-gray-400">Loading forum threads...</p>
        ) : posts.length ? (
          <div className="divide-y divide-gray-800">
            {posts.map((post) => (
              <article key={post.id} className="p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
                      {post.pinned ? <span className="text-[#83c0cc]">Pinned</span> : null}
                      {post.hidden ? <span className="text-amber-300">Hidden</span> : null}
                      {post.locked ? <span className="text-purple-300">Locked</span> : null}
                      <span className="text-gray-500">{post.topicId}</span>
                    </div>
                    <h3 className="mt-2 truncate text-lg font-semibold text-white">{post.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-400">
                      {post.body || "No preview available."}
                    </p>
                    <p className="mt-2 text-xs text-gray-500" suppressHydrationWarning>
                      {post.commentCount} replies · {new Date(post.createdAt).toLocaleString()} · {post.author?.displayName || post.author?.email || "Unknown author"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() => updatePost(post, { hidden: !post.hidden })}
                      className="rounded-md border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-100 transition hover:border-[#629aa9] hover:text-[#629aa9] disabled:opacity-50"
                    >
                      {post.hidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() => updatePost(post, { locked: !post.locked })}
                      className="rounded-md border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-100 transition hover:border-[#629aa9] hover:text-[#629aa9] disabled:opacity-50"
                    >
                      {post.locked ? "Unlock" : "Lock"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() => updatePost(post, { pinned: !post.pinned })}
                      className="rounded-md border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-100 transition hover:border-[#629aa9] hover:text-[#629aa9] disabled:opacity-50"
                    >
                      {post.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() => deletePost(post)}
                      className="rounded-md border border-red-800 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-500 hover:text-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-5 text-gray-400">No forum threads found.</p>
        )}
      </div>
    </section>
  );
}
