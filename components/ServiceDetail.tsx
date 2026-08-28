'use client';

import { useEffect, useRef } from 'react';
import type { Service } from '@/lib/services';
import { PILLARS } from '@/lib/services';
import MediaFrame from './MediaFrame';
import ServiceIcon from './ServiceIcon';

/**
 * Detail panel for one service, opened from a rack card.
 *
 * Built on the native <dialog> element rather than a hand-rolled overlay. That
 * buys focus trapping, Escape to dismiss, inertness of the page behind it and
 * correct AT semantics from the platform, all of which are easy to get subtly
 * wrong by hand.
 */
export default function ServiceDetail({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (service && !dialog.open) dialog.showModal();
    if (!service && dialog.open) dialog.close();
  }, [service]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // Fires for Escape as well as dialog.close(), so one handler covers both.
    const handle = () => onClose();
    dialog.addEventListener('close', handle);
    return () => dialog.removeEventListener('close', handle);
  }, [onClose]);

  const pillar = service ? PILLARS.find((p) => p.id === service.pillar) : undefined;

  return (
    <dialog
      ref={ref}
      className="detail"
      aria-labelledby="detail-title"
      style={
        service ? ({ '--card-accent': `var(${service.accent})` } as React.CSSProperties) : undefined
      }
      // Clicking the backdrop closes. The dialog element itself is the click
      // target for backdrop clicks, so compare against currentTarget.
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {service && (
        <div className="detail__inner">
          <button
            type="button"
            className="detail__close mono"
            onClick={() => ref.current?.close()}
          >
            Close &times;
          </button>

          <div className="detail__body">
            <div className="detail__text">
              <p className="detail__eyebrow mono">
                {pillar ? `${pillar.num} ${pillar.name}` : ''} &middot; {service.num}
              </p>
              <h2 id="detail-title" className="detail__title">
                {service.name}
              </h2>
              <p className="detail__promise">{service.promise}</p>

              <ul className="detail__list">
                {service.bullets.map((b) => (
                  <li key={b}>
                    <ServiceIcon paths={service.icon} accent={service.accent} size={16} draw />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <MediaFrame
              kind="image"
              src={service.image}
              alt={`${service.name} work sample`}
              aspect="4 / 3"
              className="detail__media"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
