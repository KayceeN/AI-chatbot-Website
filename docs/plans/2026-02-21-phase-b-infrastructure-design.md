# Phase B: Infrastructure Setup — Design

**Date:** 2026-02-21
**Status:** Approved
**Prerequisites:** Phase A complete (PR #3), Chatbot Identity docs complete (PR #9)

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Supabase environment | Hosted (supabase.com) | Simpler setup, real dashboard, no local resource overhead |
| Docker | Deferred | No value containerizing only Next.js; add later if needed |
| Dependency install strategy | Phase B only | Install @supabase/supabase-js, @supabase/ssr, zod now; defer RHF, AI SDK, OpenAI, Recharts to their phases |
| shadcn/ui components | Init config only | No UI components installed; added on-demand starting Phase C |
| framer-motion | Migrate to `motion` v12+ | Required for React 19 compatibility; new package (approved by user) |

---

## 1. Next.js 15 + React 19 Upgrade

Upgrade the core framework and handle breaking changes.

**Version changes:**
- `next` 14.2.5 → 15.x (latest stable)
- `react` + `react-dom` 18.2.0 → 19.x
- `eslint-config-next` 14.2.5 → 15.x
- `@types/react` + `@types/react-dom` → latest for React 19
- `framer-motion` ^11.3.19 → uninstall, replace with `motion` ^12.x

**Breaking changes to handle:**
- All `framer-motion` imports → `motion/react` (motion.div, AnimatePresence, useScroll, useMotionValueEvent, layoutId, etc.)
- Next.js 15: `params` and `searchParams` are async Promises in page/layout
- `next.config.mjs` → `next.config.ts` (optional, recommended)
- Verify postcss/Tailwind compatibility

**Verification:** `npm run typecheck && npm run build && npm run test && npm run test:e2e`

---

## 2. Dependencies

Install Phase B dependencies only (all pre-approved 2026-02-14):

```bash
npm install @supabase/supabase-js @supabase/ssr zod
```

`motion` is installed as part of Section 1 (replacing framer-motion). `lucide-react` is already installed.

Deferred to later phases: `react-hook-form`, `@hookform/resolvers`, `ai`, `openai`, `recharts`.

---

## 3. shadcn/ui Initialization

Run `npx shadcn@latest init` to scaffold:
- `components.json` config (TypeScript, Tailwind, alias `@/components/ui`)
- `cn` helper in `src/lib/utils.ts` (merge with existing `clamp` function)
- Installs `clsx` + `tailwind-merge` as dependencies (bundled with shadcn init)

No UI components installed at this stage. Components added on-demand starting Phase C.

---

## 4. Environment Setup

**`.env.example`** (committed):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (Phase E)
OPENAI_API_KEY=your-openai-key
```

**`.env.local`** (gitignored, user fills in real keys from hosted Supabase project).

---

## 5. Supabase Clients

**Browser client — `src/lib/supabase/client.ts`:**
- `createBrowserClient` from `@supabase/ssr`
- Uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Server client — `src/lib/supabase/server.ts`:**
- `createServerClient` from `@supabase/ssr`
- Reads cookies via `next/headers`
- Uses anon key with user session for RLS enforcement

**Security invariant:** Service role key never used in user-facing code.

---

## 6. Database Migrations

8 SQL files in `supabase/migrations/`:

| File | Table | RLS Public Access |
|------|-------|-------------------|
| `001_create_profiles.sql` | profiles (extends auth.users) | None — owner only |
| `002_create_conversations.sql` | conversations | INSERT (visitor chats) |
| `003_create_messages.sql` | messages | INSERT (visitor messages) |
| `004_create_knowledge_base.sql` | knowledge_base + pgvector | SELECT (chatbot retrieval) |
| `005_create_bookings.sql` | bookings | INSERT (visitors book) |
| `006_create_workflows.sql` | workflows | None — owner only |
| `007_create_workflow_runs.sql` | workflow_runs | None — owner only |
| `008_create_analytics_events.sql` | analytics_events | None — owner only |

Each migration includes:
- Table creation with types and constraints
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- RLS policies (`auth.uid() = user_id` for owner ops; public INSERT/SELECT where noted)
- Indexes on foreign keys and frequently queried columns
- Migration 004 enables pgvector: `CREATE EXTENSION IF NOT EXISTS vector`

Column definitions sourced from `docs/plans/2026-02-14-ai-chatbot-website-design.md` + ARCHITECTURE.md additions (knowledge_base, bookings).

**Applying migrations:** Run via Supabase SQL Editor (dashboard) or `supabase db push`. No Supabase CLI dependency in the project.

---

## 7. Route Group Restructure

Move landing page into `(marketing)` route group:

```
src/app/
├── layout.tsx                    # Root layout (unchanged)
├── (marketing)/
│   └── page.tsx                  # Landing page (moved from src/app/page.tsx)
├── (auth)/                       # Empty — Phase C
└── (dashboard)/                  # Empty — Phase D
```

Route groups don't affect URLs — `/` still serves the landing page.

---

## Out of Scope

- Docker setup (deferred — no value for single Next.js app + hosted Supabase)
- shadcn/ui component installation (on-demand starting Phase C)
- RHF, AI SDK, OpenAI, Recharts (installed in their respective phases)
- Auth middleware (Phase C)
- Dashboard layout (Phase D)
