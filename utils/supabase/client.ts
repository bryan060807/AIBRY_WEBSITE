'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Shared Supabase browser client
 *
 * This single instance keeps session state consistent across your app.
 * Do NOT recreate it manually inside components.
 * Just import:
 *   import { supabase } from '@/utils/supabase/client';
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
