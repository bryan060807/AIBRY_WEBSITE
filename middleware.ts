import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Initialize Supabase server client
  const supabase = createSupabaseServerClient();

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // ------------------------------------------------
  // Route groups
  // ------------------------------------------------

  // These routes require authentication
  const protectedPaths = ['/dashboard', '/profile', '/todo'];

  // Forum: read-only allowed, posting/editing restricted
  const forumNewPost = /\/forum\/[^/]+\/new$/.test(path);
  const forumEdit = /\/forum\/[^/]+\/edit$/.test(path);

  const isProtected =
    protectedPaths.some((p) => path.startsWith(p)) ||
    forumNewPost ||
    forumEdit;

  // These routes should NOT be accessed when already logged in
  const authRoutes = ['/login', '/login/reset', '/login/update'];
  const isAuthRoute = authRoutes.some((p) => path.startsWith(p));

  // ------------------------------------------------
  // Access control logic
  // ------------------------------------------------

  // 1. Unauthenticated user accessing protected content
  if (isProtected && !session) {
    const redirectUrl = new URL('/login', req.url);
    // preserve intended destination
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Authenticated user accessing login/reset/update → send to dashboard
  if (session && isAuthRoute) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. All other cases proceed normally
  return res;
}

// ------------------------------------------------
// Apply middleware to these routes
// ------------------------------------------------
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/todo/:path*',
    '/forum/:path*',
    '/login/:path*', // guards auth pages for signed-in users
  ],
};
