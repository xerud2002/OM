#!/bin/bash
#
# Firebase Admin Private Key Diagnostic Script
# Run this script on the VPS to diagnose and fix the private key format
#

echo "=== Firebase Admin Private Key Diagnostic ==="
echo ""

cd /var/www/om

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found in /var/www/om"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check if FIREBASE_ADMIN_PRIVATE_KEY is set
if ! grep -q "FIREBASE_ADMIN_PRIVATE_KEY=" .env; then
    echo "❌ ERROR: FIREBASE_ADMIN_PRIVATE_KEY not found in .env"
    exit 1
fi

echo "✅ FIREBASE_ADMIN_PRIVATE_KEY variable exists"
echo ""

# Get key length
KEY_LINE=$(grep "FIREBASE_ADMIN_PRIVATE_KEY=" .env)
KEY_LENGTH=${#KEY_LINE}

echo "📊 Key line length: $KEY_LENGTH characters"
echo ""

# Check key format
echo "🔍 Checking key format..."
echo ""

if echo "$KEY_LINE" | grep -q "BEGIN PRIVATE KEY"; then
    echo "✅ Contains BEGIN PRIVATE KEY marker"
else
    echo "❌ Missing BEGIN PRIVATE KEY marker"
fi

if echo "$KEY_LINE" | grep -q "END PRIVATE KEY"; then
    echo "✅ Contains END PRIVATE KEY marker"
else
    echo "❌ Missing END PRIVATE KEY marker"
fi

if echo "$KEY_LINE" | grep -q '\\n'; then
    echo "✅ Contains \\n escape sequences"
else
    echo "⚠️  No \\n escape sequences found (may have real newlines or wrong format)"
fi

echo ""
echo "📄 First 80 characters of key line:"
echo "$KEY_LINE" | cut -c1-80
echo ""
echo "📄 Last 80 characters of key line:"
echo "$KEY_LINE" | tail -c 80
echo ""

# Expected format check
echo "=== Expected Format ==="
echo 'FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBAD...\n-----END PRIVATE KEY-----\n"'
echo ""
echo "Key points:"
echo "1. Wrapped in double quotes"
echo "2. \\n should be literal backslash+n (not actual newlines)"
echo "3. Must include BEGIN and END markers"
echo "4. No extra quotes or escaping"
echo ""

# Test parsing with Node.js
echo "=== Testing key parsing with Node.js ==="
echo ""

node -e "
const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY || '';
console.log('Raw key length:', key.length);

// Try parsing like firebaseAdmin.ts does
let privateKey = key.replace(/\\\\n/g, '\\n').replace(/\\\\\\\\n/g, '\\n');

if (privateKey.startsWith('\"') && privateKey.endsWith('\"')) {
  privateKey = privateKey.slice(1, -1).replace(/\\\\n/g, '\\n');
}

console.log('Processed key length:', privateKey.length);
console.log('Has BEGIN marker:', privateKey.includes('-----BEGIN'));
console.log('Has END marker:', privateKey.includes('-----END'));
console.log('First 50 chars:', privateKey.substring(0, 50));

// Try to parse as RSA key
try {
  const crypto = require('crypto');
  crypto.createPrivateKey(privateKey);
  console.log('\\n✅ Key is valid RSA private key!');
} catch (err) {
  console.log('\\n❌ Key parsing failed:', err.message);
}
"

echo ""
echo "=== Next Steps ==="
echo ""
echo "If key parsing failed, you need to fix the FIREBASE_ADMIN_PRIVATE_KEY in .env"
echo ""
echo "To get correct private key:"
echo "1. Go to Firebase Console: https://console.firebase.google.com"
echo "2. Select your project (ofertemutare.ro)"
echo "3. Go to Project Settings → Service Accounts"
echo "4. Click 'Generate New Private Key'"
echo "5. Download the JSON file"
echo "6. Open the JSON and find the 'private_key' field"
echo ""
echo "Then run this command to format it correctly:"
echo ""
echo '  echo "FIREBASE_ADMIN_PRIVATE_KEY=\"$(jq -r .private_key service-account-key.json | sed "s/$/\\\\n/g" | tr -d "\\n")\"" > .env.new'
echo ""
echo "Review .env.new, then replace FIREBASE_ADMIN_PRIVATE_KEY line in .env"
echo ""
echo "Finally, restart PM2:"
echo "  pm2 restart om-app"
echo "  pm2 logs om-app --lines 20 | grep -i firebase"
echo ""
