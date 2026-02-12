// pages/api/admin/fraud-flags.ts
// Admin endpoint for viewing and managing fraud flags
// GET: list flags with filters | PATCH: update flag status

import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth, withErrorHandler } from "@/lib/apiAuth";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { apiError, ErrorCodes } from "@/types/api";

async function requireAdmin(uid: string): Promise<boolean> {
  const adminDoc = await adminDb.collection("admins").doc(uid).get();
  return adminDoc.exists;
}

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
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

  // ── GET: List fraud flags ──────────────────────────────────────────
  if (req.method === "GET") {
    const {
      status = "all",
      severity = "all",
      limit: limitStr = "50",
      offset: offsetStr = "0",
    } = req.query;

    let query: FirebaseFirestore.Query = adminDb
      .collection("fraudFlags")
      .orderBy("createdAt", "desc");

    if (status !== "all") {
      query = query.where("status", "==", status);
    }
    if (severity !== "all") {
      query = query.where("severity", "==", severity);
    }

    const limit = Math.min(parseInt(limitStr as string, 10) || 50, 100);
    const offset = parseInt(offsetStr as string, 10) || 0;

    // Get total count for pagination
    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    const snapshot = await query.offset(offset).limit(limit).get();

    const flags = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        reviewedAt: data.reviewedAt?.toDate?.()?.toISOString() || null,
      } as Record<string, any>;
    });

    // Enrich with user info
    const enrichedFlags = await Promise.all(
      flags.map(async (flag) => {
        try {
          const { adminAuth } = await import("@/lib/firebaseAdmin");
          const userRecord = await adminAuth.getUser(flag.flaggedUid);

          // Get fingerprint doc for more context
          const fpDoc = await adminDb
            .collection("deviceFingerprints")
            .doc(flag.flaggedUid)
            .get();
          const fpData = fpDoc.data();

          return {
            ...flag,
            userEmail: userRecord.email || flag.flaggedEmail,
            userName: userRecord.displayName || null,
            userPhotoURL: userRecord.photoURL || null,
            userCreatedAt: userRecord.metadata.creationTime || null,
            lastLogin: userRecord.metadata.lastSignInTime || null,
            deviceEventCount: fpData?.eventCount || 0,
            allIPs: fpData?.ips || [],
          };
        } catch {
          return flag;
        }
      }),
    );

    // Get summary stats
    const [pendingCount, confirmedCount, totalCount] = await Promise.all([
      adminDb.collection("fraudFlags").where("status", "==", "pending").count().get(),
      adminDb.collection("fraudFlags").where("status", "==", "confirmed").count().get(),
      adminDb.collection("fraudFlags").count().get(),
    ]);

    return res.status(200).json({
      flags: enrichedFlags,
      pagination: { total, limit, offset },
      stats: {
        pending: pendingCount.data().count,
        confirmed: confirmedCount.data().count,
        total: totalCount.data().count,
      },
    });
  }

  // ── PATCH: Update flag status ──────────────────────────────────────
  if (req.method === "PATCH") {
    const { flagId, status, notes } = req.body;

    if (!flagId || typeof flagId !== "string") {
      return res.status(400).json(apiError("Missing flagId", ErrorCodes.BAD_REQUEST));
    }
    if (!status || !["reviewed", "dismissed", "confirmed"].includes(status)) {
      return res.status(400).json(
        apiError("Invalid status. Use: reviewed, dismissed, confirmed", ErrorCodes.BAD_REQUEST),
      );
    }

    const flagRef = adminDb.collection("fraudFlags").doc(flagId);
    const flagDoc = await flagRef.get();

    if (!flagDoc.exists) {
      return res.status(404).json(apiError("Flag not found", ErrorCodes.NOT_FOUND));
    }

    await flagRef.update({
      status,
      notes: notes || null,
      reviewedBy: authResult.uid,
      reviewedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ ok: true, flagId, status });
  }

  return res.status(405).json(apiError("Method not allowed", ErrorCodes.BAD_REQUEST));
});
