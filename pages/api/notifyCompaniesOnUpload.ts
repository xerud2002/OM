import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
import { logger } from "@/utils/logger";
import { apiError, apiSuccess } from "@/types/api";
import { sendEmail, emailTemplates } from "@/services/email";

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
    const userEmail = decoded.email?.toLowerCase();

    // Verify that the request belongs to the authenticated customer
    const requestRef = adminDb.doc(`requests/${requestId}`);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) {
      return res.status(404).json(apiError("Request not found"));
    }
    const requestData: any = requestSnap.data();

    // Verify ownership via customerId OR email match (guest requests have null customerId)
    const ownsViaId = requestData?.customerId === decoded.uid;
    const ownsViaEmail =
      userEmail &&
      (requestData?.customerEmail?.toLowerCase() === userEmail ||
        requestData?.guestEmail?.toLowerCase() === userEmail);

    if (!ownsViaId && !ownsViaEmail) {
      return res
        .status(403)
        .json(apiError("Not authorized to notify for this request"));
    }

    const requestCode = requestData?.requestCode || requestId;
    const fromCity = requestData?.fromCity || "";
    const toCity = requestData?.toCity || "";
    const route = fromCity && toCity ? `${fromCity} → ${toCity}` : "";

    // Get ALL offers for this request (not just pending)
    const offersSnap = await adminDb
      .collection(`requests/${requestId}/offers`)
      .get();

    const batch = adminDb.batch();
    let count = 0;
    const emailPromises: Promise<any>[] = [];

    for (const offerDoc of offersSnap.docs) {
      const data = offerDoc.data();
      const companyId = data.companyId;
      if (!companyId) continue;

      // Create in-app notification
      const notifRef = adminDb
        .collection(`companies/${companyId}/notifications`)
        .doc();
      batch.set(notifRef, {
        type: "media_uploaded",
        requestId,
        requestCode,
        title: "Poze noi disponibile",
        message: `Clientul a adăugat fotografii/video la cererea ${requestCode}.`,
        createdAt: new Date().toISOString(),
        read: false,
      });
      count++;

      // Send email notification to company
      const companyEmail = data.companyEmail;
      if (companyEmail) {
        emailPromises.push(
          sendEmail({
            to: companyEmail,
            subject: `📸 Fotografii noi pentru cererea ${requestCode}`,
            html: emailTemplates.mediaUploadedNotification(
              data.companyName || "Partener",
              requestCode,
              route,
            ),
          }).then((r) => {
            if (!r.success) {
              logger.error(`Failed to send upload notification to ${companyEmail}:`, r.error);
            }
          }),
        );
      }
    }

    if (count > 0) {
      await batch.commit();
    }

    // Send emails in parallel (fire-and-forget)
    Promise.allSettled(emailPromises).then(() => {
      logger.log(`Sent ${emailPromises.length} media upload notification emails for ${requestCode}`);
    });

    return res.status(200).json(apiSuccess({ count }));
  } catch (err) {
    logger.error("Error notifying companies:", err);
    return res.status(500).json(apiError("Internal server error"));
  }
}
