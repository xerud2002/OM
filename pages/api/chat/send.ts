import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { FieldValue } from "firebase-admin/firestore";

const isRateLimited = createRateLimiter({ name: "chatSend", max: 30, windowMs: 60_000 });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { requestId, offerId, text, senderRole, attachment } = req.body || {};

  if (!requestId || !offerId || !senderRole) {
    return res.status(400).json(apiError("Missing required fields: requestId, offerId, senderRole"));
  }

  if (!text && !attachment) {
    return res.status(400).json(apiError("Message must have text or attachment"));
  }

  if (senderRole !== "company" && senderRole !== "customer") {
    return res.status(400).json(apiError("Invalid senderRole"));
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
    // Verify the user is a party in this conversation
    const requestRef = adminDb.doc(`requests/${requestId}`);
    const offerRef = adminDb.doc(`requests/${requestId}/offers/${offerId}`);

    const [requestSnap, offerSnap] = await Promise.all([
      requestRef.get(),
      offerRef.get(),
    ]);

    if (!requestSnap.exists) {
      return res.status(404).json(apiError("Cererea nu a fost găsită."));
    }
    if (!offerSnap.exists) {
      return res.status(404).json(apiError("Oferta nu a fost găsită."));
    }

    const requestData = requestSnap.data()!;
    const offerData = offerSnap.data()!;

    const isCustomer = requestData.customerId === uid;
    const isCompany = offerData.companyId === uid;

    if (!isCustomer && !isCompany) {
      return res.status(403).json(apiError("Nu ai permisiunea să trimiți mesaje în această conversație."));
    }

    // Validate senderRole matches actual role
    if ((senderRole === "company" && !isCompany) || (senderRole === "customer" && !isCustomer)) {
      return res.status(403).json(apiError("Rolul nu corespunde."));
    }

    // Build message data
    const msgData: Record<string, unknown> = {
      text: text || "",
      senderId: uid,
      senderRole,
      createdAt: FieldValue.serverTimestamp(),
    };

    if (attachment && typeof attachment === "object") {
      msgData.attachment = {
        url: attachment.url || "",
        type: attachment.type || "image",
        name: attachment.name || "file",
      };
    }

    // Save message
    const messagesRef = adminDb.collection(
      `requests/${requestId}/offers/${offerId}/messages`
    );
    const msgDoc = await messagesRef.add(msgData);

    return res.status(200).json(apiSuccess({ messageId: msgDoc.id }));
  } catch (err) {
    logger.error("Error sending chat message:", err);
    return res.status(500).json(apiError("Eroare la trimiterea mesajului."));
  }
}
