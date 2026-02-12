// pages/api/admin/users/[id].ts
// Admin endpoint: aggregated user profile

import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { apiError, apiSuccess } from "@/types/api";

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Admin not configured"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  if (!(await requireAdmin(authResult.uid))) return res.status(403).json(apiError("Forbidden"));

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json(apiError("Missing user id"));

  const userDoc = await adminDb.collection("customers").doc(id).get();
  if (!userDoc.exists) return res.status(404).json(apiError("User not found"));

  const userData = { id: userDoc.id, ...userDoc.data() };

  // Get user's requests (sort in-memory to avoid composite index dependency)
  const requestsSnap = await adminDb.collection("requests").where("customerId", "==", id).limit(50).get();
  const requests = requestsSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a: any, b: any) => {
      const ta = a.createdAt?._seconds || 0;
      const tb = b.createdAt?._seconds || 0;
      return tb - ta;
    });

  // Get offers for those requests
  const requestIds = requests.map((r) => r.id);
  let offers: any[] = [];
  if (requestIds.length > 0) {
    // Firestore 'in' supports max 30
    const chunks = [];
    for (let i = 0; i < requestIds.length; i += 30) {
      chunks.push(requestIds.slice(i, i + 30));
    }
    for (const chunk of chunks) {
      const offersSnap = await adminDb.collectionGroup("offers").where("requestId", "in", chunk).get();
      offers.push(...offersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
  }

  return res.status(200).json(apiSuccess({ user: userData, requests, offers }));
});
