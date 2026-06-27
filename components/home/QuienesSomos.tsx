"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";

const EASE = [0.76, 0, 0.24, 1] as const;
const SPRING = { stiffness: 60, damping: 18, mass: 0.6 };

// ─── Masked line — driven by parent inView, not its own observer ──────────────
function MaskLine({
  children,
  delay = 0,
  inView,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden leading-[1.1] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={inView ? { y: "0%" } : { y: "105%" }}
        transition={{ duration: 0.85, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function QuienesSomos() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-5%" });
  const [ctaHovered, setCtaHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 65%"],
  });

  const rawProgress = useSpring(scrollYProgress, SPRING);

  const clipPath = useTransform(rawProgress, [0, 1], [
    "inset(18% 0% 0% 0% round 32px 32px 0px 0px)",
    "inset(0%  0% 0% 0% round 0px  0px  0px 0px)",
  ]);
  const cardY = useTransform(rawProgress, [0, 1], ["6%", "0%"]);

  const imageScale = useTransform(rawProgress, [0, 1], [1.1, 1]);
  const imageOpacity = useTransform(rawProgress, [0, 0.5], [0, 1]);

  return (
    <motion.section
      ref={sectionRef}
      aria-label="Quiénes somos"
      className="relative z-10 overflow-hidden bg-black"
      style={{ clipPath, y: cardY }}
    >
      {/* ── Photo — top, full width ───────── */}
      <motion.div
        className="relative w-full h-[520px] sm:h-[660px] pointer-events-none select-none overflow-hidden"
        style={{ scale: imageScale, opacity: imageOpacity }}
      >
        {/* Inner wrapper carries the crop transform — keeps it off the <img> so
            Next.js image optimization doesn't interact with scale in production */}
        <div
          className="absolute inset-0"
          style={{ transform: "scale(1.12) translateX(-5%) translateY(3%)" }}
        >
          <Image
            src="/images/quienes-somos-bg.png"
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
            style={{ objectPosition: "center 10%" }}
            aria-hidden
          />
        </div>
        {/* Cinematic vignette — overlay blends cleanly at all edges */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: [
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 6%, rgba(0,0,0,0.1) 18%, transparent 30%)",
              "linear-gradient(to top,    black 0%, rgba(0,0,0,0.55) 14%, transparent 32%)",
              "linear-gradient(to right,  black 0%, rgba(0,0,0,0.45) 10%, transparent 26%)",
              "linear-gradient(to left,   black 0%, rgba(0,0,0,0.45) 10%, transparent 26%)",
            ].join(", "),
          }}
        />
      </motion.div>

      {/* ── Copy — below, centered ───────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pb-16 pt-4 bg-black">

        {/* Label */}
        <motion.p
          className="text-white/60 text-xs font-mono uppercase tracking-widest mb-7"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Quiénes somos
        </motion.p>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl font-black mb-7">
          <MaskLine delay={0.3} inView={inView}>
            Dos pibes que tienen
          </MaskLine>
          <MaskLine delay={0.48} inView={inView} className="text-brand-orange">
            muchas preguntas.
          </MaskLine>
        </h2>

        {/* Hosts */}
        <motion.p
          className="text-white/50 text-sm font-medium mb-10 tracking-wide"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
        >
          Francisco Bottaro
          <span className="mx-2.5 text-white/20">·</span>
          Segundo Campos
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.95 }}
        >
          <Link href="/about" aria-label="Conocé más sobre SWAP">
            <motion.div
              onHoverStart={() => setCtaHovered(true)}
              onHoverEnd={() => setCtaHovered(false)}
              className="relative inline-flex items-center gap-3 border border-white/15 rounded-full px-7 py-3.5 overflow-hidden cursor-pointer"
              animate={{ borderColor: ctaHovered ? "rgba(255,117,31,0.5)" : "rgba(255,255,255,0.15)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Fill sweep */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-brand-orange"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: ctaHovered ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                style={{ transformOrigin: "left" }}
              />

              {/* Label */}
              <motion.span
                className="relative z-10 text-sm font-semibold tracking-wide"
                animate={{ color: ctaHovered ? "#ffffff" : "rgba(255,255,255,0.75)" }}
                transition={{ duration: 0.2 }}
              >
                Conocé más sobre SWAP
              </motion.span>

              {/* Arrow */}
              <motion.span
                aria-hidden
                className="relative z-10 text-base leading-none"
                animate={{
                  x: ctaHovered ? 4 : 0,
                  color: ctaHovered ? "#ffffff" : "rgba(255,117,31,1)",
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                →
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </motion.section>
  );
}
