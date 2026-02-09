import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { sendEmail } from "@/services/email";
import { logger } from "@/utils/logger";
import { apiError, apiSuccess } from "@/types/api";

/**
 * API pentru verificarea token-urilor nefolosite și trimiterea reminder-elor
 * Rulează periodic (cron job) pentru a verifica token-uri create acum 3+ zile și nefolosite
 *
 * USAGE:
 * - Setează un cron job care apelează: GET /api/sendUploadReminders
 * - Sau rulează manual pentru testare
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  // Auth: Always require API key (fail closed)
  const apiKey = req.headers["x-api-key"];
  const cronApiKey = process.env.CRON_API_KEY;
  if (!cronApiKey || apiKey !== cronApiKey) {
    return res.status(401).json(apiError("Unauthorized"));
  }

  try {
    if (!adminReady) {
      return res
        .status(503)
        .json(apiError("Admin not configured in this environment"));
    }

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Query via Admin SDK
    const tokensSnap = await adminDb
      .collection("uploadTokens")
      .where("used", "==", false)
      .get();

    const reminders: Array<{ email: string; name: string; link: string }> = [];
    const now = new Date();
    let sentCount = 0;
    let failedCount = 0;

    for (const tokenDoc of tokensSnap.docs) {
      const tokenData = tokenDoc.data() as any;
      const createdAt = tokenData.createdAt
        ? new Date(tokenData.createdAt)
        : null;
      const expiresAt = tokenData.expiresAt
        ? new Date(tokenData.expiresAt)
        : null;
      if (!createdAt || !expiresAt) continue;

      if (
        createdAt <= threeDaysAgo &&
        now <= expiresAt &&
        !tokenData.reminderSent
      ) {
        const reminderInfo = {
          email: tokenData.customerEmail,
          name: tokenData.customerName,
          link: tokenData.uploadLink,
        };
        reminders.push(reminderInfo);

        // Send reminder email directly via sendEmail service (no circular HTTP call)
        try {
          const emailResult = await sendEmail({
            to: tokenData.customerEmail,
            subject: `📸 Reminder: Încarcă poze pentru cererea ${tokenData.requestId || "ta"}`,
            html: `
              <!DOCTYPE html>
              <html lang="ro">
                <head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#10b981,#0ea5e9);padding:30px;text-align:center;color:white;border-radius:8px 8px 0 0}.content{background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none}.button{display:inline-block;background:#10b981;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;margin:20px 0}.footer{text-align:center;padding:20px;color:#6b7280;font-size:14px}</style></head>
                <body><div class="container"><div class="header"><h1>📸 Nu uita să încarci pozele!</h1></div><div class="content"><p>Bună ${tokenData.customerName || ""},</p><p>Te rugăm să încarci poze cu obiectele de mutat pentru cererea <strong>${tokenData.requestId || "ta"}</strong>.</p><p>Pozele ajută companiile să îți ofere prețuri mai precise.</p><p style="text-align:center"><a href="${tokenData.uploadLink}" class="button">Încarcă Poze Acum</a></p></div><div class="footer"><p><strong>OferteMutare.ro</strong></p></div></div></body>
              </html>
            `,
          });

          if (!emailResult.success) {
            throw new Error(emailResult.error || "Email sending failed");
          }

          // Mark reminder as sent
          await adminDb.collection("uploadTokens").doc(tokenDoc.id).update({
            reminderSent: true,
            reminderSentAt: new Date().toISOString(),
          });

          sentCount++;
        } catch (emailError) {
          logger.error(
            `Failed to send reminder to ${tokenData.customerEmail}:`,
            emailError,
          );
          failedCount++;
        }
      }
    }

    return res.status(200).json(
      apiSuccess({
        total: reminders.length,
        sent: sentCount,
        failed: failedCount,
        reminders,
      }),
    );
  } catch (error) {
    logger.error("Error checking upload reminders:", error);
    return res.status(500).json(apiError("Internal server error"));
  }
}
