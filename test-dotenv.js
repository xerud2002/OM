require('dotenv').config();
console.log('PROJECT_ID:', process.env.FIREBASE_ADMIN_PROJECT_ID || 'MISSING');
console.log('CLIENT_EMAIL:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 'MISSING');
console.log('HAS_PRIVATE_KEY:', !!process.env.FIREBASE_ADMIN_PRIVATE_KEY);
console.log('PRIVATE_KEY_LENGTH:', (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').length);
console.log('NODE_ENV:', process.env.NODE_ENV);
