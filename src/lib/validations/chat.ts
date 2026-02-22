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
