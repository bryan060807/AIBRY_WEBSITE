import { normalizeProfile, type WebsiteProfile } from "@/lib/websiteProfile";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateAvatarFile(file: File) {
  if (!ACCEPTED_AVATAR_TYPES.has(file.type)) {
    return "Use a JPG, PNG, or WebP image.";
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return "Avatar images must be 5 MB or smaller.";
  }

  return null;
}

export function previewAvatar(file: File) {
  return URL.createObjectURL(file);
}

export async function uploadAvatar(file: File): Promise<WebsiteProfile | null> {
  const error = validateAvatarFile(file);
  if (error) throw new Error(error);

  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch("/api/profile/avatar", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || "Avatar upload failed.");
  }

  return normalizeProfile(payload);
}

export async function removeAvatar(): Promise<WebsiteProfile | null> {
  const response = await fetch("/api/profile/avatar", {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || "Avatar removal failed.");
  }

  return normalizeProfile(payload);
}
