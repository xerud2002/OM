import { Resend } from 'resend';

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
}: SendEmailOptions): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.NOTIFY_FROM_EMAIL || 'info@ofertemutare.ro';
    const adminEmail = process.env.RESEND_ADMIN_EMAIL || 'info@ofertemutare.ro';

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
      console.error('[Resend Error]', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Email Send Error]', err);
    return { success: false, error: String(err) };
  }
}

// Email templates
export const emailTemplates = {
  guestRequestConfirmation: (requestCode: string, name: string, from: string, to: string, movingDate: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #0ea5e9); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Cererea ta a fost înregistrată!</h1>
          </div>
          <div class="content">
            <p>Bună ${name},</p>
            <p>Cererea ta de mutare a fost primită cu succes și este acum vizibilă pentru companiile partenere.</p>
            
            <div class="info-box">
              <strong>Cod cerere:</strong> ${requestCode}<br>
              <strong>Rută:</strong> ${from} → ${to}<br>
              <strong>Data mutării:</strong> ${movingDate}
            </div>
            
            <h3>📞 Următorii pași:</h3>
            <ol>
              <li>3-5 companii de mutări vor vedea cererea ta în următoarele 24-48h</li>
              <li>Vei primi oferte direct pe telefon sau email</li>
              <li>Compară ofertele și alege compania care ți se potrivește cel mai bine</li>
            </ol>
            
            <p><strong>✅ Nu trebuie să faci nimic altceva - așteaptă contactul companiilor!</strong></p>
          </div>
          <div class="footer">
            <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
            <p>Ai întrebări? Răspunde la acest email sau contactează-ne la <a href="mailto:support@ofertemutare.ro">support@ofertemutare.ro</a></p>
          </div>
        </div>
      </body>
    </html>
  `,

  newOffer: (requestCode: string, companyName: string, price: number) => `
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
          .price { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Ai primit o ofertă nouă!</h1>
          </div>
          <div class="content">
            <p>Bună ziua,</p>
            <p>Ai primit o ofertă nouă pentru cererea ta <strong>${requestCode}</strong>:</p>
            
            <p><strong>Companie:</strong> ${companyName}</p>
            <div class="price">${price} RON</div>
            
            <p>Compania te va contacta în curând pentru detalii suplimentare.</p>
            <p>Mult succes cu mutarea!</p>
          </div>
          <div class="footer">
            <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
            <p>Ai întrebări? Contactează-ne la <a href="mailto:support@ofertemutare.ro">support@ofertemutare.ro</a></p>
          </div>
        </div>
      </body>
    </html>
  `,

  offerAccepted: (requestCode: string, customerName: string, customerPhone: string, customerEmail: string) => `
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
          .contact-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Oferta ta a fost acceptată!</h1>
          </div>
          <div class="content">
            <p>Felicitări!</p>
            <p>Clientul <strong>${customerName}</strong> a acceptat oferta ta pentru cererea <strong>${requestCode}</strong>.</p>
            
            <div class="contact-box">
              <h3>📞 Date de contact client:</h3>
              <p><strong>Nume:</strong> ${customerName}</p>
              <p><strong>Telefon:</strong> <a href="tel:${customerPhone}">${customerPhone}</a></p>
              <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            </div>
            
            <h3>Următorii pași:</h3>
            <ol>
              <li>Contactează clientul pentru confirmare și detalii finale</li>
              <li>Stabilește detaliile mutării (oră, adrese exacte, servicii suplimentare)</li>
              <li>Planifică logistica necesară</li>
            </ol>
            
            <p>Mult succes cu această mutare!</p>
          </div>
          <div class="footer">
            <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
            <p>Support: <a href="mailto:support@ofertemutare.ro">support@ofertemutare.ro</a></p>
          </div>
        </div>
      </body>
    </html>
  `,

  contactForm: (name: string, email: string, phone: string, message: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
          .header { background: #064e3b; padding: 20px; color: white; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .field { margin: 15px 0; padding: 15px; background: #f9fafb; border-left: 4px solid #10b981; }
          .label { font-weight: bold; color: #064e3b; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 Mesaj nou din Contact Form</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nume:</div>
              <div>${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
              <div class="label">Telefon:</div>
              <div><a href="tel:${phone}">${phone || 'Nu a furnizat'}</a></div>
            </div>
            <div class="field">
              <div class="label">Mesaj:</div>
              <div>${message}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,
};
