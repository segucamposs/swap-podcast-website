import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SPOTIFY_SHOW_ID   = "1t25iC8KdPXDZ9BUr1KgxY";
const ITUNES_API_URL    = "https://itunes.apple.com/lookup?id=1830727081&country=ar&media=podcast&entity=podcastEpisode&limit=100";
const YT_CHANNEL_HANDLE = "SwapPodcast";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalise(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

/** Returns the index of the item whose title best matches the guest name. */
function findByGuest(guest: string, items: { title: string }[]): number {
  const g = normalise(guest);
  return items.findIndex(({ title }) => normalise(title).includes(g));
}

// ─── Spotify ─────────────────────────────────────────────────────────────────

async function getSpotifyToken(): Promise<string | null> {
  const id     = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

async function getSpotifyEpisodes(token: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/shows/${SPOTIFY_SHOW_ID}/episodes?market=AR&limit=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items ?? []) as { name: string; external_urls: { spotify: string } }[];
}

// ─── YouTube ─────────────────────────────────────────────────────────────────

async function getYouTubeVideos(apiKey: string) {
  // Resolve channel handle → channel ID
  const chRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${YT_CHANNEL_HANDLE}&key=${apiKey}`
  );
  if (!chRes.ok) return [];
  const chData = await chRes.json();
  const channelId = chData.items?.[0]?.id as string | undefined;
  if (!channelId) return [];

  const vRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=50&order=date&key=${apiKey}`
  );
  if (!vRes.ok) return [];
  const vData = await vRes.json();
  return (vData.items ?? []).map((item: { id: { videoId: string }; snippet: { title: string } }) => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
  }));
}

// ─── iTunes (raw, no Supabase merge needed here) ─────────────────────────────

async function getItunesEpisodes() {
  const res = await fetch(ITUNES_API_URL, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const data = await res.json();
  const results = (data.results ?? []) as {
    wrapperType: string;
    trackName?: string;
    trackId?: number;
    trackCount?: number;
  }[];

  const show      = results.find((r) => r.wrapperType !== "podcastEpisode");
  const trackCount = (show as { trackCount?: number })?.trackCount ?? 22;

  return results
    .filter((r) => r.wrapperType === "podcastEpisode")
    .map((ep, idx) => {
      const raw     = ep.trackName ?? "";
      const sepIdx  = raw.lastIndexOf(" | ");
      const guest   = sepIdx !== -1 ? raw.slice(sepIdx + 3).trim() : "";
      const slug    = guest
        ? guest.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
        : `ep-${trackCount - idx}`;
      return { slug, guest };
    });
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  // We also accept x-sync-secret for manual triggers
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const manualSecret = req.headers.get("x-sync-secret");

  const validCron   = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const validManual = cronSecret && manualSecret === cronSecret;

  if (!validCron && !validManual) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Supabase admin client (bypasses RLS for writes)
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  // Which slugs do we already have?
  const { data: existing } = await supabase.from("episode_links").select("slug");
  const existingSlugs = new Set((existing ?? []).map((r: { slug: string }) => r.slug));

  // Get all episodes from iTunes
  const itunesEps = await getItunesEpisodes();
  const newEps    = itunesEps.filter((ep) => !existingSlugs.has(ep.slug) && ep.guest);

  if (newEps.length === 0) {
    return NextResponse.json({ message: "No new episodes", synced: 0 });
  }

  // Fetch platform data in parallel
  const ytApiKey     = process.env.YOUTUBE_API_KEY ?? null;
  const spotifyToken = await getSpotifyToken();

  const [spotifyEps, ytVideos] = await Promise.all([
    spotifyToken ? getSpotifyEpisodes(spotifyToken) : Promise.resolve([]),
    ytApiKey     ? getYouTubeVideos(ytApiKey)       : Promise.resolve([]),
  ]);

  const spotifyItems = spotifyEps.map((e) => ({ title: e.name, url: e.external_urls.spotify }));
  const ytItems      = ytVideos.map((v: { title: string; videoId: string }) => ({ title: v.title, videoId: v.videoId }));

  const upserted: string[] = [];

  for (const ep of newEps) {
    const siIdx  = findByGuest(ep.guest, spotifyItems);
    const ytIdx  = findByGuest(ep.guest, ytItems.map((v: { title: string; videoId: string }) => ({ title: v.title })));

    const spotifyUrl  = siIdx >= 0  ? spotifyItems[siIdx].url : null;
    const youtubeUrl  = ytIdx  >= 0 ? `https://www.youtube.com/watch?v=${ytItems[ytIdx].videoId}` : null;

    const { error } = await supabase.from("episode_links").upsert({
      slug:        ep.slug,
      spotify_url: spotifyUrl,
      youtube_url: youtubeUrl,
    });

    if (!error) upserted.push(ep.slug);
  }

  return NextResponse.json({
    message:  "Sync complete",
    synced:   upserted.length,
    episodes: upserted,
  });
}
