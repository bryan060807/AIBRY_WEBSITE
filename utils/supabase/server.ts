// utils/supabase/server.ts (UPDATED)

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSideClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) { // Using setAll is the recommended fix
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