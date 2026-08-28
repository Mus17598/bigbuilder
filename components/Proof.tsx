'use client';

import Counter from './Counter';
import SplitHeading from './SplitHeading';

/* TODO: real figures. Placeholders until the numbers are confirmed. */
const METRICS = [
  { value: 140, suffix: '+', label: 'Systems shipped' },
  { value: 26000, suffix: 'h', label: 'Hours automated / month' },
  { value: 6.5, decimals: 1, suffix: ' wks', label: 'Average time to launch' },
];

/* TODO: real figures. Placeholder case studies. */
const CASES = [
  {
    client: 'D2C retail, 40 stores',
    work: 'CRM rebuild plus WhatsApp ordering',
    before: '9 days to first contact',
    after: '11 minutes to first contact',
  },
  {
    client: 'B2B services, 120 staff',
    work: 'Document processing and internal copilot',
    before: '3 FTE on manual entry',
    after: '0.2 FTE, spent on exceptions',
  },
  {
    client: 'Marketplace, 2M users',
    work: 'Voice agent and CX app',
    before: '42% tickets answered same day',
    after: '96% tickets answered same day',
  },
];

export default function Proof() {
  return (
    <section id="proof" className="proof">
      <div className="grid-lines" aria-hidden="true" />

      <div className="shell">
        <p className="eyebrow">Proof</p>
        <SplitHeading as="h2" className="proof__heading">
          What it adds up to
        </SplitHeading>

        <div className="proof__metrics">
          {METRICS.map((m) => (
            <div key={m.label} className="proof__metric">
              <Counter
                className="proof__num"
                value={m.value}
                decimals={m.decimals ?? 0}
                suffix={m.suffix}
              />
              <p className="mono">{m.label}</p>
            </div>
          ))}
        </div>

        <ul className="cases">
          {CASES.map((c) => (
            <li key={c.client} className="cases__item">
              <p className="mono cases__client">{c.client}</p>
              <h3 className="cases__work">{c.work}</h3>

              {/*
                Before and after are stacked in one clipped window; hover slides
                the pair up by exactly one row. Both strings stay in the DOM, so
                the swap is readable to assistive tech and needs no JS.
              */}
              <div className="swap">
                <span className="swap__row swap__row--before">{c.before}</span>
                <span className="swap__row swap__row--after">{c.after}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
