import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
import { logger } from "@/utils/logger";
import { apiError, apiSuccess } from "@/types/api";
import { withErrorHandler } from "@/lib/apiAuth";

interface UploadTokenData {
  requestId?: string;
  used?: boolean;
  uploadedAt?: string;
}

interface RequestOwnerData {
  customerId?: string;
}

export default withErrorHandler(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { token } = req.body || {};
  if (!token || typeof token !== "string") {
    return res.status(400).json(apiError("Missing required field: token"));
  }

  try {
    if (!adminReady) {
      return res
        .status(503)
        .json(apiError("Admin not configured in this environment"));
    }
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) {
      return res
        .status(401)
        .json(apiError("Missing Authorization bearer token"));
    }
    const idToken = match[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Load token and verify ownership by matching request's customerId
    const tokenRef = adminDb.doc(`uploadTokens/${token}`);
    const tokenSnap = await tokenRef.get();
    if (!tokenSnap.exists) {
      return res.status(404).json(apiError("Token not found"));
    }
    const tokenData = tokenSnap.data() as UploadTokenData | undefined;
    const requestId = tokenData?.requestId;
    if (!requestId) {
      return res.status(400).json(apiError("Token missing request reference"));
    }

    const requestRef = adminDb.doc(`requests/${requestId}`);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) {
      return res.status(404).json(apiError("Request not found"));
    }
    const requestData = requestSnap.data() as RequestOwnerData | undefined;
    if (requestData?.customerId !== uid) {
      return res
        .status(403)
        .json(apiError("Not authorized to mark this token"));
    }

    await tokenRef.set(
      { used: true, uploadedAt: new Date().toISOString() },
      { merge: true },
    );

    return res.status(200).json(apiSuccess({ ok: true }));
  } catch (err) {
    logger.error("[markUploadTokenUsed] error", err);
    return res.status(500).json(apiError("Internal server error"));
  }
});
