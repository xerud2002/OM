import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

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

    // Batch update: set chosen offer to accepted, all others to declined
    const offersRef = adminDb.collection(`requests/${requestId}/offers`);
    const offersSnap = await offersRef.get();
    const batch = adminDb.batch();

    let acceptedOffer: any = null;

    for (const docSnap of offersSnap.docs) {
      const ref = offersRef.doc(docSnap.id);
      if (docSnap.id === offerId) {
        batch.set(ref, { status: "accepted" }, { merge: true });
        acceptedOffer = docSnap.data();
      } else {
        batch.set(ref, { status: "declined" }, { merge: true });
      }
    }

    // Update request status to "accepted" (or "in-progress")
    batch.set(requestRef, { status: "accepted" }, { merge: true });

    await batch.commit();

    // Send email notification to company (best-effort, non-blocking)
    if (acceptedOffer?.companyId) {
      try {
        const companyRef = adminDb.doc(`companies/${acceptedOffer.companyId}`);
        const companySnap = await companyRef.get();
        if (companySnap.exists) {
          const companyData = companySnap.data();
          const companyEmail = companyData?.email;
          if (companyEmail) {
            const route = `${requestData.fromCity || ""} → ${requestData.toCity || ""}`;
            const subject = `Oferta ta a fost acceptată`;
            const html = `
              <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
                <h2>Oferta ta a fost acceptată</h2>
                <p>Bună, <strong>${companyData.companyName || "Partener"}</strong>!</p>
                <p>O ofertă de mutare ți-a fost acceptată${requestData.customerName ? ` de <strong>${requestData.customerName}</strong>` : ""}.</p>
                <ul>
                  <li><strong>Cerere:</strong> ${requestId}</li>
                  <li><strong>Rută:</strong> ${route}</li>
                  <li><strong>Preț:</strong> ${acceptedOffer.price} lei</li>
                </ul>
                <p>Accesează panoul companiei pentru a confirma detaliile.</p>
              </div>
            `;
            const text = `Oferta ta pentru cererea ${requestId} (${route}) a fost acceptată. Preț: ${acceptedOffer.price} lei.`;

            await fetch(
              `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notifyOfferAccepted`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  to: companyEmail,
                  subject,
                  html,
                  text,
                }),
              }
            );
          }
        }
      } catch (emailErr) {
        console.error("Failed to send company email notification", emailErr);
        // Don't fail the API call if email fails
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[offers/accept] error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
