"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const EASE = [0.76, 0, 0.24, 1] as const;

// ─── Masked line — driven by parent inView ────────────────────────────────────
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

// ─── Fade-up wrapper — reveals once on scroll ─────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

type Social = { type: "instagram" | "tiktok" | "x"; href: string };

const HOSTS: {
  name: string;
  role: string;
  socials: Social[];
}[] = [
  {
    name: "Francisco Bottaro",
    role: "Co-Host · Ingeniería en IA (UCA)",
    socials: [
      { type: "instagram", href: "https://www.instagram.com/franbottaro/" },
      { type: "tiktok", href: "https://www.tiktok.com/@franbottaroo" },
      { type: "x", href: "https://x.com/FranBottaroo" },
    ],
  },
  {
    name: "Segundo Campos",
    role: "Co-Host · Negocios y Tecnología (ITBA)",
    socials: [
      { type: "instagram", href: "https://www.instagram.com/segucampos/" },
      { type: "tiktok", href: "https://www.tiktok.com/@segucamposs" },
      { type: "x", href: "https://x.com/segucamposs" },
    ],
  },
];

// ─── Social icons — same PNG assets the footer uses ──────────────────────────
const SOCIAL_ICONS: Record<
  Social["type"],
  { src: string; label: string; size: string }
> = {
  instagram: { src: "/icons/instagram.png", label: "Instagram", size: "w-5 h-5" },
  tiktok: { src: "/icons/tiktok.png", label: "TikTok", size: "w-5 h-5" },
  // X mark sits inside a circle, so it needs more frame to match the others
  x: { src: "/icons/x.png", label: "X", size: "w-7 h-7" },
};

function SocialIcon({ social }: { social: Social }) {
  const icon = SOCIAL_ICONS[social.type];
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={icon.label}
      className="inline-flex h-7 w-7 items-center justify-center"
    >
      <Image
        src={icon.src}
        alt=""
        width={28}
        height={28}
        className={`${icon.size} object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100`}
      />
    </a>
  );
}

export default function AboutContent() {
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-5%" });

  return (
    <div className="bg-black">
      {/* ── 1 · Título ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative px-6 pt-28 pb-12 text-center"
        aria-label="Quiénes somos"
      >
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white">
          <MaskLine delay={0.15} inView={heroInView}>
            Quiénes <span className="text-brand-orange">somos</span>
          </MaskLine>
        </h1>
      </section>

      {/* ── 2 · Foto de los dos ─────────────────────────────────────── */}
      <section className="pb-20" aria-label="Los hosts de SWAP">
        <Reveal>
          <div className="relative w-full h-[440px] sm:h-[620px] overflow-hidden">
            <Image
              src="/images/quienes-somos-bg.webp"
              alt="Segundo Campos y Francisco Bottaro, hosts de SWAP Podcast"
              fill
              sizes="100vw"
              quality={90}
              className="object-cover"
              style={{ objectPosition: "center 25%" }}
              priority
            />
            {/* Edge fades — top + both sides + soft bottom, blends into black */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: [
                  "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.45) 8%, transparent 28%)",
                  "linear-gradient(to top,    black 0%, transparent 22%)",
                  "linear-gradient(to right,  black 0%, transparent 24%)",
                  "linear-gradient(to left,   black 0%, transparent 24%)",
                ].join(", "),
              }}
            />
          </div>
        </Reveal>
      </section>

      {/* ── 3 · Quién es cada uno — emerge del fade de la foto ──────── */}
      <section
        className="relative z-10 -mt-20 sm:-mt-28 px-6 pb-24"
        aria-label="Los hosts"
      >
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-12 sm:gap-16">
          {HOSTS.map((host, i) => (
            <Reveal key={host.name} delay={i * 0.12} className="text-center">
              <h3 className="text-white font-bold text-2xl mb-1.5">
                {host.name}
              </h3>
              <p className="text-brand-orange text-sm font-medium mb-5">
                {host.role}
              </p>
              <div className="flex items-center justify-center gap-4">
                {host.socials.map((social) => (
                  <SocialIcon key={social.type} social={social} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 4 · Por qué nació SWAP ──────────────────────────────────── */}
      <section
        className="relative bg-zinc-950 border-y border-white/5 px-6 py-24 overflow-hidden"
        aria-labelledby="why-heading"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 30%, rgba(255,117,31,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <Reveal>
            <p className="text-brand-orange text-xs font-mono uppercase tracking-widest mb-5">
              Cómo nació SWAP
            </p>
            <h2
              id="why-heading"
              className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            >
              No teníamos las respuestas. Teníamos las preguntas.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-white/60 text-lg leading-relaxed mb-12">
              SWAP nació de una idea simple: preguntarles a las personas que
              admiramos todo lo que siempre quisimos saber. No somos expertos
              bajando línea desde un pedestal — somos dos pibes con muchas preguntas,
              aprendiendo junto a vos. Hablamos de todo lo que suma:
              salud, productividad, carrera, dinero, tecnología y cómo funciona la
              mente. Si te sirve para vivir un poco mejor, es tema.
            </p>
            <p className="text-brand-orange text-xs font-mono uppercase tracking-widest mb-4">
              A dónde vamos
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              Lo que queremos construir es simple: un lugar para cualquiera que
              quiera más de su vida. No importa la edad ni desde dónde arrancás — si
              tenés la curiosidad y las ganas de crecer, esto es para vos. Una
              comunidad, no una audiencia.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 5 · Mini cierre — contacto ──────────────────────────────── */}
      <section className="px-6 py-20 text-center" aria-label="Contacto">
        <Reveal className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            ¿Querés contactarnos?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-orange text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-orange/85 transition-colors duration-200"
          >
            Escribinos
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
