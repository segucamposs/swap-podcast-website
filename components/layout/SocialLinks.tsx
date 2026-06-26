import Image from "next/image";
import type { HTMLAttributes } from "react";

interface SocialLink {
  label: string;
  href: string;
  src?: string;
  icon?: React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  { label: "Spotify",        href: "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",           src: "/icons/spotify.png" },
  { label: "Apple Podcasts", href: "https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081", src: "/icons/apple-podcasts.png" },
  { label: "YouTube",        href: "https://youtube.com/@SwapPodcast",                                src: "/icons/youtube.png" },
  { label: "Instagram",      href: "https://instagram.com/swapodcast",                                src: "/icons/instagram.png" },
  { label: "TikTok",         href: "https://tiktok.com/@swappodcast",                                 src: "/icons/tiktok.png" },
  {
    label: "Email",
    href: "mailto:podcastswap@gmail.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

interface SocialLinksProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export default function SocialLinks({ size = "md", className = "", ...props }: SocialLinksProps) {
  const boxSize  = size === "sm" ? "w-8 h-8"  : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const imgSize  = size === "sm" ? 16          : size === "lg" ? 24          : 20;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`} {...props}>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto") ? undefined : "_blank"}
          rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
          aria-label={link.label}
          className={`group ${boxSize} flex items-center justify-center rounded-xl bg-white/5 border border-white/[0.08] hover:border-brand-orange/60 hover:bg-brand-orange/5 transition-all duration-300`}
        >
          {link.src ? (
            <Image
              src={link.src}
              alt=""
              width={imgSize}
              height={imgSize}
              className="object-contain grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            />
          ) : (
            <span className="text-white/40 group-hover:text-white transition-colors duration-300">
              {link.icon}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
