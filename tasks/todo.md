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

## Phase A: Fix Visual Gaps (Complete — PR #3)
- [x] **P0** Add Comparison section ("Precision vs Basic" — ref frames 0055–0056)
- [x] **P0** Add Team section ("Team Behind Success" — ref frames 0056–0058)
- [ ] **P0** Replace gradient placeholders with substitute images (Unsplash/AI-generated)
- [x] **P1** FAQ accordion animation (AnimatePresence + auto-height measurement)
- [x] **P1** Scroll-based nav hide/show (useScroll + useMotionValueEvent)
- [x] **P1** CTA arrow icons, section badge icons, FAQ chevrons (Lucide React)
- [x] **P1** Customer star ratings, avatars, footer social icons + copyright
- [x] **P2** Pricing toggle slide animation (layoutId sliding indicator)
- [ ] **P2** Services interactive mockup illustrations (CSS/SVG approximations)
- [ ] **P2** 3D orb enhancement (CSS/canvas improvement over current rings)
- [x] Benefits marquee ticker animation
- [x] Process section restructured with decorative step numbers
- [x] Project tab active state animation (layoutId indicator)

## Mobile Optimization (Complete — PR #5)
- [x] Remove gap between header and hero video on mobile and desktop
- [x] Make hero video span full screen width on all viewports
- [x] Hide kAyphI title on mobile (logo in nav is sufficient)
- [x] Move CTA button above Safari bottom toolbar using safe-area-inset
- [x] Remove heavy white overlay that washed out hero video on mobile
- [x] Add viewport-fit: cover for proper safe area inset support

---

## Website Quality Improvements (Research-Based — 2026-02-16)

Prioritized by recommended implementation order. Based on deep research of top AI automation/SaaS websites and industry best practices.

### Step 1: SEO Fundamentals
- [ ] Update page title to include keywords ("kAyphI — AI Automation for Businesses | Chatbots, Workflows & Analytics")
- [ ] Rewrite meta description (action-oriented, 150-160 chars with target keywords)
- [ ] Add Open Graph tags (og:title, og:description, og:image) for social sharing
- [ ] Add Twitter Card meta tags
- [ ] Add structured data (JSON-LD): Organization, FAQPage, Service schemas
- [ ] Generate `sitemap.xml` (use `next-sitemap` package)
- [ ] Add `robots.txt` (allow all, point to sitemap)
- [ ] Set canonical URLs in metadata

### Step 2: Contact Form Backend
- [ ] Create API route for form submission (`/api/contact/route.ts`)
- [ ] Wire contact form to API (send email notification + store lead in DB)
- [ ] Add form validation (Zod schema for name, email, subject, message)
- [ ] Add success/error feedback states to the form UI

### Step 3: Booking Integration
- [ ] Embed Calendly or Cal.com on demo/contact page
- [ ] Replace "Book a call" dead link with real booking widget
- [ ] Add "Book a Demo" as secondary CTA alongside "Get Started"

### Step 4: Replace Placeholder Images
- [ ] Benefits cards — real images (AI-generated or Unsplash)
- [ ] Features cards — product screenshots or capability illustrations
- [ ] Services cards — service-specific imagery
- [ ] Process cards — step-specific visuals
- [ ] Projects case study images — industry-specific imagery
- [ ] Customers feature quote image — client photo or brand visual
- [ ] Team member photos — real headshots or professional AI-generated portraits
- [ ] Use `next/image` for all images (automatic WebP, lazy loading, CLS prevention)

### Step 5: Hero Copy Specificity
- [ ] Replace vague subtitle ("Custom AI solutions, built for the innovators of tomorrow") with specific value proposition (e.g., "Automate 80% of Customer Conversations in Minutes")
- [ ] Update meta description to match new value proposition
- [ ] A/B test headline variants if testing infra is available

### Step 6: Logo Bar / Social Proof Above the Fold
- [ ] Add customer/partner logo bar (5-8 logos) immediately below hero section
- [ ] Move key stats (100+ Projects, 95% Satisfaction, 10+ Years) higher on page
- [ ] Add "Trusted by X+ companies" aggregate line

### Step 7: Fix Dead Links & Broken Elements
- [ ] Team member social icons — link to real profiles or remove `href="#"`
- [ ] Footer nav links — link to real pages or valid section anchors
- [ ] Footer "Privacy" link — create privacy policy page or link to valid target
- [ ] Update copyright from "Designed by FrameBase" to kAyphI branding
- [ ] Fix FAQ email fallback (`kayphi@support.com`) — verify or update

### Step 8: Live AI Chatbot Widget
- [ ] Deploy floating chatbot widget on homepage (depends on Phase E chatbot build)
- [ ] Chatbot answers FAQs, qualifies leads (BANT), and hands off to booking flow
- [ ] "See how this was built" CTA from chatbot to product tour

### Step 9: Blog Infrastructure
- [ ] Set up MDX-based blog in Next.js (`/blog` route)
- [ ] Create blog layout with sidebar (categories, recent posts, newsletter signup)
- [ ] Write initial content cluster: 5 posts around "AI automation for business"
- [ ] Target keywords: "AI chatbot for business," "workflow automation," "AI consulting services"
- [ ] Internal linking strategy between blog posts and service/use case pages

### Step 10: Use Case / Solutions Pages
- [ ] Create `/use-cases` route with index page
- [ ] Healthcare page (`/use-cases/healthcare`) — expand MedixCare case study
- [ ] E-commerce page (`/use-cases/ecommerce`) — expand NeoMart case study
- [ ] HR/Operations page (`/use-cases/hr`) — expand Workwise case study
- [ ] Each page: problem statement, solution, implementation details, quantified results

### Step 11: Integrations Page
- [ ] Create `/integrations` route
- [ ] Logo grid of supported platforms (Slack, Salesforce, HubSpot, Zapier, etc.)
- [ ] Individual integration sub-pages for programmatic SEO
- [ ] "Request an integration" CTA

### Step 12: Comparison Pages
- [ ] Create named competitor comparison pages (`/compare/vs-intercom`, `/compare/vs-zendesk`)
- [ ] Feature-by-feature comparison tables with quantified differences
- [ ] Target high-intent search keywords ("kAyphI vs [competitor]")

### Step 13: Full Case Study Pages
- [ ] Expand each Projects card into a dedicated page (`/case-studies/medixcare`, etc.)
- [ ] Structure: Problem → Solution → Implementation → Results → Client Quote
- [ ] Add video testimonials if available
- [ ] Link from homepage Projects section to full case study pages

### Step 14: Documentation Site
- [ ] Set up docs infrastructure (MDX or Mintlify/Docusaurus)
- [ ] API reference documentation
- [ ] Getting started guides
- [ ] Integration setup guides

### Step 15: Security / Trust Center Page
- [ ] Create `/security` or `/trust` page
- [ ] Document data handling practices, encryption, access controls
- [ ] List compliance certifications (SOC 2, GDPR, etc.)
- [ ] Place security badges near pricing CTAs on pricing section

### Step 16: Dark Mode
- [ ] Add dark mode color tokens to `tailwind.config.ts`
- [ ] Implement theme toggle (persist preference in localStorage)
- [ ] Update all components for dark mode compatibility
- [ ] Default to system preference with manual override

### Step 17: Cookie Consent Banner
- [ ] Add GDPR-compliant cookie consent banner
- [ ] Lightweight implementation (no heavy third-party library)
- [ ] Persist consent state, block analytics until accepted

### Step 18: Additional Enhancements (When Ready)
- [ ] ROI calculator — interactive tool ("How much could you save with AI automation?")
- [ ] Template/workflow library — pre-built chatbot templates users can browse
- [ ] Changelog page — signal active development and momentum
- [ ] Newsletter signup — footer email capture + gated content (whitepapers, guides)
- [ ] Community page — Discord/Slack invite with visible member count
- [ ] Video content library — product walkthroughs, customer stories, tutorials
- [ ] A/B testing infrastructure — Vercel Edge Config or PostHog feature flags
- [ ] AI search optimization — structured data for AI citation, topical authority content

---

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

## Phase A Review (PR #3)
- Result: 10 of 13 Phase A items implemented. Remaining 3 are asset-dependent (placeholder images, services mocks, 3D orb).
- Changes: installed lucide-react, replaced all emoji/text icons with SVGs (8 icon types), added 6 animations (FAQ accordion, nav scroll-hide, pricing layoutId toggle, marquee ticker, project tab indicator, team carousel), built 2 new sections (Comparison, Team), restructured Process section with decorative step numbers.
- Bug fixed: pricing toggle sliding indicator overlapped "Yearly" text — replaced absolute positioning with layoutId approach.
- Verification:
  - `npm run lint` passed
  - `npm run typecheck` passed
  - `npm run build` passed
  - `npm run test` passed (6/6 tests)
- Risks:
  - All image areas still use gradient placeholders (requires design assets).
  - Services interactive mockup illustrations not yet built.
  - 3D orb remains CSS rings.
- Next: Phase B (Infrastructure Setup) or asset sourcing for remaining Phase A items.
