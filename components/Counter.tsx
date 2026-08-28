'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { motionEnabled } from '@/lib/scroll';

/**
 * Ticks from zero to `value` when it passes 50% of the viewport.
 *
 * Formatting goes through Intl.NumberFormat rather than toFixed so grouping
 * and decimals follow the visitor's locale, and the width stays stable while
 * the number climbs. Under reduced motion the final value is written straight
 * out with no tween.
 */
export default function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const write = (n: number) => {
      el.textContent = `${prefix}${format.format(n)}${suffix}`;
    };

    if (!motionEnabled()) {
      write(value);
      return;
    }

    write(0);
    const counter = { n: 0 };
    const tween = gsap.to(counter, {
      n: value,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => write(counter.n),
      scrollTrigger: { trigger: el, start: 'top 50%', once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, decimals, prefix, suffix]);

  return <span ref={ref} className={className} />;
}
