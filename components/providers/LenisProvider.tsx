"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { frame } from "motion/react";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      // Expo-out easing — heavy inertia, snappy stop
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Sync Lenis RAF with Framer Motion's frame loop so scroll values stay in sync
    const update = (data: { timestamp: number }) => lenis.raf(data.timestamp);
    frame.update(update, true);

    return () => {
      frame.cancelUpdate(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
