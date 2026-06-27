/**
 * Live episode data from the iTunes/Apple Podcasts public API.
 * No authentication required. Revalidates every hour.
 *
 * Falls back to the static placeholders in ./data.ts if the API is
 * unreachable so the site never breaks a render.
 */
import type { Episode } from "./types";
import { getEpisodes as getFallbackEpisodes } from "./data";
import { getSupabaseClient } from "@/lib/supabase/client";

const ITUNES_SHOW_ID = "1830727081";
const ITUNES_API_URL =
  `https://itunes.apple.com/lookup?id=${ITUNES_SHOW_ID}&country=ar&media=podcast&entity=podcastEpisode&limit=100`;

// ─── Raw iTunes shapes ───────────────────────────────────────────────────────

interface RawEpisode {
  wrapperType: "podcastEpisode";
  trackId: number;
  trackName: string;
  releaseDate: string;
  episodeUrl?: string;
  artworkUrl600?: string;
  description?: string;
  shortDescription?: string;
  trackTimeMillis?: number;
  trackViewUrl?: string;
}

interface RawShow {
  wrapperType: string;
  trackCount?: number;
  artworkUrl600?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function stripHtml(str: string): string {
  return str
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

/**
 * SWAP titles follow the pattern "Tema del episodio | Nombre del Invitado".
 * We split on the last " | " to separate topic from guest name.
 */
function parseTitle(trackName: string): { topic: string; guest: string } {
  const idx = trackName.lastIndexOf(" | ");
  if (idx !== -1) {
    const topic = trackName
      .slice(0, idx)
      .trim()
      .replace(/^["'“”]|["'“”]$/g, ""); // strip surrounding quotes
    const guest = trackName.slice(idx + 3).trim();
    return { topic, guest };
  }
  return { topic: trackName.trim(), guest: "" };
}

// ─── Supabase episode links ───────────────────────────────────────────────────

type EpisodeLinks = Record<string, { spotifyUrl?: string; youtubeUrl?: string }>;

async function getEpisodeLinks(): Promise<EpisodeLinks> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("episode_links")
    .select("slug, spotify_url, youtube_url");

  if (error || !data) return {};

  return Object.fromEntries(
    data.map((row) => [
      row.slug,
      {
        spotifyUrl: row.spotify_url ?? undefined,
        youtubeUrl: row.youtube_url ?? undefined,
      },
    ])
  );
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getAllEpisodes(): Promise<Episode[]> {
  try {
    const [res, links] = await Promise.all([
      fetch(ITUNES_API_URL, { next: { revalidate: 3600 } }),
      getEpisodeLinks(),
    ]);
    if (!res.ok) throw new Error(`iTunes API returned ${res.status}`);

    const data = await res.json();
    const results: (RawEpisode | RawShow)[] = data.results ?? [];

    const show = results.find(
      (r): r is RawShow => r.wrapperType !== "podcastEpisode"
    );
    const trackCount = show?.trackCount ?? 22;

    const episodes: Episode[] = results
      .filter((r): r is RawEpisode => r.wrapperType === "podcastEpisode")
      .map((ep, idx) => {
        const { topic, guest } = parseTitle(ep.trackName);
        const slug = guest ? toSlug(guest) : `ep-${trackCount - idx}`;
        const description = ep.description
          ? stripHtml(ep.description)
          : ep.shortDescription
          ? stripHtml(ep.shortDescription)
          : "";
        return {
          id: String(ep.trackId),
          slug,
          episodeNumber: trackCount - idx, // newest = highest number
          title: topic,
          description,
          guest,
          guestBio: "",
          youtubeUrl: links[slug]?.youtubeUrl ?? null,
          spotifyUrl:
            links[slug]?.spotifyUrl ??
            "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",
          appleUrl: ep.trackViewUrl ?? null,
          publishedAt: ep.releaseDate,
          thumbnailUrl: ep.artworkUrl600 ?? null,
          artworkUrl: ep.artworkUrl600 ?? null,
          audioUrl: ep.episodeUrl ?? null,
          durationMs: ep.trackTimeMillis ?? null,
          topic,
        } satisfies Episode;
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

    return episodes;
  } catch (err) {
    console.error("[feed] iTunes API failed — using static fallback:", err);
    return getFallbackEpisodes();
  }
}

export async function getLatestEpisode(): Promise<Episode | null> {
  const eps = await getAllEpisodes();
  return eps[0] ?? null;
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | undefined> {
  const eps = await getAllEpisodes();
  return eps.find((ep) => ep.slug === slug);
}

export async function getEpisodeCount(): Promise<number> {
  const episodes = await getAllEpisodes();
  return episodes.length;
}

/** Returns all episodes — each SWAP episode features one guest. */
export async function getGuests(): Promise<Episode[]> {
  return getAllEpisodes();
}
