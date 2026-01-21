# Copilot Instructions for OM (OferteMutare.ro)

> **Next.js 14 (Pages Router) + Firebase** moving quote platform connecting customers with moving companies in Romania.

## Quick Start

```bash
npm run dev      # http://localhost:3000
npm run build    # Run before deploy (catches type errors)
npm run lint     # Zero-warnings enforced via Husky pre-commit
```

## ⚠️ Critical Architecture Rules

### 1. Dual-Role System (NEVER violate)

Users are **exclusively** `customer` OR `company` – enforced at 3 layers:

- **Firestore rules**: `canCreateCustomer()` / `canCreateCompany()` block dual-role
- **App code**: `ensureUserProfile()` throws `ROLE_CONFLICT` error
- **UI guards**: `<RequireRole allowedRole="customer|company">` protects pages

Profile locations: `customers/{uid}` or `companies/{uid}` (never both)

### 2. Firebase Singleton Pattern

```typescript
// ✅ Client-side (components, pages)
import { auth, db, storage } from "@/services/firebase";

// ✅ Server-side (API routes ONLY)
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
if (!adminReady) return res.status(503).json(apiError("Admin not ready"));
```

**Never** instantiate Firebase twice or use Admin SDK in client code.

## API Routes Pattern

All protected endpoints in `pages/api/` use this structure:

```typescript
import { withAuth } from "@/lib/apiAuth";
import { apiSuccess, apiError } from "@/types/api";

// ✅ Preferred: Wrapper automatically handles auth
export default withAuth(async (req, res, uid) => {
  // Always verify ownership for sensitive operations
  if (data.customerId !== uid) return res.status(403).json(apiError("Forbidden"));
  return res.status(200).json(apiSuccess({ result }));
});
```

Key API endpoints:

- `pages/api/offers/` – accept, decline, message
- `pages/api/requests/` – createGuest, linkToAccount
- `pages/api/generateUploadLink.ts` – token-based media upload

## Data Model & Flow

**Core flow**: Customer creates request → Companies view & submit offers → Customer accepts one → Others auto-declined

| Collection                      | Key Fields                            | Notes                        |
| ------------------------------- | ------------------------------------- | ---------------------------- |
| `requests/{id}`                 | `customerId`, `requestCode`, `status` | Main document                |
| `requests/{id}/offers/{id}`     | `companyId`, `price`, `requestId`     | ⚠️ Denormalize `requestCode` |
| `companies/{id}/notifications/` | `type`, `requestId`, `read`           | Real-time via Firestore      |

**Statuses**: Requests: `active`/`closed`/`paused`/`cancelled` · Offers: `pending`/`accepted`/`declined`

## Helper Functions (Use These!)

```typescript
// ✅ Always use helpers over raw Firestore SDK
import { createRequest, addOffer, updateRequest, archiveRequest } from "@/utils/firestoreHelpers";
import { ensureUserProfile, getUserRole, onAuthChange } from "@/utils/firebaseHelpers";
```

- `createRequest()` auto-generates sequential `REQ-XXXXXX` via Firestore transaction on `meta/counters.requestSeq`
- `ensureUserProfile()` handles profile creation with role conflict detection

## Project Conventions

| Rule                    | Implementation                                                   |
| ----------------------- | ---------------------------------------------------------------- |
| **No hard deletes**     | Use `archived: true` or status field changes                     |
| **Timestamps**          | Always `serverTimestamp()` – never `new Date()`                  |
| **Toast notifications** | Use `sonner`: `toast.success()`, `toast.error()` (Romanian text) |
| **Phone validation**    | Romanian format `07xxxxxxxx` – see `utils/validation.ts`         |
| **Denormalization**     | Always include `requestId`/`requestCode` in subcollections       |

## Styling (Tailwind v4)

Configuration in `globals.css` with `@theme{}` block. Use predefined classes:

```css
.card         /* Rounded glass-effect with hover shadow */
.btn-primary  /* Emerald→Sky gradient button */
.btn-outline  /* Emerald outlined button */
```

Brand colors: `emerald-500` (#10b981), `sky-500` (#0ea5e9), `dark` (#064e3b)

## Integrations

| Service     | Location                     | Notes                           |
| ----------- | ---------------------------- | ------------------------------- |
| **EmailJS** | `utils/emailHelpers.ts`      | Client-side transactional email |
| **Resend**  | `pages/api/offers/accept.ts` | Server-side email               |
| **GA4**     | `utils/analytics.ts`         | `trackSignUp()`, `trackLogin()` |

## Media Upload Flow

Token-based deferred upload system:

```
generateUploadLink.ts → creates token in Firestore
       ↓
pages/upload/[token].tsx → public upload page
       ↓
validateUploadToken.ts / markUploadTokenUsed.ts → lifecycle
       ↓
notifyCompaniesOnUpload.ts → alerts companies
```

## Key File Reference

| Purpose         | Path                                                 |
| --------------- | ---------------------------------------------------- |
| Client Firebase | `services/firebase.ts`                               |
| Admin Firebase  | `lib/firebaseAdmin.ts`                               |
| API Auth        | `lib/apiAuth.ts`                                     |
| Firestore CRUD  | `utils/firestoreHelpers.ts`                          |
| Auth Helpers    | `utils/firebaseHelpers.ts`                           |
| Types           | `types/index.ts`, `types/api.ts`                     |
| Security Rules  | `firebase.firestore.rules`, `firebase.storage.rules` |
| Page Guards     | `components/auth/RequireRole.tsx`                    |

## Types Quick Reference

```typescript
type UserRole = "customer" | "company";
type MovingRequest = { id, customerId, requestCode, status, fromCity, toCity, moveDate, ... };
type Offer = { id, requestId, companyId, price, message, status };
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```
