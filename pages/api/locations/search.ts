import type { NextApiRequest, NextApiResponse } from "next";
import { logger } from "@/utils/logger";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";

const isRateLimited = createRateLimiter({ name: "locationSearch", max: 30, windowMs: 60_000 });

// ── In-memory cache (TTL 5 min) ──
type CacheEntry = { data: LocationResult[]; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60_000; // 5 minutes
const MAX_CACHE_SIZE = 200;

type LocationResult = {
  id: string;
  name: string;
  county: string;
  full: string;
};

function getCached(key: string): LocationResult[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: LocationResult[]) {
  // Evict oldest entries if cache is too large
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Prea multe cereri. Încearcă din nou în curând." });
  }

  const { q } = req.query;

  if (!q || typeof q !== "string" || q.length < 2) {
    return res.status(200).json([]);
  }

  const cacheKey = q.trim().toLowerCase();

  // Check cache first
  const cached = getCached(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  try {
    // Use the /cauta-localitate/ POST endpoint
    const response = await fetch(
      "https://address.localapi.ro/cauta-localitate/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adresa: q }),
      },
    );

    if (!response.ok) {
      throw new Error(`LocalAPI error: ${response.status}`);
    }

    const data = await response.json();

    // Parse and normalize the response
    const results: LocationResult[] = [];
    const seen = new Set<string>();

    if (Array.isArray(data)) {
      for (const item of data) {
        const locality = item.localitate;
        const judet = item.judet;

        if (locality && judet) {
          const name = locality.denumire || locality.denumire_completa || "";
          const county = judet.denumire || "";
          const key = `${name}-${county}`.toLowerCase();

          if (name && county && !seen.has(key)) {
            seen.add(key);
            results.push({
              id: locality.siruta || key,
              name: name,
              county: county,
              full: `${name}, ${county}`,
            });
          }
        }
      }
    }

    const final = results.slice(0, 10);
    setCache(cacheKey, final);
    res.status(200).json(final);
  } catch (error) {
    logger.error("LocalAPI proxy error:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
}
