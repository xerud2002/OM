import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

async function requireAdmin(uid: string) {
  const snap = await adminDb.collection("admins").doc(uid).get();
  return snap.exists;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  const limit = Math.min(Number(req.query.limit) || 200, 500);
  const offersSnap = await adminDb
    .collection("offers")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  const offers = offersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Batch-fetch company names for all unique companyIds
  const companyIds = Array.from(new Set(offers.map((o: any) => o.companyId).filter(Boolean)));
  const companyMap: Record<string, string> = {};
  const chunks = [];
  for (let i = 0; i < companyIds.length; i += 30) chunks.push(companyIds.slice(i, i + 30));
  for (const chunk of chunks) {
    const snap = await adminDb.collection("companies").where("__name__", "in", chunk).get();
    snap.docs.forEach((d) => {
      const data = d.data();
      companyMap[d.id] = data.companyName || data.displayName || d.id;
    });
  }

  // Batch-fetch request routes
  const requestIds = Array.from(new Set(offers.map((o: any) => o.requestId).filter(Boolean)));
  const requestMap: Record<string, any> = {};
  const rChunks = [];
  for (let i = 0; i < requestIds.length; i += 30) rChunks.push(requestIds.slice(i, i + 30));
  for (const chunk of rChunks) {
    const snap = await adminDb.collection("requests").where("__name__", "in", chunk).get();
    snap.docs.forEach((d) => {
      const data = d.data();
      requestMap[d.id] = { from: data.from || data.fromCity, to: data.to || data.toCity, serviceType: data.serviceType };
    });
  }

  const enriched = offers.map((o: any) => ({
    ...o,
    companyName: companyMap[o.companyId] || "—",
    requestRoute: requestMap[o.requestId] || null,
  }));

  // Stats
  const total = enriched.length;
  const accepted = enriched.filter((o: any) => o.status === "accepted" || o.accepted).length;
  const declined = enriched.filter((o: any) => o.status === "declined").length;
  const pending = total - accepted - declined;

  return res.status(200).json(apiSuccess({
    offers: enriched,
    stats: { total, accepted, declined, pending },
  }));
}

export default withErrorHandler(handler);
