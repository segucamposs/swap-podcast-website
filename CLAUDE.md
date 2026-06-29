# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Dev Commands

```bash
npm run dev      # start local server at localhost:3000
npm run build    # production build (Next.js runs type-check inside the compiler)
npm run lint     # ESLint flat config (eslint.config.mjs) — NOT next lint
npm start        # serve the production build locally
npm test         # Playwright E2E tests (auto-starts dev server)
npm run test:ui  # Playwright in interactive UI mode
```

CI runs `lint` then `build` on every push/PR to `main`. Playwright config is in `playwright.config.ts` — tests live in `tests/`.

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

- `app/(public)/` — public-facing pages (home, episodes, `episodes/[slug]`, about, contact, invitados, store, `store/[slug]`, `store/cart`). Shared layout adds Navbar + Footer.
- `app/api/` — Route Handlers:
  - `POST /api/newsletter` — subscriber capture
  - `GET /api/sync-episode-links` — cron-protected platform link sync
  - `POST /api/checkout` — creates MP preference + order in Supabase; re-fetches prices from DB (never trusts client amounts)
  - `GET/POST /api/admin/products` — product CRUD (service-role; requires admin session)
  - `PATCH/DELETE /api/admin/products/[id]` — update/delete single product
  - `GET /api/admin/orders` — order listing for admin
  - `POST /api/webhooks/mercadopago` — payment status updates from MP (merch branch only)
- `app/admin/` — auth-protected dashboard (login, products, orders). Uses `@supabase/ssr` cookie sessions.
- `app/payment/` — success / failure / pending pages after MP redirect (merch branch only).

### Episode link sync (cron)

`app/api/sync-episode-links/route.ts` runs on a **Vercel cron** (`vercel.json`) daily at 10:00 UTC. It reads new episode slugs from RSS, fetches matching Spotify URLs (Client Credentials flow) and YouTube URLs (YouTube Data API), and upserts into Supabase `episode_links` using the service-role key (bypasses RLS).

Auth: Vercel sends `Authorization: Bearer <CRON_SECRET>`; manual runs pass `x-sync-secret: <CRON_SECRET>`.

### Supabase

Tables (all with RLS), migrations in `supabase/migrations/`:

| Table | Purpose | Migration |
|---|---|---|
| `subscribers` | Newsletter sign-ups | `0001`, `0002` |
| `episode_links` | Per-episode Spotify/YouTube URLs | `0003` |
| `products` | Merch catalog | `0004` |
| `orders` + `order_items` | Purchase history | `0005` |
| `decrement_stock` | RPC for atomic stock reduction | `0006` |
| product sizes column | `sizes text[]` added to products | `0007` |

**Three Supabase clients** in `lib/supabase/`:

| File | Client type | Used in |
|---|---|---|
| `client.ts` | Anon key, `createClient` | Public API routes (`newsletter`) |
| `server.ts` | Anon key, `createServerClient` (cookie-based via `@supabase/ssr`) | Admin Server Components + middleware session check |
| `service.ts` | Service-role key, bypasses RLS | Admin API routes that write data |

All three return `null` when env vars are absent so callers fail gracefully.

### Key env vars

| Var | Where used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All three Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `client.ts`, `server.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `service.ts` — admin writes + cron |
| `CRON_SECRET` | Vercel cron auth + manual `x-sync-secret` header |
| `SPOTIFY_CLIENT_ID` | `sync-episode-links/route.ts` |
| `SPOTIFY_CLIENT_SECRET` | `sync-episode-links/route.ts` |
| `YOUTUBE_API_KEY` | `sync-episode-links/route.ts` |
| `MP_ACCESS_TOKEN` | `lib/mercadopago/client.ts` — preference creation + webhook verification |
| `ADMIN_EMAILS` | `proxy.ts` — comma-separated allowlist for `/admin` access |

### Admin auth middleware

`proxy.ts` at the project root implements the `/admin/*` route guard using `@supabase/ssr`. It reads the Supabase session cookie, verifies the user's email against the `ADMIN_EMAILS` env var (comma-separated), and redirects unauthenticated or unauthorized requests to `/admin/login`.

**Note:** Next.js middleware must be at `middleware.ts` — `proxy.ts` is currently not auto-loaded by the framework. It needs to be renamed or re-exported from `middleware.ts` to take effect in production.

### Merch store flow (merch branch)

```
/store          → product listing (fetched from Supabase via lib/store/products.ts)
/store/[slug]   → product detail + add-to-cart
/store/cart     → cart review + checkout form (CartContext in localStorage)
POST /api/checkout  → validates cart, recomputes prices from DB, creates order row,
                      calls lib/mercadopago/client.ts → returns MP init_point URL
/payment/success|failure|pending  → post-redirect status pages
POST /api/webhooks/mercadopago    → updates order status from MP notification
```

Cart state is persisted in `localStorage` via a React context in `components/providers/`. Admin product/order management lives under `/admin/products` and `/admin/orders`.

Scripts in `scripts/`:
- `seed-products.mjs` — seed the `products` table for local dev
- `migrate-sizes.mjs` — one-time migration to add the `sizes` column

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

`main` branch has the public podcast site. `merch` branch adds the store, admin, and payment layers on top.

```
swap-podcast-website/
├── proxy.ts                      # Admin middleware (needs rename → middleware.ts to activate)
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Home / landing
│   │   ├── episodes/[slug]/      # Episode catalog + detail (ISR revalidate: 3600)
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── invitados/page.tsx    # Guests timeline (serpentine scroll)
│   │   └── store/                # merch branch: listing, [slug], cart
│   ├── admin/                    # merch branch: layout, login, products, orders
│   ├── api/
│   │   ├── newsletter/route.ts
│   │   ├── sync-episode-links/route.ts   # Vercel cron — daily platform link sync
│   │   ├── checkout/route.ts             # merch branch
│   │   ├── admin/products/               # merch branch: GET/POST + [id] PATCH/DELETE
│   │   ├── admin/orders/                 # merch branch: GET
│   │   └── webhooks/mercadopago/         # merch branch
│   └── payment/                          # merch branch: success/failure/pending
├── components/
│   ├── ui/                       # Reusable primitives
│   ├── admin/                    # AdminShell, AdminLoginForm, product/order clients
│   ├── store/                    # merch branch: product cards, cart, checkout form
│   └── providers/                # InitialOverlay, LenisProvider, PageTransition, CartContext
├── lib/
│   ├── episodes/                 # feed.ts, data.ts, types.ts, guest-meta.ts, overrides.ts
│   ├── supabase/                 # client.ts, server.ts, service.ts
│   ├── store/                    # products.ts (DB fetching), types.ts (Product, Order, CartItem)
│   ├── mercadopago/              # client.ts — getMPConfig, createMPPreference
│   └── validations/              # Zod schemas (store, newsletter)
├── scripts/
│   ├── seed-products.mjs         # Seed products table for local dev
│   └── migrate-sizes.mjs         # One-time migration for sizes column
├── tests/
│   └── store.spec.ts             # Playwright E2E: catalog, cart, checkout, admin auth
└── supabase/
    └── migrations/               # 0001–0007
```

---

## Required Concepts (course syllabus — must be demonstrably present)

The following must be present and working in the final submission. The `merch` branch adds Mercado Pago on top.

- **Git/DevOps:** GitHub Actions CI (lint + build), Vercel preview per PR, branch protection
- **HTML:** Semantic elements, accessible forms, alt text, aria-labels, WCAG focus states
- **CSS:** Flexbox + grid + box model, responsive (mobile-first), CSS custom properties, animations
- **JavaScript:** DOM manipulation, event handling, `localStorage`, `fetch`, JSON parsing
- **React:** `useState`, `useEffect`, custom hooks, controlled forms, API consumption
- **Next.js:** Layouts, nested routes, route groups, Server + Client Components, dynamic routes, middleware for `/admin` (via `proxy.ts` → needs `middleware.ts`)
- **Supabase:** SQL schema, CRUD, Auth (sign in/out/session), RLS policies
- **Auth:** Login/logout via Supabase Auth + `@supabase/ssr`, role-based access via `ADMIN_EMAILS` allowlist, protected routes, session persistence via cookies
- **API/Backend:** Route Handlers, REST status codes, Zod validation, consistent error responses
- **Mercado Pago** *(merch only)*: checkout preference, payment status pages, webhook handler
- **Testing:** Playwright E2E in `tests/store.spec.ts` — covers catalog, cart, checkout validation, admin redirect

---

## Code Standards

- TypeScript strict mode — no `any`
- Server Components by default; `"use client"` only when needed
- API routes return proper HTTP status codes and JSON error messages
- All forms validated client-side and server-side (Zod)
- Commit messages: `type(scope): description` (e.g. `feat(episodes): add catalog page`)
