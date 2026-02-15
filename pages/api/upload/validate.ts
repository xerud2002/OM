import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { logger } from "@/utils/logger";
import { apiError } from "@/types/api";

type UploadTokenData = {
  requestId: string;
  customerEmail: string;
  customerName?: string;
  uploadLink: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  uploadedAt: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { token } = req.query;
  if (!token || typeof token !== "string") {
    return res
      .status(400)
      .json({ ...apiError("Missing token parameter"), valid: false });
  }

  try {
    if (!adminReady) {
      logger.warn(
        "[validateUploadToken] Firebase Admin not configured - returning invalid",
      );
      return res.status(200).json({
        valid: false,
        reason: "admin_unconfigured",
        message:
          "Server not fully configured for validation in this environment. Please try again later.",
      });
    }
    // Get token from Firestore
    const tokenRef = adminDb.doc(`uploadTokens/${token}`);
    const tokenSnap = await tokenRef.get();

    if (!tokenSnap.exists) {
      return res
        .status(404)
        .json({ ...apiError("Token not found"), valid: false });
    }

    const tokenData = tokenSnap.data() as UploadTokenData;

    // Check if token is already used
    if (tokenData.used) {
      return res.status(200).json({
        valid: false,
        reason: "already_used",
        message: "Acest link a fost deja folosit pentru upload.",
      });
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expiresAt);
    const now = new Date();
    if (now > expiresAt) {
      return res.status(200).json({
        valid: false,
        reason: "expired",
        message:
          "Acest link a expirat. Te rugăm să contactezi echipa pentru un link nou.",
      });
    }

    // Token is valid - return only non-PII fields
    return res.status(200).json({
      valid: true,
      requestId: tokenData.requestId,
      expiresAt: tokenData.expiresAt,
    });
  } catch (error) {
    logger.error("Error validating token:", error);
    return res
      .status(500)
      .json({ ...apiError("Internal server error"), valid: false });
  }
}
