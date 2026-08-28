'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { motionEnabled } from '@/lib/scroll';
import { scrollToSection } from '@/lib/lenis';
import { onSiteReady } from '@/lib/signals';
import MagneticButton from './MagneticButton';

const LINKS = [
  { label: 'What we build', href: '#what-we-build' },
  { label: 'How we build', href: '#how-we-build' },
  { label: 'Proof', href: '#proof' },
  { label: 'Engagement', href: '#engagement' },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const word = wordRef.current;
    if (!nav || !word) return;

    // The wordmark starts invisible: the preloader's FLIP animation flies its
    // own copy into this exact position, and this one takes over on arrival.
    if (!motionEnabled()) {
      gsap.set(word, { opacity: 1 });
      nav.classList.add('is-solid');
      return;
    }

    gsap.set(word, { opacity: 0 });
    const off = onSiteReady(() => {
      gsap.to(word, { opacity: 1, duration: 0.3, delay: 0.1 });
    });

    // Transparent over the hero, blur-backed past it.
    const st = ScrollTrigger.create({
      start: 'top -100vh',
      end: 'max',
      onToggle: (self) => nav.classList.toggle('is-solid', self.isActive),
    });

    return () => {
      off();
      st.kill();
    };
  }, []);

  const jump = (href: string) => () => scrollToSection(href, -80);

  return (
    <header ref={navRef} className="nav">
      <div className="nav__inner">
        <a
          ref={wordRef}
          href="#main"
          className="nav__wordmark"
          data-nav-wordmark
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('#main');
          }}
        >
          BIGBUILDER
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav__link"
              onClick={(e) => {
                e.preventDefault();
                jump(l.href)();
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <MagneticButton className="btn btn--sm" onClick={() => scrollToSection('#contact')}>
          Book a call
        </MagneticButton>
      </div>
    </header>
  );
}
