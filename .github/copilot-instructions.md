# Copilot Instructions for OM (OferteMutare.ro)

> Next.js 14 + Firebase + Tailwind v4 platform connecting Romanian customers with moving companies.

## Quick Start

```bash
npm run dev        # Port 3000
npm run build      # Production build
npm run lint       # ESLint (0 warnings max) — must pass before commit (husky/lint-staged)
npm run format     # Prettier formatting
```

## Architecture Overview

**Stack**: Next.js 14 Pages Router, TypeScript, Tailwind v4 (CSS-first in `globals.css`), Firebase (Auth/Firestore/Storage), Framer Motion, Sonner toasts, EmailJS (client), Firebase Admin (server emails).

**Dual-role system**: Users are either `customer` or `company` — never both. Profiles stored in `customers/{uid}` or `companies/{uid}`. Auth helper `ensureUserProfile()` in `utils/firebaseHelpers.ts` enforces this by checking opposite collection before creating profile, throwing `ROLE_CONFLICT` error if violated. Security rules in `firebase.firestore.rules` enforce this at DB level via `canCreateCustomer()`/`canCreateCompany()` functions.

**Key data flow**: Customer creates request → Sequential REQ-XXXXXX code generated via Firestore transaction on `meta/counters` doc (starts at 141000) → Companies view and submit offers → Customer accepts one offer (batch write declines all others via `pages/api/offers/accept.ts`) → Email notifications sent to company → Request status updated to 'accepted'.

**Firebase initialization**: Client SDK in `services/firebase.ts` handles hot reload with `getApps()` check. Admin SDK in `lib/firebaseAdmin.ts` gracefully degrades if credentials missing — always verify `adminReady` flag before privileged operations.

## Critical Patterns

### Firebase Imports

```tsx
// ALWAYS import from services/firebase.ts — never initialize elsewhere
import { auth, db, storage } from "@/services/firebase";
// For API routes, use Admin SDK:
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
```

### Role-Protected Pages

```tsx
// Wrap with RequireRole — handles auth redirects + role verification with retries
// Uses 5 retry attempts with 400ms delay between checks to handle async profile creation
<RequireRole allowedRole="customer">
  <LayoutWrapper>{/* content */}</LayoutWrapper>
</RequireRole>
```

### Firestore Helpers (use these, not raw calls)

```tsx
import { createRequest, updateRequest, addOffer, archiveRequest } from "@/utils/firestoreHelpers";

// Auto-generates REQ-XXXXXX codes via transaction on meta/counters doc
// Starts at 141000, increments sequentially
const requestId = await createRequest({ ...form, customerId: user.uid });

// Helper automatically strips undefined fields and handles moveDate logic
await updateRequest(requestId, { status: "closed", archived: true });
```

### Firestore Data Writes

```tsx
// ALWAYS use serverTimestamp() for createdAt/updatedAt fields
import { serverTimestamp } from "firebase/firestore";

// firestoreHelpers.ts automatically strips undefined fields before writes
// No need to manually filter — just pass the entire object
const data = { field1: value1, field2: undefined, field3: value3 };
await createRequest(data); // field2 will be stripped automatically
```

### API Route Authentication

```tsx
// Option 1: Use withAuth wrapper (recommended for simple handlers)
import { withAuth } from "@/lib/apiAuth";
export default withAuth(async (req, res, uid) => {
  // uid is verified, proceed with logic
});

// Option 2: Manual verification (when you need more control)
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
const authResult = await verifyAuth(req);
if (!authResult.success) return sendAuthError(res, authResult);
const uid = authResult.uid;
```

### Client-Side API Calls

```tsx
// All secured endpoints require Firebase ID token in Authorization header
const token = await user.getIdToken();
await fetch("/api/offers/accept", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ requestId, offerId }),
});
```

### API Response Format

```tsx
import { apiSuccess, apiError, ErrorCodes } from "@/types/api";
return res.status(200).json(apiSuccess({ id: "123" }));
return res.status(400).json(apiError("Invalid input", ErrorCodes.BAD_REQUEST));
```

## Data Model

**requests/{id}**: `customerId`, `requestCode` (REQ-XXXXXX), `fromCity/toCity`, `fromCounty/toCounty`, address components (`fromStreet`, `fromNumber`, `fromBloc`...), `moveDateMode` (exact|range|flexible), `status` (active|accepted|closed), `mediaUrls[]`, `archived` flag, timestamps.

**requests/{id}/offers/{id}**: `companyId`, `price`, `message`, `status` (pending|accepted|declined). **Must denormalize** `requestId`/`requestCode` for collectionGroup queries.

**companies/{id}/notifications/{id}**: Real-time notifications for companies (new requests, media uploads). Write via server only.

**companies/{id}/payments/{requestId}**: Payment records for request access. Created by company.

**uploadTokens/{token}**: Token-based media upload links with 7-day expiration.

**meta/counters**: Sequential request code counter (`requestSeq`). Updated via transaction in `generateRequestCode()`.

## Conventions

- **Tailwind v4**: Config in `globals.css` via `@theme{}`. Use `.card`, `.btn-primary`, `.btn-outline` utility classes.
- **Timestamps**: Always use `serverTimestamp()` for Firestore writes.
- **Undefined fields**: `firestoreHelpers.ts` strips these automatically before writes.
- **Romanian localization**: Use `cities.ts`/`counties.ts` for locations, `utils/date.ts` for formatting.
- **Validation**: Use `utils/validation.ts` for Romanian phone (`07xxxxxxxx`) and CIF validation.
- **Animations**: Import variants from `utils/animations.ts` (`fadeUp`, `staggerContainer`).
- **Toasts**: Use `sonner` — `toast.success()`, `toast.error()` for user feedback.
- **No hard deletes**: Use `archived: true` flag or `status: 'closed'` instead of deleting requests.
- **Address building**: Use helper functions in `firestoreHelpers.ts` (`buildAddressString`, `buildMoveDateFields`) for consistent formatting.
- **ESLint**: Zero warnings policy enforced by husky/lint-staged pre-commit hooks. Use `npm run lint` to check.
- **Code Formatting**: Prettier with Tailwind plugin. Run `npm run format` before committing.

## Email System

- **Client-side**: EmailJS via `utils/emailHelpers.ts` using dynamic imports to avoid server bundling
  - Requires `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  - Call `sendEmail({ to_email, to_name, ...params }, templateId?)`
- **Server-side**: Firebase Admin or Resend API for transactional emails
  - Used in `pages/api/offers/accept.ts` for company notifications
  - Requires `RESEND_API_KEY` environment variable

## Media Upload System

**Token-based uploads**: Customers can upload photos/videos later via secure tokens (7-day expiry).

```tsx
// Generate token (server-side via API)
POST /api/generateUploadLink { requestId }
// Creates uploadTokens/{token} doc with:
// - requestId, customerId, customerEmail
// - expiresAt: 7 days from creation
// - used: false

// Validate token before upload
GET /api/validateUploadToken?token={token}
// Checks existence, expiry, and used status

// Upload page
/upload/[token] — Public page for customers to upload media
// Calls /api/markUploadTokenUsed after successful uploads
// Notifies companies via /api/notifyCompaniesOnUpload
```

**Automatic reminders**: Use `/api/sendUploadReminders` (cron job) to email customers with unused tokens.

## Environment Setup

Copy `.env copy.example` → `.env`. Required vars:

- `NEXT_PUBLIC_FIREBASE_*` — Firebase client config
- `FIREBASE_ADMIN_*` — Service account for API routes (check `adminReady` before privileged ops)
- `NEXT_PUBLIC_EMAILJS_*` — Client-side emails via `utils/emailHelpers.ts`
- `RESEND_API_KEY` — Server-side transactional emails

**Important**: `lib/firebaseAdmin.ts` initializes gracefully with fallback when admin credentials missing. Always check `adminReady` flag before admin operations.

## Deployment & Infrastructure

- **VPS Deployment**: See `VPS_README.md` and `auto-deploy-vps.sh` for server setup
- **Nginx Config**: Use `nginx-om.conf` for reverse proxy configuration
- **PM2 Management**: See `ecosystem.config.cjs` for process management
- **Vercel Alternative**: `vercel.json` for serverless deployment option

## File Locations

| Concern              | Location                                                       |
| -------------------- | -------------------------------------------------------------- |
| Firebase client init | `services/firebase.ts`                                         |
| Firebase Admin       | `lib/firebaseAdmin.ts`                                         |
| API auth middleware  | `lib/apiAuth.ts` (`verifyAuth`, `withAuth`)                    |
| Auth helpers         | `utils/firebaseHelpers.ts`                                     |
| Firestore CRUD       | `utils/firestoreHelpers.ts`                                    |
| Types                | `types/index.ts`, `types/api.ts`                               |
| Role guard           | `components/auth/RequireRole.tsx`                              |
| API routes           | `pages/api/**` (offers/accept, offers/decline, offers/message) |
| Dashboards           | `pages/customer/dashboard.tsx`, `pages/company/dashboard.tsx`  |
| Security rules       | `firebase.firestore.rules`, `firebase.storage.rules`           |
| Styling              | `globals.css` (Tailwind v4 `@theme{}` config)                  |
