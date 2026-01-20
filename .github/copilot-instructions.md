# Copilot Instructions for OM (OferteMutare.ro)

Concise, actionable guidance for AI coding agents working on this Next.js + Firebase app.

## Quick Start

- Dev: `npm run dev` (http://localhost:3000)
- Build: `npm run build` (run before deploy)
- Lint: `npm run lint` (zero warnings enforced via Husky)

## Architecture & Data Flow

- Dual-role users: either `customer` or `company` (never both).
- Profiles: `customers/{uid}` or `companies/{uid}`; created by `ensureUserProfile()` and enforced by rules.
- Client SDK singleton: import `auth`, `db`, `storage` from `services/firebase.ts` (do not re-init).
- Admin SDK: import `adminDb`, `adminAuth`, `adminReady` from `lib/firebaseAdmin.ts`; check `adminReady` before use.
- Requests: `utils/firestoreHelpers.ts` handles `createRequest()` (sequential `REQ-XXXXXX` codes), address fields, timestamps.
- Offers: subcollection `requests/{id}/offers/{id}`; always denormalize `requestId` and `requestCode`.
- Accept flow: `pages/api/offers/accept.ts` sets accepted/declined in batch and updates request status; optionally emails via Resend.

## API Routes (Protected)

- Use `verifyAuth()` + `sendAuthError()` from `lib/apiAuth.ts`.
- Prefer wrapper `withAuth(async (req, res, uid) => { ... })`.
- Always validate ownership: customer-only actions require `request.customerId === uid`; company actions require `offer.companyId === uid`.

## Firestore Conventions

- No hard deletes: prefer `archived: true` or `status` changes; use `updateRequestStatus()`, `archiveRequest()`.
- Timestamps: always `serverTimestamp()`; avoid client-side dates in writes.
- Denormalize keys in subcollections for collectionGroup queries.
- Notifications: when `updateRequest()` runs, create company notifications under `companies/{id}/notifications/{id}`.

## Styling & UI

- Tailwind v4 via `globals.css` `@theme{}`; shared classes like `.card`, `.btn-primary`, `.btn-outline`.
- Toasts with `sonner`: `toast.success()`, `toast.error()`.
- Wrap protected pages with `components/auth/RequireRole.tsx`.

## Integrations & Env Vars

- Email: `utils/emailHelpers.ts` uses EmailJS (`NEXT_PUBLIC_EMAILJS_*`).
- Offer acceptance email: Resend (`RESEND_API_KEY`, `NOTIFY_FROM_EMAIL`) in `pages/api/offers/accept.ts`.
- Analytics: GA4 helpers in `utils/analytics.ts` (`setUserId`, `trackRequestCreated`, etc.).

## Key Files

- Client Firebase: `services/firebase.ts`
- Admin Firebase: `lib/firebaseAdmin.ts`
- API auth: `lib/apiAuth.ts`
- Firestore helpers: `utils/firestoreHelpers.ts`
- Auth/profile helpers: `utils/firebaseHelpers.ts`
- Security rules: `firebase.firestore.rules`, `firebase.storage.rules`

## Agent Guidelines

- Prefer helpers over raw SDK (`createRequest()`, `addOffer()`, `ensureUserProfile()`).
- Check `adminReady` in API routes; fail gracefully when not configured.
- Validate ownership before sensitive operations; use auth wrapper when possible.
- Maintain denormalization in subcollections; avoid breaking analytics hooks.
- Avoid hard deletes; archive or update status instead.
