# TODO

## Phase 1: Codex First Pass (Codex-owned)
- [x] Confirm constraints from `SECURITY.md`, `CLAUDE.md`, `AGENTS.md`
- [x] Normalize recording location to `reference/source.mov`
- [ ] Extract visual reference frames + OCR and write `reference/spec.md`
- [ ] Bootstrap Next.js + TypeScript + Tailwind + Framer Motion
- [ ] Build reusable typed content + motion architecture
- [ ] Implement sections, styling system, and high-fidelity animations
- [ ] Add tests (`test`, `test:e2e`) and verification scaffolding
- [ ] Run lint, tests, and build
- [ ] Write `tasks/review.md` with parity checklist and gaps

## Phase 2: Post-Codex Reconciliation (Claude Code-owned)
After Codex completes the first pass, Claude Code will:

### Audit & Inventory
- [ ] Review all files Codex created — inventory components, pages, styles, config
- [ ] Compare Codex output against the approved design doc (`docs/plans/2026-02-14-ai-chatbot-website-design.md`)
- [ ] Identify gaps between Codex's marketing-only build and the full product architecture
- [ ] Check for deviations from the reference video (compare against frames)

### Update Design Documents
- [ ] Create `DESIGN.md` — capture visual design system from Codex build (colors, typography, spacing, component patterns)
- [ ] Create `ARCHITECTURE.md` — document actual project structure, data flow, and component hierarchy from Codex build
- [ ] Update design doc to reflect any changes Codex made vs. the original plan
- [ ] Reconcile the reference site sections with our branding/content (replace "Orb AI" with actual brand)

### Extend to Full Product
- [ ] Plan integration of Supabase auth into existing Codex-built structure
- [ ] Plan dashboard route group `(dashboard)` alongside Codex's marketing pages
- [ ] Plan AI chatbot feature (OpenAI streaming via Vercel AI SDK)
- [ ] Plan workflow automation module
- [ ] Plan analytics dashboard with Recharts
- [ ] Plan database schema migrations (Supabase)
- [ ] Write implementation plan for full product extension (`docs/plans/YYYY-MM-DD-full-product-plan.md`)

### Infrastructure
- [ ] Add Docker + docker-compose for local dev
- [ ] Set up environment variable structure (.env.example)
- [ ] Verify Codex's build/test/lint scripts work in Docker

## Assumptions
- Codex builds the marketing/landing page as the first pass from the reference video
- Claude Code owns the full product architecture, design docs, and product extension
- Visual design system comes from Codex's implementation of the reference
- The site branding, content, and pricing will be customized from the Orb AI template
