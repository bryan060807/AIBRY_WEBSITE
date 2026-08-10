import {
  normalizeProfile,
  type ProfileResponse,
  type WebsiteProfile,
} from "@/lib/websiteProfile";
import type { AuthCredentials, AuthUser, RegisterInput } from "@/lib/auth/types";

export async function getCurrentUser() {
  try {
    const payload = await requestJson("/api/auth/me");
    return normalizeUser(payload);
  } catch (error) {
    if (isAuthRequiredError(error)) {
      return null;
    }

    throw error;
  }
}

export async function login(credentials: AuthCredentials) {
  const payload = await requestJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  broadcastAuthChange();
  return normalizeUser(payload);
}

export async function register(input: RegisterInput) {
  const payload = await requestJson("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  broadcastAuthChange();
  return normalizeUser(payload);
}

export async function logout() {
  await requestJson("/api/auth/logout", { method: "POST" });
  broadcastAuthChange();
}

export async function getCurrentProfile() {
  try {
    const payload = await requestJson("/api/profile");
    return normalizeProfile(payload);
  } catch (error) {
    if (isMissingProfileError(error)) {
      const user = await getCurrentUser();
      return user
        ? normalizeProfile({
            user: {
              id: user.id,
              email: user.email,
              displayName: user.displayName,
              username: user.username,
              avatarUrl: user.avatarUrl,
              avatarVersion: user.avatarVersion,
            },
          })
        : null;
    }

    throw error;
  }
}

export async function updateProfile(input: Partial<WebsiteProfile>) {
  const payload = await requestJson("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  broadcastAuthChange();
  return normalizeProfile(payload);
}

async function requestJson(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AccountApiError(
      apiErrorMessage(payload),
      response.status,
      apiErrorCode(payload)
    );
  }

  return payload;
}

function normalizeUser(payload: unknown): AuthUser | null {
  const profile = normalizeProfile(payload as ProfileResponse);
  if (profile) {
    return {
      id: profile.id,
      email: profile.email,
      displayName: profile.displayName,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      avatarVersion: profile.avatarVersion,
    };
  }

  if (!payload || typeof payload !== "object") return null;
  const record = unwrapPayload(payload as Record<string, unknown>);
  const user =
    record.user && typeof record.user === "object"
      ? (record.user as Record<string, unknown>)
      : record;
  const id = stringField(user.id) || stringField(user.user_id);
  if (!id) return null;

  return {
    id,
    email: stringField(user.email),
    displayName: stringField(user.display_name) || stringField(user.displayName),
    username: stringField(user.username),
    avatarUrl: stringField(user.avatar_url) || stringField(user.avatarUrl),
    avatarVersion: numberField(user.avatar_version ?? user.avatarVersion),
  };
}

class AccountApiError extends Error {
  readonly status: number;
  readonly code: string | null;

  constructor(message: string, status: number, code: string | null) {
    super(message);
    this.name = "AccountApiError";
    this.status = status;
    this.code = code;
  }
}

function apiErrorMessage(payload: unknown) {
  const record = isRecord(payload) ? payload : {};
  const nestedError = isRecord(record.error) ? record.error : null;

  return (
    stringField(record.message) ||
    stringField(record.error) ||
    stringField(nestedError?.message) ||
    stringField(nestedError?.code) ||
    "The account service could not complete the request."
  );
}

function apiErrorCode(payload: unknown) {
  const record = isRecord(payload) ? payload : {};
  const nestedError = isRecord(record.error) ? record.error : null;

  return (
    stringField(record.code) ||
    stringField(nestedError?.code) ||
    stringField(record.error)
  );
}

function isAuthRequiredError(error: unknown) {
  return (
    error instanceof AccountApiError &&
    error.status === 401 &&
    normalizeCode(error.code) === "auth_required"
  );
}

function isMissingProfileError(error: unknown) {
  if (!(error instanceof AccountApiError)) return false;

  const code = normalizeCode(error.code);
  return (
    error.status === 404 ||
    code.includes("profile") ||
    code === "not_found"
  );
}

function normalizeCode(code: string | null) {
  return code?.trim().toLowerCase() ?? "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function broadcastAuthChange() {
  window.dispatchEvent(new Event("aibry-auth-changed"));
}

function stringField(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function unwrapPayload(record: Record<string, unknown>) {
  return record.data && typeof record.data === "object"
    ? (record.data as Record<string, unknown>)
    : record;
}

function numberField(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
