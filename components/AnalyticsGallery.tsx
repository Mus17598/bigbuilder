'use client';

import { useCallback, useRef } from 'react';
import MediaFrame from './MediaFrame';
import SplitHeading from './SplitHeading';
import HorizontalTrack from './HorizontalTrack';

const PANELS = [
  { src: '/assets/images/img-analytics.jpg', label: 'Revenue and margin, one view' },
  { src: '/assets/images/img-crm.jpg', label: 'Pipeline health by stage' },
  { src: '/assets/images/img-email.jpg', label: 'Lifecycle performance' },
  { src: '/assets/images/img-website.jpg', label: 'Site speed and conversion' },
  { src: '/assets/images/img-whatsapp-commerce.jpg', label: 'Channel mix and reply times' },
];

export default function AnalyticsGallery() {
  const readoutRef = useRef<HTMLSpanElement>(null);

  const onProgress = useCallback((progress: number) => {
    const el = readoutRef.current;
    if (!el) return;
    const index = Math.min(PANELS.length, Math.floor(progress * PANELS.length) + 1);
    const next = String(index).padStart(2, '0');
    if (el.textContent !== next) el.textContent = next;
  }, []);

  return (
    <section
      id="analytics"
      className="analytics"
      style={{ '--card-accent': 'var(--acc-analytics)' } as React.CSSProperties}
    >
      <div className="grid-lines" aria-hidden="true" />

      <div className="shell analytics__head">
        <p className="beat__eyebrow mono">05 &middot; Analytics &amp; BI</p>
        <SplitHeading as="h2" className="analytics__heading">
          One number <span className="accent-word">everyone agrees on.</span>
        </SplitHeading>
        <p className="beat__body">
          We reconcile the sources first, then build the dashboards. The floor
          gets the number it can act on this morning; the board gets the one it
          can plan against.
        </p>
      </div>

      <div className="shell">
        <MediaFrame
          kind="video"
          src="/assets/video/dashboard-assemble.mp4"
          poster="/assets/images/img-analytics.jpg"
          aspect="21 / 9"
          className="analytics__panel"
        />
      </div>

      <div className="shell analytics__meta">
        <p className="mono">
          <span ref={readoutRef}>01</span> / {String(PANELS.length).padStart(2, '0')}
        </p>
        <p className="mono">Scroll to move through the boards</p>
      </div>

      <HorizontalTrack
        className="gallery"
        trackClassName="gallery__track"
        onProgress={onProgress}
        ariaLabel="Dashboard examples"
      >
        {PANELS.map((panel, i) => (
          <figure key={panel.src} className="gallery__item">
            <MediaFrame kind="image" src={panel.src} alt={panel.label} aspect="4 / 3" />
            <figcaption className="gallery__caption">
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <span>{panel.label}</span>
            </figcaption>
          </figure>
        ))}
      </HorizontalTrack>
    </section>
  );
}
