"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface AudioPlayerProps {
  src: string;
  episodeSlug: string;
  title?: string;
  guest?: string;
  artworkUrl?: string | null;
  spotifyUrl?: string | null;
  publishedAt?: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AudioPlayer({
  src,
  episodeSlug,
  title,
  guest,
  artworkUrl,
  spotifyUrl,
  publishedAt,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const [isLoaded, setIsLoaded]     = useState(false);

  const storageKey = `swap_audio_${episodeSlug}`;
  const progress   = duration > 0 ? (currentTime / duration) * 100 : 0;

  const shortDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  // Persist position on unmount / tab close
  useEffect(() => {
    const save = () => {
      if (audioRef.current && audioRef.current.currentTime > 0)
        localStorage.setItem(storageKey, String(audioRef.current.currentTime));
    };
    window.addEventListener("beforeunload", save);
    return () => { save(); window.removeEventListener("beforeunload", save); };
  }, [storageKey]);

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
    setIsLoaded(true);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const t = parseFloat(saved);
      if (!isNaN(t) && t > 0 && t < audioRef.current.duration) {
        audioRef.current.currentTime = t;
        setCurrentTime(t);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    setCurrentTime(t);
    if (Math.floor(t) % 10 === 0) localStorage.setItem(storageKey, String(t));
  };

  const handleEnded = () => {
    setIsPlaying(false);
    localStorage.removeItem(storageKey);
  };

  const togglePlay = useCallback(async () => {
    if (!audioRef.current || !isLoaded) return;
    if (isPlaying) {
      audioRef.current.pause();
      localStorage.setItem(storageKey, String(audioRef.current.currentTime));
      setIsPlaying(false);
    } else {
      try { await audioRef.current.play(); setIsPlaying(true); }
      catch (err) { console.error("Playback error:", err); }
    }
  }, [isPlaying, isLoaded, storageKey]);

  const skip = useCallback((secs: number) => {
    if (!audioRef.current || !isLoaded) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + secs));
    setCurrentTime(audioRef.current.currentTime);
  }, [isLoaded, duration]);

  const handleSeek = (clientX: number, rect: DOMRect) => {
    if (!audioRef.current || !isLoaded || duration === 0) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(audioRef.current.currentTime);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden flex items-stretch">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="sr-only"
      />

      {/* Artwork — left, full-height, edge-to-edge */}
      {artworkUrl && (
        <div className="relative w-40 sm:w-52 flex-shrink-0 self-stretch">
          <Image
            src={artworkUrl}
            alt={title ?? "SWAP Podcast"}
            fill
            className="object-cover"
            sizes="208px"
          />
        </div>
      )}

      {/* Right — info + controls */}
      <div className="flex-1 min-w-0 flex flex-col p-5">
        {/* Spotify icon top-right */}
        <div className="flex justify-end mb-2 flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>

        {/* Episode title */}
        <p className="text-white text-lg sm:text-xl font-bold truncate leading-tight">
          {title}{guest ? ` | ${guest}` : ""}
        </p>

        {/* Subtitle */}
        <p className="text-white/45 text-sm mt-1 flex-shrink-0">
          {shortDate}{shortDate ? " · " : ""}SWAP Podcast
        </p>

        {/* Save on Spotify */}
        {spotifyUrl && (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-white text-sm hover:text-white/70 transition-colors duration-150 flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Save on Spotify
          </a>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mt-auto pt-4">
          {/* Skip back 15 */}
          <button
            onClick={() => skip(-15)}
            disabled={!isLoaded}
            aria-label="Retroceder 15 segundos"
            className="relative text-white/50 hover:text-white/80 disabled:opacity-30 transition-colors duration-150 flex-shrink-0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              <text x="12" y="15.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="currentColor">15</text>
            </svg>
          </button>

          {/* Seek bar */}
          <div
            className="flex-1 relative h-1 bg-white/20 rounded-full cursor-pointer group"
            role="slider"
            aria-label="Progreso del episodio"
            aria-valuenow={Math.round(currentTime)}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            tabIndex={isLoaded ? 0 : -1}
            onClick={(e) => handleSeek(e.clientX, e.currentTarget.getBoundingClientRect())}
            onKeyDown={(e) => {
              if (!audioRef.current) return;
              if (e.key === "ArrowRight") skip(10);
              if (e.key === "ArrowLeft")  skip(-10);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-white/70 rounded-full transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              style={{ left: `${progress}%` }}
              aria-hidden="true"
            />
          </div>

          {/* Skip forward 15 */}
          <button
            onClick={() => skip(15)}
            disabled={!isLoaded}
            aria-label="Adelantar 15 segundos"
            className="relative text-white/50 hover:text-white/80 disabled:opacity-30 transition-colors duration-150 flex-shrink-0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 19V23l5-5-5-5v4c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6h2c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8z" />
              <text x="12" y="15.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="currentColor">15</text>
            </svg>
          </button>

          {/* Duration */}
          <span className="text-white/45 text-xs font-mono tabular-nums flex-shrink-0">
            {isLoaded ? formatTime(duration) : "—"}
          </span>

          {/* Dots */}
          <button
            aria-label="Más opciones"
            className="text-white/40 hover:text-white/70 transition-colors duration-150 flex-shrink-0 text-base leading-none tracking-widest px-0.5"
          >
            ···
          </button>

          {/* Play / Pause — white circle */}
          <button
            onClick={togglePlay}
            disabled={!isLoaded}
            aria-label={isPlaying ? "Pausar episodio" : "Reproducir episodio"}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-white flex items-center justify-center hover:bg-white/85 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <svg width="11" height="13" viewBox="0 0 24 24" fill="black" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="11" height="13" viewBox="0 0 24 24" fill="black" aria-hidden="true" className="translate-x-px">
                <polygon points="5,3 20,12 5,21" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
