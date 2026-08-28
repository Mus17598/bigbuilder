'use client';

import { forwardRef } from 'react';
import type { Service } from '@/lib/services';
import ServiceIcon from './ServiceIcon';

/**
 * One module in the rack.
 *
 * Rendered as a <button> rather than a <div> with a click handler so it is
 * focusable, activates on Enter and Space, and announces itself as actionable.
 * The rack intercepts focus to keep the pin intact when a card is tabbed to
 * while off screen.
 */
const ServiceCard = forwardRef<HTMLButtonElement, {
  service: Service;
  active: boolean;
  onOpen: (service: Service) => void;
  /** Lets the rack rescue the pin when an off-screen card is tabbed to. */
  onFocus?: () => void;
}>(function ServiceCard({ service, active, onOpen, onFocus }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={`svc-card${active ? ' is-active' : ''}`}
      data-svc-card
      // Scoped accent: hover glow, number and rule all read this one value,
      // so the card carries its colour without any of them naming a service.
      style={{ '--card-accent': `var(${service.accent})` } as React.CSSProperties}
      onClick={() => onOpen(service)}
      onFocus={onFocus}
      aria-label={`${service.name}. ${service.promise} View details.`}
    >
      <span className="svc-card__head">
        <span className="svc-card__num mono">{service.num}</span>
        <ServiceIcon paths={service.icon} accent={service.accent} draw={active} size={28} />
      </span>

      <span className="svc-card__rule" aria-hidden="true" />

      <h3 className="svc-card__name">{service.name}</h3>
      <p className="svc-card__promise">{service.promise}</p>

      <ul className="svc-card__list">
        {service.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <span className="svc-card__cta mono" aria-hidden="true">
        View detail
      </span>
    </button>
  );
});

export default ServiceCard;
