# BigBuilder

Single-page, scroll-animated capability site for **BigBuilder**, an AI-native
build studio.

> We don't sell tools. We build the machine your business runs on.

## Stack

- **Next.js 16** (App Router) + TypeScript, statically prerendered
- **GSAP 3 + ScrollTrigger** for pinning, scrubbing and reveals
- **Lenis** smooth scroll, driven from the GSAP ticker so both share one clock
- **Tailwind** for layout only; every colour lives in `styles/tokens.css`

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3210.

| Script | Does |
|---|---|
| `npm run dev` | Dev server on port 3210 (regenerates the asset manifest first) |
| `npm run build` | Production build (regenerates the asset manifest first) |
| `npm run assets` | Rescan `public/assets` and rewrite `lib/asset-manifest.json` |
| `npm run lint` | ESLint 9 flat config |
| `npm run typecheck` | `tsc --noEmit` |

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Deployed origin. Drives `metadataBase`, Open Graph, JSON-LD, `robots.txt` and `sitemap.xml`. Absolute URLs are wrong until this is set. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Where the contact form POSTs. Unset, the form acknowledges and logs the payload rather than failing silently. |

Copy `.env.example` to `.env.local` to set them.

## Assets

Drop media into `public/assets/video/` and `public/assets/images/`, then:

```bash
npm run assets
```

That rewrites `lib/asset-manifest.json`, which `MediaFrame` consults **before
rendering anything**. A file the manifest does not list is never requested, so
a missing asset yields a labelled placeholder and **zero console errors**
rather than a red 404. The manifest regenerates automatically on `predev` and
`prebuild`; run it by hand only when adding files while the dev server is up.

Expected filenames are in the brief. The site is fully laid out without any of
them.

## Conventions

- **`styles/tokens.css` is the only file with literal colour values.** Two
  documented exceptions, both outside CSS: the `themeColor` meta tag in
  `app/layout.tsx` (a meta tag cannot read a custom property) and
  `app/icon.svg` (a standalone asset). Keep both in sync with `--ink-900`
  and `--brand`.
- **Import `gsap` / `ScrollTrigger` from `lib/gsap.ts`**, never the package
  directly. Registering a plugin twice creates two instances that do not share
  a scroller proxy, and pinning silently stops tracking Lenis.
- **Never hand-write vendor prefixes.** Next 16 compiles CSS with Lightning
  CSS, which prefixes automatically; an author-written prefixed declaration
  placed after the standard one causes only the prefixed form to be emitted.
- **Never mix a CSS percentage transform with GSAP's `xPercent`/`yPercent`**
  on the same element. GSAP reads the computed matrix, which cannot record that
  a translation came from a percentage, so it parses it as pixels and your
  tween leaves the offset in place.
- **A second ScrollTrigger cannot measure an element that another trigger
  pins.** Once pinned it is `position: fixed` and its rect stops tracking
  scroll. Put the extra behaviour on the pin trigger's own callbacks.
- **Per-frame callbacks must not call `setState`.** Scroll handlers mutate refs
  and class names directly; re-rendering pinned sections at 60fps flattens the
  frame budget.
- **Grid and flex children that must shrink need `min-width: 0`.** The default
  `auto` refuses to go below content min-content width and inflates the column.

## Structure

```
app/         layout, page, icon.svg, robots.ts, sitemap.ts
components/  one file per section, plus MediaFrame / ScrubVideo / Counter /
             MagneticButton / SplitHeading / HorizontalTrack primitives
lib/         gsap, scroll, lenis, split, signals, services, site, assets
styles/      tokens.css (all colour), globals.css
scripts/     generate-asset-manifest.mjs
```

`lib/services.ts` is the single source of truth for all 12 modules and 4
pillars. The rack, the footer link column, the contact form's service chips and
the JSON-LD all map over it, so renaming a service is exactly one edit.

## Verified

| Criterion | Result |
|---|---|
| Preloader under 1.6s | Timeline lands at 1.55s, with an independent 1600ms failsafe |
| 12 services in the rack, keyboard reachable | Tab reaches each card and scrolls it to its centred offset with the pin intact |
| Delete `/assets`: laid out, labelled, zero console errors | 12 placeholders, 12 warnings, one consolidated report, 0 errors |
| 60fps during pinned scroll | 60.0fps / 0 long frames (rack), 59.9fps / 1 in 300 (beats), measured in dev |
| `prefers-reduced-motion` | Static, complete, readable: no pin, no preloader, rack becomes a grid, transcript renders as prose |
| No horizontal overflow | Clean at 375, 768, 1280, 1440, 1920 |
| Contact form | Per-field validation, focus moves to first error, success and error states |
| No hex outside `tokens.css` | Two documented non-CSS exceptions |
| Accessibility | One `h1`, no heading-level jumps, landmarks present, skip link, all images have alt, all videos `aria-hidden`, no unlabelled controls |

## Not yet verifiable

The four scrub beats are structurally complete and guarded (`canplaythrough`
gate, finite-duration check, one seek per rAF, skip while `video.seeking`), but
with `public/assets` empty every `ScrubVideo` renders its placeholder, so the
seek path has never run against real footage. Add the MP4s, run `npm run
assets`, and re-check that first. `SCRUB_STALL_MS` in `components/MediaFrame.tsx`
is the knob if a slow connection shows false placeholders.

Numbers in Proof, the CRM stat row and Pricing are placeholders, marked
`TODO: real figures` in the source.

## Build order

1. [x] Scaffold, tokens, fonts, grain, Lenis/GSAP wiring
2. [x] `lib/services.ts` data model + `MediaFrame` fallback
3. [x] Nav, preloader, hero
4. [x] Pinned service rack
5. [x] Four scrub deep-dives
6. [x] Analytics gallery, process, proof, stack, pricing
7. [x] CTA, form, footer
8. [x] Reduced-motion, responsive, performance, SEO passes
