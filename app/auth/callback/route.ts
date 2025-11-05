import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Handles Supabase OAuth redirect callback.
 * Exchanges the authorization code for a session and sets cookies.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  // Create a Supabase client configured for Next.js SSR
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Exchange the OAuth "code" for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase auth error:', error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Redirect user after successful login
  const response = NextResponse.redirect(`${origin}/dashboard`);

  // Supabase will automatically set auth cookies through the above handlers
  return response;
}
