import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, subject, html, text, from } = req.body || {};
  if (!to || !subject || (!html && !text)) {
    return res.status(400).json({ error: "Missing required fields: to, subject, html|text" });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  // Fallback from address
  const fromAddress = from || process.env.NOTIFY_FROM_EMAIL || "noreply@om.local";

  // If no API key configured, no-op to keep dev environments working
  if (!RESEND_API_KEY) {
    console.warn("[notifyOfferAccepted] RESEND_API_KEY missing – skipping send.");
    return res.status(202).json({ ok: true, skipped: true });
  }

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error("Resend error:", resp.status, body);
      return res.status(500).json({ error: "Failed to send email" });
    }

    const data = await resp.json();
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("notifyOfferAccepted error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
