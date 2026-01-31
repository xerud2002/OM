#!/bin/bash
# Diagnostic script for Firebase Admin Private Key issue
# Run this directly on VPS: bash diagnose-firebase.sh

echo "========================================="
echo "  Firebase Admin Key Diagnostic Tool"
echo "========================================="
echo ""

cd /var/www/om || exit 1

echo "1. Checking .env file existence..."
if [ -f ".env" ]; then
    echo "   ✓ .env file found"
    echo "   File size: $(stat -f%z .env 2>/dev/null || stat -c%s .env) bytes"
else
    echo "   ✗ .env file NOT found!"
    exit 1
fi

echo ""
echo "2. Checking FIREBASE_ADMIN_PRIVATE_KEY variable..."
if grep -q "FIREBASE_ADMIN_PRIVATE_KEY=" .env; then
    echo "   ✓ Variable exists in .env"
    
    # Extract and check the key
    KEY_LINE=$(grep "FIREBASE_ADMIN_PRIVATE_KEY=" .env)
    KEY_LENGTH=${#KEY_LINE}
    echo "   Line length: $KEY_LENGTH characters"
    
    # Check if key starts correctly
    if echo "$KEY_LINE" | grep -q "BEGIN PRIVATE KEY"; then
        echo "   ✓ Key contains BEGIN PRIVATE KEY marker"
    else
        echo "   ✗ Key does NOT contain BEGIN PRIVATE KEY marker"
        echo "   First 100 chars: ${KEY_LINE:0:100}"
    fi
    
    # Check if key ends correctly
    if echo "$KEY_LINE" | grep -q "END PRIVATE KEY"; then
        echo "   ✓ Key contains END PRIVATE KEY marker"
    else
        echo "   ✗ Key does NOT contain END PRIVATE KEY marker"
    fi
    
    # Count newlines (should be properly escaped)
    NEWLINE_COUNT=$(echo "$KEY_LINE" | grep -o "\\\\n" | wc -l)
    echo "   Escaped newlines (\\n) found: $NEWLINE_COUNT"
    
else
    echo "   ✗ FIREBASE_ADMIN_PRIVATE_KEY not found in .env!"
    exit 1
fi

echo ""
echo "3. Checking other Firebase variables..."
grep "FIREBASE_ADMIN" .env | grep -v "PRIVATE_KEY" | while read line; do
    VAR_NAME=$(echo "$line" | cut -d= -f1)
    VAR_VALUE=$(echo "$line" | cut -d= -f2-)
    VAR_LEN=${#VAR_VALUE}
    echo "   $VAR_NAME: ${VAR_LEN} chars"
done

echo ""
echo "4. Testing Node.js private key parsing..."
cat > /tmp/test-firebase-key.js << 'TESTEOF'
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = '/var/www/om/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let privateKey = null;
for (const line of lines) {
    if (line.startsWith('FIREBASE_ADMIN_PRIVATE_KEY=')) {
        privateKey = line.substring('FIREBASE_ADMIN_PRIVATE_KEY='.length);
        // Replace escaped newlines with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
        break;
    }
}

if (!privateKey) {
    console.log('   ✗ Could not extract private key from .env');
    process.exit(1);
}

console.log('   Private key extracted:');
console.log('   - Length:', privateKey.length, 'characters');
console.log('   - Has BEGIN marker:', privateKey.includes('BEGIN PRIVATE KEY'));
console.log('   - Has END marker:', privateKey.includes('END PRIVATE KEY'));
console.log('   - Actual newlines:', (privateKey.match(/\n/g) || []).length);

// Try to parse with firebase-admin
try {
    const admin = require('firebase-admin');
    
    // Get other env vars
    let projectId, clientEmail;
    for (const line of lines) {
        if (line.startsWith('FIREBASE_ADMIN_PROJECT_ID=')) {
            projectId = line.split('=')[1];
        }
        if (line.startsWith('FIREBASE_ADMIN_CLIENT_EMAIL=')) {
            clientEmail = line.split('=')[1];
        }
    }
    
    const testApp = admin.initializeApp({
        credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: clientEmail,
            privateKey: privateKey
        })
    }, 'diagnostic-test');
    
    console.log('   ✓ Firebase Admin initialized successfully!');
    await testApp.delete();
    
} catch (error) {
    console.log('   ✗ Firebase Admin initialization FAILED:');
    console.log('   Error:', error.message);
    console.log('');
    console.log('   First 200 chars of key:');
    console.log('   ' + privateKey.substring(0, 200));
}
TESTEOF

node /tmp/test-firebase-key.js

echo ""
echo "========================================="
echo "  Diagnostic Complete"
echo "========================================="
echo ""
echo "If errors found, run: bash fix-firebase-key.sh"
