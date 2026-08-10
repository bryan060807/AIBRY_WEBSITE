import "server-only";

import { NextResponse } from "next/server";
import {
  copySetCookieHeaders,
  readJson,
  websiteApiRawFetch,
} from "@/lib/server/websiteApi";

type ProxyOptions = {
  method?: string;
  body?: BodyInit | Record<string, unknown> | null;
  headers?: HeadersInit;
  cookieHeader?: string | null;
};

export async function proxyWebsiteApiJson(path: string, options: ProxyOptions = {}) {
  const response = await websiteApiRawFetch(path, {
    method: options.method ?? "GET",
    headers: options.headers,
    body: options.body ?? null,
    cookieHeader: options.cookieHeader,
  });

  return toNextResponse(response);
}

export async function proxyWebsiteApiRequest(
  path: string,
  request: Request,
  options: ProxyOptions = {}
) {
  const contentType = request.headers.get("content-type");
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? null
      : contentType?.includes("multipart/form-data")
        ? await request.formData()
        : contentType?.includes("application/json")
          ? await readRequestJson(request)
          : await request.blob();

  const headers = new Headers(options.headers);
  if (contentType && body instanceof Blob) {
    headers.set("content-type", contentType);
  }

  const response = await websiteApiRawFetch(path, {
    method: options.method ?? request.method,
    headers,
    body: (options.body ?? body) as BodyInit | Record<string, unknown> | null,
    cookieHeader: options.cookieHeader ?? request.headers.get("cookie"),
  });

  return toNextResponse(response);
}

export async function toNextResponse(response: Response) {
  const payload = await readJson(response);
  const nextResponse =
    response.status === 204
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(payload ?? {}, { status: response.status });

  copySetCookieHeaders(response, nextResponse);
  return nextResponse;
}

async function readRequestJson(request: Request) {
  const text = await request.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
