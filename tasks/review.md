# Rebuild Review

## Objective
Recreate the recorded reference website style from scratch with same copy hierarchy, section order, and animation feel. (Original reference was "OrbAI"; product is now branded as kAyphI.)

## Delivered
- Next.js App Router site with a single `/` route.
- Typed content model (`LandingPageContent`) for auditable copy parity.
- Centralized motion presets in `src/lib/motion.ts`.
- Reusable UI primitives and section components for:
  - Hero
  - Benefits
  - Features
  - Services
  - Process
  - Projects (tabbed case studies)
  - Customers
  - Pricing (monthly/yearly toggle)
  - Contact
  - FAQ (accordion with accessibility state)
  - Footer
- Sticky top nav and floating bottom-right action dock.
- Reference artifacts:
  - `reference/source.mov`
  - `reference/frames/*`
  - `reference/spec.md`
  - `reference/ocr_dump.md`

## Parity Checklist
- [x] Section order matches recording narrative flow.
- [x] Core headings and CTA copy replicated from reference transcript.
- [x] High-key monochrome visual style with glass cards/shadows.
- [x] Scroll reveal and staggered animation patterns applied.
- [x] Pricing toggle and FAQ interaction behavior implemented.
- [x] Desktop + mobile layouts implemented and e2e validated.

## Verification Run
- `npm run lint`: pass
- `npm run test`: pass
- `npm run build`: pass
- `npm run test:e2e`: pass (desktop + mobile)

## Remaining Deltas
- Exact source media assets are replaced with stylistic placeholders.
- Some micro-motion timing values are tuned by approximation rather than frame-perfect extraction.

## 2026-02-16 Hero Video Update
- Added production hero media assets in `public/videos/hero/`:
  - `hero-poster.webp` (fast first paint poster)
  - `hero.webm` (primary modern codec source)
  - `hero.mp4` (fallback source)
- Implemented poster-first + lazy-start + crossfade behavior:
  - Initial render is poster-only.
  - Video loading starts after any gate: hydration interactive state, idle timeout, or in-view observer.
  - Poster fades to video after `loadeddata` / `canplay`.
- Accessibility behavior:
  - `prefers-reduced-motion: reduce` forces poster-only and disables autoplay/lazy video source attachment.
- UX/CWV guardrails:
  - Hero container now has fixed aspect ratio to prevent layout shifts.
  - Added stable media overlay to preserve text/CTA contrast.
- Verification:
  - `npm run lint`: pass
  - `npm run test`: pass
  - `npm run typecheck`: pass
  - `npm run build`: pass
  - `npm run test:e2e`: pass
