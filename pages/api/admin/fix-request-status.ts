import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

/**
 * One-time fix: reset any requests with status "accepted" back to "active".
 * The old accept API incorrectly set request-level status to "accepted".
 * Now accept/decline only affects individual offers.
 *
 * DELETE THIS FILE after running once in production.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return sendAuthError(res, authResult);
  }

  // Only allow admin
  try {
    const userRecord = await adminAuth.getUser(authResult.uid!);
    const claims = userRecord.customClaims || {};
    if (claims.role !== "admin") {
      return res.status(403).json(apiError("Admin only"));
    }
  } catch {
    return res.status(403).json(apiError("Auth error"));
  }

  try {
    const snapshot = await adminDb
      .collection("requests")
      .where("status", "==", "accepted")
      .get();

    if (snapshot.empty) {
      return res
        .status(200)
        .json(
          apiSuccess({
            fixed: 0,
            message: "No requests with 'accepted' status found",
          }),
        );
    }

    const batch = adminDb.batch();
    const fixed: string[] = [];
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { status: "active" });
      fixed.push(doc.id);
    });
    await batch.commit();

    return res
      .status(200)
      .json(apiSuccess({ fixed: fixed.length, requestIds: fixed }));
  } catch (err: any) {
    return res.status(500).json(apiError(err.message || "Failed to fix"));
  }
}
