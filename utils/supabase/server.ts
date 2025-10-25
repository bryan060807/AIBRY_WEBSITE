// utils/supabase/server.ts (FIXED)

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSideClient() {
  const cookieStore = cookies();

  // Ensure your SUPABASE_SERVICE_KEY is set in your Vercel environment
  if (!process.env.SUPABASE_SERVICE_KEY) {
    throw new Error("Missing env var: SUPABASE_SERVICE_KEY");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // -----------------------------------------------------------------
    // THE FIX: Use the Service Key for admin-level server actions
    process.env.SUPABASE_SERVICE_KEY!,
    // -----------------------------------------------------------------
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
          } catch (e) {
            // This error is expected in Server Components, so we ignore it.
          }
        },
      },
    }
  );
}