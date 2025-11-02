# Copilot instructions for OM (Next.js + Firebase)

These notes make AI coding agents productive quickly in this repo. Stick to the project's patterns and file boundaries below.

## Overview

- Stack: Next.js 14 (Pages Router in `pages/`), TypeScript, Tailwind CSS, Framer Motion, Firebase (Auth, Firestore, Storage), Sonner toasts, Lucide icons.
- Config: ESM project (`"type": "module"` in package.json), ESLint flat config, Prettier + Tailwind plugin for class sorting.
- Global shell: `pages/_app.tsx` wires `Navbar`, `Footer`, global `<Toaster />`, `ErrorBoundary`, and feature-flagged components (`UrgencyBanner`, `LiveActivityPopup`). Content is offset via `pt-[80px]`.
- Routing: Uses Pages Router (`pages/**`). Some client components use `next/navigation`'s `useRouter`; keep this consistent unless migrating the app.
- Layout: Use `components/layout/Layout.tsx` (`LayoutWrapper`) to wrap sections/pages with the gradient background container.

## Firebase integration

- Initialize once in `services/firebase.ts`; import from there only: `auth`, `db`, `storage`.
- Env vars are client-exposed (`NEXT_PUBLIC_*`). Copy `.env copy.example` to `.env` for local dev (includes Firebase config + EmailJS keys).
- Profiles and roles live in Firestore collections: `customers` and `companies`. A single auth user must not exist in both.
- Next.js config includes Firebase Storage domains in `remotePatterns`, SWC minification, and compression enabled.

Helpers in `utils/firebaseHelpers.ts`:

- `onAuthChange(cb)`, `logout()`.
- Role/profile: `ensureUserProfile(user, role)` prevents dual-role accounts; throws `ROLE_CONFLICT` if an opposite-role doc exists. `getUserRole(user)` checks Firestore.
- Auth: `loginWithGoogle(role)`, `registerWithEmail(role, { email, password, displayName? })`, `loginWithEmail({ email, password })`, `resetPassword(email)`.

## Firestore data model and helpers

- Requests collection: `requests/{requestId}` with sequential codes (`REQ-141629`) and extensive fields:
  - Location: `fromCounty`, `fromCity`, `fromAddress`, `fromType` (house|flat), `fromFloor`, `fromElevator`, `toCounty`, `toCity`, `toAddress`, `toType`, `toFloor`, `toElevator`
  - Details: `moveDate`, `details`, `rooms`, `phone`, `contactFirstName`, `contactLastName`
  - Services: `serviceMoving`, `servicePacking`, `serviceDisassembly`, `serviceCleanout`, `serviceStorage`
  - Survey: `surveyType` (in-person|video|quick-estimate)
  - Media: `mediaUpload` (now|later), `mediaUploadToken`, `mediaUrls[]`
  - Meta: `customerId`, `customerName`, `customerEmail`, `createdAt`, `status`
- Offers subcollection: `requests/{requestId}/offers/{offerId}` with `companyId`, `companyName`, `price`, `message`, `status` (`pending|accepted|declined|rejected`), `createdAt`.
- Use `serverTimestamp()` for server times. Avoid `undefined` fields — `createRequest()` strips them.

Helpers in `utils/firestoreHelpers.ts`:

- `createRequest(data) -> requestId` (auto-generates `REQ-XXXXXX` codes via Firestore transaction)
- `getCustomerRequests(customerId)` / `getAllRequests()`
- `addOffer(requestId, data)` / `getOffers(requestId)`
- `acceptOffer(requestId, offerId)` marks chosen as `accepted` and others `declined` in a batch

## Media upload workflow (Complete Enterprise System)

- When customer chooses `mediaUpload: "later"`:
  1. Request created in Firestore
  2. Call `/api/generateUploadLink` (POST) with `requestId`, `customerEmail`, `customerName`
     - Generates 64-char hex token (`crypto.randomBytes(32)`)
     - Saves to `uploadTokens/{token}` collection with expiration (7 days)
     - Updates request doc with `mediaUploadToken`
  3. Client-side EmailJS sends email with link to `/upload/[token]`
  4. Customer visits link → Server validates token via `/api/validateUploadToken`
  5. Upload UI features:
     - **Real Firebase Storage uploads** with `uploadBytesResumable()`
     - **Progress tracking** (0-100%) per file with visual bars
     - **Thumbnail previews** for images (FileReader) and video (canvas extraction)
     - **Multiple files** supported (images + video)
  6. On completion:
     - Updates `requests/{id}.mediaUrls[]` with Firebase Storage URLs
     - Marks token as `used: true` in Firestore
     - **Notifies companies** via `companies/{id}/notifications` subcollection
- Reminder system: `/api/sendUploadReminders` checks tokens older than 3 days and unused
- See `MEDIA_UPLOAD_SYSTEM.md` for complete documentation

## Role-gated pages

- Wrap protected content in `components/auth/RequireRole.tsx` with `allowedRole="customer"|"company"`.
  - Redirects unauthenticated users to `/customer/auth` or `/company/auth` and shows a toast.
  - Resolves user role with retries after OAuth (profile doc may be created async). If role mismatches, redirects accordingly.

## Key UI patterns

- Tailwind is primary. Prettier + tailwind plugin sorts classes; don't fight the order.
- Reusable motion variants in `utils/animations.ts` (`fadeUp`, `staggerContainer`).
- Customer dashboard (`pages/customer/dashboard.tsx`):
  - Real-time requests for the logged-in user via `onSnapshot`.
  - Uses `components/customer/RequestForm.tsx` (controlled form) and `RequestCard`/`OfferItem` to display offers.
- Company views (`pages/company/requests.tsx`, `pages/company/dashboard.tsx`):
  - Read all `requests`, post offers (`addOffer`), and observe own offers via `collectionGroup('offers')`.
- Romanian localization: Cities/counties from `cities.ts`/`counties.ts`, date formatting via `utils/date.ts` (`formatDateRO`).

## Validation and utilities

- `utils/validation.ts` provides Romanian-specific validators (phone/CIF), date utilities, and a `validateField(value, rules)` runner. Prefer these in forms.
- `utils/hooks.ts` has `useDebouncedValue` for search/filter UIs.

## Conventions and gotchas

- Import Firebase only from `services/firebase.ts`.
- Use helpers in `utils/*Helpers.ts` instead of ad-hoc Firestore calls where possible.
- Maintain single-role invariant for users; handle `ROLE_CONFLICT` from auth flows.
- Keep timestamps with `serverTimestamp()` and map snapshots to plain objects in the UI.
- Navigation currently uses `next/navigation` inside client components, even under `pages/`. Keep consistent unless performing a broader migration.

## Developer workflows

- Dev: `npm run dev`
- Build: `npm run build`; Start: `npm run start`
- Lint: `npm run lint`; Format: `npm run format`
- Husky runs a pre-commit hook that calls `lint-staged`. If adjusting lint-staged rules, ensure its config is at the package.json top-level.
- Uses ESLint flat config (`eslint.config.js`) with Next.js, React, Tailwind rules, and Prettier integration.

## Examples

- Protect a new customer page:
  - `pages/customer/settings.tsx` -> wrap with `<RequireRole allowedRole="customer">` and use `LayoutWrapper`.
- Create a request from a form submit:
  - `await createRequest({ ...form, customerId: user.uid })` then reset state; see `pages/customer/dashboard.tsx`.
- Romanian phone validation: Use `validators.phone()` from `utils/validation.ts` for `07xxxxxxxx` or `+407xxxxxxxx` format.

If you introduce new features, mirror existing patterns (helpers, role checks, Tailwind, toasts) and update this file with any new data contracts or workflows.
