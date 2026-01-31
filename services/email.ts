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

// Email templates - Premium Style
export const emailTemplates = {
  guestRequestConfirmation: (requestCode: string, name: string, from: string, to: string, movingDate: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7; 
            color: #1f2937; 
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper { padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { 
            padding: 48px 40px 40px; 
            background: linear-gradient(180deg, #064e3b 0%, #065f46 100%);
            border-bottom: 3px solid #10b981;
          }
          .header h1 { 
            color: white; 
            font-size: 24px; 
            font-weight: 600; 
            letter-spacing: -0.5px;
            margin: 0;
          }
          .header .subtitle {
            color: #d1fae5;
            font-size: 15px;
            margin-top: 8px;
          }
          .content { padding: 40px; }
          .greeting { font-size: 16px; margin-bottom: 24px; }
          .message { color: #4b5563; font-size: 15px; margin-bottom: 32px; line-height: 1.6; }
          .card { 
            background: #f9fafb; 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 32px 0; 
          }
          .card-row { 
            display: flex; 
            padding: 10px 0; 
            border-bottom: 1px solid #e5e7eb; 
          }
          .card-row:last-child { border-bottom: none; }
          .card-label { 
            font-size: 13px; 
            font-weight: 600; 
            color: #6b7280; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
            min-width: 100px;
          }
          .card-value { font-size: 15px; color: #111827; font-weight: 500; }
          .steps { margin: 32px 0; }
          .steps-title { 
            font-size: 14px; 
            font-weight: 600; 
            color: #065f46; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
            margin-bottom: 16px;
          }
          .step { 
            padding: 16px 0; 
            color: #4b5563; 
            font-size: 15px;
            border-bottom: 1px solid #f3f4f6;
          }
          .step:last-child { border-bottom: none; }
          .step-number { 
            display: inline-block; 
            width: 24px; 
            height: 24px; 
            background: #064e3b; 
            color: white; 
            border-radius: 50%; 
            text-align: center; 
            line-height: 24px; 
            font-size: 13px;
            font-weight: 600;
            margin-right: 12px;
          }
          .highlight { 
            background: #ecfdf5; 
            border-left: 3px solid #10b981; 
            padding: 20px; 
            margin: 32px 0;
            border-radius: 4px;
          }
          .highlight p { color: #065f46; font-size: 15px; font-weight: 500; margin: 0; }
          .footer { 
            padding: 32px 40px; 
            background: #f9fafb; 
            border-top: 1px solid #e5e7eb;
            text-align: center;
          }
          .footer-brand { 
            font-size: 15px; 
            font-weight: 600; 
            color: #111827; 
            margin-bottom: 8px;
          }
          .footer-text { 
            color: #6b7280; 
            font-size: 13px; 
            line-height: 1.6;
          }
          .footer a { color: #059669; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Cerere Confirmată</h1>
              <div class="subtitle">Ofertele sunt pe drum</div>
            </div>
            <div class="content">
              <div class="greeting">Bună ${name},</div>
              <div class="message">
                Cererea ta de mutare a fost înregistrată cu succes. Companiile noastre partenere au fost notificate și vor începe să pregătească oferte personalizate.
              </div>
              
              <div class="card">
                <div class="card-row">
                  <div class="card-label">Referință</div>
                  <div class="card-value">${requestCode}</div>
                </div>
                <div class="card-row">
                  <div class="card-label">Traseu</div>
                  <div class="card-value">${from} → ${to}</div>
                </div>
                <div class="card-row">
                  <div class="card-label">Data mutării</div>
                  <div class="card-value">${movingDate}</div>
                </div>
              </div>
              
              <div class="steps">
                <div class="steps-title">Ce urmează</div>
                <div class="step">
                  <span class="step-number">1</span>
                  Companiile verificate analizează cererea ta
                </div>
                <div class="step">
                  <span class="step-number">2</span>
                  Primești oferte personalizate în 24-48 ore
                </div>
                <div class="step">
                  <span class="step-number">3</span>
                  Compari prețurile și alegi oferta potrivită
                </div>
              </div>
              
              <div class="highlight">
                <p>Nu mai trebuie să faci nimic. Companiile te vor contacta direct pentru a-ți prezenta ofertele.</p>
              </div>
            </div>
            <div class="footer">
              <div class="footer-brand">OferteMutare.ro</div>
              <div class="footer-text">
                Asistență: <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a>
              </div>
            </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7; 
            color: #1f2937; 
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper { padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { 
            padding: 48px 40px 40px; 
            background: linear-gradient(180deg, #064e3b 0%, #065f46 100%);
            border-bottom: 3px solid #10b981;
          }
          .header h1 { color: white; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0; }
          .header .subtitle { color: #d1fae5; font-size: 15px; margin-top: 8px; }
          .content { padding: 40px; }
          .message { color: #4b5563; font-size: 15px; margin-bottom: 32px; line-height: 1.6; }
          .offer-card {
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 32px;
            margin: 32px 0;
            text-align: center;
            background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
          }
          .company-name {
            font-size: 16px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .price-display {
            font-size: 48px;
            font-weight: 700;
            color: #064e3b;
            letter-spacing: -2px;
            margin: 16px 0;
          }
          .price-label {
            font-size: 13px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .reference {
            background: #f9fafb;
            padding: 16px;
            border-radius: 6px;
            margin: 24px 0;
            text-align: center;
          }
          .reference-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .reference-value { font-size: 15px; color: #111827; font-weight: 600; }
          .footer { 
            padding: 32px 40px; 
            background: #f9fafb; 
            border-top: 1px solid #e5e7eb;
            text-align: center;
          }
          .footer-brand { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px; }
          .footer-text { color: #6b7280; font-size: 13px; line-height: 1.6; }
          .footer a { color: #059669; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Ofertă Nouă Primită</h1>
              <div class="subtitle">Un partener ți-a trimis o propunere</div>
            </div>
            <div class="content">
              <div class="message">
                Ai primit o ofertă competitivă de la una dintre companiile noastre verificate. Compania te va contacta în scurt timp pentru a discuta detaliile mutării.
              </div>
              
              <div class="offer-card">
                <div class="company-name">${companyName}</div>
                <div class="price-display">${price.toLocaleString('ro-RO')}</div>
                <div class="price-label">Lei RON</div>
              </div>

              <div class="reference">
                <div class="reference-label">Referință cerere</div>
                <div class="reference-value">${requestCode}</div>
              </div>
              
              <div class="message" style="margin-top: 32px;">
                Recomandăm să aștepți și alte oferte pentru a putea compara. În general, primele răspunsuri apar în primele 48 de ore de la postarea cererii.
              </div>
            </div>
            <div class="footer">
              <div class="footer-brand">OferteMutare.ro</div>
              <div class="footer-text">
                Asistență: <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a>
              </div>
            </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7; 
            color: #1f2937; 
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper { padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { 
            padding: 48px 40px 40px; 
            background: linear-gradient(180deg, #064e3b 0%, #065f46 100%);
            border-bottom: 3px solid #10b981;
          }
          .header h1 { color: white; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0; }
          .header .subtitle { color: #d1fae5; font-size: 15px; margin-top: 8px; }
          .content { padding: 40px; }
          .message { color: #4b5563; font-size: 15px; margin-bottom: 32px; line-height: 1.6; }
          .contact-box { 
            background: #f9fafb; 
            border: 2px solid #e5e7eb; 
            border-radius: 12px; 
            padding: 32px; 
            margin: 32px 0; 
          }
          .contact-title { font-size: 14px; font-weight: 600; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; }
          .contact-row { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .contact-row:last-child { border-bottom: none; }
          .contact-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .contact-value { font-size: 15px; color: #111827; font-weight: 500; }
          .contact-value a { color: #059669; text-decoration: none; }
          .steps { margin: 32px 0; }
          .steps-title { font-size: 14px; font-weight: 600; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
          .step { padding: 16px 0; color: #4b5563; font-size: 15px; border-bottom: 1px solid #f3f4f6; }
          .step:last-child { border-bottom: none; }
          .step-number { display: inline-block; width: 24px; height: 24px; background: #064e3b; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 13px; font-weight: 600; margin-right: 12px; }
          .footer { padding: 32px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
          .footer-brand { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px; }
          .footer-text { color: #6b7280; font-size: 13px; line-height: 1.6; }
          .footer a { color: #059669; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Ofertă Acceptată</h1>
              <div class="subtitle">Clientul a ales serviciile tale</div>
            </div>
            <div class="content">
              <div class="message">
                Felicitări! Clientul <strong>${customerName}</strong> a acceptat oferta ta pentru cererea <strong>${requestCode}</strong>. Contactează-l cât mai curând pentru a finaliza detaliile.
              </div>
              
              <div class="contact-box">
                <div class="contact-title">Date de contact</div>
                <div class="contact-row">
                  <div class="contact-label">Client</div>
                  <div class="contact-value">${customerName}</div>
                </div>
                <div class="contact-row">
                  <div class="contact-label">Telefon</div>
                  <div class="contact-value"><a href="tel:${customerPhone}">${customerPhone}</a></div>
                </div>
                <div class="contact-row">
                  <div class="contact-label">Email</div>
                  <div class="contact-value"><a href="mailto:${customerEmail}">${customerEmail}</a></div>
                </div>
              </div>
              
              <div class="steps">
                <div class="steps-title">Pași următori</div>
                <div class="step">
                  <span class="step-number">1</span>
                  Contactează clientul pentru confirmare
                </div>
                <div class="step">
                  <span class="step-number">2</span>
                  Stabilește detaliile finale ale mutării
                </div>
                <div class="step">
                  <span class="step-number">3</span>
                  Pregătește echipa și logistica necesară
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="footer-brand">OferteMutare.ro</div>
              <div class="footer-text">
                Asistență: <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a>
              </div>
            </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7; 
            color: #1f2937; 
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper { padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { padding: 32px 40px; background: #111827; border-bottom: 3px solid #374151; }
          .header h1 { color: white; font-size: 20px; font-weight: 600; letter-spacing: -0.5px; margin: 0; }
          .content { padding: 40px; }
          .field { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
          .field:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600; }
          .value { font-size: 15px; color: #111827; line-height: 1.6; }
          .value a { color: #059669; text-decoration: none; }
          .message-box { background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Mesaj nou din formular de contact</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nume</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Telefon</div>
                <div class="value"><a href="tel:${phone}">${phone || 'Nu a furnizat'}</a></div>
              </div>
              <div class="field">
                <div class="label">Mesaj</div>
                <div class="message-box">${message}</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,

  // Notification to companies about new moving request
  newRequestNotification: (requestCode: string, from: string, to: string, movingDate: string, furniture: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7; 
            color: #1f2937; 
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper { padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { 
            padding: 48px 40px 40px; 
            background: linear-gradient(180deg, #064e3b 0%, #065f46 100%);
            border-bottom: 3px solid #10b981;
          }
          .header h1 { color: white; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0; }
          .header .subtitle { color: #d1fae5; font-size: 15px; margin-top: 8px; }
          .content { padding: 40px; }
          .reference { 
            background: #f9fafb; 
            padding: 16px 24px; 
            border-radius: 6px; 
            margin-bottom: 32px;
            text-align: center;
            border: 1px solid #e5e7eb;
          }
          .reference-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .reference-value { font-size: 18px; color: #111827; font-weight: 700; letter-spacing: 0.5px; }
          .message { color: #4b5563; font-size: 15px; margin-bottom: 32px; line-height: 1.6; }
          .details-grid { 
            background: #f9fafb; 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 32px 0; 
          }
          .detail-row { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
          .detail-value { font-size: 15px; color: #111827; font-weight: 500; }
          .cta-wrapper { text-align: center; margin: 32px 0; }
          .cta { 
            display: inline-block;
            background: #064e3b;
            color: white;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 15px;
            letter-spacing: 0.3px;
          }
          .note { 
            background: #ecfdf5; 
            border-left: 3px solid #10b981; 
            padding: 16px 20px; 
            margin-top: 32px;
            border-radius: 4px;
            font-size: 14px;
            color: #065f46;
          }
          .footer { padding: 32px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
          .footer-brand { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px; }
          .footer-text { color: #6b7280; font-size: 13px; line-height: 1.6; }
          .footer a { color: #059669; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Cerere Nouă Disponibilă</h1>
              <div class="subtitle">O nouă oportunitate de business</div>
            </div>
            <div class="content">
              <div class="reference">
                <div class="reference-label">Cod cerere</div>
                <div class="reference-value">${requestCode}</div>
              </div>
              
              <div class="message">
                O nouă cerere de mutare a fost publicată pe platformă. Verifică detaliile și trimite-ți oferta pentru a intra în competiție.
              </div>
              
              <div class="details-grid">
                <div class="detail-row">
                  <div class="detail-label">Plecare</div>
                  <div class="detail-value">${from}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Destinație</div>
                  <div class="detail-value">${to}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Data mutării</div>
                  <div class="detail-value">${movingDate}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Volum mobilier</div>
                  <div class="detail-value">${furniture}</div>
                </div>
              </div>

              <div class="cta-wrapper">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ofertemutare.ro'}/company/dashboard" class="cta">
                  Trimite Oferta
                </a>
              </div>

              <div class="note">
                Primele oferte primite au de obicei șansele cele mai mari de acceptare. Răspunde rapid și profesionist pentru rezultate optime.
              </div>
            </div>
            <div class="footer">
              <div class="footer-brand">OferteMutare.ro</div>
              <div class="footer-text">
                Asistență: <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,

  // Notify company that their offer was declined
  offerDeclined: (requestCode: string, companyName: string, customerName: string) => `
    <!DOCTYPE html>
    <html lang="ro">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7; 
            color: #1f2937; 
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper { padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { padding: 48px 40px 40px; background: #6b7280; border-bottom: 3px solid #9ca3af; }
          .header h1 { color: white; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0; }
          .header .subtitle { color: #e5e7eb; font-size: 15px; margin-top: 8px; }
          .content { padding: 40px; }
          .reference { background: #f9fafb; padding: 16px 24px; border-radius: 6px; margin-bottom: 32px; text-align: center; border: 1px solid #e5e7eb; }
          .reference-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .reference-value { font-size: 18px; color: #111827; font-weight: 700; letter-spacing: 0.5px; }
          .message { color: #4b5563; font-size: 15px; margin-bottom: 24px; line-height: 1.6; }
          .note { background: #fef3c7; border-left: 3px solid #f59e0b; padding: 20px; margin: 32px 0; border-radius: 4px; font-size: 14px; color: #92400e; }
          .cta-wrapper { text-align: center; margin: 32px 0; }
          .cta { display: inline-block; background: #064e3b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { padding: 32px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
          .footer-brand { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px; }
          .footer-text { color: #6b7280; font-size: 13px; line-height: 1.6; }
          .footer a { color: #059669; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Actualizare Ofertă</h1>
              <div class="subtitle">Clientul a ales o altă opțiune</div>
            </div>
            <div class="content">
              <div class="reference">
                <div class="reference-label">Referință cerere</div>
                <div class="reference-value">${requestCode}</div>
              </div>
              
              <div class="message">
                Bună ${companyName},
              </div>
              
              <div class="message">
                Clientul <strong>${customerName}</strong> a acceptat o altă ofertă pentru această cerere. Mulțumim pentru timpul acordat și pentru interesul arătat.
              </div>
              
              <div class="note">
                Fiecare cerere este o oportunitate de învățare. Menține-ți standardele înalte și continuă să oferi servicii de calitate — următoarea poate fi a ta.
              </div>

              <div class="cta-wrapper">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ofertemutare.ro'}/company/dashboard" class="cta">
                  Vezi Cereri Noi
                </a>
              </div>
            </div>
            <div class="footer">
              <div class="footer-brand">OferteMutare.ro</div>
              <div class="footer-text">
                Asistență: <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a>
              </div>
            </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7; 
            color: #1f2937; 
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper { padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { padding: 48px 40px 40px; background: linear-gradient(180deg, #d97706 0%, #f59e0b 100%); border-bottom: 3px solid #fbbf24; }
          .header h1 { color: white; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0; }
          .header .subtitle { color: #fef3c7; font-size: 15px; margin-top: 8px; }
          .content { padding: 40px; }
          .reference { background: #f9fafb; padding: 16px 24px; border-radius: 6px; margin-bottom: 32px; text-align: center; border: 1px solid #e5e7eb; }
          .reference-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .reference-value { font-size: 18px; color: #111827; font-weight: 700; letter-spacing: 0.5px; }
          .message { color: #4b5563; font-size: 15px; margin-bottom: 24px; line-height: 1.6; }
          .offer-badge {
            text-align: center;
            margin: 40px 0;
          }
          .offer-count {
            font-size: 72px;
            font-weight: 700;
            color: #d97706;
            letter-spacing: -3px;
            line-height: 1;
          }
          .offer-label {
            font-size: 14px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 8px;
          }
          .benefits { margin: 32px 0; }
          .benefit-item { padding: 12px 0; color: #4b5563; font-size: 15px; border-bottom: 1px solid #f3f4f6; }
          .benefit-item:last-child { border-bottom: none; }
          .cta-wrapper { text-align: center; margin: 32px 0; }
          .cta { display: inline-block; background: #d97706; color: white; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; }
          .note { background: #fef3c7; border-left: 3px solid #f59e0b; padding: 16px 20px; margin-top: 32px; border-radius: 4px; font-size: 14px; color: #92400e; text-align: center; }
          .footer { padding: 32px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
          .footer-brand { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px; }
          .footer-text { color: #6b7280; font-size: 13px; line-height: 1.6; }
          .footer a { color: #059669; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Oferte în Așteptare</h1>
              <div class="subtitle">Companiile așteaptă răspunsul tău</div>
            </div>
            <div class="content">
              <div class="reference">
                <div class="reference-label">Referință cerere</div>
                <div class="reference-value">${requestCode}</div>
              </div>
              
              <div class="message">
                Bună ${customerName},
              </div>
              
              <div class="offer-badge">
                <div class="offer-count">${offerCount}</div>
                <div class="offer-label">${offerCount === 1 ? 'ofertă disponibilă' : 'oferte disponibile'}</div>
              </div>

              <div class="message">
                Ai primit ${offerCount === 1 ? 'o ofertă' : 'multiple oferte'} pentru mutarea ta. Compară opțiunile și alege-o pe cea care se potrivește cel mai bine nevoilor tale.
              </div>
              
              <div class="benefits">
                <div class="benefit-item">Vezi detaliile fiecărei oferte</div>
                <div class="benefit-item">Verifică reputația companiilor</div>
                <div class="benefit-item">Contactează companiile pentru clarificări</div>
              </div>

              <div class="cta-wrapper">
                <a href="${dashboardLink}" class="cta">
                  Vezi Ofertele
                </a>
              </div>

              <div class="note">
                Răspunde cât mai curând pentru a-ți asigura disponibilitatea la data dorită.
              </div>
            </div>
            <div class="footer">
              <div class="footer-brand">OferteMutare.ro</div>
              <div class="footer-text">
                Asistență: <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a>
              </div>
            </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7; 
            color: #1f2937; 
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper { padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { padding: 48px 40px 40px; background: #1e40af; border-bottom: 3px solid #3b82f6; }
          .header h1 { color: white; font-size: 22px; font-weight: 600; letter-spacing: -0.5px; margin: 0; }
          .header .subtitle { color: #bfdbfe; font-size: 15px; margin-top: 8px; }
          .content { padding: 40px; }
          .message { color: #4b5563; font-size: 15px; margin-bottom: 24px; line-height: 1.6; }
          .message-preview {
            background: #eff6ff;
            border-left: 3px solid #3b82f6;
            padding: 24px;
            margin: 32px 0;
            border-radius: 4px;
            font-size: 15px;
            color: #1e40af;
            font-style: italic;
            line-height: 1.6;
          }
          .cta-wrapper { text-align: center; margin: 32px 0; }
          .cta { display: inline-block; background: #1e40af; color: white; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; }
          .note { background: #f0f9ff; border-left: 3px solid #3b82f6; padding: 16px 20px; margin-top: 32px; border-radius: 4px; font-size: 14px; color: #1e40af; text-align: center; }
          .footer { padding: 32px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
          .footer-brand { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px; }
          .footer-text { color: #6b7280; font-size: 13px; line-height: 1.6; }
          .footer a { color: #059669; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Mesaj Nou de la ${companyName}</h1>
              <div class="subtitle">Răspunde pentru a discuta detaliile</div>
            </div>
            <div class="content">
              <div class="message">
                ${companyName} ți-a trimis un mesaj legat de cererea ta de mutare.
              </div>
              
              <div class="message-preview">
                „${messagePreview}"
              </div>

              <div class="cta-wrapper">
                <a href="${conversationLink}" class="cta">
                  Răspunde Mesajului
                </a>
              </div>

              <div class="note">
                Răspunde rapid pentru a finaliza detaliile mutării tale.
              </div>
            </div>
            <div class="footer">
              <div class="footer-brand">OferteMutare.ro</div>
              <div class="footer-text">
                Asistență: <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a>
              </div>
            </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7; 
            color: #1f2937; 
            background: #f9fafb;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper { padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { 
            padding: 48px 40px 40px; 
            background: linear-gradient(180deg, #064e3b 0%, #065f46 100%);
            border-bottom: 3px solid #10b981;
          }
          .header h1 { color: white; font-size: 22px; font-weight: 600; letter-spacing: -0.5px; margin: 0; }
          .header .subtitle { color: #d1fae5; font-size: 15px; margin-top: 8px; }
          .content { padding: 40px; }
          .reference { 
            background: #f9fafb; 
            padding: 16px 24px; 
            border-radius: 6px; 
            margin-bottom: 32px;
            text-align: center;
            border: 1px solid #e5e7eb;
          }
          .reference-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .reference-value { font-size: 18px; color: #111827; font-weight: 700; letter-spacing: 0.5px; }
          .message { color: #4b5563; font-size: 15px; margin-bottom: 24px; line-height: 1.6; }
          .message-preview {
            background: #ecfdf5;
            border-left: 3px solid #10b981;
            padding: 24px;
            margin: 32px 0;
            border-radius: 4px;
            font-size: 15px;
            color: #065f46;
            font-style: italic;
            line-height: 1.6;
          }
          .cta-wrapper { text-align: center; margin: 32px 0; }
          .cta { display: inline-block; background: #064e3b; color: white; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; }
          .note { background: #ecfdf5; border-left: 3px solid #10b981; padding: 16px 20px; margin-top: 32px; border-radius: 4px; font-size: 14px; color: #065f46; text-align: center; }
          .footer { padding: 32px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
          .footer-brand { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px; }
          .footer-text { color: #6b7280; font-size: 13px; line-height: 1.6; }
          .footer a { color: #059669; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Mesaj Nou de la Client</h1>
              <div class="subtitle">Răspunde pentru a confirma detaliile</div>
            </div>
            <div class="content">
              <div class="reference">
                <div class="reference-label">Referință cerere</div>
                <div class="reference-value">${requestCode}</div>
              </div>
              
              <div class="message">
                Clientul <strong>${customerName}</strong> ți-a trimis un mesaj.
              </div>
              
              <div class="message-preview">
                „${messagePreview}"
              </div>

              <div class="cta-wrapper">
                <a href="${conversationLink}" class="cta">
                  Răspunde Clientului
                </a>
              </div>

              <div class="note">
                Răspunde rapid și profesionist pentru a asigura această mutare.
              </div>
            </div>
            <div class="footer">
              <div class="footer-brand">OferteMutare.ro</div>
              <div class="footer-text">
                Asistență: <a href="mailto:info@ofertemutare.ro">info@ofertemutare.ro</a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,
};
