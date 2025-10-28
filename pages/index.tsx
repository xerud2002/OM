"use client";

import Head from "next/head";
import Hero from "@/components/home/Hero";
import Steps from "@/components/home/Steps";
import Services from "@/components/home/Services";
import Articles from "@/components/home/Articles";
import ClientAccount from "@/components/home/ClientAccount";


export default function HomePage() {
  return (
    <>
      {/* ==========================
          🔹 SEO Meta Tags
      =========================== */}
      <Head>
        <title>
          Oferte mutare România | Firme de mutări verificate | ofertemutare.ro
        </title>
        <meta
          name="description"
          content="Compara oferte reale de la firme de mutări verificate din România. Găsește rapid cea mai bună ofertă pentru mutarea ta."
        />
        <meta
          name="keywords"
          content="firme de mutări, oferte mutare, mutări România, transport mobilă, servicii mutare"
        />
        <meta
          property="og:title"
          content="ofertemutare.ro - Firme de mutări verificate"
        />
        <meta
          property="og:description"
          content="Cere oferte reale de la companii de mutări verificate din România. Rapid, sigur și fără stres."
        />
        <meta
          property="og:image"
          content="https://ofertemutare.ro/og-image.jpg"
        />
        <meta property="og:url" content="https://ofertemutare.ro" />
        <link rel="canonical" href="https://ofertemutare.ro" />
      </Head>

      {/* ==========================
          🔹 Page Sections
      =========================== */}
      <Hero />
      <Steps />
      {/* <ClientAccount />  ← you can uncomment when added */}
      <Services />
      <Articles />
    </>
  );
}
