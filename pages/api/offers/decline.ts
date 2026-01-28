import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { requestId, offerId } = req.body || {};
  if (!requestId || !offerId) {
    return res.status(400).json(apiError("Missing required fields: requestId, offerId"));
  }

  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return sendAuthError(res, authResult);
  }
  const uid = authResult.uid;

  try {
    // Verify ownership: the request must belong to the authenticated customer
    const requestRef = adminDb.doc(`requests/${requestId}`);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) {
      return res.status(404).json(apiError("Request not found"));
    }
    const requestData = requestSnap.data() as { customerId: string };
    if (!requestData || requestData.customerId !== uid) {
      return res.status(403).json(apiError("Not authorized to modify this request"));
    }

    const offerRef = adminDb.doc(`requests/${requestId}/offers/${offerId}`);
    await offerRef.set({ status: "declined" }, { merge: true });

    return res.status(200).json(apiSuccess({ ok: true }));
  } catch (err) {
    logger.error("[offers/decline] error", err);
    return res.status(500).json(apiError("Internal server error"));
  }
}
