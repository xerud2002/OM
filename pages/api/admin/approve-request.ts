// pages/api/admin/approve-request.ts
// Admin endpoint to approve a request and set its credit cost
// PATCH: { requestId, creditCost, approved? }

import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth, withErrorHandler } from "@/lib/apiAuth";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";

async function requireAdmin(uid: string): Promise<boolean> {
  const adminDoc = await adminDb.collection("admins").doc(uid).get();
  return adminDoc.exists;
}

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH") {
    return res.status(405).json(apiError("Method not allowed"));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Admin not configured"));
  }

  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return res.status(authResult.status).json(apiError(authResult.error));
  }

  const isAdmin = await requireAdmin(authResult.uid);
  if (!isAdmin) {
    return res.status(403).json(apiError("Forbidden"));
  }

  const { requestId, creditCost, approved } = req.body;

  if (!requestId || typeof requestId !== "string") {
    return res.status(400).json(apiError("Missing requestId"));
  }

  const requestRef = adminDb.collection("requests").doc(requestId);
  const requestSnap = await requestRef.get();

  if (!requestSnap.exists) {
    return res.status(404).json(apiError("Request not found"));
  }

  const updates: Record<string, any> = {};

  // Set credit cost if provided
  if (creditCost !== undefined) {
    const cost = Number(creditCost);
    if (isNaN(cost) || cost < 0) {
      return res.status(400).json(apiError("creditCost must be a non-negative number"));
    }
    updates.adminCreditCost = cost;
  }

  // Set approval status
  if (approved !== undefined) {
    updates.adminApproved = Boolean(approved);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json(apiError("Nothing to update. Provide creditCost and/or approved."));
  }

  updates.updatedAt = FieldValue.serverTimestamp();
  updates.approvedBy = authResult.uid;
  updates.approvedAt = FieldValue.serverTimestamp();

  await requestRef.update(updates);

  logger.log(
    `[Admin] Request ${requestId} updated: creditCost=${updates.adminCreditCost ?? "unchanged"}, approved=${updates.adminApproved ?? "unchanged"} by ${authResult.uid}`,
  );

  return res.status(200).json(apiSuccess({
    requestId,
    ...updates,
    updatedAt: undefined, // Don't send server timestamp
    approvedAt: undefined,
  }));
});
