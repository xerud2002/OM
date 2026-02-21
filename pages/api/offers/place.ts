import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";
import { sendEmail, emailTemplates } from "@/services/email";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { calculateRequestCost } from "@/utils/costCalculator";
import { FieldValue } from "firebase-admin/firestore";

const isRateLimited = createRateLimiter({
  name: "placeOffer",
  max: 10,
  windowMs: 60_000,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { requestId, price, message } = req.body || {};
  if (!requestId || price == null) {
    return res
      .status(400)
      .json(apiError("Missing required fields: requestId, price"));
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json(apiError("Price must be a positive number"));
  }

  if (message && (typeof message !== "string" || message.length > 5000)) {
    return res
      .status(400)
      .json(apiError("Message must be a string of max 5000 characters"));
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
    // 1. Verify company exists and is verified
    const companyRef = adminDb.doc(`companies/${uid}`);
    const companySnap = await companyRef.get();
    if (!companySnap.exists) {
      return res
        .status(403)
        .json(apiError("Profilul companiei nu a fost găsit."));
    }

    const companyData = companySnap.data()!;
    if (companyData.verificationStatus !== "verified") {
      return res
        .status(403)
        .json(
          apiError(
            "Contul tău trebuie să fie verificat (KYC) pentru a trimite oferte.",
          ),
        );
    }

    // 2. Verify request exists and is active
    const requestRef = adminDb.doc(`requests/${requestId}`);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) {
      return res.status(404).json(apiError("Cererea nu mai există."));
    }

    const requestData = requestSnap.data()!;
    if (requestData.archived) {
      return res.status(400).json(apiError("Cererea a fost arhivată."));
    }
    if (requestData.status === "closed" || requestData.status === "cancelled") {
      return res
        .status(400)
        .json(
          apiError(
            `Cererea este ${requestData.status === "closed" ? "închisă" : "anulată"}.`,
          ),
        );
    }

    // Verify request has been approved by admin
    if (!requestData.adminApproved) {
      return res
        .status(400)
        .json(apiError("Această cerere nu a fost încă aprobată de admin."));
    }

    // 3. Check if company already has an offer on this request
    const existingOffers = await adminDb
      .collection(`requests/${requestId}/offers`)
      .where("companyId", "==", uid)
      .limit(1)
      .get();

    if (!existingOffers.empty) {
      return res
        .status(409)
        .json(apiError("Ai trimis deja o ofertă pentru această cerere."));
    }

    // 4. Calculate cost and check credits
    const cost = calculateRequestCost(requestData);
    const currentCredits = Number(companyData.credits) || 0;

    if (currentCredits < cost) {
      return res
        .status(400)
        .json(
          apiError(
            `Fonduri insuficiente. Ai nevoie de ${cost} credite, dar ai doar ${currentCredits}.`,
          ),
        );
    }

    // 5. Execute atomically via Firestore transaction
    const offerRef = adminDb.collection(`requests/${requestId}/offers`).doc();
    const txRef = adminDb.collection(`companies/${uid}/transactions`).doc();

    await adminDb.runTransaction(async (transaction) => {
      // Re-read company to get latest credits (transactional read)
      const freshCompany = await transaction.get(companyRef);
      const freshCredits = Number(freshCompany.data()?.credits) || 0;
      if (freshCredits < cost) {
        throw new Error(
          `Fonduri insuficiente. Ai nevoie de ${cost} credite, dar ai doar ${freshCredits}.`,
        );
      }

      // Deduct credits
      transaction.update(companyRef, {
        credits: Math.round(freshCredits - cost),
      });

      // Create offer
      transaction.set(offerRef, {
        requestId,
        requestCode: requestData.requestCode || requestId,
        companyId: uid,
        companyName:
          companyData.companyName || companyData.displayName || "Companie",
        companyLogo: companyData.logoUrl || "/pics/default-company.svg",
        companyPhone: companyData.phone || null,
        companyEmail: companyData.email || null,
        price,
        message: message || "",
        status: "pending",
        createdAt: FieldValue.serverTimestamp(),
        costPaid: cost,
        refunded: false,
        refundEligibleAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      });

      // Record transaction
      transaction.set(txRef, {
        type: "offer_placement",
        amount: -cost,
        requestId,
        description: `Ofertă pentru cererea ${requestData.requestCode || requestId}`,
        createdAt: FieldValue.serverTimestamp(),
      });
    });

    // 6. Send email notification to customer (non-blocking)
    const customerEmail = requestData.customerEmail || requestData.guestEmail;
    if (customerEmail) {
      try {
        const companyName = companyData.companyName || "Companie";
        const requestCode = requestData.requestCode || requestId;
        const fromCity = requestData.fromCity || "-";
        const toCity = requestData.toCity || "-";

        await sendEmail({
          to: customerEmail,
          subject: `📩 Ai primit o ofertă nouă pentru mutarea ta - ${requestCode}`,
          html: emailTemplates.newOffer({
            requestCode,
            requestId,
            companyName,
            companyMessage: message ? String(message) : undefined,
            price,
            fromCity,
            toCity,
            dashboardUrl: "https://ofertemutare.ro/customer/dashboard",
          }),
        });
      } catch (emailErr) {
        logger.error("Failed to send offer notification email:", emailErr);
      }
    }

    return res.status(200).json(
      apiSuccess({
        offerId: offerRef.id,
        cost,
        remainingCredits: currentCredits - cost,
      }),
    );
  } catch (error: any) {
    logger.error("[offers/place] Error:", error);
    return res
      .status(500)
      .json(apiError(error.message || "Eroare la trimiterea ofertei."));
  }
}
