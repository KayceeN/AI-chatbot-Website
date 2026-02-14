# TODO

- [x] Confirm constraints from `SECURITY.md`, `CLAUDE.md`, `AGENTS.md`
- [x] Normalize recording location to `reference/source.mov`
- [x] Extract visual reference frames + OCR and write `reference/spec.md`
- [x] Bootstrap Next.js + TypeScript + Tailwind + Framer Motion
- [x] Build reusable typed content + motion architecture
- [x] Implement sections, styling system, and high-fidelity animations
- [x] Add tests (`test`, `test:e2e`) and verification scaffolding
- [x] Run lint, tests, and build
- [x] Write `tasks/review.md` with parity checklist and gaps

## Assumptions
- Rebuild target is a single-page landing site on `/`.
- Exact copy/style comes from the provided recording.
- Substitute assets are acceptable where exact originals are unavailable.

## Review
- Result: completed from-scratch single-page rebuild with matching section order, copy structure, pricing toggle behavior, FAQ accordion behavior, sticky nav, and floating dock actions.
- Verification:
  - `npm run lint` passed
  - `npm run test` passed (Vitest)
  - `npm run build` passed (Next.js static generation)
  - `npm run test:e2e` passed (Playwright desktop + mobile profile)
- Risks:
  - Media and iconography are close-match substitutes, not exact original files.
  - Motion tuning is faithful but not pixel-perfect to every frame interval.
- Follow-up:
  - Replace placeholder visuals with your final licensed assets.
  - Add visual-diff snapshots against selected keyframes if strict parity is required.
