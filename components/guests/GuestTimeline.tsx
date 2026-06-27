"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { Episode } from "@/lib/episodes/types";
import { getGuestMeta } from "@/lib/episodes/guest-meta";

const EASE = [0.76, 0, 0.24, 1] as const;

// Serpentine geometry — guests alternate sides, but each side wanders so the
// path never feels mechanical. Values are % of the track width.
const LEFT_XS = [18, 26, 15, 23];
const RIGHT_XS = [82, 74, 85, 77];
const Y_UNIT = 100; // svg units per guest row
const BOW = 0.6; // how hard the curve swings past each node toward the edges

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

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
  const inView = useInView(ref, { once: true, margin: "-10%" });
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

function monthYear(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("es-AR", { month: "short", year: "numeric" })
    .replace(".", "");
}

/** Episode summary = the intro paragraph, before the "what we cover" list. */
function episodeSummary(ep: Episode): string {
  let d = (ep.description ?? "").replace(/\s+/g, " ").trim();
  const idx = d.search(/en este episodio/i);
  if (idx > 40) d = d.slice(0, idx).trim();
  if (d.length > 175) {
    const slice = d.slice(0, 175);
    const end = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("? "),
      slice.lastIndexOf("! "),
    );
    d = end > 90 ? slice.slice(0, end + 1) : slice.replace(/\s+\S*$/, "") + "…";
  }
  return d || ep.topic || "";
}

type Node = { x: number; y: number; side: "left" | "right"; ep: Episode };

/**
 * Snaking path that bows past each node toward the screen edges, so the line
 * swings side to side instead of running a straight diagonal. Ends exactly on
 * the last node so the draw completes at the final episode.
 */
function buildPath(nodes: Node[]): string {
  const pts = [{ x: 50, y: 0 }, ...nodes.map((n) => ({ x: n.x, y: n.y }))];
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const dy = cur.y - prev.y;
    // Push the control handles outward from center → wide, sweeping swings.
    const c1x = clamp(prev.x + (prev.x - 50) * BOW, 4, 96);
    const c2x = clamp(cur.x + (cur.x - 50) * BOW, 4, 96);
    d += ` C ${c1x.toFixed(2)} ${(prev.y + dy * 0.42).toFixed(2)} ${c2x.toFixed(
      2,
    )} ${(cur.y - dy * 0.42).toFixed(2)} ${cur.x.toFixed(2)} ${cur.y.toFixed(2)}`;
  }
  return d;
}

// ─── One stop on the curve — photo sits exactly on the line ───────────────────
function TimelineStop({ node, topPct }: { node: Node; topPct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { ep, side } = node;
  const isLeft = side === "left";

  // Reveal driven by scroll position (not IntersectionObserver) — deterministic,
  // Lenis-friendly, and never misses. The photo fades to full as it climbs from
  // the bottom edge to the lower third, so it's already there before the line
  // sweeps in. progress 0 = stop entering at viewport bottom, 1 = top at 68%.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 68%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  const meta = getGuestMeta(ep.slug);
  const photo = meta?.photo ?? ep.artworkUrl ?? ep.thumbnailUrl ?? null;
  const summary = meta?.summary ?? episodeSummary(ep);

  return (
    <div
      ref={ref}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.x}%`, top: `${topPct}%` }}
    >
      <Link
        href={`/episodes/${ep.slug}`}
        className="group relative block"
        aria-label={`Escuchar episodio con ${ep.guest}`}
      >
        {/* Photo — centered on the curve point. Frame hugs the image's aspect
            ratio so nothing is cropped; always opaque so it cleanly masks the
            line behind it (no bleed-through at the junction). */}
        <div
          style={{ aspectRatio: meta?.aspect ?? 16 / 9 }}
          className="relative w-36 overflow-hidden rounded-2xl border-2 border-brand-orange/70 bg-zinc-900 shadow-[0_0_0_5px_rgba(255,117,31,0.12)] transition-transform duration-500 group-hover:scale-105 sm:w-52"
        >
          {photo ? (
            <Image
              src={photo}
              alt={`${ep.guest} en SWAP Podcast`}
              fill
              sizes="(max-width: 640px) 144px, 208px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-heading text-3xl font-black text-white/15">
                {ep.guest.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Text — beside the photo, on the open side (toward center) */}
        <motion.div
          style={{ opacity }}
          className={[
            "absolute top-1/2 -translate-y-1/2 w-[clamp(8.5rem,40vw,18rem)]",
            isLeft
              ? "left-full ml-3 text-left sm:ml-5"
              : "right-full mr-3 text-right sm:mr-5",
          ].join(" ")}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-brand-orange">
            {monthYear(ep.publishedAt)} · {ep.guest}
          </p>
          <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-white transition-colors duration-200 group-hover:text-brand-orange sm:text-xl">
            {ep.title}
          </h3>
          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-white/50 sm:text-sm">
            {summary}
          </p>
        </motion.div>
      </Link>
    </div>
  );
}

export default function GuestTimeline({
  guests,
  count,
}: {
  guests: Episode[];
  count: number;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-5%" });

  // Geometry — alternate sides, wander the x within each side.
  const n = guests.length;
  const nodes: Node[] = guests.map((ep, i) => {
    const isLeft = i % 2 === 0;
    const band = Math.floor(i / 2);
    const x = isLeft
      ? LEFT_XS[band % LEFT_XS.length]
      : RIGHT_XS[band % RIGHT_XS.length];
    return { x, y: (i + 0.5) * Y_UNIT, side: isLeft ? "left" : "right", ep };
  });
  const totalY = n * Y_UNIT;
  const pathD = n > 0 ? buildPath(nodes) : "";

  // Scroll-driven draw — completes as the last episode reaches view.
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 85%", "end 82%"],
  });
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="bg-black">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="px-6 pt-28 pb-16 text-center"
        aria-label="Invitados"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mb-5 font-mono text-xs uppercase tracking-widest text-brand-orange"
        >
          Invitados · {count} episodios
        </motion.p>
        <h1 className="text-5xl font-black text-white sm:text-6xl lg:text-7xl">
          <MaskLine delay={0.15} inView={heroInView}>
            La línea de <span className="text-brand-orange">tiempo</span>
          </MaskLine>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="mx-auto mt-6 max-w-xl text-lg text-white/50"
        >
          Del primer invitado al último. Scrolleá y mirá cómo fuimos creciendo —
          una foto, una charla, a la vez.
        </motion.p>
        <motion.span
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="mt-10 inline-block text-white/20"
          aria-hidden
        >
          ↓
        </motion.span>
      </section>

      {/* ── Serpentine timeline ──────────────────────────────────────── */}
      {n === 0 ? (
        <p className="py-24 text-center text-white/40">Cargando invitados…</p>
      ) : (
        <section className="px-4 pb-28 sm:px-6" aria-label="Línea de tiempo de invitados">
          <div
            ref={trackRef}
            className="relative mx-auto w-full max-w-3xl"
            style={{ height: `calc(${n} * clamp(15rem, 38vw, 21rem))` }}
          >
            {/* The curve */}
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 100 ${totalY}`}
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d={pathD}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                d={pathD}
                stroke="var(--color-brand-orange)"
                strokeWidth={2.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength }}
              />
            </svg>

            {/* Photo stops */}
            {nodes.map((node, i) => (
              <TimelineStop
                key={node.ep.id}
                node={node}
                topPct={((i + 0.5) / n) * 100}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-t border-white/5 bg-zinc-950 px-6 py-24"
        aria-labelledby="guest-cta-heading"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 30%, rgba(255,117,31,0.06) 0%, transparent 70%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-2xl text-center">
          <h2
            id="guest-cta-heading"
            className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          >
            ¿Querés ser el próximo?
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-white/55">
            Si tenés algo valioso para compartir con jóvenes de 16 a 25 años, nos
            encantaría sumarte a la línea de tiempo. Sin currículo perfecto — solo
            algo real para decir.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-brand-orange/85"
          >
            Proponer un episodio
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
