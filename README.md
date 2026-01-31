# 🚚 OferteMutare.ro

**Platform modernă pentru conectarea clienților cu firme de mutări verificate din România.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

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

| Template | Destinatar | Trigger | Status |
|----------|-----------|---------|--------|
| `guestRequestConfirmation` | Client | După trimitere cerere | ✅ ACTIV |
| `newRequestNotification` | Toate companiile active | După creare cerere nouă | ✅ ACTIV |
| `newOffer` | Client | După ce companie trimite ofertă | ✅ ACTIV |
| `offerAccepted` | Companie | După acceptare ofertă | ✅ ACTIV |
| `contactForm` | Admin | După trimitere formular contact | ✅ ACTIV |

### 🔒 Template-uri Pregătite (Funcționalități Inactive)

| Template | Destinatar | Trigger | Status |
|----------|-----------|---------|--------|
| `offerDeclined` | Companiile respinse | Accept/decline UI | 🔒 Gata (feature-ul nu e live) |
| `newMessageFromCompany` | Client | Chat message | 🔒 Gata (chat-ul nu e live) |
| `newMessageFromCustomer` | Companie | Chat message | 🔒 Gata (chat-ul nu e live) |

### 📅 TODO (Implementare Necesară)

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

- **[Next.js 14](https://nextjs.org/)** - React framework cu Pages Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animații fluide
- **[Lucide React](https://lucide.dev/)** - Icon library modern
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend & Database

- **[Firebase Auth](https://firebase.google.com/docs/auth)** - Autentificare (Google OAuth + Email/Password)
- **[Firestore](https://firebase.google.com/docs/firestore)** - NoSQL database real-time
- **[Firebase Storage](https://firebase.google.com/docs/storage)** - File storage pentru imagini/video
- **[Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)** - Server-side operations

### Tools & Libraries

- **[ESLint](https://eslint.org/)** - Linting (flat config)
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Pre-commit linting
- **[EmailJS](https://www.emailjs.com/)** - Email notifications

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

- ✅ **Firebase Security Rules** - Role-based access control
- ✅ **Dual-role prevention** - Users nu pot avea ambele roluri
- ✅ **API authentication** - Firebase ID token verification
- ✅ **Ownership validation** - Pe toate operațiile sensibile
- ✅ **HTTPS only** - Secure communication

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
   http://localhost:3001
   ```

---

## 📁 Structura Proiectului

```
OM/
├── .github/
│   └── copilot-instructions.md     # AI coding agent guidelines
├── components/
│   ├── auth/
│   │   └── RequireRole.tsx         # Role-based page protection
│   ├── company/
│   │   ├── NotificationBell.tsx    # Real-time notifications
│   │   └── RequestsView.tsx        # Company dashboard view
│   ├── customer/
│   │   ├── RequestForm.tsx         # Create/edit requests
│   │   ├── MyRequestCard.tsx       # Request display card
│   │   ├── OfferComparison.tsx     # Compare offers
│   │   └── EditRequestModal.tsx    # Edit request modal
│   ├── home/
│   │   ├── Hero.tsx                # Landing page hero
│   │   ├── Services.tsx            # Services section
│   │   └── Steps.tsx               # How it works
│   └── layout/
│       ├── Navbar.tsx              # Global navigation
│       ├── Footer.tsx              # Global footer
│       └── Layout.tsx              # Page wrapper
├── lib/
│   └── firebaseAdmin.ts            # Firebase Admin SDK init
├── pages/
│   ├── api/
│   │   ├── generateUploadLink.ts   # Media upload token
│   │   ├── validateUploadToken.ts  # Validate token
│   │   ├── notifyCompaniesOnUpload.ts # Notify after upload
│   │   └── offers/
│   │       ├── accept.ts           # Accept offer (secure)
│   │       ├── decline.ts          # Decline offer (secure)
│   │       └── message.ts          # Send message (secure)
│   ├── customer/
│   │   ├── auth.tsx                # Customer login/signup
│   │   ├── dashboard.tsx           # Customer dashboard
│   │   └── settings.tsx            # Customer settings
│   ├── company/
│   │   ├── auth.tsx                # Company login/signup
│   │   └── dashboard.tsx           # Company dashboard
│   ├── upload/
│   │   └── [token].tsx             # Token-based media upload
│   ├── _app.tsx                    # App shell
│   └── index.tsx                   # Landing page
├── public/
│   ├── pics/                       # Static images
│   └── patterns/                   # Background patterns
├── services/
│   └── firebase.ts                 # Firebase client init
├── types/
│   └── index.ts                    # TypeScript definitions
├── utils/
│   ├── firebaseHelpers.ts          # Auth & profile helpers
│   ├── firestoreHelpers.ts         # CRUD operations
│   ├── emailHelpers.ts             # EmailJS integration
│   ├── validation.ts               # Romanian validators
│   ├── date.ts                     # Date formatting
│   └── animations.ts               # Framer Motion variants
├── .env                            # Environment variables (gitignored)
├── .env copy.example               # Environment template
├── firebase.firestore.rules        # Firestore security rules
├── firebase.storage.rules          # Storage security rules
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
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

### EmailJS

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### Optional

```env
CRON_API_KEY=random_secure_string_for_cron_endpoints
NEXT_PUBLIC_GA_ID=your_google_analytics_id
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

### 9. Setup EmailJS (opțional dar recomandat)

1. Creează cont pe [EmailJS](https://www.emailjs.com/)
2. Add **Email Service** (Gmail/Outlook/etc.)
3. Create **Email Template** pentru upload links:

   ```
   Subject: Link pentru încărcarea pozelor - Cererea {{request_code}}

   Bună {{customer_name}},

   Te rugăm să încarci pozele pentru cererea ta de mutare:
   {{upload_link}}

   Link-ul este valabil 7 zile.
   ```

4. Copiază credentials în `.env`

---

## 💻 Development

### Available Scripts

```bash
# Development server (port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Format code
npm run format
```

### Code Quality

- **Pre-commit hooks**: Husky + lint-staged
  - Auto-format cu Prettier
  - Auto-lint cu ESLint
  - Only pe staged files

- **TypeScript**: Strict mode enabled
  - No implicit any
  - Strict null checks
  - Type checking în build

- **ESLint**: Flat config
  - Next.js rules
  - React hooks rules
  - Tailwind classnames order
  - Max warnings: 0

### Development Tips

1. **Hot Reload**: Next.js HMR funcționează out-of-the-box
2. **Error Suppressor**: `utils/devErrorSuppressor.ts` curăță console-ul în dev
3. **Port**: App rulează pe `:3001` (configurat în `package.json`)
4. **Firebase Emulators** (opțional):
   ```bash
   firebase emulators:start
   ```

---

## 🚢 Deployment

### Vercel (Recomandat)

1. **Push la GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy pe Vercel**
   - Mergi la [vercel.com](https://vercel.com)
   - Import repository
   - Vercel detectează automat Next.js
   - Add **Environment Variables** din `.env`
   - Deploy!

3. **Post-Deploy**
   - Update `NEXT_PUBLIC_APP_URL` în Vercel environment vars
   - Redeploy pentru a aplica schimbarea

### Firebase Hosting (Alternativ)

```bash
# Build app
npm run build

# Deploy
firebase deploy --only hosting
```

### Environment Variables în Producție

**CRITICAL**: Asigură-te că toate variabilele din `.env` sunt setate în Vercel/hosting provider:

- ✅ Toate `NEXT_PUBLIC_*` vars
- ✅ `FIREBASE_ADMIN_*` vars (SECRETE!)
- ✅ `EMAILJS_*` vars
- ✅ `CRON_API_KEY` (pentru reminder endpoint)

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
2. /api/generateUploadLink → 64-char token, 7-day expiry
3. EmailJS → Send link to customer
4. Customer visits /upload/[token]
5. Firebase Storage → Direct upload cu progress
6. Update request.mediaUrls[]
7. /api/notifyCompaniesOnUpload → Notify all companies cu offers
8. Reminder system → /api/sendUploadReminders (CRON)
```

### Security Model

- **Firestore Rules**: Role-based access control
  - Customers: read/write own requests
  - Companies: read all requests, write own offers
  - Dual-role prevention
  - Subcollection isolation

- **API Routes**: Firebase ID token verification
  - `/api/offers/accept` → Verify ownership
  - `/api/offers/decline` → Verify ownership
  - `/api/offers/message` → Verify participation
  - `/api/markUploadTokenUsed` → Verify ownership
  - `/api/notifyCompaniesOnUpload` → Verify ownership

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
- **ESLint + Prettier** vor formata automat la commit

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
- **UI Icons**: Lucide

---

## 📞 Support

Pentru întrebări sau probleme:

- **GitHub Issues**: [Create issue](https://github.com/xerud2002/OM/issues)
- **Email**: info@ofertemutare.ro

---

**Made with ❤️ în România**
