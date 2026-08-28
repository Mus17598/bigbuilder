'use client';

/**
 * Missing-asset bookkeeping.
 *
 * The spec's hard rule is that deleting /assets must leave the site fully
 * laid out with labelled placeholders and zero console ERRORS. Warnings are
 * still wanted, but one warning per frame per re-render would flood the
 * console during a scrub, so every path is warned about exactly once and the
 * full list is printed as a single consolidated group shortly after load.
 */

import manifest from './asset-manifest.json';

/**
 * Files that genuinely exist under public/assets, captured at build time by
 * scripts/generate-asset-manifest.mjs. Consulting this BEFORE rendering an
 * element is what keeps the console free of native 404 errors: a file we know
 * is absent is never requested at all.
 */
const PRESENT = new Set<string>(manifest.files);

export function assetExists(path: string): boolean {
  // `generated` proves the scan ran, so an empty file list means the assets
  // folder is genuinely empty rather than unscanned. Without that flag an
  // empty manifest is ambiguous and the wrong guess either floods the console
  // with 404s or blanks every real asset on the site.
  if (!manifest.generated) return true;
  return PRESENT.has(path);
}

const missing = new Set<string>();
let reportScheduled = false;

export function registerMissingAsset(path: string): void {
  if (missing.has(path)) return;
  missing.add(path);
  console.warn(`[BigBuilder] missing asset: ${path}`);
  scheduleReport();
}

function scheduleReport(): void {
  if (reportScheduled || typeof window === 'undefined') return;
  reportScheduled = true;

  // Wait past the first paint so late-resolving 404s land in the same report.
  window.setTimeout(() => {
    reportScheduled = false;
    if (missing.size === 0) return;
    console.groupCollapsed(
      `[BigBuilder] ${missing.size} missing asset${missing.size === 1 ? '' : 's'} — placeholders rendered`
    );
    [...missing].sort().forEach((p) => console.warn(p));
    console.groupEnd();
  }, 1200);
}

export function getMissingAssets(): string[] {
  return [...missing].sort();
}
