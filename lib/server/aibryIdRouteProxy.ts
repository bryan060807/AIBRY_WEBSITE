import "server-only";

import { NextResponse } from "next/server";
import { copySetCookieHeaders, websiteApiRawFetch } from "@/lib/server/websiteApi";

export async function proxyAibryIdAuthGet(path: string, request: Request) {
  const response = await websiteApiRawFetch(path, {
    method: "GET",
    cookieHeader: request.headers.get("cookie"),
    redirect: "manual",
  });

  return toPassthroughResponse(response);
}

async function toPassthroughResponse(response: Response) {
  const location = response.headers.get("location");
  const headers = new Headers();

  if (location) {
    headers.set("location", location);
  }

  const contentType = response.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const nextResponse = new NextResponse(
    response.status === 204 || isRedirect(response.status) ? null : await response.text(),
    {
      status: response.status,
      headers,
    }
  );

  copySetCookieHeaders(response, nextResponse);
  return nextResponse;
}

function isRedirect(status: number) {
  return status >= 300 && status < 400;
}
