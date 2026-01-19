"use client";

import Head from "next/head";
import dynamic from "next/dynamic";
import MobileHero from "@/components/home/MobileHero";

// Lazy load Desktop Hero to reduce initial bundle size (it's heavy with framer-motion)
const Hero = dynamic(() => import("@/components/home/Hero"), {
  loading: () => <div className="hidden md:block min-h-[85vh] bg-slate-50" />,
  ssr: true,
});
// Lazy load ALL below-the-fold components for better LCP
const Steps = dynamic(() => import("@/components/home/Steps"), {
  loading: () => <div className="min-h-100" />,
  ssr: true,
});
const TrustSignals = dynamic(() => import("@/components/cro/TrustSignals"), {
  loading: () => null,
  ssr: false,
});
const UrgencyBanner = dynamic(() => import("@/components/cro/UrgencyBanner"), {
  loading: () => null,
  ssr: false,
});
const AggregateRatingSchema = dynamic(
  () => import("@/components/seo/SchemaMarkup").then((mod) => ({ default: mod.AggregateRatingSchema })),
  { ssr: true }
);
const ClientAccount = dynamic(() => import("@/components/home/ClientAccount"), {
  loading: () => <div className="min-h-100" />,
});
const Services = dynamic(() => import("@/components/home/Services"), {
  loading: () => <div className="min-h-100" />,
});
const Articles = dynamic(() => import("@/components/home/Articles"), {
  loading: () => <div className="min-h-75" />,
});
const PartnerSection = dynamic(() => import("@/components/home/PartnerSection"), {
  loading: () => <div className="min-h-75" />,
});
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  loading: () => <div className="min-h-100" />,
});
const GuaranteeSection = dynamic(() => import("@/components/home/GuaranteeSection"), {
  loading: () => <div className="min-h-75" />,
});
const CTASection = dynamic(() => import("@/components/home/CTASection"), {
  loading: () => <div className="min-h-50" />,
});

export default function HomePage() {
  return (
    <>
      {/* ==========================
          🔹 SEO Meta Tags
      =========================== */}
      <Head>
        <title>Oferte Mutări România 2026 → Firme Verificate | Economisești 40%</title>
        <meta
          name="description"
          content="🚚 Primești 3-5 oferte GRATUITE în 24h pentru mutarea ta! Compară firme de mutări verificate din toată România. Economisești până la 40% → 100% gratuit, fără obligații!"
        />
        <meta
          name="keywords"
          content="firme de mutări, oferte mutare, mutări România, transport mobilă, servicii mutare, mutări ieftine, comparare oferte mutare, firme mutări verificate"
        />
        <link rel="canonical" href="https://ofertemutare.ro" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro" />
        <meta property="og:title" content="Compara Oferte pentru Mutarea Ta | Firme Verificate România" />
        <meta
          property="og:description"
          content="🚚 3-5 oferte GRATUITE în 24h de la cele mai bune firme de mutări! Compară prețuri și economisește până la 40%. Zero obligații!"
        />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ofertemutare.ro" />
        <meta
          property="twitter:title"
          content="Compara Oferte pentru Mutarea Ta | Economisești 40%"
        />
        <meta
          property="twitter:description"
          content="🚚 Compară oferte de la firme verificate în 24h. Gratuit, rapid, sigur!"
        />
        <meta property="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />

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
              description: "Platformă online pentru compararea ofertelor de mutări în România. Conectăm clienții cu firme verificate de mutări.",
              foundingDate: "2024",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                areaServed: "RO",
                availableLanguage: ["Romanian"]
              },
              sameAs: [
                "https://www.facebook.com/profile.php?id=61585990396718"
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "247",
                bestRating: "5",
                worstRating: "1"
              }
            }),
          }}
        />

        {/* LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://ofertemutare.ro/#business",
              name: "OferteMutare.ro",
              image: "https://ofertemutare.ro/pics/index.webp",
              url: "https://ofertemutare.ro",
              priceRange: "Lei 250-3000",
              address: {
                "@type": "PostalAddress",
                addressCountry: "RO",
                addressRegion: "România"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 45.9432,
                longitude: 24.9668
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "14:00"
                }
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "247"
              }
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
              serviceType: "Servicii Mutări și Relocări",
              provider: {
                "@type": "Organization",
                "@id": "https://ofertemutare.ro/#organization",
                name: "OferteMutare.ro"
              },
              areaServed: [
                {
                  "@type": "City",
                  name: "București"
                },
                {
                  "@type": "City",
                  name: "Cluj-Napoca"
                },
                {
                  "@type": "City",
                  name: "Timișoara"
                },
                {
                  "@type": "City",
                  name: "Iași"
                },
                {
                  "@type": "City",
                  name: "Constanța"
                },
                {
                  "@type": "City",
                  name: "Brașov"
                },
                {
                  "@type": "Country",
                  name: "România"
                }
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
                      description: "Servicii complete de mutare pentru apartamente cu 1-4 camere. Include transport, încărcare, descărcare și protecție mobilier.",
                      provider: {
                        "@type": "Organization",
                        name: "OferteMutare.ro"
                      }
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "RON",
                      price: "250-1500"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Case și Vile",
                      description: "Transport profesional pentru case și vile. Echipă extinsă, utilaje specializate pentru volume mari.",
                      provider: {
                        "@type": "Organization",
                        name: "OferteMutare.ro"
                      }
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "RON",
                      price: "800-3000"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Birouri",
                      description: "Relocare companii și birouri cu minimizarea timpului de downtime. Servicii dedicate business.",
                      provider: {
                        "@type": "Organization",
                        name: "OferteMutare.ro"
                      }
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Studenți",
                      description: "Soluții accesibile pentru mutări mici, cămine și garsoniere. Tarife speciale pentru studenți.",
                      provider: {
                        "@type": "Organization",
                        name: "OferteMutare.ro"
                      }
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "RON",
                      price: "250-600"
                    }
                  }
                ]
              },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "RON",
                lowPrice: "250",
                highPrice: "3000",
                offerCount: "50+"
              }
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
              description: "Platformă de comparare oferte pentru servicii de mutări în România. Primește 3-5 oferte gratuite în 24h de la firme verificate.",
              inLanguage: "ro-RO",
              publisher: {
                "@type": "Organization",
                "@id": "https://ofertemutare.ro/#organization"
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://ofertemutare.ro/mutari/{search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />

        {/* BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Acasă",
                  item: "https://ofertemutare.ro"
                }
              ]
            }),
          }}
        />
      </Head>

      {/* Schema Markup */}
      <AggregateRatingSchema ratingValue="4.8" reviewCount="127" />

      {/* ==========================
          🔹 Page Sections
      =========================== */}
      <div className="md:hidden">
        <MobileHero />
      </div>
      <div className="hidden md:block">
        <Hero />
      </div>
      
      {/* CRO: Urgency & Trust */}
      <div className="mx-auto max-w-7xl px-4 -mt-8 mb-8">
        <UrgencyBanner />
      </div>
      
      <Steps />
      
      {/* Trust Signals */}
      <div className="mx-auto max-w-7xl px-4 py-4 border-t border-b border-gray-100 bg-gray-50">
        <TrustSignals className="justify-center" />
      </div>
      
      <ClientAccount />
      <PartnerSection />
      <Services />
      

      
      <GuaranteeSection />

      <Testimonials />
      <Articles />
      <CTASection />
    </>
  );
}
