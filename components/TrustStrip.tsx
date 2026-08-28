/**
 * Infinite logo marquee.
 *
 * Rendered as mono wordmarks rather than logo files, for the same reason as
 * the integration grid: real client marks need permission, and a missing SVG
 * would leave a hole in a band that is meant to read as continuous.
 *
 * The loop works by rendering the list TWICE and translating the track by
 * exactly -50%. At that point the second copy sits precisely where the first
 * started, so the reset is invisible. The duplicate is aria-hidden so a screen
 * reader hears the names once.
 *
 * Pure CSS animation, no JS: there is nothing here to synchronise with scroll,
 * and a compositor-only transform costs nothing on the main thread.
 */
const LOGOS = [
  'Northwind Retail',
  'Ashcroft Labs',
  'Meridian Foods',
  'Bluewater Logistics',
  'Kestrel Health',
  'Tandem Finance',
  'Orchard & Co',
  'Vertex Mobility',
];

export default function TrustStrip() {
  return (
    <section className="trust" aria-label="Clients">
      <p className="mono trust__label">Trusted by teams shipping fast</p>

      <div className="trust__viewport">
        <div className="trust__track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="trust__list" aria-hidden={copy === 1 || undefined}>
              {LOGOS.map((name) => (
                <li key={name} className="trust__item">
                  {name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
