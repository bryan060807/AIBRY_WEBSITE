import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This is a Route Handler that Supabase redirects to after sign-in/sign-up
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = cookies();
    
    // Create a Supabase client configured to handle cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              // The setAll function is required but cookieStore.set() is not supported in a Route Handler.
              // We rely on the redirect below to set the cookie in the browser.
            }
          },
        },
      }
    );

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in/sign up or email confirmation
  // We'll redirect to the forum to complete the login process
  return NextResponse.redirect(`${origin}/forum`);
}