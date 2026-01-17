# Copilot Instructions for OM (OferteMutare.ro)

> Next.js 14 Pages Router + Firebase + Tailwind v4 platform connecting Romanian customers with moving companies.

## Commands
```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build (required before deploy)
npm run lint     # ESLint with 0 warnings max (enforced by husky pre-commit)
```

## Architecture

**Dual-role system**: Users are `customer` OR `company`, never both. Profiles in `customers/{uid}` or `companies/{uid}`. Enforced by `ensureUserProfile()` in `utils/firebaseHelpers.ts` (throws `ROLE_CONFLICT`) and Firestore rules (`canCreateCustomer()`/`canCreateCompany()`).

<<<<<<< HEAD
**Request flow**: Customer creates request → `generateRequestCode()` assigns REQ-XXXXXX via transaction → Companies pay for access, submit offers → Customer accepts one (batch declines others via `pages/api/offers/accept.ts`) → Notifications sent.
=======
**Dual-role system**: Users are either `customer` or `company` — never both. Profiles stored in `customers/{uid}` or `companies/{uid}`. Auth helper `ensureUserProfile()` in `utils/firebaseHelpers.ts` enforces this by checking opposite collection before creating profile, throwing `ROLE_CONFLICT` error if violated. Security rules in `firebase.firestore.rules` enforce this at DB level via `canCreateCustomer()`/`canCreateCompany()` functions.

**Key data flow**: Customer creates request → Sequential REQ-XXXXXX code generated via Firestore transaction on `meta/counters` doc (starts at 141000) → Companies view and submit offers → Customer accepts one offer (batch write declines all others via `pages/api/offers/accept.ts`) → Email notifications sent to company → Request status updated to 'accepted'.
>>>>>>> 807d0f046dfb415594613dc4471af6126ed60fad

**Firebase initialization**: Client SDK in `services/firebase.ts` handles hot reload with `getApps()` check. Admin SDK in `lib/firebaseAdmin.ts` gracefully degrades if credentials missing — always verify `adminReady` flag before privileged operations.

## Critical Patterns

### Firebase Imports — Always use singletons
```tsx
import { auth, db, storage } from "@/services/firebase";        // Client
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";  // API routes
```

### Role-Protected Pages
```tsx
<RequireRole allowedRole="customer">  {/* Retries 5x with 400ms delay for async profile */}
  <LayoutWrapper>{children}</LayoutWrapper>
</RequireRole>
```

### Firestore Helpers — Use these, not raw calls
```tsx
import { createRequest, updateRequest } from "@/utils/firestoreHelpers";
// Auto-generates REQ-XXXXXX, strips undefined fields, handles moveDate logic
await createRequest({ ...form, customerId: user.uid });
```

### API Authentication
```tsx
import { withAuth } from "@/lib/apiAuth";
export default withAuth(async (req, res, uid) => { /* uid verified */ });

<<<<<<< HEAD
// Client-side calls require Bearer token
=======
// Option 2: Manual verification (when you need more control)
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
const authResult = await verifyAuth(req);
if (!authResult.success) return sendAuthError(res, authResult);
const uid = authResult.uid;
```

### Client-Side API Calls

```tsx
// All secured endpoints require Firebase ID token in Authorization header
>>>>>>> 807d0f046dfb415594613dc4471af6126ed60fad
const token = await user.getIdToken();
fetch("/api/offers/accept", { headers: { Authorization: `Bearer ${token}` }, ... });
```

### API Responses
```tsx
import { apiSuccess, apiError, ErrorCodes } from "@/types/api";
return res.status(200).json(apiSuccess({ id }));
return res.status(400).json(apiError("Invalid input", ErrorCodes.BAD_REQUEST));
```

## Data Model

| Collection | Key Fields |
|------------|------------|
| `requests/{id}` | `customerId`, `requestCode` (REQ-XXXXXX), `fromCity/toCity`, `moveDateMode`, `status`, `archived` |
| `requests/{id}/offers/{id}` | `companyId`, `price`, `status`. **Must denormalize** `requestId`/`requestCode` |
| `companies/{id}/payments/{requestId}` | Payment records for request access |
| `companies/{id}/notifications/{id}` | Server-created notifications |
| `meta/counters` | `requestSeq` for sequential codes (starts 141000) |

## Conventions

<<<<<<< HEAD
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
=======
- **Timestamps**: Always `serverTimestamp()` for `createdAt`/`updatedAt`
- **No hard deletes**: Use `archived: true` or `status: 'closed'`
- **Tailwind v4**: Config in `globals.css` via `@theme{}`. Use `.card`, `.btn-primary`, `.btn-outline`
- **Romanian data**: `cities.ts`/`counties.ts` for locations, `utils/validation.ts` for phone/CIF
- **Animations**: `utils/animations.ts` (`fadeUp`, `staggerContainer`)
- **Toasts**: `sonner` — `toast.success()`, `toast.error()`
- **Address formatting**: Use `buildAddressString()`, `buildMoveDateFields()` from `firestoreHelpers.ts`
>>>>>>> 3fcd890a9c37e9f080bbf5444f34b96f02573e85

## Key Files

| Concern | Location |
|---------|----------|
| Firebase client | `services/firebase.ts` |
| Firebase Admin | `lib/firebaseAdmin.ts` |
| API auth | `lib/apiAuth.ts` (`withAuth`, `verifyAuth`) |
| Firestore CRUD | `utils/firestoreHelpers.ts` |
| Auth helpers | `utils/firebaseHelpers.ts` |
| Types | `types/index.ts`, `types/api.ts` |
| Security rules | `firebase.firestore.rules`, `firebase.storage.rules` |
| Styling | `globals.css` |

<<<<<<< HEAD
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
=======
## Environment

Required in `.env`:
- `NEXT_PUBLIC_FIREBASE_*` — Client config
- `FIREBASE_ADMIN_*` — Service account (check `adminReady` before admin ops)
- `NEXT_PUBLIC_EMAILJS_*` — Client emails via `utils/emailHelpers.ts`
- `RESEND_API_KEY` — Server transactional emails
>>>>>>> 3fcd890a9c37e9f080bbf5444f34b96f02573e85
