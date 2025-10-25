// lib/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

// Ensure your environment variables are set in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl) {
  console.error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseKey) {
  console.error("Missing env var: SUPABASE_SERVICE_KEY");
}

// Create and export the Supabase client
// We use the SERVICE KEY here for server-side API routes
// This should NOT be exposed to the client
export const supabase = createClient(supabaseUrl, supabaseKey);