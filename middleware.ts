import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase SSR client (auth cookies from request)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
      },
    }
  );

  // Check current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  /**
   * PROTECTED ROUTES
   * ----------------
   * Only block routes that modify or require auth context.
   * Reading routes (forum topics, posts) stay public.
   */
  const protectedPatterns = [
    '/dashboard',
    '/profile',
    '/todo',
    '/forum/', // we’ll check specific subpaths below
  ];

  const isProtected = protectedPatterns.some((p) => path.startsWith(p));

  // Allow public forum browsing
  const isForumNewPost = /\/forum\/[^/]+\/new$/.test(path);
  const isForumEdit = /\/forum\/[^/]+\/edit$/.test(path);
  const requiresAuth = isProtected && (isForumNewPost || isForumEdit || path.startsWith('/dashboard') || path.startsWith('/profile') || path.startsWith('/todo'));

  // Redirect guests trying to access protected routes
  if (requiresAuth && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

/**
 * Configure middleware matcher
 * Limits middleware to only routes that could contain protected content.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/forum/:path*',
    '/profile/:path*',
    '/todo/:path*',
  ],
};
