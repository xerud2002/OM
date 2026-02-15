import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { apiError, apiSuccess } from "@/types/api";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";

const isRateLimited = createRateLimiter({ name: "reviewStats", max: 30, windowMs: 60_000 });

/**
 * Public API: Returns aggregate review statistics.
 * No auth required — data is used for SEO structured data.
 * GET /api/reviews/stats → { ratingValue: number, reviewCount: number }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json(apiError("Too many requests. Please try again later."));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Service unavailable"));
  }

  try {
    const snap = await adminDb
      .collection("reviews")
      .where("status", "==", "published")
      .get();

    if (snap.empty) {
      // Cache even empty results to avoid hammering Firestore
      res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");
      return res.status(200).json(apiSuccess({ ratingValue: 0, reviewCount: 0 }));
    }

    let totalRating = 0;
    let count = 0;

    snap.docs.forEach((doc) => {
      const data = doc.data();
      const rating = Number(data.rating);
      if (rating >= 1 && rating <= 5) {
        totalRating += rating;
        count++;
      }
    });

    const ratingValue = count > 0 ? Math.round((totalRating / count) * 10) / 10 : 0;

    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");
    return res.status(200).json(apiSuccess({ ratingValue, reviewCount: count }));
  } catch (err) {
    return res.status(500).json(apiError("Internal server error"));
  }
}
