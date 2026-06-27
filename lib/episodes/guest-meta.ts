/**
 * Manual metadata layer for the guests timeline.
 *
 * The live RSS feed gives us the episode title, summary and cover art, but NOT
 * the candid photo we take with each guest at the end of the recording. That
 * lives here, keyed by guest slug.
 *
 * To add a guest:
 *   1. Drop the candid photo in `public/images/guests/<slug>.webp`
 *      (portrait or square, ~1000px, webp).
 *   2. Set `photo: "/images/guests/<slug>.webp"` below.
 *
 * Until a `photo` is set, the timeline falls back to the episode cover art,
 * so the page always renders. The episode title + summary come straight from
 * the feed — no need to write them here. Use the optional `summary` only to
 * override the auto-generated one.
 *
 * When Supabase is wired up, this module gets replaced by a table read — the
 * timeline component consumes `GuestMeta` and won't need to change.
 */

export interface GuestMeta {
  /** Candid photo taken with the guest. `null` → fall back to cover art. */
  photo: string | null;
  /** Optional — override the auto summary pulled from the feed. */
  summary?: string;
}

// ⚠️ Photos pending — drop files in public/images/guests/ and flip `photo` on.
export const guestMeta: Record<string, GuestMeta> = {
  "tomas-marra": { photo: null },
  "justo-mimessi": { photo: null },
  "bauti-mazzei": { photo: null },
  "fernando-martin-ayala": { photo: null },
  "toto-artuso": { photo: null },
  "bernardo-barcena": { photo: null },
  "rafa-smith-estrada": { photo: null },
  "mauro-dominguez": { photo: null },
  "francis-holway": { photo: null },
  "ivan-briones": { photo: null },
  "eduardo-martins": { photo: null },
  "tomas-moreno": { photo: null },
};

export function getGuestMeta(slug: string): GuestMeta | undefined {
  return guestMeta[slug];
}
