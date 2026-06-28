"use client";

import { useState } from "react";
import Image from "next/image";
import SpotifyPlayerCard from "./SpotifyPlayerCard";

type Platform = "spotify" | "youtube" | "apple";

interface Props {
  latestYouTubeVideoId: string;
}

function Tab({
  active,
  onClick,
  src,
  label,
}: {
  active: boolean;
  onClick: () => void;
  src: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex-1 flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-2 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-black text-white font-semibold"
          : "text-white/55 hover:text-white/80"
      }`}
    >
      <Image
        src={src}
        alt=""
        width={14}
        height={14}
        className={`object-contain transition-all duration-300 ${
          active
            ? "grayscale-0 opacity-100"
            : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
        }`}
      />
      {label}
    </button>
  );
}

export default function PlatformEmbed({ latestYouTubeVideoId }: Props) {
  const [active, setActive] = useState<Platform>("spotify");

  return (
    <>
      {/* Platform tabs */}
      <div className="flex items-stretch bg-zinc-900 border border-white/[0.08] rounded-full p-1.5 mb-6 max-w-lg mx-auto">
        <Tab active={active === "spotify"} onClick={() => setActive("spotify")} label="Spotify"        src="/icons/spotify.png" />
        <Tab active={active === "youtube"} onClick={() => setActive("youtube")} label="YouTube"        src="/icons/youtube.png" />
        <Tab active={active === "apple"}   onClick={() => setActive("apple")}   label="Apple"          src="/icons/apple-podcasts.png" />
      </div>

      {/* Embeds — only mount the active one */}
      {active === "spotify" && <SpotifyPlayerCard />}

      {active === "youtube" && latestYouTubeVideoId && (
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={`https://www.youtube.com/embed/${latestYouTubeVideoId}?rel=0&modestbranding=1`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
            title="SWAP Podcast en YouTube"
            style={{ display: "block" }}
          />
        </div>
      )}

      {active === "apple" && (
        <div className="rounded-2xl overflow-hidden">
          <iframe
            src="https://embed.podcasts.apple.com/us/podcast/swap-podcast/id1830727081?itsct=podcast_box_player&itscg=30200&ls=1&theme=dark"
            height="450"
            width="100%"
            frameBorder="0"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            allow="autoplay *; encrypted-media *; clipboard-write"
            loading="lazy"
            title="SWAP Podcast en Apple Podcasts"
            style={{ display: "block", overflow: "hidden" }}
          />
        </div>
      )}
    </>
  );
}
