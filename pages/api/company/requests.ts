import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing Authorization" });

    await adminAuth.verifyIdToken(token); // only check auth; no role gating here

    const limit = Math.min(50, Number(req.query.limit) || 10);
    const before = req.query.before ? Number(req.query.before) : undefined;

    let ref = adminDb.collection("requests").orderBy("createdAt", "desc");
    if (before) ref = ref.where("createdAt", "<=", new Date(before));

    const snap = await ref.limit(limit).get();
    const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    const requests = raw.filter((r) => (!r.status || r.status === "active") && !r.archived);

    return res.status(200).json({ requests });
  } catch (err: any) {
    console.error("/api/company/requests error", err);
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}
