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
            <p>Ai întrebări? Răspunde la acest email sau contactează-ne la <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a></p>
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
            <p>Ai întrebări? Contactează-ne la <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a></p>
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
            <p>Support: <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a></p>
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

  // NEW: Notification to companies about new moving request
  newRequestNotification: (requestCode: string, from: string, to: string, movingDate: string, furniture: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #0284c7); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin: 10px 0; }
          .info-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
          .info-label { font-weight: bold; color: #065f46; min-width: 120px; }
          .cta { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
          .cta:hover { background: linear-gradient(135deg, #059669, #047857); }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 Cerere Nouă de Mutare!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">O nouă oportunitate de business te așteaptă</p>
          </div>
          <div class="content">
            <div class="badge">Cerere #${requestCode}</div>
            
            <p style="font-size: 18px; margin: 20px 0;">Ai o nouă cerere de mutare care așteaptă oferta ta!</p>
            
            <div class="info-box">
              <div class="info-row">
                <div class="info-label">📍 Din:</div>
                <div><strong>${from}</strong></div>
              </div>
              <div class="info-row">
                <div class="info-label">📍 În:</div>
                <div><strong>${to}</strong></div>
              </div>
              <div class="info-row">
                <div class="info-label">📅 Data:</div>
                <div><strong>${movingDate}</strong></div>
              </div>
              <div class="info-row" style="border-bottom: none;">
                <div class="info-label">📦 Mobilier:</div>
                <div>${furniture}</div>
              </div>
            </div>

            <p style="color: #059669; font-weight: bold; font-size: 16px;">⚡ Acționează rapid! Primele oferte au șanse mai mari de a fi acceptate.</p>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ofertemutare.ro'}/company/dashboard" class="cta">
                Trimite Oferta Acum →
              </a>
            </div>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              💡 <strong>Sfat:</strong> Oferă un preț competitiv și răspunde profesionist pentru a crește șansele de câștig.
            </p>
          </div>
          <div class="footer">
            <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
            <p>Ai întrebări? Contactează-ne la <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a></p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Notify company that their offer was declined (customer accepted another offer)
  offerDeclined: (requestCode: string, companyName: string, customerName: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6b7280, #4b5563); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .badge { display: inline-block; background: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin: 10px 0; }
          .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Update Ofertă</h1>
          </div>
          <div class="content">
            <div class="badge">Cerere #${requestCode}</div>
            
            <p style="font-size: 18px; margin: 20px 0;">Bună ${companyName},</p>
            
            <p>Clientul <strong>${customerName}</strong> a acceptat o altă ofertă pentru cererea <strong>${requestCode}</strong>.</p>
            
            <div class="info-box">
              <p style="margin: 0;"><strong>💡 Nu te descuraja!</strong></p>
              <p style="margin: 10px 0 0 0;">Fiecare cerere e o oportunitate de învățare. Continuă să oferi prețuri competitive și servicii de calitate - următoarea poate fi a ta!</p>
            </div>

            <p style="color: #059669; font-weight: bold;">🚀 Află despre cereri noi pe <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ofertemutare.ro'}/company/dashboard" style="color: #059669;">dashboard</a>.</p>
          </div>
          <div class="footer">
            <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
            <p>Ai întrebări? Contactează-ne la <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a></p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Remind customer about pending offers
  offerReminder: (requestCode: string, customerName: string, offerCount: number, dashboardLink: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin: 10px 0; }
          .offer-count { font-size: 48px; font-weight: bold; color: #f59e0b; text-align: center; margin: 20px 0; }
          .cta { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
          .cta:hover { background: linear-gradient(135deg, #d97706, #b45309); }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Ai Oferte în Așteptare!</h1>
          </div>
          <div class="content">
            <div class="badge">Cerere #${requestCode}</div>
            
            <p style="font-size: 18px; margin: 20px 0;">Bună ${customerName},</p>
            
            <p>Ai primit <strong>${offerCount} ${offerCount === 1 ? 'ofertă' : 'oferte'}</strong> pentru mutarea ta!</p>
            
            <div class="offer-count">${offerCount}</div>
            
            <p style="text-align: center; font-size: 16px; color: #6b7280;">
              ${offerCount === 1 ? 'ofertă disponibilă' : 'oferte disponibile'}
            </p>

            <p style="margin-top: 30px;">📊 <strong>Compară ofertele</strong> și alege pe cea mai bună pentru nevoile tale:</p>
            <ul style="color: #6b7280;">
              <li>Vezi detaliile fiecărei oferte</li>
              <li>Verifică review-urile companiilor</li>
              <li>Contactează companiile pentru detalii</li>
            </ul>

            <div style="text-align: center;">
              <a href="${dashboardLink}" class="cta">
                Vezi Ofertele Acum →
              </a>
            </div>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
              ⚡ <strong>Sfat:</strong> Companiile așteaptă răspunsul tău. Cu cât accep ți mai repede, cu atât îți asiguri disponibilitatea la data dorită.
            </p>
          </div>
          <div class="footer">
            <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
            <p>Ai întrebări? Contactează-ne la <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a></p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Notify customer about new message from company
  newMessageFromCompany: (companyName: string, messagePreview: string, conversationLink: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .message-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px; font-style: italic; }
          .cta { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Mesaj Nou de la ${companyName}</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; margin: 20px 0;">Ai primit un mesaj nou!</p>
            
            <div class="message-box">
              "${messagePreview}"
            </div>

            <div style="text-align: center;">
              <a href="${conversationLink}" class="cta">
                Răspunde Acum →
              </a>
            </div>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              💡 Răspunde rapid pentru a finaliza detaliile mutării tale.
            </p>
          </div>
          <div class="footer">
            <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
            <p>Ai întrebări? Contactează-ne la <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a></p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Notify company about new message from customer
  newMessageFromCustomer: (customerName: string, requestCode: string, messagePreview: string, conversationLink: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin: 10px 0; }
          .message-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; font-style: italic; }
          .cta { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Mesaj Nou de la Client</h1>
          </div>
          <div class="content">
            <div class="badge">Cerere #${requestCode}</div>
            
            <p style="font-size: 18px; margin: 20px 0;">Clientul <strong>${customerName}</strong> ți-a trimis un mesaj!</p>
            
            <div class="message-box">
              "${messagePreview}"
            </div>

            <div style="text-align: center;">
              <a href="${conversationLink}" class="cta">
                Răspunde Clientului →
              </a>
            </div>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              ⚡ Răspunde rapid și profesionist pentru a asigura această mutare!
            </p>
          </div>
          <div class="footer">
            <p><strong>OferteMutare.ro</strong> - Platforma #1 pentru mutări în România</p>
            <p>Ai întrebări? Contactează-ne la <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a></p>
          </div>
        </div>
      </body>
    </html>
  `,
};
