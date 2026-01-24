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

Users are **exclusively** `customer` OR `company` – profile in `customers/{uid}` OR `companies/{uid}` (never both). Enforced by:

- Firestore rules: `canCreateCustomer()`/`canCreateCompany()` – see `firebase.firestore.rules`
- App code: `ensureUserProfile()` throws `ROLE_CONFLICT`
- UI: `<RequireRole allowedRole="customer|company">` – wraps protected pages

### 2. Firebase Client vs Server SDK

```typescript
// ✅ Client (components, pages)
import { auth, db, storage } from "@/services/firebase";

// ✅ Server (API routes ONLY)
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
if (!adminReady) return res.status(503).json(apiError("Admin not ready"));
```

### 3. API Route Pattern

All API routes must follow this exact structure (see `pages/api/offers/accept.ts` for reference):

```typescript
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { apiSuccess, apiError } from "@/types/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }
  const authResult = await verifyAuth(req);
  if (!authResult.success) return sendAuthError(res, authResult);
  // ALWAYS validate ownership before mutations
  return res.status(200).json(apiSuccess({ result }));
}
```

## Data Model

**Flow**: Customer creates request → Companies submit offers → Customer accepts one → Others auto-declined

| Collection                      | Key Fields                            | Notes                     |
| ------------------------------- | ------------------------------------- | ------------------------- |
| `requests/{id}`                 | `customerId`, `requestCode`, `status` | Main document             |
| `requests/{id}/offers/{id}`     | `companyId`, `price`, `requestId`     | Denormalize `requestCode` |
| `companies/{id}/notifications/` | `type`, `requestId`, `read`           | Real-time                 |

**Statuses**: Requests: `active`/`closed`/`paused`/`cancelled` · Offers: `pending`/`accepted`/`declined`

**Types**: All types defined in `types/index.ts` – use `MovingRequest`, `Offer`, `CustomerProfile`, `CompanyProfile`

## Required Helpers

```typescript
// ✅ Use helpers over raw Firestore SDK
import { createRequest, addOffer, updateRequest } from "@/utils/firestoreHelpers";
import { ensureUserProfile, getUserRole, onAuthChange } from "@/utils/firebaseHelpers";
```

- `createRequest()` auto-generates `REQ-XXXXXX` via transaction (counter in `meta/counters`)
- Always use `serverTimestamp()` – never `new Date()`
- Address fields: use helper `buildAddressString()` for Romanian format (Str, Bl, Sc, Ap)

## Conventions

| Rule                | Implementation                                          |
| ------------------- | ------------------------------------------------------- |
| **No hard deletes** | Use `archived: true` or status changes                  |
| **Timestamps**      | `serverTimestamp()` only                                |
| **Toasts**          | `sonner`: `toast.success()`, `toast.error()` (Romanian) |
| **Phone format**    | Romanian `07xxxxxxxx` – see `utils/validation.ts`       |
| **Dynamic imports** | Always include `loading` skeleton                       |
| **Error codes**     | Use `ErrorCodes` from `types/api.ts`                    |

## Styling (Tailwind v4)

Config in `globals.css` `@theme{}` block – NOT in `tailwind.config.js`. Brand: `emerald-500`, `sky-500`, `dark` (#064e3b)

```css
.card         /* Glass-effect card */
.btn-primary  /* Emerald→Sky gradient */
.btn-outline  /* Emerald outlined */
```

Custom animations (like marquee in `LogoTicker.tsx`) use `<style jsx>` blocks.

## Key Files

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
| Global Styles   | `globals.css`                     |
| Romanian cities | `cities.ts`, `counties.ts`        |

## Common Pitfalls

1. **Admin SDK errors**: Always check `adminReady` before using `adminDb`/`adminAuth`
2. **Role conflicts**: Never create both customer/company profiles for same UID
3. **Timestamps**: `serverTimestamp()` only (not `new Date()`)
4. **Offers**: Must include denormalized `requestId` and `requestCode`
5. **Auth header**: `Authorization: Bearer <token>` on protected routes
6. **Tailwind v4**: Extend theme in `globals.css` `@theme{}`, not JS config
7. **Move dates**: Support `moveDateMode`: `exact`, `range`, `flexible` – use `buildMoveDateFields()` helper
