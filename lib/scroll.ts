'use client';

import { ScrollTrigger } from './gsap';

/** True when the visitor has asked the OS for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True on viewports where we unpin everything and stack sections instead. */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 1023px)').matches;
}

/** Motion is only allowed when the user wants it AND we have a pointer clock. */
export function motionEnabled(): boolean {
  return typeof window !== 'undefined' && !prefersReducedMotion();
}

/**
 * Wrap every animation entry point in this. Under reduced motion the callback
 * never runs and `fallback` puts the section into its final, readable state.
 * That is what makes the reduced-motion pass a guarantee rather than a hope.
 */
export function withMotion(build: () => void, fallback?: () => void): void {
  if (!motionEnabled()) {
    fallback?.();
    return;
  }
  build();
}

/**
 * Writes a section's accent into the :root runtime slot. The scroll-progress
 * bar, pillar indicator and cursor light all read var(--accent), so one call
 * recolours the whole shell.
 *
 * Note: a custom property holding a var() reference cannot be tweened
 * numerically. We swap the value instantly and let the *consuming* properties
 * (background-color, border-color) carry their own CSS transition, which is
 * what makes the recolour read as continuous.
 */
export function setAccent(accent: string, glow?: string): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-glow', glow ?? accent);
}

/**
 * ScrollTrigger caches every start/end pixel position on creation. Web fonts
 * loading late, images decoding, or a resize all invalidate that cache and
 * pins begin firing at the wrong scroll offset. Refresh on: fonts ready,
 * window load, and debounced resize.
 */
export function wireScrollRefresh(): () => void {
  if (typeof window === 'undefined') return () => {};

  let resizeTimer: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
  };

  const onLoad = () => ScrollTrigger.refresh();

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', onLoad);
  window.addEventListener('resize', onResize);

  return () => {
    clearTimeout(resizeTimer);
    window.removeEventListener('load', onLoad);
    window.removeEventListener('resize', onResize);
  };
}

/** Tears down every trigger this page created. Call on unmount. */
export function killAllTriggers(): void {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
