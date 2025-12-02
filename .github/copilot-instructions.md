# Copilot instructions for OM (Next.js + Firebase)

These notes make AI coding agents productive quickly in this repo. Stick to the project's patterns and file boundaries below.

## Overview

- **Stack**: Next.js 14 (Pages Router in `pages/`), TypeScript, Tailwind CSS, Framer Motion, Firebase (Auth, Firestore, Storage), Sonner toasts, Lucide icons.
- **Config**: ESM project (`"type": "module"` in package.json) — **all imports must use `.js` extensions in compiled code**; ESLint flat config (`eslint.config.js`), Prettier + Tailwind plugin for class sorting.
- **Global shell**: `pages/_app.tsx` wires `Navbar`, `Footer`, global `<Toaster />`, `ErrorBoundary`, and `FloatingCTA`. Content is offset via `pt-[80px]`.
- **Routing**: Uses Pages Router (`pages/**`). Some client components use `next/navigation`'s `useRouter`; keep this consistent unless migrating the app.
- **Layout**: Use `components/layout/Layout.tsx` (`LayoutWrapper`) to wrap sections/pages with the gradient background container.
- **Dev mode**: Port `:3001` (see `package.json` scripts). Imports `@/utils/devErrorSuppressor` to suppress common dev noise.

## Firebase integration

- **Initialize once** in `services/firebase.ts`; import from there only: `auth`, `db`, `storage`.
- **Env vars** are client-exposed (`NEXT_PUBLIC_*`). Copy `.env copy.example` to `.env` for local dev (includes Firebase config + EmailJS keys).
- **Profiles and roles** live in Firestore collections: `customers` and `companies`. A single auth user must not exist in both.
- **Firebase Admin** (`lib/firebaseAdmin.ts`): Uses service account env vars (`FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`). Gracefully falls back if missing. Check `adminReady` before privileged ops.
- **Next.js config** includes Firebase Storage domains in `remotePatterns`, SWC minification, and compression enabled.

**Helpers in `utils/firebaseHelpers.ts`:**

- `onAuthChange(cb)`, `logout()`, `isLogoutInProgress()` (prevents showing error toasts during intentional logout)
- **Role/profile**: `ensureUserProfile(user, role)` prevents dual-role accounts; throws `ROLE_CONFLICT` if an opposite-role doc exists. `getUserRole(user)` checks Firestore.
- **Auth**: `loginWithGoogle(role)`, `registerWithEmail(role, { email, password, displayName? })`, `loginWithEmail({ email, password })`, `resetPassword(email)`.
  - Note: `loginWithGoogle` gracefully handles popup-blocked errors by returning `null` instead of throwing.

## Firestore data model and helpers

**Requests collection**: `requests/{requestId}` with sequential codes (`REQ-141629`) and extensive fields:

- **Location**: `fromCounty`, `fromCity`, `fromAddress`, `fromType` (house|flat), `fromFloor`, `fromElevator`, `toCounty`, `toCity`, `toAddress`, `toType`, `toFloor`, `toElevator`
  - Address components: `fromStreet`, `fromNumber`, `fromBloc`, `fromStaircase`, `fromApartment` (and `to*` equivalents)
- **Move Date**: `moveDateMode` (exact|range|flexible), `moveDateStart`, `moveDateEnd`, `moveDateFlexDays`
- **Details**: `details`, `rooms`, `phone`, `contactFirstName`, `contactLastName`
- **Services**: `serviceMoving`, `servicePacking`, `serviceDisassembly`, `serviceCleanout`, `serviceStorage`
- **Survey**: `surveyType` (in-person|video|quick-estimate)
- **Media**: `mediaUpload` (now|later), `mediaUploadToken`, `mediaUrls[]`
- **Meta**: `customerId`, `customerName`, `customerEmail`, `createdAt`, `updatedAt`, `status` (active|closed|paused|cancelled), `archived` (bool), `requestCode`

**Offers subcollection**: `requests/{requestId}/offers/{offerId}` with `companyId`, `companyName`, `price`, `message`, `status` (`pending|accepted|declined|rejected`), `createdAt`, `requestId`, `requestCode` (denormalized for collectionGroup queries).

**Notifications subcollection**: `companies/{companyId}/notifications/{notificationId}` with `type`, `requestId`, `message`, `title`, `read`, `createdAt`.

**Upload tokens collection**: `uploadTokens/{token}` with `requestId`, `customerEmail`, `customerName`, `uploadLink`, `createdAt`, `expiresAt`, `used`, `uploadedAt`.

**Use `serverTimestamp()` for server times**. Avoid `undefined` fields — `createRequest()` and `updateRequest()` strip them.

**Helpers in `utils/firestoreHelpers.ts`:**

- `createRequest(data) -> requestId` (auto-generates `REQ-XXXXXX` codes via Firestore transaction on `meta/counters` doc)
- `updateRequest(requestId, data)` (updates request, auto-notifies companies that have submitted offers via notifications subcollection)
- `getCustomerRequests(customerId)` / `getAllRequests()`
- `addOffer(requestId, data)` / `getOffers(requestId)`
- `updateRequestStatus(requestId, status)` / `deleteRequest(requestId)` / `archiveRequest(requestId)` / `unarchiveRequest(requestId)`

## API routes and secure operations

**API Response Format** (Standardized in `types/api.ts`):

```typescript
// Success
{ success: true, data: T }
// Error
{ success: false, error: string, code?: string }
```

**Use helper functions**: `apiSuccess(data)`, `apiError(error, code?)` from `types/api.ts`.

**Secured Endpoints** (Require Firebase ID token in `Authorization: Bearer <token>` header):

- `/api/offers/accept` - Accept offer, decline all others in batch
- `/api/offers/decline` - Decline specific offer
- `/api/offers/message` - Send message in offer conversation
- `/api/markUploadTokenUsed` - Mark upload token as used
- `/api/notifyCompaniesOnUpload` - Notify companies after media upload

**Authentication pattern for API routes**:
```typescript
// Extract and verify Firebase ID token
const authHeader = req.headers.authorization || "";
const match = authHeader.match(/^Bearer (.+)$/);
if (!match) return res.status(401).json({ error: "Missing Authorization bearer token" });
const idToken = match[1];
const decoded = await adminAuth.verifyIdToken(idToken);
const uid = decoded.uid;
```

**Offer acceptance** (`pages/api/offers/accept.ts`):

- Requires Firebase ID token in `Authorization: Bearer <token>` header
- Validates ownership (request must belong to authenticated customer)
- **Uses batch writes** to accept selected offer and decline all others atomically
- Updates request status to `accepted`
- Sends personalized HTML email to company via Resend API (server-side)

**Email System** (Dual approach):

- **Client-side**: EmailJS for user-triggered emails (upload links) — uses `utils/emailHelpers.ts` wrapper
- **Server-side**: Resend API for transactional emails (offer accepted, notifications) — direct API calls in API routes
- Both require env vars; gracefully degrade if missing (log warning, continue)

**Media upload workflow** (Complete Enterprise System):

1. Customer chooses `mediaUpload: "later"` when creating request
2. Call `/api/generateUploadLink` (POST) with `requestId`, `customerEmail`, `customerName`
   - Generates 64-char hex token (`crypto.randomBytes(32)`)
   - Saves to `uploadTokens/{token}` collection with 7-day expiration
   - Updates request doc with `mediaUploadToken`
3. Client-side EmailJS sends email with link to `/upload/[token]`
4. Customer visits link → Server validates token via `/api/validateUploadToken`
5. Upload UI (`pages/upload/[token].tsx`) features:
   - Real Firebase Storage uploads with `uploadBytesResumable()`
   - Progress tracking (0-100%) per file with visual bars
   - Thumbnail previews for images (FileReader) and video (canvas extraction)
   - Multiple files supported (images + video)
6. On completion:
   - Updates `requests/{id}.mediaUrls[]` with Firebase Storage URLs
   - Marks token as `used: true` via `/api/markUploadTokenUsed`
   - **Notifies companies** via `/api/notifyCompaniesOnUpload` → writes to `companies/{id}/notifications` subcollection for all companies with pending offers
7. Reminder system: `/api/sendUploadReminders` checks tokens older than 3 days and unused

## Role-gated pages

- Wrap protected content in `components/auth/RequireRole.tsx` with `allowedRole="customer"|"company"`.
  - Redirects unauthenticated users to `/customer/auth` or `/company/auth` and shows a toast.
  - **Resolves user role with retries** (up to 5 attempts with 400ms delay) after OAuth (profile doc may be created async). If role mismatches, redirects accordingly.
  - Skips error toast during intentional logout (`isLogoutInProgress()`).

## Key UI patterns

- **Tailwind is primary**. Prettier + tailwind plugin sorts classes; don't fight the order.
- **Reusable motion variants** in `utils/animations.ts` (`fadeUp`, `staggerContainer`).
- **Customer dashboard** (`pages/customer/dashboard.tsx`):
  - Real-time requests for the logged-in user via `onSnapshot`.
  - Uses `components/customer/RequestForm.tsx` (controlled form), `MyRequestCard`, `RequestDetailsModal`, `EditRequestModal`, and `OfferComparison` to display offers.
  - Supports request archiving, status changes, and editing.
- **Company dashboard** (`pages/company/dashboard.tsx`):
  - Two tabs: "Ofertele mele" (own offers via `collectionGroup('offers')`) and "Cereri clienți" (all requests via `RequestsView`).
  - Real-time offers listener with status filter and search.
  - Inline edit/delete for offers (updates via `updateDoc`/`deleteDoc`).
- **Notification system** (`components/company/NotificationBell.tsx`):
  - Real-time listener on `companies/{companyId}/notifications` subcollection.
  - Displays unread count badge, dropdown with list, mark as read/all read actions.
- **Romanian localization**: Cities/counties from `cities.ts`/`counties.ts`, date formatting via `utils/date.ts` (`formatDateRO`, `formatMoveDateDisplay`).

## Validation and utilities

- **`utils/validation.ts`**: Romanian-specific validators (phone `07xxxxxxxx` or `+407xxxxxxxx`, CIF), date utilities, and a `validateField(value, rules)` runner. Prefer these in forms.
- **`utils/hooks.ts`**: `useDebouncedValue` for search/filter UIs.
- **`utils/animations.ts`**: Framer Motion variants for consistent animations.
- **`utils/date.ts`**: `formatDateRO`, `formatMoveDateDisplay` for Romanian date formatting.
- **`utils/devErrorSuppressor.ts`**: Suppresses common dev-only console noise (WebSocket errors, HMR warnings) in development mode.

## Conventions and gotchas

- **Import Firebase only from `services/firebase.ts`**.
- **Use helpers in `utils/*Helpers.ts`** instead of ad-hoc Firestore calls where possible.
- **Maintain single-role invariant** for users; handle `ROLE_CONFLICT` from auth flows.
- **Keep timestamps with `serverTimestamp()`** and map snapshots to plain objects in the UI.
- **Strip `undefined` fields** before Firestore writes — `createRequest()` and `updateRequest()` do this automatically.
- **Navigation** currently uses `next/navigation` inside client components, even under `pages/`. Keep consistent unless performing a broader migration.
- **Sequential request codes** are generated via Firestore transaction on `meta/counters` doc (see `generateRequestCode()` in `firestoreHelpers.ts`).
- **CollectionGroup queries** on offers: denormalize `requestId` and `requestCode` on offer docs to enable company-wide offer queries.
- **Batch operations** for offer acceptance/decline to ensure consistency and atomicity.
- **Token-based workflows**: Generate secure 64-char hex tokens (`crypto.randomBytes(32)`), store in Firestore with `expiresAt` (7 days), validate before use, mark `used: true` after consumption.
- **Graceful degradation**: API routes check `adminReady` before privileged ops; email systems log warnings if keys missing but don't throw.

## Developer workflows

- **Dev**: `npm run dev` (runs on port 3001)
- **Build**: `npm run build`; **Start**: `npm run start`
- **Lint**: `npm run lint` (max warnings: 0); **Format**: `npm run format`
- **Pre-commit**: Husky runs `lint-staged` hook that lints and formats staged files (config in `package.json` top-level).
- **ESLint**: Flat config (`eslint.config.js`) with Next.js, React, Tailwind rules, and Prettier integration.
- **Firebase Admin setup**: Requires service account env vars for API routes. Falls back gracefully if missing (see `lib/firebaseAdmin.ts`).
- **Deploy checklist**: See `DEPLOYMENT_CHECKLIST.md` for critical Firebase domain authorization, env vars, and CRON setup steps.

## Environment variables and deployment

**Required env vars** (see `.env copy.example`):

- **Client-side** (`NEXT_PUBLIC_*`): Firebase config (apiKey, authDomain, projectId, etc.), EmailJS credentials (serviceId, templateId, publicKey), app URL
- **Server-side** (secrets): Firebase Admin (projectId, clientEmail, privateKey as multiline string), Resend API key, CRON API key
- **Critical deployment steps**:
  1. Add deployed domain to Firebase Console → Authentication → Authorized domains (else `auth/unauthorized-domain` error)
  2. Set all env vars in Vercel/hosting provider
  3. Generate Firebase Admin service account JSON from Firebase Console → Project Settings → Service Accounts
  4. Configure Vercel CRON jobs for `/api/sendUploadReminders` with `x-api-key` header matching `CRON_API_KEY`

## Examples

- **Protect a new customer page**:
  ```tsx
  // pages/customer/settings.tsx
  <RequireRole allowedRole="customer">
    <LayoutWrapper>{/* content */}</LayoutWrapper>
  </RequireRole>
  ```
- **Create a request from a form submit**:
  ```tsx
  const requestId = await createRequest({ ...form, customerId: user.uid });
  ```
- **Romanian phone validation**: Use `validators.phone()` from `utils/validation.ts` for `07xxxxxxxx` or `+407xxxxxxxx` format.
- **Real-time offers for a company**:
  ```tsx
  const q = query(
    collectionGroup(db, "offers"),
    where("companyId", "==", company.uid),
    orderBy("createdAt", "desc")
  );
  onSnapshot(q, (snapshot) => {
    /* ... */
  });
  ```
- **Accept an offer** (secure):
  ```tsx
  const token = await user.getIdToken();
  await fetch("/api/offers/accept", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ requestId, offerId }),
  });
  ```

If you introduce new features, mirror existing patterns (helpers, role checks, Tailwind, toasts) and update this file with any new data contracts or workflows.
