/**
 * Episode-specific platform URLs that can't be derived from the iTunes API.
 * Key: guest slug (matches the /episodes/[slug] URL segment).
 * Spotify scraping only surfaces the 6 most recent episodes without full auth;
 * add older episodes here as you publish them or look them up on each platform.
 */
export const episodeOverrides: Record<
  string,
  { spotifyUrl?: string; youtubeUrl?: string }
> = {
  // ── Most recent (scraped) ────────────────────────────────────────────────
  "eduardo-martins": {
    spotifyUrl: "https://open.spotify.com/episode/0a7mdqRHodzaNNjolXBLrX",
    youtubeUrl: "https://www.youtube.com/watch?v=eShX5CGSoZM",
  },
  "ivan-briones": {
    spotifyUrl: "https://open.spotify.com/episode/2beHgq6vtulLULQaDCxawN",
    youtubeUrl: "https://www.youtube.com/watch?v=bivuWBlQgYw",
  },
  "francis-holway": {
    spotifyUrl: "https://open.spotify.com/episode/5tdnj2PcO9bcackZ82h6j0",
    youtubeUrl: "https://www.youtube.com/watch?v=IX_Cs8HairM",
  },
  "mauro-dominguez": {
    spotifyUrl: "https://open.spotify.com/episode/5HQZjW9fBd2w0zaTGLN7Uw",
    // not on YouTube
  },
  "rafa-smith-estrada": {
    spotifyUrl: "https://open.spotify.com/episode/4dAljZkd2yaVXNmGmHEWce",
  },
  "bernardo-barcena": {
    spotifyUrl: "https://open.spotify.com/episode/4a1uoXvYVU5FOKbULGpJ8t",
  },

  // ── Older episodes — add Spotify episode URL + YouTube video URL below ──
  // Find them at: open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY (right-click episode → Copy link)
  // and: youtube.com/@SwapPodcast/videos
  //
  // "nombre-invitado": {
  //   spotifyUrl: "https://open.spotify.com/episode/EPISODE_ID",
  //   youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID",
  // },
};
