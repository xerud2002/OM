# VPS Setup & Deployment Guide - OferteMutare.ro

## Prerequisites

Your VPS details:

- **IP**: 80.96.6.93
- **Domain**: ofertemutare.ro (and www.ofertemutare.ro)
- **OS**: Ubuntu/Debian (assumed)

---

## Part 1: Initial VPS Setup (Run on VPS)

### 1. Connect to VPS

```bash
ssh root@80.96.6.93
# Or use your SSH key/credentials
```

### 2. Update System

```bash
apt update && apt upgrade -y
```

### 3. Install Node.js 18+ via nvm

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version  # Should show v18.x.x
npm --version
```

### 4. Install PM2 Process Manager

```bash
npm install -g pm2

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it outputs (it will give you a command to run)

# Example output:
# sudo env PATH=$PATH:/home/user/.nvm/versions/node/v18.x.x/bin /home/user/.nvm/versions/node/v18.x.x/lib/node_modules/pm2/bin/pm2 startup systemd -u user --hp /home/user
```

### 5. Install Nginx Web Server

```bash
apt install nginx -y

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Verify
systemctl status nginx
```

### 6. Configure Firewall

```bash
# Install UFW if not present
apt install ufw -y

# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

### 7. Create Application Directory

```bash
# Create directory
mkdir -p /var/www/om
cd /var/www/om

# Set permissions (if needed)
chown -R $USER:$USER /var/www/om
```

---

## Part 2: Clone and Configure Application

### 1. Clone Repository

```bash
cd /var/www/om

# Clone the repo
git clone https://github.com/xerud2002/OM.git .

# Or if already cloned locally, you can use SCP/SFTP to upload files
```

### 2. Create Environment File

```bash
cd /var/www/om
nano .env
```

Paste the following content (replace with your actual values):

```bash
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEhc8NVBGtYl_pBCO_bSzif8ixAWmsYQM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=omro-e5a88.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=omro-e5a88
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=omro-e5a88.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=637884424288
NEXT_PUBLIC_FIREBASE_APP_ID=1:637884424288:web:4e74fb3ef403c849ea305
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-7GJERPJ8N3

# Firebase Admin (Server-side) - REQUIRED for API routes
FIREBASE_ADMIN_PROJECT_ID=omro-e5a88
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account@omro-e5a88.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_258bq8e
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_ltgetnd
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=LRc_CmeBZi8NqTT0O
NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID=template_upload_reminder

# Resend API (for server-side emails)
RESEND_API_KEY=re_your_resend_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://ofertemutare.ro

# CRON API Key (for scheduled tasks)
CRON_API_KEY=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

**Important Notes:**

- Get Firebase Admin credentials from [Firebase Console](https://console.firebase.google.com/project/omro-e5a88/settings/serviceaccounts/adminsdk)
- The private key must be in quotes and keep the `\n` characters
- Get Resend API key from [Resend Dashboard](https://resend.com/api-keys)

Save and exit (Ctrl+X, then Y, then Enter)

### 3. Install Dependencies

```bash
cd /var/www/om
npm ci --production=false
```

### 4. Build Application

```bash
npm run build
```

This should show output like:

```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (29/29)
✓ Finalizing page optimization
```

---

## Part 3: Configure Nginx Reverse Proxy

### 1. Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/om
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name ofertemutare.ro www.ofertemutare.ro 80.96.6.93;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

Save and exit.

### 2. Enable Site

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/om /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Should show:
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Restart Nginx
systemctl restart nginx
```

---

## Part 4: Start Application with PM2

### 1. Start the App

```bash
cd /var/www/om
pm2 start ecosystem.config.cjs --env production
```

### 2. Save PM2 Configuration

```bash
pm2 save
```

### 3. Verify Application is Running

```bash
# Check PM2 status
pm2 status

# Should show:
# ┌─────┬──────────┬─────────┬─────────┬─────────┬──────────┐
# │ id  │ name     │ mode    │ status  │ cpu     │ memory   │
# ├─────┼──────────┼─────────┼─────────┼─────────┼──────────┤
# │ 0   │ om-app   │ cluster │ online  │ 0%      │ 120 MB   │
# └─────┴──────────┴─────────┴─────────┴─────────┴──────────┘

# View logs
pm2 logs om-app --lines 50

# Check if app responds locally
curl http://localhost:3000
```

### 4. Test from Browser

Open your browser and navigate to:

- http://80.96.6.93 (should work immediately)
- http://ofertemutare.ro (requires DNS configuration - see below)

---

## Part 5: DNS Configuration

### Configure Your Domain

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add/update these DNS records:

```
Type    Name    Value           TTL
A       @       80.96.6.93      3600
A       www     80.96.6.93      3600
```

3. Wait for DNS propagation (can take 5 minutes to 48 hours)
4. Test with: `nslookup ofertemutare.ro`

---

## Part 6: SSL/HTTPS Setup with Let's Encrypt

### 1. Install Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### 2. Obtain SSL Certificate

```bash
# Make sure DNS is pointing to your VPS first!
certbot --nginx -d ofertemutare.ro -d www.ofertemutare.ro

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended: Yes)
```

### 3. Test Auto-Renewal

```bash
certbot renew --dry-run
```

Certbot will automatically renew certificates before they expire.

---

## Part 7: Firebase Configuration

### Critical: Add Authorized Domain

1. Go to [Firebase Console](https://console.firebase.google.com/project/omro-e5a88/authentication/settings)
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add these domains:
   - `ofertemutare.ro`
   - `www.ofertemutare.ro`
   - `80.96.6.93` (for testing)
5. Click "Add"

**Without this step, authentication will fail with "auth/unauthorized-domain" error!**

---

## Part 8: Setup CRON Job for Upload Reminders

### Create CRON Job

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 9 AM server time):
0 9 * * * curl -X POST http://localhost:3000/api/sendUploadReminders -H "x-api-key: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0" >> /var/log/cron-reminders.log 2>&1
```

### Test CRON Manually

```bash
curl -X POST http://localhost:3000/api/sendUploadReminders \
  -H "x-api-key: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0"
```

---

## Part 9: Monitoring and Maintenance

### Useful PM2 Commands

```bash
# View status
pm2 status

# View logs (real-time)
pm2 logs om-app

# View last 100 lines
pm2 logs om-app --lines 100

# Restart app
pm2 restart om-app

# Reload app (zero-downtime)
pm2 reload om-app

# Stop app
pm2 stop om-app

# Delete from PM2
pm2 delete om-app

# Monitor CPU/Memory
pm2 monit
```

### Check Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### Check System Resources

```bash
# Disk usage
df -h

# Memory usage
free -m

# CPU usage
top
```

---

## Part 10: Deployment Script (For Updates)

The `deploy.sh` script is already included. To use it:

```bash
# Make executable
chmod +x /var/www/om/deploy.sh

# Run deployment
cd /var/www/om
./deploy.sh
```

This will:

1. Pull latest code from GitHub
2. Install dependencies
3. Build application
4. Reload PM2 with zero downtime

---

## Troubleshooting

### App Won't Start

```bash
# Check PM2 logs
pm2 logs om-app --err

# Check if port 3000 is available
netstat -tlnp | grep 3000

# Restart PM2
pm2 restart om-app
```

### Firebase Auth Errors

- Verify authorized domains in Firebase Console
- Check `.env` file has correct Firebase credentials
- Ensure `FIREBASE_ADMIN_PRIVATE_KEY` is properly formatted

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Nginx Errors

```bash
# Test config
nginx -t

# Check error logs
tail -f /var/log/nginx/error.log

# Restart Nginx
systemctl restart nginx
```

### Site Not Accessible

1. Check firewall: `ufw status`
2. Check Nginx: `systemctl status nginx`
3. Check PM2: `pm2 status`
4. Check DNS: `nslookup ofertemutare.ro`
5. Try accessing by IP: `http://80.96.6.93`

---

## Security Best Practices

### 1. Keep System Updated

```bash
apt update && apt upgrade -y
```

### 2. Setup Fail2Ban (Protects against brute-force)

```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Secure SSH

Edit SSH config:

```bash
nano /etc/ssh/sshd_config
```

Recommended settings:

```
PermitRootLogin no
PasswordAuthentication no  # Use SSH keys only
Port 2222  # Change from default 22
```

Restart SSH:

```bash
systemctl restart sshd
```

### 4. Regular Backups

```bash
# Backup database exports from Firebase Console
# Backup .env file
# Backup uploaded media from Firebase Storage
```

---

## Quick Reference

### Application Info

- **Directory**: `/var/www/om`
- **Port**: 3000
- **Domain**: ofertemutare.ro
- **Process Manager**: PM2
- **Web Server**: Nginx

### Important URLs

- Firebase Console: https://console.firebase.google.com/project/omro-e5a88
- Firebase Auth Settings: https://console.firebase.google.com/project/omro-e5a88/authentication/settings
- Firebase Service Accounts: https://console.firebase.google.com/project/omro-e5a88/settings/serviceaccounts/adminsdk

### Key Commands

```bash
# Deploy updates
cd /var/www/om && ./deploy.sh

# View logs
pm2 logs om-app

# Restart app
pm2 restart om-app

# Check status
pm2 status && systemctl status nginx
```

---

## Success Checklist

- [ ] VPS accessible via SSH
- [ ] Node.js 18+ installed
- [ ] PM2 installed and configured for startup
- [ ] Nginx installed and running
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] Application cloned to `/var/www/om`
- [ ] `.env` file created with all credentials
- [ ] Dependencies installed (`npm ci`)
- [ ] Application built successfully (`npm run build`)
- [ ] PM2 running the app (`pm2 status` shows "online")
- [ ] Nginx configured and restarted
- [ ] Site accessible via IP (http://80.96.6.93)
- [ ] DNS records configured (A records for @ and www)
- [ ] SSL certificate obtained and installed (certbot)
- [ ] Site accessible via HTTPS (https://ofertemutare.ro)
- [ ] Firebase authorized domains configured
- [ ] Authentication works (test login/register)
- [ ] CRON job configured for upload reminders
- [ ] Test file upload functionality
- [ ] Test email notifications

---

## Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs om-app`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify `.env` configuration
4. Ensure Firebase authorized domains are set
5. Check firewall rules: `ufw status`

**Your site should now be live at https://ofertemutare.ro! 🚀**
