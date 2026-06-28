# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Dev Commands

```bash
npm run dev      # start local server at localhost:3000
npm run build    # production build (Next.js runs type-check inside the compiler)
npm run lint     # ESLint flat config (eslint.config.mjs) — NOT next lint
npm start        # serve the production build locally
```

No test runner is wired up yet — Playwright will be added later. CI runs `lint` then `build` on every push/PR to `main`.

---

## Architecture

### Data flow — episodes

Episode data flows through a layered pipeline, all typed by `lib/episodes/types.ts → Episode`:

1. **Live RSS** — `lib/episodes/feed.ts` fetches the Anchor/Spotify RSS feed (`anchor.fm/s/1004ba98c/podcast/rss`) with ISR `revalidate: 3600`. XML is parsed with regex (no xml2js or similar — hand-rolled helpers `rssTag`, `rssAttr`, `extractCDATA`). `parseTitle` handles two title formats: `"Topic | Guest"` (current) and `"Topic - Guest #N"` (early episodes). Slug is derived from the guest name via `toSlug`.
2. **Platform link merge (3-tier)** — for each episode's Spotify/YouTube/Apple URL, `feed.ts` resolves in order of precedence:
   - Supabase `episode_links` table (populated by the daily cron)
   - `lib/episodes/overrides.ts` — hand-maintained static map for older episodes not yet in the DB
   - Show-level default URL (falls back to the SWAP show page)
3. **Guest photo layer** — `lib/episodes/guest-meta.ts` maps each guest slug to a candid photo path and aspect ratio. The `/invitados` page only shows guests present in **both** the RSS feed and this map — entries with no matching RSS slug are silently held back until the feed catches up.
4. **Static fallback** — `lib/episodes/data.ts` (3 hardcoded episodes). `feed.ts` returns this list if the RSS fetch fails so the site never breaks.

### Route groups

- `app/(public)/` — public-facing pages (home, episodes, `episodes/[slug]`, about, contact, invitados). Shared layout adds Navbar + Footer.
- `app/api/` — Route Handlers: `POST /api/newsletter` (subscriber capture) and `GET /api/sync-episode-links` (cron-protected).
- `app/admin/` — **not yet built.** Will be auth-protected via middleware.

### Episode link sync (cron)

`app/api/sync-episode-links/route.ts` runs on a **Vercel cron** (`vercel.json`) daily at 10:00 UTC. It reads new episode slugs from RSS, fetches matching Spotify URLs (Client Credentials flow) and YouTube URLs (YouTube Data API), and upserts into Supabase `episode_links` using the service-role key (bypasses RLS).

Auth: Vercel sends `Authorization: Bearer <CRON_SECRET>`; manual runs pass `x-sync-secret: <CRON_SECRET>`.

### Supabase

Two tables, both with RLS:

| Table | Purpose | Migrations |
|---|---|---|
| `subscribers` | Newsletter sign-ups | `0001_subscribers.sql`, `0002_subscribers_add_name.sql` |
| `episode_links` | Per-episode Spotify/YouTube URLs | `0003_episode_links.sql` |

`lib/supabase/client.ts` (`getSupabaseClient()`) returns `null` when env vars are absent — all callers handle this gracefully. The schema lives in `supabase/migrations/`.

`@supabase/ssr` is installed but currently unused — it will be needed when the admin auth layer (server-side sessions) is built.

### Key env vars

| Var | Where used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/client.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase/client.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sync-episode-links/route.ts` (bypasses RLS for writes) |
| `CRON_SECRET` | Vercel cron auth + manual `x-sync-secret` header |
| `SPOTIFY_CLIENT_ID` | `sync-episode-links/route.ts` (Client Credentials flow) |
| `SPOTIFY_CLIENT_SECRET` | `sync-episode-links/route.ts` |
| `YOUTUBE_API_KEY` | `sync-episode-links/route.ts` |

### External image domains

`next.config.ts` allows `**.mzstatic.com` (Apple artwork) and `**.cloudfront.net` (Anchor/Spotify episode artwork). Image `qualities` is set to `[75, 90]` to enable the `q90` quality used on the About page hero. Add new hosts there if additional image sources are introduced.

---

## Project Overview

Official website for SWAP Podcast — Spanish-language show for LATAM creators ages 16–25.
Also the final project for **Programación Web (ITBA)**. Every build decision must satisfy both goals: a real, production-quality podcast site AND full coverage of the course syllabus.

---

## Branching Strategy

| Branch | Purpose | Mercado Pago? |
|---|---|---|
| `main` | Real production site — what the audience sees | No |
| `merch` | Course submission version — adds a merch store on top of `main` | Yes |

All Mercado Pago / checkout / webhook code lives exclusively in the `merch` branch.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript strict mode |
| Styling | Tailwind CSS v4 — CSS-first, no `tailwind.config` file; brand tokens in `app/globals.css` under `@theme` |
| Animations | Lenis (smooth scroll) + Motion / Framer Motion v12 — wired via `components/providers/` |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Payments | Mercado Pago (merch branch only) |
| Deployment | Vercel + GitHub Actions (CI/CD) |

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

Fonts are loaded via `next/font` in `app/layout.tsx`. Brand colors and keyframes are declared in `app/globals.css` under `@theme`.

### Voice & Tone
Argentine Spanish, vos form, peer-to-peer. Casual and conversational — never lecturing from above. If a complex term appears, explain it.

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

## Current Project Structure

What is actually built on `main` today (sections marked `# not built yet` don't exist):

```
swap-podcast-website/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Home / landing
│   │   ├── episodes/
│   │   │   ├── page.tsx          # Episode catalog (ISR revalidate: 3600)
│   │   │   └── [slug]/page.tsx   # Episode detail
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx      # Newsletter form + mailto link (no API route)
│   │   └── invitados/page.tsx    # Guests timeline (serpentine scroll)
│   ├── admin/                    # not built yet — auth-protected
│   ├── api/
│   │   ├── newsletter/route.ts
│   │   ├── sync-episode-links/route.ts   # Vercel cron — daily platform link sync
│   │   ├── contact/route.ts              # not built yet
│   │   └── webhooks/
│   │       └── mercadopago/route.ts      # merch branch only
│   └── payment/                          # merch branch only
├── components/
│   ├── ui/                       # Reusable primitives
│   ├── about/ episodes/ guests/ home/ layout/ newsletter/
│   └── providers/                # InitialOverlay, LenisProvider, PageTransition
├── lib/
│   ├── episodes/                 # feed.ts, data.ts, types.ts, guest-meta.ts, overrides.ts
│   ├── supabase/                 # client.ts
│   └── validations/              # Zod schemas
├── tests/                        # not built yet — Playwright E2E
└── supabase/
    └── migrations/
```

---

## Required Concepts (course syllabus — must be demonstrably present)

The following must be present and working in the final submission. The `merch` branch adds Mercado Pago on top.

- **Git/DevOps:** GitHub Actions CI (lint + build), Vercel preview per PR, branch protection
- **HTML:** Semantic elements, accessible forms, alt text, aria-labels, WCAG focus states
- **CSS:** Flexbox + grid + box model, responsive (mobile-first), CSS custom properties, animations
- **JavaScript:** DOM manipulation, event handling, `localStorage`, `fetch`, JSON parsing
- **React:** `useState`, `useEffect`, custom hooks, controlled forms, API consumption
- **Next.js:** Layouts, nested routes, route groups, Server + Client Components, dynamic routes, middleware for `/admin`
- **Supabase:** SQL schema, CRUD, Auth (sign in/out/session), RLS policies
- **Auth:** Login/logout, role-based access, protected routes, session persistence
- **API/Backend:** Route Handlers, REST status codes, Zod validation, consistent error responses
- **Mercado Pago** *(merch only)*: checkout preference, payment status pages, webhook handler
- **Testing:** Playwright E2E covering at least one critical flow

---

## Code Standards

- TypeScript strict mode — no `any`
- Server Components by default; `"use client"` only when needed
- API routes return proper HTTP status codes and JSON error messages
- All forms validated client-side and server-side (Zod)
- Commit messages: `type(scope): description` (e.g. `feat(episodes): add catalog page`)
