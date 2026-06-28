"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import Link from "next/link";
import HeroLogo from "./HeroLogo";

const SPRING = { stiffness: 80, damping: 20, mass: 0.5 };

const TEXT_TRANSITION = { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const };

function EpisodesBadgeButton({
  episodeCount,
}: {
  episodeCount: number;
}) {
  const [hovered, setHovered] = useState(false);
  const defaultLabel = `${episodeCount} episodios publicados`;
  const hoverLabel = "ver todos los episodios →";
  const sizerText = hoverLabel.length > defaultLabel.length ? hoverLabel : defaultLabel;

  return (
    <Link
      href="/episodes"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center justify-center bg-brand-orange/10 border border-brand-orange/25 rounded-full px-6 py-3 overflow-hidden hover:border-brand-orange/50 transition-colors duration-300 cursor-pointer"
      aria-label={hoverLabel}
    >
      <span className="invisible flex items-center gap-2 text-sm font-medium font-mono whitespace-nowrap" aria-hidden="true">
        <span className="w-1.5 h-1.5 rounded-full" />
        {sizerText}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        {!hovered ? (
          <motion.span
            key="default"
            className="absolute inset-0 flex items-center justify-center gap-2 text-brand-orange text-sm font-medium font-mono whitespace-nowrap"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={TEXT_TRANSITION}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" aria-hidden="true" />
            {defaultLabel}
          </motion.span>
        ) : (
          <motion.span
            key="hover"
            className="absolute inset-0 flex items-center justify-center gap-2 text-brand-orange text-sm font-medium font-mono whitespace-nowrap"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={TEXT_TRANSITION}
          >
            {hoverLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

function QuienesSomosButton() {
  const [hovered, setHovered] = useState(false);
  const defaultLabel = "¿quiénes somos?";
  const hoverLabel = "conocé nuestra historia →";
  const sizerText = hoverLabel.length > defaultLabel.length ? hoverLabel : defaultLabel;

  return (
    <Link
      href="/about"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center justify-center border border-white/20 rounded-full px-6 py-3 overflow-hidden hover:border-white/50 transition-colors duration-300 cursor-pointer"
      aria-label={hoverLabel}
    >
      <span className="invisible text-sm font-medium whitespace-nowrap" aria-hidden="true">
        {sizerText}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        {!hovered ? (
          <motion.span
            key="default"
            className="absolute inset-0 flex items-center justify-center text-white/60 text-sm font-medium whitespace-nowrap"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={TEXT_TRANSITION}
          >
            {defaultLabel}
          </motion.span>
        ) : (
          <motion.span
            key="hover"
            className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium whitespace-nowrap"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={TEXT_TRANSITION}
          >
            {hoverLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default function HeroSection({ episodeCount }: { episodeCount: number }) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const progress = useSpring(scrollYProgress, SPRING);

  const contentY     = useTransform(progress, [0, 1], ["0%", "-18%"]);
  const contentScale = useTransform(progress, [0, 0.8], [1, 0.97]);
  const contentOpacity = useTransform(progress, [0, 0.55], [1, 0]);

  const glowScale   = useTransform(progress, [0, 1], [1, 0.82]);
  const glowOpacity = useTransform(progress, [0, 0.7], [0.08, 0]);

  const overlayOpacity = useTransform(progress, [0.2, 0.9], [0, 0.75]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-black px-4 pt-16 pb-48 sm:py-24 overflow-hidden"
      aria-label="Hero"
    >
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

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black pointer-events-none z-[1]"
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="relative z-[2] text-center w-full"
        style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}
      >
        <HeroLogo />

        <div className="max-w-3xl mx-auto mt-6">
          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <EpisodesBadgeButton episodeCount={episodeCount} />
            <QuienesSomosButton />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
