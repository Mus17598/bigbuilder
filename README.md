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

Drop media into `public/assets/video/` and `public/assets/images/`, then run:

```bash
npm run assets
```

That regenerates `lib/asset-manifest.json`, which `MediaFrame` consults before
rendering anything. A file the manifest does not list is never requested, so a
missing asset produces a labelled placeholder and **zero console errors**
rather than a red 404. The manifest is regenerated automatically on `predev`
and `prebuild`; re-run it by hand only if you add files while the dev server
is already running.

## Build order

1. [x] Scaffold, tokens, fonts, grain, Lenis/GSAP wiring
2. [x] `lib/services.ts` data model + `MediaFrame` fallback
3. [x] Nav, preloader, hero
4. [x] Pinned service rack
5. [x] Four scrub deep-dives
6. [x] Analytics gallery, process, proof, stack, pricing
7. [x] CTA, form, footer
8. [ ] Reduced-motion, responsive, performance, SEO passes
