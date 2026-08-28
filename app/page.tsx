/**
 * STEP 2 SCAFFOLD — data model + missing-asset contract, proven live.
 *
 * Everything below maps over lib/services.ts. /public/assets is empty on
 * purpose, so every MediaFrame here renders its labelled placeholder. That is
 * the acceptance criterion made visible rather than asserted.
 *
 * Replaced section by section from step 3 onward.
 */
import { PILLARS, servicesByPillar } from '@/lib/services';
import MediaFrame from '@/components/MediaFrame';
import ServiceIcon from '@/components/ServiceIcon';

export default function Page() {
  return (
    <main id="main">
      <section style={{ position: 'relative', padding: 'var(--space-3xl) 0' }}>
        <div className="grid-lines" aria-hidden="true" />
        <div className="shell" style={{ position: 'relative' }}>
          <p className="eyebrow">AI AUTOMATION · CRM · WEB · APPS · GROWTH SYSTEMS</p>
          <h1 style={{ fontSize: 'var(--fs-hero)', marginTop: 'var(--space-md)', maxWidth: '14ch' }}>
            WE BUILD THE MACHINE YOUR BUSINESS{' '}
            <span className="accent-word">RUNS ON.</span>
          </h1>
          <p style={{ marginTop: 'var(--space-lg)', fontSize: 'var(--fs-lede)' }}>
            BigBuilder designs, builds and runs the systems behind growing
            businesses, from the first automation to the whole stack.
          </p>
        </div>
      </section>

      {/* ---- Missing-asset contract, demonstrated ---- */}
      <section
        style={{
          background: 'var(--ink-800)',
          padding: 'var(--space-3xl) 0',
          borderBlock: 'var(--card-border)',
        }}
      >
        <div className="shell">
          <p className="mono">MEDIAFRAME · /assets IS EMPTY, NOTHING REFLOWS</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-md)',
              marginTop: 'var(--space-lg)',
            }}
          >
            <MediaFrame
              kind="video"
              src="/assets/video/exploded-stack.mp4"
              poster="/assets/images/img-hero-poster.jpg"
              aspect="16 / 9"
              scrub
            />
            <MediaFrame kind="video" src="/assets/video/crm-pipeline.mp4" aspect="16 / 9" />
            <MediaFrame
              kind="image"
              src="/assets/images/img-analytics.jpg"
              alt="Analytics dashboard"
              aspect="16 / 9"
            />
          </div>
        </div>
      </section>

      {/* ---- The 12 modules, mapped from one typed array ---- */}
      <section style={{ padding: 'var(--space-3xl) 0' }}>
        <div className="shell">
          <h2 style={{ fontSize: 'var(--fs-section)' }}>WHAT WE BUILD</h2>

          {PILLARS.map((pillar) => (
            <div key={pillar.id} style={{ marginTop: 'var(--space-2xl)' }}>
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-md)',
                  alignItems: 'baseline',
                  borderTop: 'var(--card-border)',
                  paddingTop: 'var(--space-md)',
                }}
              >
                <span className="mono">{pillar.num}</span>
                <h3 style={{ fontSize: '1.5rem', letterSpacing: 'var(--tracking-mono)' }}>
                  {pillar.name.toUpperCase()}
                </h3>
                <span className="mono">{pillar.premise}</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 'var(--space-md)',
                  marginTop: 'var(--space-lg)',
                }}
              >
                {servicesByPillar(pillar.id).map((s) => (
                  <article
                    key={s.id}
                    id={s.id}
                    className="card"
                    style={{ padding: 'var(--space-lg)' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span className="mono" style={{ color: `var(${s.accent})` }}>
                        {s.num}
                      </span>
                      <ServiceIcon paths={s.icon} accent={s.accent} draw />
                    </div>
                    <h4
                      style={{
                        fontSize: '1.6rem',
                        marginTop: 'var(--space-md)',
                        letterSpacing: 'var(--tracking-display)',
                      }}
                    >
                      {s.name}
                    </h4>
                    <p style={{ marginTop: 'var(--space-xs)', color: 'var(--text-hi)' }}>
                      {s.promise}
                    </p>
                    <ul
                      style={{
                        listStyle: 'none',
                        marginTop: 'var(--space-md)',
                        display: 'grid',
                        gap: 'var(--space-xs)',
                      }}
                    >
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          style={{
                            fontSize: '0.95rem',
                            paddingLeft: 'var(--space-md)',
                            position: 'relative',
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: '0.65em',
                              width: 6,
                              height: 1,
                              background: `var(${s.accent})`,
                            }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          ))}

          <p className="mono" style={{ marginTop: 'var(--space-2xl)' }}>
            END OF STEP 2 SCAFFOLD
          </p>
        </div>
      </section>
    </main>
  );
}
