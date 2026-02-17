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
  MusicalNoteIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";

interface MutariSpecializateIndexPageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function MutariSpecializateIndexPage({
  currentYear,
  reviewStats,
}: MutariSpecializateIndexPageProps) {
  const mutariSpecializate = [
    {
      title: "Mutări Piane și Instrumente Muzicale",
      description:
        "Transport specializat pentru piane verticale și cu coadă. Echipament profesional: platforme cu suspensie, chingi capitonate, rampe. Echipe antrenate pentru obiecte de 200-500 kg. Asigurare inclusă.",
      price: "de la 800 lei",
      href: "/mutari/specializate/piane",
      icon: MusicalNoteIcon,
    },
  ];

  const pageFaqs = SERVICE_FAQS.general;

  return (
    <>
      <Head>
        <title>{`Mutări Specializate ${currentYear} | Transport Obiecte Speciale`}</title>
        <meta
          name="description"
          content={`Servicii de mutări specializate ${currentYear}: transport piane, instrumente muzicale și obiecte grele. Echipament profesional, echipe antrenate și asigurare inclusă.`}
        />
        <meta
          name="keywords"
          content="mutări specializate, transport pian, mutare instrumente muzicale, transport obiecte grele, mutări profesionale"
        />
        <link
          rel="canonical"
          href="https://ofertemutare.ro/mutari/specializate"
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://ofertemutare.ro/mutari/specializate"
        />
        <meta
          property="og:title"
          content={`Mutări Specializate ${currentYear}`}
        />
        <meta
          property="og:description"
          content="Transport specializat pentru obiecte grele și fragile. Echipe profesioniste!"
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
          content="https://ofertemutare.ro/mutari/specializate"
        />
        <meta
          name="twitter:title"
          content={`Mutări Specializate ${currentYear}`}
        />
        <meta
          name="twitter:description"
          content="Transport specializat pentru obiecte grele și fragile."
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
              "@type": "CollectionPage",
              name: "Mutări Specializate",
              description:
                "Servicii de transport specializat pentru obiecte grele, fragile sau de valoare mare.",
              url: "https://ofertemutare.ro/mutari/specializate",
              publisher: {
                "@type": "Organization",
                name: "OferteMutare.ro",
                url: "https://ofertemutare.ro",
              },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: mutariSpecializate.map((m, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `https://ofertemutare.ro${m.href}`,
                  name: m.title,
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
            { name: "Mutări", href: "/mutari" },
            { name: "Specializate" },
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
        <section className="relative overflow-hidden bg-gradient-mutari py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Mutări{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Specializate
              </span>
            </h1>
            <p className="mb-8 mx-auto max-w-2xl text-lg text-purple-100 md:text-xl">
              Unele obiecte necesită echipament și expertiză specială. Firmele
              noastre partenere sunt echipate pentru transportul obiectelor
              grele sau fragile.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="h-5 w-5 text-green-400" />{" "}
                Echipament profesional
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-5 w-5 text-yellow-400" /> Echipe
                antrenate
              </span>
              <span className="flex items-center gap-1.5">
                <CurrencyEuroIcon className="h-5 w-5 text-blue-400" /> Asigurare
                inclusă
              </span>
            </div>
          </div>
        </section>

        {/* Specialized Types */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          <section className="mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Servicii Specializate
            </h2>
            <p className="mb-8 max-w-3xl text-gray-600">
              Transportul obiectelor speciale necesită echipament dedicat și
              echipe cu experiență. Firmele partenere sunt certificate și dispun
              de tot echipamentul necesar.
            </p>
            <div className="grid gap-6">
              {mutariSpecializate.map((type) => (
                <Link
                  key={type.href}
                  href={type.href}
                  className="group rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                      <type.icon className="h-7 w-7 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-purple-600">
                        {type.title}
                      </h3>
                      <p className="mb-4 text-gray-600 leading-relaxed">
                        {type.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">
                          {type.price}
                        </span>
                        <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                          Vezi detalii
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Back to all types */}
          <section className="mb-16 rounded-2xl border-2 border-purple-200 bg-purple-50 p-8">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Cauți un alt tip de mutare?
            </h2>
            <p className="mb-6 text-gray-600">
              Pe lângă mutările specializate, pe platformă găsești firme pentru
              mutări de apartamente, case, birouri și studenți.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/mutari/tipuri"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition-all hover:bg-purple-700"
              >
                Vezi Tipuri de Mutări
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/mutari"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-purple-600 px-6 py-3 font-bold text-purple-600 transition-all hover:bg-purple-50"
              >
                Toate Mutările
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-linear-to-r from-purple-600 to-violet-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Ai un obiect special de transportat?
            </h2>
            <p className="mb-8 mx-auto max-w-xl text-lg text-purple-100">
              Completează formularul gratuit, descrie obiectul și primești
              oferte de la firme cu experiență în transport specializat.
            </p>
            <Link
              href="/customer/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-purple-700 shadow-xl transition-all hover:bg-purple-50"
            >
              Cere Oferte Gratuite Acum
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>
        </div>
      </LayoutWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<
  MutariSpecializateIndexPageProps
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
