import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";

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

    // Accept only the selected offer (each offer is treated individually)
    await acceptedOfferRef.set({ status: "accepted" }, { merge: true });

    // TODO: Send emails to declined companies when accept/decline feature is enabled
    // setImmediate(async () => { ... });

    // Send personalized email to company
    if (companyEmail) {
      const customerName = requestData.customerName || "Clientul";
      const companyName = acceptedOfferData.companyName || "Compania";
      const price = acceptedOfferData.price || 0;
      const requestCode =
        requestData.requestCode || requestId.substring(0, 8).toUpperCase();
      const fromCity = requestData.fromCity || "—";
      const toCity = requestData.toCity || "—";
      const rooms = requestData.rooms || "—";
      const details =
        requestData.details || "Nu au fost furnizate detalii suplimentare.";

      const emailSubject = `🎉 Felicitări! Oferta ta a fost acceptată - ${requestCode}`;
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 Felicitări, ${companyName}!</h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 16px;">Oferta ta a fost acceptată de client!</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Bună ziua,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Avem vești excelente! <strong>${customerName}</strong> a acceptat oferta ta de <strong>${price} lei</strong> pentru mutarea de la <strong>${fromCity}</strong> către <strong>${toCity}</strong>.
              </p>

              <!-- Request Details Card -->
              <div style="background-color: #f9fafb; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #059669; font-size: 18px;">📋 Detalii cerere: ${requestCode}</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">📦 Traseu:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${fromCity} → ${toCity}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">🏠 Camere:</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${rooms}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">💰 Preț acceptat:</td>
                    <td style="padding: 8px 0; color: #059669; font-size: 16px; font-weight: bold;">${price} lei</td>
                  </tr>
                </table>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">📝 Detalii suplimentare:</p>
                  <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">${details}</p>
                </div>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">📞 Următorii pași:</h3>
                <ol style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                  <li>Contactează clientul cât mai curând pentru a confirma detaliile mutării</li>
                  <li>Stabilește data și ora exactă a mutării</li>
                  <li>Asigură-te că ai echipamentul necesar pentru ${rooms} ${typeof rooms === "number" && rooms === 1 ? "cameră" : "camere"}</li>
                  <li>După finalizarea mutării, încurajează clientul să lase un review</li>
                </ol>
              </div>

              <!-- Review Request -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">⭐ Review-urile contează!</h3>
                <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                  După finalizarea mutării, clientul poate lăsa un review pentru <strong>${companyName}</strong>. 
                  Un serviciu excelent înseamnă mai multe recomandări și mai multe comenzi!
                </p>
              </div>

              <p style="margin: 25px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Mult succes cu mutarea! 🚚
              </p>

              <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px;">
                Cu stimă,<br>
                <strong style="color: #059669;">Echipa OferteMutare.ro</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                Acest email a fost trimis automat de platforma OferteMutare.ro
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                Pentru suport: <a href="mailto:info@ofertemutare.ro" style="color: #059669; text-decoration: none;">info@ofertemutare.ro</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

      const emailText = `
Felicitări, ${companyName}!

Oferta ta a fost acceptată de ${customerName}!

Detalii cerere: ${requestCode}
- Traseu: ${fromCity} → ${toCity}
- Camere: ${rooms}
- Preț acceptat: ${price} lei
- Detalii: ${details}

Următorii pași:
1. Contactează clientul cât mai curând pentru a confirma detaliile mutării
2. Stabilește data și ora exactă a mutării
3. Asigură-te că ai echipamentul necesar
4. După finalizarea mutării, încurajează clientul să lase un review pentru ${companyName}

Mult succes!

Echipa OferteMutare.ro
info@ofertemutare.ro
`;

      // Send email via Resend API
      try {
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const fromAddress =
          process.env.NOTIFY_FROM_EMAIL || "info@ofertemutare.ro";

        if (RESEND_API_KEY) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: `OferteMutare.ro <${fromAddress}>`,
              to: [companyEmail],
              subject: emailSubject,
              html: emailHtml,
              text: emailText,
            }),
          });
        } else {
          logger.warn(
            "[offers/accept] RESEND_API_KEY missing – email not sent",
          );
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
