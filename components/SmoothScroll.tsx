'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion, wireScrollRefresh } from '@/lib/scroll';

/**
 * Mounts Lenis and marries it to GSAP's clock.
 *
 * Why not two RAF loops: Lenis ships its own requestAnimationFrame. If it runs
 * independently, Lenis writes scrollTop in frame N while ScrollTrigger reads it
 * in frame N+1 — pinned sections lag one frame behind the content and visibly
 * shear. Driving lenis.raf() from gsap.ticker puts both on one clock.
 *
 * Under prefers-reduced-motion Lenis is never constructed at all, so the page
 * falls back to plain native scrolling.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Still refresh triggers on resize so any static layout stays correct.
      return wireScrollRefresh();
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // ScrollTrigger must recompute on every Lenis frame, not on the native
    // scroll event (which Lenis suppresses).
    lenis.on('scroll', ScrollTrigger.update);

    // gsap.ticker passes time in SECONDS; Lenis expects MILLISECONDS.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    const unwireRefresh = wireScrollRefresh();

    return () => {
      unwireRefresh();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
