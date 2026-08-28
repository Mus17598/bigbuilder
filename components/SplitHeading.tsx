'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { splitChars } from '@/lib/split';
import { motionEnabled } from '@/lib/scroll';

/**
 * A heading that reveals its glyphs on scroll, or on demand.
 *
 * `mode="scroll"` builds a ScrollTrigger at top 80%. `mode="manual"` leaves
 * the chars parked offscreen for a parent timeline to drive, which is how the
 * hero syncs its headline to the preloader curtain instead of to scroll.
 */
export default function SplitHeading({
  as: Tag = 'h2',
  children,
  className,
  stagger = 0.022,
  delay = 0,
  mode = 'scroll',
  onSplit,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  mode?: 'scroll' | 'manual';
  /** Receives the glyph spans so a parent timeline can animate them. */
  onSplit?: (chars: HTMLElement[]) => void;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Under reduced motion the heading must already be in its final state.
    if (!motionEnabled()) {
      onSplit?.([]);
      return;
    }

    const { chars, revert } = splitChars(el);
    gsap.set(chars, { yPercent: 110 });
    onSplit?.(chars);

    if (mode === 'manual') return revert;

    const tween = gsap.to(chars, {
      yPercent: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger,
      delay,
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      revert();
    };
  }, [stagger, delay, mode, onSplit]);

  return (
    <Tag ref={ref} className={className} data-reveal>
      {children}
    </Tag>
  );
}
