import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { FieldValue } from "firebase-admin/firestore";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  const docRef = adminDb.collection("meta").doc("pricingConfig");

  if (req.method === "GET") {
    const snap = await docRef.get();
    const data = snap.data() || {
      tiers: [
        { name: "Basic", credits: 10, price: 45, discount: 10 },
        { name: "Standard", credits: 25, price: 100, discount: 20 },
        { name: "Premium", credits: 50, price: 175, discount: 30 },
        { name: "Enterprise", credits: 100, price: 300, discount: 40 },
      ],
      basePrice: 5,
      bulkDiscountEnabled: true,
    };
    return res.status(200).json(apiSuccess(data));
  }

  if (req.method === "PATCH") {
    const { tiers, basePrice, bulkDiscountEnabled } = req.body;
    await docRef.set(
      {
        ...(tiers !== undefined && { tiers }),
        ...(basePrice !== undefined && { basePrice }),
        ...(bulkDiscountEnabled !== undefined && { bulkDiscountEnabled }),
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: uid,
      },
      { merge: true }
    );

    await adminDb.collection("adminAuditLog").add({
      action: "update_pricing",
      adminUid: uid,
      targetType: "pricingConfig",
      targetId: "pricingConfig",
      details: { basePrice, tiersCount: tiers?.length },
      timestamp: FieldValue.serverTimestamp(),
    });

    return res.status(200).json(apiSuccess({ updated: true }));
  }

  return res.status(405).json(apiError("Method not allowed"));
}

export default withErrorHandler(handler);
