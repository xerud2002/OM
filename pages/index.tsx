"use client";

import Head from "next/head";
import Hero from "@/components/home/Hero";
import Steps from "@/components/home/Steps";
import ClientAccount from "@/components/home/ClientAccount";
import Services from "@/components/home/Services";
import Articles from "@/components/home/Articles";
import PartnerSection from "@/components/home/PartnerSection";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      {/* ==========================
          🔹 SEO Meta Tags
      =========================== */}
      <Head>
        <title>Oferte Mutare România | Firme de mutări verificate | ofertemutare.ro</title>
        <meta
          name="description"
          content="Compara oferte reale de la firme de mutări verificate din România. Găsește rapid cea mai bună ofertă pentru mutarea ta."
        />
        <meta
          name="keywords"
          content="firme de mutări, oferte mutare, mutări România, transport mobilă, servicii mutare"
        />
        <link rel="canonical" href="https://ofertemutare.ro" />
      </Head>

      {/* ==========================
          🔹 Page Sections
      =========================== */}
      <Hero />
      <Steps />
      <ClientAccount />
      <Services />
      <PartnerSection />
      <Testimonials />
      <Articles />
      <CTASection />
    </>
  );
}
