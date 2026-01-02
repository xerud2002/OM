"use client";

import Head from "next/head";
import Hero from "@/components/home/Hero";
import Steps from "@/components/home/Steps";
import ClientAccount from "@/components/home/ClientAccount";
import Services from "@/components/home/Services";
import Articles from "@/components/home/Articles";
import PartnerSection from "@/components/home/PartnerSection";
import Testimonials from "@/components/home/Testimonials";
import GuaranteeSection from "@/components/home/GuaranteeSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      {/* ==========================
          🔹 SEO Meta Tags
      =========================== */}
      <Head>
        <title>Oferte Mutare România 2026 | Economisește până la 40% | Firme Verificate</title>
        <meta
          name="description"
          content="Primești 3-5 oferte GRATUITE în 24h de la cele mai bune firme de mutări din România. Compari, alegi și economisești. 100% gratuit, fără obligații. 500+ clienți mulțumiți!"
        />
        <meta
          name="keywords"
          content="firme de mutări, oferte mutare, mutări România, transport mobilă, servicii mutare, mutări ieftine, comparare oferte mutare, firme mutări verificate"
        />
        <link rel="canonical" href="https://ofertemutare.ro" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro" />
        <meta property="og:title" content="Oferte Mutare România 2026 | Economisești până la 40%" />
        <meta
          property="og:description"
          content="Primești 3-5 oferte GRATUITE în 24h de la firme verificate. 100% gratuit!"
        />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ofertemutare.ro" />
        <meta
          property="twitter:title"
          content="Oferte Mutare România 2026 | Economisești până la 40%"
        />
        <meta
          property="twitter:description"
          content="Primești 3-5 oferte GRATUITE în 24h de la firme verificate!"
        />
        <meta property="twitter:image" content="https://ofertemutare.ro/pics/index.png" />
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
