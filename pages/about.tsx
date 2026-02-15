import Head from "next/head";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import {
  UsersIcon as Users,
  ArrowTrendingUpIcon as TrendingUp,
  HeartIcon as Heart,
  ShieldCheckIcon as Shield,
  ClockIcon as Clock,
  CheckCircleIcon as CheckCircle,
  ArrowRightIcon as ArrowRight,
  SparklesIcon as Sparkles,
  BuildingOfficeIcon as Building2,
  HandRaisedIcon as Handshake,
  TrophyIcon as Award,
  StarIcon as Star,
  PhoneIcon as Phone,
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const values = [
    {
      icon: Shield,
      title: "Transparență",
      desc: "Fără costuri ascunse, fără surprize. Toate informațiile sunt clare de la început.",
      gradient: "linear-gradient(to bottom right, #3b82f6, #4f46e5)",
      hoverGradient: "linear-gradient(to bottom right, rgba(59,130,246,0.05), rgba(79,70,229,0.05))",
      decorGradient: "linear-gradient(to bottom right, rgba(59,130,246,0.1), rgba(79,70,229,0.1))",
    },
    {
      icon: Heart,
      title: "Încredere",
      desc: "Colaborăm doar cu firme verificate care respectă standarde ridicate de calitate.",
      gradient: "linear-gradient(to bottom right, #f43f5e, #db2777)",
      hoverGradient: "linear-gradient(to bottom right, rgba(244,63,94,0.05), rgba(219,39,119,0.05))",
      decorGradient: "linear-gradient(to bottom right, rgba(244,63,94,0.1), rgba(219,39,119,0.1))",
    },
    {
      icon: Clock,
      title: "Eficiență",
      desc: "Economisești timp prețios comparând oferte într-un singur loc, rapid și simplu.",
      gradient: "linear-gradient(to bottom right, #10b981, #0d9488)",
      hoverGradient: "linear-gradient(to bottom right, rgba(16,185,129,0.05), rgba(13,148,136,0.05))",
      decorGradient: "linear-gradient(to bottom right, rgba(16,185,129,0.1), rgba(13,148,136,0.1))",
    },
    {
      icon: TrendingUp,
      title: "Economie",
      desc: "Clienții noștri economisesc în medie 40% față de prima ofertă primită.",
      gradient: "linear-gradient(to bottom right, #f59e0b, #ea580c)",
      hoverGradient: "linear-gradient(to bottom right, rgba(245,158,11,0.05), rgba(234,88,12,0.05))",
      decorGradient: "linear-gradient(to bottom right, rgba(245,158,11,0.1), rgba(234,88,12,0.1))",
    },
  ];

  const timeline = [
    {
      year: "2010",
      title: "Începutul în domeniu",
      desc: "Am intrat în industria mutărilor și am învățat din prima mână provocările acestui domeniu.",
    },
    {
      year: "15+ ani",
      title: "Experiență acumulată",
      desc: "Peste 15 ani de experiență în mutări naționale ne-au arătat cât de greu este să găsești clienți și firme de încredere.",
    },
    {
      year: "2026",
      title: "Soluția: Ofertemutare.ro",
      desc: "Am creat o platformă care aduce împreună clienții și companiile de transport, cu transparență totală.",
    },
    {
      year: "Azi",
      title: "Misiunea noastră",
      desc: "Continuăm să construim încredere între clienți și firme, făcând mutările mai simple și mai sigure pentru toți.",
    },
  ];

  return (
    <>
      <Head>
        <title>
          Despre Noi | OferteMutare.ro - Platformă de Mutări în România
        </title>
        <meta name="author" content="Ofertemutare Ltd" />
        <meta
          name="description"
          content="Povestea OferteMutare.ro, operată de Ofertemutare Ltd — platforma care conectează clienții cu firme de mutări verificate din România. Transparență și prețuri corecte."
        />
        <meta
          name="keywords"
          content="despre ofertemutare, platformă mutări România, firme mutări verificate, echipa ofertemutare"
        />
        <link rel="canonical" href="https://ofertemutare.ro/about" />
        <meta property="og:title" content="Despre Noi | OferteMutare.ro" />
        <meta
          property="og:description"
          content="Platforma care conectează clienții cu firme de mutări verificate din România."
        />
        <meta property="og:url" content="https://ofertemutare.ro/about" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://ofertemutare.ro/pics/team.webp"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/about" />
        <meta name="twitter:title" content="Despre Noi | OferteMutare.ro" />
        <meta
          name="twitter:description"
          content="Platforma care conectează clienții cu firme de mutări verificate din România."
        />
        <meta
          name="twitter:image"
          content="https://ofertemutare.ro/pics/team.webp"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              name: "Despre Noi | OferteMutare.ro",
              description:
                "Descoperă povestea OferteMutare.ro - platforma care conectează clienții cu firme de mutări verificate din România.",
              url: "https://ofertemutare.ro/about",
              mainEntity: {
                "@type": "Organization",
                name: "Ofertemutare Ltd",
                url: "https://ofertemutare.ro",
                logo: "https://ofertemutare.ro/pics/index.webp",
                foundingDate: "2026",
                description:
                  "Platforma care conectează clienții cu firme de mutări verificate din România. Transparență, siguranță și prețuri corecte.",
                email: "info@ofertemutare.ro",
                areaServed: {
                  "@type": "Country",
                  name: "România",
                },
                sameAs: [
                  "https://www.facebook.com/profile.php?id=61585990396718",
                ],
              },
            }),
          }}
        />
      </Head>

      <Breadcrumbs items={[{ name: "Acasă", href: "/" }, { name: "Despre Noi" }]} />

      <main className="min-h-screen overflow-x-hidden bg-linear-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section - Enhanced with Parallax */}
        <section
          ref={heroRef}
          className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-32"
        >
          {/* Animated Background Elements */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ y: heroY }}
          >
            <div className="absolute top-0 left-1/4 h-125 w-125 -translate-y-1/2 rounded-full bg-linear-to-br from-emerald-200/40 to-teal-100/30 blur-[120px]" />
            <div className="absolute right-1/4 bottom-0 h-100 w-100 translate-y-1/2 rounded-full bg-linear-to-br from-sky-200/40 to-indigo-100/30 blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-purple-100/20 to-pink-100/20 blur-[100px]" />
          </motion.div>

          {/* Grid Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />

          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              style={{ opacity: heroOpacity }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-4xl text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 px-5 py-2.5 shadow-sm"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="text-sm font-semibold text-emerald-700">
                  Povestea noastră
                </span>
              </motion.div>

              <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Facem mutările
                <br />
                <span className="relative">
                  <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                    simple și accesibile
                  </span>
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.2 }}
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 400 12"
                    fill="none"
                  >
                    <motion.path
                      d="M2 10C50 4 150 2 200 6C250 10 350 4 398 8"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.8, duration: 1.2 }}
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0"
                        y1="0"
                        x2="400"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#059669" />
                        <stop offset="50%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>
              </h1>

              <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Ofertemutare.ro s-a născut dintr-o frustrare comună: cât de greu
                era să găsești o firmă de mutări de încredere la un preț corect.
                Am creat platforma pe care ne-am fi dorit-o noi înșine.
              </p>

              {/* Quick CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link
                  href="/customer/dashboard"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
                >
                  Primește oferte gratuite
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#misiune"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/80 px-8 py-4 font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-emerald-200 hover:bg-emerald-50"
                >
                  Află mai multe
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section - Enhanced */}
        <section id="misiune" className="relative py-20 sm:py-32">
          {/* Background accent */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-emerald-50/30 to-transparent" />

          <div className="relative z-10 container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
                {/* Image - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative order-2 lg:order-1"
                >
                  <div className="relative">
                    {/* Decorative frame */}
                    <div className="absolute -inset-4 rounded-4xl bg-linear-to-br from-emerald-200/50 via-teal-100/30 to-sky-200/50 blur-2xl" />

                    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 to-sky-50 p-6 sm:p-10">
                      {/* Decorative orbs */}
                      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
                      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

                      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <Image
                          src="/pics/partner.webp"
                          alt="Echipa Ofertemutare.ro"
                          fill
                          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 500px"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          quality={75}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Content - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="order-1 lg:order-2"
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-sky-50 to-indigo-50 px-5 py-2.5 shadow-sm">
                    <TrendingUp className="h-4 w-4 text-sky-600" />
                    <span className="text-sm font-semibold text-sky-700">
                      Misiunea noastră
                    </span>
                  </div>

                  <h2 className="mb-6 text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                    Să eliminăm stresul din{" "}
                    <span className="bg-linear-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                      procesul de mutare
                    </span>
                  </h2>

                  <div className="mb-8 space-y-5">
                    <p className="text-lg leading-relaxed text-slate-600">
                      Credem că toată lumea merită o mutare fără griji. De aceea
                      am construit o platformă care pune în legătură direct
                      clienții cu firmele de mutări verificate, eliminând
                      intermediarii și costurile nejustificate.
                    </p>

                    <p className="text-lg leading-relaxed text-slate-600">
                      Fiecare firmă parteneră trece printr-un proces de
                      verificare riguroasă. Ne asigurăm că au experiență,
                      echipamente adecvate și, cel mai important, recenzii
                      pozitive de la clienți reali.
                    </p>
                  </div>

                  {/* Enhanced badges grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { text: "Firme verificate", icon: Shield },
                      { text: "Prețuri transparente", icon: TrendingUp },
                      { text: "Suport dedicat", icon: Phone },
                      { text: "Fără comisioane", icon: CheckCircle },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-2.5 rounded-xl bg-emerald-50/80 px-4 py-3 backdrop-blur-sm"
                      >
                        <item.icon className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700">
                          {item.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section - NEW */}
        <section className="relative py-20 sm:py-28">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto mb-16 max-w-3xl text-center"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2.5">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">
                  Parcursul nostru
                </span>
              </div>

              <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                <span className="rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-1 text-white">
                  Povestea noastră
                </span>
              </h2>

              <p className="text-lg text-slate-600">
                15+ ani de experiență în mutări ne-au inspirat să creăm o
                platformă de încredere.
              </p>
            </motion.div>

            <div className="mx-auto max-w-4xl">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-0 left-4 hidden h-full w-0.5 bg-linear-to-b from-emerald-500 via-teal-500 to-sky-500 sm:left-1/2 sm:block sm:-translate-x-1/2" />

                {timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className={`relative mb-8 flex flex-col sm:mb-12 sm:flex-row ${
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    {/* Content card */}
                    <div
                      className={`w-full sm:w-1/2 ${i % 2 === 0 ? "sm:pr-12" : "sm:pl-12"}`}
                    >
                      <motion.div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                        <div className="mb-3 inline-flex rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 px-3 py-1">
                          <span className="text-sm font-bold text-white">
                            {item.year}
                          </span>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="text-slate-600">{item.desc}</p>
                      </motion.div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute top-6 left-4 hidden h-4 w-4 rounded-full border-4 border-white bg-emerald-500 shadow-lg sm:left-1/2 sm:block sm:-translate-x-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - Enhanced */}
        <section className="relative py-20 sm:py-28">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-slate-50" />

          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto mb-16 max-w-3xl text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-linear-to-r from-purple-50 to-pink-50 px-5 py-2.5 shadow-sm">
                <Heart className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">
                  Valorile noastre
                </span>
              </div>

              <h2 className="mb-5 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Principiile care{" "}
                <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ne ghidează
                </span>
              </h2>

              <p className="text-lg text-slate-600">
                Fiecare decizie pe care o luăm se bazează pe aceste valori
                fundamentale.
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-7 shadow-lg transition-shadow hover:shadow-2xl"
                  >
                    {/* Hover gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
                      style={{ backgroundImage: value.hoverGradient }}
                    />

                    {/* Icon */}
                    <div
                      className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform"
                      style={{ backgroundImage: value.gradient }}
                    >
                      <value.icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-3 text-xl font-bold text-slate-900">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {value.desc}
                    </p>

                    {/* Decorative corner */}
                    <div
                      className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full blur-2xl transition-opacity group-hover:opacity-100"
                      style={{ backgroundImage: value.decorGradient }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Help Section - Enhanced */}
        <section className="relative py-20 sm:py-28">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-amber-50/20 to-transparent" />

          <div className="relative z-10 container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
                {/* Content - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-50 to-orange-50 px-5 py-2.5 shadow-sm">
                    <Handshake className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700">
                      Cum te ajutăm
                    </span>
                  </div>

                  <h2 className="mb-8 text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                    Un proces simplu,{" "}
                    <span className="bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                      rezultate excelente
                    </span>
                  </h2>

                  <div className="space-y-6">
                    {[
                      {
                        icon: Users,
                        title: "Pentru Clienți",
                        desc: "Completezi o singură cerere și primești până la 5 oferte de la firme verificate. Compari prețuri, citești recenzii și alegi în cunoștință de cauză.",
                        gradient: "from-emerald-500 to-teal-600",
                      },
                      {
                        icon: Building2,
                        title: "Pentru Firme",
                        desc: "Accesezi cereri reale de la clienți interesați din toată țara. Fără costuri de publicitate, plătești doar pentru lead-urile care contează.",
                        gradient: "from-sky-500 to-indigo-600",
                      },
                      {
                        icon: Award,
                        title: "Calitate Garantată",
                        desc: "Monitorizăm constant feedback-ul și menținem standarde ridicate. Firmele cu recenzii negative sunt eliminate din platformă.",
                        gradient: "from-amber-500 to-orange-600",
                      },
                    ].map((item, i) => {
                      const gradientMap: Record<string, string> = {
                        "from-emerald-500 to-teal-600": "linear-gradient(to bottom right, #10b981, #0d9488)",
                        "from-sky-500 to-indigo-600": "linear-gradient(to bottom right, #0ea5e9, #4f46e5)",
                        "from-amber-500 to-orange-600": "linear-gradient(to bottom right, #f59e0b, #ea580c)",
                      };
                      const bgGradient = gradientMap[item.gradient] || "linear-gradient(to bottom right, #10b981, #0d9488)";
                      return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        whileHover={{ x: 5 }}
                        className="group flex gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-md transition-all hover:shadow-xl"
                      >
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform"
                          style={{ backgroundImage: bgGradient }}
                        >
                          <item.icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-bold text-slate-900">
                            {item.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-600">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Image - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative">
                    {/* Decorative frame */}
                    <div className="absolute -inset-4 rounded-4xl bg-linear-to-br from-amber-200/50 via-orange-100/30 to-rose-200/50 blur-2xl" />

                    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 p-6 sm:p-10">
                      {/* Decorative orbs */}
                      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl" />
                      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-orange-200/40 blur-3xl" />

                      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <Image
                          src="/pics/oferta.webp"
                          alt="Platforma Ofertemutare.ro"
                          fill
                          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 500px"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          quality={75}
                        />
                      </div>

                      {/* Floating badge */}
                      <motion.div
                        initial={{ scale: 0, rotate: 10 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.6,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6"
                      >
                        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-xl sm:p-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                              style={{ backgroundImage: "linear-gradient(to bottom right, #f59e0b, #ea580c)" }}
                            >
                              <Award className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-xl font-bold text-slate-900">
                                Top Rating
                              </p>
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-amber-400 text-amber-400"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="relative py-20 sm:py-28">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-5xl overflow-hidden rounded-4xl border border-emerald-200/50 bg-linear-to-br from-emerald-50 via-white to-sky-50 p-10 text-center shadow-2xl sm:p-16"
            >
              {/* Decorative elements */}
              <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-emerald-200/30 blur-3xl" />
              <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-sky-200/30 blur-3xl" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-size-[30px_30px]" />

              <div className="relative">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2.5 shadow-sm"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="text-sm font-semibold text-emerald-700">
                    Începe acum
                  </span>
                </motion.div>

                <h2 className="mb-5 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                  Gata să economisești la
                  <br className="hidden sm:block" />
                  <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    următoarea mutare?
                  </span>
                </h2>

                <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
                  Alătură-te celor peste 500 de clienți mulțumiți care au găsit
                  firma de mutări perfectă prin platforma noastră.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/customer/dashboard"
                      className="group inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-10 py-5 text-lg font-semibold text-white shadow-xl shadow-emerald-500/25 transition-all hover:shadow-2xl hover:shadow-emerald-500/30"
                    >
                      Primește oferte gratuite
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-10 py-5 text-lg font-semibold text-slate-700 transition-all hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <Phone className="h-5 w-5" />
                    Contactează-ne
                  </Link>
                </div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-slate-200 pt-10"
                >
                  <div className="flex items-center gap-2 text-slate-600">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">100% Gratuit</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">Răspuns în 24h</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">Fără obligații</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
