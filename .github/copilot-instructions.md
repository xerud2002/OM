# Copilot Instructions for OM (OferteMutare.ro)

> Actionable guidance for AI agents on this **Next.js 14 + Firebase** moving quote platform.

---

## 🚀 Quick Start

```bash
npm run dev      # http://localhost:3000
npm run build    # Run before deploy
npm run lint     # Zero-warnings (Husky enforced)
```

---

## 🏗️ Core Architecture

### ⚠️ Dual-Role System (CRITICAL)

Users are **exclusively** `customer` OR `company` – never both. Enforced at 3 levels:

| Layer         | Enforcement                                                  |
| ------------- | ------------------------------------------------------------ | ----------------------- |
| **Firestore** | `canCreateCustomer()` / `canCreateCompany()` block dual-role |
| **App**       | `ensureUserProfile()` throws `ROLE_CONFLICT`                 |
| **UI**        | `<RequireRole allowedRole="customer                          | company">` guards pages |

> 📁 Profiles: `customers/{uid}` or `companies/{uid}`

### ⚠️ Firebase Singleton (CRITICAL)

Never instantiate Firebase twice:

```typescript
// 🖥️ Client-side (components, pages)
import { auth, db, storage } from "@/services/firebase";

// 🔐 Server-side (API routes only)
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
if (!adminReady) return res.status(503).json(apiError("Admin not ready"));
```

---

## 🔒 API Routes

All protected endpoints in `pages/api/` follow this pattern:

```typescript
import { verifyAuth, sendAuthError, withAuth } from "@/lib/apiAuth";
import { apiSuccess, apiError } from "@/types/api";

// ✅ Preferred: Wrapper
export default withAuth(async (req, res, uid) => {
  // uid is verified, proceed with logic
});

// Alternative: Manual check
const auth = await verifyAuth(req);
if (!auth.success) return sendAuthError(res, auth);
if (data.customerId !== auth.uid) return res.status(403).json(apiError("Forbidden"));
```

---

## 📊 Data Model

**Flow**: Customer creates request → Companies submit offers → Customer accepts one → Others auto-declined

| Collection                      | Key Fields                                       | Notes                      |
| ------------------------------- | ------------------------------------------------ | -------------------------- |
| `requests/{id}`                 | `customerId`, `requestCode`, `status`            | Main document              |
| `requests/{id}/offers/{id}`     | `companyId`, `price`, `requestId`, `requestCode` | ⚠️ Denormalize parent refs |
| `companies/{id}/notifications/` | `type`, `requestId`, `read`                      | Real-time alerts           |

**Statuses**:

- Requests: `active` · `closed` · `paused` · `cancelled`
- Offers: `pending` · `accepted` · `declined`

---

## 🛠️ Helper Functions

> **Always prefer helpers over raw Firestore SDK**

```typescript
import { createRequest, addOffer, updateRequest, archiveRequest } from "@/utils/firestoreHelpers";
import { ensureUserProfile, getUserRole } from "@/utils/firebaseHelpers";
```

`createRequest()` auto-generates `REQ-XXXXXX` via transaction on `meta/counters.requestSeq`.

---

## 📋 Conventions

| Rule               | Implementation                                      |
| ------------------ | --------------------------------------------------- |
| 🚫 No hard deletes | Use `archived: true` or status changes              |
| ⏰ Timestamps      | Always `serverTimestamp()`                          |
| 🔔 Toasts          | `sonner`: `toast.success()`, `toast.error()`        |
| 📞 Romanian phone  | `07xxxxxxxx` – use `utils/validation.ts`            |
| 🔗 Denormalization | Include `requestId`/`requestCode` in subcollections |

---

## 🎨 Styling (Tailwind v4)

Config: `globals.css` with `@theme{}`. Use these classes:

| Class          | Purpose                   |
| -------------- | ------------------------- |
| `.card`        | Rounded glass-effect card |
| `.btn-primary` | Emerald gradient button   |
| `.btn-outline` | Outlined variant          |

---

## 🔌 Integrations

| Service     | Location                     | Env Vars                |
| ----------- | ---------------------------- | ----------------------- |
| **EmailJS** | `utils/emailHelpers.ts`      | `NEXT_PUBLIC_EMAILJS_*` |
| **Resend**  | `pages/api/offers/accept.ts` | `RESEND_API_KEY`        |
| **GA4**     | `utils/analytics.ts`         | –                       |

---

## 📤 Media Upload Flow

Token-based deferred upload system:

```
generateUploadLink.ts → creates token
       ↓
pages/upload/[token].tsx → public upload page
       ↓
validateUploadToken.ts / markUploadTokenUsed.ts → lifecycle
       ↓
notifyCompaniesOnUpload.ts → alerts companies
```

---

## 📁 Key Files

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
