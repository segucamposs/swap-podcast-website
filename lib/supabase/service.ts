import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses RLS for trusted server-side writes.
 * Use ONLY in API routes (never in client components or public Server Components).
 *
 * Returns null if env vars are not configured so callers can fail gracefully.
 */
export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
