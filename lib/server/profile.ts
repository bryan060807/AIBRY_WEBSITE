import "server-only";

import {
  normalizeProfile,
  type ProfileResponse,
  type WebsiteProfile,
} from "@/lib/websiteProfile";
import {
  getRequestCookieHeader,
  websiteApiFetch,
} from "@/lib/server/websiteApi";

export interface PublicProfileTopicSummary {
  id: string;
  slug: string;
  title: string;
}

export interface PublicProfilePostActivity {
  id: string;
  title: string;
  excerpt: string;
  commentCount: number;
  topic: PublicProfileTopicSummary;
  href: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PublicProfileCommentActivity {
  id: string;
  postId: string;
  postTitle: string;
  excerpt: string;
  likeCount: number;
  topic: PublicProfileTopicSummary;
  href: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PublicProfileActivity {
  posts: PublicProfilePostActivity[];
  comments: PublicProfileCommentActivity[];
}

interface PublicProfileActivityResponse {
  activity?: {
    posts?: PublicProfilePostActivity[];
    comments?: PublicProfileCommentActivity[];
  };
}

function normalizeActivity(payload: PublicProfileActivityResponse): PublicProfileActivity {
  return {
    posts: Array.isArray(payload.activity?.posts) ? payload.activity.posts : [],
    comments: Array.isArray(payload.activity?.comments) ? payload.activity.comments : [],
  };
}

export async function getCurrentProfile() {
  const payload = await websiteApiFetch<ProfileResponse>("/api/v1/profile", {
    cookieHeader: getRequestCookieHeader(),
  });

  return normalizeProfile(payload);
}

export async function getPublicProfileByUsername(username: string) {
  const payload = await websiteApiFetch<ProfileResponse>(`/api/profile/public/${encodeURIComponent(username)}`);
  return normalizeProfile(payload);
}

export async function getPublicProfileActivityByUsername(username: string, limit = 5) {
  const safeLimit = Math.min(Math.max(Math.floor(Number(limit) || 5), 1), 12);
  const payload = await websiteApiFetch<PublicProfileActivityResponse>(
    `/api/profile/public/${encodeURIComponent(username)}/activity?limit=${safeLimit}`,
  );
  return normalizeActivity(payload);
}

export async function updateCurrentProfile(input: Partial<WebsiteProfile>) {
  const payload = await websiteApiFetch<ProfileResponse>("/api/v1/profile", {
    method: "PATCH",
    cookieHeader: getRequestCookieHeader(),
    body: {
      displayName: input.displayName,
      username: input.username,
      bio: input.bio,
      instagram: input.instagram,
      tiktok: input.tiktok,
      spotify: input.spotify,
      soundcloud: input.soundcloud,
      facebook: input.facebook,
      bandcamp: input.bandcamp,
      newsletterOptIn: input.newsletterOptIn,
    },
  });

  return normalizeProfile(payload);
}

export async function updateCurrentAvatar(file: File) {
  const payload = await websiteApiFetch<ProfileResponse>("/api/v1/profile/avatar", {
    method: "POST",
    cookieHeader: getRequestCookieHeader(),
    headers: {
      "content-type": file.type || "application/octet-stream",
      "x-file-name": file.name || "avatar-upload",
    },
    body: file,
  });

  return normalizeProfile(payload);
}

export async function deleteCurrentAvatar() {
  const payload = await websiteApiFetch<ProfileResponse>("/api/v1/profile/avatar", {
    method: "DELETE",
    cookieHeader: getRequestCookieHeader(),
  });

  return normalizeProfile(payload);
}
export { normalizeProfile, type WebsiteProfile };
