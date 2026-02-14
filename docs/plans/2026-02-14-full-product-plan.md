# Full Product Extension Plan

**Date:** 2026-02-14
**Status:** Approved (pending implementation)
**Prerequisites:** Visual audit complete, DESIGN.md and ARCHITECTURE.md created

This plan extends the OrbAI marketing site into a full SaaS product with authentication, AI chatbot, workflow automation, and analytics.

---

## Dependency Approval Gate

All new dependencies listed below were pre-approved by the user during the brainstorming session on 2026-02-14. Any additional dependencies discovered during implementation require explicit approval per SECURITY.md before installation.

**Pre-approved:**
- `@supabase/supabase-js` — Supabase client
- `@supabase/ssr` — Supabase SSR helpers for Next.js
- `ai` — Vercel AI SDK (streaming)
- `openai` — OpenAI client
- `recharts` — Chart library
- `react-hook-form` — Form state management
- `@hookform/resolvers` — Zod resolver for RHF
- `zod` — Schema validation
- `lucide-react` — SVG icon library

**shadcn/ui** components are copied into the project via CLI (`npx shadcn-ui init`), not installed as a dependency.

---

## Phase A: Fix Visual Gaps

Fix all gaps identified in the [visual audit](2026-02-14-visual-audit.md). Ordered by priority.

### P0 — Missing Functionality
1. **Add Comparison section** ("Precision vs Basic")
   - New file: `src/components/sections/ComparisonSection.tsx`
   - Side-by-side cards comparing "ORB AI" vs "Others" with feature bullets
   - CTA button in the ORB AI card
   - Add to `sectionOrder` in `src/content/landing.ts`
   - Add content type and data to `LandingPageContent`
   - Wire into `src/app/page.tsx`

2. **Add Team section** ("Team Behind Success")
   - New file: `src/components/sections/TeamSection.tsx`
   - 3 team member cards with name, role, social icons, portrait image
   - Carousel navigation (left/right arrows)
   - Add to `sectionOrder`, content type, and page composition

3. **Replace gradient placeholders** with substitute images
   - Source: Unsplash or AI-generated images matching reference aesthetic
   - Store in `public/images/` directory
   - Update all section components to use `<Image>` from `next/image`
   - Affected files: HeroSection, BenefitsSection, FeaturesSection, ServicesSection, ProcessSection, ProjectsSection, CustomersSection, FooterSection

### P1 — Missing Interactions & Icons
4. **FAQ accordion animation**
   - Add `AnimatePresence` + `motion.div` with auto-height measurement
   - Smooth expand/collapse with easing
   - File: `src/components/sections/FAQSection.tsx`

5. **Scroll-based nav hide/show**
   - Use Framer Motion `useScroll` + `useMotionValueEvent`
   - Hide on scroll down, reveal on scroll up
   - File: `src/components/layout/TopNav.tsx`

6. **Replace all text/emoji icons with Lucide React**
   - CTA arrows: `ArrowUpRight` in `ActionButton.tsx`
   - FAQ chevrons: `ChevronDown`/`ChevronUp` in `FAQSection.tsx`
   - Section badges: contextual icons in `SectionHeading.tsx` / `BadgePill.tsx`
   - Contact icons: `Mail`, `Phone` in `ContactSection.tsx`

7. **Customer star ratings and avatars**
   - Add 5-star row above each mini-testimonial
   - Add circular avatar placeholders with names
   - File: `src/components/sections/CustomersSection.tsx`

8. **Footer social icons and copyright**
   - Add X (Twitter), Instagram, Link icons
   - Add "ORBAI (c) 2025. Designed by FrameBase" copyright line
   - File: `src/components/sections/FooterSection.tsx`

### P2 — Polish
9. **Pricing toggle slide animation**
   - Animated indicator sliding between Monthly/Yearly
   - File: `src/components/sections/PricingSection.tsx`

10. **Services interactive mockup illustrations**
    - CSS/SVG approximations of the reference mockups
    - Content generation UI, chatbot interface, workflow diagram
    - File: `src/components/sections/ServicesSection.tsx`

11. **3D orb enhancement**
    - Improve CSS rings to approximate a 3D sphere
    - Options: CSS radial gradients, canvas animation, or SVG
    - Files: `src/styles/globals.css`, potentially new `OrbVisual` component

---

## Phase B: Infrastructure Setup

### Next.js Upgrade
- Upgrade `next` from 14.2.5 to 15.x
- Upgrade `react` and `react-dom` to 19.x (required by Next.js 15)
- Update `eslint-config-next` to match
- Run `npm run typecheck && npm run build && npm run test` after upgrade
- Fix any breaking changes (async params in page/layout, etc.)

### Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr ai openai recharts react-hook-form @hookform/resolvers zod lucide-react
```

### Initialize shadcn/ui
```bash
npx shadcn-ui@latest init
```
- Select Tailwind CSS, TypeScript, path alias `@/components/ui`
- Install base components: Button, Input, Textarea, Select, Dialog, Toast, Tabs, Avatar, Badge, Card

### Environment Setup
Create `.env.example`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-key
```

### Docker Setup
Create `Dockerfile` and `docker-compose.yml`:
- Next.js app container (dev mode with hot reload via volume mount)
- Supabase local development stack (or connection to hosted Supabase)
- Environment variables via `.env` file
- Port mapping: configurable, documented in docker-compose.yml

### Supabase Client Setup

**Browser client** (`src/lib/supabase/client.ts`):
- Uses `createBrowserClient` from `@supabase/ssr`
- Configured with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Server client** (`src/lib/supabase/server.ts`):
- Uses `createServerClient` from `@supabase/ssr`
- Reads cookies from `next/headers`
- Uses anon key with user session for RLS enforcement

**Security:** The service role key is NEVER used in user-facing code. Server client uses the anon key with the user's session for RLS enforcement.

### Database Migrations

Create `supabase/migrations/` with SQL files:

1. **001_create_profiles.sql** — profiles table extending auth.users
2. **002_create_conversations.sql** — chat conversation containers
3. **003_create_messages.sql** — individual chat messages
4. **004_create_workflows.sql** — workflow definitions
5. **005_create_workflow_runs.sql** — workflow execution history
6. **006_create_analytics_events.sql** — event log

Each migration includes:
- Table creation with appropriate types and constraints
- RLS enable statement
- RLS policies: `auth.uid() = user_id` for SELECT, INSERT, UPDATE, DELETE
- Indexes on foreign keys and frequently queried columns

---

## Phase C: Auth System

### Supabase Auth Integration
- Email/password signup and login
- Google OAuth provider
- Email verification flow

### Auth Pages

**`src/app/(auth)/login/page.tsx`:**
- Email + password form (RHF + Zod validation)
- Google OAuth button
- Link to signup
- Error display for invalid credentials

**`src/app/(auth)/signup/page.tsx`:**
- Email + password + full name form
- Google OAuth button
- Link to login
- Password strength requirements

**`src/app/(auth)/callback/route.ts`:**
- OAuth callback handler
- Exchange code for session
- Redirect to dashboard

### Profile Auto-Creation
- Supabase database trigger on `auth.users` INSERT
- Creates corresponding `profiles` row with default values
- Sets `plan` to `"free"` by default

### Auth Middleware

**`src/middleware.ts`:**
```
For every request:
  1. Check if route matches (dashboard) paths
  2. If yes:
     a. Read Supabase session from cookies
     b. If no session -> redirect to /login
     c. If session expired -> attempt refresh
        - If refresh succeeds -> continue with new session
        - If refresh fails -> redirect to /login
     d. If valid session -> continue
  3. If route matches (auth) paths and user is already logged in:
     -> redirect to /chat (dashboard home)
```

### Per-Route Auth Verification
**Critical security requirement:** Each API route independently verifies auth via `createServerClient` + `getUser()`. Middleware is a convenience layer, not a security boundary.

---

## Phase D: Dashboard Shell

### Dashboard Layout

**`src/app/(dashboard)/layout.tsx`:**
- Sidebar navigation (left side)
- Top bar with user avatar and logout
- Main content area (right side)
- Responsive: sidebar collapses to hamburger menu on mobile

### Sidebar Navigation Items
- Chat (`/chat`) — `MessageSquare` icon
- Workflows (`/workflows`) — `Workflow` icon
- Analytics (`/analytics`) — `BarChart3` icon
- Settings (`/settings`) — `Settings` icon
- Logout action — `LogOut` icon

### Dashboard Overview Page

**`src/app/(dashboard)/page.tsx`:**
- Welcome message with user's name
- Summary stat cards (total chats, total workflows, success rate)
- Quick action buttons (New Chat, New Workflow)
- Recent activity feed

### Settings Page

**`src/app/(dashboard)/settings/page.tsx`:**
- Profile form (full name, avatar URL) with RHF + Zod validation
- Current plan display
- Account actions (change password, delete account)

---

## Phase E: AI Chatbot

### OpenAI Client

**`src/lib/openai/client.ts`:**
- OpenAI client configured with `OPENAI_API_KEY`
- Default model: `gpt-4o-mini` (configurable)
- System prompt for OrbAI assistant persona

### Chat API Route

**`/api/chat/route.ts`:**
1. **Auth:** Verify session via `getUser()` — reject 401 if invalid
2. **Validation:** Zod schema for request body:
   - `messages`: array of `{ role, content }` — required
   - `conversation_id`: uuid — optional (creates new if absent)
3. **Rate limiting:** Token bucket per user (in-memory Map for MVP)
   - 60 requests per minute per user
   - Return 429 with retry-after header if exceeded
4. **Input sanitization:** Strip potential injection patterns before sending to OpenAI
5. **Streaming:** Use Vercel AI SDK `streamText()` for streaming response
6. **Persistence:** Save user message and assistant response to `messages` table
7. **Token tracking:** Record `tokens_used` from OpenAI response metadata

### Chat UI

**`src/app/(dashboard)/chat/page.tsx`:**
- Left sidebar: conversation list (create, rename, delete)
- Main area: message thread with streaming display
- Bottom: chat input with send button
- Real-time updates via Supabase subscriptions (multi-tab sync)

### Components
- `ChatMessage` — renders user/assistant messages with avatar and timestamp
- `ChatInput` — textarea with send button, Enter to send, Shift+Enter for newline
- `ConversationList` — sidebar list with active state, rename, delete actions

---

## Phase F: Workflow Automation

### Workflow Builder UI

**`src/app/(dashboard)/workflows/page.tsx`:**
- List view: all workflows with name, status, last run
- Create/edit form (RHF + Zod validation):
  - Workflow name and description
  - Steps array (add/remove/reorder)
  - Trigger type selection (manual only for MVP)
- Run button for manual execution

### Step Types

| Type | Description | Input | Output |
|------|------------|-------|--------|
| `ai_summarize` | Summarize text using GPT | Text content | Summary text |
| `extract_data` | Extract structured data from text | Text + schema | JSON data |
| `content_generation` | Generate content from prompt | Prompt + parameters | Generated text |
| `email_draft` | Draft email from context | Subject + context | Email body |

### Workflow CRUD API

**`/api/workflows/route.ts`:**
- `GET` — list user's workflows
- `POST` — create workflow (Zod validated)
- `PATCH` — update workflow
- `DELETE` — soft delete (set `is_active = false`)
- All operations verify auth via `getUser()`

### Workflow Execution API

**`/api/workflows/run/route.ts`:**
1. **Auth:** Per-request session verification
2. **Idempotency:** Accept unique `run_id` in request — if already exists, return existing result
3. **Execution:** Sequential step processing
   - Per-step timeout: 30s default
   - Total workflow timeout: 5 minutes
   - Each step receives previous step's output as input
4. **Error handling:** Fail-fast on step error
   - Log error to `workflow_runs` with error detail
   - Set status to `failed`
   - Return partial results with error info
5. **Logging:** Create `workflow_runs` record with status tracking:
   - `pending` -> `running` -> `success` or `failed`
   - Record `started_at`, `completed_at`, `error`

### Future Considerations (not in MVP)
- Background job queue for scheduled/webhook triggers (Bull/BullMQ or Supabase Edge Functions)
- Parallel step execution
- Conditional branching
- Webhook trigger endpoint

---

## Phase G: Analytics Dashboard

### Event Logging

**`src/lib/analytics/track.ts`:**
```typescript
export async function trackEvent(
  userId: string,
  eventType: string,
  eventData?: Record<string, unknown>
): Promise<void>
```

Auto-tracked events:
- `chat.message_sent` — when user sends a chat message
- `chat.conversation_created` — when a new conversation starts
- `workflow.run_started` — when a workflow execution begins
- `workflow.run_completed` — when a workflow succeeds
- `workflow.run_failed` — when a workflow fails

### Analytics API

**`/api/analytics/route.ts`:**
1. **Auth:** Session verification
2. **Validation:** Zod schema for query parameters:
   - `start_date`: ISO date string — required
   - `end_date`: ISO date string — required
   - `event_type`: string — optional filter
   - `granularity`: `"day" | "week" | "month"` — defaults to `"day"`
3. **Aggregation:** SQL queries against `analytics_events` table
4. **Response:** Time-series data formatted for Recharts

### Analytics Dashboard Page

**`src/app/(dashboard)/analytics/page.tsx`:**
- Date range picker (last 7/30/90 days)
- Stat cards: total chats, total workflows, workflow success rate
- Line chart: messages over time
- Bar chart: workflow runs by status (success/failed)
- Area chart: usage trends

### Components
- `StatCard` — metric value + label + trend indicator
- Charts rendered with Recharts (`LineChart`, `BarChart`, `AreaChart`)

---

## Critical Files Summary

### New files to create

| File | Phase | Purpose |
|------|-------|---------|
| `src/components/sections/ComparisonSection.tsx` | A | Comparison section |
| `src/components/sections/TeamSection.tsx` | A | Team section |
| `src/lib/supabase/client.ts` | B | Browser Supabase client |
| `src/lib/supabase/server.ts` | B | Server Supabase client |
| `src/middleware.ts` | C | Auth route protection |
| `src/app/(auth)/login/page.tsx` | C | Login page |
| `src/app/(auth)/signup/page.tsx` | C | Signup page |
| `src/app/(auth)/callback/route.ts` | C | OAuth callback |
| `src/app/(dashboard)/layout.tsx` | D | Dashboard shell |
| `src/app/(dashboard)/page.tsx` | D | Dashboard overview |
| `src/app/(dashboard)/chat/page.tsx` | E | Chat interface |
| `src/app/(dashboard)/workflows/page.tsx` | F | Workflow builder |
| `src/app/(dashboard)/analytics/page.tsx` | G | Analytics dashboard |
| `src/app/(dashboard)/settings/page.tsx` | D | Settings page |
| `src/app/api/chat/route.ts` | E | Chat API |
| `src/app/api/workflows/route.ts` | F | Workflow CRUD API |
| `src/app/api/workflows/run/route.ts` | F | Workflow execution API |
| `src/app/api/analytics/route.ts` | G | Analytics API |
| `src/lib/openai/client.ts` | E | OpenAI client |
| `src/lib/analytics/track.ts` | G | Event tracking |
| `supabase/migrations/*.sql` | B | Database schema |
| `Dockerfile` | B | Container config |
| `docker-compose.yml` | B | Local dev stack |
| `.env.example` | B | Environment template |

### Existing files to modify

| File | Phase | Change |
|------|-------|--------|
| `src/content/landing.ts` | A | Add Comparison + Team content types and data |
| `src/app/page.tsx` | A | Add Comparison + Team sections to composition |
| `src/components/sections/FAQSection.tsx` | A | Add accordion animation |
| `src/components/layout/TopNav.tsx` | A | Add scroll hide/show |
| `src/components/ui/ActionButton.tsx` | A | Add arrow icons |
| `src/components/ui/BadgePill.tsx` | A | Support Lucide icons |
| `src/components/sections/CustomersSection.tsx` | A | Add star ratings + avatars |
| `src/components/sections/FooterSection.tsx` | A | Add social icons + copyright |
| `src/components/sections/PricingSection.tsx` | A | Add toggle slide animation |
| `package.json` | B | Add dependencies, upgrade Next.js |
| `tailwind.config.ts` | B/D | Add dashboard colors |
| `next.config.mjs` | B | Update for Next.js 15 |
| `src/app/layout.tsx` | B | Update metadata, add providers if needed |
