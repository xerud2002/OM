import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  const limitN = Math.min(Number(req.query.limit) || 200, 500);
  const snap = await adminDb
    .collection("adminAuditLog")
    .orderBy("timestamp", "desc")
    .limit(limitN)
    .get();

  const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return res.status(200).json(apiSuccess({ logs }));
}

export default withErrorHandler(handler);
