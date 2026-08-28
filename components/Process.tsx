'use client';

import { useCallback, useRef } from 'react';
import SplitHeading from './SplitHeading';
import HorizontalTrack from './HorizontalTrack';

const STEPS = [
  {
    num: '01',
    title: 'Diagnose',
    line: 'We sit with the people doing the work and find where the time actually goes.',
    deliverable: 'Systems audit and a costed shortlist',
    duration: '1–2 weeks',
  },
  {
    num: '02',
    title: 'Architect',
    line: 'We design the system end to end before anyone writes code, including what we deliberately leave out.',
    deliverable: 'Architecture, roadmap, build plan',
    duration: '2–3 weeks',
  },
  {
    num: '03',
    title: 'Build',
    line: 'We ship in working increments you can use, not a demo you wait months to see.',
    deliverable: 'Working system, in production',
    duration: '4–8 weeks',
  },
  {
    num: '04',
    title: 'Run & improve',
    line: 'We keep it up, watch what it does in the real world, and keep tightening it.',
    deliverable: 'Monitoring, SLAs, monthly review',
    duration: 'Ongoing',
  },
];

export default function Process() {
  const fillRef = useRef<HTMLSpanElement>(null);

  /* Direct style write, not state: this runs every scroll frame. */
  const onProgress = useCallback((progress: number) => {
    const el = fillRef.current;
    if (el) el.style.transform = `scaleX(${progress})`;
  }, []);

  return (
    <section id="how-we-build" className="process">
      <div className="grid-lines" aria-hidden="true" />

      <div className="shell process__head">
        <p className="eyebrow">The method</p>
        <SplitHeading as="h2" className="process__heading">
          How we build
        </SplitHeading>
        <p className="beat__body">
          Four stages, in order. No stage starts before the one before it has
          produced something you can read.
        </p>
      </div>

      <HorizontalTrack
        className="process__stage"
        trackClassName="process__track"
        onProgress={onProgress}
        ariaLabel="How we build, four stages"
      >
        {/* The connector sits inside the track so it travels with the steps.
            Its fill is scaled from 0 to 1 across the whole beat. */}
        <div className="process__rail" aria-hidden="true">
          <span ref={fillRef} className="process__rail-fill" />
        </div>

        <ol className="process__list">
          {STEPS.map((step) => (
            <li key={step.num} className="process__step">
              <span className="process__dot" aria-hidden="true" />
              <span className="mono process__num">{step.num}</span>
              <h3 className="process__title">{step.title}</h3>
              <p className="process__line">{step.line}</p>
              <p className="process__deliverable">{step.deliverable}</p>
              <span className="process__chip mono">{step.duration}</span>
            </li>
          ))}
        </ol>
      </HorizontalTrack>
    </section>
  );
}
