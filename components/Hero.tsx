'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { motionEnabled } from '@/lib/scroll';
import { scrollToSection } from '@/lib/lenis';
import { onSiteReady } from '@/lib/signals';
import MediaFrame from './MediaFrame';
import MagneticButton from './MagneticButton';
import SplitHeading from './SplitHeading';

const KICKER = 'AI Automation · CRM · Web · Apps · Growth systems';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);

  // Stable identity: SplitHeading lists onSplit as an effect dependency, so an
  // inline arrow here would re-split the heading on every render.
  const takeChars = useCallback((chars: HTMLElement[]) => {
    charsRef.current = chars;
  }, []);

  /* ---- Intro, fired by the preloader curtain rather than by scroll ---- */
  useEffect(() => {
    const kicker = kickerRef.current;
    const content = contentRef.current;
    if (!kicker || !content) return;

    if (!motionEnabled()) {
      gsap.set([kicker, ...content.querySelectorAll('[data-hero-fade]')], { opacity: 1 });
      return;
    }

    const fades = content.querySelectorAll('[data-hero-fade]');
    gsap.set(fades, { opacity: 0, y: 24 });
    gsap.set(kicker, { opacity: 0, letterSpacing: '0.4em' });

    const off = onSiteReady(() => {
      const tl = gsap.timeline();
      tl.to(kicker, {
        opacity: 1,
        // Tightening the tracking as it fades in reads as the line settling
        // into place rather than simply appearing.
        letterSpacing: '0.18em',
        duration: 1.1,
        ease: 'expo.out',
      })
        .to(
          charsRef.current,
          { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.022 },
          0.15
        )
        .to(fades, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, 0.5);
    });

    return off;
  }, []);

  /* ---- Scroll-linked exit over the first 100vh ---- */
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const content = contentRef.current;
    if (!section || !media || !content) return;
    if (!motionEnabled()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Blur is expensive to animate. Keeping it to 6px on a single
      // compositor-promoted layer is affordable; blurring the text on top of
      // it would not be.
      tl.to(media, { scale: 1.12, filter: 'blur(6px)', ease: 'none' }, 0)
        // 1.4x parallax: content leaves faster than the page scrolls.
        .to(content, { yPercent: -40, opacity: 0, ease: 'none' }, 0)
        .to('[data-hero-scrim]', { opacity: 1, ease: 'none' }, 0);
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero" id="hero">
      <div ref={mediaRef} className="hero__media">
        <MediaFrame
          kind="video"
          src="/assets/video/hero-ambient-build.mp4"
          poster="/assets/images/img-hero-poster.jpg"
          aspect="auto"
          className="media-frame--fill"
        />
      </div>

      {/* Two scrims: a static one guaranteeing contrast at rest, and a second
          that darkens on scroll so the headline stays legible as it leaves. */}
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__scrim hero__scrim--scroll" data-hero-scrim aria-hidden="true" />

      <div ref={contentRef} className="hero__content shell">
        <p ref={kickerRef} className="hero__kicker mono">
          {KICKER}
        </p>

        <SplitHeading as="h1" className="hero__title" mode="manual" onSplit={takeChars}>
          We build the machine
          <br />
          your business <span className="accent-word">runs on.</span>
        </SplitHeading>

        <p className="hero__lede" data-hero-fade>
          BigBuilder designs, builds and runs the systems behind growing
          businesses, from the first automation to the whole stack.
        </p>

        <div className="hero__actions" data-hero-fade>
          <MagneticButton className="btn btn--primary" onClick={() => scrollToSection('#contact')}>
            Book a build call
          </MagneticButton>
          <MagneticButton
            className="btn btn--ghost"
            onClick={() => scrollToSection('#what-we-build')}
          >
            See what we build
          </MagneticButton>
        </div>
      </div>

      <div className="hero__indicator" aria-hidden="true" data-hero-fade>
        <span className="hero__indicator-dot" />
      </div>
    </section>
  );
}
