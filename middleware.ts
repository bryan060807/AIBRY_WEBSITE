import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/login") ||
    pathname === "/" ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
