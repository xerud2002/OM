import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import {
  AggregateRatingSchema,
  FAQPageSchema,
} from "@/components/seo/SchemaMarkup";
import { getReviewStats } from "@/lib/firebaseAdmin";
import { SERVICE_FAQS } from "@/data/faqData";
import {
  ArrowRightIcon as ArrowRight,
  CubeIcon as Package,
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";

interface ImpachetareIndexPageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function ImpachetareIndexPage({
  currentYear,
  reviewStats,
}: ImpachetareIndexPageProps) {
  const serviciiImpachetare = [
    {
      title: "Împachetare Profesională",
      description:
        "Echipe dedicate care împachetează totul: veselă, electronice, haine, cărți, decorațiuni. Materiale premium cu protecție multi-strat și asigurare inclusă.",
      price: "de la 200 lei",
      duration: "2-4 ore",
      href: "/servicii/impachetare/profesionala",
      icon: Package,
    },
    {
      title: "Materiale de Împachetare",
      description:
        "Kit-uri complete: cutii în 5 mărimi, bubble wrap, folie stretch, bandă adezivă, hârtie, markere. Livrare la domiciliu, cu posibilitatea returnării materialelor nefolosite.",
      price: "de la 80 lei / kit",
      duration: "Livrare în aceeași zi",
      href: "/servicii/impachetare/materiale",
      icon: SparklesIcon,
    },
  ];

  const pageFaqs = SERVICE_FAQS.impachetare;

  return (
    <>
      <Head>
        <title>{`Servicii Împachetare ${currentYear} | Profesională și Materiale`}</title>
        <meta
          name="description"
          content={`Servicii complete de împachetare pentru mutări ${currentYear}: împachetare profesională de la 200 lei și materiale de ambalare premium. Protecție maximă pentru bunuri!`}
        />
        <meta
          name="keywords"
          content="împachetare mutare, materiale împachetare, cutii mutare, bubble wrap, servicii ambalare, împachetare profesională"
        />
        <link
          rel="canonical"
          href="https://ofertemutare.ro/servicii/impachetare"
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://ofertemutare.ro/servicii/impachetare"
        />
        <meta
          property="og:title"
          content={`Servicii Împachetare ${currentYear}`}
        />
        <meta
          property="og:description"
          content="Împachetare profesională și materiale premium pentru mutări. Protecție maximă!"
        />
        <meta
          property="og:image"
          content="https://ofertemutare.ro/pics/index.webp"
        />
        <meta property="og:locale" content="ro_RO" />
        <meta property="og:site_name" content="OferteMutare.ro" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://ofertemutare.ro/servicii/impachetare"
        />
        <meta
          name="twitter:title"
          content={`Servicii Împachetare ${currentYear}`}
        />
        <meta
          name="twitter:description"
          content="Împachetare profesională și materiale premium pentru mutări."
        />
        <meta
          name="twitter:image"
          content="https://ofertemutare.ro/pics/index.webp"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: "Servicii de Împachetare",
              serviceType: "Servicii de împachetare pentru mutări",
              provider: {
                "@type": "Organization",
                name: "OferteMutare.ro",
                url: "https://ofertemutare.ro",
              },
              areaServed: {
                "@type": "Country",
                name: "România",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicii Împachetare",
                itemListElement: serviciiImpachetare.map((s, i) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: s.title,
                    description: s.description,
                  },
                  position: i + 1,
                })),
              },
            }),
          }}
        />
      </Head>

      <LayoutWrapper>
        <Breadcrumbs
          items={[
            { name: "Acasă", href: "/" },
            { name: "Servicii", href: "/servicii" },
            { name: "Împachetare" },
          ]}
        />
        {reviewStats.reviewCount > 0 && (
          <AggregateRatingSchema
            ratingValue={reviewStats.ratingValue}
            reviewCount={reviewStats.reviewCount}
          />
        )}
        <FAQPageSchema faqs={pageFaqs} />

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-brand py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Servicii de{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Împachetare
              </span>
            </h1>
            <p className="mb-8 mx-auto max-w-2xl text-lg text-indigo-100 md:text-xl">
              Protejează-ți bunurile cu servicii profesionale de împachetare sau
              comandă materiale premium direct la domiciliu.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-indigo-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="h-5 w-5 text-green-400" /> Protecție
                maximă
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-5 w-5 text-yellow-400" /> Livrare rapidă
              </span>
              <span className="flex items-center gap-1.5">
                <CurrencyEuroIcon className="h-5 w-5 text-blue-400" /> Prețuri
                accesibile
              </span>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          <section className="mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Servicii de Împachetare
            </h2>
            <p className="mb-8 max-w-3xl text-gray-600">
              Alege între împachetare profesională realizată de echipe
              experimentate sau comandă materiale de calitate pentru a împacheta
              singur.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {serviciiImpachetare.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100">
                    <service.icon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-indigo-600">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <span className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                        {service.price}
                      </span>
                      <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                        {service.duration}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-indigo-600 font-semibold">
                      Detalii
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Întrebări Frecvente despre Împachetare
            </h2>
            <div className="space-y-4">
              {pageFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900 hover:text-indigo-600">
                    {faq.question}
                    <ArrowRight className="h-4 w-4 rotate-90 transition-transform group-open:rotate-270 text-gray-400" />
                  </summary>
                  <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Cross-link */}
          <section className="mb-16 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-8">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Ai nevoie și de alte servicii?
            </h2>
            <p className="mb-6 text-gray-600">
              Pe lângă împachetare, firmele partenere oferă și montaj mobilă,
              depozitare temporară și debarasare.
            </p>
            <Link
              href="/servicii"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-all hover:bg-indigo-700"
            >
              Vezi Toate Serviciile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Adaugă Împachetare la Mutarea Ta
            </h2>
            <p className="mb-8 mx-auto max-w-xl text-lg text-purple-100">
              Completează formularul gratuit, menționează că ai nevoie și de
              împachetare și primești oferte complete de la firme partenere.
            </p>
            <Link
              href="/customer/auth"
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

export const getStaticProps: GetStaticProps<
  ImpachetareIndexPageProps
> = async () => {
  const reviewStats = await getReviewStats();
  return {
    props: {
      currentYear: new Date().getFullYear(),
      reviewStats,
    },
    revalidate: 3600,
  };
};
