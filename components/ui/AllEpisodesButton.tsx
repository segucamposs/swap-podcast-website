"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function AllEpisodesButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href="/episodes" aria-label="Ver todos los episodios">
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative flex items-center gap-3 border border-white/15 rounded-full px-7 py-3.5 overflow-hidden cursor-pointer"
        animate={{ borderColor: hovered ? "rgba(255,117,31,0.5)" : "rgba(255,255,255,0.15)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Fill on hover */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-brand-orange origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          style={{ transformOrigin: "left" }}
        />

        {/* Label */}
        <motion.span
          className="relative z-10 text-sm font-semibold tracking-wide"
          animate={{ color: hovered ? "#ffffff" : "rgba(255,255,255,0.75)" }}
          transition={{ duration: 0.2 }}
        >
          Ver todos los episodios
        </motion.span>

        {/* Arrow */}
        <motion.span
          aria-hidden
          className="relative z-10 text-base leading-none"
          animate={{
            x: hovered ? 4 : 0,
            color: hovered ? "#ffffff" : "rgba(255,117,31,1)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          →
        </motion.span>
      </motion.div>
    </Link>
  );
}
