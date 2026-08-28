'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { motionEnabled } from '@/lib/scroll';

/**
 * Renders a service's stroke paths and, when `draw` flips true, animates each
 * one in with the stroke-dashoffset technique: set dasharray and dashoffset to
 * the path's own length so it renders as a single invisible dash, then tween
 * the offset to 0 so the line appears to be drawn.
 *
 * getTotalLength() must be called on a laid-out element, which is why this
 * runs in an effect rather than at render.
 */
export default function ServiceIcon({
  paths,
  accent,
  draw = false,
  size = 32,
}: {
  paths: string[];
  /** CSS custom property name, e.g. '--acc-crm'. */
  accent: string;
  draw?: boolean;
  size?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const els = Array.from(svg.querySelectorAll('path'));

    if (!motionEnabled()) {
      els.forEach((p) => {
        p.style.strokeDasharray = 'none';
        p.style.strokeDashoffset = '0';
      });
      return;
    }

    els.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = draw ? '0' : `${len}`;
    });

    if (!draw) return;
    const tween = gsap.fromTo(
      els,
      { strokeDashoffset: (i: number) => els[i].getTotalLength() },
      { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out', stagger: 0.08 }
    );
    return () => {
      tween.kill();
    };
  }, [draw, paths]);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={`var(${accent})`}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
