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
  WrenchScrewdriverIcon as Wrench,
  ArrowRightIcon as ArrowRight,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";

interface MontajIndexPageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function MontajIndexPage({
  currentYear,
  reviewStats,
}: MontajIndexPageProps) {
  const serviciiMontaj = [
    {
      title: "Demontare & Montare Mobilă",
      description:
        "Echipe de montatori profesioniști cu scule proprii. Demontează și remontează dulapuri, paturi, birouri, bucătării și orice tip de mobilier. Garanție lucrări inclusă.",
      price: "de la 80 lei/piesă",
      duration: "30 min – 4 ore",
      href: "/servicii/montaj/mobila",
      icon: Wrench,
    },
  ];

  const pageFaqs = SERVICE_FAQS.montaj;

  return (
    <>
      <Head>
        <title>{`Servicii Montaj Mobilă ${currentYear} | Demontare & Montare Profesională`}</title>
        <meta
          name="description"
          content={`Servicii profesionale de montaj mobilă ${currentYear}: demontare și montare dulapuri, paturi, birouri, bucătării. Montatori cu scule proprii, de la 80 lei/piesă!`}
        />
        <meta
          name="keywords"
          content="montaj mobilă, demontare mobilă, montare mobilier, asamblare mobilier, montatori mobilă, servicii montaj"
        />
        <link
          rel="canonical"
          href="https://ofertemutare.ro/servicii/montaj"
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://ofertemutare.ro/servicii/montaj"
        />
        <meta
          property="og:title"
          content={`Servicii Montaj Mobilă ${currentYear}`}
        />
        <meta
          property="og:description"
          content="Demontare și montare profesională de mobilier. Montatori cu scule proprii, garanție inclusă!"
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
          content="https://ofertemutare.ro/servicii/montaj"
        />
        <meta
          name="twitter:title"
          content={`Servicii Montaj Mobilă ${currentYear}`}
        />
        <meta
          name="twitter:description"
          content="Demontare și montare profesională de mobilier. Montatori cu scule proprii!"
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
              name: "Servicii de Montaj Mobilă",
              serviceType: "Servicii de demontare și montare mobilier",
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
                name: "Servicii Montaj",
                itemListElement: serviciiMontaj.map((s, i) => ({
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
            { name: "Montaj" },
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
        <section className="relative overflow-hidden bg-gradient-cyan py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Servicii de{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Montaj Mobilă
              </span>
            </h1>
            <p className="mb-8 mx-auto max-w-2xl text-lg text-cyan-100 md:text-xl">
              Conectăm-te cu montatori profesioniști care demontează și
              remontează orice tip de mobilier rapid, sigur și cu garanție.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-cyan-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="h-5 w-5 text-green-400" /> Garanție
                lucrări
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-5 w-5 text-yellow-400" /> Scule incluse
              </span>
              <span className="flex items-center gap-1.5">
                <CurrencyEuroIcon className="h-5 w-5 text-blue-400" /> De la 80
                lei/piesă
              </span>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          <section className="mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Servicii de Montaj
            </h2>
            <p className="mb-8 max-w-3xl text-gray-600">
              Montatori experimentați cu scule profesionale proprii. Demontare
              înainte de mutare și montare la noua locație — totul cu grijă și
              garanție.
            </p>
            <div className="grid gap-6 md:grid-cols-1 max-w-2xl">
              {serviciiMontaj.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-cyan-400 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-100">
                    <service.icon className="h-7 w-7 text-cyan-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-cyan-600">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <span className="text-sm font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-lg">
                        {service.price}
                      </span>
                      <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                        {service.duration}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-cyan-600 font-semibold">
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
              Întrebări Frecvente despre Montaj Mobilă
            </h2>
            <div className="space-y-4">
              {pageFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900 hover:text-cyan-600">
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
          <section className="mb-16 rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-8">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Ai nevoie și de alte servicii?
            </h2>
            <p className="mb-6 text-gray-600">
              Pe lângă montaj, firmele partenere oferă și împachetare
              profesională, depozitare temporară și debarasare.
            </p>
            <Link
              href="/servicii"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-bold text-white transition-all hover:bg-cyan-700"
            >
              Vezi Toate Serviciile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-linear-to-r from-cyan-600 to-teal-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Adaugă Montaj la Mutarea Ta
            </h2>
            <p className="mb-8 mx-auto max-w-xl text-lg text-cyan-100">
              Completează formularul gratuit, menționează că ai nevoie de
              demontare/montare mobilă și primești oferte complete de la firme
              partenere.
            </p>
            <Link
              href="/customer/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-cyan-700 shadow-xl transition-all hover:bg-cyan-50"
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

export const getStaticProps: GetStaticProps<MontajIndexPageProps> = async () => {
  const reviewStats = await getReviewStats();
  return {
    props: {
      currentYear: new Date().getFullYear(),
      reviewStats,
    },
    revalidate: 3600,
  };
};
