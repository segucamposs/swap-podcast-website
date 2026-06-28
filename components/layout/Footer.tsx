import Image from "next/image";
import Link from "next/link";

const PLATFORMS = [
  { label: "Spotify",        href: "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",           src: "/icons/spotify.png" },
  { label: "Apple Podcasts", href: "https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081", src: "/icons/apple-podcasts.png" },
  { label: "YouTube",        href: "https://youtube.com/@SwapPodcast",                                src: "/icons/youtube.png" },
  { label: "Instagram",      href: "https://instagram.com/swapodcast",                                src: "/icons/instagram.png" },
  { label: "TikTok",         href: "https://tiktok.com/@swappodcast",                                 src: "/icons/tiktok.png" },
];

const SITE_LINKS = [
  { href: "/episodes", label: "Episodios" },
  { href: "/invitados", label: "Invitados" },
  { href: "/about", label: "Nosotros" },
  { href: "/contact", label: "Contacto" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/logo/swap-logo-transparent.png"
              alt="SWAP Podcast"
              width={4923}
              height={1357}
              className="h-10 w-auto mb-4"
            />
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Conversaciones reales para pibes que construyen algo. En argentino,
              sin filtros.
            </p>
            <a
              href="mailto:podcastswap@gmail.com"
              className="inline-block mt-4 text-sm text-brand-orange hover:text-brand-orange/70 transition-colors duration-200"
            >
              podcastswap@gmail.com
            </a>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Escuchanos
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {PLATFORMS.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 text-white/40 text-sm hover:text-white transition-colors duration-200"
                  >
                    <Image
                      src={p.src}
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Site nav + hosts */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Sitio
            </h3>
            <ul className="flex flex-col gap-2 mb-6" role="list">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/40 text-sm hover:text-brand-orange transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-2">
              Hosts
            </h3>
            <p className="text-white/40 text-sm">
              Segundo Campos &amp; Francisco Bottaro
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-white/5 text-xs text-white/20">
          <span>© {year} SWAP Podcast. Todos los derechos reservados.</span>
          <span className="mx-2">·</span>
          <Link href="/redes" className="hover:text-white/40 transition-colors duration-200">
            Redes
          </Link>
        </div>
      </div>
    </footer>
  );
}
