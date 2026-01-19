import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import { HelpCircle, Check, MapPin, Building2 } from "lucide-react";
import { ReactNode } from "react";

// Type for FAQ with JSX support
type FAQItem = {
  q: string;
  a: ReactNode;
  aText?: string; // Plain text version for Schema.org
};

type FAQCategory = {
  category: string;
  questions: FAQItem[];
};

export default function FAQPage() {
  const faqs: FAQCategory[] = [
    {
      category: "General",
      questions: [
        {
          q: "Ce este OferteMutare.ro?",
          a: (
            <>
              OferteMutare.ro este o platformă gratuită care conectează clienții cu firme de mutări
              verificate din România. Completezi un singur formular și primești 3-5 oferte
              personalizate în 24 ore. Acoperim toate orașele majore (
              <Link
                href="/mutari/bucuresti"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                București
              </Link>
              ,{" "}
              <Link
                href="/mutari/cluj-napoca"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                Cluj-Napoca
              </Link>
              ,{" "}
              <Link
                href="/mutari/timisoara"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                Timișoara
              </Link>
              ,{" "}
              <Link
                href="/mutari/iasi"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                Iași
              </Link>
              ,{" "}
              <Link
                href="/mutari/constanta"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                Constanța
              </Link>
              ,{" "}
              <Link
                href="/mutari/brasov"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                Brașov
              </Link>
              ) și peste 30 de reședințe de județ.
            </>
          ),
          aText:
            "OferteMutare.ro este o platformă gratuită care conectează clienții cu firme de mutări verificate din România. Completezi un singur formular și primești 3-5 oferte personalizate în 24 ore. Acoperim toate orașele majore (București, Cluj-Napoca, Timișoara, Iași, Constanța, Brașov, Galați, Craiova, Ploiești, Oradea) și peste 30 de reședințe de județ.",
        },
        {
          q: "Serviciul este cu adevărat gratuit?",
          a: "Da, 100% gratuit pentru clienți! Nu există costuri ascunse. Firmele de mutări plătesc un comision mic, astfel platforma rămâne gratuită pentru utilizatori.",
        },
        {
          q: "Câte oferte voi primi?",
          a: "De obicei primești între 3-5 oferte de la firme verificate în termen de 24 ore. Numărul depinde de disponibilitatea firmelor în zona ta și complexitatea mutării.",
        },
        {
          q: "Sunt obligat să aleg una din oferte?",
          a: "Nu, nu există nicio obligație! Poți compara ofertele primite și alegi doar dacă găsești ceva potrivit. Dacă nicio ofertă nu te mulțumește, nu ești obligat să accepți.",
        },
      ],
    },
    {
      category: "Procesul de Solicitare",
      questions: [
        {
          q: "Cum funcționează procesul?",
          a: (
            <>
              1) Completezi{" "}
              <Link href="/" className="text-emerald-600 underline hover:text-emerald-700">
                formularul
              </Link>{" "}
              cu detalii despre mutare (5 minute), 2) Firmele verificate primesc cererea ta, 3)
              Primești 3-5 oferte în 24h, 4) Compari și alegi oferta potrivită, 5) Confirmarea
              directă cu firma aleasă.
            </>
          ),
          aText:
            "1) Completezi formularul cu detalii despre mutare (5 minute), 2) Firmele verificate primesc cererea ta, 3) Primești 3-5 oferte în 24h, 4) Compari și alegi oferta potrivită, 5) Confirmarea directă cu firma aleasă.",
        },
        {
          q: "Ce informații trebuie să furnizez?",
          a: "Informații de bază: adresele de la și către (inclusiv cartierul/sectorul), numărul de camere, data dorită, servicii suplimentare (ambalare, demontare, etc.), și date de contact pentru a primi ofertele.",
        },
        {
          q: "Pot modifica cererea după ce am trimis-o?",
          a: (
            <>
              Da! După autentificare în{" "}
              <Link
                href="/customer/auth"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                contul de client
              </Link>
              , poți edita detaliile cererii, adăuga/șterge fotografii sau anula cererea complet
              dacă planurile s-au schimbat.
            </>
          ),
          aText:
            "Da! După autentificare în contul de client, poți edita detaliile cererii, adăuga/șterge fotografii sau anula cererea complet dacă planurile s-au schimbat.",
        },
        {
          q: "Cât timp durează până primesc ofertele?",
          a: "Majoritatea clienților primesc prima ofertă în câteva ore. Toate ofertele sosesc de obicei în 24 ore. În perioade aglomerate (weekenduri, sfârșitul lunii) poate dura până la 48h.",
        },
      ],
    },
    {
      category: "Acoperire Geografică",
      questions: [
        {
          q: "În ce orașe operați?",
          a: (
            <>
              Oferim servicii în toată România! Vezi{" "}
              <Link href="/mutari" className="text-emerald-600 underline hover:text-emerald-700">
                toate orașele acoperite
              </Link>
              : București, Cluj-Napoca, Timișoara, Iași, Constanța, Brașov, Galați, Craiova,
              Ploiești, Oradea, Brăila, Arad, Pitești, Sibiu, Bacău, Târgu-Mureș, Baia Mare, Buzău,
              Botoșani, Satu Mare, Suceava, Piatra-Neamț, Drobeta-Turnu Severin, Târgoviște,
              Focșani, Tulcea, și multe alte orașe.
            </>
          ),
          aText:
            "Oferim servicii în toată România! Orașe majore acoperite: București (toate sectoarele), Cluj-Napoca (Mănăștur, Zorilor, Gheorgheni), Timișoara (Circumvalațiunii, Fabric), Iași (Tatarași, Copou), Constanța (Mamaia, Tomis), Brașov (Tractorul, Noua), Galați, Craiova, Ploiești, Oradea, Brăila, Arad, Pitești, Sibiu, Bacău, Târgu-Mureș, Baia Mare, Buzău, Botoșani, Satu Mare, Suceava, Piatra-Neamț, Drobeta-Turnu Severin, Târgoviște, Focșani, Tulcea, și multe alte orașe.",
        },
        {
          q: "Aveți firme verificate în orașele mici sau comune?",
          a: "Da! Lucrăm cu firme care acoperă și localități mici. Fie că te muți din/în comune din jur (Voluntari, Pipera, Popești-Leordeni, Otopeni, Bragadiru, Pantelimon, Magurele pentru București sau Florești, Apahida, Gilău pentru Cluj), firmele noastre au experiență în mutări inter-județe și din/în localități rurale.",
        },
        {
          q: "Organizați mutări între orașe diferite?",
          a: "Absolut! Mutările inter-urbane sunt specializarea noastră: București-Cluj, București-Iași, Timișoara-București, Cluj-Brașov, Constanța-București, și orice altă combinație între orașe din România. Ofertele includ kilometraj, timp de transport și costuri de drum.",
        },
        {
          q: "Există zone unde nu puteți ajunge?",
          a: "Acoperim 99% din România. Pentru zone foarte izolate (munți, cătune accesibile doar cu drumuri forestiere), te rugăm să menționezi detaliile în formular și vom găsi o firmă specializată cu echipament adecvat.",
        },
      ],
    },
    {
      category: "Firmele de Mutări",
      questions: [
        {
          q: "Cum sunt verificate firmele?",
          a: "Verificăm: CUI valid și firmă activă, asigurare de răspundere civilă, recenzii de la clienți reali, experiență în domeniu (minim 1 an), echipament profesional și personal specializat.",
        },
        {
          q: "Ce fac dacă am probleme cu o firmă?",
          a: (
            <>
              <Link href="/contact" className="text-emerald-600 underline hover:text-emerald-700">
                Contactează-ne
              </Link>{" "}
              imediat la contact@ofertemutare.ro. Investigăm toate reclamațiile și, dacă firma nu
              respectă standardele, este exclusă de pe platformă. De asemenea, poți lăsa o recenzie
              după mutare.
            </>
          ),
          aText:
            "Contactează-ne imediat la contact@ofertemutare.ro. Investigăm toate reclamațiile și, dacă firma nu respectă standardele, este exclusă de pe platformă. De asemenea, poți lăsa o recenzie după mutare.",
        },
        {
          q: "Pot vedea recenzii despre firme înainte să aleg?",
          a: "Da! Fiecare ofertă include rating-ul și recenziile firmei. Poți citi experiențele altor clienți pentru a lua o decizie informată.",
        },
        {
          q: "Firmele oferă asigurare pentru bunuri?",
          a: "Da, firmele serioase oferă asigurare standard (50-100 lei/m³). Pentru obiecte valoroase (>5.000 lei), poți cere asigurare suplimentară. Verifică întotdeauna detaliile în contract.",
        },
      ],
    },
    {
      category: "Prețuri și Plata",
      questions: [
        {
          q: "Cât costă o mutare în România?",
          a: (
            <>
              Depinde de: distanță, volum, etaj, acces, servicii extra. Orientativ: garsonieră
              800-1.500 lei, 2 camere 1.500-2.500 lei, 3+ camere 2.500-4.500 lei, casă/vilă
              4.000-10.000+ lei. Folosește{" "}
              <Link
                href="/calculator"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                calculatorul nostru
              </Link>{" "}
              pentru o estimare rapidă.
            </>
          ),
          aText:
            "Depinde de: distanță, volum, etaj, acces, servicii extra. Orientativ: garsonieră 800-1.500 lei, 2 camere 1.500-2.500 lei, 3+ camere 2.500-4.500 lei, casă/vilă 4.000-10.000+ lei.",
        },
        {
          q: "Cum plătesc firma de mutări?",
          a: "Plata se face direct către firma aleasă, nu prin platformă. Majoritatea firmelor cer avans (20-30%) la rezervare și restul la finalizarea mutării. Metode acceptate: cash, transfer bancar, card.",
        },
        {
          q: "Pot negocia prețul din ofertă?",
          a: "Da! Prețurile nu sunt fixe. Poți negocia cu firmele, mai ales dacă ai oferte competitive de la mai multe companii. Firmele sunt adesea dispuse să reducă 5-10%.",
        },
        {
          q: "Ce costuri suplimentare pot apărea?",
          a: "Posibile costuri extra: etaje fără lift (50-100 lei/etaj), acces dificil (parcare departe), mutare weekend/sărbători (+15-20%), transport la gunoi, materiale ambalare suplimentare.",
        },
      ],
    },
    {
      category: "Ziua Mutării",
      questions: [
        {
          q: "Trebuie să fiu prezent în timpul mutării?",
          a: "Da, este recomandat să fii prezent la ambele locații pentru a coordona echipa, verifica încărcarea/descărcarea și semna procesul-verbal de predare-primire.",
        },
        {
          q: "Cât durează o mutare?",
          a: "Depinde de volum și distanță: garsonieră 2-4h, apartament 2 camere 4-6h, 3+ camere 6-10h, casă 8-16h. Include încărcare, transport și descărcare.",
        },
        {
          q: "Ce fac dacă apar deteriorări?",
          a: "Documentează imediat cu poze/video, nu semna procesul-verbal fără să menționezi daunele, contactează firma și asiguratorul lor. Păstrează factura și contractul pentru reclamații.",
        },
        {
          q: "Pot anula sau reprograma mutarea?",
          a: "Da, dar respectă termenele din contract. De obicei: anulare cu >7 zile = rambursare avans, 3-7 zile = 50% avans, <3 zile = pierdere avans. Reprogramarea de obicei e gratuită cu >48h avans.",
        },
      ],
    },
    {
      category: "Tipuri de Mutări și Servicii",
      questions: [
        {
          q: "Oferiți servicii de împachetare profesională?",
          a: (
            <>
              Da! Majoritatea firmelor oferă{" "}
              <Link
                href="/servicii/impachetare/profesionala"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                împachetare completă
              </Link>{" "}
              (materiale incluse): vesela, obiectele fragile, haine, cărți. Costă în plus 200-800
              lei funcție de volum. Vezi și{" "}
              <Link
                href="/servicii/impachetare/materiale"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                materialele disponibile
              </Link>
              .
            </>
          ),
          aText:
            "Da! Majoritatea firmelor oferă împachetare completă (materiale incluse): vesela, obiectele fragile, haine, cărți. Costă în plus 200-800 lei funcție de volum. Materialele (cutii, bubble wrap, folie) pot fi cumpărate separat.",
        },
        {
          q: "Puteți muta obiecte foarte grele (piane, trezoruri, seifuri)?",
          a: (
            <>
              Da, avem firme specializate în{" "}
              <Link
                href="/mutari/specializate/piane"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                mutări de piane
              </Link>{" "}
              și obiecte grele. Un pian vertical: +300-600 lei, pian cu coadă: +800-1.500 lei.
              Trebuie specificat în cerere pentru echipament special.
            </>
          ),
          aText:
            "Da, avem firme specializate în mutări de obiecte grele. Un pian vertical: +300-600 lei, pian cu coadă: +800-1.500 lei. Trebuie specificat în cerere pentru echipament special.",
        },
        {
          q: "Oferiți depozitare temporară?",
          a: (
            <>
              Da! Multe firme au{" "}
              <Link
                href="/servicii/depozitare"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                depozite proprii
              </Link>{" "}
              sau parteneriate. Costă 50-150 lei/zi pentru un apartament de 2 camere. Util dacă ai
              nevoie de câteva zile între mutări sau renovezi.
            </>
          ),
          aText:
            "Da! Multe firme au depozite proprii sau parteneriate. Costă 50-150 lei/zi pentru un apartament de 2 camere. Util dacă ai nevoie de câteva zile între mutări sau renovezi.",
        },
        {
          q: "Puteți muta și debarasa simultan?",
          a: (
            <>
              Da! Poți cere servicii de{" "}
              <Link
                href="/servicii/debarasare"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                debarasare
              </Link>{" "}
              (mobilier vechi, electronice, moloz) în același timp cu mutarea. Costă +200-800 lei
              funcție de cantitate și necesită mențiune în cerere.
            </>
          ),
          aText:
            "Da! Poți cere servicii de debarasare (mobilier vechi, electronice, moloz) în același timp cu mutarea. Costă +200-800 lei funcție de cantitate și necesită mențiune în cerere.",
        },
      ],
    },
    {
      category: "Cont și Date Personale",
      questions: [
        {
          q: "Trebuie să creez cont pentru a solicita oferte?",
          a: (
            <>
              Nu inițial! Poți completa{" "}
              <Link href="/" className="text-emerald-600 underline hover:text-emerald-700">
                formularul
              </Link>{" "}
              fără cont. După trimitere, vei primi un email pentru a-ți crea cont și a gestiona
              cererile și ofertele primite.
            </>
          ),
          aText:
            "Nu inițial! Poți completa formularul fără cont. După trimitere, vei primi un email pentru a-ți crea cont și a gestiona cererile și ofertele primite.",
        },
        {
          q: "Ce faceți cu datele mele personale?",
          a: (
            <>
              Le folosim doar pentru a-ți trimite oferte și a facilita comunicarea cu firmele. Nu
              vindem/partajăm datele cu terțe părți. Vezi{" "}
              <Link href="/privacy" className="text-emerald-600 underline hover:text-emerald-700">
                Politica de confidențialitate
              </Link>{" "}
              pentru detalii complete.
            </>
          ),
          aText:
            "Le folosim doar pentru a-ți trimite oferte și a facilita comunicarea cu firmele. Nu vindem/partajăm datele cu terțe părți. Vezi Politica de confidențialitate pentru detalii complete.",
        },
        {
          q: "Pot șterge contul și datele mele?",
          a: (
            <>
              Da, oricând! Accesează{" "}
              <Link
                href="/customer/settings"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                Setările contului
              </Link>{" "}
              și alege &apos;Șterge cont&apos;. Toate datele tale vor fi șterse permanent în
              conformitate cu GDPR.
            </>
          ),
          aText:
            "Da, oricând! Accesează Setările contului și alege 'Șterge cont'. Toate datele tale vor fi șterse permanent în conformitate cu GDPR.",
        },
        {
          q: "Primesc spam după ce solicit oferte?",
          a: "Nu! Primești doar ofertele solicitate de la firmele verificate. Nu vindem email-ul tău către terțe părți și nu trimitem newsletter decât dacă te abonezi explicit.",
        },
      ],
    },
  ];

  // Generate Schema.org FAQ structured data (using plain text versions)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((category) =>
      category.questions.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.aText || (typeof faq.a === "string" ? faq.a : faq.q),
        },
      }))
    ),
  };

  // Cities for SEO targeting
  const majorCities = [
    "București",
    "Cluj-Napoca",
    "Timișoara",
    "Iași",
    "Constanța",
    "Brașov",
    "Galați",
    "Craiova",
    "Ploiești",
    "Oradea",
  ];

  const countyCities = [
    "Brăila",
    "Arad",
    "Pitești",
    "Sibiu",
    "Bacău",
    "Târgu-Mureș",
    "Baia Mare",
    "Buzău",
    "Botoșani",
    "Satu Mare",
    "Suceava",
    "Piatra-Neamț",
    "Drobeta-Turnu Severin",
    "Târgoviște",
    "Focșani",
  ];

  return (
    <>
      <Head>
        <title>Întrebări Frecvente (FAQ) Mutări România 2026 | OferteMutare.ro</title>
        <meta
          name="description"
          content="🚚 Răspunsuri complete despre serviciile de mutări în București, Cluj, Timișoara, Iași și toată România. Prețuri, proces, firme verificate, termene. 100% gratuit!"
        />
        <meta
          name="keywords"
          content="faq mutări românia, întrebări mutări, cost mutare, firme mutări verificate, proces mutare, mutări bucurești, mutări cluj, mutări timișoara"
        />
        <link rel="canonical" href="https://ofertemutare.ro/faq" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Întrebări Frecvente Mutări România | Ghid Complet 2026"
        />
        <meta
          property="og:description"
          content="Tot ce trebuie să știi despre mutări: prețuri, proces, firme, termene. Acoperire în toate orașele din România."
        />
        <meta property="og:url" content="https://ofertemutare.ro/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="FAQ Mutări România → Prețuri, Proces, Firme Verificate"
        />
        <meta
          name="twitter:description"
          content="Răspunsuri complete la toate întrebările despre mutări în România. 100% gratuit!"
        />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* FAQ Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* LocalBusiness Schema for better local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              serviceType: "Platformă Comparare Servicii Mutări",
              provider: {
                "@type": "Organization",
                name: "OferteMutare.ro",
                url: "https://ofertemutare.ro",
                logo: "https://ofertemutare.ro/logo.webp",
              },
              areaServed: [
                ...majorCities.map((city) => ({
                  "@type": "City",
                  name: city,
                  containedIn: {
                    "@type": "Country",
                    name: "România",
                  },
                })),
                {
                  "@type": "Country",
                  name: "România",
                },
              ],
              availableChannel: {
                "@type": "ServiceChannel",
                serviceUrl: "https://ofertemutare.ro/customer/dashboard",
                servicePhone: "+40-729-XXX-XXX",
                availableLanguage: {
                  "@type": "Language",
                  name: "Romanian",
                },
              },
            }),
          }}
        />
      </Head>

      <LayoutWrapper>
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex rounded-full bg-linear-to-r from-emerald-100 to-teal-100 p-3 shadow-sm">
              <HelpCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Întrebări{" "}
              <span className="rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-3 py-1 text-white sm:px-4">
                Frecvente
              </span>
            </h1>
            <p className="mx-auto max-w-2xl px-4 text-base text-gray-600 sm:text-lg">
              Răspunsuri clare la cele mai comune întrebări despre platformă, proces, prețuri și mai
              mult.
            </p>
          </div>

          {/* Cities Coverage Badge */}
          <div className="mb-10 rounded-xl border-2 border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 p-6">
            <div className="mb-3 flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-800">Acoperim Toată România</h3>
            </div>
            <p className="mb-3 text-center text-sm text-gray-700">
              Servicii de mutări disponibile în: <strong>{majorCities.join(", ")}</strong> și peste{" "}
              <strong>30 de reședințe de județ</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {majorCities.slice(0, 5).map((city) => (
                <Link
                  key={city}
                  href={`/mutari/${city.toLowerCase().replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i").replace(/ș/g, "s").replace(/ț/g, "t").replace(/ /g, "-")}`}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Building2 className="h-3 w-3" />
                  {city}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Contact */}
          <div className="mb-12 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-5 sm:p-6">
            <p className="text-center text-sm text-gray-700 sm:text-base">
              <strong>Nu găsești răspunsul?</strong> Contactează-ne la{" "}
              <a
                href="mailto:contact@ofertemutare.ro"
                className="font-semibold text-emerald-600 underline hover:text-emerald-700"
              >
                contact@ofertemutare.ro
              </a>
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="mb-6 text-xl font-bold text-gray-800 sm:text-2xl">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, qIndex) => (
                    <details
                      key={qIndex}
                      className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                    >
                      <summary className="flex cursor-pointer items-start justify-between gap-4 font-semibold text-gray-800 hover:text-emerald-600">
                        <span className="flex-1 text-sm sm:text-base">{faq.q}</span>
                        <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-500 opacity-0 transition-opacity group-open:opacity-100" />
                      </summary>
                      <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Cities Section for SEO */}
          <div className="mt-16 rounded-xl bg-linear-to-br from-slate-50 to-gray-100 p-6 sm:p-8">
            <h3 className="mb-4 text-center text-lg font-bold text-gray-900 sm:text-xl">
              Servicii Mutări în Toate Orașele României
            </h3>
            <p className="mb-6 text-center text-sm text-gray-600 sm:text-base">
              Platformă națională de comparare oferte mutări. Acoperim toate orașele mari și medii:
            </p>
            <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {[...majorCities, ...countyCities].map((city) => (
                <div
                  key={city}
                  className="rounded-lg bg-white px-3 py-2 text-center text-xs font-medium text-gray-700 shadow-sm sm:text-sm"
                >
                  {city}
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500">
              + sute de comune și localități din toată România
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-xl bg-linear-to-r from-emerald-600 to-blue-600 p-6 text-center text-white sm:p-8">
            <h3 className="mb-4 text-xl font-bold sm:text-2xl">Gata să Începi?</h3>
            <p className="mb-6 text-base sm:text-lg">
              Solicită oferte gratuite de la cele mai bune firme de mutări din România
            </p>
            <Link
              href="/customer/dashboard"
              className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-600 transition-transform hover:scale-105 hover:shadow-lg active:scale-95 sm:px-8 sm:text-base"
            >
              Solicită Oferte Gratuite
            </Link>
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
}
