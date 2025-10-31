import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow static assets and API routes through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // ✅ Allow login and public pages through
  if (
    pathname.startsWith("/login") ||
    pathname === "/" ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  // 🔒 All others redirect to login
  return NextResponse.redirect(new URL("/login", request.url));
}
