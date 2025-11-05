import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Creates a Supabase client configured for Next.js 14+ (Edge/SSR safe)
 * Automatically syncs authentication cookies between server and browser.
 *
 * Use this only in:
 *   - Middleware
 *   - Route handlers
 *   - Server components
 *
 * Example:
 *   const supabase = createSupabaseServerClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Some edge environments (like Vercel Edge Functions) disallow manual cookie setting
            // so we fail silently instead of crashing the request.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            /* silently ignore edge write errors */
          }
        },
      },
    }
  );

  return supabase;
}
