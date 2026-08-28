'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { motionEnabled } from '@/lib/scroll';

/**
 * Pulls toward the cursor while hovered, springs back on leave.
 *
 * The displacement is a fraction of the distance from the button's CENTRE to
 * the pointer, capped at --magnet-strength. Using the centre rather than the
 * raw pointer position is what makes the pull feel like attraction instead of
 * the element chasing the mouse.
 *
 * Disabled entirely on touch: without a hover state the button would stick
 * wherever the last tap left it.
 */
export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  type = 'button',
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionEnabled()) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const strength =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--magnet-strength')
      ) || 8;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      // Normalise by half-size so the cap is hit at the button's edge.
      xTo(gsap.utils.clamp(-strength, strength, (dx / (r.width / 2)) * strength));
      yTo(gsap.utils.clamp(-strength, strength, (dy / (r.height / 2)) * strength));
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        aria-label={ariaLabel}
        onClick={
          onClick
            ? (e) => {
                e.preventDefault();
                onClick();
              }
            : undefined
        }
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
