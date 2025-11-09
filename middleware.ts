import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseServerClient();

  // Securely get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  // ------------------------------------------------
  // Route groups
  // ------------------------------------------------

  const protectedPaths = ['/dashboard', '/profile', '/todo'];
  const forumNewPost = /\/forum\/[^/]+\/new$/.test(path);
  const forumEdit = /\/forum\/[^/]+\/edit$/.test(path);

  const isProtected =
    protectedPaths.some((p) => path.startsWith(p)) ||
    forumNewPost ||
    forumEdit;

  const authRoutes = ['/login', '/login/reset', '/login/update'];
  const isAuthRoute = authRoutes.some((p) => path.startsWith(p));

  // ------------------------------------------------
  // Access control logic
  // ------------------------------------------------

  // 1. Unauthenticated user accessing protected content
  if (isProtected && !user) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Authenticated user accessing login/reset/update → send to dashboard
  if (user && isAuthRoute) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // ------------------------------------------------
  // 3. Auto-create username if missing
  // ------------------------------------------------
  if (user) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, display_name')
        .eq('id', user.id)
        .single();

      if (!error && profile && !profile.username) {
        const raw =
          profile.display_name ||
          user.email?.split('@')[0] ||
          `user-${user.id.slice(0, 6)}`;

        const username = raw
          .replace(/[^a-zA-Z0-9_-]/g, '')
          .toLowerCase()
          .slice(0, 20);

        await supabase.from('profiles').update({ username }).eq('id', user.id);
      }
    } catch (err) {
      console.error('Failed to auto-assign username:', err);
    }
  }

  // ------------------------------------------------
  // 4. Proceed as usual
  // ------------------------------------------------
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
    '/login/:path*',
  ],
};
