# 🚀 Quick Setup Guide - Media Upload System

## ✅ Ce este implementat

Sistem complet de upload media cu:
- ✅ Firebase Storage integration (upload real)
- ✅ Token validation cu expirare
- ✅ Progress bars real-time
- ✅ Thumbnail previews (imagini + video)
- ✅ Notificări automate către companii
- ✅ Reminder emails după 3 zile

---

## 📦 Instalare

Pachetele necesare sunt deja instalate:
```bash
npm install @emailjs/browser  # ✅ Instalat
```

---

## 🔧 Configurare EmailJS

### 1. Accesează Dashboard
https://dashboard.emailjs.com/admin/templates

### 2. Creează/Editează Template
**Template ID:** `template_ltgetnd` (din `.env`)

**Variabile necesare:**
- `{{to_name}}` - numele clientului
- `{{to_email}}` - email destinatar (auto)
- `{{upload_link}}` - link-ul generat

### 3. Template Content (HTML)
```html
<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
  <h2>Bună, {{to_name}}!</h2>
  <p>Mulțumim că ai creat o cerere de mutare pe platforma noastră.</p>
  <p>Pentru oferte mai precise, te rugăm să încarci fotografii și/sau video.</p>
  
  <div style="background:#f0f9ff;border-left:4px solid #0ea5e9;padding:16px;margin:24px 0">
    <p style="margin:0;font-weight:600;color:#0369a1">🔗 Link personalizat:</p>
    <p style="margin:8px 0 0 0">
      <a href="{{upload_link}}" style="color:#0ea5e9;font-weight:600">{{upload_link}}</a>
    </p>
  </div>

  <p><strong>Linkul este valabil 7 zile.</strong></p>
  
  <p>Ce poți încărca:</p>
  <ul>
    <li>Fotografii cu mobilierul și obiectele</li>
    <li>Video scurt cu spațiul (camere, scări, lift)</li>
    <li>Poze cu obiecte fragile sau voluminoase</li>
  </ul>

  <p>Cu respect,<br/>Echipa OferteMutare</p>
</div>
```

**Text Fallback:**
```
Bună, {{to_name}}!

Link personalizat pentru upload:
{{upload_link}}

Linkul este valabil 7 zile.

Cu respect,
Echipa OferteMutare
```

---

## 🔥 Firebase Storage Rules

Actualizează Firebase Storage Rules pentru a permite upload:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read pentru toate fișierele
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Upload doar pentru utilizatori autentificați
    match /requests/{requestId}/{fileName} {
      allow write: if request.auth != null
                   && request.resource.size < 50 * 1024 * 1024; // Max 50MB
    }
  }
}
```

---

## 🧪 Testare Completă

### 1. Test Generare Token
```bash
1. npm run dev
2. Login ca customer
3. Completează formular mutare
4. Selectează "Mai târziu" la poze
5. Submit formular
6. Check Firestore: uploadTokens/{token}
7. Check email: ar trebui să primești link
```

### 2. Test Upload Flow
```bash
1. Click pe link din email (sau accesează manual)
2. Ar trebui să vezi: "Se verifică token-ul..."
3. Apoi: UI de upload cu drag&drop
4. Selectează 2-3 imagini + 1 video
5. Observă thumbnail-uri generate automat
6. Click "Încarcă fișierele"
7. Urmărește progress bars (0% → 100%)
8. Success: "Fișierele au fost încărcate!"
```

### 3. Verificare Firestore
După upload, check:
```
requests/{requestId}
  ├─ mediaUrls: ["https://storage.googleapis.com/...", ...]
  └─ mediaUploadToken: "abc123..."

uploadTokens/{token}
  ├─ used: true
  └─ uploadedAt: "2025-10-30T..."

companies/{companyId}/notifications/{notifId}
  ├─ type: "media_uploaded"
  ├─ requestId: "abc123"
  └─ message: "Clientul a încărcat poze..."
```

### 4. Verificare Storage
Firebase Console → Storage:
```
requests/
  └─ {requestId}/
      ├─ 1730289123456_0.jpg
      ├─ 1730289123456_1.png
      └─ 1730289123456_2.mp4
```

---

## 📧 Setup Reminder Emails (Opțional)

### Option 1: Manual Testing
```typescript
// pages/customer/dashboard.tsx sau admin panel
import { checkAndSendReminders } from "@/utils/reminderHelpers";

const handleSendReminders = async () => {
  const result = await checkAndSendReminders();
  toast.success(`Trimise: ${result.sent}, Eșuate: ${result.failed}`);
};
```

### Option 2: Vercel Cron Jobs
```json
// vercel.json
{
  "crons": [{
    "path": "/api/sendUploadReminders",
    "schedule": "0 9 * * *"  // Daily la 9 AM
  }]
}
```

### Option 3: External Cron
- Service: https://cron-job.org (gratuit)
- URL: `https://ofertemutare.ro/api/sendUploadReminders`
- Schedule: `0 9 * * *` (Daily 9 AM)
- Header: `x-api-key: YOUR_SECRET_KEY` (opțional)

---

## 🐛 Troubleshooting

### "Token invalid sau expirat"
**Cauze posibile:**
- Token-ul nu există în Firestore `uploadTokens`
- `used: true` (deja folosit)
- `expiresAt` în trecut (expirat)

**Soluție:**
```bash
1. Check Firestore: uploadTokens/{token}
2. Verifică câmpurile: used, expiresAt
3. Regenerează token din customer dashboard (submit nou formular)
```

### Upload-ul nu pornește
**Cauze posibile:**
- Firebase Storage rules prea restrictive
- Fișier prea mare (> 50MB)
- Network timeout

**Soluție:**
```bash
1. Verifică Firebase Console → Storage → Rules
2. Testează cu fișier mic (< 1MB)
3. Check browser console pentru erori
```

### Progress bar rămâne la 0%
**Cauze posibile:**
- `uploadBytesResumable` nu emite events
- State update issue

**Soluție:**
```bash
1. Check browser console pentru erori
2. Verifică că fișierul nu e corrupt
3. Try cu alt browser (Chrome recommended)
```

### Companiile nu primesc notificări
**Cauze posibile:**
- Nu există oferte cu `status: "pending"`
- Firestore rules blochează write la notifications

**Soluție:**
```bash
1. Check Firestore: requests/{id}/offers
2. Verifică: status === "pending"
3. Check Firestore Rules pentru companies/{id}/notifications
```

---

## 📁 Fișiere Importante

```
pages/
  api/
    generateUploadLink.ts      # Token generation + Firestore save
    validateUploadToken.ts     # Server-side validation
    sendUploadReminders.ts     # Cron job API
  upload/
    [token].tsx               # Upload UI (3.9 kB)

utils/
  reminderHelpers.ts          # Email reminder logic

MEDIA_UPLOAD_SYSTEM.md        # Documentație completă
```

---

## 🎯 Next Actions

1. ✅ **Testează upload flow** (imagini + video)
2. ✅ **Verifică email-uri** (EmailJS dashboard)
3. ✅ **Check Firestore** (tokens + notifications)
4. ⏳ **Setup cron job** pentru reminders (opțional)
5. ⏳ **Deploy la production** și test final

---

## 📞 Support

Pentru întrebări:
- 📧 Email: contact@ofertemutare.ro
- 📚 Docs: `MEDIA_UPLOAD_SYSTEM.md`
- 🎓 Guide: `GHID_FORMULAR.md`

---

**Status:** ✅ Build passing | ✅ All features implemented  
**Version:** 1.0.0  
**Date:** October 30, 2025
