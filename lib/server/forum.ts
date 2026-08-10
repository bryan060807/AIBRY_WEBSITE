import "server-only";

import { cache } from "react";
import { normalizeAvatarUrl } from "@/lib/normalizeAvatarUrl";
import {
  getRequestCookieHeader,
  WebsiteApiError,
  websiteApiFetch,
} from "@/lib/server/websiteApi";

export const FORUM_TOPICS = [
  {
    slug: "story",
    title: "General Discussion",
    description:
      "General AIBRY community threads, introductions, ideas, and open conversation.",
    emptyMessage: "No general discussion threads yet. Start the first one.",
    cta: "View Threads",
  },
  {
    slug: "hope",
    title: "Projects & Updates",
    description:
      "Talk about AIBRY apps, music, releases, merch, site updates, and what is being built next.",
    emptyMessage: "No project or update threads yet. Start the first one.",
    cta: "View Threads",
  },
  {
    slug: "support",
    title: "Help & Support",
    description:
      "Ask questions, report issues, request help, or get support from the community.",
    emptyMessage: "No help or support threads yet. Start the first one.",
    cta: "View Threads",
  },
] as const;

export type ForumTopicSlug = (typeof FORUM_TOPICS)[number]["slug"];

export interface ForumAuthor {
  id: string | null;
  displayName: string;
  username: string | null;
  avatarUrl: string;
  bio: string;
  websiteUrl: string;
  bandcamp: string;
}

export interface ForumPostSummary {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  topic: ForumTopicSlug;
  author: ForumAuthor;
}

export interface ForumComment {
  id: string;
  content: string;
  createdAt: string;
  author: ForumAuthor;
  likeCount: number;
  likedByCurrentUser: boolean;
}

export interface ForumThread extends ForumPostSummary {
  comments: ForumComment[];
}

export interface ForumSearchResult {
  type: "post" | "comment";
  id: string;
  postId: string;
  commentId: string | null;
  topic: ForumTopicSlug;
  topicTitle: string;
  title: string;
  snippet: string;
  href: string;
  createdAt: string;
  updatedAt: string | null;
  author: Pick<ForumAuthor, "id" | "displayName" | "username" | "avatarUrl">;
}

export interface ForumAdminThread {
  id: string;
  topic: string;
  topicTitle: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  author: ForumAuthor;
  commentCount: number;
  hiddenAt: string | null;
  lockedAt: string | null;
  pinnedAt: string | null;
  deletedAt: string | null;
}

export function getForumTopic(slug: string) {
  return FORUM_TOPICS.find((topic) => topic.slug === slug);
}

export function assertForumTopic(slug: string): ForumTopicSlug {
  const topic = getForumTopic(slug);
  if (!topic) {
    throw new Error("INVALID_FORUM_TOPIC");
  }
  return topic.slug;
}

export async function listForumPosts(topicSlug: string): Promise<ForumPostSummary[]> {
  const topic = assertForumTopic(topicSlug);
  const payload = await websiteApiFetch<ForumListResponse>(
    `/api/forum/topics/${encodeURIComponent(topic)}/posts`,
    { cookieHeader: getRequestCookieHeader() }
  );

  return getArray(payload, "posts").map((post) => toPostSummary(post, topic));
}

export const getForumThread = cache(async function getForumThread(
  topicSlug: string,
  postId: string
): Promise<ForumThread | null> {
  const topic = assertForumTopic(topicSlug);
  try {
    const payload = await websiteApiFetch<ForumThreadResponse>(
      `/api/forum/posts/${encodeURIComponent(postId)}`,
      { cookieHeader: getRequestCookieHeader() }
    );
    const post = getObject(payload, "post") ?? getObject(payload, "thread") ?? payload;
    if (!post || typeof post !== "object") return null;

    const summary = toPostSummary(post as Record<string, unknown>, topic);
    if (summary.topic !== topic) return null;

    return {
      ...summary,
      comments: (
        getArray(payload, "comments").length
          ? getArray(payload, "comments")
          : getArray(post, "comments")
      ).map(toComment),
    };
  } catch (error) {
    if (error instanceof WebsiteApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
});

export async function createForumPost(input: {
  topic: string;
  title: string;
  content: string;
}) {
  const topic = assertForumTopic(input.topic);
  const payload = await websiteApiFetch<ForumThreadResponse>(
    `/api/forum/topics/${encodeURIComponent(topic)}/posts`,
    {
      method: "POST",
      cookieHeader: getRequestCookieHeader(),
      body: {
        title: input.title,
        body: input.content,
      },
    }
  );
  const post = getObject(payload, "post") ?? getObject(payload, "thread") ?? payload;
  const id = post && typeof post === "object" ? stringField(post.id) : null;
  const returnedTopic =
    post && typeof post === "object"
      ? knownTopicField(post.topic) ??
        knownTopicField(post.topic_id) ??
        knownTopicField(post.topicId) ??
        topic
      : topic;

  if (!id) {
    throw new Error("FORUM_POST_CREATE_FAILED");
  }

  return { id, topic: assertForumTopic(returnedTopic) };
}

export async function createForumComment(input: {
  postId: string;
  content: string;
}) {
  await websiteApiFetch<unknown>(
    `/api/forum/posts/${encodeURIComponent(input.postId)}/comments`,
    {
      method: "POST",
      cookieHeader: getRequestCookieHeader(),
      body: { body: input.content },
    }
  );
}

export async function updateForumPost(
  postId: string,
  input: { title: string; content: string }
) {
  await websiteApiFetch<unknown>(`/api/forum/posts/${encodeURIComponent(postId)}`, {
    method: "PATCH",
    cookieHeader: getRequestCookieHeader(),
    body: { title: input.title, body: input.content },
  });
}

export async function deleteForumPost(postId: string) {
  await websiteApiFetch<unknown>(`/api/forum/posts/${encodeURIComponent(postId)}`, {
    method: "DELETE",
    cookieHeader: getRequestCookieHeader(),
  });
}

export async function updateForumComment(
  commentId: string,
  input: { content: string }
) {
  await websiteApiFetch<unknown>(`/api/forum/comments/${encodeURIComponent(commentId)}`, {
    method: "PATCH",
    cookieHeader: getRequestCookieHeader(),
    body: { body: input.content },
  });
}

export async function deleteForumComment(commentId: string) {
  await websiteApiFetch<unknown>(`/api/forum/comments/${encodeURIComponent(commentId)}`, {
    method: "DELETE",
    cookieHeader: getRequestCookieHeader(),
  });
}

export async function toggleForumCommentLike(commentId: string, liked: boolean) {
  await websiteApiFetch<unknown>(
    `/api/forum/comments/${encodeURIComponent(commentId)}/like`,
    {
      method: liked ? "DELETE" : "POST",
      cookieHeader: getRequestCookieHeader(),
    }
  );
}

export async function searchForum(query: string): Promise<ForumSearchResult[]> {
  const q = query.trim().slice(0, 120);
  if (q.length < 2) return [];

  const payload = await websiteApiFetch<ForumSearchResponse>(
    `/api/forum/search?q=${encodeURIComponent(q)}&limit=20`,
    { cookieHeader: getRequestCookieHeader() }
  );

  return getArray(payload, "results")
    .map(toSearchResult)
    .filter((result): result is ForumSearchResult => Boolean(result));
}

export async function listForumAdminThreads(): Promise<ForumAdminThread[]> {
  const payload = await websiteApiFetch<ForumAdminListResponse>(
    "/api/forum/admin/threads",
    { cookieHeader: getRequestCookieHeader() }
  );

  return getArrayFromAny(payload, ["threads", "posts"]).map(toAdminThread);
}

export async function updateForumAdminThread(
  postId: string,
  input: { hidden?: boolean; locked?: boolean; pinned?: boolean }
) {
  await websiteApiFetch<unknown>(
    `/api/forum/admin/threads/${encodeURIComponent(postId)}`,
    {
      method: "PATCH",
      cookieHeader: getRequestCookieHeader(),
      body: input,
    }
  );
}

export async function deleteForumAdminThread(postId: string) {
  await websiteApiFetch<unknown>(
    `/api/forum/admin/threads/${encodeURIComponent(postId)}`,
    {
      method: "DELETE",
      cookieHeader: getRequestCookieHeader(),
    }
  );
}

export async function deleteForumAdminComment(commentId: string) {
  await websiteApiFetch<unknown>(
    `/api/forum/admin/comments/${encodeURIComponent(commentId)}`,
    {
      method: "DELETE",
      cookieHeader: getRequestCookieHeader(),
    }
  );
}

type ForumListResponse = { posts?: unknown[] } | unknown[] | null;
type ForumThreadResponse = Record<string, unknown> | null;
type ForumSearchResponse = { results?: unknown[] } | unknown[] | null;
type ForumAdminListResponse = { threads?: unknown[]; posts?: unknown[] } | unknown[] | null;

function toPostSummary(row: Record<string, unknown>, fallbackTopic?: ForumTopicSlug): ForumPostSummary {
  const topic =
    knownTopicField(row.topic) ||
    knownTopicField(row.topic_id) ||
    knownTopicField(row.topicId) ||
    fallbackTopic;

  if (!topic) {
    throw new Error("INVALID_FORUM_TOPIC");
  }

  return {
    id: stringField(row.id) ?? "",
    title: stringField(row.title) ?? "Untitled",
    content: stringField(row.content) || stringField(row.body) || "",
    createdAt:
      stringField(row.created_at) ||
      stringField(row.createdAt) ||
      new Date(0).toISOString(),
    topic,
    author: toAuthor(getAuthor(row)),
  };
}

function toComment(row: Record<string, unknown>): ForumComment {
  return {
    id: stringField(row.id) ?? "",
    content: stringField(row.content) || stringField(row.body) || "",
    createdAt:
      stringField(row.created_at) ||
      stringField(row.createdAt) ||
      new Date(0).toISOString(),
    author: toAuthor(getAuthor(row)),
    likeCount: numberField(row.like_count) ?? numberField(row.likeCount) ?? 0,
    likedByCurrentUser: Boolean(row.liked_by_current_user ?? row.likedByCurrentUser),
  };
}

function toSearchResult(row: Record<string, unknown>): ForumSearchResult | null {
  const topic = knownTopicField(row.topicSlug) || knownTopicField(row.topic_slug) || knownTopicField(row.topicId) || knownTopicField(row.topic_id);
  const postId = stringField(row.postId) || stringField(row.post_id);
  const type = stringField(row.type) === "comment" ? "comment" : "post";
  if (!topic || !postId) return null;

  const commentId = stringField(row.commentId) || stringField(row.comment_id);
  const fallbackHref = type === "comment" && commentId
    ? `/forum/${topic}/${postId}#comment-${commentId}`
    : `/forum/${topic}/${postId}`;

  return {
    type,
    id: stringField(row.id) || commentId || postId,
    postId,
    commentId,
    topic,
    topicTitle:
      stringField(row.topicTitle) ||
      stringField(row.topic_title) ||
      getForumTopic(topic)?.title ||
      topic,
    title: stringField(row.title) || "Untitled",
    snippet: stringField(row.snippet) || "",
    href: stringField(row.href) || fallbackHref,
    createdAt:
      stringField(row.createdAt) ||
      stringField(row.created_at) ||
      new Date(0).toISOString(),
    updatedAt: stringField(row.updatedAt) || stringField(row.updated_at),
    author: toAuthor(getAuthor(row)),
  };
}

function toAdminThread(row: Record<string, unknown>): ForumAdminThread {
  const id =
    stringField(row.id) ||
    stringField(row.postId) ||
    stringField(row.post_id) ||
    "";
  const topic =
    stringField(row.topic) ||
    stringField(row.topicSlug) ||
    stringField(row.topic_slug) ||
    stringField(row.topicId) ||
    stringField(row.topic_id) ||
    "unknown";

  return {
    id,
    topic,
    topicTitle:
      stringField(row.topicTitle) ||
      stringField(row.topic_title) ||
      getForumTopic(topic)?.title ||
      topic,
    title: stringField(row.title) || "Untitled",
    content: stringField(row.content) || stringField(row.body) || "",
    createdAt:
      stringField(row.createdAt) ||
      stringField(row.created_at) ||
      new Date(0).toISOString(),
    updatedAt: stringField(row.updatedAt) || stringField(row.updated_at),
    author: toAuthor(getAuthor(row)),
    commentCount: numberField(row.commentCount) ?? numberField(row.comment_count) ?? 0,
    hiddenAt: stringField(row.hiddenAt) || stringField(row.hidden_at),
    lockedAt: stringField(row.lockedAt) || stringField(row.locked_at),
    pinnedAt: stringField(row.pinnedAt) || stringField(row.pinned_at),
    deletedAt: stringField(row.deletedAt) || stringField(row.deleted_at),
  };
}

function getArray(payload: unknown, key: string): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (payload && typeof payload === "object") {
    const value = (payload as Record<string, unknown>)[key];
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
}

function getArrayFromAny(payload: unknown, keys: string[]): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (payload && typeof payload === "object") {
    for (const key of keys) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value.filter(isRecord);
    }
  }

  return [];
}

function getObject(payload: unknown, key: string) {
  if (payload && typeof payload === "object") {
    const value = (payload as Record<string, unknown>)[key];
    if (isRecord(value)) return value;
  }

  return null;
}

function getAuthor(row: Record<string, unknown>) {
  for (const key of ["author", "profile", "user", "profiles", "user_id"]) {
    const value = row[key];
    if (isRecord(value)) return value;
  }

  return row;
}

function toAuthor(profile?: Record<string, unknown> | null): ForumAuthor {
  return {
    id:
      stringField(profile?.id) ||
      stringField(profile?.userId) ||
      stringField(profile?.user_id) ||
      stringField(profile?.author_id) ||
      stringField(profile?.authorId),
    displayName:
      stringField(profile?.display_name) ||
      stringField(profile?.displayName) ||
      stringField(profile?.author_display_name) ||
      stringField(profile?.authorDisplayName) ||
      stringField(profile?.username) ||
      "Anonymous",
    username: stringField(profile?.username) || stringField(profile?.author_username),
    avatarUrl:
      normalizeAvatarUrl(
        stringField(profile?.avatar_url) ||
          stringField(profile?.avatarUrl) ||
          stringField(profile?.author_avatar_url) ||
          stringField(profile?.authorAvatarUrl)
      ) || "/images/default-avatar.png",
    bio:
      stringField(profile?.bio) ||
      stringField(profile?.author_bio) ||
      stringField(profile?.authorBio) ||
      "",
    websiteUrl:
      stringField(profile?.websiteUrl) ||
      stringField(profile?.website_url) ||
      stringField(profile?.author_website_url) ||
      stringField(profile?.authorWebsiteUrl) ||
      "",
    bandcamp:
      stringField(profile?.bandcamp) ||
      stringField(profile?.author_bandcamp) ||
      stringField(profile?.authorBandcamp) ||
      "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function stringField(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function numberField(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

function knownTopicField(value: unknown): ForumTopicSlug | null {
  if (typeof value !== "string") return null;
  const topic = getForumTopic(value);
  return topic?.slug ?? null;
}
