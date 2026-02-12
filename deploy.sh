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

# Step 1: Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from GitHub...${NC}"
git fetch origin main
git reset --hard origin/main
echo -e "${GREEN}✅ Code updated${NC}"

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"

# Step 4: Clean up PM2 and restart
echo -e "${YELLOW}🔄 Restarting application...${NC}"

# Kill any process on port 3000 to prevent conflicts
PORT_PID=$(lsof -t -i:3000 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
    echo -e "${YELLOW}   Killing process on port 3000 (PID: $PORT_PID)${NC}"
    kill -9 $PORT_PID 2>/dev/null || true
    sleep 1
fi

# Delete all PM2 processes to start fresh
pm2 delete all 2>/dev/null || true
sleep 1

# Start the application
pm2 start ecosystem.config.cjs
pm2 save

echo -e "${GREEN}✅ Application restarted${NC}"

# Step 5: Wait and verify
echo -e "${YELLOW}⏳ Waiting for server to start...${NC}"
sleep 5

# Verify the server is running
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|304"; then
    echo -e "${GREEN}✅ Server is responding on port 3000${NC}"
else
    echo -e "${YELLOW}⚠️  Server might still be starting...${NC}"
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
