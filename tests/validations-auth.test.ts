import { describe, expect, test } from "vitest";
import { loginSchema, signupSchema, safeRedirect } from "@/lib/validations/auth";

describe("loginSchema", () => {
  test("accepts valid input", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  test("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  test("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  test("rejects empty fields", () => {
    const result = loginSchema.safeParse({ email: "", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  test("accepts valid input", () => {
    const result = signupSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  test("rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
  });

  test("rejects short name", () => {
    const result = signupSchema.safeParse({
      fullName: "J",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });

  test("trims whitespace from name", () => {
    const result = signupSchema.safeParse({
      fullName: "  Jane Doe  ",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Jane Doe");
    }
  });

  test("rejects name exceeding 100 characters", () => {
    const result = signupSchema.safeParse({
      fullName: "A".repeat(101),
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("safeRedirect", () => {
  test("returns valid relative path", () => {
    expect(safeRedirect("/dashboard/chat")).toBe("/dashboard/chat");
  });

  test("returns fallback for null", () => {
    expect(safeRedirect(null)).toBe("/dashboard");
  });

  test("returns fallback for protocol-relative URL", () => {
    expect(safeRedirect("//evil.com")).toBe("/dashboard");
  });

  test("returns fallback for absolute URL", () => {
    expect(safeRedirect("https://evil.com")).toBe("/dashboard");
  });

  test("returns fallback for empty string", () => {
    expect(safeRedirect("")).toBe("/dashboard");
  });
});
