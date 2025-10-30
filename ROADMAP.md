# 🗺️ ROADMAP - OferteMutare.ro

## 🎯 Status Actual (v1.0)

### ✅ Funcționalități Complete
- ✅ Autentificare (Google + Email/Password) cu role-based access
- ✅ Dashboard customer cu cereri și oferte
- ✅ Dashboard companii cu toate cererile și oferte proprii
- ✅ Formular mutare complet (județ, oraș, tip proprietate, servicii, survey)
- ✅ Sistem oferte cu accept/decline
- ✅ Upload media cu token validation, progress bars, thumbnails
- ✅ Notificări companii când client uploadă media
- ✅ Email notifications (EmailJS) pentru upload links
- ✅ Reminder emails pentru upload-uri incomplete
- ✅ A/B testing infrastructure
- ✅ Google Analytics 4 integration

---

## 🚀 PROPUNERI STRATEGICE - Next Steps

### 🔥 PRIORITATE ÎNALTĂ (1-2 săptămâni)

#### 1. **Sistem de Rating și Review pentru Companii** ⭐⭐⭐⭐⭐
**De ce:** Build trust, social proof, improve conversions cu 30-40%

**Features:**
- Customer poate lăsa review după finalizarea mutării
- Rating 1-5 stele + comentariu text
- Afișare rating mediu pe profilul companiei
- Sortare companii după rating în lista de requests
- Badge-uri: "Top Rated", "5 Stele", "Recomandat"

**Impact:** 🔥🔥🔥 MARE (conversii + trust)

**Implementare:**
```
Firestore:
companies/{id}/reviews/{reviewId}
  ├─ customerId
  ├─ customerName
  ├─ rating (1-5)
  ├─ comment
  ├─ requestId
  └─ createdAt

companies/{id}
  ├─ averageRating (calculat)
  ├─ totalReviews (count)
  └─ ...

UI:
- pages/company/[id].tsx (profil public cu reviews)
- components/company/ReviewCard.tsx
- components/customer/LeaveReview.tsx (după mutare)
```

---

#### 2. **Chat în Timp Real (Customer ↔ Company)** 💬
**De ce:** Reduce friction, răspunsuri rapide = mai multe conversii

**Features:**
- Chat direct între customer și companie pentru o cerere specifică
- Notificări real-time când mesaj nou
- Upload imagini/documente în chat
- Status "Online/Offline" pentru companii
- History chat păstrat în Firestore

**Impact:** 🔥🔥🔥 MARE (engagement + conversii)

**Implementare:**
```
Firestore:
requests/{requestId}/messages/{messageId}
  ├─ senderId
  ├─ senderType (customer|company)
  ├─ text
  ├─ attachments[]
  ├─ read: boolean
  └─ createdAt

Real-time listener:
onSnapshot(messagesCollection, updateUI)

UI:
- components/chat/ChatWindow.tsx
- components/chat/MessageBubble.tsx
- Notification badge când unread messages
```

**Tech Stack:**
- Firestore real-time listeners
- Firebase Cloud Functions pentru push notifications (opțional)
- React context pentru chat state

---

#### 3. **Profil Public Companie cu SEO** 🏢
**De ce:** SEO boost, Google indexing, organic traffic

**Features:**
- URL friendly: `/companie/firma-mutari-bucuresti`
- Galerie poze cu mutări anterioare
- Servicii oferite (detailed)
- Zone de operare (județe/orașe)
- Certificări și licențe
- Contact info + program de lucru
- Reviews și rating (din #1)
- Schema.org markup pentru SEO

**Impact:** 🔥🔥🔥 MARE (SEO + credibilitate)

**Implementare:**
```
pages/companie/[slug].tsx
- Static generation (getStaticPaths + getStaticProps)
- Meta tags optimizate
- Open Graph pentru social sharing
- Structured data (LocalBusiness schema)

Firestore:
companies/{id}
  ├─ slug (unique, URL-friendly)
  ├─ description
  ├─ services[]
  ├─ coverageAreas[]
  ├─ gallery[]
  ├─ certificates[]
  ├─ workingHours
  └─ ...
```

---

#### 4. **Dashboard Analytics pentru Companii** 📊
**De ce:** Data-driven decisions, retention, premium upsell opportunity

**Features:**
- Grafic cereri primite (ultimele 30 zile)
- Conversion rate (oferte trimise vs. acceptate)
- Timp mediu de răspuns
- Top zone geografice pentru cereri
- Comparație cu alte companii (anonymous)
- Export rapoarte PDF

**Impact:** 🔥🔥 MEDIU-MARE (retention + premium tier)

**Implementare:**
```
components/company/analytics/
  ├─ RequestsChart.tsx (recharts)
  ├─ ConversionRate.tsx
  ├─ ResponseTime.tsx
  └─ GeographicHeatmap.tsx

utils/analyticsHelpers.ts
- calculateConversionRate()
- getRequestsByDate()
- getAverageResponseTime()

Premium tier:
- Free: last 7 days
- Premium: unlimited history + exports
```

---

### 💡 PRIORITATE MEDIE (2-4 săptămâni)

#### 5. **Sistem de Plată Integrată (Stripe)** 💳
**De ce:** Monetizare, comision pe tranzacții

**Modele de business:**
- **Plan A:** Companii plătesc subscription lunar (Basic €29/lună, Pro €99/lună)
  - Basic: 10 oferte/lună, 1 cont
  - Pro: oferte nelimitate, 5 conturi, analytics premium
  
- **Plan B:** Comision per ofertă acceptată (10-15% din valoarea mutării)
  - Customer plătește 50% avans prin platformă
  - Platformă reține comision
  - Transfer automat către companie după confirmare

**Features:**
- Stripe Checkout integration
- Webhook pentru subscription status
- Invoice automate
- Payment history în dashboard

**Impact:** 🔥🔥🔥🔥 FOARTE MARE (revenue)

---

#### 6. **Sistem de Verificare Companii** ✅
**De ce:** Trust, reduce spam, premium badge

**Features:**
- Upload documente: CUI, certificat ANAF, asigurare
- Verificare manuală de către admin
- Badge "Verificat ✓" pe profil și în listă
- Filtrare "Doar companii verificate"

**Impact:** 🔥🔥 MEDIU (trust)

**Implementare:**
```
companies/{id}
  ├─ verified: boolean
  ├─ verificationDocuments[]
  ├─ verificationStatus (pending|approved|rejected)
  └─ verifiedAt

Admin panel:
pages/admin/verification.tsx
- Listă companii pending
- Preview documente
- Approve/Reject cu motiv
```

---

#### 7. **Notificări Push (PWA)** 🔔
**De ce:** Engagement rate +50%, retention

**Features:**
- Push notifications pentru:
  - Customer: ofertă nouă primită
  - Company: cerere nouă în zona ta
  - Chat: mesaj nou
  - Upload: reminder pentru media
- PWA installable (Add to Home Screen)
- Offline mode basic (cache pages)

**Impact:** 🔥🔥 MEDIU-MARE (engagement)

**Tech:**
- Firebase Cloud Messaging (FCM)
- Service Worker pentru PWA
- `next-pwa` package

---

#### 8. **Estimare Preț Automată cu AI** 🤖
**De ce:** Instant feedback, reduce wait time, wow factor

**Features:**
- ML model antrenat pe oferte istorice
- Input: camere, distanță, servicii, etaj, volum
- Output: "Preț estimat: 1.200-1.800 RON"
- Disclaimer: "Preț orientativ, ofertele pot varia"
- Ajută customerii să aibă așteptări realiste

**Impact:** 🔥🔥 MEDIU (UX + conversii)

**Tech:**
- TensorFlow.js (client-side)
- SAU: API externe (OpenAI, Claude)
- SAU: Simple regression model (Python + API)

**Implementare:**
```
utils/priceEstimator.ts
function estimatePrice(params) {
  // Simple formula sau ML model
  const basePrice = 500;
  const perRoom = 150;
  const perKm = 2;
  const floorMultiplier = params.floor > 2 ? 1.2 : 1;
  
  return basePrice + (params.rooms * perRoom) + (params.distance * perKm) * floorMultiplier;
}

UI:
<PriceEstimate 
  rooms={form.rooms}
  distance={calculateDistance(form.fromCity, form.toCity)}
  services={form.services}
/>
```

---

### 🎨 PRIORITATE SCĂZUTĂ (Nice-to-have)

#### 9. **Marketplace de Servicii Adiacente** 🛠️
**De ce:** Cross-sell, grow revenue per customer

**Servicii:**
- Curățenie post-mutare
- Montaj mobilă
- Depozitare temporară
- Ambalaje și materiale
- Asigurare transport
- Renovări (vopsit, glet, parchet)

**Model:** Parteneri plătesc comision 10-20%

---

#### 10. **Calendar de Disponibilitate (Companii)** 📅
**De ce:** Reduce back-and-forth, auto-scheduling

**Features:**
- Companii își setează disponibilitatea
- Customer vede ore libere și selectează
- Confirmare automată sau manuală
- Sincronizare cu Google Calendar

**Tech:** 
- Firestore pentru slots
- SAU: Calendly integration

---

#### 11. **Program de Referral** 🎁
**De ce:** Viral growth, low CAC

**Features:**
- Customer primește link unic de referral
- 50 RON discount pentru fiecare prieten care completează mutare
- Referrer primește 50 RON credit
- Dashboard cu referrals tracking

**Firestore:**
```
customers/{id}
  ├─ referralCode (unique)
  ├─ referredBy (customerId)
  ├─ referralCount
  └─ referralCredits
```

---

#### 12. **Blog și Ghiduri (SEO Content)** 📝
**De ce:** Organic traffic, SEO authority

**Conținut:**
- "Ghid complet: Cum să îți planifici mutarea în 2025"
- "Top 10 greșeli la mutare și cum să le eviti"
- "Cât costă o mutare în București? Prețuri 2025"
- "Checklist mutare: Ce să faci cu o lună înainte"

**Tech:**
- MDX files în `content/blog/`
- Static generation
- Next.js Image optimization
- Reading time, tags, search

---

#### 13. **Sistem de Licitație Inversă** 💰
**De ce:** Gamification, competiție între companii = prețuri mai bune

**Cum funcționează:**
- Customer setează buget maxim (opțional)
- Companii văd cererea + bugetul
- Companii licitează în jos (descending auction)
- Cea mai mică ofertă câștigă (dacă rating ok)
- Timer: 24h pentru licitație

**Gamification:**
- Live counter cu oferte
- "3 companii licitează acum!"
- Push notifications: "Ai fost depășit!"

---

#### 14. **App Mobilă Nativă (React Native)** 📱
**De ce:** Better UX, push notifications native, app store presence

**Features:**
- Sincronizare cu web app (Firebase)
- Push notifications native
- Cameră pentru upload media
- Location services pentru estimare distanță
- Offline mode

**Tech:** Expo + React Native + Firebase

---

#### 15. **Integrare cu Google Maps** 🗺️
**De ce:** Vizualizare traseu, estimare distanță precisă

**Features:**
- Hartă cu ruta from → to
- Distanță kilometrică calculată automat
- Estimare timp (trafic real-time)
- Street View pentru adrese
- Exportă traseu ca PDF pentru companii

---

## 📊 MATRICEA DE PRIORITIZARE

| Feature | Impact | Effort | Priority | Timeline |
|---------|--------|--------|----------|----------|
| Reviews & Rating | 🔥🔥🔥 | 🔧🔧 | ⭐⭐⭐⭐⭐ | 1-2 săptămâni |
| Chat Real-time | 🔥🔥🔥 | 🔧🔧🔧 | ⭐⭐⭐⭐⭐ | 1-2 săptămâni |
| Profil Public SEO | 🔥🔥🔥 | 🔧🔧 | ⭐⭐⭐⭐⭐ | 1-2 săptămâni |
| Analytics Dashboard | 🔥🔥 | 🔧🔧 | ⭐⭐⭐⭐ | 2 săptămâni |
| Stripe Integration | 🔥🔥🔥🔥 | 🔧🔧🔧 | ⭐⭐⭐⭐ | 2-3 săptămâni |
| Verificare Companii | 🔥🔥 | 🔧🔧 | ⭐⭐⭐ | 1 săptămână |
| Push Notifications | 🔥🔥 | 🔧🔧🔧 | ⭐⭐⭐ | 2-3 săptămâni |
| AI Price Estimator | 🔥🔥 | 🔧🔧🔧 | ⭐⭐⭐ | 2-4 săptămâni |
| Marketplace | 🔥 | 🔧🔧🔧 | ⭐⭐ | 4+ săptămâni |
| Calendar Booking | 🔥 | 🔧🔧 | ⭐⭐ | 2 săptămâni |
| Referral Program | 🔥🔥 | 🔧 | ⭐⭐ | 1 săptămână |
| Blog/SEO Content | 🔥🔥 | 🔧 | ⭐⭐ | Ongoing |
| Licitație Inversă | 🔥 | 🔧🔧🔧 | ⭐ | 3-4 săptămâni |
| App Mobilă | 🔥🔥 | 🔧🔧🔧🔧 | ⭐ | 6-8 săptămâni |
| Google Maps | 🔥 | 🔧🔧 | ⭐ | 1 săptămână |

Legend:
- 🔥 = Impact (1-4 flames)
- 🔧 = Effort (1-4 wrenches)
- ⭐ = Priority (1-5 stars)

---

## 🎯 RECOMANDARE: Sprint-uri de 2 Săptămâni

### Sprint 1-2: Foundation Boost
**Obiectiv:** Build trust + engagement
1. ✅ Review & Rating System
2. ✅ Profil Public cu SEO
3. ✅ Verificare Companii (simple)

**Rezultat așteptat:** +30% trust, +20% conversii

---

### Sprint 3-4: Communication
**Obiectiv:** Reduce friction în comunicare
1. ✅ Chat Real-time
2. ✅ Push Notifications (basic)
3. ✅ Dashboard Analytics (v1)

**Rezultat așteptat:** -50% timp până la accept, +25% engagement

---

### Sprint 5-6: Monetization
**Obiectiv:** Generate revenue
1. ✅ Stripe Integration
2. ✅ Subscription Plans (Basic/Pro)
3. ✅ Analytics Premium (upsell)

**Rezultat așteptat:** First revenue stream 💰

---

### Sprint 7-8: Intelligence
**Obiectiv:** Wow factor + automation
1. ✅ AI Price Estimator
2. ✅ Calendar Booking
3. ✅ Google Maps Integration

**Rezultat așteptat:** Better UX, lower support load

---

### Sprint 9+: Growth
**Obiectiv:** Scale și optimize
1. ✅ Referral Program
2. ✅ Blog SEO Content
3. ✅ Mobile App (if budget permits)

---

## 💰 COST ESTIMAT pentru Prioritare Înaltă

| Feature | Dev Time | Est. Cost* | ROI |
|---------|----------|-----------|-----|
| Reviews & Rating | 12-16h | €400-600 | ⭐⭐⭐⭐⭐ |
| Chat Real-time | 20-24h | €700-900 | ⭐⭐⭐⭐⭐ |
| Profil Public SEO | 10-14h | €350-500 | ⭐⭐⭐⭐⭐ |
| Analytics Dashboard | 16-20h | €550-750 | ⭐⭐⭐⭐ |
| Stripe Integration | 20-28h | €700-1000 | ⭐⭐⭐⭐⭐ |

*Presupunând €35-40/h dev rate

---

## 🎬 CE ÎNCEPEM ACUM?

**Recomandarea mea:**

🥇 **START CU:** Reviews & Rating System
- High impact
- Moderate effort  
- Foundation pentru trust
- Necesară înainte de Stripe (companii vor plăti doar dacă văd valoare)

🥈 **POI:** Profil Public cu SEO
- Piggyback pe reviews
- SEO boost
- Shareable links

🥉 **APOI:** Chat Real-time
- Completează ecosistemul de comunicare
- Pregătește terenul pentru push notifications

---

**Vrei să încep cu implementarea Reviews & Rating System? Sau preferi alta din listă?** 

Pot detalia orice feature cu arhitectură exactă, API endpoints, UI components, și estimare precisă de timp. 🚀
