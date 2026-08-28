'use client';

/**
 * One-shot DOM events used to hand off between independently mounted
 * components.
 *
 * Why events rather than React state: the preloader must tell the hero the
 * exact moment its curtain clears. Lifting that into shared state would force
 * the whole page into a single client component and give up RSC for every
 * section below the fold. An event keeps the coupling at the two components
 * that actually care, and lets later sections subscribe without refactoring.
 */

export const SITE_READY = 'bb:site-ready';

let alreadyReady = false;

export function announceSiteReady(): void {
  if (alreadyReady) return;
  alreadyReady = true;
  window.dispatchEvent(new CustomEvent(SITE_READY));
}

/**
 * Subscribes to site-ready. Fires immediately if the signal already went out,
 * which matters because mount order between preloader and hero is not
 * guaranteed. Returns an unsubscribe function.
 */
export function onSiteReady(handler: () => void): () => void {
  if (alreadyReady) {
    handler();
    return () => {};
  }
  window.addEventListener(SITE_READY, handler, { once: true });
  return () => window.removeEventListener(SITE_READY, handler);
}
