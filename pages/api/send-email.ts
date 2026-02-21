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
        emailResult = await sendEmail({
          to: data.customerEmail,
          subject: `Cum a fost experiența ta cu ${escapeHtml(data.companyName || "")}? Lasă o recenzie!`,
          html: emailTemplates.reviewRequest(
            data.customerName || "",
            data.companyName || "",
            data.reviewUrl || "",
          ),
        });
        break;

      case "uploadReminder":
        emailResult = await sendEmail({
          to: data.email,
          subject: `📸 Reminder: Încarcă poze pentru cererea ${escapeHtml(data.requestCode || "")}`,
          html: emailTemplates.uploadReminder(
            data.name || "",
            data.requestCode || "",
            data.uploadUrl || "",
          ),
        });
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
