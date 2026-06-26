import Image from "next/image";
import type { Episode } from "@/lib/episodes/types";

interface SpotifyPlayerCardProps {
  episode: Episode;
}

function formatDuration(ms: number | null | undefined): string {
  if (!ms) return "";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  if (h > 0) return `-${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `-${m}:${String(s).padStart(2, "0")}`;
}

export default function SpotifyPlayerCard({ episode }: SpotifyPlayerCardProps) {
  const artwork = episode.artworkUrl ?? episode.thumbnailUrl;
  const spotifyUrl = "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY";
  const duration = formatDuration(episode.durationMs);

  const displayDate = new Date(episode.publishedAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });

  return (
    <a
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escuchar en Spotify: ${episode.title}`}
      className="group block bg-zinc-900 border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-colors duration-200 max-w-lg mx-auto"
    >
      {/* Top: artwork + info */}
      <div className="flex">
        {/* Artwork */}
        <div className="relative w-36 h-36 flex-shrink-0">
          {artwork ? (
            <Image
              src={artwork}
              alt={`${episode.guest} — SWAP Podcast`}
              fill
              sizes="144px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
              <span className="text-3xl font-bold text-white/20">S</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 px-4 pt-4 pb-3 relative min-w-0">
          {/* Spotify logo — top right */}
          <div className="absolute top-3 right-3 text-white/60 group-hover:text-white transition-colors duration-200">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>

          {/* Title */}
          <p className="text-white font-bold text-sm leading-snug pr-7 line-clamp-2 mb-1.5">
            {episode.title} | {episode.guest}
          </p>

          {/* Date + show name */}
          <p className="text-white/45 text-xs mb-3">
            {displayDate} · SWAP Podcast
          </p>

          {/* Save / listen CTA */}
          <div className="flex items-center gap-1.5 text-white/50 text-xs group-hover:text-white/70 transition-colors duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Escuchar en Spotify
          </div>
        </div>
      </div>

      {/* Bottom controls bar */}
      <div className="px-4 pb-4 pt-2 flex items-center gap-3">
        {/* Skip back 15 */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white/40 flex-shrink-0" aria-hidden="true">
          <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          <text x="7" y="14" fontSize="5" fill="currentColor" fontFamily="sans-serif">15</text>
        </svg>

        {/* Progress bar — decorative, at 0% */}
        <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden">
          <div className="h-full w-0 bg-white rounded-full" />
        </div>

        {/* Skip forward 15 */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white/40 flex-shrink-0" aria-hidden="true">
          <path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
          <text x="7" y="14" fontSize="5" fill="currentColor" fontFamily="sans-serif">15</text>
        </svg>

        {/* Duration */}
        {duration && (
          <span className="text-white/40 text-xs font-mono flex-shrink-0">{duration}</span>
        )}

        {/* ··· */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/30 flex-shrink-0" aria-hidden="true">
          <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
        </svg>

        {/* Play button */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#000" aria-hidden="true" className="translate-x-0.5">
            <polygon points="5,3 20,12 5,21" />
          </svg>
        </div>
      </div>
    </a>
  );
}
