"use client";

import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  FormInput,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { User } from "firebase/auth";
import { onAuthChange, logout } from "@/services/firebase";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

/* ================================
   🔹 HomePage
================================ */
export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => onAuthChange(setUser), []);

  const handleGetOffers = () => {
    if (user) router.push("/form");
    else {
      localStorage.setItem("redirectAfterLogin", "form");
      router.push("/customer/auth");
    }
  };

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ofertemutare.ro",
      url: "https://ofertemutare.ro",
      description:
        "Compara oferte de la firme de mutări verificate din România. Platforma ofertemutare.ro conectează clienții cu companii de mutări sigure și profesionale.",
      inLanguage: "ro",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://ofertemutare.ro/form?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: "ofertemutare.ro",
        url: "https://ofertemutare.ro",
        logo: "https://ofertemutare.ro/logo.png",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+40 700 000 000",
          contactType: "customer service",
          areaServed: "RO",
          availableLanguage: ["ro", "en"],
        },
      },
    }),
    []
  );

  // memoized static data (less re-renders)
  const steps = useMemo(
    () => [
      {
        icon: <FormInput className="text-emerald-600" size={38} />,
        title: "Completează cererea ta de mutare",
        desc: "Spune-ne ce trebuie mutat, de unde și unde. Formularul este rapid, intuitiv și complet gratuit.",
      },
      {
        icon: <Users className="text-emerald-600" size={38} />,
        title: "Primești oferte verificate în 24 de ore",
        desc: "Firmele partenere îți trimit oferte personalizate. Poți compara prețuri și condiții fără nicio obligație.",
      },
      {
        icon: <CheckCircle className="text-emerald-600" size={38} />,
        title: "Alegi cea mai bună variantă pentru tine",
        desc: "Analizezi recenziile, compari prețurile și alegi firma care îți oferă cea mai bună combinație de preț, timp și siguranță.",
      },
    ],
    []
  );

  const services = useMemo(
    () => [
      {
        img: "/pics/packing1.png",
        title: "Împachetare profesională",
        desc: "Obiectele fragile, electronicele și mobilierul sunt împachetate cu materiale de protecție de calitate.",
      },
      {
        img: "/pics/dism.png",
        title: "Demontare & reasamblare mobilier",
        desc: "Echipele se ocupă de dezasamblarea și reasamblarea mobilierului rapid și fără daune.",
      },
      {
        img: "/pics/loading4.png",
        title: "Transport sigur și rapid",
        desc: "De la garsoniere până la case întregi, transport curat și echipat corespunzător.",
      },
      {
        img: "/pics/storage.png",
        title: "Depozitare temporară",
        desc: "Ai nevoie de timp între locații? Obiectele tale sunt păstrate în spații sigure și monitorizate.",
      },
      {
        img: "/pics/disposal.png",
        title: "Debarasare responsabilă",
        desc: "Scapă ușor de mobilierul vechi; partenerii noștri le colectează și elimină ecologic.",
      },
    ],
    []
  );

  const articles = useMemo(
    () => [
      {
        title: "Top 5 trucuri pentru împachetarea eficientă a obiectelor fragile",
        desc: "Află cum să eviți deteriorarea obiectelor tale preferate prin tehnici folosite de profesioniști.",
        link: "/articles/impachetare",
      },
      {
        title: "Cum îți pregătești locuința pentru ziua mutării fără stres",
        desc: "De la etichetarea cutiilor până la protejarea podelelor – iată cum să ai o zi de mutare organizată și calmă.",
        link: "/articles/pregatire",
      },
      {
        title: "De ce o vizită virtuală (survey) te ajută să primești o ofertă corectă",
        desc: "Un video call rapid îți oferă o evaluare precisă și te ajută să economisești timp și bani.",
        link: "/articles/survey",
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>
          Oferte mutare România | Firme de mutări verificate | ofertemutare.ro
        </title>
        <meta
          name="description"
          content="Compara oferte reale de la firme de mutări verificate din România."
        />
        <meta
          property="og:title"
          content="ofertemutare.ro - Firme de mutări verificate"
        />
        <meta
          property="og:description"
          content="Cere oferte de la companii verificate din România. Rapid, sigur și fără stres."
        />
        <link rel="canonical" href="https://ofertemutare.ro" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Hero */}
      <section className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="/hero.webp"
          alt="Firme de mutări România"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-6">
            Găsește firma de mutări potrivită pentru tine
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Compară oferte de la companii verificate și alege varianta ideală
            pentru mutarea ta.
          </p>
          <button
            onClick={handleGetOffers}
            className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Obține oferte acum
          </button>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-gradient-to-br from-white to-emerald-50">
        <FadeInWhenVisible>
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-700">
              Cum funcționează platforma{" "}
              <span className="text-sky-500">Ofertemutare.ro</span>?
            </h2>
            <p className="text-gray-600 mt-3 text-lg max-w-3xl mx-auto">
              Cu doar câteva click-uri, primești oferte verificate de la firme
              din zona ta. Totul 100% online, fără apeluri inutile.
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.04, y: -6 }}
              className="relative bg-white/85 p-8 rounded-3xl shadow-lg border border-emerald-100 hover:shadow-emerald-200/70 transition-all duration-300 group"
            >
              <div className="flex justify-center mb-5 mt-4">{s.icon}</div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-3">
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/form"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:scale-105 transition-all"
          >
            Începe acum <ArrowRight size={20} />
          </Link>
          <p className="text-gray-500 mt-3 text-sm">
            Fără costuri ascunse, fără stres — doar oferte reale.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gradient-to-br from-white via-emerald-50/50 to-sky-50/50">
        <FadeInWhenVisible>
          <div className="max-w-6xl mx-auto text-center mb-16 px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
              Servicii oferite de companiile partenere
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Fie că te muți în același oraș sau în alt colț al țării, partenerii
              noștri oferă servicii complete, flexibile și sigure.
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto px-6">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 10px 30px rgba(16,185,129,0.2)",
              }}
              className="bg-white/85 p-6 rounded-3xl shadow-md border border-emerald-100 hover:shadow-emerald-200/80 flex flex-col justify-between transition-all"
            >
              <motion.img
                src={s.img}
                alt={s.title}
                className="rounded-2xl object-cover w-full h-40 mb-4"
                whileHover={{ scale: 1.05 }}
              />
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 bg-gradient-to-b from-white to-emerald-50">
        <FadeInWhenVisible>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-14">
              Sfaturi utile pentru o mutare reușită
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {articles.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white/90 border border-emerald-100 shadow-md hover:shadow-emerald-200/60 p-8 rounded-3xl flex flex-col justify-between transition-all"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-700 mb-2 leading-snug">
                      {a.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {a.desc}
                    </p>
                  </div>
                  <Link
                    href={a.link}
                    className="mt-5 inline-flex items-center gap-1 text-emerald-600 font-medium hover:underline transition-all"
                  >
                    Citește mai mult <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInWhenVisible>
      </section>
    </>
  );
}
