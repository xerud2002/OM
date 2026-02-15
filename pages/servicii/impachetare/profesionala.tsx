import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import FAQSection from "@/components/content/FAQSection";
import { FAQPageSchema, LocalBusinessSchema, AggregateRatingSchema } from "@/components/seo/SchemaMarkup";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getReviewStats } from "@/lib/firebaseAdmin";
import { SERVICE_FAQS } from "@/data/faqData";
import { CubeIcon as Package, CheckCircleIcon as CheckCircle, ArrowRightIcon as ArrowRight, ShieldCheckIcon as Shield, ArchiveBoxIcon as Box, SparklesIcon as Sparkles, ClockIcon as Clock, CurrencyDollarIcon as DollarSign, StarIcon as Star, Squares2X2Icon as Layers, HeartIcon as Heart, ExclamationTriangleIcon as AlertTriangle, BeakerIcon as Wine, PhotoIcon as Frame } from "@heroicons/react/24/outline";

interface ImpachetareProfesionalaPageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function ImpachetareProfesionalaPage({ currentYear, reviewStats }: ImpachetareProfesionalaPageProps) {
  const faqItems = SERVICE_FAQS.impachetare;

  return (
    <>
      <Head>
        <title>{`Împachetare Profesională ${currentYear} | Servicii Complete de Ambalare`}</title>
        <meta
          name="description"
          content="Servicii profesionale de împachetare pentru mutări. Materiale premium, echipe experimentate, protecție maximă pentru bunurile tale. Preț de la 150 lei!"
        />
        <meta
          name="keywords"
          content="împachetare profesională, ambalare mutare, împachetare mobilă, servicii împachetare, materiale ambalare, împachetare obiecte fragile"
        />
        <link rel="canonical" href="https://ofertemutare.ro/servicii/impachetare/profesionala" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/servicii/impachetare/profesionala" />
        <meta property="og:title" content={`Împachetare Profesională ${currentYear}`} />
        <meta property="og:description" content="Servicii complete de împachetare pentru mutări. Materiale premium!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/packing1.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/servicii/impachetare/profesionala" />
        <meta name="twitter:title" content={`Împachetare Profesională ${currentYear}`} />
        <meta name="twitter:description" content="Servicii complete de împachetare pentru mutări. Materiale premium!" />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/packing1.webp" />
      </Head>

      {/* Schema Markup */}
      <FAQPageSchema faqs={faqItems} />
      <LocalBusinessSchema serviceName="Împachetare Profesională" />
      <LayoutWrapper>
        <Breadcrumbs items={[{ name: "Acasă", href: "/" }, { name: "Servicii", href: "/servicii" }, { name: "Împachetare Profesională" }]} />
        {reviewStats.reviewCount > 0 && (
          <AggregateRatingSchema ratingValue={reviewStats.ratingValue} reviewCount={reviewStats.reviewCount} />
        )}
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-rose py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-6 w-6 text-rose-200" />
              <span className="text-rose-100 text-sm font-medium">
                Servicii Premium • Împachetare
              </span>
            </div>

            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Împachetare{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Profesională
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-rose-100 md:text-xl">
              Conectăm-te cu firme specializate în împachetare profesională! Echipe 
              experimentate, materiale premium, protecție maximă pentru bunurile tale.
            </p>

            {/* Stats */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">150+</div>
                <div className="text-sm text-rose-100">Lei/cameră</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">2-4h</div>
                <div className="text-sm text-rose-100">Durată medie</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-rose-100">Asigurare</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-rose-100">Materiale incluse</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#request-form"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-rose-600 shadow-xl transition-all hover:bg-rose-50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Solicită Împachetare
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
              De ce împachetarea profesională face diferența?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                <strong>Împachetarea corectă</strong> este cel mai important factor în protejarea 
                bunurilor tale în timpul mutării. Un obiect spart nu poate fi recuperat, iar 
                stresul de a descoperi daune după mutare poate ruina întreaga experiență.
              </p>
              <p>
                Firmele partenere din platforma noastră oferă <strong>împachetare profesională</strong> 
                cu protecție maximă: echipe cu experiență, materiale premium (cutii rezistente, 
                bubble wrap, hârtie de protecție), și tehnici dovedite pentru fiecare tip de obiect 
                &ndash; de la veselă delicată până la electronice și tablouri valoroase.
              </p>
            </div>
          </section>

          {/* What We Pack */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-rose-50 to-pink-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Box className="h-7 w-7 text-rose-600" />
              Ce împachetăm?
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Wine className="h-6 w-6 shrink-0 text-rose-400" />
                <div>
                  <h3 className="font-bold text-gray-900">Obiecte fragile</h3>
                  <p className="text-sm text-gray-600">
                    Veselă, pahare de cristal, sticle, ceramică, porțelan
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Frame className="h-6 w-6 shrink-0 text-pink-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Artă și decorațiuni</h3>
                  <p className="text-sm text-gray-600">
                    Tablouri, oglinzi, sculptures, antichități, obiecte de valoare
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Package className="h-6 w-6 shrink-0 text-purple-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Electronice</h3>
                  <p className="text-sm text-gray-600">
                    TV-uri, monitoare, laptopuri, console, echipamente audio
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Sparkles className="h-6 w-6 shrink-0 text-amber-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Haine și textile</h3>
                  <p className="text-sm text-gray-600">
                    Cutii garderobă pentru haine pe umerașe, lenjerie, perdele
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-green-600" />
              Prețuri servicii împachetare în {currentYear}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-gray-200 bg-white p-6 text-center hover:border-rose-300 transition-colors">
                <Layers className="h-10 w-10 mx-auto mb-3 text-rose-400" />
                <div className="text-sm text-gray-500 mb-1">Împachetare parțială</div>
                <div className="text-2xl font-bold text-gray-900">150-300 lei</div>
                <p className="text-xs text-gray-500 mt-2">Doar obiecte fragile/valoroase</p>
              </div>
              <div className="rounded-xl border-2 border-rose-400 bg-rose-50 p-6 text-center">
                <Box className="h-10 w-10 mx-auto mb-3 text-rose-600" />
                <div className="text-sm text-gray-500 mb-1">Împachetare completă</div>
                <div className="text-2xl font-bold text-gray-900">300-800 lei</div>
                <p className="text-xs text-gray-500 mt-2">Apartament 2-3 camere</p>
              </div>
              <div className="rounded-xl border-2 border-gray-200 bg-white p-6 text-center hover:border-rose-300 transition-colors">
                <Heart className="h-10 w-10 mx-auto mb-3 text-rose-500" />
                <div className="text-sm text-gray-500 mb-1">Premium (case)</div>
                <div className="text-2xl font-bold text-gray-900">800-2.000 lei</div>
                <p className="text-xs text-gray-500 mt-2">Case mari, obiecte de artă</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              💡 Materialele de ambalare sunt incluse în preț!
            </p>
          </section>

          {/* Benefits */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-7 w-7 text-rose-600" />
              Avantajele împachetării profesionale
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5">
                <div className="rounded-lg bg-green-100 p-2 h-fit">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Zero stres, zero daune</h3>
                  <p className="text-gray-600">
                    Firmele specializate din rețeaua noastră știu exact cum să ambaleze fiecare 
                    tip de obiect. Rata daunelor este sub 1% la împachetare profesională vs. 15-20% la DIY.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5">
                <div className="rounded-lg bg-blue-100 p-2 h-fit">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Economisești timp prețios</h3>
                  <p className="text-gray-600">
                    Împachetarea unui apartament cu 3 camere ia 6-8 ore dacă o faci singur. 
                    O echipă profesionistă termină în 2-3 ore.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5">
                <div className="rounded-lg bg-purple-100 p-2 h-fit">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Materiale premium incluse</h3>
                  <p className="text-gray-600">
                    Cutii rezistente cu triple straturi, bubble wrap premium, hârtie de 
                    protecție, folie stretch, etichete - totul inclus!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What's Included */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Star className="h-7 w-7 text-amber-600" />
              Ce include serviciul?
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span className="text-gray-700">Cutii de carton rezistente (diverse mărimi)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span className="text-gray-700">Bubble wrap și hârtie de protecție</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span className="text-gray-700">Folie stretch pentru mobilier</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span className="text-gray-700">Etichete cu cameră destinație</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span className="text-gray-700">Marcaje &ldquo;FRAGIL&rdquo; pentru obiecte delicate</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span className="text-gray-700">Organizare sistematică pe camere</span>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <AlertTriangle className="h-7 w-7 text-orange-600" />
              Când merită împachetarea profesională?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span>
                  <strong>Ai obiecte valoroase:</strong> Artă, antichități, colecții, 
                  electronice scumpe (&gt;5.000 lei valoare)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span>
                  <strong>Nu ai timp:</strong> Job solicitant, copii mici, sau pur și 
                  simplu nu vrei stresul
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span>
                  <strong>Mutare mare:</strong> Casa sau apartament cu 4+ camere - prea 
                  mult de împachetat singur
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span>
                  <strong>Mutare la distanță:</strong> Transport lung între orașe - 
                  risc mai mare de daune
                </span>
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <FAQSection items={faqItems} title="Întrebări Frecvente - Împachetare Profesională" />

          {/* Final CTA */}
          <section className="rounded-2xl bg-linear-to-r from-rose-600 to-pink-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Găsește firma perfectă pentru împachetare!
            </h2>
            <p className="mb-8 text-lg text-rose-100">
              Compară oferte gratuite de la firme specializate în împachetare profesională în 24h.
            </p>
            <Link
              href="/#request-form"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-rose-600 shadow-xl transition-all hover:bg-rose-50"
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

export const getStaticProps: GetStaticProps<ImpachetareProfesionalaPageProps> = async () => {
  const reviewStats = await getReviewStats();
  return {
    props: {
      currentYear: new Date().getFullYear(),
      reviewStats,
    },
    revalidate: 3600,
  };
};



