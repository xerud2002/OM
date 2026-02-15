import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { AggregateRatingSchema } from "@/components/seo/SchemaMarkup";
import { getReviewStats } from "@/lib/firebaseAdmin";
import { CubeIcon as Package, WrenchScrewdriverIcon as Wrench, BuildingStorefrontIcon as Warehouse, TrashIcon as Trash2, ArrowRightIcon as ArrowRight } from "@heroicons/react/24/outline";

interface ServiciiIndexPageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function ServiciiIndexPage({ currentYear, reviewStats }: ServiciiIndexPageProps) {

  const servicii = [
    {
      title: "Împachetare Profesională",
      description: "Materiale premium și echipă expertă. Protecție maximă pentru bunurile tale.",
      icon: Package,
      href: "/servicii/impachetare/profesionala",
      color: "rose",
    },
    {
      title: "Materiale de Împachetare",
      description: "Cutii, bubble wrap, folie stretch - tot ce ai nevoie pentru o mutare sigură.",
      icon: Package,
      href: "/servicii/impachetare/materiale",
      color: "indigo",
    },
    {
      title: "Montaj și Demontare Mobilă",
      description: "Montatori profesioniști pentru dulapuri, paturi, mobilier IKEA și personalizat.",
      icon: Wrench,
      href: "/servicii/montaj/mobila",
      color: "cyan",
    },
    {
      title: "Depozitare Mobilă",
      description: "Spații securizate cu climatizare. De la 150 lei/lună.",
      icon: Warehouse,
      href: "/servicii/depozitare",
      color: "amber",
    },
    {
      title: "Debarasare și Evacuare",
      description: "Evacuare mobilă veche și gunoi. Reciclare eco-friendly.",
      icon: Trash2,
      href: "/servicii/debarasare",
      color: "emerald",
    },
  ];

  return (
    <>
      <Head>
        <title>{`Servicii Mutare ${currentYear} | Împachetare, Montaj, Depozitare`}</title>
        <meta
          name="description"
          content="✓ Servicii complete pentru mutare ✓ Împachetare, montaj mobilă, materiale, depozitare ✓ Oferte de la firme verificate → Compară gratuit!"
        />
        <meta name="keywords" content="servicii mutare, împachetare, montaj mobilă, depozitare, materiale ambalare" />
        <link rel="canonical" href="https://ofertemutare.ro/servicii" />

        <meta name="robots" content="index, follow, max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/servicii" />
        <meta property="og:title" content={`Servicii Mutare ${currentYear}`} />
        <meta property="og:description" content="Servicii complete: împachetare, montaj, depozitare. Oferte gratuite!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
        <meta property="og:locale" content="ro_RO" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/servicii" />
        <meta name="twitter:title" content={`Servicii Mutare ${currentYear}`} />
        <meta name="twitter:description" content="Servicii complete: împachetare, montaj, depozitare. Oferte gratuite!" />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              serviceType: "Servicii Complementare Mutări",
              provider: {
                "@type": "Organization",
                name: "OferteMutare.ro",
                url: "https://ofertemutare.ro",
                logo: "https://ofertemutare.ro/pics/index.webp",
              },
              areaServed: {
                "@type": "Country",
                name: "România",
              },
              description: "Servicii complete pentru mutare: împachetare, montaj mobilă, materiale, depozitare. Oferte de la firme verificate.",
            }),
          }}
        />
      </Head>

      <LayoutWrapper>
        <Breadcrumbs items={[{ name: "Acasă", href: "/" }, { name: "Servicii" }]} />
        {reviewStats.reviewCount > 0 && (
          <AggregateRatingSchema ratingValue={reviewStats.ratingValue} reviewCount={reviewStats.reviewCount} />
        )}
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-brand py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Servicii Complete{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                de Mutare
              </span>
            </h1>
            <p className="mb-10 mx-auto max-w-2xl text-lg text-purple-100 md:text-xl">
              De la împachetare la montaj și depozitare - tot ce ai nevoie pentru o mutare fără stres!
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          {/* All Services */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Toate Serviciile</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {servicii.map((serviciu) => {
                const Icon = serviciu.icon;
                return (
                  <Link
                    key={serviciu.href}
                    href={serviciu.href}
                    className="group rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`rounded-xl bg-${serviciu.color}-100 p-3`}>
                        <Icon className={`h-6 w-6 text-${serviciu.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-purple-600">
                          {serviciu.title}
                        </h3>
                        <p className="mb-3 text-gray-600">{serviciu.description}</p>
                        <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                          Vezi detalii
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-16 rounded-2xl bg-linear-to-r from-purple-50 to-pink-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">De ce să folosești serviciile noastre?</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-purple-600">3-5</div>
                <div className="text-gray-700">Oferte comparative</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-purple-600">40%</div>
                <div className="text-gray-700">Economie medie</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-purple-600">24h</div>
                <div className="text-gray-700">Răspuns rapid</div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Ai nevoie de servicii suplimentare?</h2>
            <p className="mb-8 text-lg text-purple-100">
              Primește oferte personalizate pentru orice serviciu legat de mutare.
            </p>
            <Link
              href="/#request-form"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-purple-700 shadow-xl transition-all hover:bg-purple-50"
            >
              Cere Oferte Gratuite
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>
        </div>
      </LayoutWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<ServiciiIndexPageProps> = async () => {
  const reviewStats = await getReviewStats();
  return {
    props: {
      currentYear: new Date().getFullYear(),
      reviewStats,
    },
    revalidate: 3600,
  };
};



