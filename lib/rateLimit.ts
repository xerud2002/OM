// lib/rateLimit.ts
// Centralized rate limiter for API routes
// Uses a shared temp-file store so limits work across PM2 cluster workers.
// Falls back to in-memory if file ops fail.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";

type RateLimitEntry = { count: number; resetAt: number };
type StoreData = Record<string, { count: number; resetAt: number }>;

const STORE_DIR = join(process.cwd(), ".rate-limit");
const inMemoryStores = new Map<string, Map<string, RateLimitEntry>>();

// Ensure store directory exists
try {
  if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true });
} catch { /* noop – will fall back to in-memory */ }

function storeFile(name: string) {
  return join(STORE_DIR, `${name}.json`);
}

function readStore(name: string): StoreData {
  try {
    const raw = readFileSync(storeFile(name), "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    return {};
  }
}

function writeStore(name: string, data: StoreData): void {
  try {
    writeFileSync(storeFile(name), JSON.stringify(data), "utf8");
  } catch { /* noop – fall back gracefully */ }
}

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    // Clean in-memory stores
    for (const store of Array.from(inMemoryStores.values())) {
      store.forEach((entry, key) => {
        if (now > entry.resetAt) store.delete(key);
      });
    }
    // Clean file-based stores
    try {
      if (existsSync(STORE_DIR)) {
        const { readdirSync } = require("fs");
        const files: string[] = readdirSync(STORE_DIR);
        for (const file of files) {
          if (!file.endsWith(".json")) continue;
          const name = file.replace(".json", "");
          const data = readStore(name);
          let changed = false;
          for (const key of Object.keys(data)) {
            if (now > data[key].resetAt) {
              delete data[key];
              changed = true;
            }
          }
          if (changed) writeStore(name, data);
        }
      }
    } catch { /* noop */ }
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
 * Uses file-based shared storage so limits are enforced across PM2 cluster workers.
 * Falls back to in-memory if file I/O fails.
 *
 * @example
 * const checkLimit = createRateLimiter({ name: "contactForm", max: 3 });
 * if (checkLimit(clientIp)) return res.status(429).json(apiError("Too many requests"));
 */
export function createRateLimiter(opts: RateLimitOptions): (ip: string) => boolean {
  const windowMs = opts.windowMs ?? 60_000;
  const max = opts.max ?? 5;
  const name = opts.name;

  // Keep in-memory fallback
  if (!inMemoryStores.has(name)) {
    inMemoryStores.set(name, new Map());
  }
  const memStore = inMemoryStores.get(name)!;

  return (ip: string): boolean => {
    const now = Date.now();

    // Try file-based store first (shared across cluster workers)
    try {
      const data = readStore(name);
      const entry = data[ip];

      if (!entry || now > entry.resetAt) {
        data[ip] = { count: 1, resetAt: now + windowMs };
        writeStore(name, data);
        return false;
      }

      entry.count++;
      writeStore(name, data);
      return entry.count > max;
    } catch {
      // Fall back to in-memory on any file I/O error
      const entry = memStore.get(ip);
      if (!entry || now > entry.resetAt) {
        memStore.set(ip, { count: 1, resetAt: now + windowMs });
        return false;
      }
      entry.count++;
      return entry.count > max;
    }
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
