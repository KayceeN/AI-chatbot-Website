# Rebuild Review

## Objective
Recreate the recorded OrbAI website style from scratch with same copy hierarchy, section order, and animation feel.

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
