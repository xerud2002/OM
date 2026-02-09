// lib/rateLimit.ts
// Centralized in-memory rate limiter for API routes (single-server VPS)

type RateLimitEntry = { count: number; resetAt: number };

const stores = new Map<string, Map<string, RateLimitEntry>>();

// Clean up stale entries every 5 minutes (shared across all stores)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const store of Array.from(stores.values())) {
      store.forEach((entry, key) => {
        if (now > entry.resetAt) store.delete(key);
      });
    }
  }, 5 * 60_000);
}

export type RateLimitOptions = {
  /** Unique name for this limiter (e.g. "createGuest", "contactForm") */
  name: string;
  /** Time window in milliseconds (default: 60_000 = 1 minute) */
  windowMs?: number;
  /** Max requests per window (default: 5) */
  max?: number;
};

/**
 * Create a rate limiter function for an API route.
 * Returns a function that takes an IP string and returns true if rate-limited.
 *
 * @example
 * const checkLimit = createRateLimiter({ name: "contactForm", max: 3 });
 * if (checkLimit(clientIp)) return res.status(429).json(apiError("Too many requests"));
 */
export function createRateLimiter(opts: RateLimitOptions): (ip: string) => boolean {
  const windowMs = opts.windowMs ?? 60_000;
  const max = opts.max ?? 5;

  if (!stores.has(opts.name)) {
    stores.set(opts.name, new Map());
  }
  const store = stores.get(opts.name)!;

  return (ip: string): boolean => {
    const now = Date.now();
    const entry = store.get(ip);
    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return false;
    }
    entry.count++;
    return entry.count > max;
  };
}

/**
 * Extract client IP from a Next.js API request.
 */
export function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket: { remoteAddress?: string } }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}
