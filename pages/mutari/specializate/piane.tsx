import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import FAQSection from "@/components/content/FAQSection";
import { FAQPageSchema, LocalBusinessSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { SERVICE_FAQS } from "@/data/faqData";
import {
  Music,
  CheckCircle,
  ArrowRight,
  Shield,
  Truck,
  DollarSign,
  Star,
  AlertTriangle,
  Package,
  Heart,
  Award,
} from "lucide-react";

export default function MutariPianePage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>Mutări Piane {currentYear} | Transport Specializat Piane</title>
        <meta
          name="description"
          content="Servicii specializate mutări piane în România. Echipe cu experiență, transport sigur piane verticale și cu coadă. De la 400 lei!"
        />
        <meta
          name="keywords"
          content="mutări piane, transport pian, mutare pian coadă, relocare piane, firme mutări piane, transport instrumente muzicale"
        />
        <link rel="canonical" href="https://ofertemutare.ro/mutari/specializate/piane" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/mutari/specializate/piane" />
        <meta property="og:title" content={`Mutări Piane ${currentYear}`} />
        <meta property="og:description" content="Transport specializat pentru piane. Echipe cu experiență!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Service Schema with Pricing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: "Mutări Piane",
              description: "Servicii specializate de transport piane verticale și piane cu coadă în România. Echipe cu experiență, echipamente profesionale.",
              provider: {
                "@type": "Organization",
                name: "OferteMutare.ro"
              },
              areaServed: {
                "@type": "Country",
                name: "România"
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicii Mutări Piane",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutare Pian Vertical (același oraș)",
                      description: "150-250kg, apartament → apartament"
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "RON",
                      price: "400-700"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutare Pian Vertical (\u00eentre ora\u0219e)",
                      description: "Transport interurban pian vertical"
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "RON",
                      price: "800-1500"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutare Pian cu Coad\u0103",
                      description: "300-500kg, echip\u0103 4+ persoane"
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "RON",
                      price: "1500-3000"
                    }
                  }
                ]
              }
            }),
          }}
        />
      </Head>

      <LayoutWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-slate-800 via-gray-800 to-zinc-900 py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <Music className="h-6 w-6 text-slate-300" />
              <span className="text-slate-300 text-sm font-medium">Servicii Specializate • Piane</span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
              Mutări{" "}
              <span className="bg-linear-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Piane
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-slate-300 md:text-xl">
              Transport specializat pentru piane verticale, piane cu coadă și instrumente valoroase. 
              Echipe cu experiență, echipamente profesionale, protecție maximă.
            </p>

            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">400+</div>
                <div className="text-sm text-slate-300">Lei minim</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">3-4</div>
                <div className="text-sm text-slate-300">Persoane echipă</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-slate-300">Asigurare</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">🎹</div>
                <div className="text-sm text-slate-300">Experți</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/customer/auth"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 font-bold text-slate-900 shadow-xl transition-all hover:bg-amber-400 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Cere Ofertă Transport Pian
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Main Article */}
        <article className="mx-auto max-w-4xl px-4 py-16">
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              De ce mutarea unui pian necesită specialiști?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Un <strong>pian</strong> poate cântări între 150kg (pian vertical) și 500kg (pian cu coadă). 
                Este extrem de fragil, cu mii de piese delicate, și poate costa între 5.000-100.000+ euro. 
                O mișcare greșită poate cauza daune permanente la mecanica internă sau zgârieturi ireversibile.
              </p>
              <p>
                Firmele partenere specializate în <strong>mutări piane</strong> au experiență, echipamente 
                profesionale (cărucioare speciale, curele, protecții) și asigurare completă. Nu riscați pianul 
                tău cu o firmă generalistă!
              </p>
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-green-600" />
              Prețuri mutări piane în {currentYear}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Pian vertical (același oraș)</h3>
                  <p className="text-sm text-gray-500">150-250kg, apartament → apartament</p>
                </div>
                <div className="text-xl font-bold text-slate-700">400-700 lei</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Pian vertical (între orașe)</h3>
                  <p className="text-sm text-gray-500">De exemplu București → Cluj</p>
                </div>
                <div className="text-xl font-bold text-slate-700">800-1.500 lei</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Pian cu coadă</h3>
                  <p className="text-sm text-gray-500">300-500kg, necesită 4+ persoane</p>
                </div>
                <div className="text-xl font-bold text-amber-700">1.500-3.000+ lei</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              ⚠️ Prețurile cresc cu etajul (fără lift), accesul dificil, sau dimensiuni neobișnuite.
            </p>
          </section>

          {/* Challenges */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-slate-50 to-gray-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <AlertTriangle className="h-7 w-7 text-orange-600" />
              Provocări în mutarea pianelor
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
                <Package className="h-5 w-5 shrink-0 text-orange-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Greutate enormă</h3>
                  <p className="text-sm text-gray-600">150-500kg concentrate într-un spațiu mic → risc de accidentare</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
                <Heart className="h-5 w-5 shrink-0 text-red-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Extrem de fragil</h3>
                  <p className="text-sm text-gray-600">Mecanica internă se dezacordează la mișcări bruste</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
                <Shield className="h-5 w-5 shrink-0 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Valoare mare</h3>
                  <p className="text-sm text-gray-600">Piane de calitate costă 10.000-100.000€ → daune financiare uriașe</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
                <Truck className="h-5 w-5 shrink-0 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Acces dificil</h3>
                  <p className="text-sm text-gray-600">Scări înguste, lifturi mici, curbe strânse</p>
                </div>
              </div>
            </div>
          </section>

          {/* What's Included */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Award className="h-7 w-7 text-amber-600" />
              Ce include serviciul de mutare piane?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span><strong>Echipă specializată:</strong> 3-4 persoane cu experiență în mutări piane</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span><strong>Echipamente profesionale:</strong> Cărucioare speciale, curele de ridicare, rampă</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span><strong>Protecții premium:</strong> Pături groase, folie stretch, protecții colțuri</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span><strong>Asigurare extinsă:</strong> Acoperire completă pentru valoarea pianului</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span><strong>Poziționare exactă:</strong> Plasăm pianul exact unde vrei în noua locuință</span>
              </li>
            </ul>
          </section>

          {/* Tips */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-blue-50 to-cyan-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Star className="h-7 w-7 text-blue-600" />
              Sfaturi pentru mutarea pianului
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-blue-500 mt-1" />
                <span><strong>Măsoară accesul:</strong> Verifică dimensiunile ușilor, liftului și scărilor înainte.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-blue-500 mt-1" />
                <span><strong>Programează acordare:</strong> După mutare, pianul va avea nevoie de acord (2-4 săptămâni).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-blue-500 mt-1" />
                <span><strong>Declară valoarea:</strong> Pentru asigurare corectă, declară valoarea reală a pianului.</span>
              </li>
            </ul>
          </section>

          {/* Final CTA */}
          <section className="rounded-2xl bg-linear-to-r from-slate-800 to-zinc-900 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Găsește specialiști pentru mutarea pianului
            </h2>
            <p className="mb-8 text-lg text-slate-300">
              Compară oferte de la firme specializate în mutări piane în 24h!
            </p>
            <Link
              href="/customer/auth"
              className="group inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 font-bold text-slate-900 shadow-xl transition-all hover:bg-amber-400"
            >
              Cere Oferte Acum
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}
