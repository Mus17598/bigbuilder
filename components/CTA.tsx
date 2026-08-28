'use client';

import MediaFrame from './MediaFrame';
import SplitHeading from './SplitHeading';
import ContactForm from './ContactForm';

export default function CTA() {
  return (
    <section id="contact" className="cta">
      <div className="cta__media" aria-hidden="true">
        <MediaFrame
          kind="video"
          src="/assets/video/finale-system-live.mp4"
          poster="/assets/images/img-og-poster.jpg"
          aspect="auto"
          className="media-frame--fill"
        />
      </div>
      {/* Heavy violet-tinted scrim: nothing legible sits over bare video. */}
      <div className="cta__scrim" aria-hidden="true" />

      <div className="shell cta__inner">
        <div className="cta__text">
          <p className="eyebrow">Start here</p>
          <SplitHeading as="h2" className="cta__heading">
            Let&rsquo;s build <span className="accent-word">your machine.</span>
          </SplitHeading>
          <p className="cta__body">
            Tell us what is slow, manual or leaking. We will come back with what
            we would build first, what it costs, and how long it takes.
          </p>
          <dl className="cta__facts">
            <div>
              <dt className="mono">Reply time</dt>
              <dd>One working day</dd>
            </div>
            <div>
              <dt className="mono">First call</dt>
              <dd>45 minutes, no deck</dd>
            </div>
            <div>
              <dt className="mono">Based in</dt>
              <dd>Bengaluru, working worldwide</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
