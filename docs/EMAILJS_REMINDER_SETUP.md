# EmailJS Reminder Template Setup

This guide explains how to create an EmailJS template for the upload reminder system.

## Overview

The CRON job at `/api/sendUploadReminders` automatically sends reminder emails to customers who haven't uploaded their moving photos/videos after 3 days.

## Template Variables

The reminder email uses these variables (passed from `sendUploadReminders.ts`):

- `{{to_name}}` - Customer's name (e.g., "Ion Popescu")
- `{{customer_name}}` - Same as to_name (for template flexibility)
- `{{upload_link}}` - Full URL to upload page (e.g., "https://ofertemutare.ro/upload/abc123...")
- `{{request_code}}` - Request ID for reference (e.g., "REQ-141629")

## Step 1: Create Template in EmailJS Dashboard

1. Go to https://dashboard.emailjs.com/admin
2. Select your service: `service_258bq8e`
3. Click "Email Templates" → "Create New Template"
4. Give it a name: **"Upload Reminder Template"**
5. Set Template ID: `template_upload_reminder` (or use existing `template_ltgetnd`)

## Step 2: Template Content (Romanian)

### Subject:
```
Reminder: Încarcă fotografiile pentru {{request_code}}
```

### Email Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px 20px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚚 OferteMutare.ro</h1>
      <p>Reminder: Încarcă fotografiile pentru mutarea ta</p>
    </div>
    
    <div class="content">
      <p>Bună {{to_name}},</p>
      
      <p>Am observat că nu ai încărcat încă fotografiile pentru cererea ta de mutare <strong>{{request_code}}</strong>.</p>
      
      <p>📸 <strong>De ce sunt importante fotografiile?</strong></p>
      <ul>
        <li>Firmele pot vedea exact ce trebuie mutat</li>
        <li>Vei primi oferte mai precise și competitive</li>
        <li>Economisești timp și bani evitând surprizele</li>
      </ul>
      
      <p>✨ Durează doar 2-3 minute să încarci câteva fotografii cu:</p>
      <ul>
        <li>Camera de zi și dormitoare</li>
        <li>Bucătăria și baia</li>
        <li>Holul și balconul/terasa</li>
        <li>Orice obiecte voluminoase (mobilier, electrocasnice)</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="{{upload_link}}" class="button">📷 Încarcă Acum</a>
      </div>
      
      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        <em>Linkul este valabil 7 zile de la primirea cererii. Dacă întâmpini probleme, contactează-ne la contact@ofertemutare.ro</em>
      </p>
    </div>
    
    <div class="footer">
      <p><strong>OferteMutare.ro</strong> - Platformă de comparare oferte mutări</p>
      <p>📧 contact@ofertemutare.ro | 🌐 www.ofertemutare.ro</p>
      <p style="margin-top: 10px; font-size: 11px;">
        Primești acest email pentru că ai solicitat oferte pe platforma noastră.<br>
        Dacă nu mai dorești să primești reminder-e, poți ignora acest mesaj.
      </p>
    </div>
  </div>
</body>
</html>
```

### Plain Text Version:
```
Bună {{to_name}},

Am observat că nu ai încărcat încă fotografiile pentru cererea ta de mutare {{request_code}}.

📸 De ce sunt importante fotografiile?
- Firmele pot vedea exact ce trebuie mutat
- Vei primi oferte mai precise și competitive
- Economisești timp și bani evitând surprizele

✨ Durează doar 2-3 minute să încarci câteva fotografii cu:
- Camera de zi și dormitoare
- Bucătăria și baia
- Holul și balconul/terasa
- Orice obiecte voluminoase (mobilier, electrocasnice)

👉 Încarcă acum: {{upload_link}}

Linkul este valabil 7 zile de la primirea cererii. Dacă întâmpini probleme, contactează-ne la contact@ofertemutare.ro

---
OferteMutare.ro - Platformă de comparare oferte mutări
📧 contact@ofertemutare.ro | 🌐 www.ofertemutare.ro

Primești acest email pentru că ai solicitat oferte pe platforma noastră.
Dacă nu mai dorești să primești reminder-e, poți ignora acest mesaj.
```

## Step 3: Update Environment Variables

### Option A: Use New Dedicated Template

Add to your `.env.local`:
```bash
NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID=template_upload_reminder
```

Then update `sendUploadReminders.ts`:
```typescript
await sendEmail({
  to_email: tokenData.customerEmail,
  to_name: tokenData.customerName,
  customer_name: tokenData.customerName,
  upload_link: tokenData.uploadLink,
  request_code: tokenData.requestId || "cererea ta",
}, process.env.NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID); // Pass specific template
```

### Option B: Use Default Template (Current Setup)

If using the existing `template_ltgetnd`, just ensure it has these variables: `{{to_name}}`, `{{customer_name}}`, `{{upload_link}}`, `{{request_code}}`

## Step 4: Test the Reminder System

### Manual Test (via API):
```bash
# Local development
curl http://localhost:3001/api/sendUploadReminders

# Production
curl -H "x-api-key: YOUR_CRON_API_KEY" https://om-eosin.vercel.app/api/sendUploadReminders
```

### Expected Response:
```json
{
  "ok": true,
  "total": 2,
  "sent": 2,
  "failed": 0,
  "reminders": [
    {
      "email": "customer@example.com",
      "name": "Ion Popescu",
      "link": "https://ofertemutare.ro/upload/abc123..."
    }
  ]
}
```

## Step 5: Setup Vercel Cron Job

1. Go to Vercel Dashboard → Your Project → Settings → Cron Jobs
2. Click "Add Cron Job"
3. Fill in:
   - **Path**: `/api/sendUploadReminders`
   - **Schedule**: `0 9 * * *` (every day at 9 AM)
   - **Headers**: Add `x-api-key` with value from `CRON_API_KEY` env var
4. Save

## Troubleshooting

### Emails Not Sending
- Check EmailJS dashboard for quota/errors
- Verify `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` in env
- Check console logs for specific error messages

### No Reminders Found
- Verify uploadTokens collection has `used: false` docs older than 3 days
- Check that `reminderSent` field is `false` or doesn't exist
- Verify `expiresAt` is in the future

### Template Variables Not Replacing
- Check template ID matches env var
- Ensure variable names use double curly braces: `{{variable_name}}`
- Check EmailJS dashboard logs for template errors

## Code Reference

See implementation in:
- `/pages/api/sendUploadReminders.ts` - CRON job logic
- `/utils/emailHelpers.ts` - Email sending helper
- `/pages/api/generateUploadLink.ts` - Creates upload tokens
