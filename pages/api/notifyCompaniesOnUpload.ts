import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";

type OfferDoc = {
  companyId: string;
  companyName: string;
  status: string;
  price: number;
  message: string;
  requestId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { requestId } = req.body || {};
  if (!requestId || typeof requestId !== "string") {
    return res.status(400).json({ error: "Missing required field: requestId" });
  }

  try {
    const offersRef = adminDb.collection(`requests/${requestId}/offers`);
    const pendingOffersSnap = await offersRef.where("status", "==", "pending").get();

    const batch = adminDb.batch();
    let count = 0;

    for (const offerDoc of pendingOffersSnap.docs) {
      const data = offerDoc.data() as OfferDoc;
      const companyId = data.companyId;
      if (!companyId) continue;
      const notifRef = adminDb.collection(`companies/${companyId}/notifications`).doc();
      batch.set(notifRef, {
        type: "media_uploaded",
        requestId,
        message: "Clientul a încărcat poze și video pentru cererea de mutare.",
        createdAt: new Date().toISOString(),
        read: false,
      });
      count++;
    }

    if (count > 0) {
      await batch.commit();
    }

    return res.status(200).json({ ok: true, count });
  } catch (err) {
    console.error("Error notifying companies:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
