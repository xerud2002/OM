import type { NextApiRequest, NextApiResponse } from "next";
import admin, { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { requestId, offerId, text } = req.body || {};
  if (!requestId || !offerId || !text || String(text).trim().length === 0) {
    return res.status(400).json(apiError("Missing required fields: requestId, offerId, text"));
  }

  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return sendAuthError(res, authResult);
  }
  const uid = authResult.uid;

  try {
    // Load request and offer to determine permissions and targets
    const requestRef = adminDb.doc(`requests/${requestId}`);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) return res.status(404).json(apiError("Request not found"));
    const requestData = requestSnap.data() as { customerId?: string };

    const offerRef = adminDb.doc(`requests/${requestId}/offers/${offerId}`);
    const offerSnap = await offerRef.get();
    if (!offerSnap.exists) return res.status(404).json(apiError("Offer not found"));
    const offerData = offerSnap.data() as { companyId?: string };

    const isCustomer = requestData?.customerId === uid;
    const isCompany = offerData?.companyId === uid;

    if (!isCustomer && !isCompany) {
      return res.status(403).json(apiError("Not authorized to message on this offer"));
    }

    const senderRole = isCustomer ? "customer" : "company";

    // Create a messages subcollection under the offer
    const messagesCol = adminDb.collection(`requests/${requestId}/offers/${offerId}/messages`);
    await messagesCol.add({
      text: String(text).trim(),
      senderId: uid,
      senderRole,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Optional lightweight notification for company when customer sends a message
    if (isCustomer && offerData?.companyId) {
      try {
        const notifRef = adminDb.collection(`companies/${offerData.companyId}/notifications`).doc();
        await notifRef.set({
          type: "message",
          requestId,
          offerId,
          text: String(text).trim().slice(0, 500),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          seen: false,
        });
      } catch (e) {
        console.warn("[offers/message] failed to create notification", e);
      }
    }

    return res.status(200).json(apiSuccess({ ok: true }));
  } catch (err) {
    console.error("[offers/message] error", err);
    return res.status(500).json(apiError("Internal server error"));
  }
}
