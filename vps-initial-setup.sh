#!/bin/bash
# VPS Initial Setup Script for OferteMutari.ro
# Run this script on your VPS: bash <(curl -s https://raw.githubusercontent.com/xerud2002/OM/main/vps-initial-setup.sh)

set -e

echo "🚀 OferteMutari.ro - VPS Initial Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${YELLOW}⚠️  Running as root. Consider using a non-root user with sudo privileges.${NC}"
fi

echo -e "${GREEN}[1/10] Updating system...${NC}"
apt update && apt upgrade -y

echo -e "${GREEN}[2/10] Installing Node.js via nvm...${NC}"
# Install nvm
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Install Node.js 18
    nvm install 18
    nvm use 18
    nvm alias default 18
else
    echo "nvm already installed"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

echo -e "${GREEN}Node version: $(node --version)${NC}"
echo -e "${GREEN}npm version: $(npm --version)${NC}"

echo -e "${GREEN}[3/10] Installing PM2...${NC}"
npm install -g pm2

echo -e "${GREEN}[4/10] Setting up PM2 startup...${NC}"
pm2 startup systemd -u $USER --hp $HOME | tail -n 1 | bash

echo -e "${GREEN}[5/10] Installing Nginx...${NC}"
apt install nginx -y
systemctl start nginx
systemctl enable nginx

echo -e "${GREEN}[6/10] Installing Certbot for SSL...${NC}"
apt install certbot python3-certbot-nginx -y

echo -e "${GREEN}[7/10] Configuring firewall (UFW)...${NC}"
apt install ufw -y
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo -e "${GREEN}Firewall status:${NC}"
ufw status

echo -e "${GREEN}[8/10] Creating application directory...${NC}"
mkdir -p /var/www/om
chown -R $USER:$USER /var/www/om

echo -e "${GREEN}[9/10] Installing additional tools...${NC}"
apt install git curl wget htop -y

echo -e "${GREEN}[10/10] Installing Fail2Ban for security...${NC}"
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban

echo ""
echo -e "${GREEN}✅ Initial setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Clone your repository to /var/www/om"
echo "   cd /var/www/om"
echo "   git clone https://github.com/xerud2002/OM.git ."
echo ""
echo "2. Create .env file with your credentials"
echo "   nano /var/www/om/.env"
echo ""
echo "3. Install dependencies and build"
echo "   npm ci --production=false"
echo "   npm run build"
echo ""
echo "4. Start with PM2"
echo "   pm2 start ecosystem.config.cjs --env production"
echo "   pm2 save"
echo ""
echo "5. Configure Nginx (see VPS_SETUP_GUIDE.md)"
echo ""
echo -e "${GREEN}For detailed instructions, see: VPS_SETUP_GUIDE.md${NC}"
