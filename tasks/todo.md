# TODO

## 2026-02-16 Hero Video Integration (Complete)
- [x] Generate hero media assets in `public/videos/hero` (`hero.mp4`, `hero.webm`, `hero-poster.webp`)
- [x] Add typed hero media config to `src/content/landing.ts`
- [x] Implement `HeroMedia` with poster-first paint + lazy start gates (interactive/idle/in-view)
- [x] Add crossfade from poster to video on first playable frame
- [x] Respect reduced motion (`poster-only`, no autoplay/lazy load)
- [x] Lock hero layout with fixed aspect ratio and contrast overlay for text readability
- [x] Add unit tests for hero media behavior and e2e assertions for reduced-motion/video state
- [x] Verify with `npm run lint`, `npm run test`, `npm run typecheck`, `npm run build`, `npm run test:e2e`

## Phase 0: Audit & Documentation (Complete)
- [x] Audit Codex build against reference frames
- [x] Write visual audit report (`docs/plans/2026-02-14-visual-audit.md`)
- [x] Create DESIGN.md (current-state + target-state visual system)
- [x] Create ARCHITECTURE.md (actual project structure + planned extensions)
- [x] Write full product extension plan (`docs/plans/2026-02-14-full-product-plan.md`)
- [x] Update tasks/todo.md with phased plan

## Phase A: Fix Visual Gaps
- [ ] **P0** Add Comparison section ("Precision vs Basic" — ref frames 0055–0056)
- [ ] **P0** Add Team section ("Team Behind Success" — ref frames 0056–0058)
- [ ] **P0** Replace gradient placeholders with substitute images (Unsplash/AI-generated)
- [ ] **P1** FAQ accordion animation (AnimatePresence + auto-height measurement)
- [ ] **P1** Scroll-based nav hide/show (useScroll + useMotionValueEvent)
- [ ] **P1** CTA arrow icons, section badge icons, FAQ chevrons (Lucide React)
- [ ] **P1** Customer star ratings, avatars, footer social icons + copyright
- [ ] **P2** Pricing toggle slide animation
- [ ] **P2** Services interactive mockup illustrations (CSS/SVG approximations)
- [ ] **P2** 3D orb enhancement (CSS/canvas improvement over current rings)

## Phase B: Infrastructure Setup
- [ ] Upgrade Next.js 14 → 15 (per approved design doc)
- [ ] Install pre-approved dependencies (Supabase, shadcn/ui, RHF, Zod, Lucide)
- [ ] Initialize shadcn/ui (`npx shadcn-ui init`)
- [ ] Create `.env.example` with all placeholder keys
- [ ] Add `Dockerfile` and `docker-compose.yml` for local dev
- [ ] Set up Supabase clients (`src/lib/supabase/client.ts`, `server.ts`)
- [ ] Database migrations (profiles, conversations, messages, workflows, workflow_runs, analytics_events)
- [ ] RLS policies (users can only CRUD their own rows)

## Phase C: Auth System
- [ ] Supabase Auth integration (email/password + Google OAuth)
- [ ] Auth pages (`src/app/(auth)/login/page.tsx`, `signup/page.tsx`, `callback/route.ts`)
- [ ] Profile auto-creation trigger (Supabase DB trigger on auth.users insert)
- [ ] Auth middleware (`src/middleware.ts`) — validate session, redirect, refresh tokens
- [ ] Per-route auth verification (each API route independently verifies via `getUser()`)

## Phase D: Dashboard Shell
- [ ] Dashboard layout (`src/app/(dashboard)/layout.tsx` with sidebar nav)
- [ ] Route group `(dashboard)` with shared layout
- [ ] Dashboard overview page (stats summary cards)
- [ ] Settings page (profile update form with RHF + Zod validation)
- [ ] Responsive sidebar (collapsible on mobile)

## Phase E: AI Chatbot
- [ ] OpenAI client (`src/lib/openai/client.ts`)
- [ ] Vercel AI SDK integration for streaming
- [ ] `/api/chat/route.ts` — auth, Zod validation, rate limiting, input sanitization
- [ ] Chat UI — conversation list sidebar, message thread, streaming input
- [ ] Conversation CRUD with Supabase
- [ ] Message persistence (role, content, tokens_used)

## Phase F: Workflow Automation
- [ ] Workflow builder UI (form-based with RHF + Zod validation)
- [ ] `/api/workflows/route.ts` — CRUD with auth + Zod validation
- [ ] `/api/workflows/run/route.ts` — execution with idempotency, timeouts, error handling
- [ ] Step types: ai_summarize, extract_data, content_generation, email_draft
- [ ] Run history with status tracking (pending → running → success/failed)

## Phase G: Analytics Dashboard
- [ ] Event logging utility (`src/lib/analytics/track.ts`)
- [ ] Auto-track: chat messages sent, workflows run, workflow success/failure
- [ ] `/api/analytics/route.ts` — auth, Zod validation, date range + event type filters
- [ ] Dashboard page with Recharts: messages over time, workflow stats, usage trends
- [ ] Stat cards: total chats, total workflows, success rate

---

## Dependency Approval Status
Pre-approved (2026-02-14 brainstorming session):
`@supabase/supabase-js`, `@supabase/ssr`, `ai` (Vercel AI SDK), `openai`, `recharts`,
`react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`
shadcn/ui components are copied into the project (not a dependency).

Any additional dependencies require explicit user approval per SECURITY.md.

## Assumptions
- Rebuild target started as single-page landing site on `/`.
- Full product extends to multi-page SaaS with auth, chatbot, workflows, analytics.
- Substitute assets are acceptable where exact originals are unavailable.
- Docker-first development for all phases.

## Previous Review (Phase 0 / Codex Build)
- Result: completed from-scratch single-page rebuild with matching section order, copy structure, pricing toggle behavior, FAQ accordion behavior, sticky nav, and floating dock actions.
- Verification:
  - `npm run lint` passed
  - `npm run test` passed (Vitest)
  - `npm run build` passed (Next.js static generation)
  - `npm run test:e2e` passed (Playwright desktop + mobile profile)
- Risks:
  - Media and iconography are close-match substitutes, not exact original files.
  - Motion tuning is faithful but not pixel-perfect to every frame interval.
  - Two entire sections missing (Comparison, Team).
  - All image areas use gradient placeholders.
  - Several icon/styling gaps documented in visual audit.

## Phase 0 Review
- All 5 documents written, committed, PR #1 merged to main.
- Next session: begin Phase A (Fix Visual Gaps).
