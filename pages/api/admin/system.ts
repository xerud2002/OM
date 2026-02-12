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

  const start = Date.now();

  // Test Firestore read
  let firestoreOk = false;
  let firestoreLatency = 0;
  try {
    const t0 = Date.now();
    await adminDb.collection("meta").doc("settings").get();
    firestoreLatency = Date.now() - t0;
    firestoreOk = true;
  } catch {}

  // Collection sizes
  const counts: Record<string, number> = {};
  const collections = ["companies", "customers", "requests", "offers", "reviews", "notifications", "adminAuditLog", "creditTransactions", "fraudFlags"];
  
  await Promise.all(
    collections.map(async (c) => {
      try {
        const snap = await adminDb.collection(c).count().get();
        counts[c] = snap.data().count;
      } catch {
        counts[c] = -1;
      }
    })
  );

  // Memory usage (Node.js)
  const mem = process.memoryUsage();

  // Recent errors (from adminAuditLog)
  let recentErrors = 0;
  try {
    const oneHourAgo = new Date(Date.now() - 3600000);
    const snap = await adminDb
      .collection("adminAuditLog")
      .where("action", "==", "error")
      .where("timestamp", ">=", oneHourAgo)
      .limit(100)
      .get();
    recentErrors = snap.size;
  } catch {}

  const totalLatency = Date.now() - start;

  return res.status(200).json(apiSuccess({
    status: firestoreOk ? "healthy" : "degraded",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    firestore: {
      connected: firestoreOk,
      latencyMs: firestoreLatency,
    },
    collections: counts,
    memory: {
      rss: Math.round(mem.rss / 1024 / 1024),
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
    },
    recentErrors,
    apiLatencyMs: totalLatency,
    nodeVersion: process.version,
  }));
}

export default withErrorHandler(handler);
