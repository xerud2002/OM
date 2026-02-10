import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";
import { sendEmail } from "@/services/email";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { calculateRequestCost } from "@/utils/costCalculator";
import { FieldValue } from "firebase-admin/firestore";

const isRateLimited = createRateLimiter({ name: "placeOffer", max: 10, windowMs: 60_000 });

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
    return res.status(400).json(apiError("Missing required fields: requestId, price"));
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json(apiError("Price must be a positive number"));
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
    // 1. Verify company exists and is verified
    const companyRef = adminDb.doc(`companies/${uid}`);
    const companySnap = await companyRef.get();
    if (!companySnap.exists) {
      return res.status(403).json(apiError("Profilul companiei nu a fost găsit."));
    }

    const companyData = companySnap.data()!;
    if (companyData.verificationStatus !== "verified") {
      return res.status(403).json(apiError("Contul tău trebuie să fie verificat (KYC) pentru a trimite oferte."));
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
      return res.status(400).json(apiError(
        `Cererea este ${requestData.status === "closed" ? "închisă" : "anulată"}.`
      ));
    }

    // 3. Check if company already has an offer on this request
    const existingOffers = await adminDb
      .collection(`requests/${requestId}/offers`)
      .where("companyId", "==", uid)
      .limit(1)
      .get();

    if (!existingOffers.empty) {
      return res.status(409).json(apiError("Ai trimis deja o ofertă pentru această cerere."));
    }

    // 4. Calculate cost and check credits
    const cost = calculateRequestCost(requestData);
    const currentCredits = Number(companyData.credits) || 0;

    if (currentCredits < cost) {
      return res.status(400).json(apiError(
        `Fonduri insuficiente. Ai nevoie de ${cost} credite, dar ai doar ${currentCredits}.`
      ));
    }

    // 5. Execute atomically via Firestore transaction
    const offerRef = adminDb.collection(`requests/${requestId}/offers`).doc();
    const txRef = adminDb.collection(`companies/${uid}/transactions`).doc();

    await adminDb.runTransaction(async (transaction) => {
      // Re-read company to get latest credits (transactional read)
      const freshCompany = await transaction.get(companyRef);
      const freshCredits = Number(freshCompany.data()?.credits) || 0;
      if (freshCredits < cost) {
        throw new Error(`Fonduri insuficiente. Ai nevoie de ${cost} credite, dar ai doar ${freshCredits}.`);
      }

      // Deduct credits
      transaction.update(companyRef, { credits: Math.round(freshCredits - cost) });

      // Create offer
      transaction.set(offerRef, {
        requestId,
        requestCode: requestData.requestCode || requestId,
        companyId: uid,
        companyName: companyData.companyName || companyData.displayName || "Companie",
        companyLogo: companyData.logoUrl || companyData.photoURL || "/pics/default-company.svg",
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
        const fromCity = requestData.fromCity || "—";
        const toCity = requestData.toCity || "—";

        await sendEmail({
          to: customerEmail,
          subject: `📩 Ai primit o ofertă nouă pentru mutarea ta - ${requestCode}`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f3f4f6;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
<tr><td style="background:linear-gradient(135deg,#10b981 0%,#0ea5e9 100%);padding:30px;text-align:center;">
<h1 style="margin:0;color:#fff;font-size:24px;">📩 Ofertă nouă primită!</h1>
<p style="margin:8px 0 0;color:#e0f2fe;font-size:15px;">Cererea ${requestCode}: ${fromCity} → ${toCity}</p>
</td></tr>
<tr><td style="padding:30px;">
<p style="color:#374151;font-size:15px;line-height:1.6;">Bună ziua,</p>
<p style="color:#374151;font-size:15px;line-height:1.6;"><strong>${companyName}</strong> ți-a trimis o ofertă de <strong>${price} RON</strong> pentru mutarea ta.</p>
${message ? `<div style="background:#f9fafb;border-left:4px solid #10b981;padding:15px;margin:20px 0;border-radius:0 8px 8px 0;"><p style="margin:0;color:#6b7280;font-size:13px;">Mesajul firmei:</p><p style="margin:5px 0 0;color:#374151;font-size:14px;">${message}</p></div>` : ""}
<div style="text-align:center;margin:25px 0;">
<a href="https://ofertemutare.ro/customer/dashboard" style="display:inline-block;background:linear-gradient(135deg,#10b981,#0ea5e9);color:#fff;padding:14px 30px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;">Vezi oferta →</a>
</div>
<p style="color:#9ca3af;font-size:13px;text-align:center;">Poți accepta, refuza sau discuta cu firma direct din contul tău.</p>
</td></tr>
<tr><td style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
<p style="margin:0;color:#9ca3af;font-size:12px;">© OferteMutare.ro — Mutări simple, rapide.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`,
        });
      } catch (emailErr) {
        logger.error("Failed to send offer notification email:", emailErr);
      }
    }

    return res.status(200).json(apiSuccess({
      offerId: offerRef.id,
      cost,
      remainingCredits: currentCredits - cost,
    }));
  } catch (error: any) {
    logger.error("[offers/place] Error:", error);
    return res.status(500).json(apiError(error.message || "Eroare la trimiterea ofertei."));
  }
}
