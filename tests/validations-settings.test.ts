import { describe, expect, test } from "vitest";
import { profileSchema } from "@/lib/validations/settings";

describe("profileSchema", () => {
  test("accepts valid input", () => {
    const result = profileSchema.safeParse({
      fullName: "Jane Doe",
      avatarUrl: "",
    });
    expect(result.success).toBe(true);
  });

  test("accepts valid HTTPS URL for avatar", () => {
    const result = profileSchema.safeParse({
      fullName: "Jane Doe",
      avatarUrl: "https://example.com/avatar.png",
    });
    expect(result.success).toBe(true);
  });

  test("rejects non-HTTPS URL for avatar", () => {
    const result = profileSchema.safeParse({
      fullName: "Jane Doe",
      avatarUrl: "http://example.com/avatar.png",
    });
    expect(result.success).toBe(false);
  });

  test("rejects short name", () => {
    const result = profileSchema.safeParse({
      fullName: "J",
      avatarUrl: "",
    });
    expect(result.success).toBe(false);
  });

  test("rejects name over 100 chars", () => {
    const result = profileSchema.safeParse({
      fullName: "A".repeat(101),
      avatarUrl: "",
    });
    expect(result.success).toBe(false);
  });

  test("trims whitespace from name", () => {
    const result = profileSchema.safeParse({
      fullName: "  Jane Doe  ",
      avatarUrl: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Jane Doe");
    }
  });

  test("rejects invalid URL for avatar", () => {
    const result = profileSchema.safeParse({
      fullName: "Jane Doe",
      avatarUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
