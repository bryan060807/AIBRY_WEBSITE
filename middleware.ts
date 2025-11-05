import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function middleware(req: NextRequest) {
  // Create a response we can modify cookies on
  const res = NextResponse.next();

  // Initialize Supabase server client using shared helper
  const supabase = createSupabaseServerClient();

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // --- Protected route logic ---

  // These routes require login
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/todo',
  ];

  // Forum subroutes allowed read-only access, but restrict posting/editing
  const forumNewPost = /\/forum\/[^/]+\/new$/.test(path);
  const forumEdit = /\/forum\/[^/]+\/edit$/.test(path);

  const isProtected =
    protectedPaths.some((p) => path.startsWith(p)) ||
    forumNewPost ||
    forumEdit;

  // Redirect unauthenticated users
  if (isProtected && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Middleware applies to all protected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/todo/:path*',
    '/forum/:path*',
  ],
};
