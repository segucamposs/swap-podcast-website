import { createClient } from "@supabase/supabase-js";

/**
 * Bare Supabase client for server-side API routes.
 * Uses the anon key — RLS policies control access.
 *
 * Returns null if env vars are not configured, so callers can
 * gracefully degrade (e.g. newsletter form before Supabase is wired up).
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}
