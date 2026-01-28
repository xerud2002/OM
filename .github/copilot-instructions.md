# Copilot Instructions for OM (OferteMutare.ro)

> **Next.js 14 (Pages Router) + Firebase** moving quote platform connecting customers with moving companies in Romania.

## Quick Reference

```bash
npm run dev      # http://localhost:3000
npm run build    # Run before deploy (catches TypeScript errors)
npm run lint     # Zero-warnings enforced (Husky pre-commit)
```

**Stack**: Node.js 18+, TypeScript 5.9+, Next.js 14.2+, Firebase 12.8+, Tailwind v4

## ⚠️ Critical Rules

### 1. Dual-Role System (NEVER violate)

Users are **exclusively** `customer` OR `company` – profile in `customers/{uid}` OR `companies/{uid}` (never both). Enforced at three layers:

- **Firestore rules**: `canCreateCustomer()`/`canCreateCompany()` – see `firebase.firestore.rules`
- **App code**: `ensureUserProfile()` throws `ROLE_CONFLICT` error
- **UI**: `<RequireRole allowedRole="customer|company">` – wraps protected pages in `components/auth/RequireRole.tsx`

### 2. Firebase Client vs Server SDK

```typescript
// ✅ Client (components, pages) – from services/firebase.ts
import { auth, db, storage } from "@/services/firebase";

// ✅ Server (API routes ONLY) – from lib/firebaseAdmin.ts
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
if (!adminReady) return res.status(503).json(apiError("Admin not ready", ErrorCodes.ADMIN_NOT_READY));
```

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
| **Address format**  | Use `buildAddressString()` for Romanian format (Str, Bl, Sc, Ap) |
| **Move dates**      | Support `moveDateMode`: `exact`/`range`/`flexible` – use `buildMoveDateFields()` |

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

## Common Pitfalls

1. **Admin SDK errors**: Always check `adminReady` before using `adminDb`/`adminAuth`
2. **Role conflicts**: Never create both customer/company profiles for same UID
3. **Timestamps**: `serverTimestamp()` only (not `new Date()`)
4. **Offers**: Must include denormalized `requestId` and `requestCode` – handled by `addOffer()`
5. **Auth header**: `Authorization: Bearer <token>` required on all protected API routes
6. **Tailwind v4**: Extend theme in `globals.css` `@theme{}` block, not JS config
7. **Ownership checks**: Always verify `customerId === uid` or `companyId === uid` before mutations
