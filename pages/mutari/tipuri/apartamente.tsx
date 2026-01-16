import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import FAQSection from "@/components/content/FAQSection";
import { FAQPageSchema, LocalBusinessSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import {
  Building2,
  CheckCircle,
  ArrowRight,
  Package,
  DollarSign,
  Bed,
  Sofa,
  Star,
  Layers,
  ArrowUpDown,
  AlertTriangle,
} from "lucide-react";

export default function MutariApartamentePage() {
  const currentYear = new Date().getFullYear();

  const faqItems = [
    {
      question: "Cât costă o mutare de apartament în România?",
      answer: "Prețurile variază între 400-2.500 lei în funcție de mărimea apartamentului (garsonieră până la 4+ camere), etaj, existența liftului și distanța de parcurs. Pe platformă primești 3-5 oferte GRATUITE pentru a compara prețurile.",
    },
    {
      question: "Cât durează o mutare de apartament?",
      answer: "O mutare standard de apartament durează între 2-4 ore pentru garsoniere și 4-8 ore pentru apartamente mari cu 3-4 camere. Durata depinde de cantitatea de mobilă, etaj și necesitatea de demontare/montare.",
    },
    {
      question: "Ce servicii sunt incluse în mutare?",
      answer: "Firmele de pe platformă oferă transport mobilă, încărcare/descărcare, și protecție bunuri. Opțional poți adăuga: împachetare profesională, demontare/montare mobilă, și materiale de ambalare.",
    },
    {
      question: "Cum funcționează costul suplimentar pentru etaj fără lift?",
      answer: "Pentru blocuri fără lift, firmele adaugă 50-150 lei per etaj datorită efortului fizic suplimentar. Declară etajul exact când ceri oferta pentru preț corect.",
    },
    {
      question: "Pot primi oferte pentru mutări între orașe?",
      answer: "Da! Platformă conectează cu firme pentru mutări locale și intercity. Prețurile pentru mutări între orașe includ distanța parcursă și timpul de transport.",
    },
  ];

  return (
    <>
      <Head>
        {/* Essential Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* SEO Title - optimized for CTR */}
        <title>🏠 Mutări Apartamente {currentYear} → Economisești 40% | Compară Oferte</title>
        <meta
          name="description"
          content="✓ 3-5 oferte GRATUITE în 24h de la firme verificate ✓ Compară prețuri și economisești până la 40% ✓ Garsoniere până la 4+ camere → Găsește oferta perfectă!"
        />
        <meta
          name="keywords"
          content="mutări apartament, mutare garsonieră, mutări bloc, transport mobilă apartament, firme mutări apartamente, mutare 2 camere, mutare 3 camere"
        />
        <link rel="canonical" href="https://ofertemutare.ro/mutari/tipuri/apartamente" />

        {/* Robots Control */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/mutari/tipuri/apartamente" />
        <meta property="og:title" content={`🏠 Mutări Apartamente ${currentYear} | Economisește 40%`} />
        <meta
          property="og:description"
          content="✓ 3-5 oferte GRATUITE ✓ Economisești 40% ✓ Garsoniere până la 4+ camere"
        />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ro_RO" />
        <meta property="og:site_name" content="OferteMutare.ro" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/mutari/tipuri/apartamente" />
        <meta name="twitter:title" content={`🏠 Mutări Apartamente ${currentYear}`} />
        <meta name="twitter:description" content="✓ 3-5 oferte GRATUITE în 24h ✓ Economisești 40%" />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Additional SEO */}
        <meta name="author" content="OferteMutare.ro" />
        <meta name="language" content="Romanian" />
        <meta name="theme-color" content="#7c3aed" />
      </Head>

      {/* Schema Markup for Rich Snippets */}
      <FAQPageSchema faqs={faqItems} />
      <LocalBusinessSchema serviceName="Mutări Apartamente" />
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "/" },
          { name: "Mutări", url: "/mutari" },
          { name: "Tipuri", url: "/mutari/tipuri" },
          { name: "Apartamente" },
        ]}
      />

      <LayoutWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800 py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-6 w-6 text-purple-200" />
              <span className="text-purple-100 text-sm font-medium">
                Servicii Specializate • Apartamente
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
              Mutări{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Apartamente
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-purple-100 md:text-xl">
              De la garsoniere la apartamente cu 4+ camere. Echipe experimentate pentru 
              blocuri cu sau fără lift, etaj înalt sau parter.
            </p>

            {/* Stats */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">3-5</div>
                <div className="text-sm text-purple-100">Oferte în 24h</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">40%</div>
                <div className="text-sm text-purple-100">Economie medie</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">2-4h</div>
                <div className="text-sm text-purple-100">Durată medie</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-purple-100">Firme verificate</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/customer/auth"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-purple-700 shadow-xl transition-all hover:bg-purple-50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Cere Oferte Gratuite
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Main Article Content */}
        <article className="mx-auto max-w-4xl px-4 py-16">
          {/* Intro */}
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Cea mai populară mutare: apartamentul
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Mutarea unui <strong>apartament</strong> este cel mai frecvent tip de mutare în România. 
                Fie că te muți dintr-o garsonieră într-un apartament mai mare, sau schimbi cartierul, 
                procesul poate fi stresant fără ajutorul potrivit.
              </p>
              <p>
                Pe <strong>OferteMutare.ro</strong> simplifici totul: completezi un formular în 3 minute 
                și primești 3-5 oferte personalizate de la firme verificate. Compari prețurile, verifici 
                recenziile și alegi firma potrivită &ndash; <strong>100% gratuit, fără obligații</strong>.
              </p>
            </div>
          </section>

          {/* Pricing by Apartment Size */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-green-600" />
              Prețuri mutări apartamente în {currentYear}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border-2 border-gray-200 bg-white p-5 text-center hover:border-purple-300 transition-colors">
                <Bed className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <div className="text-sm text-gray-500">Garsonieră/Studio</div>
                <div className="text-xl font-bold text-gray-900">400-800 lei</div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 bg-white p-5 text-center hover:border-purple-300 transition-colors">
                <Layers className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-sm text-gray-500">2 Camere</div>
                <div className="text-xl font-bold text-gray-900">700-1.200 lei</div>
              </div>
              <div className="rounded-xl border-2 border-purple-400 bg-purple-50 p-5 text-center">
                <Sofa className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-sm text-gray-500">3 Camere</div>
                <div className="text-xl font-bold text-gray-900">1.000-1.800 lei</div>
                <div className="text-xs text-purple-600">Popular</div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 bg-white p-5 text-center hover:border-purple-300 transition-colors">
                <Building2 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-sm text-gray-500">4+ Camere</div>
                <div className="text-xl font-bold text-gray-900">1.500-2.500 lei</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              💡 Prețurile variază în funcție de etaj, lift, distanță și servicii suplimentare.
            </p>
          </section>

          {/* Elevator vs Stairs */}
          <section className="mb-12 rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <ArrowUpDown className="h-7 w-7 text-purple-600" />
              Bloc cu lift vs. fără lift
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Cu lift
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Preț standard, fără costuri suplimentare</li>
                  <li>• Mutare mai rapidă (1-2 ore economie)</li>
                  <li>• Mai puțin solicitant pentru echipă</li>
                  <li>• Ideal pentru mobilier mare</li>
                </ul>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Fără lift (scări)
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• +50-150 lei/etaj (costul muncii suplimentare)</li>
                  <li>• Durată mai lungă cu 30-60 min/etaj</li>
                  <li>• Echipă mai mare (3-4 persoane)</li>
                  <li>• Declară etajul la cerere pentru ofertă corectă</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-7 w-7 text-purple-600" />
              Servicii incluse în mutarea apartamentului
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Transport mobilier</h3>
                  <p className="text-sm text-gray-600">Canapele, paturi, dulapuri, mese, scaune</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Electrocasnice</h3>
                  <p className="text-sm text-gray-600">Frigider, mașină de spălat, TV, aer condiționat</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Demontare/Montare</h3>
                  <p className="text-sm text-gray-600">Demontăm și remontăm dulapuri, paturi, birouri</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Împachetare (opțional)</h3>
                  <p className="text-sm text-gray-600">Materiale și serviciu de împachetare profesional</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Star className="h-7 w-7 text-amber-600" />
              Sfaturi pentru mutarea apartamentului
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Declară etajul și existența liftului</strong> pentru o ofertă corectă.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Măsoară mobilierul mare</strong> (canapele, dulapuri) și compară cu 
                  dimensiunile liftului și ușilor.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Anunță administrația blocului</strong> dacă ai nevoie de rezevare 
                  lift sau parcare.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Evită weekendul și sfârșitul de lună</strong> pentru prețuri mai bune.
                </span>
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <FAQSection items={faqItems} title="Întrebări Frecvente - Mutări Apartamente" />

          {/* Final CTA */}
          <section className="rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Gata să îți muți apartamentul?
            </h2>
            <p className="mb-8 text-lg text-purple-100">
              Primește 3-5 oferte gratuite în 24h și economisește până la 40%.
            </p>
            <Link
              href="/customer/auth"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-purple-700 shadow-xl transition-all hover:bg-purple-50"
            >
              Cere Oferte Gratuite Acum
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}
