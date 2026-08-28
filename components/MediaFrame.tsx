'use client';

import { useEffect, useRef, useState } from 'react';
import { assetExists, registerMissingAsset } from '@/lib/assets';

export type MediaKind = 'video' | 'image';

/**
 * Everything the fallback policy is allowed to look at.
 * Kept as a plain value object so the policy below stays pure and testable.
 */
export interface MediaProbe {
  /** The element fired an `error` event, or a <source> 404'd. */
  errored: boolean;
  /** Milliseconds since the element was mounted. */
  msElapsed: number;
  /** Video HTMLMediaElement.readyState (0-4). Images report 0 or 4. */
  readyState: number;
  /** True for scroll-scrubbed video, which must be able to seek. */
  isScrub: boolean;
}

/** How long a scrub video may sit un-seekable before we call it missing. */
export const SCRUB_STALL_MS = 6000;

/**
 * ── DECISION POINT ────────────────────────────────────────────────────────
 * When does a SLOW asset count as a MISSING one?
 *
 * A 404 is unambiguous. The hard case is an asset that resolves but never
 * becomes usable: a scrub-linked video stuck below readyState 2 renders a
 * frozen first frame that looks correct on camera and is actually dead,
 * because `video.currentTime = progress * duration` silently no-ops.
 *
 * The trade-off:
 *   - Aggressive (short timeout): a bad-wifi demo degrades to an honest
 *     labelled placeholder instead of a scroll beat that appears broken.
 *     Cost is a false positive on a slow connection that would have
 *     recovered a second later.
 *   - Patient (error-only): never lies about a file being absent, but a
 *     stalled hero scrub reads as "this site is broken" to the viewer.
 *
 * Current policy, tuned for the screen-recording use case:
 *   errored                       -> placeholder, always
 *   scrub video, readyState < 2   -> placeholder after SCRUB_STALL_MS
 *   autoplay video / image        -> placeholder only on a real error,
 *                                    since the poster already covers the gap
 *
 * TODO(muskan): tune SCRUB_STALL_MS, or switch the scrub branch to
 * error-only, if you would rather never show a false placeholder.
 * ──────────────────────────────────────────────────────────────────────────
 */
export function shouldShowPlaceholder(probe: MediaProbe): boolean {
  if (probe.errored) return true;
  if (probe.isScrub && probe.readyState < 2 && probe.msElapsed > SCRUB_STALL_MS) {
    return true;
  }
  return false;
}

export interface MediaFrameProps {
  kind: MediaKind;
  /** Path under /public. The placeholder caption prints this verbatim. */
  src: string;
  poster?: string;
  /** Required for images that carry meaning. Videos are decorative. */
  alt?: string;
  /** CSS aspect-ratio string. Reserves the box so nothing ever reflows. */
  aspect?: string;
  /** Scroll-scrubbed video: preloads fully, never autoplays. */
  scrub?: boolean;
  className?: string;
  /** Fires once the element is genuinely playable. Gate ScrollTriggers on it. */
  onReady?: (el: HTMLVideoElement | HTMLImageElement) => void;
}

/**
 * Renders a video or image inside a fixed-ratio box that degrades to a
 * labelled placeholder when the asset is absent or unusable.
 *
 * The wrapper owns `aspect-ratio` rather than the media element, so the
 * placeholder and the real asset occupy identical space. That is what stops
 * a missing file from shifting layout, and what keeps CLS at zero.
 */
export default function MediaFrame({
  kind,
  src,
  poster,
  alt,
  aspect = '16 / 9',
  scrub = false,
  className,
  onReady,
}: MediaFrameProps) {
  /**
   * Two distinct failure modes, handled by two distinct mechanisms:
   *
   *  1. KNOWN ABSENT  - the build-time manifest says the file is not there.
   *     Start in the failed state so no element is ever rendered and no
   *     request is ever made. This is what yields zero console errors.
   *  2. PRESENT BUT UNUSABLE - the file exists yet 404s at runtime or stalls
   *     below a seekable readyState. That is what shouldShowPlaceholder
   *     governs, below.
   */
  const known = assetExists(src);
  const [failed, setFailed] = useState(!known);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const mountedAt = useRef<number>(0);

  useEffect(() => {
    if (!assetExists(src)) {
      registerMissingAsset(src);
      return;
    }
    mountedAt.current = performance.now();
    const el = mediaRef.current;
    if (!el) return;

    const fail = () => {
      setFailed(true);
      registerMissingAsset(src);
    };

    const probe = (errored: boolean): MediaProbe => ({
      errored,
      msElapsed: performance.now() - mountedAt.current,
      readyState: el instanceof HTMLVideoElement ? el.readyState : el.complete ? 4 : 0,
      isScrub: scrub,
    });

    const onError = () => {
      if (shouldShowPlaceholder(probe(true))) fail();
    };

    const onLoaded = () => onReady?.(el);

    el.addEventListener('error', onError);
    if (el instanceof HTMLVideoElement) {
      el.addEventListener('canplaythrough', onLoaded);
      // A <source> child 404s on the SOURCE element, not the video element.
      el.querySelectorAll('source').forEach((s) => s.addEventListener('error', onError));

      /**
       * Critical: the browser starts fetching the source during SSR hydration,
       * so a 404 can resolve BEFORE this effect ever runs and the error event
       * is missed entirely. networkState is the durable record of that —
       * NETWORK_NO_SOURCE (3) means "tried every source, none usable".
       * Without this check a missing video renders as a silent empty box.
       */
      if (el.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) fail();
    } else {
      el.addEventListener('load', onLoaded);
      // Same race for images: one already resolved as broken never re-fires.
      if (el.complete && el.naturalWidth === 0) fail();
    }

    // Poll only while a scrub video is still un-seekable. Stops on success.
    let timer: ReturnType<typeof setInterval> | undefined;
    if (scrub) {
      timer = setInterval(() => {
        const p = probe(false);
        if (p.readyState >= 2) {
          clearInterval(timer);
          return;
        }
        if (shouldShowPlaceholder(p)) {
          clearInterval(timer);
          fail();
        }
      }, 500);
    }

    return () => {
      el.removeEventListener('error', onError);
      el.removeEventListener('canplaythrough', onLoaded);
      el.removeEventListener('load', onLoaded);
      if (timer) clearInterval(timer);
    };
  }, [src, scrub, onReady]);

  /**
   * Autoplay videos are paused while offscreen. Decoding video the visitor
   * cannot see is the single biggest scroll-performance leak on a site like
   * this one.
   */
  useEffect(() => {
    const el = mediaRef.current;
    if (failed || scrub || !(el instanceof HTMLVideoElement)) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [failed, scrub]);

  return (
    <div className={`media-frame ${className ?? ''}`} style={{ aspectRatio: aspect }}>
      {failed ? (
        <div className="media-frame__fallback" role="img" aria-label={alt ?? `Missing asset ${src}`}>
          <span className="media-frame__caption mono">&#8961; {src}</span>
        </div>
      ) : kind === 'video' ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          className="media-frame__media"
          poster={poster && assetExists(poster) ? poster : undefined}
          muted
          loop
          playsInline
          aria-hidden="true"
          autoPlay={!scrub}
          preload={scrub ? 'auto' : 'metadata'}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={mediaRef as React.RefObject<HTMLImageElement>}
          className="media-frame__media"
          src={src}
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
