import Head from "next/head";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  EnvelopeIcon as Mail,
  MapPinIcon as MapPin,
  ChatBubbleLeftRightIcon as MessageCircle,
  BuildingOfficeIcon as Building2,
  UserIcon as User,
  ClockIcon as Clock,
  CheckCircleIcon as CheckCircle,
  ExclamationCircleIcon as AlertCircle,
  SparklesIcon as Sparkles,
  ArrowRightIcon as ArrowRight,
  ShieldCheckIcon as Shield,
  BoltIcon as Zap,
  QuestionMarkCircleIcon as HelpCircle,
  PaperAirplaneIcon as Send,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    type: "client",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contactForm",
          data: {
            name: formData.name,
            email: formData.email,
            phone: "",
            message: `[${formData.subject}] (${formData.type})\n\n${formData.message}`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Email sending failed");
      }

      setSent(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        type: "client",
        message: "",
      });
    } catch {
      setError("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Clienți",
      value: "info@ofertemutare.ro",
      href: "mailto:info@ofertemutare.ro",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Mail,
      title: "Email Parteneri",
      value: "info@ofertemutare.ro",
      href: "mailto:info@ofertemutare.ro",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Clock,
      title: "Program Suport",
      value: "Luni - Vineri: 9:00 - 18:00",
      href: null,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: MapPin,
      title: "Locație",
      value: "București, România",
      href: null,
      gradient: "from-rose-500 to-pink-600",
    },
  ];

  const faqs = [
    {
      q: "Cât durează să primesc oferte?",
      a: "De obicei, primești primele oferte în mai puțin de 24 de ore după publicarea cererii.",
    },
    {
      q: "Este gratuit serviciul pentru clienți?",
      a: "Da! Platforma este complet gratuită pentru clienții care caută firme de mutări.",
    },
    {
      q: "Cum devin partener?",
      a: "Accesează secțiunea 'Devino Partener' și completează formularul de înregistrare.",
    },
  ];

  return (
    <>
      <Head>
        <title>Contact | OferteMutare.ro - Suport și Întrebări</title>
        <meta name="author" content="Ofertemutare Ltd" />
        <meta
          name="description"
          content="Contactează echipa Ofertemutare Ltd (OferteMutare.ro) pentru întrebări, suport sau parteneriate. Răspundem în maxim 24 de ore. Email și formular de contact."
        />
        <meta
          name="keywords"
          content="contact ofertemutare, suport mutări, întrebări mutare, parteneriat firme mutări, contact mutari romania"
        />
        <link rel="canonical" href="https://ofertemutare.ro/contact" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/contact" />
        <meta property="og:title" content="Contact | OferteMutare.ro" />
        <meta
          property="og:description"
          content="Contactează echipa OferteMutare.ro pentru suport rapid. Răspundem în maxim 24h."
        />
        <meta
          property="og:image"
          content="https://ofertemutare.ro/pics/index.webp"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/contact" />
        <meta name="twitter:title" content="Contact | OferteMutare.ro" />
        <meta
          name="twitter:description"
          content="Contactează-ne pentru întrebări sau suport. Răspundem în 24h."
        />
        <meta
          name="twitter:image"
          content="https://ofertemutare.ro/pics/index.webp"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "Contact | OferteMutare.ro",
              description:
                "Contactează echipa Ofertemutare Ltd pentru întrebări, suport sau parteneriate. Răspundem în maxim 24 de ore.",
              url: "https://ofertemutare.ro/contact",
              mainEntity: {
                "@type": "LocalBusiness",
                name: "Ofertemutare Ltd",
                url: "https://ofertemutare.ro",
                email: "info@ofertemutare.ro",
                image: "https://ofertemutare.ro/pics/index.webp",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "București",
                  addressCountry: "RO",
                },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                    ],
                    opens: "09:00",
                    closes: "18:00",
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: "Saturday",
                    opens: "10:00",
                    closes: "14:00",
                  },
                ],
                priceRange: "$$",
                areaServed: {
                  "@type": "Country",
                  name: "România",
                },
              },
            }),
          }}
        />
      </Head>

      <main className="min-h-screen overflow-x-hidden bg-linear-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24"
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
                  <MessageCircle className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="text-sm font-semibold text-emerald-700">
                  Suntem aici pentru tine
                </span>
              </motion.div>

              <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Contactează
                <br />
                <span className="relative">
                  <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                    echipa noastră
                  </span>
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.2 }}
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <motion.path
                      d="M2 10C40 4 100 2 150 6C200 10 260 4 298 8"
                      stroke="url(#contactGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.8, duration: 1.2 }}
                    />
                    <defs>
                      <linearGradient
                        id="contactGradient"
                        x1="0"
                        y1="0"
                        x2="300"
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

              <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Fie că ești client sau companie de mutări, echipa noastră îți
                răspunde în cel mai scurt timp. Suntem aici să te ajutăm!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="relative py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-lg transition-all hover:border-emerald-200 hover:shadow-xl"
                  >
                    <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-linear-to-br from-emerald-100/50 to-teal-100/50 blur-2xl" />
                    <div className="relative">
                      <div
                        className={`mb-4 inline-flex rounded-xl bg-linear-to-br ${item.gradient} p-3 shadow-lg`}
                      >
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-1 font-bold text-slate-900">
                        {item.title}
                      </h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm text-slate-600 transition-colors hover:text-emerald-600"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-slate-600">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative py-16 sm:py-24">
          {/* Background accent */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-emerald-50/30 to-transparent" />

          <div className="relative z-10 container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="relative">
                    {/* Decorative frame */}
                    <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-emerald-200/50 via-teal-100/30 to-sky-200/50 blur-2xl" />

                    <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl sm:p-10">
                      {/* Decorative orbs */}
                      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-emerald-100/40 blur-3xl" />
                      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-sky-100/40 blur-3xl" />

                      <div className="relative">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-2">
                          <Send className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-700">
                            Formular contact
                          </span>
                        </div>

                        <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                          Trimite-ne un mesaj
                        </h2>
                        <p className="mb-8 text-slate-600">
                          Completează formularul și îți răspundem în cel mai
                          scurt timp.
                        </p>

                        {sent ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 text-center"
                          >
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
                              <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-slate-900">
                              Mesaj trimis! 🎉
                            </h3>
                            <p className="mb-6 text-slate-600">
                              Îți mulțumim pentru mesaj. Te vom contacta în cel
                              mai scurt timp.
                            </p>
                            <button
                              onClick={() => setSent(false)}
                              className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                              <ArrowRight className="h-4 w-4 rotate-180" />
                              Trimite alt mesaj
                            </button>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Type Selector */}
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, type: "client" })
                                }
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3.5 font-semibold transition-all ${
                                  formData.type === "client"
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                <User className="h-5 w-5" />
                                Sunt Client
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, type: "company" })
                                }
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3.5 font-semibold transition-all ${
                                  formData.type === "company"
                                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                <Building2 className="h-5 w-5" />
                                Sunt Companie
                              </button>
                            </div>

                            {/* Name & Email */}
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                  Nume complet *
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  required
                                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                                  placeholder="Numele tău"
                                />
                              </div>
                              <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                  Email *
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required
                                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                                  placeholder="email@exemplu.ro"
                                />
                              </div>
                            </div>

                            {/* Subject */}
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Subiect *
                              </label>
                              <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                                placeholder="Despre ce dorești să discutăm?"
                              />
                            </div>

                            {/* Message */}
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Mesaj *
                              </label>
                              <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full resize-none rounded-xl border-2 border-slate-200 px-4 py-3 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                                placeholder="Scrie mesajul tău aici..."
                              />
                            </div>

                            {/* Error */}
                            {error && (
                              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                {error}
                              </div>
                            )}

                            {/* Submit */}
                            <button
                              type="submit"
                              disabled={sending}
                              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-3 py-2 md:px-6 md:py-4 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {sending ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                                  />
                                  Se trimite...
                                </>
                              ) : (
                                <>
                                  <Send className="h-5 w-5" />
                                  Trimite mesajul
                                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Side - FAQ & Support */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="space-y-8"
                >
                  {/* Quick FAQ */}
                  <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                    <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-violet-100/50 blur-3xl" />

                    <div className="relative">
                      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-50 to-purple-50 px-4 py-2">
                        <HelpCircle className="h-4 w-4 text-violet-600" />
                        <span className="text-sm font-semibold text-violet-700">
                          Întrebări frecvente
                        </span>
                      </div>

                      <h3 className="mb-6 text-xl font-bold text-slate-900">
                        Răspunsuri rapide
                      </h3>

                      <div className="space-y-4">
                        {faqs.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="rounded-xl bg-slate-50 p-4 transition-all hover:bg-emerald-50/50"
                          >
                            <h4 className="mb-2 font-semibold text-slate-900">
                              {item.q}
                            </h4>
                            <p className="text-sm text-slate-600">{item.a}</p>
                          </motion.div>
                        ))}
                      </div>

                      <Link
                        href="/faq"
                        className="mt-6 inline-flex items-center gap-2 font-semibold text-violet-600 hover:text-violet-700"
                      >
                        Vezi toate întrebările
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Support Card */}
                  <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 text-white shadow-xl">
                    <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" />

                    <div className="relative">
                      <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                        <Zap className="h-8 w-8" />
                      </div>
                      <h3 className="mb-2 text-2xl font-bold">
                        Răspundem rapid!
                      </h3>
                      <p className="mb-6 text-emerald-100">
                        Echipa noastră de suport îți răspunde de obicei în mai
                        puțin de 4 ore în zilele lucrătoare.
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                          <Clock className="h-5 w-5" />
                          <div>
                            <p className="text-sm font-semibold">
                              Program suport
                            </p>
                            <p className="text-sm text-emerald-100">
                              Luni - Vineri: 9:00 - 18:00
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                          <Shield className="h-5 w-5" />
                          <div>
                            <p className="text-sm font-semibold">
                              Confidențialitate
                            </p>
                            <p className="text-sm text-emerald-100">
                              Datele tale sunt în siguranță
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-3xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-8 shadow-lg"
                  >
                    <div className="mb-4 inline-flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">
                        Ești firma de mutări?
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900">
                      Devino partener
                    </h3>
                    <p className="mb-6 text-slate-600">
                      Alătură-te rețelei noastre de firme verificate și primește
                      cereri de la clienți din toată țara.
                    </p>
                    <Link
                      href="/company/auth"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-800"
                    >
                      Înregistrează-te gratuit
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
