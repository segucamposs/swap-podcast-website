import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SWAP Podcast — Redes",
  description: "Encontranos en todas nuestras redes sociales.",
};

const LINKS = [
  {
    platform: "Instagram",
    handle: "@swapodcast",
    href: "https://instagram.com/swapodcast",
    icon: "/icons/instagram.png",
  },
  {
    platform: "TikTok",
    handle: "@swappodcast",
    href: "https://tiktok.com/@swappodcast",
    icon: "/icons/tiktok.png",
  },
  {
    platform: "Spotify",
    handle: "SWAP Podcast",
    href: "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",
    icon: "/icons/spotify.png",
  },
  {
    platform: "YouTube",
    handle: "@SwapPodcast",
    href: "https://youtube.com/@SwapPodcast",
    icon: "/icons/youtube.png",
  },
  {
    platform: "Apple Podcasts",
    handle: "SWAP Podcast",
    href: "https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081",
    icon: "/icons/apple-podcasts.png",
  },
];

export default function RedesPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Orange radial glow at bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 55% at 50% 85%, rgba(255,117,31,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <Image
        src="/logo/swap-logo-transparent.png"
        alt="SWAP Podcast"
        width={4923}
        height={1357}
        className="h-10 w-auto mb-10 relative z-10"
        priority
      />

      {/* Tagline */}
      <div className="relative z-10 text-center mb-10">
        <p className="font-heading text-lg italic text-white/90 mb-2">
          No somos expertos, preguntamos como vos 🎙️
        </p>
        <p className="text-sm text-white/40">
          Co-hosts — Segu Campos &amp; Fran Bottaro
        </p>
      </div>

      {/* Link cards */}
      <ul
        role="list"
        className="relative z-10 w-full max-w-md flex flex-col gap-3"
      >
        {LINKS.map(({ platform, handle, href, icon }) => (
          <li key={platform}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all duration-200 hover:border-brand-orange/40 hover:bg-white/8 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(255,117,31,0.12)]"
            >
              <Image
                src={icon}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-white text-base leading-tight">
                  {platform}
                </p>
                <p className="text-sm text-white/50 mt-0.5">{handle}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-white/30 flex-shrink-0 transition-all duration-200 group-hover:text-brand-orange group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
        ))}
      </ul>

      {/* Bottom credit */}
      <p className="relative z-10 mt-12 text-xs text-white/20">
        © {new Date().getFullYear()} SWAP Podcast · Argentina
      </p>
    </div>
  );
}
