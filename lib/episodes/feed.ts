/**
 * Live episode data from the podcast RSS feed (Anchor/Spotify).
 * Always up-to-date — unlike the iTunes API which can lag by days.
 * Revalidates every hour. Falls back to static data if unreachable.
 */
import type { Episode } from "./types";
import { getEpisodes as getFallbackEpisodes } from "./data";
import { episodeOverrides } from "./overrides";
import { getSupabaseClient } from "@/lib/supabase/client";

const RSS_FEED_URL = "https://anchor.fm/s/1004ba98c/podcast/rss";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractCDATA(str: string): string {
  return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

export function stripHtml(str: string): string {
  return str
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function parseTitle(title: string): { topic: string; guest: string } {
  const idx = title.lastIndexOf(" | ");
  if (idx !== -1) {
    const topic = title.slice(0, idx).trim().replace(/^["'""]|["'""]$/g, "");
    const guest = title.slice(idx + 3).trim();
    return { topic, guest };
  }
  // Early-episode guest format: "Topic - Guest #N" or "Topic — con Guest #N".
  // (Solo episodes start with "#N" instead, so they never match this.)
  const endHash = title.match(/^(.*?)\s*[—–-]\s*(?:con\s+)?([^—–-]+?)\s*#\d+\s*$/i);
  if (endHash) {
    const topic = endHash[1].trim().replace(/^["'""]|["'""]$/g, "");
    return { topic, guest: endHash[2].trim() };
  }
  return { topic: title.trim(), guest: "" };
}

function rssTag(tag: string, xml: string): string {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? extractCDATA(match[1]).trim() : "";
}

function rssAttr(tag: string, attr: string, xml: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, "i"));
  return match?.[1] ?? "";
}

function durationToMs(duration: string): number | null {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
  return null;
}

// ─── Supabase episode links ───────────────────────────────────────────────────

type EpisodeLinks = Record<string, { spotifyUrl?: string; youtubeUrl?: string; appleUrl?: string }>;

async function getEpisodeLinks(): Promise<EpisodeLinks> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("episode_links")
    .select("slug, spotify_url, youtube_url, apple_url");

  if (error || !data) return {};

  return Object.fromEntries(
    data.map((row) => [
      row.slug,
      {
        spotifyUrl: row.spotify_url ?? undefined,
        youtubeUrl: row.youtube_url ?? undefined,
        appleUrl: row.apple_url ?? undefined,
      },
    ])
  );
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getAllEpisodes(): Promise<Episode[]> {
  try {
    const [rssRes, links] = await Promise.all([
      fetch(RSS_FEED_URL, { next: { revalidate: 3600 } }),
      getEpisodeLinks(),
    ]);
    if (!rssRes.ok) throw new Error(`RSS feed returned ${rssRes.status}`);

    const xml = await rssRes.text();
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = itemRegex.exec(xml)) !== null) items.push(m[1]);

    const episodes: Episode[] = items.map((item, idx) => {
      const rawTitle = rssTag("title", item);
      const { topic, guest } = parseTitle(rawTitle);
      const slug = guest ? toSlug(guest) : `ep-${items.length - idx}`;

      const rawDesc = rssTag("description", item);
      const description = rawDesc ? stripHtml(rawDesc) : "";

      const artworkUrl = rssAttr("itunes:image", "href", item);
      const durationStr = rssTag("itunes:duration", item);
      const epNumStr = rssTag("itunes:episode", item);
      const epNum = parseInt(epNumStr, 10);
      const guid = rssTag("guid", item);
      const pubDate = rssTag("pubDate", item);
      const audioUrl = rssAttr("enclosure", "url", item);

      const supabaseLink = links[slug];
      const overrideLink = episodeOverrides[slug];

      return {
        id: guid || String(idx),
        slug,
        episodeNumber: isNaN(epNum) ? items.length - idx : epNum,
        title: topic,
        description,
        guest,
        guestBio: "",
        youtubeUrl: supabaseLink?.youtubeUrl ?? overrideLink?.youtubeUrl ?? null,
        spotifyUrl:
          supabaseLink?.spotifyUrl ??
          overrideLink?.spotifyUrl ??
          "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",
        appleUrl:
          supabaseLink?.appleUrl ??
          overrideLink?.appleUrl ??
          "https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081",
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        thumbnailUrl: artworkUrl || null,
        artworkUrl: artworkUrl || null,
        audioUrl: audioUrl || null,
        durationMs: durationStr ? durationToMs(durationStr) : null,
        topic,
      } satisfies Episode;
    });

    return episodes.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (err) {
    console.error("[feed] RSS feed failed — using static fallback:", err);
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

export async function getGuests(): Promise<Episode[]> {
  return getAllEpisodes();
}
