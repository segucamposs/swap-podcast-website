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
    // Past = no longer intersecting AND above the viewport (bottom < 0).
    const obs = new IntersectionObserver(([entry]) => {
      setIsPast(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
    });
    obs.observe(el);
    return () => obs.disconnect();
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
          sizes="(max-width: 896px) 100vw, 896px"
          priority
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
}
