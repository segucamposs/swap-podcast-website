"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Data ──────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/", label: "Inicio", num: "01" },
  { href: "/episodes", label: "Episodios", num: "02" },
  { href: "/invitados", label: "Invitados", num: "03" },
  { href: "/about", label: "Nosotros", num: "04" },
  { href: "/contact", label: "Contacto", num: "05" },
];

const ALL_LINKS = [
  { label: "Spotify",        href: "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",           src: "/icons/spotify.png" },
  { label: "Apple Podcasts", href: "https://podcasts.apple.com/ar/podcast/swap-podcast/id1830727081", src: "/icons/apple-podcasts.png" },
  { label: "YouTube",        href: "https://youtube.com/@SwapPodcast",                                src: "/icons/youtube.png" },
  { label: "Instagram",      href: "https://instagram.com/swapodcast",                                src: "/icons/instagram.png" },
  { label: "TikTok",         href: "https://tiktok.com/@swappodcast",                                 src: "/icons/tiktok.png" },
];

// ─── Constants ─────────────────────────────────────────────────────────────

const EASE = [0.76, 0, 0.24, 1] as const;
const TOTAL = NAV_LINKS.length;

// ─── IconLink ──────────────────────────────────────────────────────────────

function IconLink({ label, href, src }: { label: string; href: string; src: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group"
    >
      <Image
        src={src}
        alt=""
        width={20}
        height={20}
        className="w-5 h-5 object-contain grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
      />
    </a>
  );
}

// ─── NavLink ───────────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  num,
  index,
  isActive,
  onClose,
}: {
  href: string;
  label: string;
  num: string;
  index: number;
  isActive: boolean;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <li>
      <div className="overflow-hidden">
        <motion.div
          initial={{ y: "110%" }}
          animate={{
            y: "0%",
            transition: { delay: 0.18 + index * 0.07, duration: 0.7, ease: EASE },
          }}
          exit={{
            y: "110%",
            transition: {
              delay: (TOTAL - 1 - index) * 0.04,
              duration: 0.4,
              ease: EASE,
            },
          }}
        >
          <Link
            href={href}
            onClick={onClose}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex items-baseline gap-3 sm:gap-5 py-2 sm:py-3 w-full"
            aria-current={isActive ? "page" : undefined}
          >
            <motion.span
              animate={{
                color:
                  hovered || isActive
                    ? "rgba(255,117,31,0.6)"
                    : "rgba(255,255,255,0.18)",
              }}
              transition={{ duration: 0.25 }}
              className="text-[10px] sm:text-xs font-mono tracking-widest shrink-0 w-5 leading-none"
            >
              {num}
            </motion.span>

            <motion.span
              animate={{
                x: hovered ? 12 : 0,
                skewX: hovered ? -4 : 0,
                color: hovered || isActive ? "#ff751f" : "#ffffff",
              }}
              transition={{ type: "spring", stiffness: 480, damping: 38 }}
              className="font-heading font-black leading-none tracking-tight"
              style={{ fontSize: "clamp(2.75rem, 7.5vw, 6.5rem)" }}
            >
              {label}
            </motion.span>

            <motion.span
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -14 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="ml-auto text-brand-orange text-3xl sm:text-4xl self-center hidden sm:block shrink-0"
              aria-hidden
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{
          scaleX: 1,
          transition: { delay: 0.32 + index * 0.07, duration: 0.6, ease: EASE },
        }}
        exit={{ scaleX: 0, transition: { duration: 0.15 } }}
        className="h-px bg-white/10 origin-left"
        aria-hidden
      />
    </li>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── Hamburger trigger ────────────────────────────────────── */}
      <div className="fixed top-0 right-0 z-[100] p-4 sm:p-6">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          className="relative flex flex-col justify-center items-center w-12 h-12 gap-[5px] outline-none"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="nav-overlay"
        >
          {/* Hover ring */}
          <motion.span
            className="absolute inset-0 rounded-full border border-white/30 pointer-events-none"
            animate={{ scale: btnHovered ? 1 : 0.5, opacity: btnHovered ? 1 : 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          />

          {/* Top bar */}
          <motion.span
            className="block h-[2px] rounded-full bg-white origin-center"
            style={{ width: 22 }}
            animate={
              isOpen
                ? { rotate: 45, y: 7 }
                : { rotate: 0, y: btnHovered ? -2 : 0 }
            }
            transition={{ duration: 0.4, ease: EASE }}
          />

          {/* Middle bar */}
          <motion.span
            className="block h-[2px] rounded-full bg-white"
            animate={{
              width: isOpen ? 0 : btnHovered ? 12 : 22,
              opacity: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: EASE }}
          />

          {/* Bottom bar */}
          <motion.span
            className="block h-[2px] rounded-full bg-white origin-center"
            style={{ width: 22 }}
            animate={
              isOpen
                ? { rotate: -45, y: -7 }
                : { rotate: 0, y: btnHovered ? 2 : 0 }
            }
            transition={{ duration: 0.4, ease: EASE }}
          />
        </button>
      </div>

      {/* ── Fullscreen overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="nav-overlay"
            key="nav-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{
              clipPath: "inset(0 0 0% 0)",
              transition: { duration: 0.8, ease: EASE },
            }}
            exit={{
              clipPath: "inset(0 0 100% 0)",
              transition: { duration: 0.65, ease: EASE },
            }}
            className="fixed inset-0 z-[90] bg-black flex flex-col overflow-hidden"
          >
            {/* ── Main nav links ─────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 relative z-10">
              <nav aria-label="Menú principal">
                <ul className="flex flex-col">
                  {NAV_LINKS.map((link, i) => (
                    <NavLink
                      key={link.href}
                      {...link}
                      index={i}
                      isActive={isActive(link.href)}
                      onClose={close}
                    />
                  ))}
                </ul>
              </nav>
            </div>

            {/* ── Bottom bar ──────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.62, duration: 0.5, ease: EASE },
              }}
              exit={{ opacity: 0, y: 18, transition: { duration: 0.2 } }}
              className="relative z-10 border-t border-white/10 px-6 sm:px-10 lg:px-20 py-5 sm:py-7 flex items-center gap-5 sm:gap-6"
            >
              {ALL_LINKS.map(({ label, href, src }) => (
                <IconLink key={label} label={label} href={href} src={src} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
