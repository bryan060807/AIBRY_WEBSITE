// middleware.ts

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  try {
    // ... (supabase client setup)
    const { data: { user } } = await supabase.auth.getUser();

    // 3. Define all routes that require a user to be logged in
    const protectedPaths = [
      '/dashboard', // <-- ADD THIS
      '/forum', 
      '/forum/story', 
      '/forum/hope', 
      '/forum/support',
      '/todo', 
      '/monday-gpt'
    ];

    const isProtectedPath = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );

    // 4. If accessing a protected path and NOT authenticated, redirect to login
    if (isProtectedPath && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // 5. Continue to the requested path if authenticated or if path is not protected
    return NextResponse.next();

  } catch (e) {
    // If a redirect happens, the error will be caught here. 
    return NextResponse.next();
  }
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /* * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /auth (Supabase auth callback routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};