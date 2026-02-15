import Head from "next/head";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { AggregateRatingSchema } from "@/components/seo/SchemaMarkup";
import { getReviewStats } from "@/lib/firebaseAdmin";

// MobileHero is critical for LCP on mobile - import statically for SSR
import MobileHero from "@/components/home/MobileHero";

// Lazy load Desktop Hero - heavy with framer-motion, only needed on desktop
const Hero = dynamic(() => import("@/components/home/Hero"), {
  loading: () => <div className="hidden min-h-[85vh] bg-slate-50 md:block" />,
  ssr: true,
});
// Lazy load ALL below-the-fold components for better LCP
const Steps = dynamic(() => import("@/components/home/Steps"), {
  loading: () => <div className="min-h-150" />,
  ssr: true,
});
const LogoTicker = dynamic(() => import("@/components/home/LogoTicker"), {
  loading: () => <div className="min-h-25" />,
  ssr: false,
});

const ClientAccount = dynamic(() => import("@/components/home/ClientAccount"), {
  loading: () => <div className="min-h-125" />,
  ssr: false,
});
const Services = dynamic(() => import("@/components/home/Services"), {
  loading: () => <div className="min-h-150" />,
  ssr: false,
});
const Articles = dynamic(() => import("@/components/blog/Articles"), {
  loading: () => <div className="min-h-100" />,
  ssr: false,
});
const PartnerSection = dynamic(() => import("@/components/home/PartnerSection"), {
  loading: () => <div className="min-h-125" />,
  ssr: false,
});
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  loading: () => <div className="min-h-125" />,
  ssr: false,
});
import { SERVICE_FAQS } from "@/data/faqData";

// Build FAQ schema from data
const faqSchemaItems = SERVICE_FAQS.general.map((faq) => ({
  "@type": "Question" as const,
  name: faq.question,
  acceptedAnswer: {
    "@type": "Answer" as const,
    text: faq.answer,
  },
}));

const CTASection = dynamic(() => import("@/components/home/CTASection"), {
  loading: () => <div className="min-h-75" />,
  ssr: false,
});
const FAQSection = dynamic(() => import("@/components/content/FAQSection"), {
  loading: () => <div className="min-h-100" />,
  ssr: false,
});

const CityLinksSection = dynamic(() => import("@/components/layout/CityLinksSection"), {
  loading: () => <section className="py-16" />,
  ssr: true,
});

interface HomePageProps {
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function HomePage({ reviewStats }: HomePageProps) {
  return (
    <>
      {/* ==========================
          🔹 SEO Meta Tags
      =========================== */}
      <Head>
        <title>Oferte Mutări România 2026 | Compară firme verificate gratuit</title>
        <meta
          name="description"
          content="Primești până la 5 oferte gratuite în 24h pentru mutare. Compară firme verificate din toată România, fără obligații."
        />
        <meta
          name="keywords"
          content="firme de mutări, oferte mutare, mutări România, transport mobilă, servicii mutare, mutări ieftine, comparare oferte mutare, firme mutări verificate"
        />
        <link rel="canonical" href="https://ofertemutare.ro" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro" />
        <meta
          property="og:title"
          content="Compara Oferte pentru Mutarea Ta | Firme Verificate România"
        />
        <meta
          property="og:description"
          content="Până la 5 oferte gratuite în 24h de la firme de mutări verificate. Compară prețuri și alege cea mai bună ofertă, fără obligații."
        />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro" />
        <meta
          name="twitter:title"
          content="Compară Oferte pentru Mutarea Ta | Firme Verificate"
        />
        <meta
          name="twitter:description"
          content="Compară oferte de la firme verificate în 24h. Gratuit, rapid, sigur."
        />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Structured Data - Schema.org for Rich Results */}

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "OferteMutare.ro",
              alternateName: "Oferte Mutare",
              url: "https://ofertemutare.ro",
              logo: "https://ofertemutare.ro/logo.webp",
              description:
                "Platformă online pentru compararea ofertelor de mutări în România. Conectăm clienții cu firme verificate de mutări.",
              foundingDate: "2024",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                areaServed: "RO",
                availableLanguage: ["Romanian"],
              },
              sameAs: ["https://www.facebook.com/profile.php?id=61585990396718"],
            }),
          }}
        />

        {/* WebApplication Schema - OM is a comparison platform, not a local business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "@id": "https://ofertemutare.ro/#webapp",
              name: "OferteMutare.ro",
              url: "https://ofertemutare.ro",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: "Platformă online de comparare oferte de mutări. Conectează clienții cu firme verificate (CUI activ + asigurare) din toată România.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "RON",
                description: "Utilizare gratuită pentru clienți",
              },
            }),
          }}
        />

        {/* Service Schema with Multiple Offerings */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "@id": "https://ofertemutare.ro/#service",
              serviceType: "Platformă comparare oferte mutări",
              broker: {
                "@type": "Organization",
                "@id": "https://ofertemutare.ro/#organization",
                name: "OferteMutare.ro",
              },
              areaServed: [
                {
                  "@type": "City",
                  name: "București",
                },
                {
                  "@type": "City",
                  name: "Cluj-Napoca",
                },
                {
                  "@type": "City",
                  name: "Timișoara",
                },
                {
                  "@type": "City",
                  name: "Iași",
                },
                {
                  "@type": "City",
                  name: "Constanța",
                },
                {
                  "@type": "City",
                  name: "Brașov",
                },
                {
                  "@type": "Country",
                  name: "România",
                },
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicii de Mutări",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Apartamente",
                      description:
                        "Servicii de mutare pentru apartamente cu 1-4 camere oferite de firmele partenere. Include transport, încărcare, descărcare și protecție mobilier.",
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "RON",
                      price: "250-1500",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Case și Vile",
                      description:
                        "Transport profesional pentru case și vile, oferit de firmele partenere verificate. Echipe extinse, utilaje specializate pentru volume mari.",
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "RON",
                      price: "800-3000",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Birouri",
                      description:
                        "Firme partenere specializate în relocare companii și birouri cu minimizarea timpului de downtime.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Studenți",
                      description:
                        "Soluții accesibile pentru mutări mici, cămine și garsoniere, oferite de firmele partenere. Tarife speciale pentru studenți.",
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "RON",
                      price: "250-600",
                    },
                  },
                ],
              },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "RON",
                lowPrice: "250",
                highPrice: "3000",
                offerCount: "50+",
              },
            }),
          }}
        />

        {/* WebSite Schema with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://ofertemutare.ro/#website",
              name: "OferteMutare.ro",
              url: "https://ofertemutare.ro",
              description:
                "Platformă de comparare oferte pentru servicii de mutări în România. Primește până la 5 oferte gratuite în 24h de la firme verificate.",
              inLanguage: "ro-RO",
              publisher: {
                "@type": "Organization",
                "@id": "https://ofertemutare.ro/#organization",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://ofertemutare.ro/mutari/{search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* BreadcrumbList + FAQPage Schemas rendered by components below */}

        {/* FAQPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqSchemaItems,
            }),
          }}
        />


      </Head>

      <Breadcrumbs items={[{ name: "Acasă", href: "/" }]} schemaOnly />
      {reviewStats.reviewCount > 0 && (
        <AggregateRatingSchema ratingValue={reviewStats.ratingValue} reviewCount={reviewStats.reviewCount} />
      )}

      {/* ==========================
          🔹 Page Sections
      =========================== */}

      {/* MobileHero has md:hidden built in, Hero has hidden md:flex built in */}
      <MobileHero />
      <Hero />

      <LogoTicker />

      <Steps />

      <Articles />

      <ClientAccount />
      <PartnerSection />
      <Services />

      <Testimonials />

      {/* FAQ Section */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <FAQSection items={SERVICE_FAQS.general} />
      </div>



      <CityLinksSection />

      <CTASection />
    </>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const reviewStats = await getReviewStats();
  return {
    props: { reviewStats },
    revalidate: 3600,
  };
};
