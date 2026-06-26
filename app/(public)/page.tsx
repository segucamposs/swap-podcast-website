import Image from "next/image";
import Link from "next/link";
import {
  getAllEpisodes,
  getLatestEpisode,
  getEpisodeCount,
} from "@/lib/episodes/feed";
import EpisodeCard from "@/components/episodes/EpisodeCard";
import GuestCard from "@/components/guests/GuestCard";
import PlatformEmbed from "@/components/episodes/PlatformEmbed";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import SocialLinks from "@/components/layout/SocialLinks";

async function getLatestYouTubeVideoId(): Promise<string> {
  try {
    const res = await fetch(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCXu0Hjf9PLzy-WgoeeMteOQ",
      { next: { revalidate: 3600 } }
    );
    const xml = await res.text();
    // Split into entries and skip Shorts (their link contains /shorts/ not /watch?v=)
    const entries = xml.split("<entry>");
    for (const entry of entries) {
      if (entry.includes('href="https://www.youtube.com/watch?v=')) {
        const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        if (idMatch?.[1]) return idMatch[1];
      }
    }
    return "";
  } catch {
    return "";
  }
}

export const revalidate = 3600;

export default async function HomePage() {
  const [latestEpisode, allEpisodes, episodeCount, latestYouTubeVideoId] = await Promise.all([
    getLatestEpisode(),
    getAllEpisodes(),
    getEpisodeCount(),
    getLatestYouTubeVideoId(),
  ]);

  const recentEpisodes = allEpisodes.slice(0, 3);
  const featuredGuests = allEpisodes.slice(0, 4);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-black px-4 py-24 overflow-hidden"
        aria-label="Hero"
      >
        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,117,31,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 text-center w-full animate-fade-in-up">
          {/* Logo — wide, fills viewport */}
          <div className="max-w-xl mx-auto px-2 mb-8">
            <Image
              src="/logo/swap-logo-transparent.png"
              alt="SWAP Podcast"
              width={4923}
              height={1357}
              priority
              className="w-full h-auto"
            />
          </div>

          {/* Episode count badge + CTAs — narrower */}
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/25 rounded-full px-4 py-1.5 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" aria-hidden="true" />
              <span className="text-brand-orange text-xs font-medium font-mono">
                {episodeCount} episodios publicados
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-orange/85 transition-colors duration-200"
              >
                <Image src="/icons/spotify.png" alt="" width={18} height={18} className="object-contain brightness-0 invert" />
                Escuchar en Spotify
              </a>

              <Link
                href="/episodes"
                className="inline-flex items-center justify-center border border-white/20 text-white font-medium px-8 py-3.5 rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors duration-200"
              >
                Ver todos los episodios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest episode player ──────────────────────────────────── */}
      {latestEpisode && (
        <section className="bg-zinc-950 border-y border-white/5 py-16 px-4" aria-label="Último episodio">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-1">
                  Último episodio
                </p>
                <h2 className="text-2xl font-bold text-white">
                  Escuchanos ahora donde quieras
                </h2>
              </div>
              <Link
                href="/episodes"
                className="text-sm text-brand-orange hover:text-brand-orange/70 transition-colors duration-200 whitespace-nowrap hidden sm:block"
              >
                Ver todos →
              </Link>
            </div>

            <PlatformEmbed latestYouTubeVideoId={latestYouTubeVideoId} />
          </div>
        </section>
      )}

      {/* ── Latest episodes grid ───────────────────────────────────── */}
      <section className="bg-black py-20 px-4" aria-label="Últimos episodios">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 gap-4">
            <h2 className="text-3xl font-bold text-white">Últimos episodios</h2>
            <Link
              href="/episodes"
              className="text-sm text-brand-orange hover:text-brand-orange/70 transition-colors duration-200 whitespace-nowrap"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured guests ────────────────────────────────────────── */}
      <section className="bg-zinc-950 border-y border-white/5 py-20 px-4" aria-label="Invitados destacados">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-2">
                Invitados
              </p>
              <h2 className="text-3xl font-bold text-white">
                Las personas detrás de SWAP
              </h2>
            </div>
            <Link
              href="/invitados"
              className="text-sm text-brand-orange hover:text-brand-orange/70 transition-colors duration-200 whitespace-nowrap hidden sm:block"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredGuests.map((episode) => (
              <GuestCard key={episode.id} episode={episode} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/invitados"
              className="text-sm text-brand-orange hover:text-brand-orange/70 transition-colors duration-200"
            >
              Ver todos los invitados →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────────────────── */}
      <section className="bg-black py-20 px-4" aria-label="Newsletter">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-brand-orange text-xs font-medium uppercase tracking-widest font-mono mb-4">
            Newsletter
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Nuevo episodio, directo a tu mail
          </h2>
          <p className="text-white/40 text-base leading-relaxed mb-8">
            Cuando publicamos un episodio nuevo, te avisamos. Sin spam. Solo SWAP.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* ── Seguinos ───────────────────────────────────────────────── */}
      <section className="bg-zinc-950 border-y border-white/5 py-16 px-4" aria-label="Redes sociales">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-2">Seguinos</h2>
          <p className="text-white/35 text-sm mb-8">
            Estamos en Spotify, Apple Podcasts, YouTube, Instagram y TikTok.
          </p>
          <SocialLinks className="justify-center" size="md" />
        </div>
      </section>

      {/* ── Platforms strip ────────────────────────────────────────── */}
      <section
        className="bg-black border-t border-white/5 py-14 px-4"
        aria-label="Plataformas"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/30 text-sm uppercase tracking-widest mb-6 font-mono">
            Disponible en
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                label: "Spotify",
                href: "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",
              },
              {
                label: "Apple Podcasts",
                href: "https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081",
              },
              { label: "YouTube", href: "https://youtube.com/@SwapPodcast" },
            ].map((p) => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 font-medium hover:text-brand-orange transition-colors duration-200 text-sm"
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
