# Copilot Instructions for OM (OferteMutare.ro)

Next.js 14 Pages Router + Firebase + Tailwind v4 platform connecting Romanian customers with moving companies.

## Quick Start

```bash
npm run dev      # http://localhost:3000
npm run build    # Always run before deploy (required)
npm run lint     # Zero-warnings policy (Husky pre-commit enforced)
```

## Core Architecture

### Dual-Role System (CRITICAL)

Users are **exclusively** `customer` OR `company` - never both. Enforced at 3 levels:

1. **Firestore rules**: `canCreateCustomer()` / `canCreateCompany()` check opposite role doesn't exist
2. **Application**: `ensureUserProfile()` throws `ROLE_CONFLICT` if dual-role attempted
3. **UI**: `<RequireRole allowedRole="customer|company">` component guards pages

Profiles stored in `customers/{uid}` or `companies/{uid}`.

### Firebase Singleton Pattern (CRITICAL)

Never instantiate Firebase twice - always import from designated modules:

```typescript
// Client-side (components, pages)
import { auth, db, storage } from "@/services/firebase";

// Server-side (API routes only)
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
if (!adminReady) return res.status(503).json(apiError("Admin not ready"));
```

## API Route Pattern

All protected endpoints in `pages/api/` follow this structure:

```typescript
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiSuccess, apiError } from "@/types/api";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json(apiError("Method Not Allowed"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return sendAuthError(res, authResult);
  const uid = authResult.uid;

  // ALWAYS validate ownership
  if (requestData.customerId !== uid) return res.status(403).json(apiError("Not authorized"));

  return res.json(apiSuccess({ data }));
}
```

Alternative: wrap entire handler with `withAuth(async (req, res, uid) => { ... })`.

## Data Model & Collections

**Request lifecycle**: Customer creates → Companies submit offers → Customer accepts one → Others auto-declined

| Collection                      | Key Fields                                                 | Notes                        |
| ------------------------------- | ---------------------------------------------------------- | ---------------------------- |
| `requests/{id}`                 | `customerId`, `requestCode`, `fromCity/toCity`, `status`   | Main request document        |
| `requests/{id}/offers/{id}`     | `companyId`, `price`, `status`, `requestId`, `requestCode` | **Denormalize parent refs!** |
| `companies/{id}/notifications/` | `type`, `requestId`, `read`                                | Real-time company alerts     |

**Status values**: `active` | `closed` | `paused` | `cancelled` (requests), `pending` | `accepted` | `declined` (offers)

## Helper Functions (USE THESE!)

```typescript
// Instead of raw Firestore, use:
import { createRequest, addOffer, updateRequest, archiveRequest } from "@/utils/firestoreHelpers";
import { ensureUserProfile, getUserRole } from "@/utils/firebaseHelpers";
```

`createRequest()` auto-generates `REQ-XXXXXX` codes via Firestore transaction on `meta/counters.requestSeq`.

## Key Conventions

| Rule                | Implementation                                             |
| ------------------- | ---------------------------------------------------------- |
| **No hard deletes** | Use `archived: true` or status changes                     |
| **Timestamps**      | Always `serverTimestamp()` for writes                      |
| **Toasts**          | Use `sonner`: `toast.success()`, `toast.error()`           |
| **Romanian phone**  | Format: `07xxxxxxxx` - validate with `utils/validation.ts` |
| **Denormalization** | Always include `requestId`/`requestCode` on subcollections |

## Styling (Tailwind v4)

Config in `globals.css` using `@theme{}`. Use existing utility classes:

- `.card` - rounded card with glass effect
- `.btn-primary` - emerald gradient button
- `.btn-outline` - outlined variant

## Media Upload Flow

Token-based system for deferred uploads:

1. `generateUploadLink.ts` creates token → `pages/upload/[token].tsx` public page
2. `validateUploadToken.ts` / `markUploadTokenUsed.ts` manage lifecycle
3. `notifyCompaniesOnUpload.ts` alerts companies when media added

## Key Files Reference

| Purpose              | File                              |
| -------------------- | --------------------------------- |
| Client Firebase      | `services/firebase.ts`            |
| Admin Firebase       | `lib/firebaseAdmin.ts`            |
| API auth middleware  | `lib/apiAuth.ts`                  |
| Firestore CRUD       | `utils/firestoreHelpers.ts`       |
| Auth/profile helpers | `utils/firebaseHelpers.ts`        |
| Types                | `types/index.ts`, `types/api.ts`  |
| Security rules       | `firebase.firestore.rules`        |
| Page protection      | `components/auth/RequireRole.tsx` |
