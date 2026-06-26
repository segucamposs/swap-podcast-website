"use client";

import { useState } from "react";
import SpotifyPlayerCard from "./SpotifyPlayerCard";

type Platform = "spotify" | "youtube" | "apple";

interface Props {
  latestYouTubeVideoId: string;
}

function Tab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-black text-white font-semibold"
          : "text-white/55 hover:text-white/80"
      }`}
    >
      {icon}
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
        <Tab
          active={active === "spotify"}
          onClick={() => setActive("spotify")}
          label="Spotify"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          }
        />
        <Tab
          active={active === "youtube"}
          onClick={() => setActive("youtube")}
          label="YouTube"
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          }
        />
        <Tab
          active={active === "apple"}
          onClick={() => setActive("apple")}
          label="Apple Podcasts"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm6.526 2.485c3.658.077 7.271 2.68 8.604 5.906.4.94.63 1.966.696 3.005.044.71.034 1.44-.16 2.128-.08.295-.203.55-.406.775-.24.261-.558.37-.899.36a1.27 1.27 0 0 1-1.016-.584 1.807 1.807 0 0 1-.252-.743 7.195 7.195 0 0 0-2.045-4.406 7.267 7.267 0 0 0-4.7-2.208 7.315 7.315 0 0 0-5.76 2.128A7.35 7.35 0 0 0 4.85 13.81a1.85 1.85 0 0 1-.278.808 1.292 1.292 0 0 1-1.036.572c-.36.004-.67-.12-.912-.378a1.574 1.574 0 0 1-.375-.732 5.54 5.54 0 0 1-.111-1.322c.106-1.924.736-3.742 1.82-5.196C5.447 4.553 8.418 2.41 11.866 2.485zm.06 4.249a6.76 6.76 0 0 1 5.6 3.49c.49.872.735 1.857.72 2.852.006.72-.158 1.44-.52 2.062a1.307 1.307 0 0 1-.9.658c-.302.065-.593.03-.868-.098a1.459 1.459 0 0 1-.761-1.02 4.987 4.987 0 0 0-1.64-2.97 5.037 5.037 0 0 0-6.997.5 5.116 5.116 0 0 0-1.237 3.032c-.044.421-.214.786-.515 1.067-.267.25-.6.39-.96.375a1.3 1.3 0 0 1-.822-.327 1.614 1.614 0 0 1-.46-.817 5.856 5.856 0 0 1-.058-2.207 8.284 8.284 0 0 1 2.01-4.37 8.107 8.107 0 0 1 6.408-3.227zm-.037 4.283c1.52.055 2.9 1.07 3.398 2.502.3.884.267 1.877-.12 2.735-.162.366-.388.706-.597 1.055l-.99 1.67a3.044 3.044 0 0 1-.26.35c-.415.462-1.008.752-1.63.752s-1.215-.29-1.63-.751a2.56 2.56 0 0 1-.265-.356l-.978-1.653c-.207-.35-.44-.7-.594-1.066a3.62 3.62 0 0 1 .57-3.75 3.642 3.642 0 0 1 3.096-1.488zm-.005 1.935a1.82 1.82 0 0 0-1.633 1.008 1.847 1.847 0 0 0 .313 2.112l.272.384a40.23 40.23 0 0 1 .622 1.042c.06.11.142.205.25.273.21.137.49.138.703.002a.706.706 0 0 0 .252-.278l.627-1.047c.086-.15.176-.296.272-.438a1.847 1.847 0 0 0-.336-2.45 1.832 1.832 0 0 0-1.143-.408z" />
            </svg>
          }
        />
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
