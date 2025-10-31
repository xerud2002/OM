// Placeholder TypeScript shim to avoid compile-time errors when firebase-admin is not installed.
// The real implementation is in `lib/firebaseAdmin.js` (ESM), which is used at runtime by API routes.
// Do not import this file directly.
export const adminDb: any = undefined;
export const adminAuth: any = undefined;
export default {} as any;
