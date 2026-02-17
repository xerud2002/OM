import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { AggregateRatingSchema } from "@/components/seo/SchemaMarkup";
import { getReviewStats } from "@/lib/firebaseAdmin";
import {
  ArrowRightIcon as ArrowRight,
  DocumentTextIcon,
  CurrencyEuroIcon,
  TruckIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  HomeIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

interface ArticoleIndexPageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function ArticoleIndexPage({
  currentYear,
  reviewStats,
}: ArticoleIndexPageProps) {
  const articles = [
    {
      title: `Cât Costă o Mutare în România ${currentYear} | Prețuri Reale`,
      description:
        "Analiză completă a prețurilor pentru mutări locale și interurbane. Costuri detaliate pe tipuri de locuință, distanță și servicii suplimentare.",
      href: "/articole/cat-costa-mutarea-2026",
      icon: CurrencyEuroIcon,
      color: "emerald",
    },
    {
      title: "Ghid Complet Mutare Locuință | OferteMutare.ro",
      description:
        "Tot ce trebuie să știi despre procesul de mutare: planificare, împachetare, transport și instalare la noua adresă.",
      href: "/articole/mutare",
      icon: TruckIcon,
      color: "blue",
    },
    {
      title: "Ghid Mutare București-Complet",
      description:
        "Ghid complet pentru mutarea în sau din București: cartiere, prețuri, firme recomandate și sfaturi practice.",
      href: "/articole/mutare-bucuresti-complet",
      icon: MapPinIcon,
      color: "purple",
    },
    {
      title: "Ghid Mutare Cluj-Napoca",
      description:
        "Tot ce trebuie să știi despre mutarea în sau din Cluj-Napoca: prețuri orientative, cartiere populare și firme locale.",
      href: "/articole/mutare-cluj-napoca",
      icon: MapPinIcon,
      color: "indigo",
    },
    {
      title: "Mutare fără Lift: Soluții și Costuri",
      description:
        "Sfaturi practice și costuri suplimentare pentru mutarea la etaj fără lift. Cum să economisești și ce trebuie să știi.",
      href: "/articole/mutare-fara-lift",
      icon: HomeIcon,
      color: "orange",
    },
    {
      title: "Cum să Te Pregătești pentru Mutare",
      description:
        "Ghid pregătire mutare: planificare în 8 săptămâni, liste complete, când să rezervi firma și cum să economisești.",
      href: "/articole/pregatire",
      icon: ClipboardDocumentCheckIcon,
      color: "teal",
    },
    {
      title: "50+ Sfaturi Expert pentru Mutări",
      description:
        "Cele mai utile sfaturi pentru o mutare reușită: trucuri de împachetare, economisire și organizare pas cu pas.",
      href: "/articole/sfaturi-mutari",
      icon: AcademicCapIcon,
      color: "yellow",
    },
    {
      title: "Acte Necesare Schimbare Adresă/Domiciliu",
      description:
        "Ghid complet despre actele necesare pentru schimbarea adresei de domiciliu: documente, pași și instituții.",
      href: "/articole/schimbare-adresa-documente",
      icon: DocumentTextIcon,
      color: "rose",
    },
    {
      title: "Survey Mutări: Fizic vs. Video vs. Estimare",
      description:
        "Compară cele 3 tipuri de evaluare pentru mutări și află cum obții cel mai bun preț de la firmele de mutări.",
      href: "/articole/evaluare-mutare",
      icon: ShieldCheckIcon,
      color: "cyan",
    },
    {
      title: "Top 10 Cartiere București pentru Relocare",
      description:
        "Cele mai bune cartiere din București pentru relocare: prețuri, transport, facilități și calitatea vieții.",
      href: "/articole/cele-mai-bune-cartiere-bucuresti",
      icon: MapPinIcon,
      color: "amber",
    },
  ];

  return (
    <>
      <Head>
        <title>{`Articole despre Mutări ${currentYear} | Ghiduri și Sfaturi | OferteMutare.ro`}</title>
        <meta
          name="description"
          content={`Articole utile despre mutări în România ${currentYear}: ghiduri de prețuri, sfaturi practice, acte necesare și pregătirea mutării pas cu pas.`}
        />
        <meta
          name="keywords"
          content="articole mutări, ghid mutare, sfaturi mutare, prețuri mutări, pregătire mutare, acte schimbare adresă, costuri mutare"
        />
        <link rel="canonical" href="https://ofertemutare.ro/articole" />
        <meta name="robots" content="index, follow, max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/articole" />
        <meta
          property="og:title"
          content={`Articole Mutări ${currentYear} | Ghiduri și Sfaturi`}
        />
        <meta
          property="og:description"
          content="Ghiduri complete, sfaturi practice și informații utile despre mutări în România."
        />
        <meta
          property="og:image"
          content="https://ofertemutare.ro/pics/index.webp"
        />
        <meta property="og:locale" content="ro_RO" />
        <meta property="og:site_name" content="OferteMutare.ro" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/articole" />
        <meta name="twitter:title" content={`Articole Mutări ${currentYear}`} />
        <meta
          name="twitter:description"
          content="Ghiduri complete și sfaturi practice despre mutări în România."
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
              name: "Articole despre Mutări",
              description:
                "Colecție de articole utile despre mutări în România: ghiduri, sfaturi practice și informații despre prețuri.",
              url: "https://ofertemutare.ro/articole",
              publisher: {
                "@type": "Organization",
                name: "OferteMutare.ro",
                url: "https://ofertemutare.ro",
              },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: articles.map((a, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `https://ofertemutare.ro${a.href}`,
                  name: a.title,
                })),
              },
            }),
          }}
        />
      </Head>

      <LayoutWrapper>
        <Breadcrumbs
          items={[{ name: "Acasă", href: "/" }, { name: "Articole" }]}
        />
        {reviewStats.reviewCount > 0 && (
          <AggregateRatingSchema
            ratingValue={reviewStats.ratingValue}
            reviewCount={reviewStats.reviewCount}
          />
        )}

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-brand py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Articole și{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Ghiduri Mutări
              </span>
            </h1>
            <p className="mb-8 mx-auto max-w-2xl text-lg text-purple-100 md:text-xl">
              Informații utile, ghiduri de prețuri și sfaturi practice pentru o
              mutare reușită în {currentYear}.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          <section className="mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Toate Articolele
            </h2>
            <p className="mb-8 max-w-3xl text-gray-600">
              Explorează ghidurile noastre complete despre mutări: de la prețuri
              și pregătire, până la acte necesare și sfaturi practice de la
              experți.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => (
                <Link
                  key={article.href}
                  href={article.href}
                  className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <article.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-purple-600">
                    {article.title}
                  </h3>
                  <p className="mb-4 text-gray-600 leading-relaxed text-sm">
                    {article.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-purple-600 font-semibold text-sm">
                    Citește articolul
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
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
  ArticoleIndexPageProps
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
