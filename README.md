# 🚚 OferteMutare.ro

**Platformă modernă pentru conectarea clienților cu firme de mutări verificate din România.**

**Operator:** Ofertemutare Ltd

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.8-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)

---

## 📋 Cuprins

- [Despre Proiect](#-despre-proiect)
- [Tech Stack](#-tech-stack)
- [Funcționalități](#-funcționalități)
- [Setup Local](#-setup-local)
- [Structura Proiectului](#-structura-proiectului)
- [Variabile de Mediu](#-variabile-de-mediu)
- [Firebase Setup](#-firebase-setup)
- [Development](#-development)
- [Deployment](#-deployment)
- [Arhitectură](#-arhitectură)
- [Contributing](#-contributing)

---

## 🎯 Despre Proiect

OferteMutare.ro este o platformă all-in-one care simplifică procesul de mutare prin conectarea clienților cu firme de mutări profesioniste.

### Pentru Clienți

- Trimite o singură cerere de ofertă
- Primește oferte de la multiple firme verificate
- Compară prețuri și servicii
- Alege oferta potrivită pentru tine

### Pentru Companii

- Acces la cereri de mutări în timp real
- Sistem de notificări pentru updates
- Dashboard pentru gestionarea ofertelor
- Mesagerie directă cu clienții

---

## � Email System

### ✅ Notificări Active (Trimise Automat)

| Template                   | Destinatar              | Trigger                         | Status   |
| -------------------------- | ----------------------- | ------------------------------- | -------- |
| `guestRequestConfirmation` | Client                  | După trimitere cerere           | ✅ ACTIV |
| `newRequestNotification`   | Toate companiile active | După creare cerere nouă         | ✅ ACTIV |
| `newOffer`                 | Client                  | După ce companie trimite ofertă | ✅ ACTIV |
| `offerAccepted`            | Companie                | După acceptare ofertă           | ✅ ACTIV |
| `contactForm`              | Admin                   | După trimitere formular contact | ✅ ACTIV |

### 🔒 Template-uri Pregătite (Funcționalități Inactive)

| Template                 | Destinatar          | Trigger           | Status                         |
| ------------------------ | ------------------- | ----------------- | ------------------------------ |
| `offerDeclined`          | Companiile respinse | Accept/decline UI | 🔒 Gata (feature-ul nu e live) |
| `newMessageFromCompany`  | Client              | Chat message      | 🔒 Gata (chat-ul nu e live)    |
| `newMessageFromCustomer` | Companie            | Chat message      | 🔒 Gata (chat-ul nu e live)    |

### � Funcționalități Planificate

- **`offerReminder`**: Email reminder la 48h după prima ofertă primită (necesită CRON job)

### Configurare Email

**Provider**: Resend API (https://resend.com)
**Domeniu**: ofertemutare.ro (verificat cu SPF/DKIM/DMARC)
**From Address**: info@ofertemutare.ro
**API Tier**: FREE (3,000 emails/lună)

### Activare Funcționalități Dezactivate

Când chat-ul sau accept/decline devin live, șterge comentariile TODO din:

- `pages/api/offers/message.ts` - Pentru notificări chat
- `pages/api/offers/accept.ts` - Pentru notificări decline

---

## �🛠️ Tech Stack

### Frontend

- **[Next.js 14.2](https://nextjs.org/)** - React framework cu Pages Router
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type safety (strict mode)
- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animații fluide
- **[Heroicons 2.2](https://heroicons.com/)** - Icon library
- **[Headless UI 2.2](https://headlessui.com/)** - Accessible UI components
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend & Database

- **[Firebase Auth](https://firebase.google.com/docs/auth)** - Autentificare (Google OAuth + Email/Password)
- **[Firestore](https://firebase.google.com/docs/firestore)** - NoSQL database real-time
- **[Firebase Storage](https://firebase.google.com/docs/storage)** - File storage pentru imagini/video
- **[Firebase Admin SDK 12.7](https://firebase.google.com/docs/admin/setup)** - Server-side operations
- **[Resend 6.9](https://resend.com/)** - Transactional email service

### Tools & Libraries

- **[ESLint](https://eslint.org/)** - Linting (flat config)
- **[Sharp](https://sharp.pixelplumbing.com/)** - Image optimization
- **[PM2](https://pm2.io/)** - Process manager (cluster mode)
- **[Nginx](https://nginx.org/)** - Reverse proxy cu SSL

---

## ✨ Funcționalități

### Core Features

- ✅ **Dual-role system** - Customer & Company accounts
- ✅ **Real-time updates** - Firebase Firestore listeners
- ✅ **Media upload system** - Token-based cu progress tracking
- ✅ **Offer management** - Submit, accept, decline offers
- ✅ **Notification system** - Real-time pentru companies
- ✅ **Request lifecycle** - Create, edit, archive, status management
- ✅ **Sequential request codes** - REQ-XXXXXX via Firestore transactions
- ✅ **Messaging system** - Communication între customer și company
- ✅ **Responsive design** - Mobile-first approach

### Security Features

- ✅ **Firebase Security Rules** - Role-based access control cu validări stricte
- ✅ **Dual-role prevention** - Users nu pot avea ambele roluri
- ✅ **API authentication** - Firebase ID token verification + INTERNAL_API_SECRET
- ✅ **Ownership validation** - Pe toate operațiile sensibile
- ✅ **HTTPS only** - HSTS cu preload
- ✅ **Content-Security-Policy** - Whitelist strict pentru scripts/styles/connections
- ✅ **Rate limiting** - In-memory per IP pe endpoint-uri publice (5 req/min)
- ✅ **GDPR Cookie Consent** - Banner granular cu 3 categorii (necesar/analiză/marketing)
- ✅ **GA4 condițional** - Google Analytics se încarcă doar cu consimțământ
- ✅ **PII protection** - Endpoint-urile publice nu expun date personale
- ✅ **Zone filtering** - Companiile primesc notificări doar pentru zonele lor
- ✅ **X-Robots-Tag noindex** - Pe paginile admin/company/customer
- ✅ **Centralized logging** - `logger` (dev-only) în loc de `console.*`
- ✅ **Standardized API responses** - `apiError()`/`apiSuccess()` pe toate endpoint-urile

---

## 🚀 Setup Local

### Prerequisites

- **Node.js** 18+ și npm
- **Firebase account** (gratuit pentru development)
- **Git**

### Instalare

1. **Clone repository**

   ```bash
   git clone https://github.com/xerud2002/OM.git
   cd OM
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   # Copiază template-ul
   cp ".env copy.example" .env

   # Editează .env cu credențialele tale Firebase
   # Vezi secțiunea "Variabile de Mediu" mai jos
   ```

4. **Firebase setup** (vezi detalii în secțiunea [Firebase Setup](#-firebase-setup))
   - Creează Firebase project
   - Enable Authentication (Google + Email/Password)
   - Creează Firestore database
   - Setup Storage bucket
   - Generate service account pentru Admin SDK

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Structura Proiectului

```
OM/
├── components/
│   ├── auth/
│   │   └── RequireRole.tsx         # Role-based page protection
│   ├── company/
│   │   ├── NotificationBell.tsx    # Real-time notifications
│   │   ├── RequestsView.tsx        # Company dashboard view
│   │   └── VerificationSection.tsx # Company verification upload
│   ├── customer/
│   │   ├── RequestForm.tsx         # Create/edit requests
│   │   └── RequestFullDetails.tsx  # Full request view
│   ├── home/
│   │   ├── Hero.tsx                # Landing page hero
│   │   └── HomeRequestForm.tsx     # Embedded request form
│   ├── layout/
│   │   ├── Navbar.tsx              # Global navigation
│   │   ├── Footer.tsx              # Global footer + cookie settings
│   │   └── LayoutWrapper.tsx       # Page wrapper
│   ├── CookieConsent.tsx           # GDPR cookie banner
│   ├── ConfirmModal.tsx            # Reusable confirm dialog
│   └── ErrorBoundary.tsx           # Global error handler
├── lib/
│   ├── firebaseAdmin.ts            # Firebase Admin SDK init
│   └── apiAuth.ts                  # API authentication helpers
├── pages/
│   ├── api/
│   │   ├── send-email.ts           # Central email hub (10+ types)
│   │   ├── generateUploadLink.ts   # Media upload token generation
│   │   ├── validateUploadToken.ts  # Validate upload token
│   │   ├── markUploadTokenUsed.ts  # Mark token as used
│   │   ├── notifyCompaniesOnUpload.ts # Notify after upload
│   │   ├── sendUploadReminders.ts  # CRON: upload reminders
│   │   ├── cron/
│   │   │   └── auto-refund.ts      # CRON: 72h auto-refund
│   │   ├── offers/
│   │   │   ├── accept.ts           # Accept offer (secure)
│   │   │   ├── decline.ts          # Decline offer (secure)
│   │   │   └── message.ts          # Send message (secure)
│   │   ├── requests/
│   │   │   ├── createGuest.ts      # Public: create request (rate-limited)
│   │   │   └── linkToAccount.ts    # Link guest request to account
│   │   └── locations/
│   │       └── search.ts           # Autocomplete search
│   ├── admin/                      # Admin dashboard (6 pages)
│   ├── company/                    # Company dashboard (6 pages)
│   ├── customer/                   # Customer dashboard (4 pages)
│   ├── articole/                   # Blog articles (9 pages)
│   ├── mutari/                     # Moving routes (8 pages)
│   ├── servicii/                   # Services (6 pages)
│   ├── upload/
│   │   └── [token].tsx             # Token-based media upload
│   ├── _app.tsx                    # App shell + GA4 consent
│   ├── index.tsx                   # Landing page
│   ├── contact.tsx                 # Contact page + form
│   ├── about.tsx                   # About page
│   ├── privacy.tsx                 # Privacy policy (GDPR)
│   └── terms.tsx                   # Terms of service
├── public/
│   ├── pics/                       # Static images (WebP)
│   ├── docs/                       # Technical documentation
│   ├── robots.txt                  # Crawler rules (AI bots blocked)
│   └── sitemap.xml                 # SEO sitemap
├── services/
│   ├── firebase.ts                 # Firebase client init
│   └── email.ts                    # Centralized Resend email service
├── types/
│   ├── index.ts                    # TypeScript definitions
│   └── api.ts                      # API response types (apiError/apiSuccess)
├── utils/
│   ├── cookies.ts                  # Cookie CRUD + GDPR consent management
│   ├── logger.ts                   # Dev-only logging (replaces console.*)
│   ├── analytics.ts                # GA4 page view tracking
│   ├── firebaseHelpers.ts          # Auth & profile helpers
│   ├── firestoreHelpers.ts         # CRUD operations
│   ├── costCalculator.ts           # Moving cost estimator
│   ├── devErrorSuppressor.ts       # Dev console cleanup (prod tree-shaken)
│   └── date.ts                     # Date formatting
├── .env                            # Environment variables (gitignored)
├── firebase.firestore.rules        # Firestore security rules
├── firebase.storage.rules          # Storage security rules
├── firestore.indexes.json          # Composite indexes (6)
├── next.config.js                  # Next.js config + security headers
├── ecosystem.config.cjs            # PM2 cluster config
├── nginx-om.conf                   # Nginx reverse proxy
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

---

## 🔐 Variabile de Mediu

Copiază `.env copy.example` la `.env` și completează cu valorile tale:

### Firebase Client (Public)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebase Admin (Server-side - SECRETĂ)

```env
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Resend (Email)

```env
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=info@ofertemutare.ro
RESEND_ADMIN_EMAIL=info@ofertemutare.ro
```

### Security

```env
INTERNAL_API_SECRET=random_64_char_hex_string
CRON_API_KEY=random_secure_string_for_cron_endpoints
```

### Optional

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🔥 Firebase Setup

### 1. Creează Firebase Project

1. Mergi la [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Urmează wizard-ul (Analytics opțional)

### 2. Enable Authentication

1. În Firebase Console → **Authentication** → **Get started**
2. Enable **Google** provider:
   - Click pe Google
   - Toggle **Enable**
   - Adaugă **Support email**
   - Save
3. Enable **Email/Password** provider:
   - Click pe Email/Password
   - Toggle **Enable**
   - Save

### 3. Creează Firestore Database

1. În Firebase Console → **Firestore Database** → **Create database**
2. Alege **Start in production mode** (vom deploya rules custom)
3. Alege **location** (eu-west3 pentru Europa)
4. Click **Enable**

### 4. Deploy Firestore Rules

```bash
# Instalează Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init project (dacă nu e deja)
firebase init firestore
# Selectează project-ul tău
# Accept default pentru firestore.rules și firestore.indexes.json

# Deploy rules
firebase deploy --only firestore:rules
```

### 5. Setup Storage

1. În Firebase Console → **Storage** → **Get started**
2. Start în **production mode**
3. Alege aceeași **location** ca Firestore
4. Click **Done**

### 6. Deploy Storage Rules

```bash
firebase deploy --only storage
```

### 7. Generate Service Account (pentru Admin SDK)

1. În Firebase Console → **Project Settings** (⚙️ icon)
2. Tab **Service accounts**
3. Click **Generate new private key**
4. Confirmă → se va download un JSON file
5. Copiază valorile în `.env`:
   ```env
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
   ```

**⚠️ IMPORTANT**: Nu commit-a niciodată acest JSON sau `.env` în Git!

### 8. Get Firebase Client Config

1. În Firebase Console → **Project Settings** → **General**
2. Scroll la **Your apps** → Click **Web** icon (`</>`)
3. Register app (nickname: "OferteMutare Web")
4. Copiază config în `.env`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   # etc.
   ```

### 9. Setup Resend (Email Service)

1. Creează cont pe [Resend](https://resend.com/)
2. Adaugă și verifică domeniul `ofertemutare.ro` (SPF/DKIM/DMARC)
3. Generează API Key
4. Adaugă în `.env`:
   ```env
   RESEND_API_KEY=re_xxxx
   RESEND_FROM_EMAIL=info@ofertemutare.ro
   RESEND_ADMIN_EMAIL=info@ofertemutare.ro
   ```
5. Emailurile sunt gestionate centralizat prin `services/email.ts`

---

## 💻 Development

### Available Scripts

```bash
# Development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Code Quality

- **TypeScript**: Strict mode enabled
  - No implicit any
  - Strict null checks
  - Type checking în build

- **ESLint**: Flat config
  - Next.js rules
  - React hooks rules
  - Max warnings: 0

### Development Tips

1. **Hot Reload**: Next.js HMR funcționează out-of-the-box
2. **Error Suppressor**: `utils/devErrorSuppressor.ts` curăță console-ul în dev (conditional `require()`, tree-shaken din producție)
3. **Logger**: Folosește `utils/logger.ts` în loc de `console.*` — loguri doar în development
4. **Port**: App rulează pe `:3000` (configurat în `package.json`)
5. **Firebase Emulators** (opțional):
   ```bash
   firebase emulators:start
   ```

---

## 🚢 Deployment

### VPS cu PM2 + Nginx (Producție)

1. **Push la GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Setup VPS** (Ubuntu)

   ```bash
   # Install Node.js 18+, PM2, Nginx
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs nginx
   sudo npm install -g pm2
   ```

3. **Clone & Build**

   ```bash
   git clone https://github.com/xerud2002/OM.git
   cd OM
   npm install
   npm run build
   ```

4. **Start cu PM2** (cluster mode)

   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```

5. **Nginx Reverse Proxy**

   ```bash
   sudo cp nginx-om.conf /etc/nginx/sites-available/ofertemutare.ro
   sudo ln -s /etc/nginx/sites-available/ofertemutare.ro /etc/nginx/sites-enabled/
   sudo certbot --nginx -d ofertemutare.ro -d www.ofertemutare.ro
   sudo nginx -t && sudo systemctl reload nginx
   ```

6. **Auto-deploy** (opțional)
   ```bash
   # Folosește auto-deploy-vps.sh sau deploy.sh
   bash deploy.sh
   ```

### Environment Variables în Producție

**CRITICAL**: Asigură-te că toate variabilele din `.env` sunt setate pe server:

- ✅ Toate `NEXT_PUBLIC_*` vars
- ✅ `FIREBASE_ADMIN_*` vars (SECRETE!)
- ✅ `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_ADMIN_EMAIL`
- ✅ `INTERNAL_API_SECRET` (64-char hex)
- ✅ `CRON_API_KEY` (pentru CRON endpoints)

---

## 🏛️ Arhitectură

### Data Flow

```
Client (Browser)
    ↓
Next.js Pages (SSR/CSR)
    ↓
Components (React)
    ↓
Utils/Helpers
    ↓
Firebase Client SDK ←→ Firestore/Auth/Storage
    ↓
API Routes (Next.js)
    ↓
Firebase Admin SDK ←→ Firestore/Auth (server-side)
```

### Authentication Flow

```
1. User → Login/Signup (pages/customer/auth.tsx sau company/auth.tsx)
2. Firebase Auth → Create user
3. firebaseHelpers.ensureUserProfile() → Create profile doc
4. Firestore → customers/{uid} sau companies/{uid}
5. RequireRole wrapper → Verify role on protected pages
6. Redirect dacă role mismatch
```

### Request Lifecycle

```
1. Customer creates request → createRequest()
2. Transaction → Generate sequential REQ-XXXXXX code
3. Firestore → Save to requests/{id}
4. Companies view requests → Real-time listener
5. Company submits offer → addOffer()
6. Customer receives offers → Real-time listener
7. Customer accepts offer → /api/offers/accept (secure)
8. Batch update → Accept selected, decline others
9. Companies notified → notifications subcollection
```

### Media Upload Workflow

```
1. Customer creates request → mediaUpload: "later"
2. /api/generateUploadLink → 64-char token, 7-day expiry (auth + request verified)
3. Resend → Send link to customer via services/email.ts
4. Customer visits /upload/[token]
5. Firebase Storage → Direct upload cu progress
6. Update request.mediaUrls[]
7. /api/notifyCompaniesOnUpload → Notify companies cu offers
8. Reminder system → /api/sendUploadReminders (CRON, direct sendEmail())
```

### Security Model

- **Firestore Rules**: Role-based access control
  - Customers: read/write own requests
  - Companies: read all requests, write own offers (validated)
  - Dual-role prevention
  - Subcollection isolation

- **API Routes**: Firebase ID token verification + INTERNAL_API_SECRET
  - `/api/offers/accept` → Verify ownership
  - `/api/offers/decline` → Verify ownership
  - `/api/offers/message` → Verify participation
  - `/api/markUploadTokenUsed` → Verify ownership
  - `/api/notifyCompaniesOnUpload` → Verify ownership
  - `/api/send-email` → INTERNAL_API_SECRET (public types: contactForm only)
  - `/api/requests/createGuest` → Rate-limited (5 req/min/IP)
  - `/api/cron/auto-refund` → CRON_API_KEY auth (x-api-key header)

- **HTTP Security Headers** (next.config.js)
  - Content-Security-Policy (strict whitelist)
  - HSTS cu preload
  - X-Robots-Tag noindex pe admin/company/customer

- **Privacy & GDPR**
  - Cookie consent granular (3 categorii)
  - GA4 se încarcă doar cu consimțământ
  - PII nu se expune în API-uri publice
  - Centralized logging cu `logger` (dev-only)

---

## 🤝 Contributing

### Workflow

1. **Fork** repository
2. **Create branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Style

- **TypeScript** pentru toate fișierele noi
- **Functional components** cu hooks (nu class components)
- **Tailwind** pentru styling (evită CSS-in-JS)
- **ESLint** va verifica automat codul

### Commit Messages

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Testing (WIP)

Proiectul nu are încă teste automate. Contribuții welcome pentru:

- Unit tests (Jest + Testing Library)
- API endpoint tests
- E2E tests (Playwright/Cypress)

---

## 📄 License

Acest proiect este proprietate privată. All rights reserved.

---

## 🙏 Credits

- **Developer**: [xerud2002](https://github.com/xerud2002)
- **AI Assistant**: GitHub Copilot
- **Framework**: Next.js Team
- **Database**: Firebase Team
- **UI Icons**: Heroicons

---

## 📞 Support

Pentru întrebări sau probleme:

- **GitHub Issues**: [Create issue](https://github.com/xerud2002/OM/issues)
- **Email**: info@ofertemutare.ro

---

**Made with ❤️ în România**
