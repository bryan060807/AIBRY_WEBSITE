import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client to read the session
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Allow static files and public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/login") ||
    pathname === "/"
  ) {
    return res;
  }

  // Redirect unauthenticated users to login
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}
