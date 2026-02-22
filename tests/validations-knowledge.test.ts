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
