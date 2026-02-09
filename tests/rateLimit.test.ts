import { describe, it, expect, beforeEach } from "vitest";
import { createRateLimiter } from "@/lib/rateLimit";

describe("createRateLimiter", () => {
  let limiter: (ip: string) => boolean;

  beforeEach(() => {
    // Fresh limiter for each test (unique name avoids shared state)
    limiter = createRateLimiter({
      name: `test-${Date.now()}-${Math.random()}`,
      windowMs: 60_000,
      max: 3,
    });
  });

  it("allows requests under the limit", () => {
    expect(limiter("1.2.3.4")).toBe(false);
    expect(limiter("1.2.3.4")).toBe(false);
    expect(limiter("1.2.3.4")).toBe(false);
  });

  it("blocks requests over the limit", () => {
    limiter("1.2.3.4"); // 1
    limiter("1.2.3.4"); // 2
    limiter("1.2.3.4"); // 3
    expect(limiter("1.2.3.4")).toBe(true); // 4 → blocked
  });

  it("tracks IPs independently", () => {
    limiter("1.2.3.4");
    limiter("1.2.3.4");
    limiter("1.2.3.4");
    // 1.2.3.4 is at the limit, but 5.6.7.8 is fresh
    expect(limiter("5.6.7.8")).toBe(false);
    expect(limiter("1.2.3.4")).toBe(true);
  });

  it("resets after window expires", () => {
    const shortLimiter = createRateLimiter({
      name: `short-${Date.now()}`,
      windowMs: 50, // 50ms window
      max: 1,
    });

    expect(shortLimiter("1.2.3.4")).toBe(false); // 1 → ok
    expect(shortLimiter("1.2.3.4")).toBe(true); // 2 → blocked

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(shortLimiter("1.2.3.4")).toBe(false); // reset → ok
        resolve();
      }, 80);
    });
  });
});
