import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";
import { sendEmail, emailTemplates } from "@/services/email";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";

const isRateLimited = createRateLimiter({
  name: "acceptOffer",
  max: 5,
  windowMs: 60_000,
});

type RequestDoc = {
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  fromCity?: string;
  toCity?: string;
  requestCode?: string;
  moveDate?: string;
  moveDateStart?: string;
  moveDateEnd?: string;
  rooms?: number;
  details?: string;
};

type OfferDoc = {
  companyId: string;
  companyName?: string;
  price?: number;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { requestId, offerId } = req.body || {};
  if (!requestId || !offerId) {
    return res
      .status(400)
      .json(apiError("Missing required fields: requestId, offerId"));
  }

  // Rate limiting
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res
      .status(429)
      .json(apiError("Too many requests. Please try again later."));
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
    const requestData = requestSnap.data() as RequestDoc;
    if (!requestData || requestData.customerId !== uid) {
      return res
        .status(403)
        .json(apiError("Not authorized to modify this request"));
    }

    // Get accepted offer details
    const acceptedOfferRef = adminDb.doc(
      `requests/${requestId}/offers/${offerId}`,
    );
    const acceptedOfferSnap = await acceptedOfferRef.get();
    if (!acceptedOfferSnap.exists) {
      return res.status(404).json(apiError("Offer not found"));
    }
    const acceptedOfferData = acceptedOfferSnap.data() as OfferDoc;

    // Get company email from auth
    let companyEmail = "";
    try {
      const companyUser = await adminAuth.getUser(acceptedOfferData.companyId);
      companyEmail = companyUser.email || "";
    } catch (err) {
      logger.warn("Could not fetch company email:", err);
    }

    // Accept the selected offer and update request status
    const batch = adminDb.batch();
    batch.set(acceptedOfferRef, { status: "accepted" }, { merge: true });
    batch.update(requestRef, { status: "accepted", updatedAt: new Date() });

    // Auto-decline all other pending offers
    const otherOffers = await adminDb
      .collection(`requests/${requestId}/offers`)
      .where("status", "==", "pending")
      .get();
    otherOffers.docs.forEach((d) => {
      if (d.id !== offerId) {
        batch.update(d.ref, { status: "declined" });
      }
    });

    await batch.commit();

    // Send personalized email to company
    if (companyEmail) {
      const customerName = requestData.customerName || "Clientul";
      const companyName = acceptedOfferData.companyName || "Compania";
      const price = acceptedOfferData.price || 0;
      const requestCode =
        requestData.requestCode || requestId.substring(0, 8).toUpperCase();
      const fromCity = requestData.fromCity || "-";
      const toCity = requestData.toCity || "-";
      const rooms = requestData.rooms || "-";
      const details =
        requestData.details || "Nu au fost furnizate detalii suplimentare.";

      const emailSubject = `🎉 Felicitări! Oferta ta a fost acceptată - ${requestCode}`;
      const emailHtml = emailTemplates.offerAccepted(
        requestCode,
        customerName,
        "",
        "",
        {
          companyName,
          price,
          fromCity,
          toCity,
          rooms,
          details,
        },
      );

      try {
        const result = await sendEmail({
          to: companyEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        if (!result.success) {
          logger.warn("[offers/accept] Email send failed:", result.error);
        }
      } catch (emailErr) {
        logger.error("[offers/accept] Email error:", emailErr);
        // Don't fail the request if email fails
      }
    }

    return res.status(200).json(apiSuccess({ ok: true }));
  } catch (err) {
    logger.error("[offers/accept] error", err);
    return res.status(500).json(apiError("Internal server error"));
  }
}
