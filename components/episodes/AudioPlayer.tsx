"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface AudioPlayerProps {
  src: string;
  episodeSlug: string;
  title?: string;
  guest?: string;
  artworkUrl?: string | null;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AudioPlayer({
  src,
  episodeSlug,
  title,
  guest,
  artworkUrl,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = `swap_audio_${episodeSlug}`;

  // Save position when the user leaves (restore happens in handleLoadedMetadata)
  useEffect(() => {
    const save = () => {
      if (audioRef.current && audioRef.current.currentTime > 0) {
        localStorage.setItem(storageKey, String(audioRef.current.currentTime));
      }
    };
    window.addEventListener("beforeunload", save);
    return () => {
      save(); // also save on unmount
      window.removeEventListener("beforeunload", save);
    };
  }, [storageKey]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoaded(true);
      // Restore position after metadata loads
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const time = parseFloat(saved);
        if (!isNaN(time) && time > 0 && time < audioRef.current.duration) {
          audioRef.current.currentTime = time;
          setCurrentTime(time);
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const t = audioRef.current.currentTime;
      setCurrentTime(t);
      // Persist every ~10 seconds
      if (Math.floor(t) % 10 === 0) {
        localStorage.setItem(storageKey, String(t));
      }
    }
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
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback error:", err);
      }
    }
  }, [isPlaying, isLoaded, storageKey]);

  const handleSeek = (clientX: number, rect: DOMRect) => {
    if (!audioRef.current || !isLoaded || duration === 0) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const time = ratio * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-zinc-900 border border-white/8 rounded-2xl p-5 sm:p-6">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="sr-only"
      />

      <div className="flex gap-4 items-start">
        {/* Episode artwork */}
        {artworkUrl && (
          <div className="flex-shrink-0">
            <Image
              src={artworkUrl}
              alt={title ?? "Episodio SWAP"}
              width={72}
              height={72}
              className="rounded-xl object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Guest + title */}
          {guest && (
            <p className="text-brand-orange text-xs font-medium uppercase tracking-wider mb-1 truncate">
              {guest}
            </p>
          )}
          {title && (
            <p className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-4">
              {title}
            </p>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              disabled={!isLoaded}
              aria-label={isPlaying ? "Pausar episodio" : "Reproducir episodio"}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center hover:bg-brand-orange/85 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="translate-x-0.5">
                  <polygon points="5,3 20,12 5,21" />
                </svg>
              )}
            </button>

            {/* Progress area */}
            <div className="flex-1 flex flex-col gap-1.5">
              {/* Progress bar */}
              <div
                className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group"
                role="slider"
                aria-label="Progreso del episodio"
                aria-valuenow={Math.round(currentTime)}
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                tabIndex={isLoaded ? 0 : -1}
                onClick={(e) => handleSeek(e.clientX, e.currentTarget.getBoundingClientRect())}
                onKeyDown={(e) => {
                  if (!audioRef.current) return;
                  if (e.key === "ArrowRight") audioRef.current.currentTime += 10;
                  if (e.key === "ArrowLeft") audioRef.current.currentTime -= 10;
                }}
              >
                {/* Fill */}
                <div
                  className="absolute inset-y-0 left-0 bg-brand-orange rounded-full transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-brand-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ left: `${progress}%` }}
                  aria-hidden="true"
                />
              </div>

              {/* Times */}
              <div className="flex justify-between text-[10px] font-mono text-white/30 leading-none">
                <span>{formatTime(currentTime)}</span>
                <span>{isLoaded ? formatTime(duration) : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
