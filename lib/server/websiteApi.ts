import "server-only";

import { cookies, headers } from "next/headers";

export class WebsiteApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 500, code = "WEBSITE_API_ERROR") {
    super(message);
    this.name = "WebsiteApiError";
    this.status = status;
    this.code = code;
  }
}

type WebsiteApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  cookieHeader?: string | null;
};

export function getWebsiteApiBaseUrl() {
  const baseUrl =
    process.env.AIBRY_BACKEND_BASE_URL?.trim() ||
    process.env.AIBRY_WEBSITE_API_URL?.trim();

  if (!baseUrl) {
    throw new WebsiteApiError(
      "AIBRY_BACKEND_BASE_URL is not configured.",
      503,
      "WEBSITE_API_NOT_CONFIGURED"
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

export function getRequestCookieHeader() {
  return cookies().toString();
}

export function getIncomingCookieHeader() {
  return headers().get("cookie") ?? "";
}

export async function websiteApiFetch<T>(
  path: string,
  options: WebsiteApiFetchOptions = {}
): Promise<T> {
  const response = await websiteApiRawFetch(path, options);

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await readJson(response);

  if (!response.ok) {
    throw toApiError(response.status, payload);
  }

  return payload as T;
}

export async function websiteApiRawFetch(
  path: string,
  options: WebsiteApiFetchOptions = {}
) {
  let baseUrl: string;

  try {
    baseUrl = getWebsiteApiBaseUrl();
  } catch (error) {
    if (error instanceof WebsiteApiError) {
      return jsonServiceError(error.message, error.status, error.code);
    }

    return jsonServiceError(
      "The website account service is not configured yet.",
      503,
      "WEBSITE_API_NOT_CONFIGURED"
    );
  }

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers);
  const internalToken = process.env.AIBRY_BACKEND_INTERNAL_TOKEN?.trim();

  if (internalToken && !headers.has("x-aibry-internal-token")) {
    headers.set("x-aibry-internal-token", internalToken);
  }

  if (options.cookieHeader) {
    headers.set("cookie", options.cookieHeader);
  }

  let body = options.body ?? null;
  if (body && !(body instanceof FormData) && !(body instanceof Blob)) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(body);
  }

  try {
    return await fetch(url, {
      ...options,
      body: body as BodyInit | null,
      headers,
      cache: options.cache ?? "no-store",
    });
  } catch (error: any) {
    console.error("WEBSITE_API_FETCH_FAILED", {
      code: error?.cause?.code || error?.code,
      message: error?.cause?.message || error?.message,
    });

    return jsonServiceError(
      "The website account service is unavailable.",
      503,
      "WEBSITE_API_UNAVAILABLE"
    );
  }
}

export async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function jsonServiceError(message: string, status: number, code: string) {
  return new Response(JSON.stringify({ error: message, message, code }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function copySetCookieHeaders(from: Response, to: Response) {
  const headersWithGetSetCookie = from.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookies = headersWithGetSetCookie.getSetCookie?.();

  if (setCookies?.length) {
    for (const cookie of setCookies) {
      to.headers.append("set-cookie", cookie);
    }
    return;
  }

  const combined = from.headers.get("set-cookie");
  if (combined) {
    to.headers.append("set-cookie", combined);
  }
}

export function friendlyApiMessage(error: unknown, fallback: string) {
  if (error instanceof WebsiteApiError) {
    if (error.code === "WEBSITE_API_NOT_CONFIGURED") {
      return "The website account service is not configured yet.";
    }
    return error.message || fallback;
  }

  return fallback;
}

export function logWebsiteOperationError(operation: string, error: unknown) {
  const record =
    error && typeof error === "object" ? (error as Record<string, unknown>) : {};

  console.error("WEBSITE_API_OPERATION_FAILED", {
    operation,
    status: typeof record.status === "number" ? record.status : undefined,
    code: stringField(record.code),
    message:
      error instanceof Error
        ? error.message
        : stringField(record.message) || "Unknown website API error",
  });
}

function toApiError(status: number, payload: unknown) {
  const record =
    payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const message =
    stringField(record.message) ||
    stringField(record.error) ||
    stringField(getNestedError(record)?.message) ||
    stringField(getNestedError(record)?.code) ||
    "The website account service could not complete the request.";
  const code =
    stringField(record.code) ||
    stringField(getNestedError(record)?.code) ||
    "WEBSITE_API_REQUEST_FAILED";

  return new WebsiteApiError(message, status, code);
}

function stringField(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function getNestedError(record: Record<string, unknown>) {
  return record.error && typeof record.error === "object" && !Array.isArray(record.error)
    ? (record.error as Record<string, unknown>)
    : null;
}
