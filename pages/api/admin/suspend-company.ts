import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { FieldValue } from "firebase-admin/firestore";

async function requireAdmin(uid: string) {
  const snap = await adminDb.collection("admins").doc(uid).get();
  return snap.exists;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  const { companyId, action, reason } = req.body;
  if (!companyId || !action) return res.status(400).json(apiError("companyId and action required"));

  if (action === "suspend") {
    await adminDb.collection("companies").doc(companyId).update({
      suspended: true,
      suspendedAt: FieldValue.serverTimestamp(),
      suspendedBy: uid,
      suspensionReason: reason || "",
    });

    // Log to audit
    await adminDb.collection("adminAuditLog").add({
      action: "suspend_company",
      adminUid: uid,
      targetType: "company",
      targetId: companyId,
      details: { reason },
      timestamp: FieldValue.serverTimestamp(),
    });

    return res.status(200).json(apiSuccess({ suspended: true }));
  }

  if (action === "unsuspend") {
    await adminDb.collection("companies").doc(companyId).update({
      suspended: false,
      suspendedAt: null,
      suspendedBy: null,
      suspensionReason: null,
    });

    await adminDb.collection("adminAuditLog").add({
      action: "unsuspend_company",
      adminUid: uid,
      targetType: "company",
      targetId: companyId,
      timestamp: FieldValue.serverTimestamp(),
    });

    return res.status(200).json(apiSuccess({ unsuspended: true }));
  }

  if (action === "ban") {
    await adminDb.collection("companies").doc(companyId).update({
      banned: true,
      suspended: true,
      bannedAt: FieldValue.serverTimestamp(),
      bannedBy: uid,
      banReason: reason || "",
    });

    await adminDb.collection("adminAuditLog").add({
      action: "ban_company",
      adminUid: uid,
      targetType: "company",
      targetId: companyId,
      details: { reason },
      timestamp: FieldValue.serverTimestamp(),
    });

    return res.status(200).json(apiSuccess({ banned: true }));
  }

  return res.status(400).json(apiError("Invalid action. Use: suspend, unsuspend, ban"));
}

export default withErrorHandler(handler);
