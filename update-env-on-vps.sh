#!/bin/bash
#
# This script will update the .env file on VPS with the correct Firebase private key
# Run this ON THE VPS (not locally)
#

echo "=== Updating Firebase Admin Private Key on VPS ==="
echo ""

cd /var/www/om

# Backup current .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backed up .env to .env.backup.$(date +%Y%m%d_%H%M%S)"

# The correct private key from .env.production (copy this line)
CORRECT_KEY='FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8dJ7nLWoOkOI+\nFnXPPT+qwnb+MmMnQYfxPULkgdLkJL6OXcGZXSBk6U3gQpDmjVLOonxJlXAjJpOt\nreWwbNXQdHJpElvJ+SJnMKTiBKfWC7D2xWJxvwNtR8DfmLpvdvqSamLEuATx1RRJ\nr2Mcb/revXmD02+9t1pZ1rQ4E3EnfmHQz\ne0ygOtdk7qouldA/LZcy0BM=\n-----END PRIVATE KEY-----\n"'

echo ""
echo "📝 Updating FIREBASE_ADMIN_PRIVATE_KEY in .env..."

# Remove old FIREBASE_ADMIN_PRIVATE_KEY line and add new one
grep -v "^FIREBASE_ADMIN_PRIVATE_KEY=" .env > .env.temp
echo "$CORRECT_KEY" >> .env.temp
mv .env.temp .env

echo "✅ Updated .env with correct private key"
echo ""

# Verify the change
echo "🔍 Verifying new key format..."
if grep -q "BEGIN PRIVATE KEY" .env; then
    echo "✅ Key contains BEGIN PRIVATE KEY marker"
else
    echo "❌ ERROR: Key does not contain BEGIN marker"
    echo "   Restoring backup..."
    cp .env.backup.$(ls -t .env.backup.* | head -1) .env
    exit 1
fi

echo ""
echo "✅ Environment file updated successfully!"
echo ""
echo "Now restart PM2 to apply changes:"
echo "  pm2 restart om-app"
echo ""
echo "Then check logs for Firebase initialization:"
echo "  pm2 logs om-app --lines 30 | grep -i firebase"
echo ""
echo "You should see: 'Firebase Admin initialized successfully'"
echo "Instead of: 'Firebase Admin initialization failed'"
echo ""
