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
    for (let i = 0; i < 30; i++) {
      expect(checkRateLimit(ip).allowed).toBe(true);
    }
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  test("refills tokens over time", () => {
    const ip = "172.16.0.1";
    for (let i = 0; i < 30; i++) {
      checkRateLimit(ip);
    }
    expect(checkRateLimit(ip).allowed).toBe(false);
    vi.advanceTimersByTime(4000);
    expect(checkRateLimit(ip).allowed).toBe(true);
    expect(checkRateLimit(ip).allowed).toBe(true);
    expect(checkRateLimit(ip).allowed).toBe(false);
  });

  test("tracks different IPs independently", () => {
    const ip1 = "1.1.1.1";
    const ip2 = "2.2.2.2";
    for (let i = 0; i < 30; i++) {
      checkRateLimit(ip1);
    }
    expect(checkRateLimit(ip1).allowed).toBe(false);
    expect(checkRateLimit(ip2).allowed).toBe(true);
  });
});
