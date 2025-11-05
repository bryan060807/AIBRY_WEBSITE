import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // Define protected areas
  const protectedPatterns = [
    '/dashboard',
    '/profile',
    '/todo',
    '/forum/',
  ];

  const isProtected = protectedPatterns.some((p) => path.startsWith(p));

  // Allow read-only forum access
  const isForumNewPost = /\/forum\/[^/]+\/new$/.test(path);
  const isForumEdit = /\/forum\/[^/]+\/edit$/.test(path);
  const requiresAuth =
    isProtected &&
    (isForumNewPost ||
      isForumEdit ||
      path.startsWith('/dashboard') ||
      path.startsWith('/profile') ||
      path.startsWith('/todo'));

  if (requiresAuth && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/forum/:path*',
    '/profile/:path*',
    '/todo/:path*',
  ],
};
