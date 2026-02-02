import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import FAQSection from "@/components/content/FAQSection";
import { FAQPageSchema, LocalBusinessSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { SERVICE_FAQS } from "@/data/faqData";
import { WrenchScrewdriverIcon as Wrench, CheckCircleIcon as CheckCircle, ArrowRightIcon as ArrowRight, CurrencyDollarIcon as DollarSign, StarIcon as Star, HomeIcon as Sofa, HomeIcon as Bed, ArchiveBoxIcon as Box, Squares2X2Icon as Layers, ExclamationCircleIcon as AlertCircle, BoltIcon as Zap } from "@heroicons/react/24/outline";

interface DemontareMontareMobilaPageProps {
  currentYear: number;
}

export default function DemontareMontareMobilaPage({ currentYear }: DemontareMontareMobilaPageProps) {
  const faqItems = SERVICE_FAQS.montaj;

  return (
    <>
      <Head>
        <title>Demontare și Montare Mobilă {currentYear} | Servicii în Toată România</title>
        <meta
          name="description"
          content="Servicii profesionale de demontare și montare mobilier. Dulapuri, paturi, birouri, bucătării. Echipe experimentate, scule profesionale. De la 80 lei!"
        />
        <meta
          name="keywords"
          content="demontare mobilă, montare mobilier, asamblare mobilier, dezmembrare dulap, montare pat, servicii montaj mobilă, montatori mobila"
        />
        <link rel="canonical" href="https://ofertemutare.ro/servicii/montaj/mobila" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/servicii/montaj/mobila" />
        <meta property="og:title" content={`Demontare și Montare Mobilă ${currentYear}`} />
        <meta property="og:description" content="Servicii profesionale de demontare și montare mobilier în toată România!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
      </Head>

      {/* Schema Markup */}
      <FAQPageSchema faqs={faqItems} />
      <LocalBusinessSchema serviceName="Demontare și Montare Mobilă" />
      <BreadcrumbSchema items={[{ name: "Acasă", url: "/" }, { name: "Servicii", url: "/servicii" }, { name: "Montaj Mobilă" }]} />

      <LayoutWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-cyan py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <Wrench className="h-6 w-6 text-cyan-200" />
              <span className="text-cyan-100 text-sm font-medium">
                Servicii Profesionale • Montaj
              </span>
            </div>

            <h1 className="mb-6 text-2xl md:text-4xl font-extrabold !text-white md:text-5xl lg:text-6xl">
              Demontare &{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Montare Mobilă
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-cyan-100 md:text-xl">
              Conectăm-te cu montatori profesioniști cu scule profesionale. Găsește 
              firme care demontează și remontează orice tip de mobilier rapid și sigur.
            </p>

            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">80+</div>
                <div className="text-sm text-cyan-100">Lei/piesă</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">30min</div>
                <div className="text-sm text-cyan-100">Dulap standard</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-cyan-100">Scule incluse</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-cyan-100">Garanție</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#request-form"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-cyan-700 shadow-xl transition-all hover:bg-cyan-50 hover:shadow-2xl hover:-translate-y-0.5"
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
              De ce ai nevoie de montatori profesioniști?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                <strong>Demontarea și remontarea mobilierului</strong> pare simplă, dar greșelile 
                pot costa scump: șuruburi pierdute, plăci îndoite, sertare care nu mai încap, 
                sau chiar mobilier care nu mai poate fi asamblat deloc.
              </p>
              <p>
                Firmele partenere au montatori profesioniști cu experiență în toate tipurile de mobilier: 
                de la dulapuri IKEA până la mobilier personalizat sau antichități. Vin cu 
                <strong>scule profesionale</strong>, etichetează piesele sistematic, și garantează 
                că mobilierul tău va fi la fel de funcțional în noua locuință.
              </p>
            </div>
          </section>

          {/* What We Assemble */}
          <section className="mb-12 rounded-2xl bg-gradient-to-r from-cyan-50 to-teal-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Wrench className="h-7 w-7 text-cyan-600" />
              Ce demontăm și montăm?
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Sofa className="h-6 w-6 shrink-0 text-cyan-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Dulapuri și dressing-uri</h3>
                  <p className="text-sm text-gray-600">
                    IKEA PAX, HEMNES, dulapuri personalizate, dressing-uri încorporate
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Bed className="h-6 w-6 shrink-0 text-teal-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Paturi și somiere</h3>
                  <p className="text-sm text-gray-600">
                    Paturi matrimoniale, king-size, paturi cu lăzi, canapele extensibile
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Box className="h-6 w-6 shrink-0 text-emerald-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Mobilier bucătărie</h3>
                  <p className="text-sm text-gray-600">
                    Corpuri mobilier, rafturi suspendate, insule de bucătărie
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Layers className="h-6 w-6 shrink-0 text-blue-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Birouri și biblioteci</h3>
                  <p className="text-sm text-gray-600">
                    Birouri PC, biblioteci modulare, rafturi, sisteme de depozitare
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-green-600" />
              Prețuri demontare/montare mobilă în {currentYear}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Dulap simplu (2 uși)</h3>
                  <p className="text-sm text-gray-500">Demontare + Montare</p>
                </div>
                <div className="text-xl font-bold text-cyan-600">80-120 lei</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Dulap mare (4+ uși / PAX)</h3>
                  <p className="text-sm text-gray-500">Demontare + Montare</p>
                </div>
                <div className="text-xl font-bold text-cyan-600">150-250 lei</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Pat matrimonial</h3>
                  <p className="text-sm text-gray-500">Demontare + Montare</p>
                </div>
                <div className="text-xl font-bold text-cyan-600">100-150 lei</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Mobilă bucătărie (per corp)</h3>
                  <p className="text-sm text-gray-500">Demontare + Montare</p>
                </div>
                <div className="text-xl font-bold text-cyan-600">60-100 lei</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border-2 border-cyan-300 bg-cyan-50 p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Pachet complet apartament</h3>
                  <p className="text-sm text-gray-500">Toate piesele de mobilier</p>
                </div>
                <div className="text-xl font-bold text-cyan-600">400-1.200 lei</div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Zap className="h-7 w-7 text-cyan-600" />
              Cum lucrăm?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Demontare sistematică</h3>
                  <p className="text-sm text-gray-600">
                    Demontăm mobilierul cu grijă, etichetând fiecare piesă, șurub și 
                    clemă pentru reasamblare perfectă.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Ambalare și transport</h3>
                  <p className="text-sm text-gray-600">
                    Piesele sunt ambalate separat pentru protecție maximă în timpul transportului.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Remontare la destinație</h3>
                  <p className="text-sm text-gray-600">
                    Asamblăm mobilierul exact ca înainte, verificând stabilitatea și funcționalitatea.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Verificare finală</h3>
                  <p className="text-sm text-gray-600">
                    Testăm uși, sertare, balamale - totul trebuie să funcționeze perfect!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-12 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Star className="h-7 w-7 text-amber-600" />
              De ce să alegi montatori profesioniști?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Garanție că mobilierul rămâne funcțional:</strong> Știm exact cum 
                  să demontăm fără a deteriora piesele sau șuruburile.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Nu pierzi piese:</strong> Sistemul nostru de etichetare asigură 
                  că fiecare șurub ajunge la locul lui.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Scule profesionale:</strong> Avem toate sculele necesare - nu 
                  trebuie să cumperi nimic.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Rapid și eficient:</strong> Ce te-ar costa 4-5 ore, noi terminăm 
                  în 1-2 ore.
                </span>
              </li>
            </ul>
          </section>

          {/* Warning */}
          <section className="mb-12">
            <div className="rounded-xl border-l-4 border-orange-500 bg-orange-50 p-6">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 shrink-0 text-orange-600" />
                <div>
                  <h3 className="font-bold text-orange-900 mb-2">Atenție!</h3>
                  <p className="text-gray-700 text-sm">
                    Mobilierul IKEA și alte piese din PAL au limit de câte ori pot fi 
                    demontate/remontate (de obicei 2-3 mutări). Dacă piesele prezintă 
                    fisuri sau șuruburile nu mai țin, s-ar putea să recomandăm înlocuirea. 
                    Te vom anunța întotdeauna înainte!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <FAQSection items={faqItems} title="Întrebări Frecvente - Demontare și Montare Mobilă" />

          {/* Final CTA */}
          <section className="rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Montatori profesioniști pentru mutarea ta
            </h2>
            <p className="mb-8 text-lg text-cyan-100">
              Primește oferte gratuite pentru demontare și montare mobilier în 24h.
            </p>
            <Link
              href="/#request-form"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-cyan-700 shadow-xl transition-all hover:bg-cyan-50"
            >
              Cere Oferte Gratuite
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<DemontareMontareMobilaPageProps> = async () => {
  return {
    props: {
      currentYear: new Date().getFullYear(),
    },
  };
};

