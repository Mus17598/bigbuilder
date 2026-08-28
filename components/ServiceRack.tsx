'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { setAccent } from '@/lib/scroll';
import { PILLARS, SERVICES, type Service } from '@/lib/services';
import SplitHeading from './SplitHeading';
import ServiceCard from './ServiceCard';
import ServiceDetail from './ServiceDetail';

export default function ServiceRack() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /** Scroll offset at which each card sits centred. Filled in on build. */
  const cardScrollPos = useRef<number[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  /** True only while the rack is the section on screen. */
  const [rackActive, setRackActive] = useState(false);
  /** Mirrors activeIndex so onToggle can read it without re-subscribing. */
  const activeIndexRef = useRef(0);
  const [openService, setOpenService] = useState<Service | null>(null);

  const activePillar = SERVICES[activeIndex]?.pillar ?? PILLARS[0].id;

  const closeDetail = useCallback(() => setOpenService(null), []);

  // Writing a ref during render is not allowed; mirror it in an effect.
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const mm = gsap.matchMedia();

    /* ---------------------------------------------------------------
       DESKTOP: pinned, horizontal.
       --------------------------------------------------------------- */
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      /**
       * Scroll distance is derived from the track rather than hardcoded to
       * the spec's "+=500%". Deriving it keeps the pixels-scrolled to
       * pixels-travelled ratio at 1:1 whatever the viewport, so the rack
       * moves at the same apparent speed on a laptop and on a 1920 display.
       * At desktop sizes this lands within a few percent of 500% anyway.
       */
      const distance = () => track.scrollWidth - viewport.clientWidth;

      const horizontal = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          /**
           * Accent ownership rides on the pin trigger rather than a separate
           * one aimed at this section. A second trigger cannot measure a
           * pinned element (it becomes position:fixed, so its rect stops
           * tracking scroll), and its stale deactivation fired AFTER the next
           * beat had already claimed the accent, stealing the colour back.
           */
      onToggle: (self) => {
            setRackActive(self.isActive);
            // Synchronous, so ScrollTrigger's start-position ordering decides who
            // wins the handover rather than React's commit schedule.
            const service = SERVICES[activeIndexRef.current];
            setAccent(self.isActive && service ? `var(${service.accent})` : 'var(--brand)');
          },
        },
      });

      const st = horizontal.scrollTrigger;
      const cards = cardRefs.current.filter(Boolean) as HTMLButtonElement[];

      /**
       * With containerAnimation, ScrollTrigger resolves positions like
       * "left right" or "right center" against the SCROLLER viewport, not
       * against the container element. The rack column occupies only the
       * right 65% of the page, so those keywords aimed at the window centre
       * and put the highlighted card almost a full card left of where it
       * looks centred, partly clipped by the column's own overflow.
       *
       * Resolving to pixel positions taken from the column's own rect puts
       * the peak, the active index and the keyboard-focus target on one
       * shared reference. Functions, not literals, so a resize recomputes.
       */
      const colRect = () => viewport.getBoundingClientRect();
      const colMid = () => {
        const r = colRect();
        return r.left + r.width / 2;
      };

      /**
       * Where the page must be scrolled for card i to sit centred in the
       * viewport. Used to rescue keyboard focus, see the focus handler below.
       *
       * This has to come from real layout offsets, not from i / (n - 1).
       * That even spacing looks right but is wrong: the track only travels
       * `distance` px, so the FIRST card is already centred-ish at progress 0
       * and the LAST at progress 1, and every card in between lands at a
       * progress set by its own offset, not by its index. The linear version
       * drifted by a full card near the end of the rack.
       */
      const recalcPositions = () => {
        if (!st || !cards.length) return;
        const span = st.end - st.start;
        const travel = distance();
        const origin = cards[0].offsetLeft;
        cardScrollPos.current = cards.map((card) => {
          const left = card.offsetLeft - origin;
          const centred = left + card.offsetWidth / 2 - viewport.clientWidth / 2;
          const progress = travel > 0 ? gsap.utils.clamp(0, 1, centred / travel) : 0;
          return st.start + span * progress;
        });
      };
      recalcPositions();
      ScrollTrigger.addEventListener('refresh', recalcPositions);

      cards.forEach((card, i) => {
        /**
         * containerAnimation is what makes this work. These cards never move
         * in the scroller; they are translated by the tween above. Passing
         * the tween tells ScrollTrigger to measure the card against tween
         * progress instead of against scroll position.
         *
         * ONE timeline, not two. An earlier version used a separate enter
         * tween and exit tween, both scrubbed and both writing opacity and
         * scale on the same element. They overwrote each other on every tick
         * and the visual peak drifted a whole card away from the centre.
         *
         * The range runs from "card's left edge at the container's right
         * edge" to "card's right edge at the container's left edge", so the
         * timeline's midpoint is exactly the moment the card is centred, and
         * that is where the peak lands.
         */
        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontal,
              start: () => `left ${colRect().right}px`,
              end: () => `right ${colRect().left}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            card,
            { scale: 0.92, opacity: 0.4 },
            { scale: 1, opacity: 1, ease: 'none', duration: 1 }
          )
          .to(card, { scale: 0.92, opacity: 0.4, ease: 'none', duration: 1 });

        /**
         * Which card owns the accent right now: the one under the viewport's
         * centre line. A wider window (left 60% / right 40%) let two adjacent
         * cards satisfy it at once, and whichever toggled last won, so the
         * accent could belong to the card beside the centred one.
         */
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: horizontal,
          start: () => `left ${colMid()}px`,
          end: () => `right ${colMid()}px`,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(i);
          },
        });
      });

      return () => {
        ScrollTrigger.removeEventListener('refresh', recalcPositions);
      };
    });

    /* ---------------------------------------------------------------
       MOBILE / REDUCED MOTION: no pin, no horizontal travel.
       Cards stack and fade up; the pillar headings become sticky dividers
       via CSS. Everything stays reachable with nothing to unpin.

       A third case, DESKTOP + reduced motion, deliberately matches neither
       branch: it gets no JS at all and is laid out as a static grid purely in
       CSS. Without that the track would keep its max-content width and all
       but the first two cards would sit clipped outside the column.
       --------------------------------------------------------------- */
    /* Nothing is pinned in these modes, so a plain trigger measures fine. */
    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      const owner = ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        end: 'bottom 35%',
      onToggle: (self) => {
        setRackActive(self.isActive);
        // Synchronous, so ScrollTrigger's start-position ordering decides who
        // wins the handover rather than React's commit schedule.
        const service = SERVICES[activeIndexRef.current];
        setAccent(self.isActive && service ? `var(${service.accent})` : 'var(--brand)');
      },
      });
      return () => owner.kill();
    });

    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLButtonElement[];
      gsap.set(cards, { clearProps: 'all' });
      cards.forEach((card) => {
        gsap.from(card, {
          y: 32,
          opacity: 0,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        });
      });
    });

    return () => mm.revert();
  }, []);

  /**
   * Accent handover: one write to :root recolours the progress bar, the
   * pillar indicator and the background bleed together.
   *
   * Only ever writes while the rack is on screen. Handing OFF the accent is
   * done synchronously in onToggle instead, because an effect runs after the
   * render commit: the deferred reset was landing after the next beat had
   * already claimed the slot and stole its colour back. Two systems writing
   * one shared variable have to write on the same schedule.
   */
  useEffect(() => {
    if (!rackActive) return;
    const service = SERVICES[activeIndex];
    if (service) setAccent(`var(${service.accent})`);
  }, [activeIndex, rackActive]);

  /**
   * Keyboard rescue. Tabbing to a card that is translated off screen makes the
   * browser scroll an ancestor to reveal it, which fights the pin and tears
   * the layout. Driving the page to the offset where that card is centred
   * gets the same result while the pin stays intact.
   */
  const handleCardFocus = (i: number) => () => {
    const pos = cardScrollPos.current[i];
    if (pos == null) return;
    if (Math.abs(window.scrollY - pos) < 40) return;
    window.scrollTo({ top: pos, behavior: 'auto' });
  };

  return (
    <section ref={sectionRef} id="what-we-build" className="rack">
      <div className="rack__bleed" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />

      <div className="rack__inner shell">
        <div className="rack__aside">
          <p className="eyebrow">The offering</p>
          <SplitHeading as="h2" className="rack__title">
            What we build
          </SplitHeading>

          <ol className="pillars" aria-label="Service pillars">
            {PILLARS.map((p) => (
              <li
                key={p.id}
                className={`pillars__item${p.id === activePillar ? ' is-active' : ''}`}
              >
                <span className="pillars__num mono">{p.num}</span>
                <span className="pillars__name">{p.name}</span>
                <span className="pillars__premise">{p.premise}</span>
              </li>
            ))}
          </ol>

          <p className="rack__hint mono" aria-hidden="true">
            Scroll &middot; {String(activeIndex + 1).padStart(2, '0')} / 12
          </p>
        </div>

        <div ref={viewportRef} className="rack__viewport">
          <div ref={trackRef} className="rack__track">
            {SERVICES.map((service, i) => (
              <ServiceCard
                key={service.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                service={service}
                active={i === activeIndex}
                onOpen={setOpenService}
                onFocus={handleCardFocus(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <ServiceDetail service={openService} onClose={closeDetail} />
    </section>
  );
}
