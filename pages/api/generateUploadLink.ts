import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { logger } from "@/utils/logger";
import { apiError, apiSuccess } from "@/types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { requestId, customerEmail, customerName } = req.body || {};
  if (!requestId || !customerEmail) {
    return res
      .status(400)
      .json(apiError("Missing required fields: requestId, customerEmail"));
  }

  try {
    if (!adminReady) {
      return res
        .status(503)
        .json(apiError("Admin not configured in this environment"));
    }

    // Verify the request exists and the email matches the one on record
    const requestDoc = await adminDb.doc(`requests/${requestId}`).get();
    if (!requestDoc.exists) {
      return res.status(404).json(apiError("Request not found"));
    }
    const requestData = requestDoc.data();
    if (
      requestData?.email !== customerEmail &&
      requestData?.contactEmail !== customerEmail
    ) {
      return res.status(403).json(apiError("Email does not match request"));
    }

    // Generate unique upload token
    const uploadToken = randomBytes(32).toString("hex");
    const uploadLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/upload/${uploadToken}`;

    // Calculate expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save token to Firestore
    const tokenRef = adminDb.doc(`uploadTokens/${uploadToken}`);
    await tokenRef.set({
      requestId,
      customerEmail,
      customerName,
      uploadLink,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      used: false,
      uploadedAt: null,
    });

    // Also update the request with the token
    const requestRef = adminDb.doc(`requests/${requestId}`);
    await requestRef.set({ mediaUploadToken: uploadToken }, { merge: true });

    // Return token - email notification handled separately
    return res.status(200).json(
      apiSuccess({
        uploadToken,
        uploadLink,
        customerEmail,
        customerName,
      }),
    );
  } catch (error) {
    logger.error("Error generating upload link:", error);
    return res.status(500).json(apiError("Internal server error"));
  }
}
