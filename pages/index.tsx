"use client";

import Head from "next/head";
import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import Steps from "@/components/home/Steps";

// Lazy load below-the-fold components for better LCP
const ClientAccount = dynamic(() => import("@/components/home/ClientAccount"), {
  loading: () => <div className="min-h-[400px]" />,
});
const Services = dynamic(() => import("@/components/home/Services"), {
  loading: () => <div className="min-h-[400px]" />,
});
const Articles = dynamic(() => import("@/components/home/Articles"), {
  loading: () => <div className="min-h-[300px]" />,
});
const PartnerSection = dynamic(() => import("@/components/home/PartnerSection"), {
  loading: () => <div className="min-h-[300px]" />,
});
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  loading: () => <div className="min-h-[400px]" />,
});
const GuaranteeSection = dynamic(() => import("@/components/home/GuaranteeSection"), {
  loading: () => <div className="min-h-[300px]" />,
});
const CTASection = dynamic(() => import("@/components/home/CTASection"), {
  loading: () => <div className="min-h-[200px]" />,
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

        {/* Structured Data - Schema.org for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "OferteMutare.ro",
              url: "https://ofertemutare.ro",
              description: "Platformă de comparare oferte pentru servicii de mutări în România",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://ofertemutare.ro/mutari/{search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              serviceType: "Servicii Mutări",
              provider: {
                "@type": "Organization",
                name: "OferteMutare.ro",
                url: "https://ofertemutare.ro",
                logo: "https://ofertemutare.ro/logo.webp",
              },
              areaServed: {
                "@type": "Country",
                name: "România",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicii de Mutări",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Apartamente",
                      description: "Servicii complete de mutare pentru apartamente",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Case și Vile",
                      description: "Transport profesional pentru case și vile",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mutări Birouri",
                      description: "Relocare companii și birouri",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </Head>

      {/* ==========================
          🔹 Page Sections
      =========================== */}
      <Hero />
      <Steps />
      <ClientAccount />
      <Services />
      <GuaranteeSection />
      <PartnerSection />
      <Testimonials />
      <Articles />
      <CTASection />
    </>
  );
}
