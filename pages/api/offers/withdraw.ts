import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";

const isRateLimited = createRateLimiter({ name: "withdrawOffer", max: 5, windowMs: 60_000 });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { requestId, offerId } = req.body || {};
  if (!requestId || !offerId) {
    return res.status(400).json(apiError("Missing required fields: requestId, offerId"));
  }

  // Rate limiting
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json(apiError("Too many requests. Please try again later."));
  }

  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return sendAuthError(res, authResult);
  }
  const uid = authResult.uid;

  try {
    const offerRef = adminDb.doc(`requests/${requestId}/offers/${offerId}`);
    const offerSnap = await offerRef.get();

    if (!offerSnap.exists) {
      return res.status(404).json(apiError("Oferta nu a fost găsită."));
    }

    const offerData = offerSnap.data()!;

    // Only the company that placed the offer can withdraw it
    if (offerData.companyId !== uid) {
      return res.status(403).json(apiError("Nu ai permisiunea de a retrage această ofertă."));
    }

    // Only pending offers can be withdrawn
    if (offerData.status !== "pending") {
      return res.status(400).json(apiError("Doar ofertele în așteptare pot fi retrase."));
    }

    // Delete the offer document
    await offerRef.delete();

    return res.status(200).json(apiSuccess({ ok: true }));
  } catch (err) {
    logger.error("[offers/withdraw] error", err);
    return res.status(500).json(apiError("Eroare la retragerea ofertei."));
  }
}
