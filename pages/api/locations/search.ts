import type { NextApiRequest, NextApiResponse } from "next";
import { logger } from "@/utils/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q } = req.query;

  if (!q || typeof q !== "string" || q.length < 2) {
    return res.status(200).json([]);
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
    const results: Array<{
      id: string;
      name: string;
      county: string;
      full: string;
    }> = [];
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

    res.status(200).json(results.slice(0, 10));
  } catch (error) {
    logger.error("LocalAPI proxy error:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
}
