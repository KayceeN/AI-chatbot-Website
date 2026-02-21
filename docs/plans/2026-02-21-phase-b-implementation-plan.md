# Phase B: Infrastructure Setup — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up the infrastructure foundation — upgrade Next.js, add Supabase, write DB migrations, restructure routes — so Phases C–G can build on top.

**Architecture:** Monolithic Next.js 15 (App Router) + hosted Supabase (auth, Postgres, RLS). No Docker. Dependencies installed only as needed per phase.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Motion (formerly Framer Motion), Supabase, Zod, shadcn/ui (config only)

**Design Doc:** `docs/plans/2026-02-21-phase-b-infrastructure-design.md`

---

## Task 1: Create Feature Branch

**Step 1: Create and checkout branch**

```bash
git checkout -b feat/phase-b-infrastructure
```

**Step 2: Verify clean state**

```bash
git status
```

Expected: clean working tree (untracked Videos/ is fine).

---

## Task 2: Upgrade Next.js 15 + React 19

**Files:**
- Modify: `package.json`

**Step 1: Upgrade core packages**

```bash
npm install next@15 react@19 react-dom@19
```

**Step 2: Upgrade dev dependencies for React 19 + Next.js 15**

```bash
npm install -D @types/react@19 @types/react-dom@19 eslint-config-next@15
```

**Step 3: Verify package.json**

Confirm `next` is 15.x, `react`/`react-dom` are 19.x, `eslint-config-next` matches.

Do NOT run build/typecheck yet — framer-motion imports will break until Task 3.

---

## Task 3: Migrate framer-motion to motion

**Files:**
- Modify: `package.json` (dependency swap)
- Modify: `src/lib/motion.ts:1` (type import)
- Modify: `src/components/layout/TopNav.tsx:5`
- Modify: `src/components/sections/BenefitsSection.tsx:3`
- Modify: `src/components/sections/ComparisonSection.tsx:3`
- Modify: `src/components/sections/FAQSection.tsx:4`
- Modify: `src/components/sections/FeaturesSection.tsx:3`
- Modify: `src/components/sections/HeroSection.tsx:3`
- Modify: `src/components/sections/PricingSection.tsx:4`
- Modify: `src/components/sections/ProcessSection.tsx:3`
- Modify: `src/components/sections/ProjectsSection.tsx:4`
- Modify: `src/components/sections/ServicesSection.tsx:3`
- Modify: `src/components/sections/TeamSection.tsx:4`
- Modify: `src/components/ui/Reveal.tsx:3`

**Step 1: Swap packages**

```bash
npm uninstall framer-motion && npm install motion
```

**Step 2: Update all imports**

In every file listed above, change:
```typescript
// Before:
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import type { Variants } from "framer-motion";

// After:
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import type { Variants } from "motion/react";
```

The exact imports vary per file — only change the module specifier from `"framer-motion"` to `"motion/react"`. Named imports stay the same.

Complete list (13 files):

| File | Current import | New import |
|------|---------------|------------|
| `src/lib/motion.ts:1` | `import type { Variants } from "framer-motion"` | `import type { Variants } from "motion/react"` |
| `src/components/layout/TopNav.tsx:5` | `import { motion, useMotionValueEvent, useScroll } from "framer-motion"` | `import { motion, useMotionValueEvent, useScroll } from "motion/react"` |
| `src/components/sections/BenefitsSection.tsx:3` | `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `src/components/sections/ComparisonSection.tsx:3` | `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `src/components/sections/FAQSection.tsx:4` | `import { motion, AnimatePresence } from "framer-motion"` | `import { motion, AnimatePresence } from "motion/react"` |
| `src/components/sections/FeaturesSection.tsx:3` | `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `src/components/sections/HeroSection.tsx:3` | `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `src/components/sections/PricingSection.tsx:4` | `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `src/components/sections/ProcessSection.tsx:3` | `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `src/components/sections/ProjectsSection.tsx:4` | `import { motion, AnimatePresence } from "framer-motion"` | `import { motion, AnimatePresence } from "motion/react"` |
| `src/components/sections/ServicesSection.tsx:3` | `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `src/components/sections/TeamSection.tsx:4` | `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `src/components/ui/Reveal.tsx:3` | `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |

---

## Task 4: Fix Next.js 15 Breaking Changes

**Files:**
- Modify: `next.config.mjs` → rename to `next.config.ts`
- Modify: `src/app/layout.tsx` (if needed — check async params)
- Modify: `.eslintrc.json` (if ESLint flat config needed)

**Step 1: Convert next.config.mjs to next.config.ts**

Delete `next.config.mjs`, create `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

**Step 2: Check page/layout components for params usage**

In Next.js 15, `params` and `searchParams` props are async Promises. Check if any page or layout uses them.

Current state: `src/app/page.tsx` does not use params. `src/app/layout.tsx` only destructures `children`. No changes needed here.

**Step 3: Check ESLint compatibility**

Next.js 15 supports both `.eslintrc.json` (legacy) and `eslint.config.mjs` (flat config). The existing `.eslintrc.json` with `extends: ["next/core-web-vitals"]` should continue working. If `npm run lint` fails, migrate to flat config.

---

## Task 5: Verify Upgrade

**Step 1: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

**Step 2: Run lint**

```bash
npm run lint
```

Expected: 0 errors.

**Step 3: Run unit tests**

```bash
npm run test
```

Expected: all tests pass. If motion import mocking fails, update `tests/setup.tsx` to mock `motion/react` instead of `framer-motion`.

**Step 4: Run build**

```bash
npm run build
```

Expected: successful build.

**Step 5: Run e2e tests**

```bash
npm run test:e2e
```

Expected: all tests pass.

**Troubleshooting:**
- If tests fail on motion mocks: add `vi.mock("motion/react", ...)` to `tests/setup.tsx`
- If build fails on Tailwind: check `postcss.config.js` compatibility with Next.js 15 (may need to rename to `postcss.config.mjs`)
- If ESLint fails: migrate `.eslintrc.json` to `eslint.config.mjs` with `@next/eslint-plugin-next`

---

## Task 6: Commit Upgrade

```bash
git add -A
git commit -m "feat: upgrade Next.js 15 + React 19, migrate framer-motion to motion"
```

---

## Task 7: Install Phase B Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Supabase + Zod**

```bash
npm install @supabase/supabase-js @supabase/ssr zod
```

**Step 2: Verify install**

```bash
npm run typecheck
```

Expected: no errors (packages installed but not yet imported).

---

## Task 8: Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Modify: `src/lib/utils.ts` (add `cn` helper)
- Modify: `tailwind.config.ts` (shadcn may add CSS variable config)
- Modify: `src/styles/globals.css` (shadcn may add CSS variable layer)

**Step 1: Run shadcn init**

```bash
npx shadcn@latest init
```

When prompted, select:
- Style: Default
- Base color: Neutral (or Zinc — closest to our monochrome palette)
- CSS variables: Yes
- TypeScript: Yes
- Path alias for components: `@/components`
- Path alias for utils: `@/lib/utils`

**Step 2: Merge utils.ts**

shadcn creates its own `src/lib/utils.ts` with the `cn` helper. Our existing file has a `clamp` function. After init, ensure both exist in the same file:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
```

**Note on transitive dependencies:** shadcn init installs `clsx` and `tailwind-merge` as direct dependencies. These are standard utility packages bundled with the pre-approved shadcn/ui init process. Documented here per SECURITY.md dependency tracking requirements.

**Step 3: Review tailwind.config.ts changes**

shadcn init may modify `tailwind.config.ts` to add CSS variable references. Review the diff to ensure our existing custom tokens (`canvas`, `ink`, `muted`, `panel`, shadow tokens, `rounded-panel`) are preserved. If shadcn overwrote them, restore them manually.

**Step 4: Review globals.css changes**

shadcn init adds a `@layer base` block with CSS variable definitions. Ensure our existing styles (body background, orb-rings, .field class) are preserved.

**Step 5: Verify**

```bash
npm run typecheck && npm run build && npm run test
```

Expected: all pass. shadcn init should not break existing code.

---

## Task 9: Commit Dependencies + shadcn Init

```bash
git add -A
git commit -m "feat: install Supabase, Zod; initialize shadcn/ui config"
```

---

## Task 10: Create Environment Files

**Files:**
- Create: `.env.example`
- Verify: `.gitignore` already excludes `.env` and `.env*.local`

**Step 1: Create .env.example**

```env
# Supabase (required — get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (required for Phase E)
OPENAI_API_KEY=your-openai-key
```

**Step 2: Verify .gitignore**

Confirm `.gitignore` contains:
```
.env
.env*.local
```

Current `.gitignore` already has these lines — no changes needed.

---

## Task 11: Create Supabase Browser Client

**Files:**
- Create: `src/lib/supabase/client.ts`

**Step 1: Write the client**

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes (env vars are typed via `!` assertion).

---

## Task 12: Create Supabase Server Client

**Files:**
- Create: `src/lib/supabase/server.ts`

**Step 1: Write the server client**

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
```

Note: `cookies()` is async in Next.js 15 — hence the `await`.

**Step 2: Verify typecheck**

```bash
npm run typecheck
```

---

## Task 13: Commit Environment + Supabase Clients

```bash
git add .env.example src/lib/supabase/client.ts src/lib/supabase/server.ts
git commit -m "feat: add Supabase client setup and .env.example"
```

---

## Task 14: Database Migration — Profiles

**Files:**
- Create: `supabase/migrations/001_create_profiles.sql`

```sql
-- Profiles table extending auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Owner can read and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

## Task 15: Database Migration — Conversations

**Files:**
- Create: `supabase/migrations/002_create_conversations.sql`

```sql
-- Conversations table (chat sessions)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Public INSERT for visitor chats.
-- Access pattern: visitors never access Supabase directly. The /api/chat route
-- (Phase E) uses the anon-role server client to create conversations, providing
-- the business owner's user_id. WITH CHECK (true) is needed because the API
-- route operates without an auth session (anon role, auth.uid() = null).
CREATE POLICY "Anyone can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (true);

-- Owner can read, update, delete their conversations
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.conversations FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

## Task 16: Database Migration — Messages

**Files:**
- Create: `supabase/migrations/003_create_messages.sql`

```sql
-- Messages table (individual chat messages)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  language TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public INSERT for visitor messages (same access pattern as conversations —
-- the /api/chat route inserts on behalf of visitors using the anon role).
CREATE POLICY "Anyone can create messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);

-- Owner can read messages in their conversations
CREATE POLICY "Users can view messages in own conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );
```

---

## Task 17: Database Migration — Knowledge Base

**Files:**
- Create: `supabase/migrations/004_create_knowledge_base.sql`

```sql
-- Enable pgvector extension for embedding storage
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base table (documents + embeddings for RAG retrieval)
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image')),
  title TEXT NOT NULL,
  content TEXT,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_knowledge_base_user_id ON public.knowledge_base(user_id);

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Public SELECT for chatbot retrieval (visitors can query the KB).
-- TODO(Phase E): For multi-tenant deployment, scope this to per-business-owner
-- rows or replace with an RPC function that filters by business context.
-- Current single-tenant use (kAyphI's own site) is acceptable — KB content is
-- public info (services, pricing, FAQ visible on the marketing site).
CREATE POLICY "Anyone can read knowledge base entries"
  ON public.knowledge_base FOR SELECT
  USING (true);

-- Owner CRUD
CREATE POLICY "Users can insert own knowledge base entries"
  ON public.knowledge_base FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own knowledge base entries"
  ON public.knowledge_base FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own knowledge base entries"
  ON public.knowledge_base FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

## Task 18: Database Migration — Bookings

**Files:**
- Create: `supabase/migrations/005_create_bookings.sql`

```sql
-- Bookings table (appointments from chatbot or /book page)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_date ON public.bookings(date);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public INSERT for visitor bookings (same access pattern — /api/bookings route
-- inserts on behalf of visitors using the anon role, providing the business
-- owner's user_id).
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Owner can read, update, delete their bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

## Task 19: Database Migration — Workflows

**Files:**
- Create: `supabase/migrations/006_create_workflows.sql`

```sql
-- Workflows table (automation definitions)
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  trigger_type TEXT NOT NULL DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'scheduled', 'webhook')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workflows_user_id ON public.workflows(user_id);

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- Owner only
CREATE POLICY "Users can view own workflows"
  ON public.workflows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workflows"
  ON public.workflows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows"
  ON public.workflows FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows"
  ON public.workflows FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

## Task 20: Database Migration — Workflow Runs

**Files:**
- Create: `supabase/migrations/007_create_workflow_runs.sql`

```sql
-- Workflow runs table (execution history)
CREATE TABLE IF NOT EXISTS public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed')),
  input JSONB,
  output JSONB,
  error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_workflow_runs_workflow_id ON public.workflow_runs(workflow_id);

ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;

-- Owner can read/delete runs for their workflows
CREATE POLICY "Users can view runs for own workflows"
  ON public.workflow_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create runs for own workflows"
  ON public.workflow_runs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete runs for own workflows"
  ON public.workflow_runs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );
```

---

## Task 21: Database Migration — Analytics Events

**Files:**
- Create: `supabase/migrations/008_create_analytics_events.sql`

```sql
-- Analytics events table (event log)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Owner only
CREATE POLICY "Users can view own analytics events"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## Task 22: Commit Migrations + Environment

```bash
git add .env.example src/lib/supabase/ supabase/
git commit -m "feat: add database migrations (8 tables) with RLS policies"
```

---

## Task 23: Route Group Restructure

**Files:**
- Move: `src/app/page.tsx` → `src/app/(marketing)/page.tsx`
- Create: `src/app/(auth)/` (empty directory — placeholder)
- Create: `src/app/(dashboard)/` (empty directory — placeholder)

**Step 1: Create route group directories**

```bash
mkdir -p src/app/\(marketing\) src/app/\(auth\) src/app/\(dashboard\)
```

**Step 2: Move landing page**

```bash
git mv src/app/page.tsx src/app/\(marketing\)/page.tsx
```

**Step 3: Verify the site still works**

```bash
npm run build
```

Expected: successful build. The URL `/` still serves the landing page because `(marketing)` is a route group (no URL impact).

**Step 4: Run tests**

```bash
npm run test && npm run test:e2e
```

Expected: all pass — components haven't changed, only the page file moved.

---

## Task 24: Final Verification

Run the full verification suite:

```bash
npm run lint && npm run typecheck && npm run build && npm run test && npm run test:e2e
```

Expected: all 5 commands pass with zero errors.

---

## Task 25: Commit Route Restructure + Final

```bash
git add -A
git commit -m "feat: restructure routes into (marketing), (auth), (dashboard) groups"
```

---

## Task 26: Update Project Docs

**Files:**
- Modify: `ARCHITECTURE.md` — update "Current" tech stack table to reflect Next.js 15, React 19, Motion 12.x
- Modify: `DESIGN.md` — update motion system reference from "Framer Motion" to "Motion"
- Modify: `tasks/todo.md` — check off Phase B items

**Step 1: Update ARCHITECTURE.md tech stack**

In the "Current (Phase 0)" table, update:
- Next.js → 15.x
- React → 19.x
- Animation → Motion 12.x (note: renamed from Framer Motion)

Move Supabase, Zod, shadcn/ui from "Planned" to "Current" with appropriate status.

**Step 2: Update DESIGN.md**

Change references from "Framer Motion" to "Motion" in the Motion System section.

**Step 3: Update tasks/todo.md**

Check off completed Phase B items:
- [x] Upgrade Next.js 14 → 15
- [x] Install pre-approved dependencies (Supabase, Zod)
- [x] Initialize shadcn/ui
- [x] Create `.env.example` with all placeholder keys
- [-] ~~Add Dockerfile and docker-compose.yml~~ (deferred — no Docker needed)
- [x] Set up Supabase clients
- [x] Database migrations (8 tables)
- [x] RLS policies

**Step 4: Commit**

```bash
git add ARCHITECTURE.md DESIGN.md tasks/todo.md
git commit -m "docs: update architecture and design docs for Phase B completion"
```

---

## Task 27: Push + Create PR

```bash
git push -u origin feat/phase-b-infrastructure
```

Then create PR:

```bash
gh pr create --title "Phase B: Infrastructure Setup" --body "$(cat <<'EOF'
## Summary
- Upgrade Next.js 14 → 15 + React 18 → 19
- Migrate framer-motion → motion (React 19 compat)
- Install @supabase/supabase-js, @supabase/ssr, zod
- Initialize shadcn/ui (config only, no components)
- Add Supabase browser + server clients
- Create 8 database migration files with RLS policies
- Restructure routes into (marketing), (auth), (dashboard) groups
- Add .env.example

## Tables created (SQL only — apply via Supabase dashboard)
- profiles, conversations, messages, knowledge_base (pgvector)
- bookings, workflows, workflow_runs, analytics_events

## Test plan
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] `npm run test` passes
- [ ] `npm run test:e2e` passes
- [ ] Landing page still renders at `/`
- [ ] No framer-motion imports remain

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
