'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { setAccent } from '@/lib/scroll';
import ScrubVideo, { type ScrubVideoHandle } from './ScrubVideo';
import SplitHeading from './SplitHeading';

export interface DeepDiveLabel {
  text: string;
  /** Progress 0..1 at which the label lands. */
  at: number;
  /** Position over the media, in percent. */
  x: number;
  y: number;
}

export interface DeepDiveProps {
  id: string;
  eyebrow: string;
  heading: ReactNode;
  body: string;
  /** CSS custom property name from tokens.css. */
  accent: string;
  video: string;
  poster?: string;
  labels?: DeepDiveLabel[];
  /** 'split' puts the media left and children right. */
  layout?: 'full' | 'split';
  children?: ReactNode;
  /**
   * Called on every scroll frame with 0..1. Must be a STABLE reference and
   * must not call setState: it fires at frame rate, and re-rendering four
   * pinned sections at 60fps would flatten the frame budget. Consumers mutate
   * their own refs instead.
   */
  onProgress?: (progress: number) => void;
}

export default function DeepDive({
  id,
  eyebrow,
  heading,
  body,
  accent,
  video,
  poster,
  labels = [],
  layout = 'full',
  children,
  onProgress,
}: DeepDiveProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrubRef = useRef<ScrubVideoHandle>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    /* Pin and scrub on desktop only. Below 1024 the spec calls for stacked
       reveals, and pinning four beats on a phone both fights native scrolling
       and multiplies the DOM reparenting that ScrollTrigger's pin-spacer
       does. */
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({
        trigger: section,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: '+=250%',
        invalidateOnRefresh: true,
        /**
         * Accent ownership rides on THIS trigger rather than a second one
         * aimed at the same element. A separate trigger cannot measure a
         * pinned section: once pinned it is position:fixed, so its rect stops
         * tracking scroll and "top 65%" never resolves. The pin already knows
         * its own active range exactly.
         */
        onToggle: (self) => setAccent(self.isActive ? `var(${accent})` : 'var(--brand)'),
        onUpdate: (self) => {
          scrubRef.current?.seek(self.progress);

          /* Labels are toggled by class, not by React state. Twelve class
             writes per frame is nothing; twelve re-renders would not be. */
          labels.forEach((label, i) => {
            const el = labelRefs.current[i];
            if (!el) return;
            const on = self.progress >= label.at;
            if (el.dataset.on !== String(on)) {
              el.dataset.on = String(on);
              el.classList.toggle('is-on', on);
            }
          });

          onProgress?.(self.progress);
        },
      });

      return () => st.kill();
    });

    /* Mobile or reduced motion: no pin and no scrub, so every label must
       already be visible or the beat would read as an empty video frame. */
    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      labelRefs.current.forEach((el) => el?.classList.add('is-on'));
      const owner = ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        end: 'bottom 35%',
        onToggle: (self) => setAccent(self.isActive ? `var(${accent})` : 'var(--brand)'),
      });
      return () => owner.kill();
    });

    return () => mm.revert();
  }, [labels, accent, onProgress]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`beat beat--${layout}`}
      style={{ '--card-accent': `var(${accent})` } as React.CSSProperties}
    >
      <div className="grid-lines" aria-hidden="true" />

      <div className="beat__inner shell">
        <div className="beat__text">
          <p className="beat__eyebrow mono">{eyebrow}</p>
          <SplitHeading as="h2" className="beat__heading">
            {heading}
          </SplitHeading>
          <p className="beat__body">{body}</p>
          {layout === 'split' && children}
        </div>

        <div className="beat__stage">
          <ScrubVideo
            ref={scrubRef}
            src={video}
            poster={poster}
            aspect={layout === 'split' ? '4 / 5' : '16 / 9'}
            className="beat__media"
          />

          {labels.map((label, i) => (
            <span
              key={label.text}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="beat__label mono"
              style={{ left: `${label.x}%`, top: `${label.y}%` }}
            >
              {label.text}
            </span>
          ))}
        </div>
      </div>

      {layout === 'full' && children}
    </section>
  );
}
