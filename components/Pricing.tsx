'use client';

import MagneticButton from './MagneticButton';
import SplitHeading from './SplitHeading';
import { scrollToSection } from '@/lib/lenis';

/* TODO: real figures. Prices are placeholders until commercials are set. */
const PLANS = [
  {
    id: 'sprint',
    name: 'Sprint',
    price: 'From ₹—',
    unit: 'fixed scope',
    line: 'One system, defined up front, shipped and handed over.',
    points: [
      'Single service from the rack',
      'Fixed scope and fixed price',
      'Two weeks of aftercare',
    ],
    featured: false,
  },
  {
    id: 'build-partner',
    name: 'Build partner',
    price: 'From ₹—',
    unit: 'per month',
    line: 'A standing team that keeps shipping against a roadmap you own.',
    points: [
      'Rolling roadmap, monthly review',
      'Multiple systems in parallel',
      'Monitoring and SLAs included',
    ],
    featured: true,
  },
  {
    id: 'embedded-team',
    name: 'Embedded team',
    price: 'From ₹—',
    unit: 'per month',
    line: 'A dedicated pod inside your business, working to your priorities.',
    points: [
      'Named engineers and a lead',
      'Your tools, your standups',
      'Fractional CTO cover available',
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="engagement" className="pricing">
      <div className="grid-lines" aria-hidden="true" />
      <div className="shell">
        <p className="eyebrow">Engagement</p>
        <SplitHeading as="h2" className="pricing__heading">
          Three ways to work with us
        </SplitHeading>

        <ul className="pricing__grid">
          {PLANS.map((plan) => (
            <li
              key={plan.id}
              className={`plan${plan.featured ? ' plan--featured' : ''}`}
            >
              {plan.featured && <span className="plan__badge mono">Most chosen</span>}
              <h3 className="plan__name">{plan.name}</h3>
              <p className="plan__price">
                {plan.price} <span className="mono plan__unit">{plan.unit}</span>
              </p>
              <p className="plan__line">{plan.line}</p>
              <ul className="plan__points">
                {plan.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <MagneticButton
                className={`btn ${plan.featured ? 'btn--primary' : 'btn--ghost'} plan__cta`}
                onClick={() => scrollToSection('#contact')}
                ariaLabel={`Talk to us about ${plan.name}`}
              >
                Talk to us
              </MagneticButton>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
