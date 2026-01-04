# VPS Deployment - Quick Start

## 🚀 Quick Deployment (Copy & Paste)

### Step 1: SSH into your VPS
```bash
ssh root@80.96.6.93
```

### Step 2: Run Initial Setup (One-Time)
```bash
curl -fsSL https://raw.githubusercontent.com/xerud2002/OM/main/vps-initial-setup.sh | bash
```

Or manually from the VPS:
```bash
cd /tmp
git clone https://github.com/xerud2002/OM.git
cd OM
bash vps-initial-setup.sh
```

### Step 3: Clone and Configure Application
```bash
# Clone repository
cd /var/www/om
git clone https://github.com/xerud2002/OM.git .

# Create environment file
nano .env
# Copy contents from .env.example and fill in your credentials
# Save: Ctrl+X, Y, Enter

# Install and build
npm ci --production=false
npm run build
```

### Step 4: Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.cjs --env production
pm2 save

# Verify
pm2 status
```

### Step 5: Configure Nginx
```bash
# Copy configuration
cp /var/www/om/nginx-config.conf /etc/nginx/sites-available/om

# Enable site
ln -s /etc/nginx/sites-available/om /etc/nginx/sites-enabled/

# Test and restart
nginx -t
systemctl restart nginx

# Test in browser
# Open: http://80.96.6.93
```

### Step 6: Setup SSL (After DNS is configured)
```bash
certbot --nginx -d ofertemutari.ro -d www.ofertemutari.ro
```

### Step 7: Configure Firebase
1. Go to: https://console.firebase.google.com/project/omro-e5a88/authentication/settings
2. Add authorized domains:
   - `ofertemutari.ro`
   - `www.ofertemutari.ro`
   - `80.96.6.93`

### Step 8: Test Everything
```bash
cd /var/www/om
chmod +x post-deployment-test.sh
./post-deployment-test.sh
```

---

## 📁 Available Scripts

### `vps-initial-setup.sh`
Initial VPS configuration (Node.js, PM2, Nginx, firewall, etc.)
```bash
bash vps-initial-setup.sh
```

### `deploy.sh`
Deploy updates with zero downtime
```bash
cd /var/www/om
./deploy.sh
```

Options:
- `./deploy.sh` - Full deployment with linting
- `./deploy.sh --skip-lint` - Skip linting step

### `post-deployment-test.sh`
Verify deployment health
```bash
cd /var/www/om
./post-deployment-test.sh
```

---

## 📚 Detailed Documentation

- **[VPS_SETUP_GUIDE.md](VPS_SETUP_GUIDE.md)** - Complete step-by-step setup guide (150+ lines)
- **[VPS_DEPLOYMENT_CHECKLIST.md](VPS_DEPLOYMENT_CHECKLIST.md)** - Interactive checklist to track progress
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Firebase, EmailJS, and CRON configuration
- **[.env.example](.env.example)** - Environment variables template

---

## 🔧 Common Commands

### PM2 Management
```bash
pm2 status                  # Show all processes
pm2 logs om-app            # View logs (real-time)
pm2 logs om-app --lines 100 # Last 100 lines
pm2 restart om-app         # Restart app
pm2 reload om-app          # Zero-downtime reload
pm2 stop om-app            # Stop app
pm2 monit                  # Real-time monitoring
```

### Nginx Management
```bash
systemctl status nginx      # Check status
nginx -t                    # Test configuration
systemctl restart nginx     # Restart Nginx
tail -f /var/log/nginx/om_error.log  # View error logs
```

### System Monitoring
```bash
df -h                      # Disk space
free -m                    # Memory usage
htop                       # Interactive process viewer
ufw status                 # Firewall status
```

---

## 🐛 Troubleshooting

### Site Not Loading
```bash
# Check if app is running
pm2 status

# Check if port 3000 is listening
netstat -tlnp | grep 3000

# Check Nginx
systemctl status nginx
nginx -t

# Check firewall
ufw status

# View logs
pm2 logs om-app --err
tail -f /var/log/nginx/om_error.log
```

### Authentication Failing
1. Verify Firebase authorized domains are configured
2. Check `.env` has correct Firebase credentials
3. Verify `FIREBASE_ADMIN_PRIVATE_KEY` format (includes `\n`)
4. Check browser console for specific errors

### Build Failing
```bash
# Clear everything and rebuild
cd /var/www/om
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### PM2 Issues
```bash
# Kill all PM2 processes
pm2 kill

# Start fresh
pm2 start ecosystem.config.cjs --env production
pm2 save
```

---

## 🔄 Regular Maintenance

### Deploy Updates
```bash
cd /var/www/om
./deploy.sh
```

### Update System
```bash
apt update && apt upgrade -y
```

### Check Logs
```bash
pm2 logs om-app --lines 100
tail -f /var/log/nginx/om_error.log
```

### Renew SSL Certificate (Automatic)
Certbot auto-renews. To test:
```bash
certbot renew --dry-run
```

---

## 📊 Monitoring

### Setup Uptime Monitoring (Optional)
- [UptimeRobot](https://uptimerobot.com/) - Free, monitors every 5 minutes
- [Pingdom](https://www.pingdom.com/) - Free tier available
- [StatusCake](https://www.statuscake.com/) - Free tier available

### Monitor Logs
```bash
# Set up log rotation for PM2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🔐 Security Checklist

- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Firewall configured (UFW)
- [ ] Fail2Ban installed
- [ ] SSL certificate installed
- [ ] Strong passwords for all services
- [ ] `.env` file not in git (in .gitignore)
- [ ] Regular system updates
- [ ] Firebase security rules configured
- [ ] CRON API key secured

---

## 🌐 URLs

- **Website**: https://ofertemutari.ro
- **Firebase Console**: https://console.firebase.google.com/project/omro-e5a88
- **Firebase Auth Settings**: https://console.firebase.google.com/project/omro-e5a88/authentication/settings
- **EmailJS Dashboard**: https://dashboard.emailjs.com/admin
- **Resend Dashboard**: https://resend.com/

---

## 📱 Support

If you need help:
1. Review the detailed **VPS_SETUP_GUIDE.md**
2. Check the **VPS_DEPLOYMENT_CHECKLIST.md**
3. Run **post-deployment-test.sh** to diagnose issues
4. Review PM2 logs: `pm2 logs om-app`
5. Review Nginx logs: `tail -f /var/log/nginx/om_error.log`

---

**Estimated Setup Time: 2-3 hours (including DNS propagation)**

Good luck! 🚀
