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
  BuildingOfficeIcon,
  HomeIcon,
  AcademicCapIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";

interface MutariTipuriIndexPageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function MutariTipuriIndexPage({
  currentYear,
  reviewStats,
}: MutariTipuriIndexPageProps) {
  const tipuriMutari = [
    {
      title: "Mutări Apartamente",
      description:
        "Cel mai solicitat tip de mutare. Garsoniere, apartamente cu 2-4+ camere, inclusiv transport la etaj fără lift. Echipe de 2-4 persoane experimentate.",
      price: "de la 400 lei",
      href: "/mutari/tipuri/apartamente",
      icon: BuildingOfficeIcon,
      badge: "Popular",
    },
    {
      title: "Mutări Case și Vile",
      description:
        "Transport profesional pentru case și vile de orice dimensiune: mobilier greu, electrocasnice mari, obiecte de grădină. Echipe de 4-6 persoane cu camioane de 7.5t+.",
      price: "de la 1.500 lei",
      href: "/mutari/tipuri/case",
      icon: HomeIcon,
      badge: null,
    },
    {
      title: "Mutări Studenți",
      description:
        "Pachete economice adaptate bugetului studențesc. Perfect pentru mutări între cămine, garsoniere sau între orașe. Fără comision ascuns, preț fix.",
      price: "de la 300 lei",
      href: "/mutari/tipuri/studenti",
      icon: AcademicCapIcon,
      badge: "Preț mic",
    },
    {
      title: "Mutări Birouri și Companii",
      description:
        "Relocare de firme cu zero downtime. Planificare în avans, mutare în weekend sau pe timp de noapte, manipulare echipamente IT, servere și mobilier de birou.",
      price: "de la 2.000 lei",
      href: "/mutari/tipuri/birouri",
      icon: BuildingStorefrontIcon,
      badge: null,
    },
  ];

  const pageFaqs = SERVICE_FAQS.general;

  return (
    <>
      <Head>
        <title>{`Tipuri de Mutări ${currentYear} | Apartamente, Case, Birouri, Studenți`}</title>
        <meta
          name="description"
          content={`Toate tipurile de mutări disponibile pe platformă ${currentYear}: apartamente, case, birouri, studenți. Compară oferte gratuite de la firme verificate.`}
        />
        <meta
          name="keywords"
          content="tipuri mutări, mutare apartament, mutare casă, mutare birou, mutare studenți, firme mutări"
        />
        <link rel="canonical" href="https://ofertemutare.ro/mutari/tipuri" />
        <meta name="robots" content="index, follow, max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://ofertemutare.ro/mutari/tipuri"
        />
        <meta property="og:title" content={`Tipuri de Mutări ${currentYear}`} />
        <meta
          property="og:description"
          content="Apartamente, case, birouri, studenți. Compară oferte gratuit!"
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
          content="https://ofertemutare.ro/mutari/tipuri"
        />
        <meta
          name="twitter:title"
          content={`Tipuri de Mutări ${currentYear}`}
        />
        <meta
          name="twitter:description"
          content="Compară oferte gratuit pentru orice tip de mutare!"
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
              name: "Tipuri de Mutări",
              description:
                "Toate tipurile de mutări disponibile pe platforma OferteMutare.ro",
              url: "https://ofertemutare.ro/mutari/tipuri",
              publisher: {
                "@type": "Organization",
                name: "OferteMutare.ro",
                url: "https://ofertemutare.ro",
              },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: tipuriMutari.map((t, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `https://ofertemutare.ro${t.href}`,
                  name: t.title,
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
            { name: "Tipuri" },
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
              Tipuri de{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Mutări
              </span>
            </h1>
            <p className="mb-8 mx-auto max-w-2xl text-lg text-purple-100 md:text-xl">
              Alege tipul de mutare potrivit și primești până la 5 oferte
              gratuite de la firme verificate în maxim 24 de ore.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="h-5 w-5 text-green-400" /> Firme
                verificate
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-5 w-5 text-yellow-400" /> Oferte în 24h
              </span>
              <span className="flex items-center gap-1.5">
                <CurrencyEuroIcon className="h-5 w-5 text-blue-400" /> 100%
                gratuit
              </span>
            </div>
          </div>
        </section>

        {/* Types Grid */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          <section className="mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Alege Tipul de Mutare
            </h2>
            <p className="mb-8 max-w-3xl text-gray-600">
              Indiferent de tipul de mutare, pe platformă găsești firme
              specializate care oferă servicii profesionale la prețuri
              competitive.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {tipuriMutari.map((type) => (
                <Link
                  key={type.href}
                  href={type.href}
                  className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                >
                  {type.badge && (
                    <span className="absolute -top-3 right-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                      {type.badge}
                    </span>
                  )}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <type.icon className="h-6 w-6 text-purple-600" />
                  </div>
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
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Întrebări Frecvente
            </h2>
            <div className="space-y-4">
              {pageFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900 hover:text-purple-600">
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

          {/* CTA */}
          <section className="rounded-2xl bg-linear-to-r from-purple-600 to-violet-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Gata să te muți?</h2>
            <p className="mb-8 mx-auto max-w-xl text-lg text-purple-100">
              Completează formularul gratuit și primești până la 5 oferte de la
              firme verificate în 24h.
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
  MutariTipuriIndexPageProps
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
