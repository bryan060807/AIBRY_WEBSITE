import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Keep middleware intentionally passive for now.
//
// The Website API is the authority for private data and already protects
// authenticated endpoints with the HttpOnly session cookie. Performing a live
// backend auth check from Next middleware created redirect races between the
// middleware, the login page, and client-side auth refreshes. That made valid
// sessions look unauthenticated on protected pages such as profile and forum
// edit/new routes.
//
// Let the app/pages/components handle user-facing auth redirects after the
// client/server auth state is loaded, and let the API enforce access control.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/todo/:path*',
    '/forum/:path*',
    '/login/:path*',
  ],
};
