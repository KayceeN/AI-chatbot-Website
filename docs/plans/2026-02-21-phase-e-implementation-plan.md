# Phase E: Core Chatbot — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a working end-to-end chatbot — OpenAI-powered, knowledge-base-grounded, streaming on the marketing site, with dashboard management for conversations and KB entries.

**Architecture:** Public chat API (`/api/chat`) streams responses via Vercel AI SDK using RAG retrieval from pgvector-indexed knowledge base. A floating chat widget on the marketing page uses `useChat()` for real-time streaming. Dashboard provides read-only conversation viewing and KB CRUD via a protected `/api/knowledge` route.

**Tech Stack:** Vercel AI SDK v4 (`ai`, `@ai-sdk/openai`), Next.js 15 App Router, Supabase (pgvector, RLS), Zod, React Hook Form, Motion (tabs), Lucide React

---

### Task 1: Install Dependencies and Create OpenAI Client

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env.example`
- Create: `src/lib/openai/client.ts`

**Step 1: Install AI SDK packages**

```bash
npm install ai@^4.0.0 @ai-sdk/openai@^1.0.0
```

These are the Vercel AI SDK (v4) and its OpenAI provider. Both were pre-approved in the 2026-02-14 brainstorming session. Pin to v4 — v5+ has breaking API changes (`toDataStreamResponse()` renamed, field names changed).

**Step 2: Update `.env.example`**

Add after the existing `OPENAI_API_KEY` line:

```bash
# Business owner ID (required for Phase E — associates visitor chats with owner)
KAYPHI_OWNER_USER_ID=your-owner-supabase-user-id
```

**Step 3: Create OpenAI client**

Create `src/lib/openai/client.ts`:

```typescript
import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

**Step 4: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 5: Commit**

```bash
git add package.json package-lock.json .env.example src/lib/openai/client.ts
git commit -m "feat(phase-e): install AI SDK and create OpenAI client"
```

---

### Task 2: Create Rate Limiter with Tests

**Files:**
- Create: `src/lib/rate-limit.ts`
- Create: `tests/rate-limit.test.ts`

**Step 1: Write the failing tests**

Create `tests/rate-limit.test.ts`:

```typescript
import { describe, expect, test, vi, beforeEach } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test("allows requests under the limit", () => {
    const result = checkRateLimit("192.168.1.1");
    expect(result.allowed).toBe(true);
  });

  test("blocks requests over the limit", () => {
    const ip = "10.0.0.1";
    // Exhaust all 30 tokens
    for (let i = 0; i < 30; i++) {
      expect(checkRateLimit(ip).allowed).toBe(true);
    }
    // 31st should be blocked
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  test("refills tokens over time", () => {
    const ip = "172.16.0.1";
    // Exhaust all tokens
    for (let i = 0; i < 30; i++) {
      checkRateLimit(ip);
    }
    expect(checkRateLimit(ip).allowed).toBe(false);

    // Advance time by 4 seconds (should refill 2 tokens)
    vi.advanceTimersByTime(4000);

    expect(checkRateLimit(ip).allowed).toBe(true);
    expect(checkRateLimit(ip).allowed).toBe(true);
    expect(checkRateLimit(ip).allowed).toBe(false);
  });

  test("tracks different IPs independently", () => {
    const ip1 = "1.1.1.1";
    const ip2 = "2.2.2.2";
    // Exhaust ip1
    for (let i = 0; i < 30; i++) {
      checkRateLimit(ip1);
    }
    expect(checkRateLimit(ip1).allowed).toBe(false);
    // ip2 should still work
    expect(checkRateLimit(ip2).allowed).toBe(true);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/rate-limit.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/lib/rate-limit.ts`:

```typescript
const MAX_TOKENS = 30;
const REFILL_RATE = 1; // tokens per interval
const REFILL_INTERVAL_MS = 2000; // 1 token every 2 seconds

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

function refill(bucket: Bucket, now: number): void {
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL_MS) * REFILL_RATE;
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  let bucket = buckets.get(ip);

  if (!bucket) {
    bucket = { tokens: MAX_TOKENS, lastRefill: now };
    buckets.set(ip, bucket);
  }

  refill(bucket, now);

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return { allowed: true };
  }

  const retryAfter = Math.ceil(REFILL_INTERVAL_MS / 1000);
  return { allowed: false, retryAfter };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/rate-limit.test.ts`
Expected: 4 tests PASS

**Step 5: Commit**

```bash
git add src/lib/rate-limit.ts tests/rate-limit.test.ts
git commit -m "feat(phase-e): add in-memory token bucket rate limiter with tests"
```

---

### Task 3: Create Anon Supabase Client

**Files:**
- Create: `src/lib/supabase/anon.ts`

**Step 1: Create the anon client**

Create `src/lib/supabase/anon.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

// Plain Supabase client for public API routes (no auth session, no cookies).
// Uses the anon key — relies on RLS public INSERT policies.
export function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/lib/supabase/anon.ts
git commit -m "feat(phase-e): add anon Supabase client for public API routes"
```

---

### Task 4: Create Chat Validation Schema with Tests

**Files:**
- Create: `src/lib/validations/chat.ts`
- Create: `tests/validations-chat.test.ts`

**Step 1: Write the failing tests**

Create `tests/validations-chat.test.ts`:

```typescript
import { describe, expect, test } from "vitest";
import { chatRequestSchema } from "@/lib/validations/chat";

describe("chatRequestSchema", () => {
  test("accepts valid messages with no conversationId", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(result.success).toBe(true);
  });

  test("accepts valid messages with conversationId", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "user", content: "Hello" }],
      conversationId: "abc-123",
    });
    expect(result.success).toBe(true);
  });

  test("accepts multi-turn conversation", () => {
    const result = chatRequestSchema.safeParse({
      messages: [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" },
        { role: "user", content: "What services do you offer?" },
      ],
    });
    expect(result.success).toBe(true);
  });

  test("rejects empty messages array", () => {
    const result = chatRequestSchema.safeParse({ messages: [] });
    expect(result.success).toBe(false);
  });

  test("rejects message with invalid role", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "system", content: "hack" }],
    });
    expect(result.success).toBe(false);
  });

  test("rejects message with empty content", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "user", content: "" }],
    });
    expect(result.success).toBe(false);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/validations-chat.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/lib/validations/chat.ts`:

```typescript
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "Message cannot be empty"),
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1, "At least one message is required"),
  conversationId: z.string().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
```

**Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/validations-chat.test.ts`
Expected: 6 tests PASS

**Step 5: Commit**

```bash
git add src/lib/validations/chat.ts tests/validations-chat.test.ts
git commit -m "feat(phase-e): add chat request Zod schema with tests"
```

---

### Task 5: Create Knowledge Validation Schemas with Tests

**Files:**
- Create: `src/lib/validations/knowledge.ts`
- Create: `tests/validations-knowledge.test.ts`

**Step 1: Write the failing tests**

Create `tests/validations-knowledge.test.ts`:

```typescript
import { describe, expect, test } from "vitest";
import {
  createKBEntrySchema,
  updateKBEntrySchema,
  deleteKBEntrySchema,
} from "@/lib/validations/knowledge";

describe("createKBEntrySchema", () => {
  test("accepts valid entry", () => {
    const result = createKBEntrySchema.safeParse({
      title: "Pricing Plans",
      content: "We offer three tiers...",
    });
    expect(result.success).toBe(true);
  });

  test("rejects empty title", () => {
    const result = createKBEntrySchema.safeParse({
      title: "",
      content: "Some content",
    });
    expect(result.success).toBe(false);
  });

  test("rejects empty content", () => {
    const result = createKBEntrySchema.safeParse({
      title: "Title",
      content: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateKBEntrySchema", () => {
  test("accepts valid update with both fields", () => {
    const result = updateKBEntrySchema.safeParse({
      id: "abc-123",
      title: "Updated Title",
      content: "Updated content",
    });
    expect(result.success).toBe(true);
  });

  test("accepts update with title only", () => {
    const result = updateKBEntrySchema.safeParse({
      id: "abc-123",
      title: "Updated Title",
    });
    expect(result.success).toBe(true);
  });

  test("rejects without id", () => {
    const result = updateKBEntrySchema.safeParse({
      title: "Updated Title",
    });
    expect(result.success).toBe(false);
  });
});

describe("deleteKBEntrySchema", () => {
  test("accepts valid id", () => {
    const result = deleteKBEntrySchema.safeParse({ id: "abc-123" });
    expect(result.success).toBe(true);
  });

  test("rejects missing id", () => {
    const result = deleteKBEntrySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/validations-knowledge.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/lib/validations/knowledge.ts`:

```typescript
import { z } from "zod";

export const createKBEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
});

export const updateKBEntrySchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
  content: z.string().min(1, "Content is required").optional(),
});

export const deleteKBEntrySchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type CreateKBEntry = z.infer<typeof createKBEntrySchema>;
export type UpdateKBEntry = z.infer<typeof updateKBEntrySchema>;
export type DeleteKBEntry = z.infer<typeof deleteKBEntrySchema>;
```

**Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/validations-knowledge.test.ts`
Expected: 7 tests PASS

**Step 5: Commit**

```bash
git add src/lib/validations/knowledge.ts tests/validations-knowledge.test.ts
git commit -m "feat(phase-e): add knowledge base Zod schemas with tests"
```

---

### Task 6: Create pgvector Similarity Search RPC Migration

**Files:**
- Create: `supabase/migrations/009_match_knowledge_base.sql`

**Step 1: Create the migration**

Create `supabase/migrations/009_match_knowledge_base.sql`:

```sql
-- Vector similarity search function for RAG retrieval.
-- Called from src/lib/chatbot/knowledge.ts via supabase.rpc('match_knowledge_base', ...).
-- Returns top-K knowledge base entries ranked by cosine similarity to the query embedding.
CREATE OR REPLACE FUNCTION match_knowledge_base(
  query_embedding vector(1536),
  match_user_id UUID,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    knowledge_base.id,
    knowledge_base.title,
    knowledge_base.content,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE knowledge_base.user_id = match_user_id
    AND knowledge_base.type = 'text'
    AND knowledge_base.embedding IS NOT NULL
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

**Step 2: Apply the migration**

Apply via Supabase SQL Editor (paste the SQL and run) or `supabase db push` if using the CLI.

**Step 3: Commit**

```bash
git add supabase/migrations/009_match_knowledge_base.sql
git commit -m "feat(phase-e): add pgvector similarity search RPC function"
```

---

### Task 7: Create System Prompt Builder with Tests

**Files:**
- Create: `src/lib/chatbot/system-prompt.ts`
- Create: `tests/system-prompt.test.ts`

**Step 1: Write the failing tests**

Create `tests/system-prompt.test.ts`:

```typescript
import { describe, expect, test } from "vitest";
import { buildSystemPrompt } from "@/lib/chatbot/system-prompt";

describe("buildSystemPrompt", () => {
  test("includes business name", () => {
    const prompt = buildSystemPrompt("kAyphI", []);
    expect(prompt).toContain("kAyphI");
  });

  test("includes retrieved chunks", () => {
    const chunks = [
      { title: "Pricing", content: "We offer three plans.", similarity: 0.9 },
      { title: "Services", content: "AI consulting and chatbots.", similarity: 0.85 },
    ];
    const prompt = buildSystemPrompt("kAyphI", chunks);
    expect(prompt).toContain("We offer three plans.");
    expect(prompt).toContain("AI consulting and chatbots.");
  });

  test("includes three-tier response rules", () => {
    const prompt = buildSystemPrompt("kAyphI", []);
    expect(prompt).toContain("knowledge base");
    expect(prompt).toContain("off-topic");
  });

  test("includes behavioral constraints", () => {
    const prompt = buildSystemPrompt("kAyphI", []);
    expect(prompt).toContain("never proactively suggest");
    expect(prompt).toContain("never fabricate");
  });

  test("handles empty chunks", () => {
    const prompt = buildSystemPrompt("kAyphI", []);
    expect(prompt).toContain("No specific knowledge base context");
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/system-prompt.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/lib/chatbot/system-prompt.ts`:

```typescript
export interface RetrievedChunk {
  title: string;
  content: string;
  similarity: number;
}

export function buildSystemPrompt(
  businessName: string,
  chunks: RetrievedChunk[]
): string {
  const knowledgeSection =
    chunks.length > 0
      ? chunks
          .map((c) => `### ${c.title}\n${c.content}`)
          .join("\n\n")
      : "No specific knowledge base context available for this query.";

  return `You are the AI assistant for ${businessName}. You help visitors learn about the business, its services, and answer their questions.

## Your Knowledge Base

${knowledgeSection}

## Response Rules (Three-Tier)

1. **Knowledge base match**: If the visitor's question matches information in the knowledge base above, answer directly from that context. This is your highest-confidence response.

2. **Domain-relevant, no KB match**: If the question is related to the business domain (AI, automation, consulting, technology services) but not covered in the knowledge base, answer using your general knowledge. Speak in the same tone and personality as Tier 1 — do not hedge or add disclaimers like "generally speaking." You ARE the business assistant.

3. **Off-topic**: If the question is completely outside the business domain, politely decline and redirect. Example: "I'm here to help with questions about ${businessName}'s services! Is there anything about our AI solutions I can assist with?"

## Behavioral Constraints

- You must never proactively suggest or offer actions. Only respond to what the visitor asks.
- You must never fabricate business-specific claims (pricing numbers, staff names, policies) that are not in the knowledge base.
- Keep responses concise and helpful.
- Use a professional, semi-formal tone.
- Do not use emojis unless the visitor uses them first.`;
}
```

**Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/system-prompt.test.ts`
Expected: 5 tests PASS

**Step 5: Commit**

```bash
git add src/lib/chatbot/system-prompt.ts tests/system-prompt.test.ts
git commit -m "feat(phase-e): add system prompt builder with three-tier response rules"
```

---

### Task 8: Create RAG Retrieval Function

**Files:**
- Create: `src/lib/chatbot/knowledge.ts`

**Step 1: Create the retrieval function**

Create `src/lib/chatbot/knowledge.ts`:

```typescript
import { embed } from "ai";
import { openai } from "@/lib/openai/client";
import type { RetrievedChunk } from "./system-prompt";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function retrieveChunks(
  supabase: SupabaseClient,
  query: string,
  userId: string,
  topK = 5
): Promise<RetrievedChunk[]> {
  // Generate embedding for the query
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });

  // Query pgvector for similar chunks
  const { data, error } = await supabase.rpc("match_knowledge_base", {
    query_embedding: embedding,
    match_user_id: userId,
    match_count: topK,
  });

  if (error) {
    console.error("Knowledge retrieval error:", error.message);
    return [];
  }

  return (data ?? []) as RetrievedChunk[];
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/lib/chatbot/knowledge.ts
git commit -m "feat(phase-e): add RAG retrieval function with pgvector similarity search"
```

---

### Task 9: Create Knowledge Base Seed Script

**Files:**
- Create: `src/lib/chatbot/seed.ts`

This script reads from `src/content/landing.ts` and populates the knowledge_base table with embeddings.

**Step 1: Create the seed script**

Create `src/lib/chatbot/seed.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";
import { embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { landingContent } from "../content/landing";

// Direct client creation — this runs as a standalone script, not in Next.js.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface SeedEntry {
  title: string;
  content: string;
}

function extractEntries(): SeedEntry[] {
  const entries: SeedEntry[] = [];

  // Company overview
  entries.push({
    title: "About kAyphI",
    content: `${landingContent.brand} — ${landingContent.hero.subtitle}. ${landingContent.hero.quote}`,
  });

  // Services
  for (const card of landingContent.services.cards) {
    entries.push({
      title: `Service: ${card.title}`,
      content: card.body,
    });
  }

  // Pricing plans
  for (const plan of landingContent.pricing.plans) {
    entries.push({
      title: `Pricing: ${plan.name} Plan`,
      content: `${plan.blurb}. Monthly: ${plan.monthly}. Yearly: ${plan.yearly}. Features: ${plan.features.join(", ")}.`,
    });
  }

  // Process steps
  for (const step of landingContent.process.steps) {
    entries.push({
      title: `Process Step ${step.id}: ${step.title}`,
      content: step.body,
    });
  }

  // FAQ
  for (const faq of landingContent.faq.entries) {
    entries.push({
      title: `FAQ: ${faq.question}`,
      content: faq.answer,
    });
  }

  // Case studies
  for (const study of landingContent.projects.caseStudies) {
    const metrics = study.metrics.map((m) => `${m.value} ${m.label}`).join(", ");
    entries.push({
      title: `Case Study: ${study.title}`,
      content: `${study.body} Results: ${metrics}.`,
    });
  }

  // Comparison (what makes kAyphI different)
  entries.push({
    title: "Why Choose kAyphI Over Competitors",
    content: `kAyphI offers: ${landingContent.comparison.us.features.join(", ")}. Unlike competitors who rely on: ${landingContent.comparison.others.features.join(", ")}.`,
  });

  // Contact info
  const emailCard = landingContent.contact.infoCards.find((c) => c.title === "Email");
  if (emailCard) {
    entries.push({
      title: "Contact Information",
      content: `${emailCard.body} Email: ${emailCard.linkLabel}`,
    });
  }

  return entries;
}

async function seed() {
  const ownerId = process.env.KAYPHI_OWNER_USER_ID;
  if (!ownerId) {
    console.error("KAYPHI_OWNER_USER_ID is required");
    process.exit(1);
  }

  const entries = extractEntries();
  console.log(`Extracted ${entries.length} entries from landing content`);

  // Generate embeddings in batch
  console.log("Generating embeddings...");
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: entries.map((e) => `${e.title}\n${e.content}`),
  });

  // Insert into knowledge_base
  console.log("Inserting into knowledge_base...");
  const rows = entries.map((entry, i) => ({
    user_id: ownerId,
    type: "text" as const,
    title: entry.title,
    content: entry.content,
    embedding: JSON.stringify(embeddings[i]),
    metadata: {},
  }));

  const { error } = await supabase.from("knowledge_base").insert(rows);

  if (error) {
    console.error("Insert error:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} knowledge base entries`);
}

seed();
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors (the script uses direct imports, not Next.js)

**Step 3: Commit**

```bash
git add src/lib/chatbot/seed.ts
git commit -m "feat(phase-e): add knowledge base seed script from landing content"
```

**Note:** To run the seed script after deployment: `npx tsx src/lib/chatbot/seed.ts`. Requires `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and `KAYPHI_OWNER_USER_ID` in the environment. The service role key bypasses RLS for bulk insert.

---

### Task 10: Create Public Chat API Route

**Files:**
- Create: `src/app/api/chat/route.ts`

**Step 1: Create the route handler**

Create `src/app/api/chat/route.ts`:

```typescript
import { streamText } from "ai";
import { openai } from "@/lib/openai/client";
import { createAnonClient } from "@/lib/supabase/anon";
import { checkRateLimit } from "@/lib/rate-limit";
import { chatRequestSchema } from "@/lib/validations/chat";
import { retrieveChunks } from "@/lib/chatbot/knowledge";
import { buildSystemPrompt } from "@/lib/chatbot/system-prompt";
import { headers } from "next/headers";

const OWNER_ID = process.env.KAYPHI_OWNER_USER_ID!;

export async function POST(req: Request) {
  // 1. Rate limit
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return new Response("Too many requests", {
      status: 429,
      headers: { "Retry-After": String(rateCheck.retryAfter) },
    });
  }

  // 2. Validate request body
  const body = await req.json();
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, conversationId: existingConvId } = parsed.data;
  const supabase = createAnonClient();

  // 3. Create or reuse conversation
  let conversationId = existingConvId;
  if (!conversationId) {
    const firstUserMsg = messages.find((m) => m.role === "user");
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 80)
      : "New conversation";

    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .insert({ user_id: OWNER_ID, title })
      .select("id")
      .single();

    if (convError) {
      return new Response(JSON.stringify({ error: "Failed to create conversation" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    conversationId = conv.id;
  }

  // 4. Persist user message
  const lastUserMsg = messages[messages.length - 1];
  if (lastUserMsg?.role === "user") {
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: lastUserMsg.content,
    });
  }

  // 5. RAG retrieval
  const lastUserContent = lastUserMsg?.content ?? "";
  const chunks = await retrieveChunks(supabase, lastUserContent, OWNER_ID);

  // 6. Build system prompt
  const systemPrompt = buildSystemPrompt("kAyphI", chunks);

  // 7. Stream response
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    onFinish: async ({ text, usage }) => {
      // 8. Persist assistant message
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: text,
        tokens_used: usage?.completionTokens ?? null,
      });
    },
  });

  const response = result.toDataStreamResponse();

  // Add conversation ID header so the widget can persist it
  response.headers.set("x-conversation-id", conversationId!);

  return response;
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat(phase-e): add public streaming chat API with RAG and rate limiting"
```

---

### Task 11: Create ChatBubble Component

**Files:**
- Create: `src/components/chat/ChatBubble.tsx`

**Step 1: Create the component**

Create `src/components/chat/ChatBubble.tsx`:

```tsx
interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-ink px-4 py-2.5 text-sm text-white">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {/* Bot avatar — kAyphI logo mark */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink">
        <span className="relative inline-flex h-3 w-3 items-center justify-center">
          <span className="absolute h-1.5 w-1.5 -translate-x-[3px] rotate-45 rounded-sm bg-white" />
          <span className="absolute h-1.5 w-1.5 translate-x-[3px] rotate-45 rounded-sm bg-white" />
        </span>
      </div>
      <div className="max-w-[80%] rounded-2xl bg-white/80 px-4 py-2.5 text-sm text-ink">
        {content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink">
        <span className="relative inline-flex h-3 w-3 items-center justify-center">
          <span className="absolute h-1.5 w-1.5 -translate-x-[3px] rotate-45 rounded-sm bg-white" />
          <span className="absolute h-1.5 w-1.5 translate-x-[3px] rotate-45 rounded-sm bg-white" />
        </span>
      </div>
      <div className="flex items-center gap-1 rounded-2xl bg-white/80 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
      </div>
    </div>
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/chat/ChatBubble.tsx
git commit -m "feat(phase-e): add ChatBubble and TypingIndicator components"
```

---

### Task 12: Create ChatInput Component

**Files:**
- Create: `src/components/chat/ChatInput.tsx`

**Step 1: Create the component**

Create `src/components/chat/ChatInput.tsx`:

```tsx
"use client";

import { useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [input]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const form = e.currentTarget.form;
        if (form) form.requestSubmit();
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-white/50 p-3">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        rows={1}
        disabled={isLoading}
        className="flex-1 resize-none rounded-xl bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-white transition-opacity disabled:opacity-30"
        aria-label="Send message"
      >
        <SendHorizonal className="h-4 w-4" />
      </button>
    </form>
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/chat/ChatInput.tsx
git commit -m "feat(phase-e): add ChatInput with auto-resize and Enter-to-send"
```

---

### Task 13: Create ChatWidget and Add to Marketing Page

**Files:**
- Create: `src/components/chat/ChatWidget.tsx`
- Modify: `src/app/(marketing)/page.tsx`

**Step 1: Create the chat widget**

Create `src/components/chat/ChatWidget.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { MessageSquare, X } from "lucide-react";
import { ChatBubble, TypingIndicator } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Restore conversation ID from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("kayphi-conversation-id");
    if (stored) setConversationId(stored);
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: { conversationId },
      onResponse: (response) => {
        const newId = response.headers.get("x-conversation-id");
        if (newId && newId !== conversationId) {
          setConversationId(newId);
          sessionStorage.setItem("kayphi-conversation-id", newId);
        }
      },
    });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-button transition-transform hover:scale-105"
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[400px] flex-col overflow-hidden rounded-panel border border-white/75 bg-panel/90 shadow-plate backdrop-blur max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink">
                <span className="relative inline-flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-1.5 w-1.5 -translate-x-[3px] rotate-45 rounded-sm bg-white" />
                  <span className="absolute h-1.5 w-1.5 translate-x-[3px] rotate-45 rounded-sm bg-white" />
                </span>
              </div>
              <span className="text-sm font-semibold text-ink">kAyphI Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-muted transition-colors hover:text-ink"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="py-8 text-center text-sm text-muted">
                <p className="mb-1 font-medium text-ink">
                  Hi! I&apos;m the kAyphI assistant.
                </p>
                <p>Ask me about our services, pricing, or how we can help your business.</p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role as "user" | "assistant"}
                content={msg.content}
              />
            ))}
            {isLoading &&
              messages[messages.length - 1]?.role === "user" && (
                <TypingIndicator />
              )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            input={input}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  );
}
```

**Step 2: Add the widget to the marketing page**

In `src/app/(marketing)/page.tsx`, add the import at the top:

```tsx
import { ChatWidget } from "@/components/chat/ChatWidget";
```

And add `<ChatWidget />` after the closing `</main>` tag, just before the final `);`:

```tsx
      <FooterSection content={landingContent.footer} />
    </main>
    <ChatWidget />
  );
```

**Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 4: Commit**

```bash
git add src/components/chat/ChatWidget.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(phase-e): add ChatWidget on marketing page with streaming chat"
```

---

### Task 14: Create Knowledge Base API Route

**Files:**
- Create: `src/app/api/knowledge/route.ts`

**Step 1: Create the route handler**

Create `src/app/api/knowledge/route.ts`:

```typescript
import { embed } from "ai";
import { openai } from "@/lib/openai/client";
import { createClient } from "@/lib/supabase/server";
import {
  createKBEntrySchema,
  updateKBEntrySchema,
  deleteKBEntrySchema,
} from "@/lib/validations/knowledge";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("knowledge_base")
    .select("id, title, content, type, created_at, updated_at")
    .eq("user_id", user.id)
    .eq("type", "text")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(req: Request) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = createKBEntrySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Generate embedding
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: `${parsed.data.title}\n${parsed.data.content}`,
  });

  const { data, error } = await supabase
    .from("knowledge_base")
    .insert({
      user_id: user.id,
      type: "text",
      title: parsed.data.title,
      content: parsed.data.content,
      embedding: JSON.stringify(embedding),
    })
    .select("id, title, content, created_at")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = updateKBEntrySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.content !== undefined) updates.content = parsed.data.content;

  // Re-generate embedding if content changed
  if (parsed.data.content !== undefined || parsed.data.title !== undefined) {
    // Fetch current entry to build full embedding text
    const { data: current } = await supabase
      .from("knowledge_base")
      .select("title, content")
      .eq("id", parsed.data.id)
      .eq("user_id", user.id)
      .single();

    if (current) {
      const title = parsed.data.title ?? current.title;
      const content = parsed.data.content ?? current.content;
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: `${title}\n${content}`,
      });
      updates.embedding = JSON.stringify(embedding);
    }
  }

  const { data, error } = await supabase
    .from("knowledge_base")
    .update(updates)
    .eq("id", parsed.data.id)
    .eq("user_id", user.id)
    .select("id, title, content, updated_at")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function DELETE(req: Request) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = deleteKBEntrySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { error } = await supabase
    .from("knowledge_base")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/api/knowledge/route.ts
git commit -m "feat(phase-e): add protected knowledge base CRUD API with embedding generation"
```

---

### Task 15: Create Dashboard Conversation Components

**Files:**
- Create: `src/components/dashboard/ConversationList.tsx`
- Create: `src/components/dashboard/ConversationDetail.tsx`

**Step 1: Create ConversationList**

Create `src/components/dashboard/ConversationList.tsx`:

```tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  message_count: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <GlassCard className="py-12 text-center">
        <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted" />
        <p className="text-sm text-muted">
          No conversations yet. Visitors will appear here once they start
          chatting.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
            selectedId === conv.id
              ? "border-ink/20 bg-white"
              : "border-transparent bg-white/50 hover:bg-white/80"
          }`}
        >
          <p className="truncate text-sm font-medium text-ink">
            {conv.title || "Untitled conversation"}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            <span>{new Date(conv.created_at).toLocaleDateString()}</span>
            <span>&middot;</span>
            <span>{conv.message_count} messages</span>
          </div>
        </button>
      ))}
    </div>
  );
}
```

**Step 2: Create ConversationDetail**

Create `src/components/dashboard/ConversationDetail.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { GlassCard } from "@/components/ui/GlassCard";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface ConversationDetailProps {
  conversationId: string;
}

export function ConversationDetail({ conversationId }: ConversationDetailProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("messages")
        .select("id, role, content, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      setMessages((data as Message[]) ?? []);
      setLoading(false);
    }

    fetchMessages();
  }, [conversationId]);

  if (loading) {
    return (
      <GlassCard className="py-8 text-center">
        <p className="text-sm text-muted">Loading messages...</p>
      </GlassCard>
    );
  }

  if (messages.length === 0) {
    return (
      <GlassCard className="py-8 text-center">
        <p className="text-sm text-muted">No messages in this conversation.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-h-[500px] space-y-3 overflow-y-auto">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}
    </GlassCard>
  );
}
```

**Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 4: Commit**

```bash
git add src/components/dashboard/ConversationList.tsx src/components/dashboard/ConversationDetail.tsx
git commit -m "feat(phase-e): add ConversationList and ConversationDetail components"
```

---

### Task 16: Create KnowledgeBaseEditor Component

**Files:**
- Create: `src/components/dashboard/KnowledgeBaseEditor.tsx`

**Step 1: Create the editor component**

Create `src/components/dashboard/KnowledgeBaseEditor.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KBEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface KnowledgeBaseEditorProps {
  entries: KBEntry[];
}

export function KnowledgeBaseEditor({ entries: initialEntries }: KnowledgeBaseEditorProps) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [editing, setEditing] = useState<KBEntry | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setTitle("");
    setContent("");
    setEditing(null);
    setIsAdding(false);
    setError(null);
  }

  function startEdit(entry: KBEntry) {
    setEditing(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setIsAdding(false);
  }

  function startAdd() {
    resetForm();
    setIsAdding(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      if (editing) {
        const res = await fetch("/api/knowledge", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, title, content }),
        });
        if (!res.ok) throw new Error("Failed to update");
        const updated = await res.json();
        setEntries((prev) =>
          prev.map((e) => (e.id === editing.id ? { ...e, ...updated } : e))
        );
      } else {
        const res = await fetch("/api/knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        if (!res.ok) throw new Error("Failed to create");
        const created = await res.json();
        setEntries((prev) => [created, ...prev]);
      }
      resetForm();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this knowledge base entry?")) return;

    try {
      const res = await fetch("/api/knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setEntries((prev) => prev.filter((e) => e.id !== id));
      router.refresh();
    } catch {
      setError("Failed to delete entry.");
    }
  }

  const showForm = isAdding || editing;

  return (
    <div>
      {/* Add button */}
      {!showForm && (
        <Button onClick={startAdd} className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Add entry
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <GlassCard className="mb-4">
          <h3 className="mb-3 text-sm font-semibold text-ink">
            {editing ? "Edit entry" : "New entry"}
          </h3>
          {error && (
            <div className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="mb-3">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-white/75 bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Entry list */}
      {entries.length === 0 && !showForm ? (
        <GlassCard className="py-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted" />
          <p className="text-sm text-muted">
            No knowledge base entries. Run the seed script or add entries
            manually.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg border border-transparent bg-white/50 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{entry.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                  {entry.content}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => startEdit(entry)}
                  className="rounded p-1.5 text-muted transition-colors hover:text-ink"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="rounded p-1.5 text-muted transition-colors hover:text-red-600"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/dashboard/KnowledgeBaseEditor.tsx
git commit -m "feat(phase-e): add KnowledgeBaseEditor with CRUD interface"
```

---

### Task 17: Replace Dashboard Chat Page with Tabs

**Files:**
- Replace: `src/app/dashboard/chat/page.tsx`

**Step 1: Replace the placeholder**

Replace the entire contents of `src/app/dashboard/chat/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatManagementTabs } from "./chat-tabs";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch conversations with message counts
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get message counts per conversation
  const convWithCounts = await Promise.all(
    (conversations ?? []).map(async (conv) => {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id);
      return { ...conv, message_count: count ?? 0 };
    })
  );

  // Fetch knowledge base entries
  const { data: kbEntries } = await supabase
    .from("knowledge_base")
    .select("id, title, content, created_at")
    .eq("user_id", user.id)
    .eq("type", "text")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Chatbot Management</h1>
      <ChatManagementTabs
        conversations={convWithCounts}
        kbEntries={kbEntries ?? []}
      />
    </div>
  );
}
```

**Step 2: Create the tabs client component**

Create `src/app/dashboard/chat/chat-tabs.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ConversationList } from "@/components/dashboard/ConversationList";
import { ConversationDetail } from "@/components/dashboard/ConversationDetail";
import { KnowledgeBaseEditor } from "@/components/dashboard/KnowledgeBaseEditor";

const tabs = [
  { id: "conversations", label: "Conversations" },
  { id: "knowledge", label: "Knowledge Base" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface ChatManagementTabsProps {
  conversations: Array<{
    id: string;
    title: string | null;
    created_at: string;
    message_count: number;
  }>;
  kbEntries: Array<{
    id: string;
    title: string;
    content: string;
    created_at: string;
  }>;
}

export function ChatManagementTabs({
  conversations,
  kbEntries,
}: ChatManagementTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("conversations");
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-lg bg-white/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="chat-tab-active"
                className="absolute inset-0 rounded-md bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span
              className={`relative ${
                activeTab === tab.id ? "text-ink" : "text-muted"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "conversations" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConvId}
            onSelect={setSelectedConvId}
          />
          {selectedConvId && (
            <ConversationDetail conversationId={selectedConvId} />
          )}
        </div>
      )}

      {activeTab === "knowledge" && (
        <KnowledgeBaseEditor entries={kbEntries} />
      )}
    </div>
  );
}
```

**Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 4: Commit**

```bash
git add src/app/dashboard/chat/page.tsx src/app/dashboard/chat/chat-tabs.tsx
git commit -m "feat(phase-e): replace chat placeholder with conversations and KB management tabs"
```

---

### Task 18: Write E2E Tests

**Files:**
- Create: `tests/e2e/chat-widget.spec.ts`

**Step 1: Create the E2E test file**

Create `tests/e2e/chat-widget.spec.ts`:

```typescript
import { expect, test } from "@playwright/test";

test("chat widget bubble is visible on landing page", async ({ page }) => {
  await page.goto("/");
  const bubble = page.getByRole("button", { name: "Open chat" });
  await expect(bubble).toBeVisible();
});

test("chat widget opens on bubble click", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat" }).click();
  await expect(page.getByText("kAyphI Assistant")).toBeVisible();
  await expect(page.getByPlaceholder("Ask me anything...")).toBeVisible();
});

test("chat widget closes on close button click", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat" }).click();
  await expect(page.getByText("kAyphI Assistant")).toBeVisible();

  await page.getByRole("button", { name: "Close chat" }).click();
  await expect(page.getByText("kAyphI Assistant")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open chat" })).toBeVisible();
});

test("chat widget is NOT visible on login page", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Open chat" })).not.toBeVisible();
});
```

**Step 2: Commit**

```bash
git add tests/e2e/chat-widget.spec.ts
git commit -m "test(phase-e): add chat widget E2E tests"
```

---

### Task 19: Verify All Tests Pass

**Step 1: Run full unit test suite**

Run: `npm run test`
Expected: All tests pass (existing tests + new rate-limit, system-prompt, validations-chat, validations-knowledge)

**Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds with new routes:
- `/api/chat` (function)
- `/api/knowledge` (function)
- `/dashboard/chat` (dynamic)

---

### Task 20: Update Documentation

**Files:**
- Modify: `ARCHITECTURE.md`
- Modify: `.env.example` (already done in Task 1, verify)

**Step 1: Update ARCHITECTURE.md**

Changes to make:
1. Update tech stack header from "Phase D" to "Phase E"
2. Add to tech stack table:
   ```
   | AI SDK | Vercel AI SDK (`ai`, `@ai-sdk/openai`) | 4.x / 1.x | Streaming chat, embeddings, RAG |
   ```
3. Add to directory structure under `src/app/api/`:
   ```
   ├── api/
   │   ├── chat/route.ts               # Public streaming chat (no auth, rate-limited)
   │   └── knowledge/route.ts          # Protected KB CRUD (auth required)
   ```
4. Add under `src/app/dashboard/chat/`:
   ```
   │   ├── chat/
   │   │   ├── page.tsx                # Chat management (server component)
   │   │   └── chat-tabs.tsx           # Conversations + KB tabs (client component)
   ```
5. Add `src/components/chat/`:
   ```
   ├── chat/
   │   ├── ChatWidget.tsx              # Floating chat widget (marketing page)
   │   ├── ChatBubble.tsx              # Message bubble + typing indicator
   │   └── ChatInput.tsx               # Chat text input with auto-resize
   ```
6. Add `src/components/dashboard/` additions:
   ```
   │   ├── ConversationList.tsx        # Conversation list viewer
   │   ├── ConversationDetail.tsx      # Message thread viewer
   │   └── KnowledgeBaseEditor.tsx     # KB CRUD interface
   ```
7. Add `src/lib/openai/` and `src/lib/chatbot/`:
   ```
   ├── openai/
   │   └── client.ts                   # OpenAI provider (@ai-sdk/openai)
   ├── chatbot/
   │   ├── knowledge.ts                # RAG retrieval (embed + pgvector search)
   │   ├── system-prompt.ts            # Dynamic system prompt builder
   │   └── seed.ts                     # KB seed script from landing content
   ```
8. Add `src/lib/supabase/anon.ts` and `src/lib/rate-limit.ts`
9. Add `src/lib/validations/chat.ts` and `src/lib/validations/knowledge.ts`
10. Add `supabase/migrations/009_match_knowledge_base.sql`
11. Update testing section with new test files
12. Update routing table with `/api/chat` (public) and `/api/knowledge` (protected)
13. Add Phase E design doc reference at top

**Step 2: Commit**

```bash
git add ARCHITECTURE.md
git commit -m "docs(phase-e): update ARCHITECTURE.md for core chatbot"
```

---

### Task 21: Final Verification

**Step 1: Run all checks**

Run: `npm run test && npm run typecheck && npm run build`
Expected: All pass

**Step 2: Review git log**

Run: `git log --oneline feat/phase-e-chatbot --not main`
Expected: ~20 commits covering all tasks
