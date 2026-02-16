# ARCHITECTURE.md — System Architecture

This document describes the actual project structure and planned extensions for OrbAI.

For visual design decisions, see [DESIGN.md](DESIGN.md).
For the full product roadmap, see [docs/plans/2026-02-14-full-product-plan.md](docs/plans/2026-02-14-full-product-plan.md).

---

## Tech Stack

### Current (Phase 0)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 14.2.5 | App Router, SSR/SSG |
| Language | TypeScript | 5.5.x | Type safety |
| Styling | Tailwind CSS | 3.4.x | Utility-first CSS |
| Animation | Framer Motion | 11.3.x | Scroll reveals, transitions |
| Unit testing | Vitest | 2.0.x | Component tests |
| E2E testing | Playwright | 1.46.x | Browser tests |
| Runtime | React | 18.2.0 | UI library |

### Planned (Phases A–G)

| Layer | Technology | Status | Purpose |
|-------|-----------|--------|---------|
| Framework | Next.js **15** | Upgrade planned (Phase B) | Latest App Router features |
| Auth & DB | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) | Pre-approved | Auth, PostgreSQL, RLS, real-time |
| AI | OpenAI GPT via Vercel AI SDK (`ai`, `openai`) | Pre-approved | Chatbot, workflow AI processing |
| UI Components | shadcn/ui (copied, not installed) | Pre-approved | Accessible primitives |
| Charts | Recharts (`recharts`) | Pre-approved | Analytics visualizations |
| Forms | React Hook Form + Zod (`react-hook-form`, `@hookform/resolvers`, `zod`) | Pre-approved | Form handling + validation |
| Icons | Lucide React (`lucide-react`) | **Installed** | SVG icon system |
| Container | Docker + docker-compose | Phase B | Development environment |

All planned dependencies were pre-approved during the 2026-02-14 brainstorming session. Any additional dependencies require explicit user approval per SECURITY.md.

---

## Directory Structure

### Current

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Manrope font, metadata, viewport-fit: cover)
│   └── page.tsx                # Landing page (composes all section components)
├── components/
│   ├── layout/
│   │   └── TopNav.tsx          # Sticky navigation bar
│   ├── sections/
│   │   ├── BenefitsSection.tsx
│   │   ├── ComparisonSection.tsx   # "Precision vs Basic" two-column comparison
│   │   ├── ContactSection.tsx
│   │   ├── CustomersSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── FooterSection.tsx
│   │   ├── HeroMedia.tsx           # Lazy-loaded poster→video with crossfade
│   │   ├── HeroSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ServicesSection.tsx
│   │   └── TeamSection.tsx         # Team carousel with social icons
│   └── ui/
│       ├── ActionButton.tsx    # CTA button with ArrowUpRight icon
│       ├── BadgePill.tsx       # Section label pill (accepts ReactNode icon)
│       ├── GlassCard.tsx       # Frosted glass card
│       ├── LogoMark.tsx        # Brand logo
│       ├── Reveal.tsx          # Scroll-triggered animation wrapper
│       ├── SectionHeading.tsx  # Badge + title + subtitle (passes icon to BadgePill)
│       └── SectionShell.tsx    # Section container (max-width, padding)
├── content/
│   └── landing.ts              # Typed content model (LandingPageContent)
├── lib/
│   ├── motion.ts               # Framer Motion presets and timing
│   └── utils.ts                # Utility functions (clamp)
└── styles/
    └── globals.css             # Tailwind directives, CSS custom properties, orb-rings
```

### Planned (after Phase G)

```
src/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                    # Landing page (moved from root)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts          # OAuth callback handler
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Dashboard shell (sidebar nav)
│   │   ├── page.tsx                    # Dashboard overview
│   │   ├── chat/page.tsx               # AI chatbot interface
│   │   ├── workflows/page.tsx          # Workflow builder + list
│   │   ├── analytics/page.tsx          # Analytics dashboard
│   │   └── settings/page.tsx           # Profile settings
│   ├── api/
│   │   ├── chat/route.ts              # OpenAI streaming chat
│   │   ├── workflows/route.ts         # Workflow CRUD
│   │   ├── workflows/run/route.ts     # Workflow execution
│   │   └── analytics/route.ts         # Analytics queries
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Root redirect or marketing
├── components/
│   ├── layout/
│   │   ├── TopNav.tsx
│   │   └── DashboardSidebar.tsx
│   ├── sections/                       # Marketing sections (unchanged)
│   │   └── ...
│   ├── ui/                             # Shared primitives (existing + shadcn/ui)
│   │   └── ...
│   ├── dashboard/                      # Dashboard-specific components
│   │   ├── StatCard.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   └── WorkflowStep.tsx
│   └── forms/                          # RHF + Zod form components
│       └── ...
├── content/
│   └── landing.ts
├── lib/
│   ├── motion.ts
│   ├── utils.ts
│   ├── supabase/
│   │   ├── client.ts                   # Browser client (anon key)
│   │   └── server.ts                   # Server client (service role)
│   ├── openai/
│   │   └── client.ts                   # OpenAI client configuration
│   └── analytics/
│       └── track.ts                    # Event logging utility
├── middleware.ts                        # Auth route protection
└── styles/
    └── globals.css

supabase/
└── migrations/                         # Database schema + RLS policies
    ├── 001_create_profiles.sql
    ├── 002_create_conversations.sql
    ├── 003_create_messages.sql
    ├── 004_create_workflows.sql
    ├── 005_create_workflow_runs.sql
    └── 006_create_analytics_events.sql
```

---

## Page Composition Model

The landing page (`src/app/page.tsx`) follows a composition pattern:

```
page.tsx
  └── imports landingContent from src/content/landing.ts
  └── composes section components in order:
      TopNav → Hero → Benefits → Features → Services → Process →
      Projects → Customers → Pricing → Comparison → Team →
      Contact → FAQ → Footer
```

Each section component:
1. Receives its typed content slice as a prop (e.g., `content: LandingPageContent["benefits"]`)
2. Uses `SectionShell` for consistent spacing/max-width
3. Uses `SectionHeading` for badge + title + subtitle
4. Uses `GlassCard` for card layouts
5. Uses `Reveal` or inline Framer Motion for scroll animations

### Data Flow

```
landing.ts (typed content)
    │
    ▼
page.tsx (server component, static render)
    │
    ├── TopNav (client: scroll-direction hide/show, Framer Motion)
    ├── HeroSection (client: animation, lazy video via HeroMedia)
    ├── BenefitsSection (client: stagger animation, marquee ticker)
    ├── FeaturesSection (client: stagger animation)
    ├── ServicesSection (client: animation)
    ├── ProcessSection (client: animation, decorative step numbers)
    ├── ProjectsSection (client: tab state, layoutId tab indicator)
    ├── CustomersSection (client: star ratings, avatar placeholders)
    ├── PricingSection (client: toggle state, layoutId sliding indicator)
    ├── ComparisonSection (client: stagger animation)
    ├── TeamSection (client: horizontal carousel with scroll buttons)
    ├── ContactSection (client: form state)
    ├── FAQSection (client: accordion state, AnimatePresence height animation)
    └── FooterSection (client: social icons, copyright)
```

All section components are `"use client"` due to Framer Motion or React state. The root `page.tsx` is a server component that imports and composes them.

---

## Content Architecture

The entire landing page copy is managed through a single typed content model:

**File:** `src/content/landing.ts`
**Type:** `LandingPageContent`

This type defines:
- `brand` — brand name string
- `nav` — navigation items array
- Section-specific content for all 13 sections (hero, benefits, features, services, process, projects, customers, pricing, comparison, team, contact, faq, footer)

**Key types:**
- `SectionId` — union type of all section identifiers
- `LandingNavItem` — `{ label, href }`
- `CTA` — `{ label, href, variant: "primary" | "secondary" }`

**Section ordering:** Defined by `sectionOrder` array export.

---

## Routing

### Current
Single route: `/` (landing page)

### Planned
Route groups split the app into three concerns:

| Group | Path prefix | Layout | Auth required |
|-------|-------------|--------|---------------|
| `(marketing)` | `/` | TopNav + Footer | No |
| `(auth)` | `/login`, `/signup`, `/callback` | Centered card | No (redirects if already logged in) |
| `(dashboard)` | `/chat`, `/workflows`, `/analytics`, `/settings` | Sidebar + TopBar | Yes (middleware-enforced) |

Route groups in Next.js App Router do not affect URL paths — they only organize layouts and middleware scoping.

---

## Authentication Architecture (Planned)

```
Browser request
    │
    ▼
middleware.ts
    ├── Is route in (dashboard)?
    │   ├── Yes → validate Supabase session
    │   │   ├── Valid → continue to page
    │   │   ├── Expired → attempt refresh
    │   │   │   ├── Refreshed → continue
    │   │   │   └── Failed → redirect to /login
    │   │   └── No session → redirect to /login
    │   └── No → continue (public route)
    │
    ▼
API routes (additional layer)
    └── Each API route independently calls getUser()
        └── Never trust middleware alone for API auth
```

**Supabase clients:**
- `src/lib/supabase/client.ts` — browser client using `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `src/lib/supabase/server.ts` — server client using `NEXT_PUBLIC_SUPABASE_ANON_KEY` with user session for RLS

**Security invariant:** The service role key is never used in user-facing API routes. All user data operations use the authenticated user's session token with RLS enforcement.

---

## Database Schema (Planned)

Six tables, all with RLS enabled:

```
profiles (extends auth.users)
    │
    ├── conversations (1:many)
    │   └── messages (1:many)
    │
    ├── workflows (1:many)
    │   └── workflow_runs (1:many)
    │
    └── analytics_events (1:many)
```

**RLS policy:** Every table enforces `auth.uid() = user_id` for all operations. Users can only CRUD their own rows.

See [docs/plans/2026-02-14-ai-chatbot-website-design.md](docs/plans/2026-02-14-ai-chatbot-website-design.md) for full column definitions.

---

## API Architecture (Planned)

All API routes follow a consistent pattern:

```
1. Verify auth (getUser() — reject if no valid session)
2. Validate input (Zod schema — reject with 400 if invalid)
3. Execute business logic
4. Return typed response (or stream for chat)
```

| Endpoint | Method | Auth | Rate limited | Description |
|----------|--------|------|-------------|-------------|
| `/api/chat` | POST | Yes | Yes (token bucket) | Stream OpenAI response |
| `/api/workflows` | GET/POST/PATCH/DELETE | Yes | No | Workflow CRUD |
| `/api/workflows/run` | POST | Yes | Yes | Execute workflow (idempotent) |
| `/api/analytics` | GET | Yes | No | Query analytics events |

---

## Testing Architecture

### Current

| Type | Tool | Config | Location |
|------|------|--------|----------|
| Unit/Integration | Vitest + Testing Library | `vitest.config.ts` | `tests/landing-page.test.tsx` |
| E2E | Playwright | `playwright.config.ts` | `tests/e2e/landing.spec.ts` |

**Test files:**
- `tests/landing-page.test.tsx` — core copy, section order, nav items
- `tests/hero-media.test.tsx` — poster/video lazy-load, reduced motion, crossfade

**Test setup:** `tests/setup.tsx` — Jest DOM matchers, IntersectionObserver/matchMedia mocks.
**Path aliases:** Vitest resolves `@/*` → `src/*` via config.

### Planned

- Component tests for all dashboard components
- API route tests (mock Supabase + OpenAI)
- E2E flows: signup → login → chat → workflow → analytics
- Workflow execution tests with mocked OpenAI responses

---

## Build & Development Commands

Defined in `package.json`:

| Command | Script | Purpose |
|---------|--------|---------|
| `npm run dev` | `next dev` | Development server |
| `npm run build` | `next build` | Production build |
| `npm run start` | `next start` | Production server |
| `npm run lint` | `next lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` | TypeScript check |
| `npm run test` | `vitest run` | Unit tests |
| `npm run test:watch` | `vitest` | Unit tests (watch) |
| `npm run test:e2e` | `playwright test` | E2E tests |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts |
| `tsconfig.json` | TypeScript config (strict, path aliases) |
| `tailwind.config.ts` | Tailwind theme extensions |
| `next.config.mjs` | Next.js config (reactStrictMode only) |
| `postcss.config.js` | PostCSS plugins (Tailwind + Autoprefixer) |
| `vitest.config.ts` | Vitest test runner config |
| `playwright.config.ts` | Playwright E2E config |
| `.eslintrc.json` | ESLint extends `next/core-web-vitals` |

---

## Environment Variables (Planned)

```env
# Supabase (required for Phases B+)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# OpenAI (required for Phase E+)
OPENAI_API_KEY=<your-openai-key>
```

`NEXT_PUBLIC_` prefixed variables are exposed to the browser.
`SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` are server-only — never sent to the client.

---

## Invariants

1. **Auth before data.** No API route processes requests without verifying auth via `getUser()`.
2. **RLS always on.** Every user-facing table has row-level security. No `service_role` queries in user-facing code.
3. **Typed content.** All marketing copy flows through `LandingPageContent` — no hardcoded strings in components.
4. **Component composition.** Sections compose primitives (`GlassCard`, `SectionShell`, etc.) — no one-off styling.
5. **Server-only secrets.** `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` never appear in client bundles.
