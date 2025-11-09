// utils/getProfileLink.ts

/**
 * Returns the correct public profile link for a user.
 * Uses `/u/[username]` if available, otherwise falls back to `/profile/[id]`.
 */
export function getProfileLink(user: {
  id: string;
  username?: string | null;
}): string {
  if (!user || !user.id) return '/';
  if (user.username && user.username.trim().length > 0) {
    return `/u/${encodeURIComponent(user.username)}`;
  }
  return `/profile/${encodeURIComponent(user.id)}`;
}
