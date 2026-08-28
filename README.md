# BigBuilder

Single-page, scroll-animated capability site for **BigBuilder** — an AI-native
build studio.

> We don't sell tools. We build the machine your business runs on.

## Stack

- Next.js 14 (App Router) + TypeScript
- GSAP 3 + ScrollTrigger
- Lenis smooth scroll, synced to the GSAP ticker
- Tailwind for layout; **all colour lives in `styles/tokens.css`**

## Run

```bash
npm install
npm run dev
```

## Conventions

- `styles/tokens.css` is the only file allowed to contain literal colour
  values. The single documented exception is the `themeColor` meta tag in
  `app/layout.tsx`, which cannot read a CSS variable.
- Import `gsap` / `ScrollTrigger` from `lib/gsap.ts`, never from the package
  directly — double registration breaks pinning.
- Wrap animation entry points in `withMotion()` from `lib/scroll.ts` so the
  reduced-motion fallback is structural, not optional.

## Assets

Drop media into `public/assets/video/` and `public/assets/images/`.
Missing files must never break layout — see the `MediaFrame` fallback (step 2).

## Build order

1. [x] Scaffold, tokens, fonts, grain, Lenis/GSAP wiring
2. [] `lib/services.ts` data model + `MediaFrame` fallback
3. [] Nav, preloader, hero
4. [ ] Pinned service rack
5. [ ] Four scrub deep-dives
6. [ ] Analytics gallery, process, proof, stack, pricing
7. [ ] CTA, form, footer
8. [ ] Reduced-motion, responsive, performance, SEO passes
