'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase'; // optional, if you have a typed DB schema

// Create a Supabase client specifically for client components
export const supabase = createClientComponentClient<Database>();