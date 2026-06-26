import Image from "next/image";
import Link from "next/link";
import { getEpisodes } from "@/lib/episodes/data";
import EpisodeCard from "@/components/episodes/EpisodeCard";

export default function HomePage() {
  const latestEpisodes = getEpisodes().slice(0, 3);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative min-h-[88vh] flex items-center justify-center bg-black px-4 py-24 overflow-hidden"
        aria-label="Hero"
      >
        {/* Subtle radial glow */}
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
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

      {/* ── Latest episodes ────────────────────────────────────── */}
      <section className="bg-zinc-950 py-20 px-4" aria-label="Últimos episodios">
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
            {latestEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Platforms strip ────────────────────────────────────── */}
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
