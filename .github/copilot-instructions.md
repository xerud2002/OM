# Copilot Instructions for OM (OferteMutare.ro)

> **Next.js 14 (Pages Router) + Firebase** moving quote platform connecting customers with moving companies in Romania.

## Quick Start

```bash
npm run dev      # http://localhost:3000 (default port 3000, not 3001)
npm run build    # Run before deploy (catches type errors)
npm run lint     # Zero-warnings enforced via Husky pre-commit (--max-warnings=0)
npm run format   # Prettier formatting (auto-runs in pre-commit)
npm run prepare  # Install Husky git hooks (runs automatically after npm install)
```

**Environment**: Node.js 18+, TypeScript 5.9+, Next.js 14.2+, Firebase 12.8+

**Deployment**: Self-hosted on VPS (80.96.6.93) using PM2 cluster mode with Nginx reverse proxy. See `VPS_README.md` for deployment instructions. Auto-deploy script: `./auto-deploy-vps.sh`

## ⚠️ Critical Architecture Rules

### 1. Dual-Role System (NEVER violate)

Users are **exclusively** `customer` OR `company` – enforced at 3 layers:

- **Firestore rules**: `canCreateCustomer()` / `canCreateCompany()` check opposite role doesn't exist
- **App code**: `ensureUserProfile()` throws `ROLE_CONFLICT` error if opposite role doc found
- **UI guards**: `<RequireRole allowedRole="customer|company">` protects pages with auth checks

Profile locations: `customers/{uid}` or `companies/{uid}` (never both)

**Why this matters**: The entire business model depends on separate Customer/Company experiences. Dual-role detection prevents data corruption and ensures proper access control in Firestore rules that use `isCustomer()` and `isCompany()` helper functions.

### 2. Firebase Singleton Pattern (Client vs. Server)

```typescript
// ✅ Client-side (components, pages)
import { auth, db, storage } from "@/services/firebase";

// ✅ Server-side (API routes ONLY)
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
if (!adminReady) return res.status(503).json(apiError("Admin not ready"));
```

**Never** instantiate Firebase twice or use Admin SDK in client code.

**Why this matters**: Admin SDK bypasses Firestore security rules and requires service account credentials. Mixing client/server SDKs causes initialization conflicts and security vulnerabilities. Always check `adminReady` in production as missing env vars fail gracefully.

## API Routes Pattern

All protected endpoints in `pages/api/` follow one of two patterns:

### Pattern 1: Manual Auth (Most API routes)

```typescript
import { verifyAuth, sendAuthError } from "@/lib/apiAuth";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { apiSuccess, apiError } from "@/types/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json(apiError("Method Not Allowed"));
  }

  // ✅ Step 1: Verify Firebase ID token
  const authResult = await verifyAuth(req);
  if (!authResult.success) return sendAuthError(res, authResult);
  const uid = authResult.uid;

  // ✅ Step 2: Validate ownership before mutations
  const requestRef = adminDb.doc(`requests/${requestId}`);
  const requestSnap = await requestRef.get();
  if (requestSnap.data().customerId !== uid) {
    return res.status(403).json(apiError("Forbidden"));
  }

  // ✅ Step 3: Return structured response
  return res.status(200).json(apiSuccess({ result }));
}
```

### Pattern 2: Public/Cron Routes

```typescript
// For cron jobs (sendUploadReminders.ts) - protect with CRON_API_KEY header
const apiKey = req.headers["x-api-key"];
if (process.env.NODE_ENV === "production" && process.env.CRON_API_KEY) {
  if (apiKey !== process.env.CRON_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// For public endpoints (validateUploadToken.ts, generateUploadLink.ts) - no auth required
```

Key API endpoints:

- `pages/api/offers/{accept,decline,message}.ts` – offer lifecycle (requires auth, validates customer ownership)
- `pages/api/requests/{createGuest,linkToAccount}.ts` – request creation (guest=no auth, link=auth)
- `pages/api/generateUploadLink.ts` – creates token (no auth, tied to requestId)
- `pages/api/sendUploadReminders.ts` – cron job (requires `x-api-key` header = `CRON_API_KEY` env var)

**Important**: Manual auth pattern (`verifyAuth()` + `sendAuthError()`) is preferred over `withAuth()` wrapper. All routes use Admin SDK (`adminDb`, `adminAuth`) – never client SDK.

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
- `buildAddressString()` and `buildMoveDateFields()` – internal helpers in `firestoreHelpers.ts` for consistent data formatting
- `prepareRequestData()` – removes undefined/non-serializable fields (e.g., File objects) before Firestore writes

**Why helpers matter**: They encapsulate business logic (sequential codes, denormalization, validation) and prevent common mistakes like forgetting to set `requestCode` in offers subcollections or using client-side timestamps.

## Project Conventions

| Rule                    | Implementation                                                   |
| ----------------------- | ---------------------------------------------------------------- |
| **No hard deletes**     | Use `archived: true` or status field changes                     |
| **Timestamps**          | Always `serverTimestamp()` – never `new Date()`                  |
| **Toast notifications** | Use `sonner`: `toast.success()`, `toast.error()` (Romanian text) |
| **Phone validation**    | Romanian format `07xxxxxxxx` – see `utils/validation.ts`         |
| **Denormalization**     | Always include `requestId`/`requestCode` in subcollections       |
| **Method restrictions** | API routes: Check `req.method` and set `Allow` header on 405     |
| **Error responses**     | Use `apiError(message, code?)` from `types/api.ts`               |
| **Success responses**   | Use `apiSuccess(data)` from `types/api.ts`                       |

## Page Structure & Performance

- **Pages Router**: All routes in `pages/` (not App Router)
- **Dynamic imports**: Use `next/dynamic` for below-the-fold components (see `pages/index.tsx`, `_app.tsx`)
- **Loading skeletons**: Provide `loading` prop with placeholder `<div>` matching min-height
- **SSR control**: Set `ssr: false` for client-only components (TrustSignals, UrgencyBanner)
- **Mobile-first**: Separate mobile components when needed (e.g., `MobileHero` vs `Hero`)
- **Layout components**: Navbar, Footer, CityLinksSection are lazy-loaded in `_app.tsx` with SSR enabled
- **Performance monitoring**: Uses `utils/interactionLoader.ts` for deferred loading (GA4, WhatsApp widget)
- **Error handling**: Global `ErrorBoundary` wrapper in `_app.tsx` catches React errors

Example dynamic import pattern:

```typescript
const Steps = dynamic(() => import("@/components/home/Steps"), {
  loading: () => <div className="min-h-150" />,
  ssr: true,
});
```

**Critical**: Dev environment has error suppressor (`utils/devErrorSuppressor.ts`) to reduce console noise. Remove for production debugging.

## Styling (Tailwind v4)

Configuration in `globals.css` with `@theme{}` block. Use predefined classes:

```css
.card         /* Rounded glass-effect with hover shadow */
.btn-primary  /* Emerald→Sky gradient button */
.btn-outline  /* Emerald outlined button */
```

Brand colors: `emerald-500` (#10b981), `sky-500` (#0ea5e9), `dark` (#064e3b)

Global styles:

- Body has fixed gradient background (`linear-gradient(to bottom right, #ecfdf5, #ffffff, #f0f9ff)`)
  - **Mobile optimization**: `background-attachment: scroll` on screens <768px (prevents background rendering issues on iOS)
- Inputs/select/textarea have consistent rounded-lg borders with emerald focus rings
- Custom select dropdown with emerald SVG arrow icon (data URL in CSS)
- Calendar (`.rdp`) uses `--rdp-accent-color: var(--color-emerald)`
- Self-hosted Inter font via `next/font/google` with CSS variable `--font-inter`

**Important**: Tailwind v4 uses CSS-first config – add new theme values in `@theme{}` block, not JS config. Source paths defined in `@source` directives.

## Environment Variables

Required in `.env.local` (never commit):

```bash
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-side only)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}  # JSON string
FIREBASE_ADMIN_PROJECT_ID=

# Optional features
NEXT_PUBLIC_FACEBOOK_AUTH_ENABLED=false  # Enable Facebook OAuth
CRON_API_KEY=  # For sendUploadReminders.ts (production only)

# EmailJS (client-side emails)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=  # Google Analytics 4
```

**Critical**: `FIREBASE_SERVICE_ACCOUNT_KEY` must be a **stringified JSON** object. Admin SDK checks `adminReady` flag before operations. See `CREDENTIALE_NECESARE.md` for setup details.

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

**Flow details**:

1. Customer submits request without media → `generateUploadLink.ts` creates `uploadTokens/{token}` doc with 7-day expiration
2. Public upload page (`/upload/[token]`) validates token via `validateUploadToken.ts` before showing upload UI
3. After successful upload, `markUploadTokenUsed.ts` sets `used: true` and `uploadedAt` timestamp
4. `notifyCompaniesOnUpload.ts` creates notifications in `companies/{id}/notifications/` collection
5. Emails sent via EmailJS (client-side) using templates in `utils/emailHelpers.ts`

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

type AuthResult = { success: true; uid: string } | { success: false; error: string; status: number; code: string };

```

**Types location**: `types/index.ts` (domain models), `types/api.ts` (API responses + error codes)

## Common Pitfalls & Solutions

1. **Firebase initialization errors**: Always check `adminReady` before using Admin SDK in API routes
2. **Role conflicts**: Never create both customer and company profiles for same user – helpers enforce this
3. **Timestamp serialization**: Use `serverTimestamp()` – `new Date()` causes serialization errors in Firestore
4. **Missing requestCode in offers**: Always denormalize from parent request when creating offers
5. **401 errors in API routes**: Ensure `Authorization: Bearer <token>` header is set on all authenticated requests
6. **Romanian phone validation**: Must match `07xxxxxxxx` format – see `utils/validation.ts`
7. **Dynamic imports without loading**: Always provide loading skeleton to prevent layout shift
8. **CSS conflicts**: Tailwind v4 requires `@source` directives – don't modify `tailwind.config.js`typescript
type UserRole = "customer" | "company";
type MovingRequest = { id, customerId, requestCode, status, fromCity, toCity, moveDate, ... };
type Offer = { id, requestId, companyId, price, message, status };
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```
