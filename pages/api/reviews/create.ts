import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { apiError, apiSuccess } from "@/types/api";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { FieldValue } from "firebase-admin/firestore";

const isRateLimited = createRateLimiter({
  name: "reviewCreate",
  max: 3,
  windowMs: 60 * 60_000, // 3 reviews per hour per IP
});

/**
 * POST /api/reviews/create
 * Creates a review with status "pending" for moderation.
 * Rate-limited: 3 reviews per hour per IP.
 * No auth required (guests can leave reviews via email link).
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res
      .status(429)
      .json(apiError("Prea multe cereri. Încercați din nou mai târziu."));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Service unavailable"));
  }

  try {
    const {
      companyId,
      requestId,
      customerName,
      rating,
      categoryRatings,
      avgCategoryRating,
      comment,
    } = req.body;

    // --- Validation ---
    if (!companyId || typeof companyId !== "string") {
      return res.status(400).json(apiError("companyId is required"));
    }
    if (
      !customerName ||
      typeof customerName !== "string" ||
      customerName.trim().length < 2
    ) {
      return res
        .status(400)
        .json(apiError("customerName must be at least 2 characters"));
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json(apiError("rating must be between 1 and 5"));
    }
    if (!comment || typeof comment !== "string" || comment.trim().length < 10) {
      return res
        .status(400)
        .json(apiError("comment must be at least 10 characters"));
    }

    // Verify company exists
    const companySnap = await adminDb.doc(`companies/${companyId}`).get();
    if (!companySnap.exists) {
      return res.status(404).json(apiError("Company not found"));
    }

    // Check for duplicate review (same company + request)
    if (requestId) {
      const dupeSnap = await adminDb
        .collection("reviews")
        .where("companyId", "==", companyId)
        .where("requestId", "==", requestId)
        .limit(1)
        .get();
      if (!dupeSnap.empty) {
        return res
          .status(409)
          .json(apiError("Ai lăsat deja o recenzie pentru această cerere."));
      }
    }

    // --- Create review with pending status ---
    const reviewData: Record<string, unknown> = {
      companyId,
      requestId: requestId || null,
      customerName: customerName.trim(),
      rating,
      categoryRatings: categoryRatings || null,
      avgCategoryRating:
        typeof avgCategoryRating === "number" ? avgCategoryRating : rating,
      comment: comment.trim(),
      createdAt: FieldValue.serverTimestamp(),
      status: "published", // auto-publish; admin can moderate later
      ip: clientIp,
    };

    const docRef = await adminDb.collection("reviews").add(reviewData);

    // Update company average rating atomically
    try {
      const companyData = companySnap.data()!;
      const currentTotal = companyData.totalReviews || 0;
      const currentAvg = companyData.averageRating || 0;
      const newTotal = currentTotal + 1;
      const newAvg =
        Math.round(((currentAvg * currentTotal + rating) / newTotal) * 10) / 10;

      await adminDb.doc(`companies/${companyId}`).update({
        totalReviews: FieldValue.increment(1),
        averageRating: newAvg,
      });
    } catch {
      // Non-critical — review is saved regardless
    }

    return res.status(201).json(apiSuccess({ reviewId: docRef.id }));
  } catch (err) {
    console.error("Error creating review:", err);
    return res.status(500).json(apiError("Internal server error"));
  }
}
