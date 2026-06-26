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

const EASE   = [0.76, 0, 0.24, 1] as const;
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
  const inView     = useInView(sectionRef, { once: true, margin: "-5%" });

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

  const imageScale   = useTransform(rawProgress, [0, 1], [1.1, 1]);
  const imageOpacity = useTransform(rawProgress, [0, 0.5], [0, 1]);

  return (
    <motion.section
      ref={sectionRef}
      aria-label="Quiénes somos"
      className="relative z-10 overflow-hidden bg-black"
      style={{ clipPath, y: cardY }}
    >
      {/* ── Photo — left side only, fades before text column ───────── */}
      <motion.div
        className="absolute inset-y-0 left-0 w-[52%] pointer-events-none select-none"
        style={{
          scale: imageScale,
          opacity: imageOpacity,
          maskImage: [
            "linear-gradient(to right,  transparent 0%,  black 8%,  black 62%, transparent 94%)",
            "linear-gradient(to bottom, transparent 0%,  black 8%,  black 70%, transparent 88%)",
          ].join(", "),
          WebkitMaskImage: [
            "linear-gradient(to right,  transparent 0%,  black 8%,  black 62%, transparent 94%)",
            "linear-gradient(to bottom, transparent 0%,  black 8%,  black 70%, transparent 88%)",
          ].join(", "),
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <div className="absolute inset-0 bg-black/20 z-10" />
        <Image
          src="/images/quienes-somos-bg.png"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "78% 65%" }}
          aria-hidden
        />
      </motion.div>

      {/* Mobile: bottom fade so text is readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none sm:hidden"
        style={{
          background:
            "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,1) 70%)",
        }}
      />


      {/* ── Two-column layout ─────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 min-h-[640px]">

        {/* Left: empty — image shows through */}
        <div className="hidden sm:block" />

        {/* Right: copy */}
        <div className="flex flex-col justify-center px-8 sm:px-12 py-24 bg-black">

          {/* Label */}
          <motion.p
            className="text-white/35 text-xs font-mono uppercase tracking-widest mb-7"
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

          {/* Body */}
          <motion.p
            className="text-white/55 text-base leading-relaxed mb-10 max-w-sm"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
          >
            SWAP es el podcast en español sobre salud, carrera, emprendimiento
            e IA — sin postureo, sin guión. Para los que están construyendo
            algo y todavía no tienen todo claro.
          </motion.p>

          {/* Hosts */}
          <motion.div
            className="flex flex-col gap-3 mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          >
            {[
              { nick: "Segu", full: "Segundo Campos",   orange: true,  handle: "@segucampos", href: "https://instagram.com/segucampos" },
              { nick: "Fran", full: "Francisco Bottaro", orange: false, handle: null,           href: null },
            ].map((h) => (
              <div key={h.nick} className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${h.orange ? "bg-brand-orange" : "bg-white/25"}`} />
                <span className="text-white/80 text-sm font-semibold">{h.full}</span>
                <span className="text-white/30 text-xs font-mono">{h.nick}</span>
                {h.href && (
                  <a
                    href={h.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-white/25 text-xs font-mono hover:text-brand-orange transition-colors duration-200"
                  >
                    {h.handle}
                  </a>
                )}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.95 }}
          >
            <Link
              href="/about"
              className="text-sm text-white/30 hover:text-brand-orange transition-colors duration-200 font-mono tracking-wide"
            >
              Conocé más sobre SWAP →
            </Link>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
