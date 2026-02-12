// pages/api/admin/sidebar-badges.ts
// Lightweight endpoint returning unread/pending counts for admin sidebar badges
// Designed to be polled every 30-60s — returns only counts, no heavy data

import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { apiError, apiSuccess, ErrorCodes } from "@/types/api";

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json(apiError("Method not allowed", ErrorCodes.BAD_REQUEST));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Admin not configured", ErrorCodes.ADMIN_NOT_READY));
  }

  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return res.status(authResult.status).json(apiError(authResult.error, authResult.code));
  }

  const isAdmin = await requireAdmin(authResult.uid);
  if (!isAdmin) {
    return res.status(403).json(apiError("Forbidden", ErrorCodes.UNAUTHORIZED));
  }

  // Run all count queries in parallel for speed
  const [
    pendingRequestsSnap,
    pendingVerificationsSnap,
    pendingFraudSnap,
  ] = await Promise.all([
    // Requests not yet approved by admin (excluding cancelled/closed)
    adminDb.collection("requests")
      .where("adminApproved", "==", false)
      .count().get(),
    // Companies with pending verification
    adminDb.collection("companies")
      .where("verificationStatus", "==", "pending")
      .count().get(),
    // Fraud flags pending review
    adminDb.collection("fraudFlags")
      .where("status", "==", "pending")
      .count().get(),
  ]);

  const badges: Record<string, number> = {};

  const pendingRequests = pendingRequestsSnap.data().count;
  const pendingVerifications = pendingVerificationsSnap.data().count;
  const pendingFraud = pendingFraudSnap.data().count;

  // Only include items with count > 0 to keep payload small
  if (pendingRequests > 0) badges["/admin/requests"] = pendingRequests;
  if (pendingVerifications > 0) badges["/admin/verifications"] = pendingVerifications;
  if (pendingFraud > 0) badges["/admin/fraud-flags"] = pendingFraud;

  // Cache for 30 seconds to reduce Firestore reads
  res.setHeader("Cache-Control", "private, max-age=30");
  return res.status(200).json(apiSuccess({ badges }));
});
