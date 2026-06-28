"use client";

import { useEffect, useState } from "react";

// Covers the page during the SSR→hydration gap so PageTransition is always
// the first thing seen. Unmounts itself through React state (not raw DOM
// removal) to avoid breaking React's internal fiber/node references.
export default function InitialOverlay() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Unmount the overlay after first paint — sync setState is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(false);
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "black",
        pointerEvents: "none",
      }}
    />
  );
}
