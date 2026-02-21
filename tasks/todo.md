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

### Step 3: Native Booking System
- [ ] Create `/book` or `/demo` page with booking UI
- [ ] Build availability calendar component (date picker + time slot grid)
- [ ] Create booking API routes (`/api/bookings/route.ts` — CRUD for appointments)
- [ ] Store bookings in Supabase (bookings table: date, time, name, email, notes, status)
- [ ] Add booking confirmation flow (success page + email notification)
- [ ] Add timezone detection and display (Intl API)
- [ ] Admin view: manage availability windows, view/cancel bookings (dashboard)
- [ ] Replace "Book a call" dead link with link to `/book` page
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

### Step 8: Live AI Chatbot Widget (Depends on Phase E)
- [ ] Deploy floating `ChatWidget` on marketing site (public, no auth)
- [ ] Chatbot answers visitor questions from kAyphI knowledge base (services, pricing, process, FAQ)
- [ ] Voice mode — visitors can speak and hear responses in configurable voice
- [ ] Multilingual — auto-detect language, respond in kind
- [ ] Book appointment action — inline calendar from chatbot conversation
- [ ] Lead capture action — collect name/email when visitor expresses interest
- [ ] "See how this was built" CTA — link to product demo/tour

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

## Pricing Research (Pre-Launch — Required Before Phase E Deployment)

Research and define pricing strategy for kAyphI's chatbot product and all add-on capabilities. This determines how the product is packaged and sold.

### Chatbot Product Pricing
- [ ] Research competitor pricing (Intercom, Drift, Tidio, Chatbase, CustomGPT, etc.)
- [ ] Define base chatbot plan tiers — what's included at each level (message limits, KB size, conversations/month)
- [ ] Price the base chatbot plans (Starter, Pro, Enterprise or similar)
- [ ] Determine pricing model: flat monthly fee vs. usage-based vs. hybrid

### Feature Add-On Pricing
- [ ] **Voice mode** — price as add-on or include in higher tiers? Cost factors: Whisper API (~$0.006/min), TTS API (~$0.015/1K chars)
- [ ] **Multilingual** — included or add-on? Cost factors: slightly higher token usage for translation instructions
- [ ] **Vision (image input)** — price as paid add-on. Cost factors: higher token usage per vision message (~4x text)
- [ ] **Image generation (DALL-E)** — price as paid add-on (higher tier than vision). Cost factors: ~$0.04–0.12 per generated image
- [ ] **Booking system** — included or add-on? Cost factors: minimal (DB storage only)
- [ ] **Information capture / lead extraction** — included or add-on?
- [ ] **Custom personality** — included or premium-only?
- [ ] **Custom actions (beyond defaults)** — included or enterprise-only?

### Pricing Model Decisions
- [ ] Markup strategy on OpenAI costs — what margin on API pass-through?
- [ ] Usage-based vs. bundled — do clients pay per message, per image, or get a monthly allocation?
- [ ] Overage pricing — what happens when a client exceeds their plan limits?
- [ ] Free tier / trial — offer a limited free chatbot for lead generation?
- [ ] Annual vs. monthly discount structure
- [ ] Update landing page pricing section (`src/content/landing.ts`) to reflect final product pricing (currently shows agency service pricing, not chatbot product pricing)

---

## Phase B: Infrastructure Setup ← NEXT
**Design:** `docs/plans/2026-02-21-phase-b-infrastructure-design.md`
**Implementation plan:** `docs/plans/2026-02-21-phase-b-implementation-plan.md` (27 tasks, Codex-reviewed)
- [ ] Upgrade Next.js 14 → 15 + React 18 → 19
- [ ] Migrate framer-motion → motion (React 19 compat)
- [ ] Install Phase B deps: @supabase/supabase-js, @supabase/ssr, zod
- [ ] Initialize shadcn/ui (config + cn helper only, no components)
- [ ] Create `.env.example` with placeholder keys
- [ ] Set up Supabase clients (`src/lib/supabase/client.ts`, `server.ts`)
- [ ] Database migrations (profiles, conversations, messages, knowledge_base, bookings, workflows, workflow_runs, analytics_events)
- [ ] RLS policies (owner CRUD + public INSERT/SELECT where needed for chatbot)
- [ ] Route group restructure: `(marketing)`, `(auth)`, `(dashboard)`
- ~~[ ] Add Dockerfile and docker-compose.yml~~ (deferred — no value for hosted Supabase + single Next.js app)

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

## Phase E: AI Chatbot (Public-Facing Widget + Knowledge Base + Voice + Multilingual)
- [ ] OpenAI client (`src/lib/openai/client.ts`)
- [ ] Knowledge base infrastructure — `knowledge_base` table with pgvector embeddings, RAG retrieval
- [ ] Default kAyphI knowledge base seed data (`src/content/knowledge-base.ts`)
- [ ] System prompt builder — dynamic prompt from business identity + personality + retrieved context + available actions
- [ ] Chatbot personality system — configurable tone, formality, name/persona, greeting, emoji, verbosity; presets (Professional, Friendly, Casual, Clinical) + custom
- [ ] `/api/chat/route.ts` — **public** (no auth), IP rate limiting, RAG retrieval, streaming, action detection
- [ ] `/api/chat/admin/route.ts` — chatbot config management (auth required)
- [ ] Action system — page-aware + extensible: universal actions (`book_appointment`, `collect_contact`, `capture_info`, `navigate`) + page-specific actions via widget JS API (`setPageContext`)
- [ ] Widget JavaScript API — `window.kayphiChat.setPageContext()` for host sites to register page type, page data, and available actions per page
- [ ] Information capture — auto-extract leads, intent signals, questions, feedback from conversations for business review
- [ ] Booking system — `/api/bookings/route.ts` (public POST, auth for management), `bookings` table
- [ ] Chat widget UI — `ChatWidget`, `ChatBubble`, `ChatInput`, `BookingCalendar`, `QuickReplyChip`
- [ ] Voice mode — `VoiceButton` (STT via Web Speech API / Whisper), `AudioPlayer` (TTS via OpenAI TTS API), configurable voice
- [ ] Multilingual support — auto-detect visitor language, respond in kind, optional language selector
- [ ] Image support — stored KB images (no cost), visitor photo understanding (vision, included), DALL-E generation (optional, budget-capped)
- [ ] Dashboard chat management — conversation viewer, knowledge base editor (text + images), chatbot config (domain, voice, language, image generation toggle + budget), preview panel
- [ ] Message persistence (role, content, tokens_used, language)
- [ ] Analytics events for chatbot interactions

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

Approved (2026-02-21 Phase B design session):
`motion` (replaces `framer-motion` for React 19 compatibility)
`clsx`, `tailwind-merge` (transitive deps of shadcn/ui init)

Any additional dependencies require explicit user approval per SECURITY.md.

## Assumptions
- Rebuild target started as single-page landing site on `/`.
- Full product extends to multi-page SaaS with auth, chatbot, workflows, analytics.
- Substitute assets are acceptable where exact originals are unavailable.
- Hosted Supabase for auth + DB; no Docker (deferred — add if needed later).
- Dependencies installed per-phase, not all at once.

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
- Next: Phase B (Infrastructure Setup) — design approved 2026-02-21, implementation plan written and Codex-reviewed.
