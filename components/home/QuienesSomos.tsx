"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";

// ─── Config ───────────────────────────────────────────────────────────────────

const EASE   = [0.76, 0, 0.24, 1] as const;
const SPRING = { stiffness: 60, damping: 18, mass: 0.6 };

// ─── Masked line reveal ───────────────────────────────────────────────────────

function MaskLine({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function QuienesSomos() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });

  const rawProgress = useSpring(scrollYProgress, SPRING);

  const clipPath = useTransform(rawProgress, [0, 1], [
    "inset(6% 0% 0% 0% round 28px 28px 0px 0px)",
    "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
  ]);
  const cardY = useTransform(rawProgress, [0, 1], ["3%", "0%"]);

  return (
    <motion.section
      ref={sectionRef}
      aria-label="Quiénes somos"
      className="relative z-10 overflow-hidden bg-black"
      style={{ clipPath, y: cardY }}
    >
      {/* ── Background image — left side ──────────────────────────── */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-[55%] pointer-events-none select-none">
        <Image
          src="/images/quienes-somos-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden
        />
      </div>

      {/* ── Gradient fade: image → pure black (left → right) ─────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,1) 62%, rgba(0,0,0,1) 100%)",
        }}
      />
      {/* Mobile: also fade image from bottom so text is readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none sm:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,1) 65%)",
        }}
      />

      {/* ── Top accent line ───────────────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-white/10 origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      />

      {/* ── Layout: empty left | content right ───────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-28 grid grid-cols-1 sm:grid-cols-2 gap-0">

        {/* Left col: intentionally empty on desktop — image shows through */}
        <div className="hidden sm:block" />

        {/* Right col: all copy */}
        <div className="flex flex-col justify-center">

          {/* Label */}
          <motion.p
            className="text-white/30 text-xs font-mono uppercase tracking-widest mb-6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Quiénes somos
          </motion.p>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl font-black leading-[1.05] mb-6">
            <MaskLine delay={0.3}>Dos pibes que tienen</MaskLine>
            <MaskLine delay={0.45} className="text-brand-orange">
              muchas preguntas.
            </MaskLine>
          </h2>

          {/* Body */}
          <motion.p
            className="text-white/50 text-base leading-relaxed mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          >
            SWAP es el podcast en español sobre salud, carrera, emprendimiento
            e IA — sin postureo, sin guión. Para los que están construyendo
            algo y todavía no tienen todo claro.
          </motion.p>

          {/* Hosts inline */}
          <motion.div
            className="flex flex-col gap-4 mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
          >
            {[
              { nick: "Segu", full: "Segundo Campos", orange: true,  href: "https://instagram.com/segucampos" },
              { nick: "Fran", full: "Francisco Bottaro", orange: false, href: null },
            ].map((h) => (
              <div key={h.nick} className="flex items-center gap-3">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    h.orange ? "bg-brand-orange" : "bg-white/30"
                  }`}
                />
                <span className="text-white/80 text-sm font-medium">
                  {h.full}
                </span>
                <span className="text-white/30 text-sm font-mono">{h.nick}</span>
                {h.href && (
                  <a
                    href={h.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/25 text-xs font-mono hover:text-brand-orange transition-colors duration-200 ml-auto"
                  >
                    @segucampos
                  </a>
                )}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.95 }}
          >
            <Link
              href="/about"
              className="text-sm text-white/35 hover:text-brand-orange transition-colors duration-200 font-mono tracking-wide"
            >
              Conocé más sobre SWAP →
            </Link>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
