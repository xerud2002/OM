#!/bin/bash
# deploy.sh - Script pentru deploy pe VPS 80.96.6.93
# Utilizare: ./deploy.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurare
APP_DIR="/var/www/om"
REPO_URL="https://github.com/xerud2002/OM.git"
BRANCH="main"
BACKUP_DIR="/var/backups/om"

echo -e "${BLUE}🚀 Starting deployment for OferteMutari.ro${NC}"
echo "=================================================="

# Check if running in correct directory
if [ "$PWD" != "$APP_DIR" ]; then
    echo -e "${YELLOW}⚠️  Not in app directory. Changing to $APP_DIR${NC}"
    cd "$APP_DIR"
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup current .env file
if [ -f ".env" ]; then
    echo -e "${GREEN}[1/8] Backing up .env file...${NC}"
    cp .env "$BACKUP_DIR/.env.backup.$(date +%Y%m%d_%H%M%S)"
else
    echo -e "${RED}⚠️  No .env file found! Deployment may fail.${NC}"
fi

# Verifică dacă directorul există
if [ -d "$APP_DIR/.git" ]; then
    echo -e "${GREEN}[2/8] Pulling latest changes from $BRANCH...${NC}"
    
    # Stash any local changes
    git stash --include-untracked
    
    # Fetch and reset to origin
    git fetch origin
    git reset --hard origin/$BRANCH
    
    # Show latest commit
    echo -e "${BLUE}Latest commit:${NC}"
    git log -1 --oneline
else
    echo -e "${GREEN}[2/8] Cloning repository...${NC}"
    cd "$(dirname "$APP_DIR")"
    git clone "$REPO_URL" "$(basename "$APP_DIR")"
    cd "$APP_DIR"
fi

# Backup old build
if [ -d ".next" ]; then
    echo -e "${GREEN}[3/8] Backing up previous build...${NC}"
    rm -rf "$BACKUP_DIR/.next.backup" 2>/dev/null || true
    cp -r .next "$BACKUP_DIR/.next.backup"
fi

# Install dependencies
echo -e "${GREEN}[4/8] Installing dependencies...${NC}"
npm ci --production=false

# Run linting (optional, can be skipped with --skip-lint flag)
if [[ ! "$*" =~ "--skip-lint" ]]; then
    echo -e "${GREEN}[5/8] Running linter...${NC}"
    npm run lint || {
        echo -e "${YELLOW}⚠️  Linting failed but continuing...${NC}"
    }
else
    echo -e "${YELLOW}[5/8] Skipping linter...${NC}"
fi

# Build
echo -e "${GREEN}[6/8] Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Rolling back...${NC}"
    
    # Restore previous build if exists
    if [ -d "$BACKUP_DIR/.next.backup" ]; then
        rm -rf .next
        cp -r "$BACKUP_DIR/.next.backup" .next
        echo -e "${YELLOW}✓ Previous build restored${NC}"
    fi
    
    exit 1
fi

# Restart PM2
echo -e "${GREEN}[7/8] Restarting application with PM2...${NC}"
if pm2 describe om-app > /dev/null 2>&1; then
    echo "Reloading existing PM2 process (zero-downtime)..."
    pm2 reload om-app --update-env
else
    echo "Starting new PM2 process..."
    pm2 start ecosystem.config.cjs --env production
fi

# Save PM2 configuration
pm2 save

# Health check
echo -e "${GREEN}[8/8] Running health check...${NC}"
sleep 3

# Check if app is responding
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${RED}⚠️  Health check failed - check logs!${NC}"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  📊 Check status:  pm2 status"
echo "  📋 View logs:     pm2 logs om-app"
echo "  📈 Monitor:       pm2 monit"
echo "  🔄 Restart:       pm2 restart om-app"
echo ""
echo -e "${BLUE}Site URLs:${NC}"
echo "  🌐 https://ofertemutari.ro"
echo "  🌐 https://www.ofertemutari.ro"
echo ""

# Show PM2 status
pm2 status om-app
