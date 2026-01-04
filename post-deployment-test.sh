#!/bin/bash
# post-deployment-test.sh - Verify deployment is working correctly
# Run this after deployment: ./post-deployment-test.sh

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="ofertemutare.ro"
LOCAL_URL="http://localhost:3000"
HTTPS_URL="https://$DOMAIN"
HTTP_URL="http://$DOMAIN"

echo -e "${BLUE}🧪 Post-Deployment Test Suite${NC}"
echo "=================================================="
echo ""

PASSED=0
FAILED=0

# Test 1: PM2 Status
echo -e "${BLUE}[1/12] Checking PM2 status...${NC}"
if pm2 describe om-app > /dev/null 2>&1; then
    STATUS=$(pm2 jlist | grep -o '"pm2_env":{"status":"[^"]*"' | grep -o 'status":"[^"]*"' | cut -d'"' -f3)
    if [ "$STATUS" = "online" ]; then
        echo -e "${GREEN}✓ PM2 process is online${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ PM2 process status: $STATUS${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ PM2 process 'om-app' not found${NC}"
    ((FAILED++))
fi

# Test 2: Local HTTP Response
echo -e "${BLUE}[2/12] Testing local HTTP response...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $LOCAL_URL)
if [[ "$HTTP_CODE" =~ ^(200|301|302)$ ]]; then
    echo -e "${GREEN}✓ Local server responding (HTTP $HTTP_CODE)${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Local server not responding (HTTP $HTTP_CODE)${NC}"
    ((FAILED++))
fi

# Test 3: Nginx Running
echo -e "${BLUE}[3/12] Checking Nginx status...${NC}"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx is running${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Nginx is not running${NC}"
    ((FAILED++))
fi

# Test 4: Nginx Configuration
echo -e "${BLUE}[4/12] Testing Nginx configuration...${NC}"
if nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Nginx configuration has errors${NC}"
    ((FAILED++))
fi

# Test 5: DNS Resolution
echo -e "${BLUE}[5/12] Testing DNS resolution...${NC}"
if nslookup $DOMAIN > /dev/null 2>&1; then
    IP=$(nslookup $DOMAIN | grep -A1 "Name:" | grep "Address:" | awk '{print $2}')
    echo -e "${GREEN}✓ DNS resolves to: $IP${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ DNS resolution failed${NC}"
    ((FAILED++))
fi

# Test 6: HTTPS Certificate
echo -e "${BLUE}[6/12] Checking SSL certificate...${NC}"
if timeout 5 openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
    echo -e "${GREEN}✓ SSL certificate is valid${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ SSL certificate check failed or not yet configured${NC}"
    echo -e "${YELLOW}  Run: certbot --nginx -d ofertemutare.ro -d www.ofertemutare.ro${NC}"
    ((FAILED++))
fi

# Test 7: HTTPS Response
echo -e "${BLUE}[7/12] Testing HTTPS response...${NC}"
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -k $HTTPS_URL)
if [[ "$HTTPS_CODE" =~ ^(200|301|302)$ ]]; then
    echo -e "${GREEN}✓ HTTPS responding (HTTP $HTTPS_CODE)${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ HTTPS not responding (HTTP $HTTPS_CODE)${NC}"
    ((FAILED++))
fi

# Test 8: Environment Variables
echo -e "${BLUE}[8/12] Checking environment file...${NC}"
if [ -f "/var/www/om/.env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    
    # Check for required variables
    REQUIRED_VARS=("NEXT_PUBLIC_FIREBASE_API_KEY" "FIREBASE_ADMIN_PROJECT_ID" "NEXT_PUBLIC_EMAILJS_SERVICE_ID")
    MISSING_VARS=()
    
    for VAR in "${REQUIRED_VARS[@]}"; do
        if ! grep -q "^$VAR=" /var/www/om/.env; then
            MISSING_VARS+=("$VAR")
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -eq 0 ]; then
        echo -e "${GREEN}✓ All required environment variables present${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Missing variables: ${MISSING_VARS[*]}${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ .env file not found${NC}"
    ((FAILED++))
fi

# Test 9: Build Directory
echo -e "${BLUE}[9/12] Checking Next.js build...${NC}"
if [ -d "/var/www/om/.next" ]; then
    echo -e "${GREEN}✓ .next build directory exists${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ .next build directory not found${NC}"
    ((FAILED++))
fi

# Test 10: PM2 Logs (check for errors)
echo -e "${BLUE}[10/12] Checking PM2 logs for errors...${NC}"
ERROR_COUNT=$(pm2 logs om-app --nostream --lines 50 --err 2>/dev/null | grep -i "error\|exception\|failed" | wc -l)
if [ "$ERROR_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✓ No errors in recent logs${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Found $ERROR_COUNT error lines in recent logs${NC}"
    echo -e "${YELLOW}  Check with: pm2 logs om-app${NC}"
    ((FAILED++))
fi

# Test 11: Firewall
echo -e "${BLUE}[11/12] Checking firewall rules...${NC}"
if ufw status | grep -q "80.*ALLOW\|443.*ALLOW"; then
    echo -e "${GREEN}✓ Firewall allows HTTP/HTTPS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Firewall may be blocking traffic${NC}"
    ((FAILED++))
fi

# Test 12: Disk Space
echo -e "${BLUE}[12/12] Checking disk space...${NC}"
DISK_USAGE=$(df -h /var/www/om | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✓ Disk usage: ${DISK_USAGE}%${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Disk usage high: ${DISK_USAGE}%${NC}"
    ((FAILED++))
fi

# Summary
echo ""
echo "=================================================="
echo -e "${BLUE}Test Summary${NC}"
echo "=================================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Deployment looks good!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Test customer registration at: $HTTPS_URL/customer/auth"
    echo "2. Test company registration at: $HTTPS_URL/company/auth"
    echo "3. Create a test request"
    echo "4. Submit a test offer"
    echo "5. Test file upload functionality"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the output above.${NC}"
    echo ""
    echo -e "${BLUE}Troubleshooting:${NC}"
    echo "- Check PM2 logs: pm2 logs om-app"
    echo "- Check Nginx logs: tail -f /var/log/nginx/om_error.log"
    echo "- Verify .env configuration"
    echo "- Ensure Firebase authorized domains are configured"
    exit 1
fi
