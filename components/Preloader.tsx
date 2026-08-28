'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { announceSiteReady } from '@/lib/signals';

const WORDMARK = 'BIGBUILDER';

/** Hard ceiling on the entire preloader, enforced independently of the timeline. */
const HARD_CAP_MS = 1600;

/**
 * Letter-by-letter wordmark, a real progress readout, then a FLIP handoff of
 * the wordmark into its navbar position before the curtain wipes up.
 *
 * The cap is the important part. A preloader that waits on assets can trap a
 * visitor indefinitely on a slow connection, so a setTimeout races the
 * timeline and forces completion at 1.6s regardless of what has loaded. The
 * timeline is budgeted to land just inside that, so the failsafe normally
 * never fires; it exists for the case where it must.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Reduced motion: no curtain at all. The component returns null below, so
    // there is nothing to animate away and nothing to unlock.
    if (reduced) {
      announceSiteReady();
      return;
    }

    const root = rootRef.current;
    const word = wordRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    if (!root || !word || !count || !bar) return;

    // Lock scrolling for the duration so the visitor cannot scroll behind it.
    document.documentElement.style.overflow = 'hidden';

    const letters = Array.from(word.querySelectorAll<HTMLElement>('.preloader__glyph i'));

    /**
     * The glyphs start hidden via a CSS `transform: translateY(110%)` so there
     * is no flash before this script runs. But GSAP reads the COMPUTED
     * transform, which is a matrix, and a matrix cannot record that its
     * translation came from a percentage. GSAP therefore sees `y: 101px`, and
     * tweening `yPercent` to 0 would leave that pixel offset in place with the
     * letters still stuck under their masks.
     *
     * Re-declaring the same visual state in GSAP's own units clears the px
     * component and makes the tween below actually move them.
     */
    gsap.set(letters, { y: 0, yPercent: 110 });
    const progress = { value: 0 };
    let finished = false;

    const finish = () => {
      document.documentElement.style.overflow = '';
      setGone(true);
      // No-op if the FLIP handoff already fired; announceSiteReady is one-shot.
      announceSiteReady();
    };

    /**
     * FLIP: measure where the nav wordmark sits, then transform the preloader
     * wordmark onto that rect. Animating a transform to a measured
     * destination keeps the move on the compositor; animating top/left/
     * font-size would relayout on every frame.
     */
    const flipToNav = () => {
      const target = document.querySelector<HTMLElement>('[data-nav-wordmark]');
      if (!target) return { x: 0, y: -20, scale: 0.6 };
      const from = word.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const scale = to.width / from.width;
      return {
        x: to.left - from.left - (from.width * (1 - scale)) / 2,
        y: to.top - from.top - (from.height * (1 - scale)) / 2,
        scale,
      };
    };

    /**
     * Budget, and why each number is what it is. The whole sequence must land
     * inside HARD_CAP_MS, and the FLIP must FINISH before the curtain starts
     * moving: the wordmark is a child of the curtain, so a FLIP still running
     * when the curtain lifts would fly the wordmark up off screen instead of
     * landing it in the navbar.
     *
     *   0.00  glyphs rise, 0.4s each, 0.03s apart  -> 0.67
     *   0.10  counter and bar run to 100           -> 0.65
     *   0.65  bar flashes full                     -> 0.75
     *   0.70  status line fades                    -> 0.85
     *   0.80  FLIP wordmark into the navbar        -> 1.15
     *   1.15  handoff: nav wordmark takes over
     *   1.15  curtain wipes up                     -> 1.55
     */
    let flip: { x: number; y: number; scale: number } | null = null;
    const measureFlip = () => (flip ??= flipToNav());

    const tl = gsap.timeline({
      onComplete: () => {
        finished = true;
        finish();
      },
    });

    tl.to(letters, {
      yPercent: 0,
      duration: 0.4,
      ease: 'expo.out',
      stagger: 0.03,
    })
      .to(
        progress,
        {
          value: 100,
          duration: 0.55,
          ease: 'power2.inOut',
          onUpdate: () => {
            count.textContent = String(Math.round(progress.value)).padStart(2, '0');
          },
        },
        0.1
      )
      .to(bar, { scaleX: 1, duration: 0.55, ease: 'power2.inOut' }, 0.1)
      .to(bar, { opacity: 1, duration: 0.1 }, 0.65)
      .to(count.parentElement, { opacity: 0, duration: 0.15 }, 0.7)
      .to(
        word,
        {
          /**
           * Function-based values, not literals. GSAP resolves these when the
           * tween STARTS (0.8s in), not when the timeline is built. That
           * matters because a web font landing between build and start would
           * change the wordmark's width and send the FLIP to a stale rect.
           * Memoised so all three resolve against one measurement.
           */
          x: () => measureFlip().x,
          y: () => measureFlip().y,
          scale: () => measureFlip().scale,
          duration: 0.35,
          ease: 'expo.inOut',
          onComplete: () => {
            /* Hand off at the instant the two wordmarks are coincident: hide
               ours, and let the nav and the hero know they can take over. */
            gsap.set(word, { opacity: 0 });
            announceSiteReady();
          },
        },
        0.8
      )
      .to(root, { yPercent: -100, duration: 0.4, ease: 'expo.inOut' }, 1.15);

    /**
     * The failsafe. Independent of the timeline so a stalled tween, a
     * throttled background tab or a thrown error inside an onUpdate cannot
     * leave the curtain down.
     */
    const failsafe = window.setTimeout(() => {
      if (finished) return;
      tl.kill();
      finish();
    }, HARD_CAP_MS);

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
      document.documentElement.style.overflow = '';
    };
  }, [reduced]);

  if (gone || reduced) return null;

  return (
    <div ref={rootRef} className="preloader" role="status" aria-live="polite">
      <span className="sr-only">Loading BigBuilder</span>
      <div className="preloader__inner" aria-hidden="true">
        <div ref={wordRef} className="preloader__wordmark">
          {WORDMARK.split('').map((ch, i) => (
            <span key={i} className="preloader__glyph">
              <i>{ch}</i>
            </span>
          ))}
        </div>
        <p className="preloader__status mono">
          Loading system &middot; <span ref={countRef}>00</span>
        </p>
      </div>
      <div className="preloader__track" aria-hidden="true">
        <span ref={barRef} className="preloader__bar" />
      </div>
    </div>
  );
}
