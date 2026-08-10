/**
 * Normalize and sanitize avatar URLs returned by the Fedora website backend.
 */
export function normalizeAvatarUrl(url?: string | null): string | null {
  if (!url) return null;

  const cleanUrl = url.trim();

  if (cleanUrl.startsWith("https://") || cleanUrl.startsWith("http://")) {
    return cleanUrl;
  }

  if (cleanUrl.startsWith("avatars/")) {
    const garageMediaUrl = process.env.NEXT_PUBLIC_AIBRY_MEDIA_URL;
    if (garageMediaUrl) {
      return `${garageMediaUrl.replace(/\/$/, "")}/${cleanUrl}`;
    }
  }

  if (cleanUrl.startsWith("/images/")) {
    return cleanUrl;
  }

  if (cleanUrl.startsWith("/api/storage/")) {
    return cleanUrl;
  }

  return "/images/default-avatar.png";
}

export function versionedAvatarUrl(url?: string | null, version?: number | null) {
  const normalized = normalizeAvatarUrl(url);
  if (!normalized || normalized === "/images/default-avatar.png") return normalized;
  if (!Number.isFinite(version) || !version || normalized.includes("v=")) return normalized;

  const separator = normalized.includes("?") ? "&" : "?";
  return `${normalized}${separator}v=${version}`;
}
