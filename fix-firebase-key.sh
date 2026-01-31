#!/bin/bash
# Fix Firebase Admin Private Key in .env
# Run this on VPS after getting the correct key from Firebase Console

echo "========================================="
echo "  Firebase Admin Key Fix Tool"
echo "========================================="
echo ""

cd /var/www/om || exit 1

# Backup current .env
echo "1. Backing up current .env..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "   ✓ Backup created"

echo ""
echo "2. Firebase Admin Private Key Format:"
echo ""
echo "   The key MUST be in this format (all on ONE line):"
echo '   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"'
echo ""
echo "   Important:"
echo "   - Wrap in double quotes"
echo "   - Use literal \\n (backslash-n) NOT actual newlines"
echo "   - Include BEGIN and END markers"
echo ""

# Check if user wants to proceed
read -p "Do you want to edit .env now? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   Aborted. Run 'nano .env' manually to fix."
    exit 0
fi

echo ""
echo "3. Opening .env in nano..."
echo "   Navigate to FIREBASE_ADMIN_PRIVATE_KEY line"
echo "   Replace with correct format from Firebase Console"
echo "   Press Ctrl+X, then Y, then Enter to save"
echo ""
sleep 2

nano .env

echo ""
echo "4. Testing new configuration..."
node -e "
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/FIREBASE_ADMIN_PRIVATE_KEY=(.+)/);
if (!match) {
    console.log('   ✗ Could not find FIREBASE_ADMIN_PRIVATE_KEY');
    process.exit(1);
}
let key = match[1];
// Remove quotes if present
key = key.replace(/^[\"']|[\"']$/g, '');
// Replace escaped newlines
key = key.replace(/\\\\n/g, '\n');

console.log('   Key length:', key.length);
console.log('   Has BEGIN:', key.includes('BEGIN PRIVATE KEY'));
console.log('   Has END:', key.includes('END PRIVATE KEY'));
console.log('   Newlines:', (key.match(/\n/g) || []).length);

if (key.length < 100) {
    console.log('   ✗ Key too short - likely incorrect!');
    process.exit(1);
}
if (!key.includes('BEGIN PRIVATE KEY') || !key.includes('END PRIVATE KEY')) {
    console.log('   ✗ Missing markers - check format!');
    process.exit(1);
}
console.log('   ✓ Format looks correct');
"

if [ $? -ne 0 ]; then
    echo ""
    echo "   ✗ Configuration test FAILED"
    echo "   Restoring backup..."
    cp .env.backup.* .env
    echo "   Original .env restored"
    exit 1
fi

echo ""
echo "5. Restarting application..."
pm2 restart om-app

echo ""
echo "6. Checking logs..."
sleep 2
pm2 logs om-app --lines 20 --nostream

echo ""
echo "========================================="
echo "  Fix Complete"
echo "========================================="
echo ""
echo "Test by creating a request at https://ofertemutare.ro"
echo "Check browser console for 503 errors (should be gone)"
echo "Check email for confirmation (should arrive within 30 sec)"
