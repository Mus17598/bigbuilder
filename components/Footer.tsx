'use client';

import { SERVICES } from '@/lib/services';
import { scrollToSection } from '@/lib/lenis';

const SECTIONS = [
  { label: 'What we build', href: '#what-we-build' },
  { label: 'How we build', href: '#how-we-build' },
  { label: 'Proof', href: '#proof' },
  { label: 'Integrations', href: '#stack' },
  { label: 'Engagement', href: '#engagement' },
];

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'X', href: 'https://x.com/' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <p className="footer__wordmark">BIGBUILDER</p>
          <p className="footer__line">
            We don&rsquo;t sell tools. We build the machine your business runs on.
          </p>
        </div>

        <nav className="footer__col" aria-label="Services">
          <h2 className="mono footer__title">Services</h2>
          <ul>
            {SERVICES.map((service) => (
              <li key={service.id}>
                <a
                  href="#what-we-build"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('#what-we-build', -80);
                  }}
                >
                  {service.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Sections">
          <h2 className="mono footer__title">Sections</h2>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(s.href, -80);
                  }}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="mono footer__title">Contact</h2>
          <ul>
            <li>
              <a href="mailto:hello@bigbuilder.example">hello@bigbuilder.example</a>
            </li>
            <li>
              <a href="tel:+910000000000">+91 00000 00000</a>
            </li>
            <li>Bengaluru, India</li>
          </ul>

          <h2 className="mono footer__title footer__title--gap">Social</h2>
          <ul>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell footer__base">
        <p className="mono">&copy; 2026 BigBuilder</p>
        <p className="mono">Built to run, not to demo</p>
      </div>
    </footer>
  );
}
