import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { FieldValue } from "firebase-admin/firestore";

const isRateLimited = createRateLimiter({
  name: "updateRequestStatus",
  max: 10,
  windowMs: 60_000,
});

// Allowed status transitions
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  closed: ["active"], // reactivate
  accepted: ["closed"], // finalize
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { requestId, status } = req.body || {};
  if (!requestId || !status) {
    return res
      .status(400)
      .json(apiError("Missing required fields: requestId, status"));
  }

  if (!["active", "closed"].includes(status)) {
    return res.status(400).json(apiError("Invalid target status"));
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
    const requestRef = adminDb.doc(`requests/${requestId}`);
    const requestSnap = await requestRef.get();

    if (!requestSnap.exists) {
      return res.status(404).json(apiError("Request not found"));
    }

    const requestData = requestSnap.data();
    if (!requestData || requestData.customerId !== uid) {
      return res
        .status(403)
        .json(apiError("Not authorized to modify this request"));
    }

    // Validate transition
    const currentStatus = requestData.status || "active";
    const allowed = ALLOWED_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(status)) {
      return res
        .status(400)
        .json(
          apiError(`Cannot transition from "${currentStatus}" to "${status}"`),
        );
    }

    await requestRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    logger.info(
      `Request ${requestId} status updated: ${currentStatus} → ${status} by ${uid}`,
    );

    return res
      .status(200)
      .json(apiSuccess({ message: "Status updated successfully" }));
  } catch (err) {
    logger.error("Failed to update request status", err);
    return res.status(500).json(apiError("Internal server error"));
  }
}
