import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  const companiesSnap = await adminDb.collection("companies").get();

  // Get all offers for acceptance rates
  const offersSnap = await adminDb.collectionGroup("offers").get();
  const offersByCompany: Record<string, { total: number; accepted: number }> = {};
  offersSnap.docs.forEach((d) => {
    const data = d.data();
    const cid = data.companyId;
    if (!cid) return;
    if (!offersByCompany[cid]) offersByCompany[cid] = { total: 0, accepted: 0 };
    offersByCompany[cid].total++;
    if (data.status === "accepted" || data.accepted) offersByCompany[cid].accepted++;
  });

  const rankings = companiesSnap.docs.map((d) => {
    const data = d.data();
    const offers = offersByCompany[d.id] || { total: 0, accepted: 0 };
    const rating = data.averageRating || 0;
    const reviews = data.totalReviews || 0;
    const acceptanceRate = offers.total > 0 ? Math.round((offers.accepted / offers.total) * 100) : 0;
    const verified = data.verificationStatus === "verified" || data.verified;

    // Composite score (max 5): rating(40%) + acceptanceRate(30%) + volume(20%) + verified(10%)
    const ratingNorm = rating / 5; // 0-1
    const acceptNorm = acceptanceRate / 100; // 0-1
    const volumeNorm = Math.min(offers.total / 100, 1); // 0-1, cap at 100 offers
    const verifiedNorm = verified ? 1 : 0;
    const score = 5 * (ratingNorm * 0.4 + acceptNorm * 0.3 + volumeNorm * 0.2 + verifiedNorm * 0.1);

    return {
      id: d.id,
      companyName: data.companyName || data.displayName || d.id,
      city: data.city || "-",
      rating,
      reviews,
      totalOffers: offers.total,
      acceptedOffers: offers.accepted,
      acceptanceRate,
      verified,
      score: Math.round(score * 100) / 100,
    };
  });

  rankings.sort((a, b) => b.score - a.score);

  return res.status(200).json(apiSuccess({ rankings }));
}

export default withErrorHandler(handler);
