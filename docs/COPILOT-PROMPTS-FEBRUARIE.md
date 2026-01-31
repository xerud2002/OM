# 🤖 VS Code Copilot Prompts - Plan Februarie 2026

> **Cum să folosești:** Copy-paste promptul în VS Code Copilot Chat (@workspace) pentru fiecare task.  
> **Format:** Fiecare prompt este self-contained și poate fi folosit independent.

---

## 📅 ZI 1 - Quick Wins Tehnice

### Task 1.1: Telefon în Navbar

```
Adaugă un link de telefon (+40740123456) în componenta Navbar.tsx din folderul components/layout/. 

Vreau:
- Icon PhoneIcon din @heroicons/react/24/outline
- Link cu href="tel:+40740123456"
- Design consistent cu navbar-ul actual
- Responsive pe mobile (icon mai mare, text optional)
- Poziție: Top-right, lângă alte call-to-actions

Show me the complete updated Navbar.tsx code.
```

### Task 1.2: Telefon în Footer

```
Adaugă telefon și email în Footer.tsx (components/layout/).

Cerințe:
- Secțiune "Contact" cu icon pentru telefon și email
- Telefon: +40 740 123 456 (formatat frumos)
- Email: contact@ofertemutare.ro
- Icons: PhoneIcon și EnvelopeIcon din @heroicons/react/24/outline
- Styling consistent cu footer-ul existent (culori emerald/sky)

Generate the updated Footer.tsx code.
```

### Task 1.3: Adresă completă în Footer

```
Adaugă adresa completă a firmei în Footer.tsx folosind HTML semantic tags.

Cerințe:
- Folosește tag <address> cu itemProp="address" pentru schema.org
- Format: "Str. [Nume Strada], Nr. [X], București, Sector [Y], [Cod Poștal]"
- Include: PostalAddress schema markup (streetAddress, addressLocality, postalCode, addressCountry: "RO")
- Design: Same styling ca secțiunea Contact din footer

Show me the address section code to add to Footer.tsx.
```

### Task 1.4: NAP Consistency Audit

```
Caută în întreg workspace-ul toate mențiunile de telefon, adresă sau nume firmă.

Folosește search (Ctrl+Shift+F) pentru:
- Patterns: "07", "+40", "telefon", "București", "adres", "OferteMutare"
- Include: toate fișierele .tsx, .ts, .md
- Exclude: node_modules, .next

Apoi creează un document docs/NAP-consistency.md cu:
- Format oficial NAP (Name, Address, Phone)
- Lista tuturor locațiilor unde apare
- Care trebuie updatate pentru consistency 100%

Generate the NAP audit report.
```

---

## 📅 ZI 2 - Schema Markup + Maps

### Task 2.1: LocalBusinessSchema Component

```
Creează un nou component TypeScript pentru schema.org LocalBusiness structured data.

File: components/seo/LocalBusinessSchema.tsx

Requirements:
- Type: "MovingCompany" (subtype of LocalBusiness)
- Fields necesare: name, telephone, address (full PostalAddress), geo (latitude/longitude București), priceRange ("€€"), openingHours
- Return: <script type="application/ld+json"> cu JSON-LD
- TypeScript props: optional customization

Generate complete LocalBusinessSchema.tsx component.
```

### Task 2.2: Implementare Schema pe Homepage

```
Integrează LocalBusinessSchema component în pages/index.tsx.

Steps:
1. Import LocalBusinessSchema from @/components/seo/LocalBusinessSchema
2. Add component în <Head> section (Next.js Head)
3. Pass props: business name, phone, address din constants.ts (dacă există)

Show me the updated index.tsx with schema integration.
```

### Task 2.3: Google Maps Embed

```
Adaugă un Google Maps iframe embed în pagina de contact (pages/contact.tsx).

Cerințe:
- Location: București (folosește adresa din footer)
- Iframe: width="100%" height="400px" 
- Styling: border-radius: 8px, shadow, responsive container
- Accessibility: title attribute pentru iframe
- Section: După contact form, înainte de footer

Generate the Maps embed section code for contact.tsx.
```

---

## 📅 ZI 3 - Analytics Setup

### Task 3.1: Google Analytics Audit

```
Verifică și optimizează implementarea Google Analytics 4 în aplicație.

Check:
1. Există variabila NEXT_PUBLIC_GA_ID în .env?
2. Tag-ul GA4 este implementat în pages/_app.tsx?
3. Custom events: Vrem tracking pentru:
   - request_form_submit (când user trimite request)
   - offer_view (când customer vede ofertă)
   - phone_click (click pe număr telefon)
   - calculator_use (folosire calculator prețuri)

Show me:
- Current GA4 implementation în _app.tsx
- How to add custom events în components relevante
- Testing approach pentru DebugView
```

### Task 3.2: Google Search Console Setup Documentation

```
Creează un document docs/analytics-setup.md cu ghid pentru configurarea GSC.

Include:
1. Steps pentru adding property în search.google.com/search-console
2. Verification methods (via GA4 tag recomandat)
3. Submitting sitemap (/sitemap.xml)
4. Ce metrics să monitorizăm (impressions, clicks, CTR, position)
5. Setup alerts pentru index coverage errors

Generate complete documentation în format Markdown.
```

---

## 📅 ZI 4 - Content Planning

### Task 4.1: Editorial Calendar JSON

```
Creează un fișier JSON cu calendar editorial pentru 30 articole.

File: data/editorial-calendar-q1-2026.json

Structure pentru fiecare articol:
{
  "id": 1,
  "title": "Ghid Complet Mutare București 2026",
  "slug": "ghid-mutare-bucuresti-2026",
  "keywords": ["mutare bucuresti", "ghid mutare", "servicii mutari bucuresti"],
  "wordCount": 2500,
  "status": "draft",
  "publishDate": "2026-03-03",
  "category": "ghid"
}

Topics din SEO strategy:
- 10 ghiduri comprehensive (2.500w)
- 15 tips & how-to (1.500w)
- 5 FAQ-based articles (1.000w)

Generate complete JSON cu toate 30 articolele planificate.
```

### Task 4.2: FAQ Extension în faqData.ts

```
Extinde fișierul data/faqData.ts cu +35 întrebări noi despre mutări.

Categorii pentru noi FAQ:
1. Prețuri (10 FAQ): Costuri, tarife, plată, hidden costs, etc.
2. Timing (8 FAQ): Când să mut, cât durează, best season, notice period
3. Siguranță (7 FAQ): Asigurare, deteriorare, răspundere, claims
4. DIY (10 FAQ): Singur vs firmă, tips DIY, când să angajez profesioniști

Format pentru fiecare FAQ:
{
  question: "Întrebare în română?",
  answer: "Răspuns detaliat 100-150 cuvinte",
  category: "preturi" | "timing" | "siguranta" | "diy",
  keywords: ["keyword1", "keyword2"]
}

Generate complete extension pentru faqData.ts cu cele 35 FAQ noi.
```

### Task 4.3: Routes Planning CSV

```
Creează un fișier CSV cu planificarea pentru 40 rute oraș-oraș.

File: data/routes-planning.csv

Columns:
- from_city: Oraș plecare
- to_city: Oraș destinație  
- distance_km: Distanță în km
- duration_hours: Durata estimată
- priority: 1-5 (1 = highest volume)

Include cele mai populare rute:
- București ↔ Cluj-Napoca
- București ↔ Timișoara
- București ↔ Iași
- Cluj ↔ Timișoara
- București ↔ Brașov
- etc (40 perechi total, include reverse routes)

Generate complete CSV content.
```

---

## 📅 ZI 5-13 - CONTENT WRITING

### Prompt General pentru Fiecare Articol:

```
Scrie un articol SEO-optimized despre [TOPIC] pentru site-ul OferteMutare.ro (servicii mutări în România).

Details:
- Title: "[TITLU EXACT]"
- Word count: [X] cuvinte
- Target keywords: [keyword1, keyword2, keyword3]
- File: content/articles/[slug].md

Structure:
1. Intro (150w): Hook + problem + what reader will learn
2. H2 Sections (4-6 secțiuni): Main content detailed
3. FAQ Section (5 întrebări): Schema.org format
4. Conclusion (100w): Summary + CTA către request form

Requirements:
- Ton: Professional dar prietenos, în română
- SEO: Keywords natural integration, NOT keyword stuffing
- Internal links: Include 5+ links către /mutari/bucuresti, /calculator, /servicii, alte articole
- Images: Suggest 3-4 image placements cu alt text
- Meta: Generate title (55-60 chars) și description (150-160 chars)

Generate complete article content în format Markdown.
```

**Exemplu specific pentru Articol #1:**

```
Scrie articol SEO despre mutări în București pentru site OferteMutare.ro.

Details:
- Title: "Ghid Complet Mutare București 2026: Prețuri, Firme și Tips"
- Word count: 2.500 cuvinte
- Keywords: "mutare bucuresti", "ghid mutare bucuresti", "servicii mutari bucuresti", "pret mutare bucuresti"
- File: content/articles/ghid-mutare-bucuresti-2026.md

Structure:
1. Intro: De ce București e special pentru mutări, challenges (trafic, lifturi, accesibilitate)
2. Secțiune Costuri: Breakdown prețuri by apartment size (studio, 2cam, 3cam+, casă)
3. Cum să alegi firma: Red flags, what to check, reviews
4. Timeline: Best timing (evita 1-5 a lunii, weekend-uri aglomerate)
5. Checklist mutare: Pas cu pas cu 2 luni înainte până ziua mutării
6. FAQ (5): Cât costă? Cât durează? Când rezerv? Ce include? DIY sau firmă?
7. Conclusion: CTA request quote + link către calculator

Generate articol complet în Markdown cu toate secțiunile.
```

---

## 📅 ZI 15 - Route Template + Generation

### Task 15.1: City Route Template Component

```
Creează un template component pentru pagini rută oraș-oraș.

File: components/routes/CityRouteTemplate.tsx

Props interface:
- fromCity: string (e.g., "București")
- toCity: string (e.g., "Cluj-Napoca")
- distanceKm: number
- durationHours: number
- priceBase: number
- keywords: string[]
- customFaq: Array<{question, answer}>

Sections în component:
1. Hero: "{fromCity} → {toCity}" cu distance/duration badges
2. Price Calculator: Form simplu cu date mutare → estimate
3. Timeline: Cât durează total (packing + transport + unpacking)
4. Route Details: Highways, stops, logistics specifice
5. FAQ Section: 5 custom întrebări pentru ruta specifică
6. CTA: Request quote button

Include:
- BreadcrumbList schema (Home → Mutări → {fromCity} → {toCity})
- LocalBusiness schema inherited
- Dynamic meta tags based pe cities

Generate complete CityRouteTemplate.tsx component.
```

### Task 15.2: Routes Generation Script

```
Creează un Node.js script pentru generarea automată a 40 pagini rută.

File: scripts/generate-routes.js

Input: data/routes.json (array cu toate rutele)

Output: Generate pages/mutari/[from-city]-[to-city].tsx pentru fiecare rută

Script logic:
1. Read routes.json
2. Pentru fiecare rută:
   - Generate slug: bucuresti-cluj-napoca
   - Create file în pages/mutari/
   - Import CityRouteTemplate
   - Pass props din routes.json
   - Export page cu getStaticProps pentru SEO
3. Log progress: "Generated 40/40 routes ✓"

Requirements:
- Slug normalization (remove diacritics: București → bucuresti)
- Validate: no duplicate slugs
- Dry-run mode: --dry-run flag pentru testing

Generate complete generation script cu error handling.
```

---

## 📅 ZI 17-20 - Backlinks Outreach

### Task 17.1: Backlinks Prospect Spreadsheet

```
Creează un template CSV pentru tracking backlinks outreach.

File: docs/backlinks-prospects.csv

Columns:
- id: Sequential number
- domain: Website URL
- domain_rating: DR din Ahrefs (0-100)
- type: "directory" | "guest_post" | "resource_page" | "broken_link" | "partnership"
- contact_email: Email for outreach
- contact_name: Person name (dacă știm)
- pitch_angle: Quick note despre cum să abordăm
- status: "prospect" | "outreach_sent" | "follow_up_sent" | "positive_reply" | "link_live" | "declined" | "no_response"
- outreach_date: YYYY-MM-DD
- notes: Any additional info

Generate CSV header și 5 exemple de prospects pentru mutări/transport niche în România.
```

### Task 18.1: Guest Post Pitch Email Template

```
Creează un email template personalizat pentru guest post pitches către bloguri românești.

File: templates/guest-post-pitch.md

Template requirements:
- Subject line: Catchy dar profesional
- Personalization fields: [FIRST_NAME], [BLOG_NAME], [SPECIFIC_ARTICLE_TITLE]
- Intro: Quick intro about me + de ce contact
- Value prop: Offer free 1.500w quality article pe topic relevant audience-ului lor
- Examples: Link către 2-3 best articole pe site-ul meu (demonstrate quality)
- Ask: Ce sunt guidelines-urile lor? Topics preferați?
- Closing: Prietenos, not pushy
- Signature: Name, title, website, email

Language: Română, profesional dar friendly tone.

Generate complete email template.
```

---

## 📅 ZI 22 - Schema Expansion

### Task 22.1: FAQPage Schema Component

```
Creează component pentru FAQPage schema.org structured data.

File: components/seo/FAQPageSchema.tsx

Props:
- faqs: Array<{question: string, answer: string}>

Logic:
- Import faqData.ts (all 72 FAQ)
- Generate JSON-LD cu schema.org FAQPage type
- Fiecare FAQ ca Question/Answer pair
- acceptedAnswer cu text field

Usage:
- Add în pages/intrebari-frecvente.tsx pentru featured snippets eligibility

Generate complete FAQPageSchema.tsx component cu TypeScript types.
```

### Task 22.2: BreadcrumbList Schema Global

```
Creează un component global pentru breadcrumb schema pe toate paginile.

File: components/seo/BreadcrumbSchema.tsx

Props:
- path: string (URL path, e.g., "/mutari/bucuresti-cluj")

Logic:
- Parse path în segments
- Generate BreadcrumbList schema
- Position index pentru fiecare item
- Exemple:
  * Home → Articole → [Article Title]
  * Home → Mutări → București → Cluj-Napoca
  * Home → Servicii → [Service Name]

Integration:
- Add în components/layout/Layout.tsx (use useRouter hook pentru current path)

Generate complete BreadcrumbSchema.tsx cu dynamic path parsing.
```

### Task 22.3: Article Schema pentru Blog Posts

```
Creează component pentru Article schema (BlogPosting type).

File: components/seo/ArticleSchema.tsx

Props:
- title: string
- description: string
- author: string
- datePublished: string (ISO format)
- dateModified: string
- image: string (featured image URL)
- wordCount: number

Schema fields:
- @type: "BlogPosting"
- headline, description, author (Person type), datePublished, dateModified
- image (ImageObject), wordCount
- publisher: Organization (OferteMutare.ro details)

Generate complete ArticleSchema.tsx component.
```

---

## 📅 ZI 23 - Sitemap & Robots

### Task 23.1: Next.js Sitemap Enhancement

```
Optimizează generarea sitemap.xml pentru a include toate articolele și rutele.

Check current implementation și update pentru:

Include în sitemap:
- Homepage: priority 1.0, changefreq 'weekly'
- Articole (30): priority 0.8, changefreq 'monthly'
- Rute (40): priority 0.7, changefreq 'yearly'
- Servicii pages: priority 0.9, changefreq 'monthly'
- Static pages (about, contact, faq): priority 0.6, changefreq 'yearly'

Exclude:
- /api/* routes
- /admin/* routes (dacă există)
- /_next/* (technical)

lastmod: Current date pentru pages, actual modification date pentru articles

Show me:
- Current sitemap generation code (probabil în pages/sitemap.xml.ts sau next-sitemap.config.js)
- Updated configuration pentru complete coverage

Generate updated sitemap generation logic.
```

### Task 23.2: Robots.txt Optimization

```
Optimizează public/robots.txt pentru proper crawling.

Current file: Check public/robots.txt (dacă există)

New content requirements:
- User-agent: * (allow all bots)
- Allow: / (toate paginile publice)
- Disallow: /api/ (API routes)
- Disallow: /admin/ (dacă există)
- Disallow: /_next/ (Next.js technical)
- Sitemap: https://ofertemutare.ro/sitemap.xml (absolute URL)

Optional:
- User-agent: GPTBot → consider dacă vrem AI crawling
- Crawl-delay: Doar dacă avem probleme server load

Generate optimized robots.txt content.
```

---

## 📅 ZI 24 - Internal Linking

### Task 24.1: Related Articles Component

```
Creează un component "Articole Similare" pentru end of articles.

File: components/articles/RelatedArticles.tsx

Props:
- currentArticleKeywords: string[]
- currentArticleId: string (exclude din suggestions)

Logic:
1. Load all articles from editorial calendar
2. Calculate similarity score: Count keyword overlaps
3. Sort by similarity, take top 4
4. Display în card grid (2x2 on desktop, 1 col mobile)

Card content pentru fiecare:
- Featured image thumbnail
- Title
- Short excerpt (100 chars)
- Read time badge
- Link către article

Styling: Consistent cu existing cards (emerald/sky theme)

Generate complete RelatedArticles.tsx component cu keyword matching logic.
```

### Task 24.2: Orphan Pages Detection Script

```
Creează un Node.js script pentru detectarea paginilor fără internal links (orphan pages).

File: scripts/check-orphan-pages.js

Logic:
1. Crawl toate fișierele .tsx în pages/ și components/
2. Extract toate link-urile (<Link>, <a href>)
3. Build graph: page → links to pages
4. Identify pages cu 0 incoming links (except homepage)
5. Report:
   - Total pages: X
   - Orphan pages: Y
   - List: Each orphan page cu suggestion pentru where to link from

Output: Console log + docs/orphan-pages-report.md

Run: node scripts/check-orphan-pages.js

Generate complete orphan detection script.
```

---

## 📅 ZI 26 - Meta Tags Polish

### Task 26.1: Meta Tags Audit Spreadsheet

```
Creează un script pentru audit complet meta tags pe toate paginile.

File: scripts/audit-meta-tags.js

Pentru fiecare page în pages/:
1. Extract meta title și description
2. Check:
   - Title length: 55-60 chars (warn dacă <50 sau >65)
   - Description length: 150-160 chars (warn dacă <140 sau >170)
   - Unique? (check duplicates)
   - Keywords present? (basic check)
3. Output CSV: docs/meta-tags-audit.csv

Columns:
- page_path
- current_title (length)
- current_description (length)
- issues (array: "too_short", "too_long", "duplicate", "missing_keywords")
- priority (high/medium/low based pe page importance)

Generate script pentru automatic meta audit.
```

### Task 26.2: SEOHead Component Creation

```
Creează un component reusable pentru SEO meta tags.

File: components/seo/SEOHead.tsx

Props:
- title: string
- description: string
- keywords?: string[]
- ogImage?: string (URL)
- ogType?: "website" | "article"
- canonicalUrl: string
- author?: string
- publishDate?: string (pentru articles)

Generate toate tags:
- <title>
- <meta name="description">
- <meta name="keywords"> (comma-separated)
- Open Graph: og:title, og:description, og:image, og:type, og:url
- Twitter Card: twitter:card, twitter:title, twitter:description, twitter:image
- <link rel="canonical">
- Schema.org: Author și datePublished (dacă article)

Usage: Import în fiecare page, pass props

Generate complete SEOHead.tsx component cu toate meta tags.
```

### Task 26.3: Bulk Alt Text Addition

```
Caută toate imaginile în project fără alt text și generează suggestions.

Search pattern:
- Find: <img (fără alt attribute)
- Include: components/, pages/, content/
- Exclude: node_modules, .next, public/

Pentru fiecare imagine găsită:
1. Note file path și context
2. Analyze: Ce reprezintă (based pe filename, surrounding text)
3. Generate alt text: Descriptive, include keywords când natural

Output: docs/images-alt-text-suggestions.md

Format:
```markdown
## File: components/Hero.tsx
- Line 45: `<img src="/hero-moving-truck.jpg">`
- Suggested alt: "Camion mutări profesional București - echipă OferteMutare.ro"
```

Generate complete image audit cu alt text suggestions.
```

---

## 📅 ZI 27 - Publishing Schedule (CRITICAL!)

### Task 27.1: Content Publishing Calendar

```
Creează un document detaliat cu scheduling pentru publicarea celor 30 articole în perioada Martie-Iunie 2026.

File: docs/content-publishing-schedule.md

Structure:

1. STRATEGIE:
   - Rhythm: 2 articole/săptămână (Marți 10:00 + Vineri 10:00)
   - Total: 15 săptămâni pentru 30 articole
   - Start: 3 Martie 2026
   - End: 13 Iunie 2026

2. PRIORITIZATION:
   - Analyze: Search volume pentru primary keywords (hypothetical data OK)
   - Order: High-volume keywords first
   - Front-load: Best articles în Martie pentru early wins

3. CALENDAR TABLE:
   | Week | Date (Marți) | Article #X | Title | Primary Keyword | Date (Vineri) | Article #Y | Title | Primary Keyword |
   
4. PUBLISHING CHECKLIST:
   - [ ] Final proofread
   - [ ] Meta tags verify (title, description)
   - [ ] Featured image check
   - [ ] Internal links validate
   - [ ] Schema present
   - [ ] Move from DRAFT → LIVE
   - [ ] Submit URL to GSC for indexing
   - [ ] Share on social (optional)

5. AUTOMATION IDEAS:
   - Google Calendar reminders
   - Trello board cu due dates
   - Future: Build CMS cu auto-publish

Generate complete publishing schedule document cu toate 30 articolele assignate la dates specifice.
```

---

## 📅 ZI 28 - Final Review

### Task 28.1: February 2026 Complete Metrics Report

```
Creează un comprehensive report cu toate achievements din Februarie.

File: docs/FEBRUARY-2026-COMPLETE-REVIEW.md

Sections:

1. OVERVIEW:
   - Dates: 1-28 Februarie 2026
   - Total time invested: ~180 ore
   - Faze complete: FAZA 1 (8/8 tasks)

2. DELIVERABLES:
   - ✅ Content: 30 articole (55.000 cuvinte)
   - ✅ Rute: 40 pagini generated
   - ✅ FAQ: +35 extended (72 total)
   - ✅ Backlinks: 45 outreach, estimate 12-18 live
   - ✅ Schema: 4 types implemented (LocalBusiness, FAQPage, Breadcrumb, Article)
   - ✅ Internal links: 300+ optimized
   - ✅ GBP: Verified & complete
   - ✅ Analytics: GSC, GA4, Ahrefs setup

3. BASELINE METRICS (save pentru comparison):
   - GSC: Impressions, clicks, CTR, avg position
   - GA4: Users, sessions, bounce rate
   - Ahrefs: Rankings pentru 50 keywords, backlinks count
   - Site: Total pages, indexed pages

4. MARCH 2026 PLAN:
   - Publish 8 articole (weeks 1-4)
   - Monitor rankings weekly
   - Respond backlinks opportunities
   - GBP posts 2/week
   - Start FAZA 2 prep

5. LEARNINGS & NOTES:
   - Ce a mers bine?
   - Ce challenges?
   - Ce optimize pentru next month?

Generate complete comprehensive review document.
```

---

## 🎯 PROMPTURI GENERALE UTILE

### Debug Build Errors

```
Am erori la `npm run build`. Analizează eroarea și sugerează fix.

Error output:
[PASTE ERROR HERE]

Check:
1. TypeScript errors în components/pages
2. Import paths corecte?
3. Missing dependencies în package.json?
4. Next.js configuration issues?

Provide step-by-step solution.
```

### Optimize Performance

```
Analizează performance-ul aplicației și sugerează optimizări.

Focus areas:
1. Image optimization: Folosim next/image optimal?
2. Code splitting: Lazy loading components?
3. Bundle size: Analyze cu `npm run build` output
4. LCP, FID, CLS metrics: Verifică Web Vitals

Priority: Core Web Vitals pentru SEO.

Generate optimization plan cu implementare steps.
```

### Responsive Design Check

```
Verifică responsive design pentru [COMPONENT/PAGE].

Test breakpoints:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

Issues să caut:
- Text overflow
- Images sizing
- Navigation collapse
- Form inputs usability
- CTA buttons visibility

Suggest CSS/Tailwind fixes pentru any issues found.
```

### Accessibility Audit

```
Audit accessibility pentru [COMPONENT/PAGE].

Check:
1. Semantic HTML (header, nav, main, footer, article, etc.)
2. ARIA labels unde necesar
3. Keyboard navigation (tab order, focus states)
4. Color contrast (WCAG AA minimum)
5. Alt text pe toate images
6. Form labels și error messages
7. Screen reader compatibility

Generate list of issues + fixes pentru WCAG 2.1 AA compliance.
```

---

## 💡 TIPS pentru Folosirea Prompturilor

### 1. **Context is King**
Începe promptul cu context:
```
În aplicația Next.js 14 + TypeScript + Firebase (OferteMutare.ro), vreau să...
```

### 2. **Specificity Wins**
Bad: "Adaugă un component"
Good: "Creează component Hero.tsx în components/home/ cu props: title, subtitle, ctaText, ctaLink"

### 3. **Show Examples**
Include exemple de code existent sau desired output:
```
Vreau styling similar cu componenta ExistingCard.tsx, dar adaptat pentru...
```

### 4. **Request Complete Code**
End cu: "Generate complete code, not pseudocode" sau "Show me the full implementation"

### 5. **Iterate Based on Results**
Dacă first attempt nu e perfect:
```
Good start! Acum optimizează pentru:
- [Issue 1]
- [Issue 2]
Show updated code.
```

---

## 📚 RESURSE UTILE

### VS Code Copilot Commands:
- `@workspace` - Query entire codebase
- `/explain` - Explain selected code
- `/fix` - Suggest fixes for errors
- `/tests` - Generate tests pentru code
- `/doc` - Generate documentation

### Keyboard Shortcuts:
- `Ctrl+I` - Inline Copilot suggestions
- `Ctrl+Shift+I` - Open Copilot Chat
- `Alt+\` - Trigger Copilot inline
- `Ctrl+Enter` - Accept suggestion

---

**🎯 PRO TIP:** Salvează acest fișier și keep it open într-un tab VS Code. Copy-paste prompturile direct când ajungi la fiecare task în planul de implementare!

**Good luck cu implementarea! 🚀**
