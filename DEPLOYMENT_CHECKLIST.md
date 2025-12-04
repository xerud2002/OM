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
