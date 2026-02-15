import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  if (req.method === "GET") {
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const snap = await adminDb.collection("reviews").orderBy("createdAt", "desc").limit(limit).get();
    const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Batch-fetch company names
    const companyIds = Array.from(new Set(reviews.map((r: any) => r.companyId).filter(Boolean)));
    const companyMap: Record<string, string> = {};
    for (let i = 0; i < companyIds.length; i += 30) {
      const chunk = companyIds.slice(i, i + 30);
      const s = await adminDb.collection("companies").where("__name__", "in", chunk).get();
      s.docs.forEach((d) => {
        const data = d.data();
        companyMap[d.id] = data.companyName || data.displayName || d.id;
      });
    }

    const enriched = reviews.map((r: any) => ({ ...r, companyName: companyMap[r.companyId] || "-" }));
    const total = enriched.length;
    const published = enriched.filter((r: any) => r.status === "published").length;
    const hidden = enriched.filter((r: any) => r.status === "hidden").length;
    const welcome = enriched.filter((r: any) => r.isWelcomeReview).length;

    return res.status(200).json(apiSuccess({
      reviews: enriched,
      stats: { total, published, hidden, welcome },
    }));
  }

  if (req.method === "PATCH") {
    const { reviewId, action } = req.body;
    if (!reviewId || !action) return res.status(400).json(apiError("Missing reviewId or action"));

    if (action === "publish") {
      await adminDb.collection("reviews").doc(reviewId).update({ status: "published" });
    } else if (action === "hide") {
      await adminDb.collection("reviews").doc(reviewId).update({ status: "hidden" });
    } else {
      return res.status(400).json(apiError("Invalid action"));
    }

    return res.status(200).json(apiSuccess({ updated: true }));
  }

  if (req.method === "DELETE") {
    const { reviewId } = req.body;
    if (!reviewId) return res.status(400).json(apiError("Missing reviewId"));
    await adminDb.collection("reviews").doc(reviewId).delete();
    return res.status(200).json(apiSuccess({ deleted: true }));
  }

  return res.status(405).json(apiError("Method not allowed"));
}

export default withErrorHandler(handler);
