# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

Official website for SWAP Podcast — Spanish-language show for LATAM creators ages 16–25. The site exists only for SWAP: it's the production site the audience sees.

---

## Dev Commands

```bash
npm run dev      # start local server at localhost:3000
npm run build    # production build (Next.js runs type-check inside the compiler)
npm run lint     # ESLint flat config (eslint.config.mjs) — NOT next lint
npm start        # serve the production build locally
```

No test runner on `main`. CI (`.github/workflows/`) runs `lint` then `build` on every push/PR to `main`.

---

## Branches

| Branch | Status |
|---|---|
| `main` | Production — deployed to Vercel. All real work goes here. |
| `merch` | Archived. Merch store + Mercado Pago built for a (finished) university course; not used in real life. Don't port its store/admin/payment code to `main`. |

---

## Architecture

### Data flow — episodes

Typed by `lib/episodes/types.ts → Episode`:

1. **Live RSS** — `lib/episodes/feed.ts` fetches the Anchor/Spotify RSS feed (`anchor.fm/s/1004ba98c/podcast/rss`) with ISR `revalidate: 3600`. XML is parsed with hand-rolled regex helpers (`rssTag`, `rssAttr`, `extractCDATA`) — no XML library. `parseTitle` handles `"Topic | Guest"` (current) and `"Topic - Guest #N"` (early episodes); the slug comes from the guest name via `toSlug`. `getAllEpisodes` is wrapped in React `cache()`, so calling it (or `getEpisodeCount` / `getEpisodeBySlug`) several times in one render costs one fetch + parse.
2. **Platform links (3-tier)** — per episode, Spotify/YouTube/Apple URLs resolve from: Supabase `episode_links` → `lib/episodes/overrides.ts` (hand-maintained map) → show-level default URL.
3. **Guest photos** — `lib/episodes/guest-meta.ts` maps guest slug → candid photo + aspect ratio.
4. **Static fallback** — `lib/episodes/data.ts`; returned if the RSS fetch fails so the site never breaks.

### Routes

- `app/(public)/` — home, `episodes`, `episodes/[slug]`, `about`, `contact`. Shared layout: Lenis smooth scroll, PageTransition overlay, StickyHeader, Navbar, Footer.
- `app/(public)/_invitados/` — guests timeline, **on standby**: the `_` prefix makes it a private folder, so the route is disabled while the code is kept. Rename to `invitados` to re-enable (and restore the Footer link).
- `app/redes/` — link-in-bio style page (outside the public layout).
- `app/api/newsletter` — `POST` subscriber capture (Zod-validated).
- `app/api/sync-episode-links` — daily Vercel cron (`vercel.json`, 10:00 UTC). Reads RSS, matches new episodes to Spotify (Client Credentials) and YouTube (Data API) URLs, batch-upserts into `episode_links` with the service-role key, then revalidates `/`, `/episodes` and `/episodes/[slug]`. Auth: `Authorization: Bearer <CRON_SECRET>` (Vercel) or `x-sync-secret: <CRON_SECRET>` (manual).

### Supabase

Migrations in `supabase/migrations/`: `subscribers` (0001, 0002) and `episode_links` (0003), both with RLS. `lib/supabase/client.ts` (anon key) returns `null` when env vars are absent so callers degrade gracefully.

### Key env vars

| Var | Where used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase/client.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | cron route (writes `episode_links`) |
| `CRON_SECRET` | cron auth |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `YOUTUBE_API_KEY` | cron route |

### Images

`next.config.ts` allows `**.mzstatic.com` (Apple artwork) and `**.cloudfront.net` (Anchor episode artwork); image `qualities` is `[75, 90]`. With `next/image`, always give the **rendered** size — a fixed-height image gets `width`/`height` matching its CSS size, a fluid one gets an accurate `sizes`. Passing the source file's pixel dimensions with no `sizes` makes Next serve the 3840 px variant to every device (this happened with the logo).

### Favicon

`app/icon.png` (512 px) + `app/favicon.ico` (16/32/48), generated from the white "S." mark on a transparent background.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript strict mode |
| Styling | Tailwind CSS v4 — CSS-first, no `tailwind.config`; brand tokens in `app/globals.css` under `@theme` |
| Animations | Lenis (smooth scroll) + Motion v12 |
| Database | Supabase (PostgreSQL + RLS) |
| Deployment | Vercel + GitHub Actions CI |

---

## Brand Identity

### Colors
| Role | Tailwind token | Hex |
|---|---|---|
| Primary | `brand-orange` | `#ff751f` |
| Accent | `brand-gray` | `#a6a6a6` |
| Background | — | `#000000` |

### Typography
| Role | Font | CSS var |
|---|---|---|
| Headings | Space Grotesk | `--font-space-grotesk` |
| Body | Poppins | `--font-poppins` |
| Mono / accents | Geist Mono | `--font-geist-mono` |

Loaded via `next/font` in `app/layout.tsx`. Logos live in `public/logo/`.

### Visual Direction
Raw and minimal, professional without being corporate, typography-forward, dark (black base with orange accents).

### Voice & Tone
Argentine Spanish, vos form, peer-to-peer. Casual and conversational — never lecturing from above. If a complex term appears, explain it.

### Content Pillars
Health & wellness · Productivity · Personal development · Career · Entrepreneurship · AI & tech · Mindset

---

## Platform Links

| Platform | Handle / URL |
|---|---|
| Spotify | `https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY` |
| Apple Podcasts | `https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081` |
| YouTube | `@SwapPodcast` |
| Instagram | `@swapodcast` |
| TikTok | `@swappodcast` |
| Email | `podcastswap@gmail.com` |

**Hosts:** Segu (Segundo Campos) and Francisco Bottaro.

---

## Code Standards

- TypeScript strict mode — no `any`
- Server Components by default; `"use client"` only when needed
- API routes return proper HTTP status codes and JSON error messages
- Forms validated client-side and server-side (Zod)
- No hardcoded secrets — `.env.local` locally, Vercel env vars in prod
- Commit messages: `type(scope): description` (e.g. `feat(episodes): add catalog page`)
