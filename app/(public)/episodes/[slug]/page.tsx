import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEpisodes, getEpisodeBySlug } from "@/lib/episodes/feed";

export const revalidate = 3600;

// ─── Description parser ───────────────────────────────────────────────────────

type ParsedDescription = {
  hook: string;
  bullets: string[];
  bio: string;
};

function parseDescription(description: string, guestName: string): ParsedDescription {
  if (!description) return { hook: "", bullets: [], bio: "" };

  // Strip promo tail ("Escuchalo completo en YouTube...")
  const clean = description.replace(/\nEscuchalo completo[\s\S]*$/i, "").trim();

  // Split on "En este episodio hablamos de:"
  const match = clean.match(/^([\s\S]*?)\nEn este episodio hablamos de:\s*([\s\S]*)$/i);
  if (!match) return { hook: clean, bullets: [], bio: "" };

  const hook = match[1].trim();
  const bulletSection = match[2].trim();
  let bullets: string[] = [];
  let bio = "";

  // Bio pattern: "FirstName LastName es [role]" — works even when nickname differs from stored name
  const bioPattern = /^[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+\s+[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+\s+es\s/;
  const firstName = guestName.split(" ")[0];
  const isBio = (p: string) => p.startsWith(firstName) || bioPattern.test(p);

  if (bulletSection.includes("•") || bulletSection.includes("\n")) {
    // RSS / newer iTunes: bullets separated by newlines and/or • characters
    const parts = bulletSection
      .split(/\n|(?<=[^\n])•/)
      .map((s) => s.replace(/^•\s*/, "").trim())
      .filter(Boolean);

    const bioIndex = parts.findIndex(isBio);
    if (bioIndex !== -1) {
      bio = parts[bioIndex];
      bullets = parts.filter((_, i) => i !== bioIndex);
    } else {
      bullets = parts;
    }
  } else {
    // Legacy concatenated format — split before any uppercase+lowercase that
    // follows a non-space character (handles letters, digits, punctuation like ")")
    const parts = bulletSection
      .split(/(?<=[^\s])(?=[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü])/u)
      .map((s) => s.trim())
      .filter(Boolean);

    const bioIndex = parts.findIndex(isBio);
    if (bioIndex !== -1) {
      bio = parts[bioIndex];
      bullets = parts.filter((_, i) => i !== bioIndex);
    } else {
      bullets = parts;
    }
  }

  return { hook, bullets, bio };
}

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
  const parsed = parseDescription(episode.description, episode.guest);
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
        <section aria-label="Descripción del episodio" className="space-y-8">
          <h2 className="text-lg font-semibold text-white">Sobre este episodio</h2>

          {parsed.bullets.length === 0 ? (
            <p className="text-white/60 text-base leading-relaxed whitespace-pre-line">
              {parsed.hook}
            </p>
          ) : (
            <>
              {parsed.hook && (
                <p className="text-white/75 text-base leading-relaxed">
                  {parsed.hook}
                </p>
              )}

              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-5">
                  En este episodio
                </p>
                <ul className="space-y-4">
                  {parsed.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-brand-orange font-mono text-sm mt-0.5 flex-shrink-0 select-none">—</span>
                      <span className="text-white/65 text-base leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {parsed.bio && (
                <div className="pt-6 border-t border-white/8">
                  <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                    Sobre {episode.guest.split(" ")[0]}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">{parsed.bio}</p>
                </div>
              )}
            </>
          )}
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
