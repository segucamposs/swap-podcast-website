import Image from "next/image";
import Link from "next/link";
import type { Episode } from "@/lib/episodes/types";

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const date = new Date(episode.publishedAt).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
  });

  const artwork = episode.artworkUrl ?? episode.thumbnailUrl;

  return (
    <Link
      href={`/episodes/${episode.slug}`}
      aria-label={`Ver episodio: ${episode.title}`}
      className="group bg-zinc-900 border border-white/8 rounded-2xl overflow-hidden hover:border-brand-orange/40 transition-colors duration-300 flex flex-col"
    >
      <article>
        {/* Artwork */}
        {artwork && (
          <div className="relative aspect-square bg-zinc-800 overflow-hidden">
            <Image
              src={artwork}
              alt={`${episode.guest} — SWAP Podcast`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Body */}
        <div className="p-6 flex flex-col flex-1">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs font-mono text-brand-gray mb-3">
            <span>EP. {episode.episodeNumber}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={episode.publishedAt}>{date}</time>
          </div>

          {/* Guest */}
          <p className="text-brand-orange text-xs font-medium uppercase tracking-wider mb-2">
            {episode.guest}
          </p>

          {/* Title */}
          <h3 className="text-white font-semibold text-base leading-snug mb-5 line-clamp-3 flex-1 group-hover:text-brand-orange transition-colors duration-200">
            {episode.title}
          </h3>

          {/* CTA */}
          <span className="text-sm font-medium text-brand-orange group-hover:text-white transition-colors duration-200 inline-flex items-center gap-1">
            Ver episodio{" "}
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}
