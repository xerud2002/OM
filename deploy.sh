#!/bin/bash
# ===========================================
# AUTO-DEPLOY SCRIPT FOR OFERTEMUTARE.RO
# ===========================================
# This script safely deploys the website with zero downtime
# Run with: ./deploy.sh
# ===========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APP_DIR="/var/www/om"
APP_NAME="om-app"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  🚀 DEPLOYING OFERTEMUTARE.RO${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Verify we're in the right directory
cd "$APP_DIR" || { echo -e "${RED}❌ Failed to cd to $APP_DIR${NC}"; exit 1; }

echo -e "${YELLOW}📂 Working directory: $(pwd)${NC}"

# Step 1: Save current commit for rollback
PREV_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "none")
echo -e "${YELLOW}📌 Current commit: ${PREV_COMMIT}${NC}"

# Step 2: Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from GitHub...${NC}"
git fetch origin main
git reset --hard origin/main
NEW_COMMIT=$(git rev-parse HEAD)
echo -e "${GREEN}✅ Code updated to ${NEW_COMMIT}${NC}"

# Step 3: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --production=false
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 4: Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
if ! npm run build; then
    echo -e "${RED}❌ Build failed! Rolling back to ${PREV_COMMIT}...${NC}"
    if [ "$PREV_COMMIT" != "none" ]; then
        git reset --hard "$PREV_COMMIT"
        npm ci --production=false
        npm run build
        echo -e "${YELLOW}⚠️  Rolled back to previous commit${NC}"
    fi
    exit 1
fi
echo -e "${GREEN}✅ Build complete${NC}"

# Step 5: Graceful reload via PM2 (zero-downtime rolling restart)
echo -e "${YELLOW}🔄 Reloading application (zero-downtime)...${NC}"
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    pm2 reload "$APP_NAME" --update-env
else
    pm2 start ecosystem.config.cjs
fi
pm2 save
echo -e "${GREEN}✅ Application reloaded${NC}"

# Step 6: Health check with retry
echo -e "${YELLOW}⏳ Running health check...${NC}"
HEALTHY=false
for i in 1 2 3 4 5; do
    sleep 3
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
        HEALTHY=true
        break
    fi
    echo -e "${YELLOW}   Attempt $i/5 - status: $HTTP_CODE${NC}"
done

if [ "$HEALTHY" = true ]; then
    echo -e "${GREEN}✅ Server is healthy (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Health check failed! Rolling back...${NC}"
    if [ "$PREV_COMMIT" != "none" ]; then
        git reset --hard "$PREV_COMMIT"
        npm ci --production=false
        npm run build
        pm2 reload "$APP_NAME" --update-env
        echo -e "${YELLOW}⚠️  Rolled back to ${PREV_COMMIT}${NC}"
    fi
    exit 1
fi

# Show PM2 status
echo ""
echo -e "${BLUE}📊 PM2 Status:${NC}"
pm2 status

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Website: https://ofertemutare.ro${NC}"
echo -e "${GREEN}========================================${NC}"
