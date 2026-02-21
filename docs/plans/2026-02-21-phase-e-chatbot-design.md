# Phase E: Core Chatbot — Design

**Date:** 2026-02-21
**Status:** Approved
**Prerequisites:** Phase D complete (PR #13), Supabase project with all 8 migrations applied

---

## Scope

Phase E as defined in the full product plan has 11 sub-sections. This design covers the **core chatbot loop only** — enough to get a working end-to-end chatbot on the marketing site:

| Included | Deferred |
|----------|----------|
| E.1 OpenAI client | E.5 Action system |
| E.2 Knowledge base RAG + system prompt | E.6 Booking system |
| E.3 Public chat API (streaming) | E.8 Voice mode |
| E.7 Chat widget (text only) | E.9 Multilingual support |
| E.11 Dashboard chat management (basic) | E.10 Image capabilities |
| KB seed script from landing content | E.5b Information capture |
| Knowledge base CRUD API | Chatbot config panel (personality, model) |

Deferred features will be layered on in follow-up phases after the core is stable.

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | Core chatbot only | Get end-to-end working first, layer features later |
| Chat model | `gpt-4o-mini` | Cheap, fast, sufficient for KB-powered chatbot |
| Embedding model | `text-embedding-3-small` | 1536 dimensions matches existing `vector(1536)` column |
| Rate limiting | In-memory token bucket (30/min per IP) | Simple, works for single-process; upgrade to Redis later |
| Conversation ownership | `KAYPHI_OWNER_USER_ID` env var | Single-tenant; multi-tenant support comes later |
| Supabase client for API | Plain anon client (no cookies) | Public API route has no auth session |
| Vector search | Postgres RPC function | Supabase JS client doesn't support pgvector operators natively |
| Widget placement | Marketing page only | Dashboard users manage the chatbot, not use it |
| Dashboard chat scope | Conversations viewer + KB editor | Config panel (personality, model selection) deferred |
| KB seeding | Auto-seed from `landing.ts` content | Chatbot works immediately after setup |
| Widget streaming | `useChat()` from `ai/react` | Handles streaming, message state, submit automatically |

---

## 1. Dependencies & OpenAI Client

**New dependencies (both pre-approved):**
- `ai` — Vercel AI SDK (`streamText()`, `useChat()`, message types, streaming protocol)
- `openai` — OpenAI provider for Vercel AI SDK + direct API for embeddings

**`src/lib/openai/client.ts`:**
- Exports an OpenAI provider instance configured with `OPENAI_API_KEY`
- Default model: `gpt-4o-mini`
- Embedding model: `text-embedding-3-small` (1536 dimensions)

**New environment variables (server-only):**
- `OPENAI_API_KEY` — already in `.env.example`
- `KAYPHI_OWNER_USER_ID` — the business owner's Supabase user ID. The chat API needs this to associate visitor conversations with the business owner (since visitors have no auth session). Single-tenant for now.

---

## 2. Knowledge Base Infrastructure

### RAG Retrieval (`src/lib/chatbot/knowledge.ts`)

`retrieveChunks(query: string, userId: string, topK = 5)`:
1. Embed the query using `text-embedding-3-small`
2. Call the `match_knowledge_base` Postgres RPC function with the embedding, user ID, and match count
3. Return `{ title: string, content: string, similarity: number }[]`

### Vector Search RPC (`supabase/migrations/009_match_knowledge_base.sql`)

```sql
CREATE FUNCTION match_knowledge_base(
  query_embedding vector(1536),
  match_user_id UUID,
  match_count INT DEFAULT 5
) RETURNS TABLE (id UUID, title TEXT, content TEXT, similarity FLOAT)
AS $$
  SELECT id, title, content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE user_id = match_user_id AND type = 'text' AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE sql STABLE;
```

### System Prompt Builder (`src/lib/chatbot/system-prompt.ts`)

`buildSystemPrompt(businessName: string, chunks: RetrievedChunk[])` constructs the system prompt with:
- Business identity ("You are the AI assistant for {businessName}")
- Retrieved knowledge base context (injected chunks)
- Three-tier response rules:
  - Tier 1: Answer from KB context (grounded, highest confidence)
  - Tier 2: Answer using general domain knowledge in the business's voice (no hedging)
  - Tier 3: Politely decline off-topic questions, redirect to services
- Behavioral constraints: never proactively suggest actions, never fabricate business-specific claims
- Default tone: professional, semi-formal, balanced verbosity (hardcoded; configurable later)

### KB Seed Script (`src/lib/chatbot/seed.ts`)

Reads from `src/content/landing.ts` and produces ~15-20 knowledge base entries:
- Services (4 entries — one per service card)
- Pricing (3 entries — one per plan with features)
- Process (3 entries — one per step)
- FAQ (5 entries — one per Q&A pair)
- Case studies (3 entries — one per project)
- Company overview (1-2 entries — hero subtitle, comparison features)

For each entry: generates embedding via OpenAI, inserts into `knowledge_base` with owner's `user_id`.

Run as: `npx tsx src/lib/chatbot/seed.ts`

---

## 3. Public Chat API (`src/app/api/chat/route.ts`)

**POST handler — public, no auth required.**

Request body (Zod-validated):
```typescript
{
  messages: Array<{ role: 'user' | 'assistant', content: string }>,
  conversationId?: string
}
```

Flow:
1. **Rate limit** — in-memory token bucket keyed by IP (`x-forwarded-for` header or `"unknown"`). 30 requests/minute per IP. Returns 429 with `Retry-After` header on breach.
2. **Validate** — Zod schema on request body. 400 on failure.
3. **Conversation** — if `conversationId` provided, use it. Otherwise create new (INSERT into `conversations` with `user_id = KAYPHI_OWNER_USER_ID`, title from first user message truncated to 80 chars). Return `conversationId` in `x-conversation-id` response header.
4. **Persist user message** — INSERT into `messages` (role: 'user', content, conversation_id).
5. **RAG retrieval** — embed latest user message, retrieve top-5 chunks.
6. **Build system prompt** — inject business identity + chunks + three-tier rules.
7. **Stream response** — `streamText()` with `gpt-4o-mini`, system prompt, full message history. Return `toDataStreamResponse()`.
8. **On completion** — persist assistant message (role: 'assistant', content, tokens_used).

### Rate Limiter (`src/lib/rate-limit.ts`)

In-memory `Map<string, { tokens: number, lastRefill: number }>`:
- 30 tokens max, refill 1 token per 2 seconds
- `checkRateLimit(ip: string): { allowed: boolean, retryAfter?: number }`
- Not persistent across restarts — acceptable for single-process Next.js

### Anon Supabase Client (`src/lib/supabase/anon.ts`)

Plain `createClient` from `@supabase/supabase-js` (not the SSR cookie-based client). No auth session — relies on public INSERT RLS policies on `conversations` and `messages`. Used exclusively by public API routes.

---

## 4. Chat Widget

**Components under `src/components/chat/`:**

### `ChatWidget.tsx` — main widget container

- Floating circle button: `fixed bottom-6 right-6 z-50` with `MessageSquare` icon
- Click expands to chat panel (400px wide, 500px tall desktop; full-width bottom sheet on mobile)
- Glass-card aesthetic: `bg-panel/90 backdrop-blur border border-white/75 rounded-panel shadow-plate`
- Panel sections: header ("kAyphI Assistant" + close button), scrollable message area, input bar
- State: `open` boolean, `conversationId` persisted in `sessionStorage`
- Uses `useChat()` hook from `ai/react` — handles streaming, message state, submit
- Custom `fetch` in `useChat` to pass `conversationId` in body and read `x-conversation-id` from response headers
- `"use client"` component

### `ChatBubble.tsx` — individual message

- User messages: right-aligned, `bg-ink text-white rounded-2xl`
- Assistant messages: left-aligned, `bg-white/80 text-ink rounded-2xl` with small kAyphI logo mark
- Typing indicator: three animated dots while `isLoading` is true

### `ChatInput.tsx` — input bar

- Textarea with auto-resize, placeholder "Ask me anything..."
- Enter to send, Shift+Enter for newline
- Send button (arrow icon) — disabled while streaming (`isLoading`)

### Placement

Added to `src/app/(marketing)/page.tsx` — rendered after `FooterSection`, outside the `<main>` content flow. Only appears on the marketing page.

---

## 5. Knowledge Base API & Dashboard Chat Management

### Knowledge Base API (`src/app/api/knowledge/route.ts`)

All handlers require auth via `getUser()` (401 if no session).

| Method | Purpose | Body |
|--------|---------|------|
| GET | List all KB entries for the user | Query params: `type` optional filter |
| POST | Create entry (generates embedding) | `{ title, content, type: 'text' }` |
| PATCH | Update entry (re-generates embedding if content changed) | `{ id, title?, content? }` |
| DELETE | Delete entry | `{ id }` |

Zod validation on all request bodies. Embedding generation on create/update is server-side — the client never touches embeddings.

### Dashboard Chat Page (`src/app/dashboard/chat/page.tsx`)

Replace the placeholder with a two-tab layout:

**Tab 1: Conversations**
- Server component fetches conversation list (title, created_at, message count)
- Click a conversation → client-side panel shows messages (fetched from `messages` table)
- Read-only — business owner views visitor chats, no reply capability yet
- Empty state: "No conversations yet. Visitors will appear here once they start chatting."

**Tab 2: Knowledge Base**
- Lists all KB entries (title, content preview, created_at)
- Add button → inline form with title + content fields
- Edit/delete per entry with confirmation
- All CRUD calls go through `/api/knowledge`
- Empty state: "No knowledge base entries. Run the seed script or add entries manually."

Tab switching uses `layoutId` sliding indicator pattern (consistent with sidebar).

### New Dashboard Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ConversationList` | `src/components/dashboard/ConversationList.tsx` | Conversation list with title + date |
| `ConversationDetail` | `src/components/dashboard/ConversationDetail.tsx` | Message thread viewer (client) |
| `KnowledgeBaseEditor` | `src/components/dashboard/KnowledgeBaseEditor.tsx` | KB CRUD list + form (client) |

---

## 6. Validation Schemas

| File | Schemas |
|------|---------|
| `src/lib/validations/chat.ts` | `chatRequestSchema` — messages array (role + content), optional conversationId |
| `src/lib/validations/knowledge.ts` | `createKBEntrySchema`, `updateKBEntrySchema`, `deleteKBEntrySchema` |

---

## 7. Testing

### Unit tests
- `tests/rate-limit.test.ts` — allows under limit, blocks over limit, refills over time
- `tests/system-prompt.test.ts` — includes business name, injects chunks, includes three-tier rules
- `tests/validations-chat.test.ts` — valid messages, rejects empty, rejects missing fields
- `tests/knowledge-api.test.ts` — knowledge base schemas (create, update, delete validation)

### E2E tests
- `tests/e2e/chat-widget.spec.ts` — bubble visible on landing, click opens panel, input present, close works
- `tests/e2e/dashboard-chat.spec.ts` — unauthenticated redirect for `/dashboard/chat`

### Not tested in this phase
- Actual OpenAI API calls (requires mocking or test key)
- Full streaming chat flow (requires Supabase + OpenAI running)
- Embedding generation in seed script

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/openai/client.ts` | Create | OpenAI provider configuration |
| `src/lib/chatbot/knowledge.ts` | Create | RAG retrieval (embed + pgvector search) |
| `src/lib/chatbot/system-prompt.ts` | Create | Dynamic system prompt builder |
| `src/lib/chatbot/seed.ts` | Create | KB seed script from landing content |
| `src/lib/supabase/anon.ts` | Create | Plain Supabase client for public API routes |
| `src/lib/rate-limit.ts` | Create | In-memory token bucket rate limiter |
| `src/lib/validations/chat.ts` | Create | Zod schemas for chat API |
| `src/lib/validations/knowledge.ts` | Create | Zod schemas for knowledge API |
| `supabase/migrations/009_match_knowledge_base.sql` | Create | pgvector similarity search RPC |
| `src/app/api/chat/route.ts` | Create | Public streaming chat endpoint |
| `src/app/api/knowledge/route.ts` | Create | Protected KB CRUD endpoint |
| `src/app/dashboard/chat/page.tsx` | Replace | Two-tab management UI |
| `src/components/chat/ChatWidget.tsx` | Create | Floating chat widget |
| `src/components/chat/ChatBubble.tsx` | Create | Message bubble |
| `src/components/chat/ChatInput.tsx` | Create | Chat input bar |
| `src/components/dashboard/ConversationList.tsx` | Create | Conversation list viewer |
| `src/components/dashboard/ConversationDetail.tsx` | Create | Message thread viewer |
| `src/components/dashboard/KnowledgeBaseEditor.tsx` | Create | KB CRUD interface |
| `src/app/(marketing)/page.tsx` | Modify | Add ChatWidget import |
| `ARCHITECTURE.md` | Modify | Update for Phase E |
