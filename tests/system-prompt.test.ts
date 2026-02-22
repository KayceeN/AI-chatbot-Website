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
    expect(prompt).toContain("Off-topic");
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
