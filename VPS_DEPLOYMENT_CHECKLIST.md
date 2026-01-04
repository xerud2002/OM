# VPS Deployment Quick Checklist

Use this checklist to track your deployment progress.

## ☐ Phase 1: VPS Initial Setup (30 minutes)

- [ ] SSH into VPS: `ssh root@80.96.6.93`
- [ ] Run initial setup script (or manual steps from VPS_SETUP_GUIDE.md)
- [ ] Verify Node.js installed: `node --version` (should be v18.x.x)
- [ ] Verify PM2 installed: `pm2 --version`
- [ ] Verify Nginx installed: `nginx -v`
- [ ] Verify firewall: `ufw status` (should show ports 22, 80, 443 allowed)

## ☐ Phase 2: Application Setup (20 minutes)

- [ ] Clone repository: `cd /var/www/om && git clone https://github.com/xerud2002/OM.git .`
- [ ] Create `.env` file from `.env.example`
- [ ] Get Firebase Admin credentials from [Firebase Console](https://console.firebase.google.com/project/omro-e5a88/settings/serviceaccounts/adminsdk)
- [ ] Get Resend API key from [Resend Dashboard](https://resend.com/api-keys)
- [ ] Update all credentials in `.env`
- [ ] Install dependencies: `npm ci --production=false`
- [ ] Build application: `npm run build` (should succeed with no errors)

## ☐ Phase 3: Start Application (10 minutes)

- [ ] Start with PM2: `pm2 start ecosystem.config.cjs --env production`
- [ ] Save PM2 config: `pm2 save`
- [ ] Verify app running: `pm2 status` (should show "online")
- [ ] Test locally: `curl http://localhost:3000` (should return HTML)
- [ ] Check logs: `pm2 logs om-app` (should show no errors)

## ☐ Phase 4: Configure Nginx (15 minutes)

- [ ] Copy nginx config: `cp /var/www/om/nginx-config.conf /etc/nginx/sites-available/om`
- [ ] Create symlink: `ln -s /etc/nginx/sites-available/om /etc/nginx/sites-enabled/`
- [ ] Test config: `nginx -t` (should say "successful")
- [ ] Restart Nginx: `systemctl restart nginx`
- [ ] Test via IP: Open browser to `http://80.96.6.93` (should show your site)

## ☐ Phase 5: DNS Configuration (5 minutes + propagation time)

- [ ] Go to your domain registrar (GoDaddy, Namecheap, etc.)
- [ ] Add A record: `@ -> 80.96.6.93`
- [ ] Add A record: `www -> 80.96.6.93`
- [ ] Wait for DNS propagation (test with `nslookup ofertemutare.ro`)
- [ ] Test: Open `http://ofertemutare.ro` in browser

## ☐ Phase 6: SSL/HTTPS Setup (10 minutes)

**Prerequisites**: DNS must be configured and propagated first!

- [ ] Run Certbot: `certbot --nginx -d ofertemutare.ro -d www.ofertemutare.ro`
- [ ] Enter email address
- [ ] Agree to terms
- [ ] Choose to redirect HTTP to HTTPS (recommended: Yes)
- [ ] Test auto-renewal: `certbot renew --dry-run`
- [ ] Verify: Open `https://ofertemutare.ro` (should have valid SSL certificate)

## ☐ Phase 7: Firebase Configuration (5 minutes)

**CRITICAL - Authentication won't work without this!**

- [ ] Go to [Firebase Authentication Settings](https://console.firebase.google.com/project/omro-e5a88/authentication/settings)
- [ ] Scroll to "Authorized domains"
- [ ] Add domain: `ofertemutare.ro`
- [ ] Add domain: `www.ofertemutare.ro`
- [ ] Add domain: `80.96.6.93` (for testing)
- [ ] Test: Try to register/login on your site

## ☐ Phase 8: CRON Job Setup (5 minutes)

- [ ] Edit crontab: `crontab -e`
- [ ] Add line: `0 9 * * * curl -X POST http://localhost:3000/api/sendUploadReminders -H "x-api-key: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0" >> /var/log/cron-reminders.log 2>&1`
- [ ] Test manually: `curl -X POST http://localhost:3000/api/sendUploadReminders -H "x-api-key: YOUR_API_KEY"`
- [ ] Check logs: `tail /var/log/cron-reminders.log`

## ☐ Phase 9: Testing (15 minutes)

- [ ] Test homepage loads: `https://ofertemutare.ro`
- [ ] Test customer registration
- [ ] Test customer login
- [ ] Test company registration
- [ ] Test company login
- [ ] Test creating a request (customer)
- [ ] Test viewing requests (company)
- [ ] Test submitting an offer (company)
- [ ] Test receiving notifications (company)
- [ ] Test file upload functionality
- [ ] Test email notifications (check spam folder)

## ☐ Phase 10: Monitoring Setup (10 minutes)

- [ ] Check PM2 dashboard: `pm2 monit`
- [ ] Set up log rotation for PM2 logs
- [ ] Check Nginx logs: `tail -f /var/log/nginx/om_access.log`
- [ ] Document backup strategy for Firebase data
- [ ] Set up uptime monitoring (optional - UptimeRobot, Pingdom)
- [ ] Set up performance monitoring (optional - New Relic, DataDog)

---

## 🚨 Troubleshooting

### If site doesn't load:

```bash
# Check PM2
pm2 status
pm2 logs om-app

# Check Nginx
systemctl status nginx
nginx -t
tail -f /var/log/nginx/om_error.log

# Check if port 3000 is listening
netstat -tlnp | grep 3000

# Restart everything
pm2 restart om-app
systemctl restart nginx
```

### If authentication fails:

- Verify Firebase authorized domains are configured
- Check `.env` file has correct Firebase credentials
- Check browser console for errors
- Verify `FIREBASE_ADMIN_PRIVATE_KEY` format (must include \n characters)

### If build fails:

```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Success Criteria

Your deployment is successful when:

✅ Site loads at `https://ofertemutare.ro`  
✅ SSL certificate is valid (green lock icon)  
✅ Customers can register and login  
✅ Companies can register and login  
✅ Requests can be created and viewed  
✅ Offers can be submitted  
✅ Notifications work  
✅ File uploads work  
✅ Email notifications sent  
✅ PM2 shows app as "online"  
✅ No errors in `pm2 logs om-app`

---

## 🔄 Future Updates

To deploy updates:

```bash
cd /var/www/om
./deploy.sh
```

Or manually:

```bash
cd /var/www/om
git pull
npm ci --production=false
npm run build
pm2 reload om-app
```

---

## 📞 Need Help?

If you get stuck:

1. Check the detailed **VPS_SETUP_GUIDE.md**
2. Review PM2 logs: `pm2 logs om-app`
3. Review Nginx logs: `tail -f /var/log/nginx/om_error.log`
4. Check the **DEPLOYMENT_CHECKLIST.md** for Firebase and environment setup

**Estimated Total Time: 2-3 hours (including DNS propagation)**
