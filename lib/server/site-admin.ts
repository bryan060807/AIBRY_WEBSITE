import "server-only";

import {
  getRequestCookieHeader,
  WebsiteApiError,
  websiteApiFetch,
} from "@/lib/server/websiteApi";

export interface SiteAdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  displayName: string;
  username: string | null;
  forumPostCount: number;
  forumCommentCount: number;
  latestActivityAt: string | null;
}

export interface SiteAdminUserActivityPost {
  id: string;
  topicSlug: string;
  topicTitle: string;
  title: string;
  body: string;
  commentCount: number;
  hiddenAt: string | null;
  lockedAt: string | null;
  pinnedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface SiteAdminUserActivityComment {
  id: string;
  postId: string;
  postTitle: string;
  topicSlug: string;
  topicTitle: string;
  body: string;
  likeCount: number;
  hiddenAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface SiteAdminUserDetail {
  user: SiteAdminUser;
  posts: SiteAdminUserActivityPost[];
  comments: SiteAdminUserActivityComment[];
}

export interface ContactAdminMessageSummary {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  readAt: string | null;
  handledAt: string | null;
  repliedAt: string | null;
}

export async function listSiteAdminUsers(limit = 10): Promise<SiteAdminUser[]> {
  const payload = await websiteApiFetch<unknown>(`/api/forum/admin/users?limit=${encodeURIComponent(String(limit))}`, {
    cookieHeader: getRequestCookieHeader(),
  });

  return getArray(payload, "users").map(toAdminUser);
}

export async function getSiteAdminUserDetail(userId: string): Promise<SiteAdminUserDetail | null> {
  const payload = await websiteApiFetch<unknown>(`/api/forum/admin/users/${encodeURIComponent(userId)}`, {
    cookieHeader: getRequestCookieHeader(),
  });
  const detail = getObject(payload, "userDetail");
  if (!detail) return null;

  const userRecord = getObject(detail, "user");
  if (!userRecord) return null;

  return {
    user: {
      ...toAdminUser({
        ...userRecord,
        forumPostCount: detail.forumPostCount,
        forumCommentCount: detail.forumCommentCount,
        latestActivityAt: detail.latestActivityAt,
      }),
    },
    posts: getArray(detail, "posts").map(toAdminUserActivityPost),
    comments: getArray(detail, "comments").map(toAdminUserActivityComment),
  };
}

export async function listContactAdminMessages(limit = 10): Promise<ContactAdminMessageSummary[]> {
  const payload = await websiteApiFetch<unknown>("/api/contact-messages/admin", {
    cookieHeader: getRequestCookieHeader(),
  });

  return getArray(payload, "messages").slice(0, limit).map(toContactMessageSummary);
}

export async function deleteContactAdminMessage(messageId: string): Promise<void> {
  await websiteApiFetch<unknown>(`/api/contact-messages/admin/${encodeURIComponent(messageId)}`, {
    method: "DELETE",
    cookieHeader: getRequestCookieHeader(),
  });
}

export function toDashboardError(error: unknown, fallback: string) {
  if (error instanceof WebsiteApiError) return error;
  return new WebsiteApiError(fallback, 500, "SITE_ADMIN_DASHBOARD_UNAVAILABLE");
}

function toAdminUser(row: Record<string, unknown>): SiteAdminUser {
  const profile = isRecord(row.profile) ? row.profile : {};

  return {
    id: stringField(row.id) || "",
    email: stringField(row.email) || "",
    role: stringField(row.role) || "user",
    createdAt: stringField(row.createdAt) || stringField(row.created_at) || new Date(0).toISOString(),
    displayName:
      stringField(profile.displayName) ||
      stringField(profile.display_name) ||
      stringField(profile.username) ||
      stringField(row.email) ||
      "Unnamed user",
    username: stringField(profile.username),
    forumPostCount: numberField(row.forumPostCount) ?? numberField(row.forum_post_count) ?? 0,
    forumCommentCount: numberField(row.forumCommentCount) ?? numberField(row.forum_comment_count) ?? 0,
    latestActivityAt: stringField(row.latestActivityAt) || stringField(row.latest_activity_at),
  };
}

function toContactMessageSummary(row: Record<string, unknown>): ContactAdminMessageSummary {
  return {
    id: stringField(row.id) || "",
    name: stringField(row.name) || "Unknown sender",
    email: stringField(row.email) || "",
    subject: stringField(row.subject) || "No subject",
    message: stringField(row.message) || "",
    status: stringField(row.status) || "new",
    createdAt: stringField(row.createdAt) || stringField(row.created_at) || new Date(0).toISOString(),
    readAt: stringField(row.readAt) || stringField(row.read_at),
    handledAt: stringField(row.handledAt) || stringField(row.handled_at),
    repliedAt: stringField(row.repliedAt) || stringField(row.replied_at),
  };
}

function toAdminUserActivityPost(row: Record<string, unknown>): SiteAdminUserActivityPost {
  return {
    id: stringField(row.id) || "",
    topicSlug: stringField(row.topicSlug) || stringField(row.topic_slug) || "",
    topicTitle: stringField(row.topicTitle) || stringField(row.topic_title) || "Forum",
    title: stringField(row.title) || "Untitled",
    body: stringField(row.body) || "",
    commentCount: numberField(row.commentCount) ?? numberField(row.comment_count) ?? 0,
    hiddenAt: stringField(row.hiddenAt) || stringField(row.hidden_at),
    lockedAt: stringField(row.lockedAt) || stringField(row.locked_at),
    pinnedAt: stringField(row.pinnedAt) || stringField(row.pinned_at),
    deletedAt: stringField(row.deletedAt) || stringField(row.deleted_at),
    createdAt: stringField(row.createdAt) || stringField(row.created_at) || new Date(0).toISOString(),
    updatedAt: stringField(row.updatedAt) || stringField(row.updated_at),
  };
}

function toAdminUserActivityComment(row: Record<string, unknown>): SiteAdminUserActivityComment {
  return {
    id: stringField(row.id) || "",
    postId: stringField(row.postId) || stringField(row.post_id) || "",
    postTitle: stringField(row.postTitle) || stringField(row.post_title) || "Untitled thread",
    topicSlug: stringField(row.topicSlug) || stringField(row.topic_slug) || "",
    topicTitle: stringField(row.topicTitle) || stringField(row.topic_title) || "Forum",
    body: stringField(row.body) || "",
    likeCount: numberField(row.likeCount) ?? numberField(row.like_count) ?? 0,
    hiddenAt: stringField(row.hiddenAt) || stringField(row.hidden_at),
    deletedAt: stringField(row.deletedAt) || stringField(row.deleted_at),
    createdAt: stringField(row.createdAt) || stringField(row.created_at) || new Date(0).toISOString(),
    updatedAt: stringField(row.updatedAt) || stringField(row.updated_at),
  };
}

function getArray(payload: unknown, key: string): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (isRecord(payload)) {
    const value = payload[key];
    if (Array.isArray(value)) return value.filter(isRecord);
  }
  return [];
}

function getObject(payload: unknown, key: string): Record<string, unknown> | null {
  if (!isRecord(payload)) return null;
  const value = payload[key];
  return isRecord(value) ? value : null;
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
