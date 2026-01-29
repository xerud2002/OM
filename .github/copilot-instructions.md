# Copilot Instructions for OM (OferteMutare.ro)

> **Next.js 14 (Pages Router) + Firebase** moving quote platform connecting customers with moving companies in Romania.

## Quick Reference

```bash
npm run dev      # http://localhost:3000
npm run build    # Run before deploy (catches TypeScript errors)
npm run lint     # Zero-warnings enforced (max-warnings=0)
```

**Stack**: Node.js 18+, TypeScript 5.9+, Next.js 14.2+, Firebase 12.8+, Tailwind v4  
**Deployment**: PM2 cluster mode on VPS (see `ecosystem.config.cjs`)  
**Key Features**: Dual-role system, guest requests, sequential codes, real-time notifications

## ⚠️ Critical Rules

### 1. Dual-Role System (NEVER violate)

Users are **exclusively** `customer` OR `company` – profile in `customers/{uid}` OR `companies/{uid}` (never both). Enforced at three layers:

- **Firestore rules**: `canCreateCustomer()`/`canCreateCompany()` – see `firebase.firestore.rules`
- **App code**: `ensureUserProfile()` throws `ROLE_CONFLICT` error
- **UI**: `<RequireRole allowedRole="customer|company">` – wraps protected pages in `components/auth/RequireRole.tsx`

### 2. Firebase Client vs Server SDK

**CRITICAL**: Client and server SDKs are incompatible – mixing them causes runtime errors.

```typescript
// ✅ Client (components, pages, client-side logic) – from services/firebase.ts
import { auth, db, storage } from "@/services/firebase";
import { serverTimestamp, collection, addDoc } from "firebase/firestore";

// ✅ Server (API routes ONLY) – from lib/firebaseAdmin.ts
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
if (!adminReady) return res.status(503).json(apiError("Admin not ready", ErrorCodes.ADMIN_NOT_READY));
```

**Admin SDK graceful degradation**: `adminReady` checks if credentials are valid (not placeholders). Guest request flows fall back to client-side when false.

### 3. API Route Pattern (Mandatory)

All API routes follow this structure (reference: `pages/api/offers/accept.ts`):

```typescript
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiSuccess, apiError, ErrorCodes } from "@/types/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }
  const authResult = await verifyAuth(req);
  if (!authResult.success) return sendAuthError(res, authResult);
  
  // ALWAYS validate ownership before mutations (e.g., requestData.customerId === uid)
  return res.status(200).json(apiSuccess({ result }));
}
```

**Alternative**: Use `withAuth()` wrapper from `lib/apiAuth.ts` for cleaner handlers:
```typescript
export default withAuth(async (req, res, uid) => {
  // uid is automatically validated and provided
  // Write handler logic directly without manual auth checks
});
```

**API Endpoints**: `pages/api/offers/{accept,decline,message}.ts`, `pages/api/requests/{createGuest,linkToAccount}.ts`

## Data Model

**Flow**: Customer creates request → Companies submit offers → Customer accepts one → Others auto-declined

| Collection                      | Key Fields                            | Notes                        |
| ------------------------------- | ------------------------------------- | ---------------------------- |
| `requests/{id}`                 | `customerId`, `requestCode`, `status` | Main document                |
| `requests/{id}/offers/{id}`     | `companyId`, `price`, `requestId`     | **Must** denormalize `requestCode` |
| `companies/{id}/notifications/` | `type`, `requestId`, `read`           | Real-time, server-created    |
| `meta/counters`                 | `requestSeq`                          | Sequential code generator    |

**Statuses**: Requests: `active`/`closed`/`paused`/`cancelled` · Offers: `pending`/`accepted`/`declined`

**Types**: All defined in `types/index.ts` – use `MovingRequest`, `Offer`, `CustomerProfile`, `CompanyProfile`

## Required Helpers (Never use raw Firestore SDK)

```typescript
// ✅ Firestore operations – from utils/firestoreHelpers.ts
import { createRequest, createGuestRequest, addOffer, updateRequest, archiveRequest } from "@/utils/firestoreHelpers";

// ✅ Auth operations – from utils/firebaseHelpers.ts
import { ensureUserProfile, getUserRole, onAuthChange, loginWithGoogle } from "@/utils/firebaseHelpers";
```

Key behaviors:
- `createRequest()` / `createGuestRequest()` auto-generates `REQ-XXXXXX` via Firestore transaction
- `addOffer()` auto-denormalizes `requestId` and `requestCode` on the offer document
- `updateRequest()` triggers notifications to all companies with existing offers
- Always use `serverTimestamp()` – never `new Date()`

## Conventions

| Rule                | Implementation                                          |
| ------------------- | ------------------------------------------------------- |
| **No hard deletes** | Use `archived: true` or status changes                  |
| **Timestamps**      | `serverTimestamp()` only – imported from `firebase/firestore` |
| **Toasts**          | `sonner`: `toast.success()`, `toast.error()` (messages in Romanian) |
| **Phone format**    | Romanian `07xxxxxxxx` – validate with `validators.phone()` from `utils/validation.ts` |
| **Dynamic imports** | Always include `loading` skeleton component             |
| **Error codes**     | Use `ErrorCodes` constants from `types/api.ts`          |
| **Address format**  | Romanian format (Str, Bl, Sc, Ap) – handled internally by `createRequest()` |
| **Move dates**      | Support `moveDateMode`: `exact`/`range`/`flexible` – handled internally by helpers |

## Romanian Localization

**All user-facing text MUST be in Romanian.** This is a Romania-only platform.

### Toast Messages (sonner)
```typescript
// ✅ Correct – Romanian messages
toast.success("Oferta a fost acceptată!");
toast.error("Te rugăm să te autentifici pentru a încărca fișierele.");
toast.error("Acest link a expirat. Te rugăm să contactezi echipa pentru un link nou.");

// ❌ Wrong – English messages
toast.success("Offer accepted!");
```

### Validation Rules (`utils/validation.ts`)
```typescript
validators.phone()  // Romanian format: 07xxxxxxxx or +407xxxxxxxx
validators.cif()    // Romanian CIF/CUI: RO12345678 or 12345678
```

### Address Format
Romanian addresses use: `Str. [street], Nr. [number], Bl. [bloc], Sc. [staircase], Ap. [apartment]`

Internal helper `buildAddressString()` in `utils/firestoreHelpers.ts` handles this format automatically when creating requests.

### Geographic Data
- `cities.ts` – All Romanian cities with county mapping
- `counties.ts` – All 41 Romanian counties (județe)
- Always show city + county in UI: `București, Sector 1` or `Cluj-Napoca, Cluj`

### Common Romanian UI Phrases
| English              | Romanian                                    |
| -------------------- | ------------------------------------------- |
| "Welcome back"       | "Bine ai revenit"                           |
| "Sign in"            | "Autentifică-te"                            |
| "Please try again"   | "Te rugăm să încerci din nou"               |
| "Loading..."         | "Se încarcă..."                             |
| "Save"               | "Salvează"                                  |
| "Cancel"             | "Anulează"                                  |
| "Error occurred"     | "A apărut o eroare"                         |
| "Success"            | "Succes"                                    |

## Styling (Tailwind v4)

Config in `globals.css` `@theme{}` block – **NOT** in `tailwind.config.js`. Brand colors: `emerald-500`, `sky-500`, dark: `#064e3b`

```css
.card         /* Glass-effect card */
.btn-primary  /* Emerald→Sky gradient */
.btn-outline  /* Emerald outlined */
```

Custom animations use `<style jsx>` blocks (see `components/home/LogoTicker.tsx`).

## Key Files Reference

| Purpose              | Path                                    |
| -------------------- | --------------------------------------- |
| Client Firebase      | `services/firebase.ts`                  |
| Admin Firebase       | `lib/firebaseAdmin.ts`                  |
| API Auth Middleware  | `lib/apiAuth.ts`                        |
| Firestore CRUD       | `utils/firestoreHelpers.ts`             |
| Auth Helpers         | `utils/firebaseHelpers.ts`              |
| Types                | `types/index.ts`, `types/api.ts`        |
| Security Rules       | `firebase.firestore.rules`              |
| Page Guards          | `components/auth/RequireRole.tsx`       |
| Global Styles        | `globals.css`                           |
| Romanian geo data    | `cities.ts`, `counties.ts`              |
| Validation           | `utils/validation.ts`                   |

## Development Workflows

### Testing (No Framework)
**This project has no test suite.** Verify changes manually:
```bash
npm run build    # TypeScript compilation check
npm run lint     # ESLint with zero warnings
```

### Debugging

**Logging**: Use `logger` from `utils/logger.ts` – logs only in development, silent in production.
```typescript
import { logger, logCritical } from "@/utils/logger";
logger.log("Debug info");      // Dev only
logger.error("Something failed"); // Dev only
logCritical("FATAL:", error);  // Always logs (production too)
```

**Console cleanup**: `utils/devErrorSuppressor.ts` auto-filters noisy dev warnings (WebSocket, HMR, preload).

**Firebase debugging**: Check Network tab for Firestore calls. Admin SDK errors logged server-side in API routes.

### Firebase Rules Deployment
```bash
firebase login                          # One-time auth
firebase deploy --only firestore:rules  # Deploy Firestore rules
firebase deploy --only storage          # Deploy Storage rules
```

### Database "Migrations"
**No migration system** – Firestore is schemaless. For data changes:
1. Update types in `types/index.ts`
2. Ensure backward compatibility (old documents still work)
3. Update helpers in `utils/firestoreHelpers.ts` to handle both old/new formats
4. Example: `moveDate` → `moveDateMode` + `moveDateStart` + `moveDateEnd` (legacy `moveDate` still supported)

### Scheduled Tasks (CRON)
**Endpoint**: `GET /api/sendUploadReminders`
- Protected by `x-api-key` header matching `CRON_API_KEY`
- Sends email reminders for unused upload tokens (3+ days old)
- Run via external cron service (e.g., cron-job.org):
```bash
curl -H "x-api-key: YOUR_CRON_API_KEY" https://ofertemutare.ro/api/sendUploadReminders
```

### Media Upload System
**Flow**: Customer creates request → `generateUploadLink` API creates 7-day token in `uploadTokens/{token}` → Customer receives email with `/upload/[token]` link → Token validated → Files uploaded to Firebase Storage (`requests/{requestId}/customers/{uid}/`) → Token marked used → Companies notified

**Firestore Collection**: `uploadTokens/{token}`
```typescript
{
  requestId: string;
  customerEmail: string;
  customerName?: string;
  uploadLink: string;
  createdAt: string;      // ISO date
  expiresAt: string;      // 7 days from creation
  used: boolean;
  uploadedAt: string | null;
  reminderSent?: boolean; // Set by CRON job
}
```

**Storage Path**: `requests/{requestId}/customers/{uid}/{timestamp}_{index}.{ext}`

| Endpoint                           | Method | Auth Required | Purpose                              |
| ---------------------------------- | ------ | ------------- | ------------------------------------ |
| `/api/generateUploadLink`          | POST   | No*           | Creates token, returns upload link   |
| `/api/validateUploadToken?token=X` | GET    | No            | Checks token validity before upload  |
| `/api/markUploadTokenUsed`         | POST   | Yes (Bearer)  | Marks token consumed after upload    |
| `/api/notifyCompaniesOnUpload`     | POST   | Yes (Bearer)  | Creates notifications for companies  |
| `/api/sendUploadReminders`         | GET    | API Key       | CRON: sends reminders for unused tokens |

*`generateUploadLink` called server-side after request creation

**Upload Page**: `pages/upload/[token].tsx` – validates token, requires auth, uploads to Storage, updates request with `mediaUrls`

### Local Development
```bash
npm run dev                  # http://localhost:3000, HMR enabled
firebase emulators:start     # (Optional) Local Firebase emulators
```

## Environment Variables

**Required for production** (see `.env` file):
- `FIREBASE_ADMIN_PROJECT_ID` / `FIREBASE_ADMIN_CLIENT_EMAIL` / `FIREBASE_ADMIN_PRIVATE_KEY` – Server-side auth
- `NEXT_PUBLIC_FIREBASE_*` – Client SDK config (7 vars total)
- `RESEND_API_KEY` + `NOTIFY_FROM_EMAIL` – Email notifications via Resend
- `CRON_API_KEY` – Protects scheduled task endpoints

**Admin SDK validation**: `adminReady` flag indicates if real credentials are present (not placeholders). When false, guest flows fallback to client-side Firebase operations.

## Common Pitfalls

1. **Admin SDK errors**: Always check `adminReady` before using `adminDb`/`adminAuth`
2. **Role conflicts**: Never create both customer/company profiles for same UID
3. **Timestamps**: `serverTimestamp()` only (not `new Date()`)
4. **Offers**: Must include denormalized `requestId` and `requestCode` – handled by `addOffer()`
5. **Auth header**: `Authorization: Bearer <token>` required on all protected API routes
6. **Tailwind v4**: Extend theme in `globals.css` `@theme{}` block, not JS config
7. **Ownership checks**: Always verify `customerId === uid` or `companyId === uid` before mutations

## Deployment

**Production**: VPS with PM2 cluster mode (see `ecosystem.config.cjs`)
- Runs `max` instances (all CPU cores) on port 3000
- Max 500MB per instance, auto-restarts on crashes (max 10 restarts)
- Logs: `/var/log/pm2/om-{error,out}.log`
- Deploy scripts: `deploy.sh`, `auto-deploy-vps.sh`

**Deploy workflow** (run `deploy.sh` on VPS):
1. `git fetch && git reset --hard origin/main`
2. `npm ci --production=false`
3. `npm run build` (fails on TypeScript/lint errors)
4. PM2 restart with port cleanup

**Build checks**: Run `npm run build` locally before deploying – catches TypeScript errors. Lint must pass with zero warnings (`max-warnings=0`).
