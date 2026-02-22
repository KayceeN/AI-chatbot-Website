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
