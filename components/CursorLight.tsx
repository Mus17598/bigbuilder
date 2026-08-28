'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/scroll';

/**
 * A soft accent radial that trails the pointer by ~120ms.
 *
 * gsap.quickTo returns a pre-compiled single-property setter. Compared with
 * calling gsap.to() on every mousemove — which allocates a new tween object
 * per event, dozens per second — quickTo reuses one tween and just retargets
 * it. That difference is the whole reason this can run at 60fps alongside
 * pinned ScrollTriggers.
 */
export default function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const lag = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--cursor-lag')
    ) || 0.12;

    const xTo = gsap.quickTo(el, 'x', { duration: lag, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: lag, ease: 'power3.out' });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(el, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      }
    };
    const onLeave = () => gsap.to(el, { opacity: 0, duration: 0.4 });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  return <div ref={ref} className="cursor-light" aria-hidden="true" />;
}
