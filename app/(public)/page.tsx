import Image from "next/image";
import Link from "next/link";
import {
  getAllEpisodes,
  getLatestEpisode,
  getEpisodeCount,
} from "@/lib/episodes/feed";
import EpisodeCard from "@/components/episodes/EpisodeCard";
import GuestCard from "@/components/guests/GuestCard";
import SpotifyPlayerCard from "@/components/episodes/SpotifyPlayerCard";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import SocialLinks from "@/components/layout/SocialLinks";

export const revalidate = 3600;

export default async function HomePage() {
  const [latestEpisode, allEpisodes, episodeCount] = await Promise.all([
    getLatestEpisode(),
    getAllEpisodes(),
    getEpisodeCount(),
  ]);

  const recentEpisodes = allEpisodes.slice(0, 3);
  const featuredGuests = allEpisodes.slice(0, 4);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[88vh] flex items-center justify-center bg-black px-4 py-24 overflow-hidden"
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

        <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-in-up">
          <Image
            src="/logo/swap-logo-transparent.png"
            alt="SWAP Podcast"
            width={160}
            height={64}
            priority
            className="mx-auto mb-10 h-16 w-auto"
          />

          {/* Episode count badge */}
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/25 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" aria-hidden="true" />
            <span className="text-brand-orange text-xs font-medium font-mono">
              {episodeCount} episodios publicados
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Conversaciones reales
            <br />
            <span className="text-brand-orange">
              para pibes que construyen.
            </span>
          </h1>

          <p className="text-white/55 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10">
            El podcast para los que tienen más de una pasión y no saben qué
            hacer con ellas. En español, sin filtros, sin poses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-orange/85 transition-colors duration-200"
            >
              {/* Spotify icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
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
                  Escuchalo ahora
                </h2>
              </div>
              <Link
                href="/episodes"
                className="text-sm text-brand-orange hover:text-brand-orange/70 transition-colors duration-200 whitespace-nowrap hidden sm:block"
              >
                Ver todos →
              </Link>
            </div>

            {/* Platform picker */}
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest text-center mb-4">
              Escuchanos ahora donde quieras
            </p>
            <div className="flex items-stretch bg-zinc-900 border border-white/[0.08] rounded-full p-1.5 mb-6 max-w-lg mx-auto">
              {/* Spotify — active */}
              <a
                href="https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY"
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-black rounded-full px-4 py-2.5 text-white text-sm font-semibold"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Spotify
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com/@SwapPodcast"
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white/55 text-sm font-medium hover:text-white/80 transition-colors duration-150"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
              {/* Apple Podcasts */}
              <a
                href="https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081"
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white/55 text-sm font-medium hover:text-white/80 transition-colors duration-150"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm6.526 2.485c3.658.077 7.271 2.68 8.604 5.906.4.94.63 1.966.696 3.005.044.71.034 1.44-.16 2.128-.08.295-.203.55-.406.775-.24.261-.558.37-.899.36a1.27 1.27 0 0 1-1.016-.584 1.807 1.807 0 0 1-.252-.743 7.195 7.195 0 0 0-2.045-4.406 7.267 7.267 0 0 0-4.7-2.208 7.315 7.315 0 0 0-5.76 2.128A7.35 7.35 0 0 0 4.85 13.81a1.85 1.85 0 0 1-.278.808 1.292 1.292 0 0 1-1.036.572c-.36.004-.67-.12-.912-.378a1.574 1.574 0 0 1-.375-.732 5.54 5.54 0 0 1-.111-1.322c.106-1.924.736-3.742 1.82-5.196C5.447 4.553 8.418 2.41 11.866 2.485zm.06 4.249a6.76 6.76 0 0 1 5.6 3.49c.49.872.735 1.857.72 2.852.006.72-.158 1.44-.52 2.062a1.307 1.307 0 0 1-.9.658c-.302.065-.593.03-.868-.098a1.459 1.459 0 0 1-.761-1.02 4.987 4.987 0 0 0-1.64-2.97 5.037 5.037 0 0 0-6.997.5 5.116 5.116 0 0 0-1.237 3.032c-.044.421-.214.786-.515 1.067-.267.25-.6.39-.96.375a1.3 1.3 0 0 1-.822-.327 1.614 1.614 0 0 1-.46-.817 5.856 5.856 0 0 1-.058-2.207 8.284 8.284 0 0 1 2.01-4.37 8.107 8.107 0 0 1 6.408-3.227zm-.037 4.283c1.52.055 2.9 1.07 3.398 2.502.3.884.267 1.877-.12 2.735-.162.366-.388.706-.597 1.055l-.99 1.67a3.044 3.044 0 0 1-.26.35c-.415.462-1.008.752-1.63.752s-1.215-.29-1.63-.751a2.56 2.56 0 0 1-.265-.356l-.978-1.653c-.207-.35-.44-.7-.594-1.066a3.62 3.62 0 0 1 .57-3.75 3.642 3.642 0 0 1 3.096-1.488zm-.005 1.935a1.82 1.82 0 0 0-1.633 1.008 1.847 1.847 0 0 0 .313 2.112l.272.384a40.23 40.23 0 0 1 .622 1.042c.06.11.142.205.25.273.21.137.49.138.703.002a.706.706 0 0 0 .252-.278l.627-1.047c.086-.15.176-.296.272-.438a1.847 1.847 0 0 0-.336-2.45 1.832 1.832 0 0 0-1.143-.408z"/>
                </svg>
                Apple Podcasts
              </a>
            </div>

            <SpotifyPlayerCard />
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
