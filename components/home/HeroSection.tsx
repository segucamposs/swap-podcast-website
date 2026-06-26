"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import HeroLogo from "./HeroLogo";

const SPRING = { stiffness: 80, damping: 20, mass: 0.5 };

export default function HeroSection({ episodeCount }: { episodeCount: number }) {
  const sectionRef = useRef<HTMLElement>(null);

  // Progress 0 (hero top at viewport top) → 1 (hero bottom at viewport top)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring over raw scroll for jitter-free transforms
  const progress = useSpring(scrollYProgress, SPRING);

  // ── Hero content parallaxes upward ──────────────────────────
  const contentY     = useTransform(progress, [0, 1], ["0%", "-18%"]);
  const contentScale = useTransform(progress, [0, 0.8], [1, 0.97]);
  const contentOpacity = useTransform(progress, [0, 0.55], [1, 0]);

  // ── Background glow scales down and darkens ──────────────────
  const glowScale   = useTransform(progress, [0, 1], [1, 0.82]);
  const glowOpacity = useTransform(progress, [0, 0.7], [0.08, 0]);

  // ── Dark vignette deepens as section exits ───────────────────
  const overlayOpacity = useTransform(progress, [0.2, 0.9], [0, 0.75]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-black px-4 py-24 overflow-hidden"
      aria-label="Hero"
    >
      {/* Radial glow — shrinks and fades as hero exits */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          scale: glowScale,
          opacity: glowOpacity,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,117,31,1) 0%, transparent 70%)",
        }}
      />

      {/* Progressive dark overlay */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black pointer-events-none z-[1]"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content — parallaxes up + fades */}
      <motion.div
        className="relative z-[2] text-center w-full"
        style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}
      >
        <HeroLogo />

        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/25 rounded-full px-4 py-1.5 mb-10">
            <span
              className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"
              aria-hidden="true"
            />
            <span className="text-brand-orange text-xs font-medium font-mono">
              {episodeCount} episodios publicados
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-orange/85 transition-colors duration-200"
            >
              <Image
                src="/icons/spotify.png"
                alt=""
                width={18}
                height={18}
                className="object-contain brightness-0 invert"
              />
              Escuchar en Spotify
            </a>

            <Link
              href="/episodes"
              className="inline-flex items-center justify-center border border-white/20 text-white font-medium px-8 py-3.5 rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors duration-200"
            >
              Ver todos los episodios
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
