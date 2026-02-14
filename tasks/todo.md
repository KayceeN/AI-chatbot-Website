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

## Phase 2: Post-Codex Visual Audit (Claude Code-owned)
After Codex completes the build, Claude Code will audit against reference frames and write a fix plan.

### Visual Audit: Reference vs Build
Compare every section against `reference/frames/` and identify:
- Missing visual elements (images, icons, 3D assets, illustrations)
- Missing animations and interactions (scroll reveals, hover states, transitions)
- Missing components or sections
- Layout/spacing/typography deviations
- Color and styling mismatches

#### Sections to Audit (with reference frames)
- [ ] **Hero** (frames 0000–0005): 3D orb with ripple effect, logo mark, badge pill, CTAs, glassmorphism card
- [ ] **Founder Quote** (frames 0010–0015): Quote typography, avatar/icon, scroll-into-view transition
- [ ] **Benefits / Why Choose Us** (frames 0015–0025): 3 benefit cards with custom illustrations (clock, bar chart, orb+avatars), chip/tag pills
- [ ] **Features** (frames 0025–0030): 4-card grid with actual images (robot photos), icon badges on cards
- [ ] **Services** (frames 0028–0032): Service cards with interactive elements (chat UI mockup, content gen mockup, chatbot mockup, workflow node diagram)
- [ ] **Process** (frames 0033–0038): Step cards, automation preview panel (dark card with workflow visualization)
- [ ] **Projects / Case Studies** (frames 0038–0042): Tab switcher, project image placeholder, metric cards
- [ ] **Customers / Testimonials** (frames 0042–0048): Feature quote card, image card, mini testimonials, stat counters
- [ ] **Pricing** (frames 0048–0055): Monthly/Yearly/30% off toggle, 3-tier cards, "Popular" badge, donation line, checkmarks
- [ ] **FAQ** (frames 0058–0062): Accordion with chevron icons, expand/collapse animation, email footer line
- [ ] **Contact** (frames 0055–0058): Email/Call info cards with icons, contact form with styled inputs
- [ ] **Footer** (frames 0062+): Orb rings background, glassmorphism card, logo, nav links
- [ ] **Floating Dock** (all frames): "Get Orb AI" button + "Made in Framer" badge, sticky positioning
- [ ] **Top Nav** (all frames): Logo, nav links, "Get Started" CTA button, sticky behavior, scroll hide/show

#### Pre-identified Gaps (from initial code review)
These are issues already visible in the current scaffolded code that will need fixing:
1. **No actual images** — all visual areas are gradient placeholders (Benefits cards, Features cards, Services cards, Projects image, Customers image)
2. **No 3D orb asset** — Hero uses CSS class `orb-rings` but no actual 3D orb or ripple animation
3. **No custom illustrations** — Benefits section needs clock, bar chart, orb+avatar illustrations
4. **Services section lacks interactive mockups** — Reference shows a chat UI, content generation UI, chatbot interface, and workflow node diagram inside the service cards
5. **No app/page.tsx or app/layout.tsx** — The `src/app/` directory exists but may not have the root page composing all sections
6. **Missing globals.css** — No global styles file with custom properties, `field` class, `orb-rings` styles, shadow tokens
7. **FAQ accordion lacks animation** — Reference shows smooth expand/collapse; current code uses conditional render without motion
8. **Pricing toggle missing animation** — No animated indicator sliding between Monthly/Yearly
9. **FloatingDock not rendered** — Component exists but may not be included in page layout
10. **No scroll-triggered section reveals** — Most sections use `whileInView` but the Reveal wrapper component isn't used consistently
11. **TopNav missing scroll behavior** — No hide-on-scroll-down / show-on-scroll-up behavior visible in reference

### Write Fix Plan
- [ ] Write detailed implementation plan to `docs/plans/YYYY-MM-DD-visual-audit-fixes.md`
- [ ] Prioritize fixes by visual impact (P0: broken layout, P1: missing key visuals, P2: polish/animations)
- [ ] Estimate complexity per fix (small/medium/large)

## Phase 3: Post-Codex Architecture Reconciliation (Claude Code-owned)

### Audit & Inventory
- [ ] Review all files Codex created — inventory components, pages, styles, config
- [ ] Compare Codex output against the approved design doc (`docs/plans/2026-02-14-ai-chatbot-website-design.md`)
- [ ] Identify gaps between Codex's marketing-only build and the full product architecture

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
