# Copilot Instructions for OM (OferteMutare.ro)

> Next.js 14 + Firebase + Tailwind v4 platform connecting Romanian customers with moving companies.

## Quick Start

```bash
npm run dev        # Port 3000
npm run build      # Production build
npm run lint       # ESLint (0 warnings max)
```

## Architecture Overview

**Stack**: Next.js 14 Pages Router, TypeScript, Tailwind v4 (CSS-first in `globals.css`), Firebase (Auth/Firestore/Storage), Framer Motion, Sonner toasts.

**Dual-role system**: Users are either `customer` or `company` — never both. Profiles stored in `customers/{uid}` or `companies/{uid}`. Auth helper `ensureUserProfile()` enforces this, throwing `ROLE_CONFLICT` if violated.

**Key data flow**: Customer creates request → Companies view and submit offers → Customer accepts one offer (batch declines others) → Email notifications sent.

## Critical Patterns

### Firebase Imports

```tsx
// ALWAYS import from services/firebase.ts — never initialize elsewhere
import { auth, db, storage } from "@/services/firebase";
```

### Role-Protected Pages

```tsx
// Wrap with RequireRole — handles auth redirects + role verification with retries
<RequireRole allowedRole="customer">
  <LayoutWrapper>{/* content */}</LayoutWrapper>
</RequireRole>
```

### Firestore Helpers (use these, not raw calls)

```tsx
import { createRequest, updateRequest, addOffer } from "@/utils/firestoreHelpers";

// Auto-generates REQ-XXXXXX codes via transaction on meta/counters
const requestId = await createRequest({ ...form, customerId: user.uid });
```

### Authenticated API Calls

```tsx
// All secured endpoints require Firebase ID token
const token = await user.getIdToken();
await fetch("/api/offers/accept", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ requestId, offerId }),
});
```

### API Response Format (types/api.ts)

```tsx
import { apiSuccess, apiError } from "@/types/api";
return res.status(200).json(apiSuccess({ id: "123" }));
return res.status(400).json(apiError("Invalid input", "BAD_REQUEST"));
```

## Data Model

**requests/{id}**: `customerId`, `requestCode` (REQ-XXXXXX), `fromCity/toCity`, `fromCounty/toCounty`, address components (`fromStreet`, `fromNumber`, `fromBloc`...), `moveDateMode` (exact|range|flexible), `status` (active|accepted|closed), `mediaUrls[]`, timestamps.

**requests/{id}/offers/{id}**: `companyId`, `price`, `message`, `status` (pending|accepted|declined). Denormalize `requestId`/`requestCode` for collectionGroup queries.

**companies/{id}/notifications/{id}**: Real-time notifications for companies (new requests, media uploads).

**uploadTokens/{token}**: Token-based media upload links with 7-day expiration.

## Conventions

- **Tailwind v4**: Config in `globals.css` via `@theme{}`. Use `.card`, `.btn-primary` utility classes.
- **Timestamps**: Always use `serverTimestamp()` for Firestore.
- **Undefined fields**: Helpers strip these automatically before writes.
- **Romanian localization**: Use `cities.ts`/`counties.ts` for locations, `utils/date.ts` for formatting.
- **Validation**: Use `utils/validation.ts` for Romanian phone (`07xxxxxxxx`) and CIF validation.
- **Animations**: Import variants from `utils/animations.ts` (`fadeUp`, `staggerContainer`).

## Environment Setup

Copy `.env copy.example` → `.env`. Required vars:

- `NEXT_PUBLIC_FIREBASE_*` — Firebase client config
- `FIREBASE_ADMIN_*` — Service account for API routes (check `adminReady` before privileged ops)
- `NEXT_PUBLIC_EMAILJS_*` — Client-side emails
- `RESEND_API_KEY` — Server-side transactional emails

## File Locations

| Concern              | Location                                                      |
| -------------------- | ------------------------------------------------------------- |
| Firebase client init | `services/firebase.ts`                                        |
| Firebase Admin       | `lib/firebaseAdmin.ts`                                        |
| Auth helpers         | `utils/firebaseHelpers.ts`                                    |
| Firestore CRUD       | `utils/firestoreHelpers.ts`                                   |
| Types                | `types/index.ts`, `types/api.ts`                              |
| Role guard           | `components/auth/RequireRole.tsx`                             |
| API routes           | `pages/api/**`                                                |
| Dashboards           | `pages/customer/dashboard.tsx`, `pages/company/dashboard.tsx` |
