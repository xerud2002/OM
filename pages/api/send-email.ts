import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail, emailTemplates, escapeHtml } from "@/services/email";
import { apiSuccess, apiError, ErrorCodes } from "@/types/api";
import { logger } from "@/utils/logger";
import { validateInternalSecret, withErrorHandler } from "@/lib/apiAuth";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";

// Types that can be called from the browser without an API secret
const PUBLIC_TYPES = ["contactForm"];

// Rate limit public endpoints (3 per minute per IP)
const isRateLimited = createRateLimiter({ name: "sendEmail", max: 3, windowMs: 60_000 });

export default withErrorHandler(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  const { type, data } = req.body;

  if (!type || !data) {
    return res
      .status(400)
      .json(apiError("Missing type or data", ErrorCodes.BAD_REQUEST));
  }

  // Rate limit public types only (internal calls are already authenticated)
  if (PUBLIC_TYPES.includes(type) && isRateLimited(getClientIp(req))) {
    return res.status(429).json(apiError("Prea multe cereri. Încercați din nou peste un minut."));
  }

  // Protect non-public types with INTERNAL_API_SECRET (uses boot-time validated secret)
  if (!PUBLIC_TYPES.includes(type)) {
    const secretCheck = validateInternalSecret(req);
    if (!secretCheck.valid) {
      return res
        .status(secretCheck.status)
        .json(apiError(secretCheck.error, secretCheck.code));
    }
  }

  // Validate contactForm fields
  if (type === "contactForm") {
    if (!data.name || !data.email || !data.message) {
      return res
        .status(400)
        .json(
          apiError("Missing required contact fields", ErrorCodes.BAD_REQUEST),
        );
    }
    // T17: Input length limits
    if (typeof data.name === "string" && data.name.length > 100) {
      return res.status(400).json(apiError("Numele este prea lung (max 100 caractere)", ErrorCodes.BAD_REQUEST));
    }
    if (typeof data.message === "string" && data.message.length > 5000) {
      return res.status(400).json(apiError("Mesajul este prea lung (max 5000 caractere)", ErrorCodes.BAD_REQUEST));
    }
    if (typeof data.email === "string" && data.email.length > 254) {
      return res.status(400).json(apiError("Email-ul este prea lung", ErrorCodes.BAD_REQUEST));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res
        .status(400)
        .json(apiError("Invalid email format", ErrorCodes.BAD_REQUEST));
    }
  }

  try {
    let emailResult;

    switch (type) {
      case "guestRequestConfirmation":
        emailResult = await sendEmail({
          to: data.email,
          subject: `✅ Cererea ta de mutare #${data.requestCode} a fost înregistrată`,
          html: emailTemplates.guestRequestConfirmation(
            data.requestCode,
            data.name,
            data.from,
            data.to,
            data.movingDate,
          ),
        });
        break;

      case "newOffer":
        emailResult = await sendEmail({
          to: data.customerEmail,
          subject: `🎉 Ofertă nouă pentru mutarea ${data.fromCity} → ${data.toCity} - ${data.companyName}`,
          html: emailTemplates.newOffer({
            requestCode: data.requestCode,
            requestId: data.requestId,
            companyName: data.companyName,
            companyMessage: data.companyMessage,
            price: data.price,
            fromCity: data.fromCity,
            toCity: data.toCity,
            moveDate: data.moveDate,
            dashboardUrl:
              data.dashboardUrl ||
              `https://ofertemutare.ro/customer/dashboard?requestId=${data.requestId}`,
          }),
        });
        break;

      case "offerAccepted":
        emailResult = await sendEmail({
          to: data.companyEmail,
          subject: `✅ Oferta acceptată - ${data.requestCode}`,
          html: emailTemplates.offerAccepted(
            data.requestCode,
            data.customerName,
            data.customerPhone,
            data.customerEmail,
          ),
        });
        break;

      case "contactForm":
        emailResult = await sendEmail({
          to: process.env.RESEND_ADMIN_EMAIL || "info@ofertemutare.ro",
          subject: `[OferteMutare] Contact nou de la ${data.name}`,
          html: emailTemplates.contactForm(
            data.name,
            data.email,
            data.phone,
            data.message,
          ),
          replyTo: data.email,
        });
        break;

      case "reviewRequest":
        {
          const safeName = escapeHtml(data.customerName || "");
          const safeCompany = escapeHtml(data.companyName || "");
          const safeUrl = escapeHtml(data.reviewUrl || "");
          emailResult = await sendEmail({
            to: data.customerEmail,
            subject: `Cum a fost experiența ta cu ${safeCompany}? Lasă o recenzie!`,
            html: `
            <!DOCTYPE html>
            <html lang="ro">
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #10b981, #0ea5e9); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
                  .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
                  .highlight { background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
                  .button { display: inline-block; background: #10b981; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
                  .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
                  .stars { margin: 15px 0; }
                  .star { display: inline-block; width: 28px; height: 28px; margin: 0 3px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="stars">
                      <svg class="star" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <svg class="star" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <svg class="star" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <svg class="star" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <svg class="star" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <h1 style="margin: 0;">Părerea ta contează!</h1>
                  </div>
                  <div class="content">
                    <p>Bună ${safeName},</p>
                    
                    <p>Ai ales oferta de la <strong>${safeCompany}</strong> pentru mutarea ta. Sperăm că totul a decurs conform așteptărilor!</p>
                    
                    <div class="highlight">
                      <p style="margin: 0;"><strong>🎯 Te rugăm să lași o recenzie pentru ${safeCompany}</strong></p>
                      <p style="margin: 10px 0 0 0; font-size: 14px;">Feedback-ul tău ajută alți clienți să ia decizii informate și ajută companiile să își îmbunătățească serviciile.</p>
                    </div>
                    
                    <p>Durează doar 1-2 minute și înseamnă foarte mult pentru comunitatea noastră!</p>
                    
                    <p style="text-align: center;">
                      <a href="${safeUrl}" class="button">✍️ Lasă o Recenzie Acum</a>
                    </p>
                    
                    <p style="color: #6b7280; font-size: 14px;">Poți evalua: profesionalismul echipei, punctualitatea, grija față de obiectele tale și raportul calitate-preț.</p>
                  </div>
                  <div class="footer">
                    <p>Îți mulțumim pentru încredere!</p>
                    <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
                  </div>
                </div>
              </body>
            </html>
          `,
          });
        }
        break;

      case "uploadReminder":
        {
          const safeName = escapeHtml(data.name || "");
          const safeCode = escapeHtml(data.requestCode || "");
          const safeUploadUrl = escapeHtml(data.uploadUrl || "");
          emailResult = await sendEmail({
            to: data.email,
            subject: `📸 Reminder: Încarcă poze pentru cererea ${safeCode}`,
            html: `
            <!DOCTYPE html>
            <html lang="ro">
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #10b981, #0ea5e9); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
                  .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
                  .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                  .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>📸 Nu uita să încarci pozele!</h1>
                  </div>
                  <div class="content">
                    <p>Bună ${safeName},</p>
                    <p>Te rugăm să încarci poze cu obiectele de mutat pentru cererea <strong>${safeCode}</strong>.</p>
                    <p>Pozele ajută companiile să îți ofere prețuri mai precise.</p>
                    <p style="text-align: center;">
                      <a href="${safeUploadUrl}" class="button">Încarcă Poze Acum</a>
                    </p>
                  </div>
                  <div class="footer">
                    <p><strong>OferteMutare.ro</strong></p>
                  </div>
                </div>
              </body>
            </html>
          `,
          });
        }
        break;

      case "newRequestNotification":
        // Send to company about new request available
        emailResult = await sendEmail({
          to: data.companyEmail,
          subject: `🚚 Cerere nouă de mutare disponibilă - ${data.requestCode}`,
          html: emailTemplates.newRequestNotification(
            data.requestCode,
            data.from,
            data.to,
            data.movingDate,
            data.furniture,
          ),
        });
        break;

      case "offerDeclined":
        // Notify company that their offer was declined
        emailResult = await sendEmail({
          to: data.companyEmail,
          subject: `Ofertă respinsă - ${data.requestCode}`,
          html: emailTemplates.offerDeclined(
            data.requestCode,
            data.companyName,
            data.customerName,
          ),
        });
        break;

      case "offerReminder":
        // Remind customer about pending offers
        emailResult = await sendEmail({
          to: data.customerEmail,
          subject: `⏰ Ai ${data.offerCount} ${data.offerCount === 1 ? "ofertă" : "oferte"} în așteptare - ${data.requestCode}`,
          html: emailTemplates.offerReminder(
            data.requestCode,
            data.customerName,
            data.offerCount,
            data.dashboardLink,
          ),
        });
        break;

      case "newMessageFromCompany":
        // Notify customer about new message from company
        emailResult = await sendEmail({
          to: data.customerEmail,
          subject: `💬 Mesaj nou de la ${data.companyName}`,
          html: emailTemplates.newMessageFromCompany(
            data.companyName,
            data.messagePreview,
            data.conversationLink,
          ),
        });
        break;

      case "newMessageFromCustomer":
        // Notify company about new message from customer
        emailResult = await sendEmail({
          to: data.companyEmail,
          subject: `💬 Mesaj nou de la ${data.customerName} - ${data.requestCode}`,
          html: emailTemplates.newMessageFromCustomer(
            data.customerName,
            data.requestCode,
            data.messagePreview,
            data.conversationLink,
          ),
        });
        break;

      default:
        return res
          .status(400)
          .json(apiError("Invalid email type", ErrorCodes.BAD_REQUEST));
    }

    if (!emailResult.success) {
      return res
        .status(500)
        .json(
          apiError(
            emailResult.error || "Email sending failed",
            ErrorCodes.INTERNAL_ERROR,
          ),
        );
    }

    return res.status(200).json(apiSuccess({ emailId: emailResult.id }));
  } catch (error) {
    logger.error("[Send Email API Error]", error);
    return res
      .status(500)
      .json(apiError("Server error", ErrorCodes.INTERNAL_ERROR));
  }
});
