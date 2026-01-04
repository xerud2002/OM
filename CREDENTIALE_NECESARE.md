# 📋 Credențiale Necesare pentru Deployment

## ⚠️ IMPORTANT - Obține acestea ÎNAINTE de deployment!

---

## 1️⃣ Firebase Admin Credentials (OBLIGATORIU)

### Unde le obții:

🔗 https://console.firebase.google.com/project/omro-e5a88/settings/serviceaccounts/adminsdk

### Pași:

1. Click pe tab-ul **"Service accounts"**
2. Click butonul **"Generate new private key"**
3. Click **"Generate key"** în dialog
4. Se descarcă fișier JSON (ex: `omro-e5a88-firebase-adminsdk-xxxxx.json`)

### Din fișierul JSON descărcat, copiază:

```json
{
  "project_id": "omro-e5a88",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nXXXXX\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@omro-e5a88.iam.gserviceaccount.com",
  ...
}
```

### Adaugă în `.env`:

```bash
FIREBASE_ADMIN_PROJECT_ID=omro-e5a88
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@omro-e5a88.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXX\n-----END PRIVATE KEY-----\n"
```

**⚠️ ATENȚIE**:

- Private key trebuie în ghilimele duble `"..."`
- NU elimina `\n` din string!
- Trebuie să arate ca în exemplu de mai sus

---

## 2️⃣ Resend API Key (Pentru email-uri transacționale)

### Unde o obții:

🔗 https://resend.com/api-keys

### Pași:

1. Loghează-te în Resend
2. Du-te la **"API Keys"**
3. Click **"Create API Key"**
4. Nume: `ofertemutare-production`
5. Permisiuni: **"Sending access"**
6. Click **"Add"**
7. **COPIAZĂ cheia acum** (nu o mai poți vedea după!)

### Adaugă în `.env`:

```bash
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 3️⃣ Verifică celelalte variabile (deja configurate)

Acestea ar trebui să fie deja în `.env.example`, doar verifică:

### Firebase Client (deja configurat):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEhc8NVBGtYl_pBCO_bSzif8ixAWmsYQM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=omro-e5a88.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=omro-e5a88
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=omro-e5a88.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=637884424288
NEXT_PUBLIC_FIREBASE_APP_ID=1:637884424288:web:4e74fb3ef403c849ea305
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-7GJERPJ8N3
```

### EmailJS (deja configurat):

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_258bq8e
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_ltgetnd
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=LRc_CmeBZi8NqTT0O
NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID=template_upload_reminder
```

### App Config:

```bash
NEXT_PUBLIC_APP_URL=https://ofertemutare.ro
CRON_API_KEY=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

---

## 📝 Template complet .env

Creează fișierul `/var/www/om/.env` cu:

```bash
# Firebase Configuration (Client-side) - DEJA CONFIGURAT
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEhc8NVBGtYl_pBCO_bSzif8ixAWmsYQM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=omro-e5a88.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=omro-e5a88
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=omro-e5a88.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=637884424288
NEXT_PUBLIC_FIREBASE_APP_ID=1:637884424288:web:4e74fb3ef403c849ea305
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-7GJERPJ8N3

# Firebase Admin (Server-side) - COMPLETEAZĂ AICI!!!
FIREBASE_ADMIN_PROJECT_ID=omro-e5a88
FIREBASE_ADMIN_CLIENT_EMAIL=PUNE_CLIENT_EMAIL_DIN_JSON_AICI
FIREBASE_ADMIN_PRIVATE_KEY="PUNE_PRIVATE_KEY_DIN_JSON_AICI_CU_GHILIMELE_SI_\n"

# EmailJS Configuration - DEJA CONFIGURAT
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_258bq8e
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_ltgetnd
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=LRc_CmeBZi8NqTT0O
NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID=template_upload_reminder

# Resend API - COMPLETEAZĂ AICI!!!
RESEND_API_KEY=PUNE_API_KEY_DE_LA_RESEND_AICI

# App Configuration
NEXT_PUBLIC_APP_URL=https://ofertemutare.ro
CRON_API_KEY=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

---

## 4️⃣ După deployment - Firebase Authorized Domains

### Unde:

🔗 https://console.firebase.google.com/project/omro-e5a88/authentication/settings

### Pași:

1. Scroll la **"Authorized domains"**
2. Click **"Add domain"**
3. Adaugă fiecare domeniu:
   - `ofertemutare.ro`
   - `www.ofertemutare.ro`
   - `80.96.6.93`
4. Click **"Add"**

**Fără acest pas, autentificarea nu va funcționa!!!**

---

## ✅ Checklist Credențiale

Înainte de a rula scriptul de deployment, asigură-te că ai:

- [ ] Firebase Admin Service Account JSON descărcat
- [ ] `client_email` copiat din JSON
- [ ] `private_key` copiat din JSON (cu `\n` păstrate!)
- [ ] Resend API key generat și copiat
- [ ] Verificat că celelalte variabile sunt corecte

---

## 🚨 Erori Comune

### "Error: Firebase Admin not initialized"

➡️ `FIREBASE_ADMIN_PRIVATE_KEY` lipsește sau e greșit formatat

### "unauthorized-domain" în browser

➡️ Domeniul nu e adăugat în Firebase Authorized Domains

### Email-urile nu se trimit

➡️ `RESEND_API_KEY` lipsește sau e invalid

### Build failed cu "env variable undefined"

➡️ Verifică că toate variabilele `NEXT_PUBLIC_*` sunt setate

---

**Salvează acest fișier și pregătește credențialele înainte de deployment!**
