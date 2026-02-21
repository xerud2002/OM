import { Resend } from "resend";
import { logger } from "@/utils/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  cc,
  bcc,
}: SendEmailOptions): Promise<{
  success: boolean;
  error?: string;
  id?: string;
}> {
  try {
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      process.env.NOTIFY_FROM_EMAIL ||
      "info@ofertemutare.ro";
    const adminEmail = process.env.RESEND_ADMIN_EMAIL || "info@ofertemutare.ro";

    const { data, error } = await resend.emails.send({
      from: `OferteMutare.ro <${fromEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: replyTo || adminEmail,
      cc,
      bcc,
    });

    if (error) {
      logger.error("[Resend Error]", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    logger.error("[Email Send Error]", err);
    return { success: false, error: String(err) };
  }
}

/* ==========================================================================
   Email Template System — Inline-style, table-based layout
   Compatible with Gmail, Outlook (desktop + web), Apple Mail, Yahoo Mail
   ========================================================================== */

// Sanitize user-provided strings before interpolating into HTML
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Helper to escape all string values in a data object
function escapeData<T extends Record<string, unknown>>(data: T): T {
  const escaped = { ...data };
  for (const key of Object.keys(escaped)) {
    if (typeof escaped[key] === "string") {
      (escaped as Record<string, unknown>)[key] = escapeHtml(
        escaped[key] as string,
      );
    }
  }
  return escaped;
}

// ── Shared base layout ────────────────────────────────────────────────────
// Every email goes through this wrapper: doctype, MSO conditionals, outer
// table, branded header, content slot, footer with unsubscribe.

interface BaseLayoutOptions {
  preheader: string;
  headerBg?: string;           // default: green gradient
  headerBorderColor?: string;  // default: #10b981
  title: string;
  subtitle?: string;
  subtitleColor?: string;      // default: #d1fae5
  body: string;                // raw HTML for the content area
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ofertemutare.ro";

function baseLayout({
  preheader,
  headerBg = "#064e3b",
  headerBorderColor = "#10b981",
  title,
  subtitle,
  subtitleColor = "#d1fae5",
  body,
}: BaseLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="ro" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript><xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;word-spacing:normal;background-color:#f3f4f6;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <!-- Preheader (visible in inbox preview, hidden in email body) -->
  <div style="display:none;font-size:1px;color:#f3f4f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${escapeHtml(preheader)}&#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;
  </div>
  <!-- Outer wrapper table -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:0;margin:0;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background:${headerBg};border-bottom:3px solid ${headerBorderColor};padding:44px 40px 36px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.3;">
                ${title}
              </h1>
              ${subtitle ? `<p style="margin:10px 0 0 0;color:${subtitleColor};font-size:15px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.4;">${subtitle}</p>` : ""}
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.7;color:#1f2937;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:28px 40px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
              <p style="margin:0 0 6px 0;font-size:15px;font-weight:600;color:#111827;">OferteMutare.ro</p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#6b7280;line-height:1.5;">
                Asistență: <a href="mailto:info@ofertemutare.ro" style="color:#059669;text-decoration:none;">info@ofertemutare.ro</a>
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                Dacă nu mai dorești să primești aceste emailuri,
                <a href="mailto:info@ofertemutare.ro?subject=Dezabonare" style="color:#9ca3af;text-decoration:underline;">contactează-ne</a>.
              </p>
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Reusable component helpers ────────────────────────────────────────────

/** CTA button with VML fallback for Outlook */
function emailButton(text: string, href: string, bgColor = "#064e3b"): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
  <tr>
    <td align="center" style="border-radius:8px;background-color:${bgColor};">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:52px;v-text-anchor:middle;width:260px;" arcsize="15%" strokeweight="0" fillcolor="${bgColor}">
        <w:anchorlock/>
        <center style="color:#ffffff;font-family:'Segoe UI',Tahoma,sans-serif;font-size:16px;font-weight:bold;">${text}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${href}" target="_blank" style="display:inline-block;background-color:${bgColor};color:#ffffff !important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:8px;line-height:1.2;">
        ${text}
      </a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
}

/** Table-based card with label/value rows */
function emailCard(rows: { label: string; value: string }[]): string {
  const rowsHtml = rows
    .map(
      (r, i) => `
    <tr>
      <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;width:130px;vertical-align:top;${i < rows.length - 1 ? "border-bottom:1px solid #e5e7eb;" : ""}">${r.label}</td>
      <td style="padding:12px 16px;font-size:15px;color:#111827;font-weight:500;${i < rows.length - 1 ? "border-bottom:1px solid #e5e7eb;" : ""}">${r.value}</td>
    </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin:24px 0;">
  ${rowsHtml}
</table>`;
}

/** Numbered step list using table cells */
function emailSteps(title: string, items: string[], numberBg = "#064e3b"): string {
  const stepsHtml = items
    .map(
      (item, i) => `
    <tr>
      <td style="padding:14px 12px 14px 0;vertical-align:top;width:36px;${i < items.length - 1 ? "border-bottom:1px solid #f3f4f6;" : ""}">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="width:28px;height:28px;border-radius:50%;background-color:${numberBg};color:#ffffff;font-size:13px;font-weight:700;text-align:center;line-height:28px;">${i + 1}</td>
        </tr></table>
      </td>
      <td style="padding:14px 0;color:#4b5563;font-size:15px;line-height:1.5;${i < items.length - 1 ? "border-bottom:1px solid #f3f4f6;" : ""}">${item}</td>
    </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
  <tr><td colspan="2" style="padding-bottom:14px;font-size:13px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(title)}</td></tr>
  ${stepsHtml}
</table>`;
}

/** Left-bordered highlight box */
function emailHighlight(text: string, bgColor = "#ecfdf5", borderColor = "#10b981", textColor = "#065f46"): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background-color:${bgColor};border-left:4px solid ${borderColor};padding:18px 20px;border-radius:0 6px 6px 0;">
      <p style="margin:0;color:${textColor};font-size:15px;font-weight:500;line-height:1.5;">${text}</p>
    </td>
  </tr>
</table>`;
}

/** Left-bordered tip box (amber) */
function emailTip(text: string): string {
  return emailHighlight(text, "#fef3c7", "#f59e0b", "#92400e");
}

/** Quoted message preview */
function emailQuote(text: string, bgColor = "#eff6ff", borderColor = "#3b82f6", textColor = "#1e40af"): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background-color:${bgColor};border-left:4px solid ${borderColor};padding:20px 24px;border-radius:0 6px 6px 0;">
      <p style="margin:0;color:${textColor};font-size:15px;font-style:italic;line-height:1.6;">&bdquo;${text}&rdquo;</p>
    </td>
  </tr>
</table>`;
}

/** Large number badge (for offer counts, prices, etc.) */
function emailBadge(value: string | number, label: string, color = "#064e3b"): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px auto;text-align:center;">
  <tr><td style="font-size:56px;font-weight:700;color:${color};letter-spacing:-2px;line-height:1;">${value}</td></tr>
  <tr><td style="padding-top:8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">${label}</td></tr>
</table>`;
}

/** Reference code block */
function emailReference(label: string, value: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
  <tr>
    <td style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 24px;text-align:center;">
      <p style="margin:0 0 4px 0;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(label)}</p>
      <p style="margin:0;font-size:18px;color:#111827;font-weight:700;letter-spacing:0.5px;">${escapeHtml(value)}</p>
    </td>
  </tr>
</table>`;
}

// ── Email templates ───────────────────────────────────────────────────────

export const emailTemplates = {
  // ─── 1. Guest request confirmation (to customer) ───────────────────────
  guestRequestConfirmation: (
    requestCode: string,
    name: string,
    from: string,
    to: string,
    movingDate: string,
  ) => {
    requestCode = escapeHtml(requestCode);
    name = escapeHtml(name);
    from = escapeHtml(from);
    to = escapeHtml(to);
    movingDate = escapeHtml(movingDate);

    return baseLayout({
      preheader: `Cererea #${requestCode} a fost înregistrată. Ofertele sunt pe drum!`,
      title: "Cerere Confirmată",
      subtitle: "Ofertele sunt pe drum",
      body: `
        <p style="margin:0 0 24px 0;font-size:16px;color:#1f2937;">Bună ${name},</p>
        <p style="margin:0 0 28px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Cererea ta de mutare a fost înregistrată cu succes. Companiile noastre partenere au fost notificate și vor începe să pregătească oferte personalizate.
        </p>
        ${emailCard([
          { label: "Referință", value: requestCode },
          { label: "Traseu", value: `${from} &rarr; ${to}` },
          { label: "Data mutării", value: movingDate },
        ])}
        ${emailSteps("Ce urmează", [
          "Companiile verificate analizează cererea ta",
          "Primești oferte personalizate în 24-48 ore",
          "Compari prețurile și alegi oferta potrivită",
        ])}
        ${emailHighlight("Nu mai trebuie să faci nimic. Companiile te vor contacta direct pentru a-ți prezenta ofertele.")}
      `,
    });
  },

  // ─── 2. New offer received (to customer) ───────────────────────────────
  newOffer: (data: {
    requestCode: string;
    requestId: string;
    companyName: string;
    companyMessage?: string;
    price: number;
    fromCity: string;
    toCity: string;
    moveDate?: string;
    dashboardUrl: string;
  }) => {
    data = escapeData(data) as typeof data;
    const priceFormatted = data.price.toLocaleString("ro-RO");

    return baseLayout({
      preheader: `Ofertă de ${priceFormatted} lei de la ${data.companyName} pentru ${data.fromCity} → ${data.toCity}`,
      title: "🎉 Ofertă Nouă Primită!",
      subtitle: "O companie verificată ți-a trimis o propunere",
      body: `
        <!-- Route card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin:0 0 24px 0;">
          <tr><td style="padding:16px;text-align:center;">
            <p style="margin:0;font-size:18px;font-weight:600;color:#065f46;">${data.fromCity} &rarr; ${data.toCity}</p>
            ${data.moveDate ? `<p style="margin:8px 0 0 0;font-size:14px;color:#6b7280;">📅 ${data.moveDate}</p>` : ""}
          </td></tr>
        </table>
        <p style="margin:0 0 24px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Vești bune! Ai primit o ofertă de la o companie de mutări verificată. Vezi detaliile și răspunde direct din contul tău.
        </p>
        <!-- Offer card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e5e7eb;border-radius:12px;margin:24px 0;text-align:center;background:linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);">
          <tr><td style="padding:32px 24px;">
            <p style="margin:0 0 16px 0;font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">${data.companyName}</p>
            <p style="margin:0 0 8px 0;font-size:48px;font-weight:700;color:#064e3b;letter-spacing:-2px;line-height:1;">${priceFormatted}</p>
            <p style="margin:0;font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Lei RON</p>
            ${data.companyMessage ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr><td style="background-color:#f9fafb;border-left:3px solid #10b981;padding:14px 16px;text-align:left;"><p style="margin:0;font-style:italic;color:#4b5563;font-size:14px;line-height:1.5;">&bdquo;${data.companyMessage}&rdquo;</p></td></tr></table>` : ""}
          </td></tr>
        </table>
        ${emailReference("Referință cerere", data.requestCode)}
        ${emailButton("📋 Vezi Oferta în Cont", data.dashboardUrl, "#059669")}
        ${emailTip("<strong>💡 Sfat:</strong> Recomandăm să aștepți și alte oferte pentru a putea compara. În general, primele răspunsuri apar în primele 48 de ore.")}
      `,
    });
  },

  // ─── 3. Offer accepted (to company) ────────────────────────────────────
  offerAccepted: (
    requestCode: string,
    customerName: string,
    customerPhone: string,
    customerEmail: string,
    extra?: {
      companyName?: string;
      price?: number;
      fromCity?: string;
      toCity?: string;
      rooms?: number | string;
      details?: string;
    },
  ) => {
    requestCode = escapeHtml(requestCode);
    customerName = escapeHtml(customerName);
    customerPhone = escapeHtml(customerPhone);
    customerEmail = escapeHtml(customerEmail);
    const companyName = extra?.companyName ? escapeHtml(extra.companyName) : "";
    const price = extra?.price || 0;
    const fromCity = extra?.fromCity ? escapeHtml(extra.fromCity) : "";
    const toCity = extra?.toCity ? escapeHtml(extra.toCity) : "";
    const rooms = extra?.rooms != null ? escapeHtml(String(extra.rooms)) : "";
    const details = extra?.details ? escapeHtml(extra.details) : "";
    const hasExtraDetails = fromCity || toCity || price;

    const titleText = companyName ? `🎉 Felicitări, ${companyName}!` : "Ofertă Acceptată";

    return baseLayout({
      preheader: `Clientul ${customerName} a acceptat oferta ta pentru cererea ${requestCode}. Contactează-l acum!`,
      title: titleText,
      subtitle: "Clientul a ales serviciile tale",
      body: `
        <p style="margin:0 0 28px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Felicitări! Clientul <strong style="color:#111827;">${customerName}</strong> a acceptat oferta ta pentru cererea <strong style="color:#111827;">${requestCode}</strong>.${price ? ` Preț acceptat: <strong style="color:#059669;">${price} lei</strong>.` : ""} Contactează-l cât mai curând pentru a finaliza detaliile.
        </p>
        ${hasExtraDetails ? `
        <!-- Request details card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-left:4px solid #10b981;border-radius:0 8px 8px 0;margin:0 0 28px 0;">
          <tr><td style="padding:20px;">
            <p style="margin:0 0 14px 0;color:#059669;font-size:16px;font-weight:700;">📋 Detalii cerere: ${requestCode}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${fromCity && toCity ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%;">📦 Traseu:</td><td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${fromCity} &rarr; ${toCity}</td></tr>` : ""}
              ${rooms ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">🏠 Camere:</td><td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${rooms}</td></tr>` : ""}
              ${price ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">💰 Preț acceptat:</td><td style="padding:8px 0;color:#059669;font-size:16px;font-weight:700;">${price} lei</td></tr>` : ""}
            </table>
            ${details ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid #e5e7eb;"><p style="margin:0 0 4px 0;color:#6b7280;font-size:14px;">📝 Detalii suplimentare:</p><p style="margin:0;color:#374151;font-size:14px;line-height:1.5;">${details}</p></div>` : ""}
          </td></tr>
        </table>` : ""}
        <!-- Contact card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e5e7eb;border-radius:12px;margin:0 0 28px 0;">
          <tr><td style="padding:28px;">
            <p style="margin:0 0 18px 0;font-size:13px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:0.5px;">Date de contact</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                  <p style="margin:0 0 4px 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Client</p>
                  <p style="margin:0;font-size:15px;color:#111827;font-weight:500;">${customerName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                  <p style="margin:0 0 4px 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Telefon</p>
                  <p style="margin:0;font-size:15px;font-weight:500;"><a href="tel:${customerPhone}" style="color:#059669;text-decoration:none;">${customerPhone}</a></p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;">
                  <p style="margin:0 0 4px 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
                  <p style="margin:0;font-size:15px;font-weight:500;"><a href="mailto:${customerEmail}" style="color:#059669;text-decoration:none;">${customerEmail}</a></p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
        ${emailSteps("Pași următori", [
          "Contactează clientul pentru confirmare",
          "Stabilește detaliile finale ale mutării",
          "Pregătește echipa și logistica necesară",
        ])}
        <!-- Review note -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
          <tr><td style="background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);border-radius:10px;padding:20px;text-align:center;">
            <p style="margin:0 0 8px 0;color:#92400e;font-size:15px;font-weight:700;">⭐ Review-urile contează!</p>
            <p style="margin:0;color:#78350f;font-size:14px;line-height:1.5;">
              După finalizarea mutării, clientul poate lăsa un review. Un serviciu excelent înseamnă mai multe recomandări!
            </p>
          </td></tr>
        </table>
      `,
    });
  },

  // ─── 4. Contact form (to admin) ────────────────────────────────────────
  contactForm: (
    name: string,
    email: string,
    phone: string,
    message: string,
  ) => {
    name = escapeHtml(name);
    email = escapeHtml(email);
    phone = escapeHtml(phone);
    message = escapeHtml(message);

    return baseLayout({
      preheader: `Mesaj nou de la ${name} (${email})`,
      headerBg: "#111827",
      headerBorderColor: "#374151",
      title: "Mesaj nou din formular de contact",
      body: `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:0 0 20px 0;border-bottom:1px solid #e5e7eb;">
            <p style="margin:0 0 6px 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Nume</p>
            <p style="margin:0;font-size:15px;color:#111827;line-height:1.6;">${name}</p>
          </td></tr>
          <tr><td style="padding:20px 0;border-bottom:1px solid #e5e7eb;">
            <p style="margin:0 0 6px 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Email</p>
            <p style="margin:0;font-size:15px;color:#111827;line-height:1.6;"><a href="mailto:${email}" style="color:#059669;text-decoration:none;">${email}</a></p>
          </td></tr>
          <tr><td style="padding:20px 0;border-bottom:1px solid #e5e7eb;">
            <p style="margin:0 0 6px 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Telefon</p>
            <p style="margin:0;font-size:15px;color:#111827;line-height:1.6;"><a href="tel:${phone}" style="color:#059669;text-decoration:none;">${phone || "Nu a furnizat"}</a></p>
          </td></tr>
          <tr><td style="padding:20px 0 0 0;">
            <p style="margin:0 0 6px 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Mesaj</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background-color:#f9fafb;padding:18px;border-radius:8px;border:1px solid #e5e7eb;">
              <p style="margin:0;font-size:15px;color:#111827;line-height:1.6;">${message}</p>
            </td></tr></table>
          </td></tr>
        </table>
      `,
    });
  },

  // ─── 5. New request notification (to company) ──────────────────────────
  newRequestNotification: (
    requestCode: string,
    from: string,
    to: string,
    movingDate: string,
    furniture: string,
  ) => {
    requestCode = escapeHtml(requestCode);
    from = escapeHtml(from);
    to = escapeHtml(to);
    movingDate = escapeHtml(movingDate);
    furniture = escapeHtml(furniture);

    return baseLayout({
      preheader: `Cerere nouă de mutare: ${from} → ${to} pe ${movingDate}. Trimite oferta acum!`,
      title: "Cerere Nouă Disponibilă",
      subtitle: "O nouă oportunitate de business",
      body: `
        ${emailReference("Cod cerere", requestCode)}
        <p style="margin:0 0 28px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          O nouă cerere de mutare a fost publicată pe platformă. Verifică detaliile și trimite-ți oferta pentru a intra în competiție.
        </p>
        ${emailCard([
          { label: "Plecare", value: from },
          { label: "Destinație", value: to },
          { label: "Data mutării", value: movingDate },
          { label: "Volum mobilier", value: furniture },
        ])}
        ${emailButton("Trimite Oferta", `${BASE_URL}/company/dashboard`)}
        ${emailHighlight("Primele oferte primite au de obicei șansele cele mai mari de acceptare. Răspunde rapid și profesionist pentru rezultate optime.")}
      `,
    });
  },

  // ─── 6. Offer declined (to company) ────────────────────────────────────
  offerDeclined: (
    requestCode: string,
    companyName: string,
    customerName: string,
  ) => {
    requestCode = escapeHtml(requestCode);
    companyName = escapeHtml(companyName);
    customerName = escapeHtml(customerName);

    return baseLayout({
      preheader: `Actualizare pentru cererea ${requestCode}: clientul a ales o altă ofertă.`,
      headerBg: "#6b7280",
      headerBorderColor: "#9ca3af",
      title: "Actualizare Ofertă",
      subtitle: "Clientul a ales o altă opțiune",
      subtitleColor: "#e5e7eb",
      body: `
        ${emailReference("Referință cerere", requestCode)}
        <p style="margin:0 0 20px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Bună ${companyName},
        </p>
        <p style="margin:0 0 24px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Clientul <strong style="color:#111827;">${customerName}</strong> a acceptat o altă ofertă pentru această cerere. Mulțumim pentru timpul acordat și pentru interesul arătat.
        </p>
        ${emailTip("Fiecare cerere este o oportunitate de învățare. Menține-ți standardele înalte și continuă să oferi servicii de calitate. Următoarea poate fi a ta.")}
        ${emailButton("Vezi Cereri Noi", `${BASE_URL}/company/dashboard`)}
      `,
    });
  },

  // ─── 7. Offer reminder (to customer) ───────────────────────────────────
  offerReminder: (
    requestCode: string,
    customerName: string,
    offerCount: number,
    dashboardLink: string,
  ) => {
    requestCode = escapeHtml(requestCode);
    customerName = escapeHtml(customerName);
    dashboardLink = escapeHtml(dashboardLink);

    return baseLayout({
      preheader: `Ai ${offerCount} ${offerCount === 1 ? "ofertă" : "oferte"} în așteptare pentru cererea ${requestCode}. Răspunde acum!`,
      headerBg: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
      headerBorderColor: "#fbbf24",
      title: "Oferte în Așteptare",
      subtitle: "Companiile așteaptă răspunsul tău",
      subtitleColor: "#fef3c7",
      body: `
        ${emailReference("Referință cerere", requestCode)}
        <p style="margin:0 0 8px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Bună ${customerName},
        </p>
        ${emailBadge(offerCount, offerCount === 1 ? "ofertă disponibilă" : "oferte disponibile", "#d97706")}
        <p style="margin:0 0 24px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Ai primit ${offerCount === 1 ? "o ofertă" : "multiple oferte"} pentru mutarea ta. Compară opțiunile și alege-o pe cea care se potrivește cel mai bine nevoilor tale.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
          <tr><td style="padding:12px 0;color:#4b5563;font-size:15px;border-bottom:1px solid #f3f4f6;">✓ Vezi detaliile fiecărei oferte</td></tr>
          <tr><td style="padding:12px 0;color:#4b5563;font-size:15px;border-bottom:1px solid #f3f4f6;">✓ Verifică reputația companiilor</td></tr>
          <tr><td style="padding:12px 0;color:#4b5563;font-size:15px;">✓ Contactează companiile pentru clarificări</td></tr>
        </table>
        ${emailButton("Vezi Ofertele", dashboardLink, "#d97706")}
        ${emailTip("Răspunde cât mai curând pentru a-ți asigura disponibilitatea la data dorită.")}
      `,
    });
  },

  // ─── 8. New message from company (to customer) ─────────────────────────
  newMessageFromCompany: (
    companyName: string,
    messagePreview: string,
    conversationLink: string,
  ) => {
    companyName = escapeHtml(companyName);
    messagePreview = escapeHtml(messagePreview);
    conversationLink = escapeHtml(conversationLink);

    return baseLayout({
      preheader: `${companyName}: "${messagePreview.substring(0, 80)}${messagePreview.length > 80 ? "..." : ""}"`,
      headerBg: "#1e40af",
      headerBorderColor: "#3b82f6",
      title: `Mesaj Nou de la ${companyName}`,
      subtitle: "Răspunde pentru a discuta detaliile",
      subtitleColor: "#bfdbfe",
      body: `
        <p style="margin:0 0 24px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          ${companyName} ți-a trimis un mesaj legat de cererea ta de mutare.
        </p>
        ${emailQuote(messagePreview)}
        ${emailButton("Răspunde Mesajului", conversationLink, "#1e40af")}
        ${emailHighlight("Răspunde rapid pentru a finaliza detaliile mutării tale.", "#f0f9ff", "#3b82f6", "#1e40af")}
      `,
    });
  },

  // ─── 9. New message from customer (to company) ─────────────────────────
  newMessageFromCustomer: (
    customerName: string,
    requestCode: string,
    messagePreview: string,
    conversationLink: string,
  ) => {
    customerName = escapeHtml(customerName);
    requestCode = escapeHtml(requestCode);
    messagePreview = escapeHtml(messagePreview);
    conversationLink = escapeHtml(conversationLink);

    return baseLayout({
      preheader: `Mesaj de la ${customerName} pentru cererea ${requestCode}: "${messagePreview.substring(0, 60)}..."`,
      title: "Mesaj Nou de la Client",
      subtitle: "Răspunde pentru a confirma detaliile",
      body: `
        ${emailReference("Referință cerere", requestCode)}
        <p style="margin:0 0 24px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Clientul <strong style="color:#111827;">${customerName}</strong> ți-a trimis un mesaj.
        </p>
        ${emailQuote(messagePreview, "#ecfdf5", "#10b981", "#065f46")}
        ${emailButton("Răspunde Clientului", conversationLink)}
        ${emailHighlight("Răspunde rapid și profesionist pentru a asigura această mutare.")}
      `,
    });
  },

  // ─── 10. Media upload link (to customer) ───────────────────────────────
  mediaUploadLink: (
    name: string,
    requestCode: string,
    uploadLink: string,
  ) => {
    name = escapeHtml(name);
    requestCode = escapeHtml(requestCode);
    uploadLink = escapeHtml(uploadLink);

    return baseLayout({
      preheader: `Încarcă fotografii pentru cererea #${requestCode}. Ajută firmele să-ți facă oferte mai precise.`,
      title: "Încarcă Fotografii",
      subtitle: `Cererea #${requestCode}`,
      body: `
        <p style="margin:0 0 24px 0;font-size:16px;color:#1f2937;">Bună ${name},</p>
        <p style="margin:0 0 28px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Ai ales să adaugi fotografii sau videoclipuri mai târziu pentru cererea ta de mutare. Folosește butonul de mai jos pentru a încărca fișierele. Acestea ajută firmele să-ți facă oferte mai precise.
        </p>
        ${emailButton("📸 Încarcă Fotografii / Video", uploadLink, "#059669")}
        ${emailHighlight("Pozele cu obiectele de mutat ajută firmele să estimeze mai exact volumul și costul mutării tale.")}
        <p style="margin:24px 0 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
          Link-ul este valabil 7 zile. Dacă ai nevoie de un link nou, contactează-ne la info@ofertemutare.ro.
        </p>
      `,
    });
  },

  // ─── 11. Media uploaded notification (to company) ──────────────────────
  mediaUploadedNotification: (
    companyName: string,
    requestCode: string,
    route: string,
  ) => {
    companyName = escapeHtml(companyName);
    requestCode = escapeHtml(requestCode);
    route = escapeHtml(route);

    return baseLayout({
      preheader: `Fotografii noi disponibile pentru cererea #${requestCode} (${route})`,
      title: "📸 Fotografii Noi Disponibile",
      subtitle: `Cererea #${requestCode} — ${route}`,
      body: `
        <p style="margin:0 0 16px 0;font-size:16px;color:#111827;font-weight:500;">Bună ${companyName},</p>
        <p style="margin:0 0 28px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Clientul a încărcat fotografii sau videoclipuri noi pentru cererea de mutare <strong style="color:#111827;">#${requestCode}</strong> (${route}). Verifică imaginile pentru a-ți ajusta oferta dacă este necesar.
        </p>
        ${emailHighlight("Fotografiile te ajută să estimezi mai precis volumul și complexitatea mutării.")}
        ${emailButton("Vezi Cererea", `${BASE_URL}/company/requests`)}
      `,
    });
  },

  // ─── 12. Review request (to customer) ──────────────────────────────────
  reviewRequest: (
    customerName: string,
    companyName: string,
    reviewUrl: string,
  ) => {
    customerName = escapeHtml(customerName);
    companyName = escapeHtml(companyName);
    reviewUrl = escapeHtml(reviewUrl);

    return baseLayout({
      preheader: `Cum a fost experiența ta cu ${companyName}? Lasă o recenzie în 1-2 minute.`,
      headerBg: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
      headerBorderColor: "#10b981",
      title: "⭐ Părerea ta contează!",
      subtitle: "Lasă o recenzie pentru experiența ta",
      subtitleColor: "#e0f2fe",
      body: `
        <p style="margin:0 0 20px 0;font-size:15px;color:#374151;line-height:1.6;">Bună ${customerName},</p>
        <p style="margin:0 0 20px 0;font-size:15px;color:#374151;line-height:1.6;">
          Ai ales oferta de la <strong style="color:#111827;">${companyName}</strong> pentru mutarea ta. Sperăm că totul a decurs conform așteptărilor!
        </p>
        ${emailHighlight(`<strong>🎯 Te rugăm să lași o recenzie pentru ${companyName}</strong><br style="line-height:2;">Feedback-ul tău ajută alți clienți să ia decizii informate și ajută companiile să își îmbunătățească serviciile.`)}
        <p style="margin:0 0 8px 0;font-size:15px;color:#374151;line-height:1.6;">
          Durează doar 1-2 minute și înseamnă foarte mult pentru comunitatea noastră!
        </p>
        ${emailButton("✍️ Lasă o Recenzie Acum", reviewUrl, "#10b981")}
        <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
          Poți evalua: profesionalismul echipei, punctualitatea, grija față de obiectele tale și raportul calitate-preț.
        </p>
      `,
    });
  },

  // ─── 13. Upload reminder (to customer) ─────────────────────────────────
  uploadReminder: (
    name: string,
    requestCode: string,
    uploadUrl: string,
  ) => {
    name = escapeHtml(name);
    requestCode = escapeHtml(requestCode);
    uploadUrl = escapeHtml(uploadUrl);

    return baseLayout({
      preheader: `Reminder: Încarcă poze pentru cererea ${requestCode}. Companiile vor putea face oferte mai precise.`,
      headerBg: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
      headerBorderColor: "#10b981",
      title: "📸 Nu uita să încarci pozele!",
      subtitle: `Cererea ${requestCode}`,
      subtitleColor: "#e0f2fe",
      body: `
        <p style="margin:0 0 20px 0;font-size:15px;color:#374151;line-height:1.6;">Bună ${name},</p>
        <p style="margin:0 0 20px 0;font-size:15px;color:#374151;line-height:1.6;">
          Te rugăm să încarci poze cu obiectele de mutat pentru cererea <strong style="color:#111827;">${requestCode}</strong>.
        </p>
        <p style="margin:0 0 8px 0;font-size:15px;color:#374151;line-height:1.6;">
          Pozele ajută companiile să îți ofere prețuri mai precise.
        </p>
        ${emailButton("📸 Încarcă Poze Acum", uploadUrl, "#10b981")}
      `,
    });
  },

  // ─── 14. Campaign wrapper (for admin bulk emails) ──────────────────────
  campaignWrapper: (bodyHtml: string) => {
    return baseLayout({
      preheader: "Noutăți de la OferteMutare.ro",
      title: "OferteMutare.ro",
      subtitle: "Noutăți și actualizări",
      body: bodyHtml,
    });
  },
};
