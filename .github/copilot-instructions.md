# Copilot Instructions for OM (OferteMutare.ro)

> **Next.js 14 (Pages Router) + Firebase** moving quote platform connecting customers with moving companies in Romania.

## Quick Reference

```bash
npm run dev      # http://localhost:3000
npm run build    # TypeScript check – run before deploying
npm run lint     # Zero warnings enforced (max-warnings=0)
firebase deploy --only firestore:rules  # Deploy security rules
```

**Stack**: Node.js 18+, TypeScript 5.9+, Next.js 14.2+, Firebase 12.8+, Tailwind v4

## ⚠️ Critical Architecture Rules

### 1. Dual-Role System (NEVER violate)

Users are **exclusively** `customer` OR `company` – profile stored in `customers/{uid}` OR `companies/{uid}` (never both). Enforced at three layers:

- **Firestore rules**: `canCreateCustomer()`/`canCreateCompany()` in `firebase.firestore.rules`
- **App code**: `ensureUserProfile()` in `utils/firebaseHelpers.ts` throws `ROLE_CONFLICT`
- **UI guard**: `<RequireRole allowedRole="customer|company">` in `components/auth/RequireRole.tsx`

### 2. Firebase SDK Separation (CRITICAL)

Client and Admin SDKs are **incompatible** – mixing causes runtime errors:

```typescript
// ✅ Client (components, pages) – services/firebase.ts
import { auth, db, storage } from "@/services/firebase";
import { serverTimestamp } from "firebase/firestore";

// ✅ Server (API routes ONLY) – lib/firebaseAdmin.ts
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
if (!adminReady)
  return res.status(503).json(apiError("Admin not ready", ErrorCodes.ADMIN_NOT_READY));
```

### 3. API Route Pattern

All protected endpoints follow this structure (see `pages/api/offers/accept.ts`):

```typescript
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiSuccess, apiError, ErrorCodes } from "@/types/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json(apiError("Method Not Allowed"));
  const authResult = await verifyAuth(req);
  if (!authResult.success) return sendAuthError(res, authResult);
  // ALWAYS validate ownership: requestData.customerId === uid
  return res.status(200).json(apiSuccess({ result }));
}
```

Or use `withAuth()` wrapper: `export default withAuth(async (req, res, uid) => { ... });`

**API Endpoints** (in `pages/api/`):
- `offers/accept.ts`, `offers/decline.ts`, `offers/message.ts` – Protected offer actions
- `generateUploadLink.ts`, `validateUploadToken.ts` – Token-based media upload flow
- `requests/` – Request management endpoints

## Data Model & Helpers

**Flow**: Customer creates request → Companies submit offers → Customer accepts one → Others auto-declined

| Collection                      | Key Fields                            | Notes                          |
| ------------------------------- | ------------------------------------- | ------------------------------ |
| `requests/{id}`                 | `customerId`, `requestCode`, `status` | Main document                  |
| `requests/{id}/offers/{id}`     | `companyId`, `price`, `requestId`     | Must denormalize `requestCode` |
| `companies/{id}/notifications/` | `type`, `requestId`, `read`           | Server-created only            |
| `companies/{id}/payments/`      | `companyId`, `requestId`, `status`    | Payment records                |
| `meta/counters`                 | `requestSeq`                          | Sequential code generation     |

**Required helpers** – never use raw Firestore SDK for these operations:

```typescript
// utils/firestoreHelpers.ts – auto-generates REQ-XXXXXX codes, denormalizes data
import {
  createRequest,
  createGuestRequest,
  addOffer,
  updateRequest,
  archiveRequest,
} from "@/utils/firestoreHelpers";

// utils/firebaseHelpers.ts – handles role conflicts, auth state
import {
  ensureUserProfile,
  getUserRole,
  onAuthChange,
  loginWithGoogle,
  logout,
} from "@/utils/firebaseHelpers";
```

- Always use `serverTimestamp()` from `firebase/firestore` – never `new Date()`
- `updateRequest()` auto-notifies companies with existing offers
- No hard deletes – use `archived: true` or status changes
- Request codes generated via Firestore transactions in `generateRequestCode()`

## Romanian Localization (MANDATORY)

**All user-facing text MUST be in Romanian.** This is a Romania-only platform.

```typescript
toast.success("Oferta a fost acceptată!"); // ✅ Correct
toast.success("Offer accepted!"); // ❌ Wrong
```

- Phone: `07xxxxxxxx` or `+407xxxxxxxx` – use `validators.phone()` from `utils/validation.ts`
- CIF/CUI: `RO12345678` or `12345678` – use `validators.cif()`
- Address format: `Str. X, Nr. Y, Bl. Z, Sc. A, Ap. B` – handled by `buildAddressString()` in `firestoreHelpers.ts`
- Geographic data: `cities.ts`, `counties.ts` – always show city + county pair

## Styling (Tailwind v4)

Theme defined in `globals.css` `@theme{}` block – **NOT** in `tailwind.config.js`:

```css
.card         /* Glass-effect card */
.btn-primary  /* Emerald→Sky gradient */
.btn-outline  /* Emerald outlined */
```

Brand colors: `emerald-500`, `sky-500`, dark: `#064e3b`

## Key Files Reference

| Purpose         | Path                              |
| --------------- | --------------------------------- |
| Client Firebase | `services/firebase.ts`            |
| Admin Firebase  | `lib/firebaseAdmin.ts`            |
| API Auth        | `lib/apiAuth.ts`                  |
| Firestore CRUD  | `utils/firestoreHelpers.ts`       |
| Auth Helpers    | `utils/firebaseHelpers.ts`        |
| Types           | `types/index.ts`, `types/api.ts`  |
| Security Rules  | `firebase.firestore.rules`        |
| Page Guards     | `components/auth/RequireRole.tsx` |

## Development

**No test suite** – verify with `npm run build` (TypeScript) + `npm run lint` (ESLint).

**Logging**: Use `logger` from `utils/logger.ts` (dev-only) or `logCritical()` (always logs).

**Firebase rules**: `firebase deploy --only firestore:rules`

**Schema changes**: Update `types/index.ts`, ensure backward compatibility in helpers.

## Deployment

**VPS + PM2** (see `ecosystem.config.cjs`, `deploy.sh`):

1. `npm run build` locally – catches errors before deploy
2. On VPS: `./deploy.sh` pulls, builds, restarts PM2

**Environment**: Requires `FIREBASE_ADMIN_*`, `NEXT_PUBLIC_FIREBASE_*`, `RESEND_API_KEY`, `CRON_API_KEY`

## Common Pitfalls

1. Check `adminReady` before using `adminDb`/`adminAuth` in API routes
2. Never create both customer/company profiles for same UID
3. Use `serverTimestamp()` only – not `new Date()`
4. Validate ownership (`customerId === uid`) before all mutations
5. Tailwind v4: extend theme in `globals.css`, not JS config
