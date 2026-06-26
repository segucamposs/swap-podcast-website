import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEpisodes, getEpisodeBySlug } from "@/lib/episodes/feed";
import AudioPlayer from "@/components/episodes/AudioPlayer";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const episodes = await getAllEpisodes();
  return episodes.map((ep) => ({ slug: ep.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) return { title: "Episodio no encontrado" };

  return {
    title: `${episode.title} — ${episode.guest}`,
    description: episode.description.slice(0, 160),
    openGraph: {
      images: episode.artworkUrl ? [episode.artworkUrl] : [],
    },
  };
}

function formatDuration(ms: number | null | undefined): string {
  if (!ms) return "";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h} h ${m} min`;
  return `${m} min`;
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) notFound();

  const artwork = episode.artworkUrl ?? episode.thumbnailUrl;
  const duration = formatDuration(episode.durationMs);
  const displayDate = new Date(episode.publishedAt).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-black min-h-screen">
      {/* Back */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-0">
        <Link
          href="/episodes"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-brand-orange transition-colors duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Todos los episodios
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Artwork */}
            {artwork && (
              <div className="flex-shrink-0">
                <Image
                  src={artwork}
                  alt={`${episode.guest} — SWAP Podcast`}
                  width={200}
                  height={200}
                  className="rounded-2xl shadow-2xl shadow-black/50"
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-mono text-white/30 mb-4">
                <span>EP. {episode.episodeNumber}</span>
                <span>·</span>
                <time dateTime={episode.publishedAt}>{displayDate}</time>
                {duration && (
                  <>
                    <span>·</span>
                    <span>{duration}</span>
                  </>
                )}
              </div>

              <p className="text-brand-orange text-sm font-medium uppercase tracking-wider mb-3">
                {episode.guest}
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-6">
                {episode.title}
              </h1>

              {/* Platform links */}
              <div className="flex flex-wrap gap-3">
                {episode.spotifyUrl && (
                  <a
                    href={episode.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/15 text-white/60 hover:border-brand-orange/60 hover:text-brand-orange px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Escuchar en Spotify
                  </a>
                )}
                {episode.appleUrl && (
                  <a
                    href={episode.appleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/15 text-white/60 hover:border-brand-orange/60 hover:text-brand-orange px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200"
                  >
                    Apple Podcasts
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Audio player */}
        {episode.audioUrl && (
          <section aria-label="Reproductor de audio" className="mb-10">
            <AudioPlayer
              src={episode.audioUrl}
              episodeSlug={episode.slug}
              title={episode.title}
              guest={episode.guest}
              artworkUrl={episode.artworkUrl}
            />
          </section>
        )}

        {/* Description */}
        <section aria-label="Descripción del episodio" className="prose prose-invert max-w-none">
          <h2 className="text-lg font-semibold text-white mb-4">Sobre este episodio</h2>
          <div className="text-white/60 text-base leading-relaxed whitespace-pre-line">
            {episode.description}
          </div>
        </section>

        {/* Nav to more episodes */}
        <div className="mt-16 pt-10 border-t border-white/8 flex items-center justify-between">
          <Link
            href="/episodes"
            className="text-sm text-white/40 hover:text-brand-orange transition-colors duration-200 inline-flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Ver todos los episodios
          </Link>
          <Link
            href="/invitados"
            className="text-sm text-white/40 hover:text-brand-orange transition-colors duration-200 inline-flex items-center gap-1.5"
          >
            Ver todos los invitados
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
      </article>
    </div>
  );
}
