/**
 * Manual metadata layer for the guests timeline.
 *
 * The live RSS feed gives us the episode title, summary and cover art, but NOT
 * the candid photo we take with each guest at the end of the recording. That
 * lives here, keyed by guest slug.
 *
 * To add a guest:
 *   1. Drop the candid photo in `public/images/guests/<slug>.jpg`.
 *   2. Set `photo: "/images/guests/<slug>.jpg"` below.
 *
 * A guest only appears in the timeline once their episode is live in the RSS
 * feed AND they have an entry here. Entries whose episode isn't published yet
 * (e.g. Rolo Schiavi, Andrés Rieznik, Juampi Hernández) sit ready and surface
 * automatically when the feed catches up.
 *
 * When Supabase is wired up, this module gets replaced by a table read — the
 * timeline component consumes `GuestMeta` and won't need to change.
 */

export interface GuestMeta {
  /** Candid photo taken with the guest. `null` → fall back to cover art. */
  photo: string | null;
  /** Photo aspect ratio (width / height). Defaults to 16/9; set when it differs
   *  so the frame hugs the image and nothing gets cropped. */
  aspect?: number;
  /** Optional — override the auto summary pulled from the feed. */
  summary?: string;
}

// `aspect` is set only when the photo isn't ~16:9, so the frame hugs the real
// image and nothing is cropped or letterboxed.
export const guestMeta: Record<string, GuestMeta> = {
  "tomas-marra": { photo: "/images/guests/tomas-marra.jpg", aspect: 1.926 },
  "justo-mimessi": { photo: "/images/guests/justo-mimessi.jpg", aspect: 1.845 },
  "bauti-mazzei": { photo: "/images/guests/bauti-mazzei.jpg", aspect: 1.929 },
  "fernando-martin-ayala": { photo: "/images/guests/fernando-martin-ayala.jpg", aspect: 2.152 },
  "toto-artuso": { photo: "/images/guests/toto-artuso.jpg", aspect: 2.148 },
  "bernardo-barcena": { photo: "/images/guests/bernardo-barcena.jpg", aspect: 1.708 },
  "rafa-smith-estrada": { photo: "/images/guests/rafa-smith-estrada.jpg", aspect: 4 / 3 },
  "mauro-dominguez": { photo: "/images/guests/mauro-dominguez.jpg" },
  "francis-holway": { photo: "/images/guests/francis-holway.jpg" },
  "ivan-briones": { photo: "/images/guests/ivan-briones.jpg" },
  "eduardo-martins": { photo: "/images/guests/eduardo-martins.jpg" },
  "tomas-moreno": { photo: "/images/guests/tomas-moreno.jpg" },

  // Recorded — photos ready, will appear once the episode hits the RSS feed.
  "rolo-schiavi": { photo: "/images/guests/rolo-schiavi.jpg" },
  "andres-rieznik": { photo: "/images/guests/andres-rieznik.jpg" },
  "juampi-hernandez": { photo: "/images/guests/juampi-hernandez.jpg" },
};

export function getGuestMeta(slug: string): GuestMeta | undefined {
  return guestMeta[slug];
}
