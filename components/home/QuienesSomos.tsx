"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "motion/react";
import Link from "next/link";

// ─── Config ───────────────────────────────────────────────────────────────────

const EASE       = [0.76, 0, 0.24, 1] as const;
const SPRING     = { stiffness: 60, damping: 18, mass: 0.6 };

const HOSTS = [
  {
    initials: "SC",
    name: "Segundo Campos",
    nick: "Segu",
    bio: "Estudiante de Ingeniería en Sistemas en ITBA. Co-fundador de SWAP. Convencido de que no hay que elegir entre los múltiples intereses — hay que construir con todos.",
    href: "https://instagram.com/segucampos",
    handle: "@segucampos",
    orange: true,
  },
  {
    initials: "FB",
    name: "Francisco Bottaro",
    nick: "Fran",
    bio: "Co-fundador de SWAP. La voz que dice lo que todos piensan pero nadie se anima. Editor, productor, y el que mantiene los pies en la tierra cuando las ideas se van al espacio.",
    href: null,
    handle: null,
    orange: false,
  },
];

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
    // overflow-hidden creates the invisible boundary; the child slides up into it
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

  // Scroll-driven clip-path: section rises up as a card over the hero
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });

  const rawProgress = useSpring(scrollYProgress, SPRING);

  // clipPath: rounded-top card emerges from below, corners straighten at full reveal
  const clipPath = useTransform(rawProgress, [0, 1], [
    "inset(6% 0% 0% 0% round 28px 28px 0px 0px)",
    "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
  ]);

  // Subtle upward drift as the card enters
  const cardY = useTransform(rawProgress, [0, 1], ["3%", "0%"]);

  return (
    <motion.section
      ref={sectionRef}
      aria-label="Quiénes somos"
      className="relative z-10 bg-black px-4 pt-28 pb-24"
      style={{ clipPath, y: cardY }}
    >
      {/* Top edge accent line — draws in as the card arrives */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-white/10 origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      />

      <div className="max-w-5xl mx-auto">

        {/* ── Label ─────────────────────────────────────────────────── */}
        <motion.p
          className="text-white/30 text-xs font-mono uppercase tracking-widest mb-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Quiénes somos
        </motion.p>

        {/* ── Headline — line-by-line mask reveal ───────────────────── */}
        <h2 className="text-4xl sm:text-5xl font-black leading-[1.05] mb-6">
          <MaskLine delay={0.3}>
            Dos pibes que tienen
          </MaskLine>
          <MaskLine delay={0.45} className="text-brand-orange">
            muchas preguntas.
          </MaskLine>
        </h2>

        {/* ── Body copy ─────────────────────────────────────────────── */}
        <motion.p
          className="text-white/45 text-base leading-relaxed max-w-xl mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
        >
          SWAP es el podcast en español sobre salud, carrera, emprendimiento e IA —
          sin postureo, sin guión. Para los que están construyendo algo y todavía
          no tienen todo claro.
        </motion.p>

        {/* ── Host cards — staggered entry ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {HOSTS.map((host, i) => (
            <motion.div
              key={host.initials}
              className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-8 hover:border-brand-orange/30 hover:bg-white/[0.05] transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.7 + i * 0.13, ease: EASE }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    host.orange
                      ? "bg-brand-orange/15 border border-brand-orange/30"
                      : "bg-white/8 border border-white/15"
                  }`}
                >
                  <span
                    className={`font-black text-sm font-mono ${
                      host.orange ? "text-brand-orange" : "text-white/60"
                    }`}
                  >
                    {host.initials}
                  </span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">
                    {host.name}
                  </p>
                  <p className="text-white/35 text-sm font-mono">{host.nick}</p>
                </div>
              </div>

              <p className="text-white/50 text-sm leading-relaxed">{host.bio}</p>

              {host.href && (
                <a
                  href={host.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-5 text-xs text-white/30 hover:text-brand-orange transition-colors duration-200 font-mono"
                >
                  {host.handle}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Link
            href="/about"
            className="text-sm text-white/35 hover:text-brand-orange transition-colors duration-200 font-mono tracking-wide"
          >
            Conocé más sobre SWAP →
          </Link>
        </motion.div>

      </div>
    </motion.section>
  );
}
