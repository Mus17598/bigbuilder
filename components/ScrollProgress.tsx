'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { motionEnabled } from '@/lib/scroll';

/**
 * 2px bar across the very top, filling as the page advances.
 *
 * It reads background-color from var(--accent), the runtime slot that each
 * section overwrites on enter. Because the CSS transition lives on the bar
 * itself, a section swapping the variable produces a smooth colour crossfade
 * rather than a hard cut, with no per-section tween to coordinate.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionEnabled()) return;

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(el, { scaleX: self.progress }),
    });

    return () => st.kill();
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={ref} className="scroll-progress__fill" />
    </div>
  );
}
