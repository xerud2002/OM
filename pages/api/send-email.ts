import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail, emailTemplates } from '@/services/email';
import { apiSuccess, apiError, ErrorCodes } from '@/types/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiError('Method Not Allowed'));
  }

  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json(apiError('Missing type or data', ErrorCodes.BAD_REQUEST));
  }

  try {
    let emailResult;

    switch (type) {
      case 'guestRequestConfirmation':
        emailResult = await sendEmail({
          to: data.email,
          subject: `✅ Cererea ta de mutare #${data.requestCode} a fost înregistrată`,
          html: emailTemplates.guestRequestConfirmation(
            data.requestCode,
            data.name,
            data.from,
            data.to,
            data.movingDate
          ),
        });
        break;

      case 'newOffer':
        emailResult = await sendEmail({
          to: data.customerEmail,
          subject: `🎉 Ofertă nouă pentru ${data.requestCode} - ${data.companyName}`,
          html: emailTemplates.newOffer(data.requestCode, data.companyName, data.price),
        });
        break;

      case 'offerAccepted':
        emailResult = await sendEmail({
          to: data.companyEmail,
          subject: `✅ Oferta acceptată - ${data.requestCode}`,
          html: emailTemplates.offerAccepted(
            data.requestCode,
            data.customerName,
            data.customerPhone,
            data.customerEmail
          ),
        });
        break;

      case 'contactForm':
        emailResult = await sendEmail({
          to: process.env.RESEND_ADMIN_EMAIL || 'info@ofertemutare.ro',
          subject: `[OferteMutare] Contact nou de la ${data.name}`,
          html: emailTemplates.contactForm(data.name, data.email, data.phone, data.message),
          replyTo: data.email,
        });
        break;

      case 'reviewRequest':
        emailResult = await sendEmail({
          to: data.customerEmail,
          subject: `Spune-ne părerea ta despre mutarea cu ${data.companyName}`,
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
                    <h1>⭐ Cum a fost mutarea?</h1>
                  </div>
                  <div class="content">
                    <p>Bună ${data.customerName},</p>
                    <p>Sperăm că mutarea cu <strong>${data.companyName}</strong> a decurs bine!</p>
                    <p>Ne-ar ajuta enorm dacă ne-ai putea spune părerea ta. Feedback-ul tău îi ajută pe alți utilizatori să ia cele mai bune decizii.</p>
                    <p style="text-align: center;">
                      <a href="${data.reviewUrl}" class="button">Lasă un review</a>
                    </p>
                    <p>Îți mulțumim pentru timpul acordat!</p>
                  </div>
                  <div class="footer">
                    <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
        break;

      case 'uploadReminder':
        emailResult = await sendEmail({
          to: data.email,
          subject: `📸 Reminder: Încarcă poze pentru cererea ${data.requestCode}`,
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
                    <p>Bună ${data.name},</p>
                    <p>Te rugăm să încarci poze cu obiectele de mutat pentru cererea <strong>${data.requestCode}</strong>.</p>
                    <p>Pozele ajută companiile să îți ofere prețuri mai precise.</p>
                    <p style="text-align: center;">
                      <a href="${data.uploadUrl}" class="button">Încarcă Poze Acum</a>
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
        break;

      case 'newRequestNotification':
        // Send to company about new request available
        emailResult = await sendEmail({
          to: data.companyEmail,
          subject: `🚚 Cerere nouă de mutare disponibilă - ${data.requestCode}`,
          html: emailTemplates.newRequestNotification(
            data.requestCode,
            data.from,
            data.to,
            data.movingDate,
            data.furniture
          ),
        });
        break;

      default:
        return res.status(400).json(apiError('Invalid email type', ErrorCodes.BAD_REQUEST));
    }

    if (!emailResult.success) {
      return res.status(500).json(apiError(emailResult.error || 'Email sending failed', ErrorCodes.INTERNAL_ERROR));
    }

    return res.status(200).json(apiSuccess({ emailId: emailResult.id }));
  } catch (error) {
    console.error('[Send Email API Error]', error);
    return res.status(500).json(apiError('Server error', ErrorCodes.INTERNAL_ERROR));
  }
}
