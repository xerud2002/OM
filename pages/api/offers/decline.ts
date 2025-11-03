import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";

type RequestDoc = {
  customerId: string;
  customerName?: string;
  fromCity: string;
  toCity: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { requestId, offerId } = req.body || {};
  if (!requestId || !offerId) {
    return res.status(400).json({ error: "Missing required fields: requestId, offerId" });
  }

  try {
    if (!adminReady) {
      return res.status(503).json({ error: "Admin not configured in this environment" });
    }
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) {
      return res.status(401).json({ error: "Missing Authorization bearer token" });
    }
    const idToken = match[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Verify ownership: the request must belong to the authenticated customer
    const requestRef = adminDb.doc(`requests/${requestId}`);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) {
      return res.status(404).json({ error: "Request not found" });
    }
    const requestData = requestSnap.data() as RequestDoc;
    if (!requestData || requestData.customerId !== uid) {
      return res.status(403).json({ error: "Not authorized to modify this request" });
    }

    const offerRef = adminDb.doc(`requests/${requestId}/offers/${offerId}`);
    await offerRef.set({ status: "declined" }, { merge: true });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[offers/decline] error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
