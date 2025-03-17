"use client";

import Lenis from "lenis";
import { useEffect } from "react";

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * LenisProvider is a React provider that provides a Lenis instance to the app.
 * It is used to handle the Lenis instance and the Lenis options.
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 3,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
