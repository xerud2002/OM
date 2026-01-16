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

**Request flow**: Customer creates request → `generateRequestCode()` assigns REQ-XXXXXX via transaction → Companies pay for access, submit offers → Customer accepts one (batch declines others via `pages/api/offers/accept.ts`) → Notifications sent.

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

// Client-side calls require Bearer token
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

- **Timestamps**: Always `serverTimestamp()` for `createdAt`/`updatedAt`
- **No hard deletes**: Use `archived: true` or `status: 'closed'`
- **Tailwind v4**: Config in `globals.css` via `@theme{}`. Use `.card`, `.btn-primary`, `.btn-outline`
- **Romanian data**: `cities.ts`/`counties.ts` for locations, `utils/validation.ts` for phone/CIF
- **Animations**: `utils/animations.ts` (`fadeUp`, `staggerContainer`)
- **Toasts**: `sonner` — `toast.success()`, `toast.error()`
- **Address formatting**: Use `buildAddressString()`, `buildMoveDateFields()` from `firestoreHelpers.ts`

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

## Environment

Required in `.env`:
- `NEXT_PUBLIC_FIREBASE_*` — Client config
- `FIREBASE_ADMIN_*` — Service account (check `adminReady` before admin ops)
- `NEXT_PUBLIC_EMAILJS_*` — Client emails via `utils/emailHelpers.ts`
- `RESEND_API_KEY` — Server transactional emails
