/**
 * Fixed texture layers. Server component — pure CSS, no client JS needed.
 * Both are pointer-events:none and sit above all content.
 */
export default function GrainOverlay() {
  return (
    <>
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
