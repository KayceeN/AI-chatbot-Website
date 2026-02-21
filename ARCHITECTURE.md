# ARCHITECTURE.md — System Architecture

This document describes the actual project structure and planned extensions for kAyphI.

**Product identity:** kAyphI is an AI automation company that provides businesses with four core services: AI Strategy Consulting, Content Generation, AI-Powered Chatbots, and Automated Workflows. The kAyphI website serves dual purposes — it is the company's marketing site and a live demonstration of the product suite. A public-facing chatbot widget on the site answers visitor questions using a business knowledge base and can perform actions like booking appointments. This chatbot is both a real tool for kAyphI's own visitors and a showcase of what kAyphI builds for its clients.

For visual design decisions, see [DESIGN.md](DESIGN.md).
For the full product roadmap, see [docs/plans/2026-02-14-full-product-plan.md](docs/plans/2026-02-14-full-product-plan.md).
For the Phase B infrastructure plan, see [docs/plans/2026-02-21-phase-b-implementation-plan.md](docs/plans/2026-02-21-phase-b-implementation-plan.md).
For the Phase C auth design, see [docs/plans/2026-02-21-phase-c-auth-design.md](docs/plans/2026-02-21-phase-c-auth-design.md).
For the Phase D dashboard design, see [docs/plans/2026-02-21-phase-d-dashboard-design.md](docs/plans/2026-02-21-phase-d-dashboard-design.md).

---

## Tech Stack

### Current (Phase D)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 15.5.x | App Router, SSR/SSG |
| Language | TypeScript | 5.5.x | Type safety |
| Styling | Tailwind CSS | 3.4.x | Utility-first CSS |
| Animation | Motion | 12.x | Scroll reveals, transitions (renamed from Framer Motion) |
| Auth & DB | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) | Latest | Auth, PostgreSQL, RLS, real-time |
| Validation | Zod | Latest | Schema validation |
| Forms | React Hook Form + @hookform/resolvers | Latest | Auth forms, dashboard forms |
| UI Components | shadcn/ui (Input, Button, Label installed) | Latest | Accessible primitives |
| Icons | Lucide React (`lucide-react`) | Latest | SVG icon system |
| Unit testing | Vitest | 2.0.x | Component tests |
| E2E testing | Playwright | 1.46.x | Browser tests |
| Runtime | React | 19.2.x | UI library |

### Planned (Phases C–G)

| Layer | Technology | Status | Purpose |
|-------|-----------|--------|---------|
| AI | OpenAI GPT via Vercel AI SDK (`ai`, `openai`) | Pre-approved | Chatbot, workflow AI processing |
| Charts | Recharts (`recharts`) | Pre-approved | Analytics visualizations |
| Forms | React Hook Form (`react-hook-form`, `@hookform/resolvers`) | **Installed (Phase C)** | Form handling |
| Container | Docker + docker-compose | Deferred | Development environment (not needed for hosted Supabase + single Next.js app) |

All planned dependencies were pre-approved during the 2026-02-14 brainstorming session. Any additional dependencies require explicit user approval per SECURITY.md.

---

## Directory Structure

### Current

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Manrope font, metadata, viewport-fit: cover)
│   ├── (marketing)/
│   │   └── page.tsx            # Landing page (composes all section components)
│   ├── (auth)/
│   │   ├── layout.tsx          # Auth layout (centered, dark bg)
│   │   ├── login/
│   │   │   ├── page.tsx        # Login page (Suspense wrapper)
│   │   │   └── login-form.tsx  # Login form (email/password, RHF + Zod)
│   │   ├── signup/
│   │   │   └── page.tsx        # Signup form (email/password + name)
│   │   └── callback/
│   │       └── route.ts        # OAuth/email confirmation callback
│   └── dashboard/
│       ├── layout.tsx              # Dashboard shell (sidebar + top bar + auth gate)
│       ├── page.tsx                # Overview (stats + quick actions)
│       ├── chat/page.tsx           # Placeholder (Phase E)
│       ├── workflows/page.tsx      # Placeholder (Phase F)
│       ├── analytics/page.tsx      # Placeholder (Phase G)
│       └── settings/
│           ├── page.tsx            # Profile settings (server component)
│           └── settings-form.tsx   # Settings form (client component)
├── components/
│   ├── dashboard/
│   │   ├── DashboardShell.tsx      # Layout orchestrator (sidebar + top bar + content)
│   │   ├── DashboardSidebar.tsx    # Nav with layoutId active indicator
│   │   ├── DashboardTopBar.tsx     # Hamburger + user info
│   │   ├── MobileSidebarDrawer.tsx # Slide-out mobile sidebar
│   │   └── StatCard.tsx            # Stat display card
│   ├── forms/
│   │   └── FormField.tsx       # Labeled input with RHF + error display
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
│       ├── button.tsx          # shadcn Button
│       ├── GlassCard.tsx       # Frosted glass card
│       ├── input.tsx           # shadcn Input
│       ├── label.tsx           # shadcn Label
│       ├── LogoMark.tsx        # Brand logo
│       ├── Reveal.tsx          # Scroll-triggered animation wrapper
│       ├── SectionHeading.tsx  # Badge + title + subtitle (passes icon to BadgePill)
│       └── SectionShell.tsx    # Section container (max-width, padding)
├── content/
│   └── landing.ts              # Typed content model (LandingPageContent)
├── lib/
│   ├── motion.ts               # Motion presets and timing
│   ├── utils.ts                # Utility functions (cn, clamp)
│   ├── supabase/
│   │   ├── client.ts           # Browser client (anon key)
│   │   └── server.ts           # Server client (cookie-based auth)
│   └── validations/
│       ├── auth.ts             # Zod schemas (login, signup, safeRedirect)
│       └── settings.ts         # Zod schema (profile form)
├── middleware.ts                # Session refresh + route protection
└── styles/
    └── globals.css             # Tailwind directives, CSS custom properties, orb-rings
```

**Note:** The dashboard uses `dashboard/` (actual path segment), not a `(dashboard)/` route group. Route groups strip the group name from URLs, so `(dashboard)/page.tsx` would resolve to `/` — conflicting with `(marketing)/page.tsx`. Using `dashboard/` as a real segment means pages resolve to `/dashboard/*`.

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
│   ├── dashboard/                        # Actual path segment (not route group — avoids / conflict)
│   │   ├── layout.tsx                  # Dashboard shell (sidebar nav)
│   │   ├── page.tsx                    # Dashboard overview
│   │   ├── chat/page.tsx               # Chatbot management (knowledge base, config)
│   │   ├── workflows/page.tsx          # Workflow builder + list
│   │   ├── analytics/page.tsx          # Analytics dashboard
│   │   └── settings/page.tsx           # Profile settings
│   ├── api/
│   │   ├── chat/route.ts              # Public chatbot endpoint (no auth — visitor-facing)
│   │   ├── chat/admin/route.ts        # Chatbot config management (auth required)
│   │   ├── bookings/route.ts          # Appointment booking CRUD
│   │   ├── knowledge/route.ts         # Knowledge base CRUD (auth required)
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
│   ├── chat/                           # Public chatbot widget components
│   │   ├── ChatWidget.tsx              # Floating bubble + expandable panel
│   │   ├── ChatBubble.tsx              # Individual message bubble
│   │   ├── ChatInput.tsx               # Text input with send button
│   │   └── BookingCalendar.tsx         # Inline appointment picker
│   ├── ui/                             # Shared primitives (existing + shadcn/ui)
│   │   └── ...
│   ├── dashboard/                      # Dashboard-specific components
│   │   ├── StatCard.tsx
│   │   ├── KnowledgeBaseEditor.tsx     # Upload/manage knowledge base content
│   │   └── WorkflowStep.tsx
│   └── forms/                          # RHF + Zod form components
│       └── ...
├── content/
│   ├── landing.ts                      # Marketing page content
│   └── knowledge-base.ts              # Default kAyphI knowledge base (own site demo)
├── lib/
│   ├── motion.ts
│   ├── utils.ts
│   ├── supabase/
│   │   ├── client.ts                   # Browser client (anon key)
│   │   └── server.ts                   # Server client (service role)
│   ├── openai/
│   │   └── client.ts                   # OpenAI client configuration
│   ├── chatbot/
│   │   ├── knowledge.ts               # Knowledge base retrieval (RAG pipeline)
│   │   ├── actions.ts                  # Extensible action registry (booking, etc.)
│   │   └── system-prompt.ts           # System prompt builder from knowledge base
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
    ├── 004_create_knowledge_base.sql   # Knowledge base documents + embeddings
    ├── 005_create_bookings.sql         # Appointment bookings
    ├── 006_create_workflows.sql
    ├── 007_create_workflow_runs.sql
    └── 008_create_analytics_events.sql
```

---

## Page Composition Model

The landing page (`src/app/(marketing)/page.tsx`) follows a composition pattern:

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

All section components are `"use client"` due to Motion or React state. The root `page.tsx` is a server component that imports and composes them.

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

### Current (Phase D)

| Group/Segment | Path | Layout | Auth required |
|---------------|------|--------|---------------|
| `(marketing)` | `/` | TopNav + Footer | No |
| `(auth)` | `/login`, `/signup`, `/callback` | Centered dark card, no nav | No (redirects to dashboard if already logged in) |
| `dashboard/` | `/dashboard` | Sidebar + top bar (DashboardShell) | Yes (`getUser()` gate in layout + middleware redirect) |
| `dashboard/` | `/dashboard/chat` | DashboardShell | Yes (placeholder — Phase E) |
| `dashboard/` | `/dashboard/workflows` | DashboardShell | Yes (placeholder — Phase F) |
| `dashboard/` | `/dashboard/analytics` | DashboardShell | Yes (placeholder — Phase G) |
| `dashboard/` | `/dashboard/settings` | DashboardShell | Yes (profile form + account info) |

**Note:** The dashboard uses `dashboard/` as an actual path segment, not a `(dashboard)` route group. This avoids a routing conflict where `(dashboard)/page.tsx` would resolve to `/` (same as `(marketing)/page.tsx`).

---

## Authentication Architecture (Current — Phase C)

**Middleware** (`src/middleware.ts`) is a convenience layer, not a security boundary:
- Refreshes the Supabase session cookie on every matched request
- Redirects unauthenticated users from `/dashboard/*` to `/login?next={path}`
- Redirects authenticated users from `/login` or `/signup` to `/dashboard`
- Matcher: `["/dashboard/:path*", "/login", "/signup"]`

**Security gate:** The real auth check is `getUser()` in `src/app/dashboard/layout.tsx`. This server-side call verifies the session and redirects to `/login` if invalid. API routes (future) must also independently call `getUser()`.

**Redirect safety:** The `?next=` parameter is validated by `safeRedirect()` in `src/lib/validations/auth.ts` — rejects null, empty, protocol-relative (`//`), and absolute URLs to prevent open redirects.

```
Browser request
    │
    ▼
middleware.ts (convenience only)
    ├── Refresh session cookie
    ├── Is route /dashboard/*?
    │   ├── No session → redirect to /login?next={path}
    │   └── Has session → continue
    ├── Is route /login or /signup?
    │   ├── Has session → redirect to /dashboard
    │   └── No session → continue
    └── Other routes → continue
    │
    ▼
Dashboard layout (security gate)
    └── getUser() — reject if no valid session
    │
    ▼
API routes (additional layer — future)
    └── Each API route independently calls getUser()
        └── Never trust middleware alone for API auth
```

**Supabase clients:**
- `src/lib/supabase/client.ts` — browser client using `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `src/lib/supabase/server.ts` — server client using `createServerClient` from `@supabase/ssr`, reads cookies via `next/headers`, uses anon key with user session for RLS

**Security invariant:** The service role key is never used in user-facing API routes. All user data operations use the authenticated user's session token with RLS enforcement. Public API routes (chatbot, bookings) use the anon role without an auth session.

---

## Database Schema

Eight tables defined in `supabase/migrations/`, all with RLS enabled. Apply via Supabase SQL Editor or `supabase db push`:

```
profiles (extends auth.users)
    │
    ├── knowledge_base (1:many)         # Business knowledge documents + embeddings
    │
    ├── conversations (1:many)          # Visitor chat sessions (public, no auth)
    │   └── messages (1:many)
    │
    ├── bookings (1:many)               # Appointment bookings from chatbot or /book page
    │
    ├── workflows (1:many)
    │   └── workflow_runs (1:many)
    │
    └── analytics_events (1:many)
```

**RLS policy:** Most tables enforce `auth.uid() = user_id` for owner operations. Exceptions:
- `conversations` and `messages` — public INSERT allowed (visitor chats), owner SELECT/UPDATE/DELETE
- `knowledge_base` — public SELECT for chatbot retrieval, owner INSERT/UPDATE/DELETE
- `bookings` — public INSERT (visitors book), owner SELECT/UPDATE/DELETE

See [docs/plans/2026-02-14-ai-chatbot-website-design.md](docs/plans/2026-02-14-ai-chatbot-website-design.md) for full column definitions.

---

## API Architecture (Planned)

API routes follow two patterns — **public** (visitor-facing, no auth) and **protected** (dashboard, auth required):

**Public routes (rate-limited by IP):**
```
1. Validate input (Zod schema — reject with 400 if invalid)
2. Rate limit by IP (token bucket)
3. Execute business logic
4. Return typed response (or stream for chat)
```

**Protected routes (rate-limited by user):**
```
1. Verify auth (getUser() — reject if no valid session)
2. Validate input (Zod schema — reject with 400 if invalid)
3. Execute business logic
4. Return typed response
```

| Endpoint | Method | Auth | Rate limited | Description |
|----------|--------|------|-------------|-------------|
| `/api/chat` | POST | **No** (public) | Yes (IP-based) | Public chatbot — streams knowledge-base-powered response to visitors |
| `/api/chat/admin` | GET/POST/PATCH | Yes | No | Chatbot configuration (system prompt, model, behavior) |
| `/api/bookings` | GET/POST/PATCH/DELETE | POST: **No** (public), others: Yes | Yes (IP for public) | Appointment scheduling — visitors create, owners manage |
| `/api/knowledge` | GET/POST/PATCH/DELETE | Yes | No | Knowledge base document CRUD |
| `/api/workflows` | GET/POST/PATCH/DELETE | Yes | No | Workflow CRUD |
| `/api/workflows/run` | POST | Yes | Yes | Execute workflow (idempotent) |
| `/api/analytics` | GET | Yes | No | Query analytics events |

---

## Chatbot Architecture (Planned)

The chatbot is kAyphI's core product — a public-facing AI assistant embedded on the marketing site as a floating widget. It requires **no login** from visitors.

### How It Works

```
Visitor opens site
    │
    ▼
ChatWidget (floating bubble, bottom-right)
    │ visitor clicks bubble
    ▼
Chat panel expands
    │ visitor types question
    ▼
POST /api/chat
    │
    ├── 1. Rate limit check (IP-based token bucket)
    ├── 2. Input validation (Zod)
    ├── 3. Retrieve relevant knowledge base chunks (embedding similarity search)
    ├── 4. Build system prompt (business identity + retrieved context)
    ├── 5. Stream response via Vercel AI SDK + OpenAI
    ├── 6. Detect action intents (booking, contact, etc.)
    │   └── If visitor requests booking → present BookingCalendar inline
    ├── 7. Persist conversation + messages to Supabase
    └── 8. Log analytics event
```

### Knowledge Base

The chatbot's intelligence comes from a **business knowledge base** — structured content about the company's services, pricing, process, FAQ, case studies, and policies. For kAyphI's own site, this is seeded from the landing page content and supplemented with additional business details.

**Storage:** `knowledge_base` table with document chunks + vector embeddings (pgvector via Supabase).

**Retrieval:** On each user message, the top-K most relevant chunks are retrieved by embedding similarity and injected into the system prompt as context (RAG pattern).

**Management:** Business owners manage their knowledge base through the dashboard (`/chat` page in the dashboard) — upload documents, edit entries, preview chatbot responses.

### Response Behavior (Three-Tier)

The chatbot uses a **domain-aware** response strategy, not a strict knowledge-base-only filter. The business domain is defined by the knowledge base content and the business category (e.g., "dental office", "AI automation agency").

| Tier | Condition | Behavior | Example |
|------|-----------|----------|---------|
| **1. Knowledge base match** | Question matches knowledge base content | Answer from retrieved knowledge base context (grounded, highest confidence) | "What are your pricing plans?" → answer from pricing KB entries |
| **2. Domain-relevant, no KB match** | Question is within the business domain but not covered by the knowledge base | Answer using LLM general knowledge, clearly framed as general information (not specific to the business) | Dental office chatbot: "What is a root canal?" → explain the procedure using general dental knowledge |
| **3. Off-topic** | Question is outside the business domain entirely | Politely decline and redirect to the business's services | Dental office chatbot: "Who won the Super Bowl?" → "I'm here to help with dental questions! Is there anything about our services I can assist with?" |

**How domain relevance is determined:**
- The system prompt defines the business category and domain boundaries (e.g., "You are a chatbot for a dental office. You can answer general dentistry questions even if they are not in the knowledge base.")
- The business owner can configure domain keywords and topic boundaries in the dashboard
- The LLM uses its understanding of the business category to classify questions as in-domain or off-topic

**Tier 2 behavior:**
- Tier 2 answers are delivered in the **same tone and personality** as Tier 1 — no hedging, no "generally speaking" prefixes. The chatbot speaks as the business, maintaining the configured personality at all times.
- The chatbot does **not** proactively suggest actions (e.g., it never unprompted says "Would you like to book a consultation?"). It simply answers the question in the business's voice and waits for the visitor to ask for anything further.
- Business owners can toggle Tier 2 on/off in the dashboard (some may prefer strict KB-only answers)

### Chatbot Personality

Each chatbot deployment has a **configurable personality** that defines how it communicates. The personality applies to all responses — Tier 1, Tier 2, and Tier 3 declines.

**Personality dimensions (configured by the business owner):**
- **Tone** — professional, friendly, casual, clinical, warm, authoritative, playful, etc.
- **Formality level** — formal ("We would be happy to assist you") vs. casual ("Sure thing! Here's what you need to know")
- **Name / persona** — the chatbot can have a name (e.g., "Luna", "Dr. SmileBot", "Alex") and refer to itself by that name
- **Greeting style** — how it opens conversations ("Hi! How can I help?" vs. "Welcome to [Business]. What can I assist you with today?")
- **Emoji usage** — on/off, with configurable frequency
- **Verbosity** — concise (short direct answers) vs. detailed (thorough explanations)

**Personality presets:** Business owners can choose from presets (Professional, Friendly, Casual, Clinical) or fully customize each dimension. The personality is injected into the system prompt and governs all LLM output.

**Examples of the same answer in different personalities:**

| Personality | Response to "What is a root canal?" |
|------------|--------------------------------------|
| Clinical (dental office) | "A root canal is a procedure to repair and save a tooth that is badly decayed or infected. The procedure involves removing the damaged pulp, cleaning the inside of the tooth, and sealing it. If you have any other dental questions, feel free to ask." |
| Friendly (dental office) | "Great question! A root canal is basically how we save a tooth that's been damaged or infected. We clean out the inside, fix it up, and seal it so it's good as new. Nothing to worry about! Let me know if you have any other questions." |
| Playful (dental office) | "Ah, root canals! They sound scary but they're actually tooth-savers! Think of it as a deep clean for the inside of your tooth. We remove the ouchie parts, fix everything up, and seal it tight. Anything else on your mind?" |

### Action System (Page-Aware + Extensible)

The chatbot can perform actions beyond answering questions. Actions are **page-aware** — the chatbot knows what page the visitor is on and what functionality is available, and can execute actions relevant to the current context when the visitor's intent calls for it.

**Behavioral rule:** The chatbot **never proactively suggests or offers actions**. It responds to whatever the visitor asks and silently determines whether an action should be executed based on the visitor's intent. For example, if a visitor says "I'd like to book an appointment," the chatbot initiates the booking flow. But it never unprompted says "Would you like to book an appointment?" or pushes action suggestions.

**How page awareness works:**
```
Visitor is on a page
    │
    ▼
ChatWidget receives page context from the host page:
    ├── current URL / route
    ├── page type (e.g., "product-listing", "checkout", "landing", "blog")
    ├── available actions for this page (registered by the host site)
    └── page-specific data (e.g., product ID, cart contents, article title)
    │
    ▼
System prompt is built with:
    ├── business knowledge base (always)
    ├── page context (current page type + available actions)
    └── page-specific data (what the visitor is looking at)
```

The host website registers available actions per page via the widget's JavaScript API. The chatbot can only execute actions that are registered for the current page — it never fabricates or assumes actions that aren't registered.

**Universal actions (available on every page):**
| Action | Trigger | Effect |
|--------|---------|--------|
| `book_appointment` | Visitor asks to schedule a call/demo | Surface inline calendar, create booking, trigger confirmation email workflow |
| `collect_contact` | Visitor wants to be contacted | Capture name + email, store as lead |
| `capture_info` | Visitor shares business needs, preferences, or feedback | Store structured data for the business to review/act on later |
| `navigate` | Visitor asks about a section/page | Navigate to the relevant page or scroll to section |

**Page-specific action examples (configured per client site):**

| Page type | Action | Trigger | Effect |
|-----------|--------|---------|--------|
| Product listing | `filter_products` | "Show me red dresses under $50" | Apply filters on the product grid |
| Product detail | `add_to_cart` | "Add this to my cart" | Add the current product to cart |
| Product detail | `check_availability` | "Is this in stock in size M?" | Query inventory and respond |
| Checkout | `apply_coupon` | "Do you have any discount codes?" | Surface available coupons or apply one |
| Dashboard | `run_report` | "Show me last month's sales" | Trigger a report generation |
| Blog/article | `find_related` | "Do you have more articles about this?" | Surface related content |
| Healthcare portal | `check_symptoms` | "I've had a headache for 3 days" | Run symptom checker flow |
| Restaurant | `place_order` | "I'd like to order a large pepperoni pizza" | Start order flow |
| Real estate | `schedule_viewing` | "Can I see this property Saturday?" | Book a property viewing |

**Widget JavaScript API for registering page actions:**
```javascript
// Host site registers actions available on the current page
window.kayphiChat.setPageContext({
  pageType: "product-detail",
  pageData: { productId: "SKU-123", productName: "Running Shoes", price: 89.99 },
  actions: [
    { name: "add_to_cart", description: "Add this product to the visitor's cart", handler: (data) => addToCart(data.productId) },
    { name: "check_availability", description: "Check stock for a size/color", handler: (data) => checkStock(data) },
    { name: "notify_restock", description: "Sign up for restock notification", handler: (data) => notifyRestock(data) }
  ]
});
```

The chatbot receives these registered actions in its system prompt and can invoke them via function calling. The handler runs on the client side (host website's JavaScript), so the chatbot can interact with any page functionality the host site exposes.

**Business owner configuration (dashboard):**
- Define global actions (available on all pages)
- Define page-type templates with default actions (e.g., "all product pages get add_to_cart")
- Custom actions per specific page (e.g., "the pricing page gets compare_plans")
- Action permissions — which actions require visitor confirmation before executing

### Information Capture

Beyond direct actions, the chatbot continuously **captures actionable information** from conversations for the business to act on later:

- **Lead data** — name, email, company, role, expressed needs
- **Intent signals** — which services the visitor is interested in, budget indicators, timeline
- **Questions asked** — common questions reveal knowledge gaps or new FAQ opportunities
- **Feedback** — complaints, feature requests, product impressions
- **Conversation summaries** — auto-generated summary of each conversation for quick review

This data is stored in the `analytics_events` table (structured) and viewable in the dashboard. Business owners can filter, search, and export captured information.

**Future actions (extensible):**
- Qualify leads (BANT questions)
- Hand off to human support
- Submit support tickets
- Trigger workflows
- Integration with external calendars (Google Calendar, Calendly)
- CRM sync (push captured leads/info to Salesforce, HubSpot, etc.)

### Voice Mode

The chatbot supports **voice conversations** — visitors can speak to it and hear responses read back in a selected voice.

**Speech-to-Text (input):** Browser Web Speech API (`SpeechRecognition`) or OpenAI Whisper API for higher accuracy. Visitor taps a microphone button to start speaking; transcribed text is sent as a regular chat message.

**Text-to-Speech (output):** OpenAI TTS API (`tts-1` model) with selectable voices. Assistant responses are converted to audio and played back inline. Business owners can configure the default voice in the dashboard.

**Fallback:** If the browser does not support Web Speech API or the visitor denies microphone access, the widget gracefully falls back to text-only mode.

### Multilingual Support

The chatbot can communicate in **multiple languages** — both text and voice.

**Language detection:** Auto-detect the visitor's language from their first message (via the LLM or a lightweight detection library). Respond in the same language.

**Knowledge base translation:** The system prompt instructs the LLM to answer in the visitor's language using the knowledge base content (which may be in English). For higher quality, business owners can optionally provide translated knowledge base entries.

**Voice language:** Speech-to-text and text-to-speech adapt to the detected language. OpenAI Whisper supports 50+ languages; TTS voices are selected per language.

**Language selector:** Optional widget UI element letting visitors manually choose their preferred language.

### Image Capabilities (Three-Tier)

The chatbot supports images in conversations — showing relevant visuals, understanding visitor-uploaded photos, and optionally generating images on demand.

| Tier | Capability | Pricing | How it works |
|------|-----------|---------|-------------|
| **1. Stored images** | Serve images from the knowledge base | **Included in base plan** — static file serving, no LLM cost | Business uploads images (procedure diagrams, product photos, office images) as knowledge base entries. Chatbot displays them when the conversation context matches. |
| **2. Vision (image input)** | Understand images visitors send | **Paid add-on** — uses GPT-4o-mini vision tokens | Visitor uploads a photo (e.g., "What's wrong with my tooth?"). The model analyzes it using its built-in vision capability. Higher token usage per message. |
| **3. Image generation** | Generate new images on the fly via DALL-E | **Paid add-on (higher tier)** — ~$0.04–0.12 per image (DALL-E 3) | When no stored image exists and a visual would help, the chatbot generates one. Per-image cost passed through or bundled into plan pricing. |

**Pricing model:** Stored images (Tier 1) are included in every plan. Vision (Tier 2) and image generation (Tier 3) are paid add-ons that clients opt into at higher pricing tiers. See the pricing research task in `tasks/todo.md` for the full pricing strategy work.

**Priority order:** The chatbot always prefers Tier 1 (stored) over Tier 3 (generated). If a relevant image exists in the knowledge base, it is served directly. Generation is a fallback for when no stored image fits.

**Knowledge base images:**
- Stored in the `knowledge_base` table with `type: "image"` and a reference to the file in object storage (Supabase Storage)
- Tagged with metadata (topic, description, alt text) for retrieval matching
- Business owners upload and manage images through the dashboard knowledge base editor

**Dashboard controls:**
- Upload/manage stored images in the knowledge base (all plans)
- Vision toggle — enable/disable visitor image uploads (requires paid add-on)
- Image generation toggle — enable/disable DALL-E generation (requires paid add-on)
- Budget cap for image generation (per conversation, daily, or monthly)

### What kAyphI Sells to Clients

The same chatbot architecture is the product kAyphI offers to other businesses:
1. **Custom knowledge base** — built from the client's website, docs, and business info (text + images)
2. **Embeddable widget** — drop-in script tag for any website
3. **Voice mode** — visitors can speak to the chatbot and hear responses in a configurable voice
4. **Multilingual** — auto-detects visitor language, responds in kind (text + voice)
5. **Image support** — serve stored images, understand visitor photos (vision), optionally generate images (DALL-E)
6. **Action configuration** — booking, lead capture, and custom actions per client
7. **Analytics dashboard** — conversation insights, common questions, conversion tracking

---

## Testing Architecture

### Current

| Type | Tool | Config | Location |
|------|------|--------|----------|
| Unit/Integration | Vitest + Testing Library | `vitest.config.ts` | `tests/*.test.ts(x)` |
| E2E | Playwright | `playwright.config.ts` | `tests/e2e/*.spec.ts` |

**Unit test files:**
- `tests/landing-page.test.tsx` — core copy, section order, nav items
- `tests/hero-media.test.tsx` — poster/video lazy-load, reduced motion, crossfade
- `tests/validations-auth.test.ts` — Zod schemas (login, signup), safeRedirect helper
- `tests/auth-forms.test.tsx` — login/signup form rendering, validation, submit flows (mocked Supabase)
- `tests/dashboard-stat-card.test.tsx` — StatCard renders label, value, and zero value
- `tests/dashboard-sidebar.test.tsx` — sidebar nav items, hrefs, logout button (mocked motion/navigation/Supabase)
- `tests/validations-settings.test.ts` — profile schema (name length, trim, avatar URL HTTPS-only)

**E2E test files:**
- `tests/e2e/landing.spec.ts` — landing page smoke tests
- `tests/e2e/auth.spec.ts` — auth page rendering, validation, navigation, redirect protection
- `tests/e2e/dashboard.spec.ts` — dashboard auth redirect, placeholder page routing

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
| `next.config.ts` | Next.js config (typed, reactStrictMode only) |
| `components.json` | shadcn/ui configuration |
| `postcss.config.js` | PostCSS plugins (Tailwind + Autoprefixer) |
| `vitest.config.ts` | Vitest test runner config |
| `playwright.config.ts` | Playwright E2E config |
| `.eslintrc.json` | ESLint extends `next/core-web-vitals` |

---

## Environment Variables

Defined in `.env.example` (committed). Copy to `.env.local` and fill in real values.

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (required for Phase E)
OPENAI_API_KEY=your-openai-key
```

`NEXT_PUBLIC_` prefixed variables are exposed to the browser.
`SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` are server-only — never sent to the client.

---

## Invariants

1. **Auth before data (protected routes).** All dashboard/admin API routes verify auth via `getUser()`. Public routes (`/api/chat`, `POST /api/bookings`) use IP-based rate limiting instead.
2. **RLS always on.** Every table has row-level security. Public tables allow constrained public access (INSERT for visitor chats/bookings, SELECT for knowledge retrieval). No `service_role` queries in user-facing code.
3. **Typed content.** All marketing copy flows through `LandingPageContent` — no hardcoded strings in components.
4. **Component composition.** Sections compose primitives (`GlassCard`, `SectionShell`, etc.) — no one-off styling.
5. **Server-only secrets.** `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` never appear in client bundles.
6. **Domain-aware responses.** The chatbot answers from knowledge base context (Tier 1), general domain knowledge in the business's own personality and tone (Tier 2), or politely declines off-topic questions (Tier 3). It never fabricates business-specific claims (e.g., inventing pricing, staff names, or policies not in the KB).
