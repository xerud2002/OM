import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  const { companyId, amount, reason } = req.body || {};

  if (!companyId || typeof companyId !== "string") {
    return res.status(400).json(apiError("companyId is required"));
  }
  if (typeof amount !== "number" || amount === 0) {
    return res.status(400).json(apiError("amount must be a non-zero number"));
  }
  if (!reason || typeof reason !== "string" || reason.trim().length < 3) {
    return res.status(400).json(apiError("reason must be at least 3 characters"));
  }

  // Get current company data
  const companyRef = adminDb.collection("companies").doc(companyId);
  const companySnap = await companyRef.get();
  if (!companySnap.exists) {
    return res.status(404).json(apiError("Company not found"));
  }

  const companyData = companySnap.data()!;
  const currentBalance = companyData.creditBalance || companyData.credits || 0;
  const newBalance = currentBalance + amount;

  if (newBalance < 0) {
    return res.status(400).json(apiError(`Insufficient credits. Current balance: ${currentBalance}`));
  }

  // Update company credits
  const batch = adminDb.batch();
  batch.update(companyRef, {
    creditBalance: newBalance,
    credits: newBalance,
  });

  // Log the transaction
  const txRef = adminDb.collection("creditTransactions").doc();
  batch.set(txRef, {
    companyId,
    companyName: companyData.companyName || companyData.displayName || companyId,
    type: amount > 0 ? "adjustment-add" : "adjustment-sub",
    amount: Math.abs(amount),
    balanceBefore: currentBalance,
    balanceAfter: newBalance,
    reason: reason.trim(),
    adminUid: uid,
    createdAt: new Date(),
  });

  // Log admin audit entry
  const auditRef = adminDb.collection("adminAuditLog").doc();
  batch.set(auditRef, {
    adminUid: uid,
    action: "manual_credit_adjustment",
    targetType: "company",
    targetId: companyId,
    details: `${amount > 0 ? "+" : ""}${amount} credite → ${companyData.companyName || companyData.displayName || companyId}. Motiv: ${reason.trim()}`,
    metadata: { amount, balanceBefore: currentBalance, balanceAfter: newBalance, reason: reason.trim() },
    createdAt: new Date(),
  });

  await batch.commit();

  return res.status(200).json(apiSuccess({ newBalance, previousBalance: currentBalance }));
}

export default withErrorHandler(handler);
