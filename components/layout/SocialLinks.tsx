import type { HTMLAttributes } from "react";

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    label: "Apple Podcasts",
    href: "https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59.12 2.2.007 2.864a9.152 9.152 0 01-1.096 3.192c-.479.84-1.048 1.544-1.8 2.208a8.5 8.5 0 01-2.576 1.576 8.36 8.36 0 01-3.24.624A8.387 8.387 0 013.5 12.0a8.36 8.36 0 01.624-3.24 8.5 8.5 0 011.576-2.576 8.5 8.5 0 012.208-1.8 8.9 8.9 0 013.456-1.224c.167-.024.333-.04.502-.04zM12 5.09c-1.833 0-3.504.737-4.71 1.929a6.665 6.665 0 000 9.524A6.669 6.669 0 0012 18.483c1.833 0 3.504-.737 4.71-1.94a6.665 6.665 0 000-9.524A6.633 6.633 0 0012 5.09zm0 1.81a4.857 4.857 0 110 9.714A4.857 4.857 0 0112 6.9zm0 1.62a3.237 3.237 0 100 6.474A3.237 3.237 0 0012 8.52zm0 1.62a1.617 1.617 0 110 3.234A1.617 1.617 0 0112 10.14z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@SwapPodcast",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/swapodcast",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@swappodcast",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
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
  /** Icon size variant — defaults to "md" */
  size?: "sm" | "md" | "lg";
}

export default function SocialLinks({ size = "md", className = "", ...props }: SocialLinksProps) {
  const iconSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`} {...props}>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto") ? undefined : "_blank"}
          rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
          aria-label={link.label}
          className={`${iconSize} flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-white/40 hover:text-brand-orange hover:border-brand-orange/40 hover:bg-brand-orange/5 transition-all duration-200`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
