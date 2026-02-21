import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { sendEmail, emailTemplates } from "@/services/email";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  if (!(await requireAdmin(authResult.uid))) return res.status(403).json(apiError("Unauthorized"));

  if (req.method === "GET") {
    // List campaigns
    const snap = await adminDb.collection("emailCampaigns").orderBy("createdAt", "desc").limit(50).get();
    const campaigns = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json(apiSuccess({ campaigns }));
  }

  if (req.method === "POST") {
    const { subject, body, audience, templateType } = req.body;
    if (!subject || !body || !audience) return res.status(400).json(apiError("Subject, body și audience sunt obligatorii"));

    // Build recipient list
    let recipients: { email: string; name: string }[] = [];

    if (audience === "all-companies") {
      const snap = await adminDb.collection("companies").get();
      recipients = snap.docs.map((d) => {
        const data = d.data();
        return { email: data.email || data.contactEmail || "", name: data.companyName || data.displayName || "" };
      }).filter((r) => r.email);
    } else if (audience === "verified-companies") {
      const snap = await adminDb.collection("companies").where("verificationStatus", "==", "verified").get();
      recipients = snap.docs.map((d) => {
        const data = d.data();
        return { email: data.email || data.contactEmail || "", name: data.companyName || data.displayName || "" };
      }).filter((r) => r.email);
    } else if (audience === "all-customers") {
      const snap = await adminDb.collection("users").limit(500).get();
      recipients = snap.docs.map((d) => {
        const data = d.data();
        return { email: data.email || "", name: data.displayName || data.name || "" };
      }).filter((r) => r.email);
    }

    // Wrap body in branded layout
    const wrappedHtml = emailTemplates.campaignWrapper(body);

    // Batch send (limit to 100 to stay safe)
    const batch = recipients.slice(0, 100);
    let sent = 0;
    let failed = 0;

    for (const r of batch) {
      try {
        await sendEmail({ to: r.email, subject, html: wrappedHtml });
        sent++;
      } catch {
        failed++;
      }
    }

    // Log campaign
    await adminDb.collection("emailCampaigns").add({
      subject,
      audience,
      templateType: templateType || "custom",
      recipientCount: batch.length,
      sent,
      failed,
      adminUid: authResult.uid,
      createdAt: new Date(),
    });

    return res.status(200).json(apiSuccess({ sent, failed, total: batch.length }));
  }

  return res.status(405).json(apiError("Method not allowed"));
}

export default withErrorHandler(handler);
