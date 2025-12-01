// /lib/normalizeAvatarUrl.ts

/**
 * Normalize and sanitize avatar URLs for Supabase + Next.js Image.
 * Handles local dev, production, and malformed storage paths.
 */
export function normalizeAvatarUrl(url?: string | null): string | null {
  if (!url) return null;

  // If it’s already an HTTPS URL (Supabase public or CDN)
  if (url.startsWith("https://")) {
    // Strip any query params (?t=timestamp, etc.) that break Next Image
    const cleanUrl = url.split("?")[0];
    return cleanUrl;
  }

  // If it's a relative Supabase storage path
  if (url.startsWith("avatars/")) {
    // Use Supabase project URL from env
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "https://vuxfewsadivsbtuuulkn.supabase.co";
    return `${supabaseUrl}/storage/v1/object/public/${url}`;
  }

  // If it's already a valid local asset
  if (url.startsWith("/images/")) {
    return url;
  }

  // Otherwise, fall back to the default local avatar
  return "/images/default-avatar.png";
}
