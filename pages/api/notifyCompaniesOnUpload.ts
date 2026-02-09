import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
import { logger } from "@/utils/logger";
import { apiError, apiSuccess } from "@/types/api";

type OfferDoc = {
  companyId: string;
  companyName: string;
  status: string;
  price: number;
  message: string;
  requestId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { requestId } = req.body || {};
  if (!requestId || typeof requestId !== "string") {
    return res.status(400).json(apiError("Missing required field: requestId"));
  }

  try {
    if (!adminReady) {
      return res
        .status(503)
        .json(apiError("Admin not configured in this environment"));
    }

    // Verify Firebase ID token and ownership
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) {
      return res
        .status(401)
        .json(apiError("Missing Authorization bearer token"));
    }
    const idToken = match[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Verify that the request belongs to the authenticated customer
    const requestRef = adminDb.doc(`requests/${requestId}`);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) {
      return res.status(404).json(apiError("Request not found"));
    }
    const requestData: any = requestSnap.data();
    if (requestData?.customerId !== uid) {
      return res
        .status(403)
        .json(apiError("Not authorized to notify for this request"));
    }

    const offersRef = adminDb.collection(`requests/${requestId}/offers`);
    const pendingOffersSnap = await offersRef
      .where("status", "==", "pending")
      .get();

    const batch = adminDb.batch();
    let count = 0;

    for (const offerDoc of pendingOffersSnap.docs) {
      const data = offerDoc.data() as OfferDoc;
      const companyId = data.companyId;
      if (!companyId) continue;
      const notifRef = adminDb
        .collection(`companies/${companyId}/notifications`)
        .doc();
      batch.set(notifRef, {
        type: "media_uploaded",
        requestId,
        title: "Poze noi disponibile",
        message: "Clientul a încărcat poze și video pentru cererea de mutare.",
        createdAt: new Date().toISOString(),
        read: false,
      });
      count++;
    }

    if (count > 0) {
      await batch.commit();
    }

    return res.status(200).json(apiSuccess({ count }));
  } catch (err) {
    logger.error("Error notifying companies:", err);
    return res.status(500).json(apiError("Internal server error"));
  }
}
