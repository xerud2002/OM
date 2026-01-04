# Deployment Checklist - OferteMutare.ro

## ✅ Completed Steps

- [x] Created `vercel.json` for deployment configuration
- [x] Fixed all build errors (date-fns, emailjs-com, trackEvent calls)
- [x] Removed unused files (analytics, reviews, A/B testing, duplicate dashboard)
- [x] Integrated email sending into CRON reminder job
- [x] Added reminderSent tracking to prevent duplicate emails
- [x] Build passing (29 pages compiled successfully)
- [x] Lint passing (0 warnings, 0 errors)
- [x] Code committed to Git

## 🔧 Required Actions Before Going Live

### 1. Firebase Domain Authorization (CRITICAL)

**Status**: ⚠️ REQUIRED - Site won't work without this

**Steps**:

1. Go to: https://console.firebase.google.com/project/omro-e5a88/authentication/settings
2. Scroll to "Authorized domains" section
3. Click "Add domain"
4. Enter: `om-eosin.vercel.app``
5. Click "Add" to save

**Why**: Firebase auth blocks unauthorized domains. Users will see "Error (auth/unauthorized-domain)" until this is fixed.

---

### 2. EmailJS Reminder Template Setup

**Status**: ⚠️ OPTIONAL but RECOMMENDED

**Option A - Create New Template** (recommended):

1. Go to: https://dashboard.emailjs.com/admin
2. Select service: `service_258bq8e`
3. Create new template with ID: `template_upload_reminder`
4. Copy content from `docs/EMAILJS_REMINDER_SETUP.md`
5. Add to Vercel env vars: `NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID=template_upload_reminder`

**Option B - Use Existing Template**:

1. Go to existing template: `template_ltgetnd`
2. Ensure it has these variables: `{{to_name}}`, `{{customer_name}}`, `{{upload_link}}`, `{{request_code}}`

**Why**: Without a template, reminder emails won't send. Current code uses default template which may not have correct variables.

**Test**: Run `/api/sendUploadReminders` manually after setup

---

### 3. Vercel CRON Job Setup

**Status**: ⚠️ OPTIONAL - Can test manually first

**Steps**:

1. Go to: https://vercel.com/dashboard → Your Project → Settings → Cron Jobs
2. Click "Add Cron Job"
3. Configure:
   - **Path**: `/api/sendUploadReminders`
   - **Schedule**: `0 9 * * *` (daily at 9 AM UTC) or `0 7 * * *` (7 AM UTC = 10 AM Romanian time)
   - **Region**: Frankfurt (closest to Romania)
4. Add custom header:
   - **Key**: `x-api-key`
   - **Value**: `7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0`
5. Save

**Why**: Automates reminder emails. Without this, you'll need to trigger manually via API.

**Alternative**: Use external CRON service (cron-job.org, EasyCron) to hit endpoint daily

---

### 4. Verify Environment Variables in Vercel

**Status**: ⚠️ REQUIRED

**Steps**:

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure these are set for Production:

**Firebase Config** (already set from .env):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEhc8NVBGtYl_pBCO_bSzif8ixAWmsYQM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=omro-e5a88.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=omro-e5a88
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=omro-e5a88.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=637884424288
NEXT_PUBLIC_FIREBASE_APP_ID=1:637884424288:web:4e74fb3ef403c849ea305
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-7GJERPJ8N3
```

**EmailJS** (already set):

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_258bq8e
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_ltgetnd
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=Z5wQV4TL68ltUqmyQ
```

**Firebase Admin** (REQUIRED for API routes):

```
FIREBASE_ADMIN_PROJECT_ID=omro-e5a88
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@omro-e5a88.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

⚠️ **Get these from Firebase Console → Project Settings → Service Accounts → Generate new private key**

**CRON Security** (already set):

```
CRON_API_KEY=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

**App URL**:

```
NEXT_PUBLIC_APP_URL=https://om-eosin.vercel.app
```

(Update this to your custom domain when ready)

---

## 📦 Deployment Process

### Step 1: Push to GitHub

```bash
git push origin main
```

### Step 2: Verify Vercel Auto-Deploy

- Vercel should automatically detect the push and start building
- Monitor at: https://vercel.com/dashboard
- Check build logs for errors

### Step 3: Test Deployed Site

After successful deployment, test these critical flows:

**Authentication**:

- [ ] Customer registration with email
- [ ] Customer login with Google
- [ ] Company registration with email
- [ ] Company login with Google
- [ ] Logout functionality

**Customer Flow**:

- [ ] Create new moving request
- [ ] Upload photos/videos (Firebase Storage)
- [ ] View request on dashboard
- [ ] View offers from companies
- [ ] Accept/decline offers
- [ ] Edit request details

**Company Flow**:

- [ ] View all customer requests
- [ ] Submit offer on request
- [ ] View "My Offers" tab
- [ ] Edit/delete own offers
- [ ] Receive notifications (bell icon)

**Upload Token System**:

- [ ] Request with "upload later" generates token
- [ ] Customer receives email with upload link
- [ ] Upload page works correctly
- [ ] Files upload to Firebase Storage
- [ ] Request updated with mediaUrls
- [ ] Token marked as used

**CRON Reminder** (manual test):

```bash
# Test locally first
curl http://localhost:3001/api/sendUploadReminders

# Test on Vercel
curl -H "x-api-key: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0" \
     https://om-eosin.vercel.app/api/sendUploadReminders
```

---

## 🐛 Common Issues & Fixes

### Issue: "auth/unauthorized-domain" error

**Fix**: Add `om-eosin.vercel.app` to Firebase Console → Authentication → Settings → Authorized domains

### Issue: Firebase Admin API routes fail (500 errors)

**Fix**: Add Firebase Admin service account credentials to Vercel env vars

### Issue: Emails not sending

**Fix**:

1. Check EmailJS quota in dashboard
2. Verify env vars: `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
3. Check browser console for errors

### Issue: Upload page returns 404

**Fix**: Ensure dynamic route `pages/upload/[token].tsx` is deployed correctly

### Issue: CRON job returns 401 Unauthorized

**Fix**: Verify `x-api-key` header matches `CRON_API_KEY` env var

### Issue: Images not loading from Firebase Storage

**Fix**: Check `next.config.js` has Firebase Storage domain in `remotePatterns`

---

## 🚀 Going Live with Custom Domain

### Step 1: Configure Domain in Vercel

1. Go to: Project Settings → Domains
2. Add your domain (e.g., `ofertemutare.ro`)
3. Follow Vercel's DNS configuration instructions

### Step 2: Update Firebase Authorized Domains

1. Add `ofertemutare.ro` to Firebase Console → Authentication → Settings
2. Remove `om-eosin.vercel.app` if no longer needed

### Step 3: Update Environment Variable

```
NEXT_PUBLIC_APP_URL=https://ofertemutare.ro
```

### Step 4: Update EmailJS Templates

- Update any hardcoded URLs in email templates to use new domain

---

## 📊 Post-Deployment Monitoring

### Verify These Metrics After 24 Hours:

- [ ] New user registrations (customers & companies)
- [ ] New requests created
- [ ] Offers submitted by companies
- [ ] Upload tokens generated
- [ ] Reminder emails sent (check EmailJS dashboard)
- [ ] No JavaScript errors in browser console
- [ ] No 500 errors in Vercel logs

### Monitoring Tools:

- **Vercel Analytics**: https://vercel.com/dashboard/analytics
- **Firebase Console**: https://console.firebase.google.com/project/omro-e5a88
- **EmailJS Dashboard**: https://dashboard.emailjs.com/admin

---

## 📝 Next Steps After Launch

1. **Custom Domain**: Setup `ofertemutare.ro` instead of `om-eosin.vercel.app`
2. **SSL Certificate**: Vercel provides automatic HTTPS
3. **Email Templates**: Create professional HTML templates for all email types
4. **Analytics**: Consider adding Vercel Analytics or Google Analytics
5. **Error Monitoring**: Setup Sentry or similar for production error tracking
6. **Performance**: Monitor Core Web Vitals in Vercel Analytics
7. **SEO**: Add meta tags, sitemap.xml, robots.txt
8. **Backup Strategy**: Setup Firestore backups in Firebase Console

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **EmailJS Docs**: https://www.emailjs.com/docs/

---

## ✅ Final Pre-Launch Checklist

Before announcing to users:

- [ ] Firebase domain authorized
- [ ] All env vars set in Vercel
- [ ] Test customer registration flow
- [ ] Test company registration flow
- [ ] Test request creation with photos
- [ ] Test offer submission
- [ ] Test offer acceptance
- [ ] Test upload token email system
- [ ] Test reminder email (manual trigger)
- [ ] Verify no console errors
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit (Performance, Accessibility, SEO)

**Good luck with your launch! 🚀**

---

## 🖥️ VPS Deployment (80.96.6.93)

Pentru deploy pe VPS în loc de Vercel, urmează pașii de mai jos:

### Prerequisites pe VPS

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Instalare Node.js 18+ via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18

# Instalare PM2 pentru process management
npm install -g pm2

# Instalare Nginx
sudo apt install nginx -y

# Instalare Git
sudo apt install git -y
```

### Deploy Steps

```bash
# 1. Creează directorul și clonează repo-ul
sudo mkdir -p /var/www/om
sudo chown $USER:$USER /var/www/om
git clone https://github.com/xerud2002/OM.git /var/www/om
cd /var/www/om

# 2. Instalează dependencies
npm ci --production=false

# 3. Creează și configurează .env
cp ".env copy.example" .env
nano .env  # Editează cu valorile de producție
# IMPORTANT: Actualizează NEXT_PUBLIC_APP_URL=http://80.96.6.93 (sau domeniu)

# 4. Build pentru producție
npm run build

# 5. Pornește cu PM2 (folosește ecosystem.config.cjs din repo)
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup  # Auto-restart la reboot
```

### Configurare Nginx

```bash
# Creează config Nginx
sudo nano /etc/nginx/sites-available/om
```

Conținut:

```nginx
server {
    listen 80;
    server_name 80.96.6.93 ofertemutare.ro www.ofertemutare.ro;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

```bash
# Activează site-ul
sudo ln -s /etc/nginx/sites-available/om /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL cu Certbot (după configurarea DNS)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ofertemutare.ro -d www.ofertemutare.ro
```

### Firewall

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### CRON pentru Remindere (înlocuiește Vercel CRON)

```bash
# Adaugă în crontab
crontab -e

# Adaugă linia (rulează zilnic la 9:00):
0 9 * * * curl -X POST http://localhost:3000/api/sendUploadReminders -H "x-api-key: YOUR_CRON_API_KEY" >> /var/log/om-cron.log 2>&1
```

### Comenzi Utile PM2

```bash
pm2 status              # Status aplicație
pm2 logs om-app         # Vezi logs
pm2 logs om-app --lines 100  # Ultimele 100 linii
pm2 restart om-app      # Restart aplicație
pm2 reload om-app       # Zero-downtime reload
pm2 monit               # Monitor real-time
```

### Script de Deploy Rapid

Folosește `deploy.sh` din repo:

```bash
chmod +x deploy.sh
./deploy.sh
```

### Firebase Authorized Domains

⚠️ **CRITIC**: Adaugă în Firebase Console → Authentication → Authorized domains:

- `80.96.6.93`
- `ofertemutare.ro` (când ai domeniu)
- `www.ofertemutare.ro`

### Checklist VPS

- [ ] Node.js 18+ instalat
- [ ] PM2 instalat și configurat
- [ ] Nginx instalat și configurat
- [ ] .env creat cu toate variabilele
- [ ] `npm run build` reușit
- [ ] PM2 pornește aplicația
- [ ] Nginx proxy funcționează
- [ ] Firewall configurat
- [ ] IP/domeniu adăugat în Firebase Auth
- [ ] CRON job setat pentru remindere
- [ ] SSL configurat (dacă ai domeniu)
