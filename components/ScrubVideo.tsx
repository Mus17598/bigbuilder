'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import MediaFrame from './MediaFrame';

export interface ScrubVideoHandle {
  /** Seek to a normalised 0..1 position. Safe to call every scroll frame. */
  seek: (progress: number) => void;
  /** True once the element can actually be scrubbed. */
  isReady: () => boolean;
}

/**
 * A video whose playhead is driven by scroll rather than by time.
 *
 * Three guards, each for a failure the naive version hits:
 *
 *  1. READINESS. duration is NaN until metadata arrives, so progress *
 *     duration is NaN and the assignment is either thrown away or throws.
 *     Seeks are ignored until canplaythrough has fired and duration is a
 *     finite positive number.
 *  2. FRAME COALESCING. Scroll can fire many times per frame. Each assignment
 *     to currentTime queues a decoder seek, and queuing them faster than they
 *     complete is what produces the stutter people blame on "heavy video".
 *     The target is stored and flushed once per rAF.
 *  3. IN-FLIGHT SEEKS. Assigning while video.seeking is true stacks another
 *     request on a decoder that is already busy. Those frames are dropped;
 *     the next rAF picks up the latest target anyway, so nothing is lost.
 */
const ScrubVideo = forwardRef<
  ScrubVideoHandle,
  { src: string; poster?: string; aspect?: string; className?: string }
>(function ScrubVideo({ src, poster, aspect = '16 / 9', className }, ref) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readyRef = useRef(false);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const flush = useCallback(() => {
    rafRef.current = null;
    const video = videoRef.current;
    if (!video || !readyRef.current) return;
    if (video.seeking) return; // decoder busy; the next frame will catch up

    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;

    const time = targetRef.current * duration;
    if (!Number.isFinite(time)) return;
    // Never seek exactly to duration: some decoders fire `ended` and reset.
    video.currentTime = Math.min(Math.max(time, 0), duration - 0.01);
  }, []);

  const seek = useCallback(
    (progress: number) => {
      targetRef.current = Math.min(Math.max(progress, 0), 1);
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(flush);
    },
    [flush]
  );

  useImperativeHandle(ref, () => ({ seek, isReady: () => readyRef.current }), [seek]);

  const handleReady = useCallback((el: HTMLVideoElement | HTMLImageElement) => {
    if (!(el instanceof HTMLVideoElement)) return;
    videoRef.current = el;
    // MediaFrame fires this on canplaythrough, so readyState is already >= 3.
    readyRef.current = Number.isFinite(el.duration) && el.duration > 0;
  }, []);

  return (
    <MediaFrame
      kind="video"
      src={src}
      poster={poster}
      aspect={aspect}
      className={className}
      scrub
      onReady={handleReady}
    />
  );
});

export default ScrubVideo;
