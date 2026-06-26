import Image from "next/image";
import Link from "next/link";
import type { Episode } from "@/lib/episodes/types";

interface GuestCardProps {
  episode: Episode;
}

export default function GuestCard({ episode }: GuestCardProps) {
  const artwork = episode.artworkUrl ?? episode.thumbnailUrl;
  const displayDate = new Date(episode.publishedAt).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
  });

  // Truncate description for the card
  const snippet =
    episode.description.length > 140
      ? episode.description.slice(0, 140).trimEnd() + "…"
      : episode.description;

  return (
    <article className="group bg-zinc-900 border border-white/8 rounded-2xl overflow-hidden hover:border-brand-orange/40 transition-colors duration-300 flex flex-col">
      {/* Artwork */}
      <div className="relative aspect-square bg-zinc-800 overflow-hidden">
        {artwork ? (
          <Image
            src={artwork}
            alt={`${episode.guest} — SWAP Podcast`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Fallback placeholder with initials */
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
            <span className="text-3xl font-bold text-white/20 font-heading">
              {episode.guest.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Episode number badge */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-0.5 text-xs font-mono text-white/60">
          EP. {episode.episodeNumber}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <time dateTime={episode.publishedAt} className="text-xs font-mono text-white/30 mb-2">
          {displayDate}
        </time>
        <h3 className="text-white font-semibold text-base leading-snug mb-1 group-hover:text-brand-orange transition-colors duration-200">
          {episode.guest}
        </h3>
        {episode.topic && (
          <p className="text-brand-orange text-xs font-medium mb-3 line-clamp-2 leading-snug">
            {episode.topic}
          </p>
        )}
        <p className="text-white/40 text-sm leading-relaxed flex-1 mb-5">
          {snippet}
        </p>

        <Link
          href={`/episodes/${episode.slug}`}
          className="text-sm font-medium text-white/50 hover:text-brand-orange transition-colors duration-200 inline-flex items-center gap-1.5"
          aria-label={`Escuchar episodio con ${episode.guest}`}
        >
          Escuchar episodio
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
