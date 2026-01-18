# Copilot Instructions for OM (OferteMutare.ro)

Next.js 14 Pages Router + Firebase + Tailwind v4 platform for connecting Romanian customers with moving companies.

## Quick Start

- Dev: `npm run dev` (local port 3001)
- Build: `npm run build` (before deploy)
- Lint: `npm run lint` (zero-warnings policy via Husky/lint-staged)

## Architecture & Roles

- Dual-role: users are either customer or company; profiles live in `customers/{uid}` or `companies/{uid}`. Enforced by `ensureUserProfile()` and security rules (`canCreateCustomer()` / `canCreateCompany()`).
- Firebase init: client SDK in `services/firebase.ts` (singleton via `getApps()`); Admin SDK in `lib/firebaseAdmin.ts` (check `adminReady` before privileged ops).

## Request Flow

- `createRequest()` auto-generates sequential `REQ-XXXXXX` via transaction on `meta/counters.requestSeq` (~starts at 141000).
- Companies submit offers under `requests/{id}/offers/{offerId}`; denormalize `requestId` and `requestCode` on the offer.
- Customer accepts one offer via `pages/api/offers/accept.ts`; batch declines others; sends notifications.

## Auth & API

- Use `withAuth()` in API routes from `lib/apiAuth.ts` (verifies Firebase ID token and yields `uid`). Alternative: `verifyAuth()` + `sendAuthError()`.
- Client calls to secured endpoints must include `Authorization: Bearer <ID token>`.
- Standard responses: `apiSuccess()` / `apiError()` from `types/api.ts` with `ErrorCodes`.

## Patterns & Conventions

- Always use singletons: `auth`, `db`, `storage` from `services/firebase.ts`; `adminDb`, `adminAuth` from `lib/firebaseAdmin.ts`.
- Role-guard pages with `components/auth/RequireRole.tsx` (retries for async profile).
- Timestamps: use `serverTimestamp()` for writes; undefined fields are stripped in `utils/firestoreHelpers.ts`.
- No hard deletes: prefer `archived: true` or `status: 'closed'`.
- Tailwind v4: config in `globals.css` via `@theme{}`; use shared utilities (e.g., `.card`, `.btn-primary`, `.btn-outline`).
- Localization/validation: `cities.ts`, `counties.ts`, `utils/date.ts`, `utils/validation.ts` (Romanian phone `07xxxxxxxx`, CIF).
- UI feedback: `sonner` toasts; animations from `utils/animations.ts`.

## Media Uploads

- Token-based flow: `pages/api/generateUploadLink.ts`, `validateUploadToken.ts`, `markUploadTokenUsed.ts`, `notifyCompaniesOnUpload.ts` with public page `pages/upload/[token].tsx`.
- Reminders: `pages/api/sendUploadReminders.ts` (cron-safe, key-protected if configured).

## Data Model (core)

- `requests/{id}`: `customerId`, `requestCode`, `fromCity/toCity`, `moveDateMode`, `status`, `archived`.
- `requests/{id}/offers/{id}`: `companyId`, `price`, `status`, denormalized `requestId`/`requestCode`.
- `companies/{id}/notifications/{id}`; `companies/{id}/payments/{requestId}`.
- `meta/counters`: `requestSeq` for sequential codes.

## Environment

- Copy `.env copy.example` → `.env`.
- Required: `NEXT_PUBLIC_FIREBASE_*` (client), `FIREBASE_ADMIN_*` (Admin SDK, check `adminReady`), `NEXT_PUBLIC_EMAILJS_*` (EmailJS), optional `RESEND_API_KEY`, `CRON_API_KEY`.

## Key Files

- Client: `services/firebase.ts`; Admin: `lib/firebaseAdmin.ts`; Auth: `lib/apiAuth.ts`.
- Firestore helpers: `utils/firestoreHelpers.ts`; Auth helpers: `utils/firebaseHelpers.ts`.
- Rules: `firebase.firestore.rules`, `firebase.storage.rules`; Styling: `globals.css`.
- API: `pages/api/**` (offers: `accept/decline/message`, uploads).

Tips for Agents

- Prefer helpers (e.g., `createRequest`, `updateRequest`) over raw Firestore calls.
- Check `adminReady` before using Admin SDK; guard routes with `withAuth`.
- Follow denormalization and no-deletes conventions to avoid breaking dashboards and rules.
