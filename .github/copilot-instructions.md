# Copilot Instructions for OM (OferteMutare.ro)

Next.js 14 Pages Router + Firebase + Tailwind v4 platform connecting Romanian customers with moving companies.

## Quick Start

```bash
npm run dev      # http://localhost:3000
npm run build    # Always run before deploy
npm run lint     # Zero-warnings policy (Husky pre-commit)
```

## Architecture Overview

**Dual-role system**: Users are exclusively `customer` OR `company` (never both). Enforced by:

- Firestore rules: `canCreateCustomer()` / `canCreateCompany()` check opposite role doesn't exist
- `ensureUserProfile()` in `utils/firebaseHelpers.ts` throws `ROLE_CONFLICT` error if dual-role attempted
- Profiles stored in `customers/{uid}` or `companies/{uid}`

**Firebase singleton pattern** (CRITICAL - never instantiate twice):

- Client SDK: import `{ auth, db, storage }` from `services/firebase.ts`
- Admin SDK: import `{ adminDb, adminAuth, adminReady }` from `lib/firebaseAdmin.ts`
- Always check `adminReady` before Admin SDK operations (gracefully handles missing credentials)

## API Route Pattern

All protected endpoints follow this structure (see `pages/api/offers/accept.ts`):

```typescript
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiSuccess, apiError, ErrorCodes } from "@/types/api";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json(apiError("Method Not Allowed"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return sendAuthError(res, authResult);
  const uid = authResult.uid;

  // Ownership validation
  if (requestData.customerId !== uid) return res.status(403).json(apiError("Not authorized"));

  return res.json(apiSuccess({ data }));
}
```

Alternative: wrap entire handler with `withAuth(async (req, res, uid) => { ... })`.

## Request Flow & Data Model

1. Customer creates request via `createRequest()` in `utils/firestoreHelpers.ts`
2. Auto-generates `REQ-XXXXXX` code via Firestore transaction on `meta/counters.requestSeq`
3. Companies submit offers to `requests/{id}/offers/{offerId}` (denormalize `requestId`, `requestCode`)
4. Customer accepts via `pages/api/offers/accept.ts` → batch declines others, sends notifications

**Core collections:**

- `requests/{id}`: `customerId`, `requestCode`, `fromCity/toCity`, `moveDateMode`, `status`, `archived`
- `requests/{id}/offers/{id}`: `companyId`, `price`, `status` (pending/accepted/declined)
- `companies/{id}/notifications/{id}`, `companies/{id}/payments/{requestId}`

## Key Conventions

| Convention      | Implementation                                                                 |
| --------------- | ------------------------------------------------------------------------------ |
| No hard deletes | Use `archived: true` or `status: 'closed'`                                     |
| Timestamps      | Always `serverTimestamp()` for writes                                          |
| Role protection | Wrap pages with `<RequireRole allowedRole="customer">`                         |
| Toasts          | Use `sonner`: `toast.success()`, `toast.error()`                               |
| Validation      | Romanian phone: `07xxxxxxxx`, CIF: `validators.cif()` in `utils/validation.ts` |

## Styling (Tailwind v4)

Config via CSS in `globals.css` using `@theme{}`. Use shared classes:

- `.card` - standard card wrapper
- `.btn-primary` - emerald filled button
- `.btn-outline` - outlined button variant

## Media Upload Flow

Token-based upload system for customers who choose "upload later":

1. `generateUploadLink.ts` creates token
2. `pages/upload/[token].tsx` public upload page
3. `validateUploadToken.ts` / `markUploadTokenUsed.ts` for token lifecycle
4. `notifyCompaniesOnUpload.ts` alerts companies when media added

## Key Files Reference

| Purpose              | File                                                 |
| -------------------- | ---------------------------------------------------- |
| Client Firebase      | `services/firebase.ts`                               |
| Admin Firebase       | `lib/firebaseAdmin.ts`                               |
| API auth middleware  | `lib/apiAuth.ts`                                     |
| Firestore CRUD       | `utils/firestoreHelpers.ts`                          |
| Auth/profile helpers | `utils/firebaseHelpers.ts`                           |
| Types                | `types/index.ts`, `types/api.ts`                     |
| Security rules       | `firebase.firestore.rules`, `firebase.storage.rules` |

## Agent Guidelines

1. **Prefer helpers** over raw Firestore: use `createRequest()`, `addOffer()`, `ensureUserProfile()`
2. **Check `adminReady`** before any Admin SDK call in API routes
3. **Denormalize** `requestId`/`requestCode` on subcollection documents
4. **Never delete** - use `archived: true` or status changes
5. **Ownership validation** - always verify `customerId === uid` or `companyId === uid`
