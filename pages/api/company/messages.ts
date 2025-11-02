import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: "Missing Authorization bearer token" });
  }

  const token = match[1];
  const { requestId, offerId } = req.query as { requestId?: string; offerId?: string };

  if (!requestId || !offerId) {
    return res.status(400).json({ error: "Missing requestId or offerId" });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Verify the offer belongs to this company
    const offerRef = adminDb.doc(`requests/${requestId}/offers/${offerId}`);
    const offerSnap = await offerRef.get();
    if (!offerSnap.exists) return res.status(404).json({ error: "Offer not found" });
    const offerData: any = offerSnap.data();
    if (offerData.companyId !== uid) {
      return res.status(403).json({ error: "Not authorized to read messages for this offer" });
    }

    const messagesSnap = await adminDb
      .collection(`requests/${requestId}/offers/${offerId}/messages`)
      .orderBy("createdAt", "asc")
      .get();

    const messages = messagesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ messages });
  } catch (err) {
    console.error("[company/messages] error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
