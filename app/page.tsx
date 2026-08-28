/**
 * STEP 1 SCAFFOLD — system check page.
 *
 * This is a temporary harness that proves the token layer, type scale,
 * texture layers and Lenis/GSAP wiring are live. It gets replaced section by
 * section as the real site is built (Nav + Preloader + Hero next).
 */

const SURFACES = [
  ['--ink-900', 'page canvas'],
  ['--ink-800', 'alternate section'],
  ['--surface-1', 'cards'],
  ['--surface-2', 'raised / placeholders'],
  ['--line', 'hairlines'],
] as const;

const ACCENTS = [
  ['--brand', 'Electric Violet', 'Hero / brand'],
  ['--acc-automation', 'Cyan Pulse', 'AI Automation'],
  ['--acc-infra', 'Violet Core', 'AI Provider & Infra'],
  ['--acc-chatbot', 'Aqua Signal', 'Chatbots & Voice'],
  ['--acc-crm', 'Amber Circuit', 'CRM Tools'],
  ['--acc-email', 'Coral Send', 'Email Marketing'],
  ['--acc-web', 'Lime Build', 'Website Building'],
  ['--acc-cx', 'Sky Glass', 'Customer Experience App'],
  ['--acc-growth', 'Magenta Reach', 'Marketing & Growth'],
  ['--acc-analytics', 'Mint Data', 'Analytics & BI'],
  ['--acc-consultancy', 'Sand Advisory', 'Consultancy'],
  ['--acc-omnichannel', 'Green Channel', 'WhatsApp Commerce'],
  ['--acc-devops', 'Steel Blue', 'Cloud & DevOps'],
] as const;

export default function Page() {
  return (
    <main id="main">
      <section
        style={{ position: 'relative', padding: 'var(--space-3xl) 0' }}
      >
        <div className="grid-lines" aria-hidden="true" />
        <div className="shell" style={{ position: 'relative' }}>
          <p className="eyebrow">AI AUTOMATION · CRM · WEB · APPS · GROWTH SYSTEMS</p>
          <h1
            style={{
              fontSize: 'var(--fs-hero)',
              marginTop: 'var(--space-md)',
              maxWidth: '14ch',
            }}
          >
            WE BUILD THE MACHINE YOUR BUSINESS <span className="accent-word">RUNS ON.</span>
          </h1>
          <p style={{ marginTop: 'var(--space-lg)', fontSize: 'var(--fs-lede)' }}>
            BigBuilder designs, builds and runs the systems behind growing
            businesses, from the first automation to the whole stack.
          </p>
          <p className="mono" style={{ marginTop: 'var(--space-2xl)' }}>
            Step 1 system check · scroll to verify Lenis
          </p>
        </div>
      </section>

      <section
        style={{
          background: 'var(--ink-800)',
          padding: 'var(--space-3xl) 0',
          borderBlock: 'var(--card-border)',
        }}
      >
        <div className="shell">
          <p className="mono">01 — SURFACES</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'var(--space-md)',
              marginTop: 'var(--space-lg)',
            }}
          >
            {SURFACES.map(([token, use]) => (
              <div key={token} className="card" style={{ padding: 'var(--space-md)' }}>
                <div
                  style={{
                    height: 64,
                    background: `var(${token})`,
                    border: 'var(--card-border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
                <p className="mono" style={{ marginTop: 'var(--space-sm)' }}>
                  {token}
                </p>
                <p style={{ fontSize: '0.9rem' }}>{use}</p>
              </div>
            ))}
          </div>

          <p className="mono" style={{ marginTop: 'var(--space-2xl)' }}>
            02 — MODULE ACCENTS
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-md)',
              marginTop: 'var(--space-lg)',
            }}
          >
            {ACCENTS.map(([token, name, module]) => (
              <div key={token} className="card" style={{ padding: 'var(--space-md)' }}>
                <div
                  style={{
                    height: 3,
                    background: `var(${token})`,
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
                <p
                  className="mono"
                  style={{ color: `var(${token})`, marginTop: 'var(--space-sm)' }}
                >
                  {name}
                </p>
                <p style={{ fontSize: '0.9rem' }}>{module}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-3xl) 0', minHeight: '100vh' }}>
        <div className="shell">
          <p className="mono">03 — TYPE SCALE</p>
          <h2 style={{ fontSize: 'var(--fs-section)', marginTop: 'var(--space-lg)' }}>
            WHAT WE BUILD
          </h2>
          <h3 style={{ fontSize: 'var(--fs-module)', marginTop: 'var(--space-lg)' }}>
            AI Automation
          </h3>
          <p style={{ marginTop: 'var(--space-md)' }}>
            Kill the work nobody should be doing. Workflow agents, document
            processing and internal copilots, wired into the tools your team
            already opens every morning.
          </p>
          <p className="mono" style={{ marginTop: 'var(--space-2xl)' }}>
            END OF STEP 1 SCAFFOLD
          </p>
        </div>
      </section>
    </main>
  );
}
