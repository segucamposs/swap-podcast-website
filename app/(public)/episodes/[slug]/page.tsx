import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEpisodes, getEpisodeBySlug } from "@/lib/episodes/feed";

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
              <div className="inline-flex items-center bg-zinc-900 rounded-full p-1.5 gap-1">
                <a
                  href={episode.spotifyUrl ?? "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  <Image src="/icons/spotify.png" alt="" width={18} height={18} className="object-contain" />
                  Spotify
                </a>

                <a
                  href={episode.youtubeUrl ?? "https://www.youtube.com/@SwapPodcast"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  <Image src="/icons/youtube.png" alt="" width={18} height={18} className="object-contain" />
                  YouTube
                </a>

                <a
                  href={episode.appleUrl ?? "https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  <Image src="/icons/apple-podcasts.png" alt="" width={18} height={18} className="object-contain" />
                  Apple Podcasts
                </a>
              </div>
            </div>
          </div>
        </header>

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
