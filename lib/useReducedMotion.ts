'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * The server cannot know the visitor's motion preference, so it always renders
 * the motion-enabled markup and the client corrects on hydration. Returning
 * false here rather than throwing is what keeps SSR and the first client
 * render in agreement.
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Reads prefers-reduced-motion as reactive state.
 *
 * useSyncExternalStore rather than useEffect + useState: a media query is an
 * external store, and reading it through this hook avoids the cascading
 * re-render that setting state inside an effect would cause. It also picks up
 * a mid-session change to the OS setting.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
