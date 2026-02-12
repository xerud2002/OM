// pages/api/admin/companies/[id].ts
// Admin endpoint: aggregated company profile

import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { apiError, apiSuccess } from "@/types/api";

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Admin not configured"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  if (!(await requireAdmin(authResult.uid))) return res.status(403).json(apiError("Forbidden"));

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json(apiError("Missing company id"));

  const companyDoc = await adminDb.collection("companies").doc(id).get();
  if (!companyDoc.exists) return res.status(404).json(apiError("Company not found"));

  const company = { id: companyDoc.id, ...companyDoc.data() };

  let offers: any[] = [];
  let reviews: any[] = [];

  try {
    const offersSnap = await adminDb.collectionGroup("offers").where("companyId", "==", id).limit(100).get();
    offers = offersSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a: any, b: any) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));
  } catch (e: any) {
    console.error("[companies/[id]] offers query error:", e?.message || e);
  }

  try {
    const reviewsSnap = await adminDb.collection("reviews").where("companyId", "==", id).limit(50).get();
    reviews = reviewsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a: any, b: any) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));
  } catch (e: any) {
    console.error("[companies/[id]] reviews query error:", e?.message || e);
  }

  const acceptedOffers = offers.filter((o: any) => o.status === "accepted" || o.accepted);
  const acceptanceRate = offers.length > 0 ? Math.round((acceptedOffers.length / offers.length) * 100) : 0;

  return res.status(200).json(apiSuccess({
    company,
    offers,
    reviews,
    metrics: {
      totalOffers: offers.length,
      acceptedOffers: acceptedOffers.length,
      acceptanceRate,
      totalReviews: reviews.length,
    },
  }));
});
