# kAyphI — AI Automation for Businesses

Marketing site and SaaS product for kAyphI. Features a public-facing AI chatbot widget powered by RAG (retrieval-augmented generation) and a dashboard for managing conversations, knowledge base, and settings.

## Tech Stack

- **Framework:** Next.js 15.5 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4 + Motion 12
- **Auth & DB:** Supabase (hosted) with RLS
- **AI:** Vercel AI SDK 6.x + OpenAI (GPT-4o-mini, text-embedding-3-small)
- **Forms:** React Hook Form + Zod 4
- **UI:** shadcn/ui primitives (Button, Input, Label)
- **Testing:** Vitest + Playwright

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Fill in Supabase + OpenAI credentials in .env.local

# Apply Supabase migrations (9 files in supabase/migrations/)
# Run each .sql file in your Supabase SQL Editor

# Seed the knowledge base (requires OPENAI_API_KEY + SUPABASE_SERVICE_ROLE_KEY)
npx tsx src/lib/chatbot/seed.ts

# Start dev server
npm run dev
```

## Environment Variables

| Variable | Required | Scope | Purpose |
|----------|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server | Service role key (seed script only) |
| `OPENAI_API_KEY` | Yes | Server | OpenAI API access |
| `KAYPHI_OWNER_USER_ID` | Yes | Server | Business owner's Supabase user ID |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright) |

## API Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/chat` | POST | No (IP rate-limited) | Public streaming chat with RAG |
| `/api/knowledge` | GET/POST/PATCH/DELETE | Yes | Knowledge base CRUD |

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for full details. Key directories:

- `src/app/(marketing)/` — Landing page
- `src/app/(auth)/` — Login, signup, callback
- `src/app/dashboard/` — Dashboard (overview, chat, settings)
- `src/app/api/` — API routes
- `src/components/chat/` — Chat widget (ChatWidget, ChatBubble, ChatInput)
- `src/components/dashboard/` — Dashboard components
- `src/lib/chatbot/` — RAG retrieval, system prompt, seed script
- `supabase/migrations/` — 9 migration files
