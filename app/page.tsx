/**
 * STEP 3 — real hero. The service rack below is still the step-2 scaffold and
 * gets replaced by the pinned horizontal beat in step 4.
 */
import { PILLARS, servicesByPillar } from '@/lib/services';
import ServiceIcon from '@/components/ServiceIcon';
import Hero from '@/components/Hero';

export default function Page() {
  return (
    <main id="main">
      <Hero />

      {/* ---- The 12 modules, mapped from one typed array ---- */}
      <section id="what-we-build" style={{ padding: 'var(--space-3xl) 0' }}>
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
            END OF STEP 3 SCAFFOLD
          </p>
        </div>
      </section>
    </main>
  );
}
