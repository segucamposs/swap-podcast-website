# SWAP Podcast Website

Official website for [SWAP Podcast](https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY) — a Spanish-language show for LATAM creators ages 16–25. Also the final project for **Programación Web (ITBA)**.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Payments | Mercado Pago (`merch` branch only) |
| Deployment | Vercel + GitHub Actions CI |
| Testing | Playwright (E2E) |

## Branches

| Branch | Purpose |
|---|---|
| `main` | Production site — what the audience sees |
| `merch` | Course submission — adds merch store + Mercado Pago |

Build everything on `main` first. Branch `merch` off `main` and add the store there.

## Local dev

```bash
cp .env.example .env.local   # fill in your Supabase keys
npm install
npm run dev                  # http://localhost:3000
```

## Scripts

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint check
```

## Project structure

```
app/
├── (public)/         # Public-facing pages (Navbar + Footer layout)
│   ├── page.tsx      # Home
│   ├── episodes/     # Catalog + detail pages
│   ├── about/
│   └── contact/
├── admin/            # Auth-protected dashboard
├── api/              # Route handlers (REST)
└── layout.tsx        # Root layout (fonts, metadata)

components/
├── layout/           # Navbar, Footer
└── episodes/         # EpisodeCard, etc.

lib/
├── episodes/         # Types + data accessor (swap for Supabase later)
├── supabase/         # Client + server helpers (coming soon)
└── validations/      # Zod schemas (coming soon)
```

## Hosts

**Segu** (Segundo Campos) · **Francisco Bottaro**

📧 podcastswap@gmail.com
