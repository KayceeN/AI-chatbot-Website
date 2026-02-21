# Full Product Extension Plan

**Date:** 2026-02-14
**Status:** Approved (pending implementation)
**Prerequisites:** Visual audit complete, DESIGN.md and ARCHITECTURE.md created

This plan extends the kAyphI marketing site into a full AI automation platform with a public-facing chatbot widget (knowledge base + voice + multilingual + booking), authentication, workflow automation, and analytics.

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
2. **002_create_conversations.sql** — chat conversation containers (public INSERT for visitor chats)
3. **003_create_messages.sql** — individual chat messages (public INSERT for visitor messages)
4. **004_create_knowledge_base.sql** — knowledge base documents + vector embeddings (pgvector); public SELECT for chatbot retrieval, owner CRUD
5. **005_create_bookings.sql** — appointment bookings (public INSERT for visitors, owner management)
6. **006_create_workflows.sql** — workflow definitions
7. **007_create_workflow_runs.sql** — workflow execution history
8. **008_create_analytics_events.sql** — event log

Each migration includes:
- Table creation with appropriate types and constraints
- RLS enable statement
- RLS policies: `auth.uid() = user_id` for owner operations; public INSERT/SELECT where noted above
- Indexes on foreign keys and frequently queried columns
- pgvector extension enabled in migration 004 for embedding storage

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

## Phase E: AI Chatbot (Public-Facing Widget + Knowledge Base)

The chatbot is kAyphI's core product. It is a **public-facing** widget embedded on the marketing site — no login required for visitors. It answers questions using a business knowledge base and can perform actions like booking appointments. The same chatbot architecture is what kAyphI sells to other businesses.

### E.1: OpenAI Client

**`src/lib/openai/client.ts`:**
- OpenAI client configured with `OPENAI_API_KEY`
- Default model: `gpt-4o-mini` (configurable per deployment)

### E.2: Knowledge Base Infrastructure

**`src/lib/chatbot/knowledge.ts`:**
- Retrieval function: given a user message, find top-K relevant knowledge chunks via embedding similarity
- Uses Supabase pgvector for vector storage and similarity search
- Chunking utility: split source documents into overlapping chunks (~500 tokens each)

**`src/lib/chatbot/system-prompt.ts`:**
- Builds the system prompt dynamically from:
  1. Business identity (name, services, tone)
  2. Retrieved knowledge base context (RAG results)
  3. Available actions the chatbot can perform
  4. Guardrails (only answer from provided context, do not fabricate claims)

**`src/content/knowledge-base.ts`:**
- Default knowledge base for kAyphI's own site (seeded from landing page content: services, pricing, process, FAQ, case studies)
- Used to populate the `knowledge_base` table on first deployment

**Database — `knowledge_base` table:**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to profiles (business owner) |
| title | text | Document/chunk title |
| content | text | Raw text content |
| embedding | vector(1536) | OpenAI text-embedding-3-small output |
| source | text | Origin (e.g., "landing-page", "uploaded", "manual") |
| metadata | jsonb | Extra info (section, URL, date, etc.) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

RLS: public SELECT (chatbot retrieval), owner INSERT/UPDATE/DELETE.

### E.3: Chat API Route (Public)

**`/api/chat/route.ts`:**
1. **No auth required** — this is a visitor-facing endpoint
2. **Validation:** Zod schema for request body:
   - `messages`: array of `{ role, content }` — required
   - `conversation_id`: uuid — optional (creates new if absent)
3. **Rate limiting:** Token bucket per IP (in-memory Map for MVP)
   - 30 requests per minute per IP
   - Return 429 with retry-after header if exceeded
4. **Input sanitization:** Strip potential injection patterns before sending to OpenAI
5. **RAG retrieval:** Embed user message → query knowledge_base for top-K chunks → inject into system prompt
6. **Streaming:** Use Vercel AI SDK `streamText()` for streaming response
7. **Action detection:** Parse assistant response for action intents (booking, contact, navigation)
8. **Persistence:** Save visitor message and assistant response to `messages` table
9. **Token tracking:** Record `tokens_used` from OpenAI response metadata
10. **Analytics:** Log `chat.message_sent` event

### E.4: Chatbot Admin API (Protected)

**`/api/chat/admin/route.ts`:**
- `GET` — retrieve chatbot configuration (system prompt overrides, model, behavior settings)
- `POST/PATCH` — update chatbot configuration
- Auth required via `getUser()`

### E.5: Action System (Extensible)

**`src/lib/chatbot/actions.ts`:**
- Action registry pattern — each action has a name, description, trigger detection, and handler
- LLM uses function calling or structured output to signal action intent

**MVP actions:**

| Action | Trigger | Effect |
|--------|---------|--------|
| `book_appointment` | Visitor asks to schedule a call/demo | Surface inline BookingCalendar, create booking via `/api/bookings` |
| `collect_contact` | Visitor wants to be contacted | Capture name + email, store as lead |
| `capture_info` | Visitor shares business needs, preferences, or feedback | Store structured data for the business to review/act on later |
| `navigate_section` | Visitor asks about a section/feature | Return section anchor for client-side scroll |

### E.5b: Information Capture System

The chatbot continuously captures **actionable information** from conversations for the business to act on later:

- **Lead data** — name, email, company, role, expressed needs
- **Intent signals** — which services the visitor is interested in, budget indicators, timeline
- **Questions asked** — common visitor questions (reveals knowledge gaps, FAQ opportunities)
- **Feedback** — complaints, feature requests, product impressions
- **Conversation summaries** — auto-generated summary of each conversation for quick business review

Captured data is stored as structured `analytics_events` (event_type: `chat.lead_captured`, `chat.info_captured`, `chat.feedback_received`, etc.) and displayed in the dashboard with filtering, search, and export capabilities.

**Future actions (post-MVP):**
- Lead qualification (BANT questions)
- Human handoff (live chat escalation)
- Support ticket creation
- Trigger automated workflows
- External calendar sync (Google Calendar, Calendly)
- CRM sync (push captured leads/info to Salesforce, HubSpot, etc.)

### E.6: Booking System

**`/api/bookings/route.ts`:**
- `POST` (public) — visitor creates a booking (name, email, date, time, notes)
- `GET` (auth) — owner views all bookings
- `PATCH` (auth) — owner confirms/reschedules/cancels
- `DELETE` (auth) — owner cancels booking

**Database — `bookings` table:**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to profiles (business owner receiving the booking) |
| visitor_name | text | |
| visitor_email | text | |
| date | date | Appointment date |
| time | time | Appointment time |
| timezone | text | Visitor's timezone |
| notes | text | Optional context from visitor |
| status | text | pending/confirmed/cancelled/completed |
| created_at | timestamptz | |

RLS: public INSERT, owner SELECT/UPDATE/DELETE.

### E.7: Chat Widget UI (Public — Marketing Site)

**`src/components/chat/ChatWidget.tsx`:**
- Floating chat bubble (bottom-right corner)
- Click to expand into a chat panel
- No auth required — works for any visitor
- Persists conversation in sessionStorage for page navigation continuity

**`src/components/chat/ChatBubble.tsx`:**
- Individual message bubble with avatar (bot avatar for assistant, generic for visitor)
- Typing indicator animation while streaming

**`src/components/chat/ChatInput.tsx`:**
- Text input with send button
- Enter to send, Shift+Enter for newline
- Quick reply chips surfaced contextually by the chatbot

**`src/components/chat/BookingCalendar.tsx`:**
- Inline date/time picker triggered by booking action
- Shows available slots
- Submits to `/api/bookings`

**`src/components/chat/QuickReplyChip.tsx`:**
- Suggested response buttons (e.g., "Book a demo", "See pricing", "Learn more about chatbots")

### E.8: Voice Mode

The chatbot supports **voice conversations** — visitors speak to it and hear responses in a configurable voice.

**Speech-to-Text (input):**
- Primary: Browser Web Speech API (`SpeechRecognition`) for zero-latency, zero-cost recognition
- Fallback/upgrade: OpenAI Whisper API for higher accuracy and broader language support
- Microphone button in ChatInput toggles voice recording
- Transcribed text sent as a regular chat message

**Text-to-Speech (output):**
- OpenAI TTS API (`tts-1` model) with selectable voices (alloy, echo, fable, onyx, nova, shimmer)
- Business owners configure default voice in dashboard
- Assistant responses streamed as audio and played inline
- Optional: display text transcript alongside audio playback

**Components:**
- `VoiceButton` — microphone toggle in ChatInput (records → transcribes → sends)
- `AudioPlayer` — inline audio playback for assistant voice responses

**Graceful degradation:** Falls back to text-only if browser lacks Web Speech API support or visitor denies microphone access.

### E.9: Multilingual Support

The chatbot communicates in **multiple languages** — text and voice.

**Auto-detection:**
- Detect visitor language from their first message (LLM-based detection or lightweight library like `franc`)
- System prompt instructs LLM to respond in the detected language
- Knowledge base content is used as-is; the LLM translates at response time

**Optional translated knowledge base:**
- Business owners can provide knowledge base entries in multiple languages for higher quality
- Language-tagged entries are preferred when available for the detected language

**Voice language adaptation:**
- Whisper API supports 50+ languages for speech-to-text
- TTS voice selection adapts to detected language (language-appropriate voice)

**Language selector widget:**
- Optional UI dropdown in the chat widget header
- Visitor can manually override auto-detected language
- Persisted in sessionStorage for the session

### E.10: Dashboard Chat Management (Protected)

**`src/app/(dashboard)/chat/page.tsx`:**
- View all visitor conversations (read-only)
- Knowledge base editor — add/edit/delete knowledge base documents
- Chatbot configuration — system prompt overrides, model selection, voice selection, language settings, behavior toggles
- Preview panel — test the chatbot with current knowledge base

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
- `chat.message_sent` — when a visitor sends a chat message
- `chat.conversation_created` — when a new visitor conversation starts
- `chat.lead_captured` — when visitor provides contact info (name, email, company)
- `chat.info_captured` — when visitor shares business needs, preferences, or actionable details
- `chat.feedback_received` — when visitor provides feedback or feature requests
- `chat.booking_created` — when a booking is made through the chatbot
- `chat.voice_used` — when visitor uses voice mode
- `chat.language_detected` — when a non-default language is detected
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
| `src/app/(dashboard)/chat/page.tsx` | E | Chat management (knowledge base, config, conversation viewer) |
| `src/app/(dashboard)/workflows/page.tsx` | F | Workflow builder |
| `src/app/(dashboard)/analytics/page.tsx` | G | Analytics dashboard |
| `src/app/(dashboard)/settings/page.tsx` | D | Settings page |
| `src/app/api/chat/route.ts` | E | Public chatbot API (no auth, visitor-facing) |
| `src/app/api/chat/admin/route.ts` | E | Chatbot config management (auth required) |
| `src/app/api/bookings/route.ts` | E | Appointment booking CRUD (public POST, auth for management) |
| `src/app/api/knowledge/route.ts` | E | Knowledge base document CRUD (auth required) |
| `src/app/api/workflows/route.ts` | F | Workflow CRUD API |
| `src/app/api/workflows/run/route.ts` | F | Workflow execution API |
| `src/app/api/analytics/route.ts` | G | Analytics API |
| `src/lib/openai/client.ts` | E | OpenAI client |
| `src/lib/chatbot/knowledge.ts` | E | Knowledge base retrieval (RAG pipeline) |
| `src/lib/chatbot/actions.ts` | E | Extensible action registry (booking, contact, navigate) |
| `src/lib/chatbot/system-prompt.ts` | E | Dynamic system prompt builder |
| `src/content/knowledge-base.ts` | E | Default kAyphI knowledge base seed data |
| `src/components/chat/ChatWidget.tsx` | E | Floating chat widget (public, marketing site) |
| `src/components/chat/ChatBubble.tsx` | E | Message bubble component |
| `src/components/chat/ChatInput.tsx` | E | Chat text input with send + quick replies |
| `src/components/chat/BookingCalendar.tsx` | E | Inline appointment picker |
| `src/components/chat/QuickReplyChip.tsx` | E | Suggested response buttons |
| `src/components/chat/VoiceButton.tsx` | E | Microphone toggle for voice input |
| `src/components/chat/AudioPlayer.tsx` | E | Inline audio playback for voice responses |
| `src/lib/analytics/track.ts` | G | Event tracking |
| `supabase/migrations/*.sql` | B | Database schema (8 migrations) |
| `Dockerfile` | B | Container config |
| `docker-compose.yml` | B | Local dev stack |
| `.env.example` | B | Environment template |

### Existing files to modify

| File | Phase | Change |
|------|-------|--------|
| `src/content/landing.ts` | A | Add Comparison + Team content types and data |
| `src/app/page.tsx` | A/E | Add Comparison + Team sections; add ChatWidget to layout |
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
| `src/app/layout.tsx` | B/E | Update metadata, add providers, mount ChatWidget globally |
