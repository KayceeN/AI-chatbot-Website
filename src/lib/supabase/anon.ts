import { createClient } from "@supabase/supabase-js";

// Plain Supabase client for public API routes (no auth session, no cookies).
// Uses the anon key — relies on RLS public INSERT policies.
export function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
