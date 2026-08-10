import "server-only";

import {
  getRequestCookieHeader,
  WebsiteApiError,
  websiteApiFetch,
} from "@/lib/server/websiteApi";

export interface ServerAuthUser {
  id: string;
  email?: string | null;
  role?: string | null;
  displayName?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  avatarVersion?: number;
}

export interface ServerAuthResult {
  user: ServerAuthUser | null;
  source: "fedora-api";
}

export async function getCurrentServerUser(): Promise<ServerAuthResult> {
  try {
    const payload = await websiteApiFetch<AuthMeResponse>("/api/auth/me", {
      cookieHeader: getRequestCookieHeader(),
    });
    const user = normalizeUser(payload);

    return { user, source: "fedora-api" };
  } catch (error) {
    if (error instanceof WebsiteApiError && [401, 403, 404].includes(error.status)) {
      return { user: null, source: "fedora-api" };
    }

    return { user: null, source: "fedora-api" };
  }
}

export async function requireCurrentServerUser(): Promise<ServerAuthUser> {
  const { user } = await getCurrentServerUser();

  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }

  return user;
}

type AuthMeResponse =
  | {
      user?: Record<string, unknown> | null;
      profile?: Record<string, unknown> | null;
    }
  | Record<string, unknown>
  | null;

function normalizeUser(payload: AuthMeResponse): ServerAuthUser | null {
  if (!payload || typeof payload !== "object") return null;

  const record = unwrapPayload(payload as Record<string, unknown>);
  const userRecord =
    record.user && typeof record.user === "object"
      ? (record.user as Record<string, unknown>)
      : record;
  const profileRecord =
    record.profile && typeof record.profile === "object"
      ? (record.profile as Record<string, unknown>)
      : userRecord;

  const id = stringField(userRecord.id) || stringField(userRecord.user_id);
  if (!id) return null;

  return {
    id,
    email: stringField(userRecord.email),
    role: stringField(userRecord.role) || stringField(profileRecord.role),
    displayName:
      stringField(profileRecord.display_name) ||
      stringField(profileRecord.displayName) ||
      stringField(userRecord.display_name) ||
      stringField(userRecord.displayName),
    username: stringField(profileRecord.username) || stringField(userRecord.username),
    avatarUrl:
      stringField(profileRecord.avatar_url) ||
      stringField(profileRecord.avatarUrl) ||
      stringField(userRecord.avatar_url) ||
      stringField(userRecord.avatarUrl),
    avatarVersion: numberField(
      profileRecord.avatar_version ??
        profileRecord.avatarVersion ??
        userRecord.avatar_version ??
        userRecord.avatarVersion
    ),
  };
}

function unwrapPayload(record: Record<string, unknown>) {
  return record.data && typeof record.data === "object"
    ? (record.data as Record<string, unknown>)
    : record;
}

function stringField(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function numberField(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
