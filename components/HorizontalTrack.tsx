'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * A pinned section whose inner track slides sideways as the page scrolls.
 *
 * Extracted after building the service rack, because the analytics gallery and
 * the process track need the same three non-obvious pieces:
 *   - travel distance derived from the track so speed is viewport-independent
 *   - invalidateOnRefresh, or the distance goes stale on resize
 *   - gsap.matchMedia, so mobile gets a plain scrolling row with no pin left
 *     behind when the query flips
 *
 * onProgress fires at frame rate and must not setState.
 */
export default function HorizontalTrack({
  children,
  className,
  trackClassName,
  onProgress,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  onProgress?: (progress: number) => void;
  ariaLabel?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => onProgress?.(self.progress),
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [onProgress]);

  return (
    <div ref={sectionRef} className={className} aria-label={ariaLabel}>
      <div ref={trackRef} className={trackClassName}>
        {children}
      </div>
    </div>
  );
}
