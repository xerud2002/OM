import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing Authorization" });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const snap = await adminDb
      .collectionGroup("offers")
      .where("companyId", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const offers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ offers });
  } catch (err: any) {
    console.error("/api/company/offers error", err);
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}
