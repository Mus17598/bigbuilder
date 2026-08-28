'use client';

import type Lenis from 'lenis';

/**
 * Module-level handle on the single Lenis instance.
 *
 * Anchor links need to scroll through Lenis rather than around it: calling
 * element.scrollIntoView() while Lenis is running fights the smoothing and
 * lands at the wrong offset. Any component that needs to jump the page asks
 * for the instance here.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null): void {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Scrolls to a selector. Falls back to native behaviour when Lenis is absent,
 * which is exactly the reduced-motion case: no smoothing, just a jump.
 */
export function scrollToSection(selector: string, offset = 0): void {
  const target = document.querySelector(selector);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { offset, duration: 1.4 });
  } else {
    target.scrollIntoView({ block: 'start' });
  }
}
