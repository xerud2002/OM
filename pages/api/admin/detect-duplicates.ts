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
  if (req.method !== "POST") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  // Get recent requests (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const reqSnap = await adminDb
    .collection("requests")
    .where("createdAt", ">=", thirtyDaysAgo)
    .orderBy("createdAt", "desc")
    .limit(500)
    .get();

  const requests = reqSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Detect duplicates: same email/phone + same route within 48h
  const duplicates: any[] = [];
  const seen = new Map<string, any[]>();

  requests.forEach((r: any) => {
    const email = (r.email || "").toLowerCase();
    const phone = r.phone || "";
    const from = (r.from || r.fromCity || "").toLowerCase();
    const to = (r.to || r.toCity || "").toLowerCase();
    const key = `${email}|${phone}|${from}|${to}`;
    
    if (!seen.has(key)) {
      seen.set(key, []);
    }
    seen.get(key)!.push(r);
  });

  seen.forEach((group) => {
    if (group.length > 1) {
      // Check if within 48h window
      for (let i = 0; i < group.length - 1; i++) {
        const t1 = group[i].createdAt?._seconds || 0;
        const t2 = group[i + 1].createdAt?._seconds || 0;
        if (Math.abs(t1 - t2) < 48 * 3600) {
          duplicates.push({
            ids: group.map((g: any) => g.id),
            email: group[0].email,
            phone: group[0].phone,
            route: `${group[0].from || group[0].fromCity} → ${group[0].to || group[0].toCity}`,
            count: group.length,
            firstAt: group[group.length - 1].createdAt,
            lastAt: group[0].createdAt,
          });
          break;
        }
      }
    }
  });

  // Detect suspicious: many requests from same IP or fingerprint
  const ipCounts: Record<string, number> = {};
  requests.forEach((r: any) => {
    if (r.ip) ipCounts[r.ip] = (ipCounts[r.ip] || 0) + 1;
  });
  const suspiciousIps = Object.entries(ipCounts)
    .filter(([, count]) => count > 5)
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count);

  // Log the detection run
  await adminDb.collection("adminAuditLog").add({
    action: "run_duplicate_detection",
    adminUid: uid,
    targetType: "system",
    targetId: "detect-duplicates",
    details: { duplicatesFound: duplicates.length, suspiciousIps: suspiciousIps.length },
    timestamp: FieldValue.serverTimestamp(),
  });

  return res.status(200).json(apiSuccess({
    duplicates,
    suspiciousIps,
    totalScanned: requests.length,
  }));
}

export default withErrorHandler(handler);
