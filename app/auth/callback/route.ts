import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

/**
 * Handles Supabase auth redirect callback.
 * This route exchanges the code for a session.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = createSupabaseServerClient();

  await supabase.auth.exchangeCodeForSession(code);

  const response = NextResponse.redirect(`${origin}/dashboard`);

  // Copy Supabase cookies into the response
  const cookieStore = supabase._cookies ?? [];
  if (Array.isArray(cookieStore)) {
    for (const cookie of cookieStore) {
      response.cookies.set(cookie.name, cookie.value, cookie);
    }
  }

  return response;
}