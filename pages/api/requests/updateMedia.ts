// pages/api/requests/updateMedia.ts
// Updates media URLs for a request (delete media from customer dashboard)
// Requires authentication + ownership verification

import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
import { apiSuccess, apiError, ErrorCodes } from "@/types/api";
import { withErrorHandler } from "@/lib/apiAuth";
import { logger } from "@/utils/logger";
import { FieldValue } from "firebase-admin/firestore";

export default withErrorHandler(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Admin not configured"));
  }

  // Verify authentication
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    return res
      .status(401)
      .json(apiError("Missing Authorization token", ErrorCodes.UNAUTHORIZED));
  }

  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    const uid = decoded.uid;

    const { requestId, mediaUrls } = req.body || {};

    if (!requestId || typeof requestId !== "string") {
      return res
        .status(400)
        .json(apiError("Missing required field: requestId", ErrorCodes.BAD_REQUEST));
    }

    if (!Array.isArray(mediaUrls)) {
      return res
        .status(400)
        .json(apiError("mediaUrls must be an array", ErrorCodes.BAD_REQUEST));
    }

    // Validate all items are strings (URLs)
    if (mediaUrls.some((url: unknown) => typeof url !== "string")) {
      return res
        .status(400)
        .json(apiError("All mediaUrls items must be strings", ErrorCodes.BAD_REQUEST));
    }

    // Verify request exists and user owns it
    const requestRef = adminDb.doc(`requests/${requestId}`);
    const requestSnap = await requestRef.get();

    if (!requestSnap.exists) {
      return res.status(404).json(apiError("Request not found"));
    }

    const requestData = requestSnap.data();
    if (requestData?.customerId !== uid) {
      return res
        .status(403)
        .json(apiError("Not authorized to modify this request", ErrorCodes.FORBIDDEN));
    }

    // Update only the mediaUrls field
    await requestRef.update({
      mediaUrls,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json(apiSuccess({ ok: true }));
  } catch (error) {
    logger.error("[updateMedia] error", error);
    return res
      .status(500)
      .json(apiError("Internal server error", ErrorCodes.INTERNAL_ERROR));
  }
});
