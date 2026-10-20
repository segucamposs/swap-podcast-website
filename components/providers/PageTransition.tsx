"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

export default function PageTransition() {
  const pathname              = usePathname();
  const [overlay, setOverlay] = useState(true);   // visible on first paint
  const [logo,    setLogo]    = useState(false);

  useEffect(() => {
    // Sync state resets on route change are intentional for the transition animation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOverlay(true);
    setLogo(false);

    const t1 = setTimeout(() => setLogo(true),    150);
    const t2 = setTimeout(() => setLogo(false),   600);
    const t3 = setTimeout(() => setOverlay(false), 820);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {overlay && (
        <motion.div
          key="page-transition"
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-6 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <AnimatePresence>
            {logo && (
              <motion.div
                key="transition-logo"
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1,  scale: 1,    y: 0  }}
                exit={{    opacity: 0,  scale: 1.04, y: -8 }}
                transition={{ duration: 0.22, ease: [0.76, 0, 0.24, 1] }}
              >
                <Image
                  src="/logo/swap-logo-transparent.png"
                  alt="SWAP"
                  width={140}
                  height={39}
                  className="w-36 h-auto"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* thin orange pulse bar */}
          <AnimatePresence>
            {logo && (
              <motion.div
                key="transition-bar"
                className="h-px w-16 bg-brand-orange rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{    scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
