import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

/**
 * Handles Supabase OAuth redirect callback.
 * Exchanges the authorization code for a session and sets cookies.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  // Create a Supabase server client (handles cookies internally)
  const supabase = createSupabaseServerClient();

  // Exchange the OAuth "code" for a valid session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase auth error:', error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Successful login, redirect to dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}
