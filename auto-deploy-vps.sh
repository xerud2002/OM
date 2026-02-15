#!/bin/bash
# Script automat pentru deployment complet OferteMutare.ro
# Rulează: bash auto-deploy-vps.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    OferteMutare.ro - Setup Automat VPS                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verifică dacă rulează ca root sau cu sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Eroare: Trebuie să rulezi ca root sau cu sudo${NC}"
    echo "Rulează: sudo bash auto-deploy-vps.sh"
    exit 1
fi

echo -e "${GREEN}[1/15] Opresc și dezinstalează Apache2...${NC}"
systemctl stop apache2 2>/dev/null || true
systemctl disable apache2 2>/dev/null || true
apt remove apache2 -y 2>/dev/null || true
apt autoremove -y

echo -e "${GREEN}[2/15] Actualizez sistemul...${NC}"
apt update && apt upgrade -y

echo -e "${GREEN}[3/15] Instalez Node.js 20 LTS via nvm...${NC}"
# Verifică dacă nvm există
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
    nvm alias default 20
else
    echo "nvm deja instalat"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 20 2>/dev/null || nvm install 20
fi

echo -e "${GREEN}Node version: $(node --version)${NC}"

echo -e "${GREEN}[4/15] Instalez PM2...${NC}"
npm install -g pm2

echo -e "${GREEN}[5/15] Configurez PM2 startup...${NC}"
pm2 startup systemd -u root --hp /root | tail -n 1 | bash || true

echo -e "${GREEN}[6/15] Instalez Nginx...${NC}"
apt install nginx -y
systemctl stop nginx

echo -e "${GREEN}[7/15] Configurez firewall...${NC}"
apt install ufw -y
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

echo -e "${GREEN}[8/15] Instalez Certbot...${NC}"
apt install certbot python3-certbot-nginx -y

echo -e "${GREEN}[9/15] Instalez Git și alte tools...${NC}"
apt install git curl wget htop -y

echo -e "${GREEN}[10/15] Creez directorul aplicației...${NC}"
mkdir -p /var/www/om
cd /var/www/om

echo -e "${GREEN}[11/15] Clonez repository-ul...${NC}"
if [ -d ".git" ]; then
    echo "Repository deja clonat, actualizez..."
    git fetch origin
    git reset --hard origin/main
else
    git clone https://github.com/xerud2002/OM.git .
fi

echo -e "${GREEN}[12/15] Configurez environment (.env)...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Trebuie să configurezi .env!${NC}"
    echo "Copiez .env.example..."
    cp .env.example .env
    
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Completează credențialele în .env!${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Deschide alt terminal și editează:"
    echo "  nano /var/www/om/.env"
    echo ""
    echo "Trebuie să completezi:"
    echo "  - FIREBASE_ADMIN_CLIENT_EMAIL"
    echo "  - FIREBASE_ADMIN_PRIVATE_KEY"
    echo "  - RESEND_API_KEY"
    echo ""
    read -p "Apasă ENTER după ce ai salvat .env..." 
fi

echo -e "${GREEN}[13/15] Instalez dependențele...${NC}"
npm ci --production=false

echo -e "${GREEN}[14/15] Build aplicația...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Verifică erorile de mai sus.${NC}"
    exit 1
fi

echo -e "${GREEN}[15/15] Configurez Nginx...${NC}"
cat > /etc/nginx/sites-available/om << 'EOF'
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
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    access_log /var/log/nginx/om_access.log;
    error_log /var/log/nginx/om_error.log;
}
EOF

# Șterge default site-ul Nginx
rm -f /etc/nginx/sites-enabled/default

# Activează site-ul
ln -sf /etc/nginx/sites-available/om /etc/nginx/sites-enabled/

# Test config
nginx -t

if [ $? -ne 0 ]; then
    echo -e "${RED}Nginx config invalid!${NC}"
    exit 1
fi

# Start Nginx
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}Pornesc aplicația cu PM2...${NC}"
cd /var/www/om

# Oprește procesul existent dacă există
pm2 delete om-app 2>/dev/null || true

# Pornește aplicația
pm2 start ecosystem.config.cjs --env production
pm2 save

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup complet!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Status aplicație:${NC}"
pm2 status

echo ""
echo -e "${BLUE}Testează:${NC}"
echo "  http://ofertemutare.ro"
echo "  http://80.96.6.93"
echo ""
echo -e "${YELLOW}Următorii pași:${NC}"
echo ""
echo "1. Configurează SSL (HTTPS):"
echo "   certbot --nginx -d ofertemutare.ro -d www.ofertemutare.ro"
echo ""
echo "2. Adaugă domenii în Firebase:"
echo "   https://console.firebase.google.com/project/omro-e5a88/authentication/settings"
echo "   - ofertemutare.ro"
echo "   - www.ofertemutare.ro"
echo "   - 80.96.6.93"
echo ""
echo "3. Verifică logs:"
echo "   pm2 logs om-app"
echo ""
echo "4. Rulează teste:"
echo "   cd /var/www/om && ./post-deployment-test.sh"
echo ""
