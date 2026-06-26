"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { Episode } from "@/lib/episodes/types";

interface SpotifyPlayerCardProps {
  episode: Episode;
}

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatRemaining(current: number, total: number): string {
  const rem = Math.max(0, total - current);
  return "-" + formatTime(rem);
}

function formatTotalMs(ms: number | null | undefined): string {
  if (!ms) return "-:--";
  return formatTime(Math.floor(ms / 1000));
}

export default function SpotifyPlayerCard({ episode }: SpotifyPlayerCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = `swap_audio_${episode.slug}`;
  const artwork = episode.artworkUrl ?? episode.thumbnailUrl;
  const spotifyUrl = "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY";

  const displayDate = new Date(episode.publishedAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });

  useEffect(() => {
    const save = () => {
      if (audioRef.current && audioRef.current.currentTime > 0) {
        localStorage.setItem(storageKey, String(audioRef.current.currentTime));
      }
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
    setCurrentTime(0);
    localStorage.removeItem(storageKey);
  };

  // Play without waiting for isLoaded — let the browser buffer on demand
  const togglePlay = useCallback(async () => {
    if (!audioRef.current || !episode.audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback error:", err);
      }
    }
  }, [isPlaying, episode.audioUrl]);

  const skip = useCallback((secs: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(
      audioRef.current.duration || 0,
      audioRef.current.currentTime + secs
    ));
  }, []);

  const handleSeek = (clientX: number, rect: DOMRect) => {
    if (!audioRef.current || !duration) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Time label: show remaining while playing, total duration before
  const timeLabel = isLoaded && currentTime > 0
    ? formatRemaining(currentTime, duration)
    : formatTotalMs(episode.durationMs);

  return (
    <div className="rounded-2xl overflow-hidden max-w-[480px] mx-auto" style={{ backgroundColor: "#1a1a1a" }}>
      <audio
        ref={audioRef}
        src={episode.audioUrl ?? undefined}
        preload="none"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="sr-only"
      />

      {/* Top: artwork + info */}
      <div className="flex items-stretch">
        {/* Artwork — flush left, square */}
        <div className="relative flex-shrink-0" style={{ width: 172, height: 172 }}>
          {artwork ? (
            <Image
              src={artwork}
              alt={`${episode.guest} — SWAP Podcast`}
              fill
              sizes="172px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/20">S</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 px-5 pt-5 pb-3 min-w-0 overflow-hidden">
          {/* Title row — title + Spotify logo side by side */}
          <div className="flex items-start gap-3 mb-1">
            <p className="flex-1 text-white font-bold text-[15px] leading-snug whitespace-nowrap overflow-hidden min-w-0">
              {episode.title} | {episode.guest}
            </p>
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir en Spotify"
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors duration-150 mt-0.5"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
          </div>

          {/* Date · show */}
          <p className="text-white/50 text-sm mb-4">
            {displayDate} · SWAP Podcast
          </p>

          {/* Save link */}
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors duration-150"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Guardar en Spotify
          </a>
        </div>
      </div>

      {/* Controls — full width */}
      <div className="flex items-center gap-3 px-5 pb-5 pt-3">
        {/* Skip back 15 */}
        <button
          onClick={() => skip(-15)}
          aria-label="Retroceder 15 segundos"
          className="text-white/60 hover:text-white transition-colors duration-150 flex-shrink-0"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            <text x="12" y="15" fontSize="5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fill="currentColor">15</text>
          </svg>
        </button>

        {/* Progress bar */}
        <div
          className="flex-1 relative h-1 rounded-full cursor-pointer group"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          role="slider"
          aria-label="Progreso del episodio"
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          tabIndex={0}
          onClick={(e) => handleSeek(e.clientX, e.currentTarget.getBoundingClientRect())}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") skip(10);
            if (e.key === "ArrowLeft") skip(-10);
          }}
        >
          <div
            className="absolute inset-y-0 left-0 bg-white group-hover:bg-brand-orange rounded-full transition-colors duration-150"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%` }}
            aria-hidden="true"
          />
        </div>

        {/* Skip forward 15 */}
        <button
          onClick={() => skip(15)}
          aria-label="Adelantar 15 segundos"
          className="text-white/60 hover:text-white transition-colors duration-150 flex-shrink-0"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
            <text x="12" y="15" fontSize="5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fill="currentColor">15</text>
          </svg>
        </button>

        {/* Time */}
        <span className="text-white/50 text-sm font-mono flex-shrink-0 min-w-[48px] text-right">
          {timeLabel}
        </span>

        {/* ··· */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white/40 flex-shrink-0" aria-hidden="true">
          <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
        </svg>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={!episode.audioUrl}
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#000" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#000" aria-hidden="true" className="translate-x-0.5">
              <polygon points="5,3 20,12 5,21"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
