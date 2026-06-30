import { versionedAvatarUrl } from "@/lib/normalizeAvatarUrl";

export interface WebsiteProfile {
  id: string;
  email?: string | null;
  displayName: string | null;
  username: string | null;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
  avatarUrl: string | null;
  avatarVersion: number;
  instagram: string | null;
  tiktok: string | null;
  spotify: string | null;
  soundcloud: string | null;
  facebook: string | null;
  bandcamp: string | null;
  newsletterOptIn: boolean;
}

export type ProfileResponse =
  | {
      ok?: boolean;
      data?: Record<string, unknown> | null;
      profile?: Record<string, unknown> | null;
      user?: Record<string, unknown> | null;
    }
  | Record<string, unknown>
  | null;

export function normalizeProfile(payload: ProfileResponse): WebsiteProfile | null {
  if (!payload || typeof payload !== "object") return null;

  const record = unwrapPayload(payload as Record<string, unknown>);
  const user =
    record.user && typeof record.user === "object"
      ? (record.user as Record<string, unknown>)
      : record;
  const profile =
    record.profile && typeof record.profile === "object"
      ? (record.profile as Record<string, unknown>)
      : user.profile && typeof user.profile === "object"
        ? (user.profile as Record<string, unknown>)
        : record.user && record.profile == null
          ? null
          : record;

  if (!profile) {
    return defaultProfileFromUser(user);
  }

  const id = stringField(profile.id) || stringField(profile.user_id) || stringField(user.id);
  if (!id) return null;

  return {
    id,
    email: stringField(profile.email) || stringField(user.email),
    displayName:
      stringField(profile.display_name) ||
      stringField(profile.displayName) ||
      stringField(user.display_name) ||
      stringField(user.displayName) ||
      stringField(user.email),
    username: stringField(profile.username) || stringField(user.username),
    bio: stringField(profile.bio) || "",
    location: stringField(profile.location) || "",
    websiteUrl: stringField(profile.website_url) || stringField(profile.websiteUrl) || "",
    avatarVersion: numberField(profile.avatar_version ?? profile.avatarVersion ?? user.avatar_version ?? user.avatarVersion),
    avatarUrl:
      versionedAvatarUrl(
        stringField(profile.avatar_url) ||
          stringField(profile.avatarUrl) ||
          stringField(user.avatar_url) ||
          stringField(user.avatarUrl),
        numberField(profile.avatar_version ?? profile.avatarVersion ?? user.avatar_version ?? user.avatarVersion)
      ) || null,
    instagram: stringField(profile.instagram) || "",
    tiktok: stringField(profile.tiktok) || "",
    spotify: stringField(profile.spotify) || "",
    soundcloud: stringField(profile.soundcloud) || "",
    facebook: stringField(profile.facebook) || "",
    bandcamp: stringField(profile.bandcamp) || "",
    newsletterOptIn: Boolean(profile.newsletter_opt_in ?? profile.newsletterOptIn),
  };
}

export function profileFormDefaults(payload: ProfileResponse) {
  const profile = normalizeProfile(payload);
  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    display_name: profile.displayName,
    username: profile.username,
    bio: profile.bio,
    location: profile.location,
    website_url: profile.websiteUrl,
    avatar_url: profile.avatarUrl,
    avatar_version: profile.avatarVersion,
    instagram: profile.instagram,
    tiktok: profile.tiktok,
    spotify: profile.spotify,
    soundcloud: profile.soundcloud,
    facebook: profile.facebook,
    bandcamp: profile.bandcamp,
    newsletter_opt_in: profile.newsletterOptIn,
  };
}

function unwrapPayload(record: Record<string, unknown>) {
  return record.data && typeof record.data === "object"
    ? (record.data as Record<string, unknown>)
    : record;
}

function defaultProfileFromUser(user: Record<string, unknown>): WebsiteProfile | null {
  const id = stringField(user.id) || stringField(user.user_id);
  if (!id) return null;

  return {
    id,
    email: stringField(user.email),
    displayName:
      stringField(user.display_name) ||
      stringField(user.displayName) ||
      stringField(user.email) ||
      "",
    username: stringField(user.username) || "",
    bio: "",
    location: "",
    websiteUrl: "",
    avatarVersion: numberField(user.avatar_version ?? user.avatarVersion),
    avatarUrl:
      versionedAvatarUrl(
        stringField(user.avatar_url) || stringField(user.avatarUrl),
        numberField(user.avatar_version ?? user.avatarVersion)
      ) || null,
    instagram: "",
    tiktok: "",
    spotify: "",
    soundcloud: "",
    facebook: "",
    bandcamp: "",
    newsletterOptIn: false,
  };
}

function stringField(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function numberField(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
