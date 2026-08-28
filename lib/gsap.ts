'use client';

/**
 * Central GSAP registration. Import gsap and ScrollTrigger from HERE, never
 * from 'gsap' directly — registering a plugin twice in a Next.js client
 * bundle creates two ScrollTrigger instances that do not share a scroller
 * proxy, and pinned sections silently stop tracking Lenis.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

if (typeof window !== 'undefined' && !registered) {
  gsap.registerPlugin(ScrollTrigger);

  /**
   * lagSmoothing(0) disables GSAP's "catch up after a stalled frame" logic.
   * With scrub-linked video that logic causes a visible jump: the tab
   * throttles, GSAP fast-forwards, and the video seeks several seconds at
   * once. Off is correct for a scroll-driven site.
   */
  gsap.ticker.lagSmoothing(0);

  registered = true;
}

export { gsap, ScrollTrigger };
