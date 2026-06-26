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

  return (
    <article className="group bg-zinc-900 border border-white/8 rounded-2xl p-6 hover:border-brand-orange/40 transition-colors duration-300 flex flex-col">
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
      <h3 className="text-white font-semibold text-base leading-snug mb-3 line-clamp-3 group-hover:text-brand-orange transition-colors duration-200">
        {episode.title}
      </h3>

      {/* Description */}
      <p className="text-white/40 text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
        {episode.description}
      </p>

      {/* CTA */}
      <Link
        href={`/episodes/${episode.slug}`}
        className="text-sm font-medium text-brand-orange hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
        aria-label={`Ver episodio: ${episode.title}`}
      >
        Ver episodio{" "}
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </article>
  );
}
