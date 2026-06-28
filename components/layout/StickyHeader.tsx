"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function StickyHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    // Non-home pages: always visible
    if (!isHome) {
      // Non-home pages are always visible — sync setState is intentional here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    // Homepage: visible only once the hero logo has scrolled past the top
    const heroEl = document.getElementById("hero-logo");
    if (!heroEl) {
      setVisible(false);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, [isHome, pathname]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[90]"
      style={{ pointerEvents: visible ? "auto" : "none" }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {/* Blurred bar — clean rectangle, no masking artifacts */}
      <header
        aria-label="Barra de navegación"
        className="flex items-center px-5 sm:px-8"
        style={{
          height: 60,
          backdropFilter: "blur(20px) saturate(1.5)",
          WebkitBackdropFilter: "blur(20px) saturate(1.5)",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <Link
          href="/"
          aria-label="SWAP — volver al inicio"
          tabIndex={visible ? 0 : -1}
        >
          <Image
            src="/logo/swap-logo-transparent.png"
            alt="SWAP Podcast"
            width={4923}
            height={1357}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>


      </header>

      {/* Gradient fade — separate element so backdrop-blur stays crisp */}
      <div
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          height: 48,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)",
        }}
      />
    </motion.div>
  );
}
