# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Dev Commands

```bash
npm run dev      # start local server at localhost:3000
npm run build    # production build (runs type-check + Next.js compiler)
npm run lint     # ESLint via eslint-config-next
npm start        # serve the production build locally
```

No test runner is wired up yet — Playwright will be added later. CI runs `lint` then `build` on every push/PR to `main`.

---

## Architecture

### Data flow — episodes

Episode data has two sources, merged under a single interface (`lib/episodes/types.ts → Episode`):

1. **Live** — `lib/episodes/feed.ts` fetches the iTunes/Apple Podcasts public API (no auth, no API key). All pages use this path. ISR revalidation is set to `3600` seconds so fetches are cached at the edge.
2. **Static fallback** — `lib/episodes/data.ts` holds a handful of hardcoded episodes. `feed.ts` catches any iTunes API error and returns this list instead, so the site never breaks.

The feed parses SWAP's title format `"Topic | Guest Name"` into separate `topic` and `guest` fields and derives `slug` from the guest name.

### Route groups

- `app/(public)/` — public-facing pages (home, episodes, episodes/[slug], about, contact, invitados). Shared layout adds Navbar + Footer.
- `app/api/` — Route Handlers. Only `POST /api/newsletter` exists today.
- `app/admin/` — **not yet built.** Will be auth-protected via middleware.

### Supabase

Used only for newsletter subscribers right now. `lib/supabase/client.ts` returns `null` when env vars are absent so the newsletter form degrades gracefully before Supabase is configured. The schema lives in `supabase/migrations/`.

### Key env vars

| Var | Where used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/client.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase/client.ts` |

### External image domains

`next.config.ts` allows `**.mzstatic.com` (iTunes artwork CDN). Add more hosts there if new image sources are introduced.

---

## Project Overview

Official website for SWAP Podcast — Spanish-language show for LATAM creators ages 16–25.
Also the final project for **Programación Web (ITBA)**. Every build decision must satisfy both goals: a real, production-quality podcast site AND full coverage of the course syllabus.

---

## Branching Strategy

Two permanent branches, two different purposes:

| Branch | Purpose | Mercado Pago? |
|---|---|---|
| `main` | Real production site — what the audience sees | No |
| `merch` | Course submission version — adds a merch store on top of `main` | Yes |

**Flow:**
1. Build the full website on `main` (everything except payments)
2. Branch `merch` off `main` and add the merch store + Mercado Pago integration there
3. Submit `merch` to the professor for grading
4. After approval, `main` stays as the live production site — no merch store, no payments

All Mercado Pago / checkout / webhook code lives exclusively in the `merch` branch.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Payments | Mercado Pago (merch branch only) |
| Deployment | Vercel + GitHub Actions (CI/CD) |
| Testing | Playwright (E2E) + manual DevTools |

---

## Brand Identity

### Colors
| Role | Color | Hex |
|---|---|---|
| Primary | Orange | `#ff751f` |
| Secondary | Black | `#000000` |
| Accent | Gray | `#a6a6a6` |

### Typography
| Role | Font | Source |
|---|---|---|
| Headings | Space Grotesk | Google Fonts |
| Body | Poppins | Google Fonts |
| Mono / accents | Geist Mono | Vercel |

### Logo Files
Located at `DB/Logo/` (to be added to the repo under `public/`):
- `SWAP Logo.png` — main logo (light/solid backgrounds)
- `swap-logo-transparent.png` — for dark backgrounds and overlays
- `Logo Episodios.png` — episode variant

### Visual Direction
- Raw and minimal — authentic conversation feel, not over-produced
- Professional without being corporate
- Clean, typography-forward design
- Dark backgrounds preferred (black base with orange accents)

### Voice & Tone
- Argentine Spanish, vos form, local expressions
- Casual and conversational — like talking with friends
- Peer-to-peer: hosts learn alongside listeners, never lecturing from above
- Curious and genuine — never fake enthusiasm
- Simple language — if a complex term appears, explain it

### Content Pillars
Health & wellness · Productivity · Personal development · Career · Entrepreneurship · AI & tech · Mindset

---

## Platform Links (for footer / about page)

| Platform | Handle |
|---|---|
| Spotify | `https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY` |
| Apple Podcasts | `https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081` |
| YouTube | `@SwapPodcast` |
| Instagram | `@swapodcast` |
| TikTok | `@swappodcast` |
| Email | `podcastswap@gmail.com` |

**Hosts:** Segu (Segundo Campos) and Francisco Bottaro.

---

## Required Concepts (course syllabus)

Everything here must be demonstrably present and working in the codebase.

### Git & DevOps
- Branches, commits with meaningful messages, pull requests
- GitHub Actions CI pipeline (lint + build on every PR)
- Vercel deploy with preview per PR, environment variables, logs
- Branch protection: PRs required to merge into `main`

### HTML
- Semantic elements throughout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Forms with proper labels, inputs, and fieldsets
- Accessibility: alt text, aria-labels, focus states, color contrast (WCAG basics)

### CSS
- Box model, flexbox, grid — all three used where appropriate
- Responsive design (mobile-first)
- Animations (at least one meaningful transition or animation)
- CSS custom properties (variables) — via Tailwind config or custom stylesheet

### JavaScript
- Variables, arrays, objects, functions
- DOM manipulation and event handling
- `localStorage` usage (e.g. persist user preferences or draft state)
- `JSON` parsing/serialization
- `fetch` for async data (client components hitting internal API routes)

### React
- JSX, functional components, props
- State with `useState`, side effects with `useEffect`
- Custom hooks where logic is reusable
- Controlled forms
- Consuming APIs from components

### Next.js
- App Router: layouts, nested routes, route groups
- Server Components (default) and Client Components (`"use client"` only when needed)
- Dynamic routes (`[slug]`, `[id]`)
- Data fetching (server-side with `async` components, client-side with `fetch`)
- Middleware (session check for `/admin`)

### Supabase
- SQL schema design: tables, columns, data types, primary/foreign keys, relations
- CRUD operations (create, read, update, delete)
- Supabase Auth: sign in, sign out, session management
- Row Level Security (RLS) policies

### Authentication & Authorization
- Login and logout flows
- Role-based access (admin vs public)
- Protected routes via middleware
- Session persistence

### APIs & Backend
- Next.js Route Handlers (`/api/*`)
- REST conventions: correct HTTP methods and status codes
- Request validation (Zod)
- Error handling and consistent JSON error responses

### Mercado Pago *(merch branch only)*
- Checkout preference creation
- Payment status handling (success, failure, pending)
- Webhook endpoint that receives and processes payment events

### Testing & Quality
- Chrome DevTools usage throughout development
- Manual testing of all flows
- Playwright E2E tests covering at least one critical flow

---

## Project Structure

```
swap-podcast-website/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Home / landing
│   │   ├── episodes/
│   │   │   ├── page.tsx          # Episode catalog
│   │   │   └── [slug]/page.tsx   # Episode detail
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── layout.tsx            # Auth-protected layout
│   │   ├── page.tsx              # Dashboard
│   │   └── episodes/
│   │       ├── page.tsx
│   │       ├── new/page.tsx
│   │       └── [id]/edit/page.tsx
│   ├── api/
│   │   ├── episodes/
│   │   │   ├── route.ts          # GET all, POST
│   │   │   └── [slug]/route.ts   # GET one
│   │   ├── contact/route.ts
│   │   ├── newsletter/route.ts
│   │   └── webhooks/
│   │       └── mercadopago/route.ts   # merch branch only
│   └── payment/                       # merch branch only
│       ├── success/page.tsx
│       ├── failure/page.tsx
│       └── pending/page.tsx
├── components/
│   ├── ui/                       # Reusable primitives
│   ├── episodes/
│   └── layout/                   # Nav, Footer
├── lib/
│   ├── supabase/                 # Client + server helpers
│   ├── mercadopago/              # merch branch only
│   └── validations/              # Zod schemas
├── public/
│   └── logo/                     # SWAP logo files
├── .github/
│   ├── workflows/ci.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── tests/                        # Playwright E2E
└── supabase/
    └── migrations/
```

---

## Code Standards

- TypeScript strict mode — no `any`
- Server Components by default; `"use client"` only when needed
- API routes return proper HTTP status codes and JSON error messages
- All forms validated client-side and server-side (Zod)
- No hardcoded secrets — `.env.local` locally, Vercel env vars in prod
- Commit messages: `type(scope): description` (e.g. `feat(episodes): add catalog page`)
