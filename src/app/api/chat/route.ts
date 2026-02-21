import { streamText, convertToModelMessages } from "ai";
import type { UIMessage } from "ai";
import { openai } from "@/lib/openai/client";
import { createAnonClient } from "@/lib/supabase/anon";
import { checkRateLimit } from "@/lib/rate-limit";
import { retrieveChunks } from "@/lib/chatbot/knowledge";
import { buildSystemPrompt } from "@/lib/chatbot/system-prompt";
import { headers } from "next/headers";
import { z } from "zod";

const OWNER_ID = process.env.KAYPHI_OWNER_USER_ID!;

// DefaultChatTransport sends UIMessage objects (with `parts` array, not `content`).
// We validate the overall request shape loosely and rely on convertToModelMessages
// for the heavy lifting.
const uiChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        parts: z.array(z.record(z.string(), z.unknown())).min(1),
      }).passthrough()
    )
    .min(1, "At least one message is required"),
  conversationId: z.string().optional(),
});

/** Extract concatenated text from a UIMessage's parts. */
function getTextFromParts(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export async function POST(req: Request) {
  // 1. Rate limit by IP
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return new Response("Too many requests", {
      status: 429,
      headers: { "Retry-After": String(rateCheck.retryAfter) },
    });
  }

  // 2. Validate request body
  const body = await req.json();
  const parsed = uiChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { conversationId: existingConvId } = parsed.data;
  // Cast to UIMessage[] — shape validated above, convertToModelMessages handles the rest
  const uiMessages = parsed.data.messages as unknown as UIMessage[];

  const supabase = createAnonClient();

  // 3. Create or reuse conversation
  let conversationId = existingConvId;
  if (!conversationId) {
    const firstUserMsg = uiMessages.find((m) => m.role === "user");
    const title = firstUserMsg
      ? getTextFromParts(firstUserMsg).slice(0, 80)
      : "New conversation";

    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .insert({ user_id: OWNER_ID, title })
      .select("id")
      .single();

    if (convError) {
      return new Response(
        JSON.stringify({ error: "Failed to create conversation" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    conversationId = conv.id;
  }

  // 4. Persist user message
  const lastUserMsg = [...uiMessages].reverse().find((m) => m.role === "user");
  const lastUserContent = lastUserMsg ? getTextFromParts(lastUserMsg) : "";

  if (lastUserMsg && lastUserContent) {
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: lastUserContent,
    });
  }

  // 5. RAG retrieval
  const chunks = await retrieveChunks(supabase, lastUserContent, OWNER_ID);

  // 6. Build system prompt
  const systemPrompt = buildSystemPrompt("kAyphI", chunks);

  // 7. Convert UIMessages to ModelMessages for streamText
  const modelMessages = await convertToModelMessages(uiMessages);

  // 8. Stream response
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: modelMessages,
    onFinish: async ({ text, usage }) => {
      // 9. Persist assistant message
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: text,
        tokens_used: usage?.outputTokens ?? null,
      });
    },
  });

  const response = result.toUIMessageStreamResponse();

  // Add conversation ID header so the widget can persist it
  response.headers.set("x-conversation-id", conversationId!);

  return response;
}
