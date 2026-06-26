"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";

export default function HeroLogo() {
  const ref = useRef<HTMLDivElement>(null);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      setIsPast(rect.bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // id="hero-logo" is read by StickyHeader to know when to appear on the homepage
    <div ref={ref} id="hero-logo" className="max-w-4xl mx-auto px-2 mb-8">
      <motion.div
        animate={{ opacity: isPast ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <Image
          src="/logo/swap-logo-transparent.png"
          alt="SWAP Podcast"
          width={4923}
          height={1357}
          priority
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
}
