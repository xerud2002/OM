import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import { LocalBusinessSchema, FAQPageSchema, AggregateRatingSchema } from "@/components/seo/SchemaMarkup";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getReviewStats } from "@/lib/firebaseAdmin";
import { SERVICE_FAQS } from "@/data/faqData";
import { ShoppingCartIcon as ShoppingCart, CheckCircleIcon as CheckCircle, ArrowRightIcon as ArrowRight, ArchiveBoxIcon as Box, StopIcon as Circle, CurrencyDollarIcon as DollarSign, StarIcon as Star, CubeIcon as Package, Squares2X2Icon as Layers, ShieldCheckIcon as Shield, SparklesIcon as Sparkles, TruckIcon as Truck } from "@heroicons/react/24/outline";

interface MaterialeImpachetarePageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function MaterialeImpachetarePage({ currentYear, reviewStats }: MaterialeImpachetarePageProps) {

  return (
    <>
      <Head>
        <title>{`Materiale Împachetare ${currentYear} | Cutii, Bubble Wrap, Folie`}</title>
        <meta
          name="description"
          content="Vânzare materiale profesionale de împachetare: cutii carton rezistente, bubble wrap, folie stretch, hârtie protecție. Preț de producător, livrare rapidă!"
        />
        <meta
          name="keywords"
          content="cutii mutare, bubble wrap, materiale împachetare, cutii carton, folie stretch, hârtie protecție, materiale ambalare"
        />
        <link rel="canonical" href="https://ofertemutare.ro/servicii/impachetare/materiale" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/servicii/impachetare/materiale" />
        <meta property="og:title" content={`Materiale Împachetare ${currentYear}`} />
        <meta property="og:description" content="Cutii, bubble wrap, folie - tot ce ai nevoie pentru mutare!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/servicii/impachetare/materiale" />
        <meta name="twitter:title" content={`Materiale Împachetare ${currentYear}`} />
        <meta name="twitter:description" content="Cutii, bubble wrap, folie - tot ce ai nevoie pentru mutare!" />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />
      </Head>

      <LocalBusinessSchema serviceName="Materiale Împachetare" />
      <FAQPageSchema faqs={SERVICE_FAQS.impachetare} />
      <LayoutWrapper>
        <Breadcrumbs items={[{ name: "Acasă", href: "/" }, { name: "Servicii", href: "/servicii" }, { name: "Împachetare", href: "/servicii/impachetare" }, { name: "Materiale" }]} />
        {reviewStats.reviewCount > 0 && (
          <AggregateRatingSchema ratingValue={reviewStats.ratingValue} reviewCount={reviewStats.reviewCount} />
        )}
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-brand py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="h-6 w-6 text-indigo-200" />
              <span className="text-indigo-100 text-sm font-medium">
                Produse Premium • Materiale
              </span>
            </div>

            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Materiale{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Împachetare
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-indigo-100 md:text-xl">
              Tot ce ai nevoie pentru o mutare perfectă: cutii rezistente, bubble wrap,
              folie stretch, hârtie protecție. Calitate profesională, preț accesibil!
            </p>

            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-indigo-100">Tipuri produse</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">24h</div>
                <div className="text-sm text-indigo-100">Livrare</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-indigo-100">Calitate premium</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">💰</div>
                <div className="text-sm text-indigo-100">Preț producător</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#request-form"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-indigo-700 shadow-xl transition-all hover:bg-indigo-50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Cere Ofertă
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
              Materiale profesionale pentru o mutare sigură
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Calitatea materialelor de împachetare poate face diferența între bunuri
                intacte și obiecte sparte. <strong>Cutii slabe se rup</strong>, bubble
                wrap-ul ieftin nu protejează, iar lipsa de folie stretch înseamnă mobilier
                zgâriat.
              </p>
              <p>
                Firmele partenere pun la dispoziție <strong>materiale de calitate profesională</strong> - aceleași pe
                care le folosesc la mutările clienților. De la cutii cu pereți dubli și tripli,
                până la bubble wrap gros și folie industrială, ai tot ce îți trebuie pentru
                o mutare fără griji.
              </p>
            </div>
          </section>

          {/* Products Grid */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-7 w-7 text-indigo-600" />
              Catalogue de produse
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Cutii */}
              <div className="rounded-xl border-2 border-indigo-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <Box className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Cutii Carton</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex justify-between">
                    <span>• Cutie mică (40x30x30cm)</span>
                    <strong className="text-gray-900">3-4 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Cutie medie (50x40x40cm)</span>
                    <strong className="text-gray-900">4-5 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Cutie mare (60x40x40cm)</span>
                    <strong className="text-gray-900">5-7 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Cutie garderobă + bară</span>
                    <strong className="text-gray-900">15-20 lei</strong>
                  </li>
                </ul>
                <p className="text-xs text-gray-500">Carton ondulat dublu/triplu strat</p>
              </div>

              {/* Bubble Wrap */}
              <div className="rounded-xl border-2 border-violet-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-violet-100 p-2">
                    <Circle className="h-6 w-6 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Bubble Wrap</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex justify-between">
                    <span>• Rolă 50m (lățime 50cm)</span>
                    <strong className="text-gray-900">40-50 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Rolă 100m (lățime 100cm)</span>
                    <strong className="text-gray-900">80-100 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Bubble maxi (bulele mari)</span>
                    <strong className="text-gray-900">+20%</strong>
                  </li>
                </ul>
                <p className="text-xs text-gray-500">Protecție premium pentru fragile</p>
              </div>

              {/* Folie Stretch */}
              <div className="rounded-xl border-2 border-purple-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Layers className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Folie Stretch</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex justify-between">
                    <span>• Rolă manuală (300m)</span>
                    <strong className="text-gray-900">15-20 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Rolă industrială (500m)</span>
                    <strong className="text-gray-900">25-35 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Mini rolă + mâner</span>
                    <strong className="text-gray-900">12-15 lei</strong>
                  </li>
                </ul>
                <p className="text-xs text-gray-500">Pentru protecție mobilier</p>
              </div>

              {/* Altele */}
              <div className="rounded-xl border-2 border-pink-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-pink-100 p-2">
                    <Sparkles className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Accesorii</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex justify-between">
                    <span>• Hârtie protecție (10kg)</span>
                    <strong className="text-gray-900">30-40 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Bandă adezivă (50m)</span>
                    <strong className="text-gray-900">5-8 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Etichete FRAGIL (100buc)</span>
                    <strong className="text-gray-900">10-15 lei</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Markere permanente</span>
                    <strong className="text-gray-900">3-5 lei</strong>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Packages */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-indigo-50 to-violet-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingCart className="h-7 w-7 text-indigo-600" />
              Pachete complete pentru mutare
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm text-center">
                <h3 className="font-bold text-gray-900 mb-2">Pachet Garsonieră</h3>
                <div className="text-3xl font-bold text-indigo-600 mb-4">150 lei</div>
                <ul className="text-sm text-left text-gray-600 space-y-1">
                  <li>✓ 10 cutii medii</li>
                  <li>✓ 5m bubble wrap</li>
                  <li>✓ 1 rolă folie stretch</li>
                  <li>✓ Bandă adezivă</li>
                </ul>
              </div>
              <div className="rounded-xl bg-indigo-500 p-6 shadow-lg text-center text-white">
                <div className="text-xs bg-yellow-400 text-gray-900 font-bold px-2 py-1 rounded inline-block mb-2">
                  CEL MAI POPULAR
                </div>
                <h3 className="font-bold mb-2">Pachet 2-3 Camere</h3>
                <div className="text-3xl font-bold mb-4">300 lei</div>
                <ul className="text-sm text-left space-y-1">
                  <li>✓ 20 cutii (mici+medii+mari)</li>
                  <li>✓ 2 cutii garderobă</li>
                  <li>✓ 10m bubble wrap</li>
                  <li>✓ 2 role folie stretch</li>
                  <li>✓ Accesorii complete</li>
                </ul>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm text-center">
                <h3 className="font-bold text-gray-900 mb-2">Pachet Casă Mare</h3>
                <div className="text-3xl font-bold text-indigo-600 mb-4">600 lei</div>
                <ul className="text-sm text-left text-gray-600 space-y-1">
                  <li>✓ 40+ cutii diverse</li>
                  <li>✓ 4 cutii garderobă</li>
                  <li>✓ 20m bubble wrap</li>
                  <li>✓ 4 role folie</li>
                  <li>✓ Kit complet accesorii</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Star className="h-7 w-7 text-indigo-600" />
              De ce să comanzi de la noi?
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <Shield className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Calitate profesională</h3>
                  <p className="text-sm text-gray-600">
                    Aceleași materiale folosite de firme profesionale de mutări
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <DollarSign className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Preț de producător</h3>
                  <p className="text-sm text-gray-600">
                    Cumperi direct, fără intermediari - economisești 30-40%
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <Truck className="h-5 w-5 shrink-0 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Livrare rapidă</h3>
                  <p className="text-sm text-gray-600">
                    Comenzi plasate până la ora 12:00 se livrează în 24h
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Tot ce îți trebuie</h3>
                  <p className="text-sm text-gray-600">
                    De la cutii până la etichete - comandă totul dintr-un loc
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              💡 Câte materiale îți trebuie?
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="font-semibold">Regula generală:</p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>Garsonieră:</strong> 8-12 cutii, 5m bubble, 1 rolă folie</li>
                <li>• <strong>2 camere:</strong> 15-20 cutii, 8m bubble, 2 role folie</li>
                <li>• <strong>3 camere:</strong> 25-30 cutii, 12m bubble, 3 role folie</li>
                <li>• <strong>Casă 4+ camere:</strong> 40-60 cutii, 20m bubble, 5 role folie</li>
              </ul>
              <p className="text-sm italic mt-4">
                👉 Sfat: Mai bine să ai materiale în plus decât să descoperi că nu ai
                destule în ziua mutării!
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Găsește furnizori pentru materialele de care ai nevoie
            </h2>
            <p className="mb-8 text-lg text-indigo-100">
              Primește oferte de la firme care furnizează materiale profesionale de împachetare!
            </p>
            <Link
              href="/#request-form"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-indigo-700 shadow-xl transition-all hover:bg-indigo-50"
            >
              Cere Ofertă Acum
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<MaterialeImpachetarePageProps> = async () => {
  const reviewStats = await getReviewStats();
  return {
    props: {
      currentYear: new Date().getFullYear(),
      reviewStats,
    },
    revalidate: 3600,
  };
};



