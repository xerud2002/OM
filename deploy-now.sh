#!/bin/bash
# Deploy complet automat - rulează tot fără interacțiune

set -e

echo "🚀 Starting automated deployment..."

# 1. Oprește Apache2
echo "[1] Stopping Apache2..."
systemctl stop apache2 2>/dev/null || true
systemctl disable apache2 2>/dev/null || true
apt remove apache2 -y 2>/dev/null || true

# 2. Update sistem
echo "[2] Updating system..."
apt update && apt upgrade -y

# 3. Instalează Node.js 18
echo "[3] Installing Node.js 18..."
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
    nvm alias default 18
else
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 18 2>/dev/null || nvm install 18
fi

# 4. Instalează PM2
echo "[4] Installing PM2..."
npm install -g pm2

# 5. Setup PM2 startup
echo "[5] Configuring PM2 startup..."
pm2 startup systemd -u root --hp /root | tail -n 1 | bash || true

# 6. Instalează Nginx
echo "[6] Installing Nginx..."
apt install nginx -y
systemctl stop nginx

# 7. Firewall
echo "[7] Configuring firewall..."
apt install ufw -y
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# 8. Certbot
echo "[8] Installing Certbot..."
apt install certbot python3-certbot-nginx git curl wget htop -y

# 9. Clonează repo
echo "[9] Cloning repository..."
mkdir -p /var/www/om
cd /var/www/om
if [ -d ".git" ]; then
    git fetch origin && git reset --hard origin/main
else
    git clone https://github.com/xerud2002/OM.git .
fi

# 10. Creează .env
echo "[10] Creating .env file..."
cat > /var/www/om/.env << 'ENVEOF'
NEXT_PUBLIC_APP_URL=https://ofertemutare.ro

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEhc8NVBGtYl_pBCO_bSzif8ixAWmsYQM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=omro-e5a88.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=omro-e5a88
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=omro-e5a88.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=637884424288
NEXT_PUBLIC_FIREBASE_APP_ID=1:637884424288:web:4e74fb3ef403c849ea305
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-7GJERPJ8N3

NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_258bq8e
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_ltgetnd
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=LRc_CmeBZi8NqTT0O
NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID=template_upload_reminder

FIREBASE_ADMIN_PROJECT_ID=omro-e5a88
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@omro-e5a88.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCghzVDxuWe1FUf\naB8eVBBfQefLfARa+J799uJm31EK7A/sSfNsDJUFxuli1seR4Av93qPB5LKmvUt1\nrjPhr2umy+wWvFAGEyUQnTmR0EBbTJqUzGC7lFpyRNFnnDc5/GoBWI4j1c/K6RPM\nNwfpoY23MthKCmhoiT/vzVF0VHieCb5YVGDJVACXkTRuoLIKQwyLKhnhnSXUei0f\nke6Y3AQpNYq+PA6e4hMbKXZ31MLCJOjZr6l5LpNAnSaTJFEuQk+g8cPIzhfcLIfg\nrp8mLGAjZhDURYTcQTQWW0Uw2EUi2FGhn1rPbwwnKK1VYrnfRhSIvrezLbyyu11y\nyWVsZtVDAgMBAAECggEASWr9R/XQMA+xrM8MqGzPHhoA3vZl8YtTABkpm94X7TRg\n5fM+gxTQFVfPhvZvSP7czSvF3phvwsXBnN1i+h2mUR9j51QSD20zHwGhglhqDree\n3V4KAdCMe0WRNl9ifME+ZEYxoB8aTZXDCbvDgS1zqK128YoIDYN0PAM99UPq9HAL\nA3Ls9inDlIbNT7TC+BH75Yv2MD/VOwYfu7o936zocZfIS33hmpqrD2d9WZOqOZzZ\nXSdH47Cpw54J1YWRITmlBs2zdNAFApJ85NilOEee6bIKFGl6InxLgkS/dKABUdV0\nlaVnn1J+zYn5a6dKNnQKm7e6P1s+Ulwk08W8Em/xbQKBgQDgDugoML0BrW6uT/i/\nWQlCUwXbmR2ejpPUObOlwn++pWYGq6y6RSqe8GRgXajSGnBHHyIfLwcG2HzFsA9r\nXNmSMqi4HpS7PQ9ndGCmDVaCQ7BzEBoTpVv8oh6pcU5yh1qd/r9uG+YcQVnVRF9o\nT5nu77pBguc2GV5zbPbuimabvQKBgQC3ab8HqQvR8KttUSUTHFH5RDce8v2wrjGV\n/xGA2Ei0EFCNbTuMBAg+q7CRqISfJsJRlvLyF2q9bLo4sFqbaWIXz5F5aSw0wq6p\n2xIl3EK22ids5msKnym7SUYhKpTe66HKuKq2cG2gZzZ1QG4cULhAxt/zIMp8Lr5B\n2FQf8ZnE/wKBgQCWS0mNVAwkqOqagMhxyk68r6Y5RL8qkac177LC2PIJtzb1+Ih3\ntle9n7ElNw48SUHRY1/nHQuQmv0vOkdNlE3ZlKO6RcEsy+ueUOFX4ZCK9s7QkBd9\n4CkREMqSjI+7oXG2k6BjQtGbWHbi6Oc6uFKghSwiL6Xaky/ZK1mEb1Ae3QKBgQCY\nJ8GyOSr1HxMXvRlkoTnf8BdKNYr/54J7TP7YRJULy/0HVnbv0OiGFSiFradX4G+U\nAAXLkGGcg3Z5UNPZ2bLmzeuBLR7fJiKABp0ni3JM/u12CjECvsd/92mWWhzmUdQG\nuOvmLZ7EUtt6qdiu5Mf19QYUTD+uhZiQR0aCuYs3QQKBgQCRmMTx/QRGLFdZ4fl8\nKbm5sKXSeK7uvd4it9oJraverzWyygVunVM3G434JTqmt/sRmRmJwnpTltrY7eOU\n0TS0QhPb0jzJpmynYNS6zPltjtJmmqRqBhsrWhygqZNXF1dudU8paWRdIKng6W7p\npRtLhR6+Ib2F63jE7A8VlEvJBQ==\n-----END PRIVATE KEY-----\n"

CRON_API_KEY=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0

RESEND_API_KEY=re_H3UwSLWS_CEhQSnRy5VEmCjaJCmVQRGmg
ENVEOF

# 11. Instalează dependențe
echo "[11] Installing dependencies..."
cd /var/www/om
npm ci --production=false

# 12. Build
echo "[12] Building application..."
npm run build

# 13. Configurează Nginx
echo "[13] Configuring Nginx..."
cat > /etc/nginx/sites-available/om << 'EOF'
server {
    listen 80;
    server_name ofertemutare.ro www.ofertemutare.ro 80.96.6.93;

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
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    access_log /var/log/nginx/om_access.log;
    error_log /var/log/nginx/om_error.log;
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/om /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
systemctl enable nginx

# 14. Start PM2
echo "[14] Starting application with PM2..."
cd /var/www/om
pm2 delete om-app 2>/dev/null || true
pm2 start ecosystem.config.cjs --env production
pm2 save

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Site: http://ofertemutare.ro"
echo ""
echo "Next steps:"
echo "1. Run: certbot --nginx -d ofertemutare.ro -d www.ofertemutare.ro"
echo "2. Add Firebase domains at: https://console.firebase.google.com/project/omro-e5a88/authentication/settings"
echo ""
pm2 status
