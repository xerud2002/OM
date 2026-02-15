import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import {
  ChatBubbleLeftRightIcon as MessageCircle,
  BuildingOfficeIcon as Building2,
  UserIcon as User,
  CheckCircleIcon as CheckCircle,
  ExclamationCircleIcon as AlertCircle,
  ArrowRightIcon as ArrowRight,
  ShieldCheckIcon as Shield,
  BoltIcon as Zap,
  ClockIcon as Clock,
  QuestionMarkCircleIcon as HelpCircle,
  PaperAirplaneIcon as Send,
  SparklesIcon as Sparkles,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
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

  const faqs = [
    {
      q: "Cât durează să primesc oferte?",
      a: "Primești până la 5 oferte de preț de la firme verificate, de obicei în mai puțin de 24 de ore.",
    },
    {
      q: "Cât costă serviciul?",
      a: "Complet gratuit pentru clienți. Publici o cerere, primești oferte și alegi firma care ți se potrivește.",
    },
    {
      q: "Firmele sunt verificate?",
      a: "Da. Verificăm CUI-ul activ și asigurarea fiecărei firme partenere înainte de listare.",
    },
    {
      q: "Cum devin partener?",
      a: "Accesează secțiunea 'Devino Partener', completează formularul și după verificare primești cereri de la clienți.",
    },
  ];

  return (
    <>
      <Head>
        <title>Contact | OferteMutare.ro - Trimite-ne un mesaj</title>
        <meta name="author" content="Ofertemutare Ltd" />
        <meta
          name="description"
          content="Contactează echipa OferteMutare.ro pentru întrebări, suport sau parteneriate. Completează formularul și îți răspundem în maxim 24 de ore."
        />
        <meta
          name="keywords"
          content="contact ofertemutare, suport mutări, întrebări mutare, parteneriat firme mutări, contact mutari romania"
        />
        <link rel="canonical" href="https://ofertemutare.ro/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/contact" />
        <meta property="og:title" content="Contact | OferteMutare.ro" />
        <meta
          property="og:description"
          content="Completează formularul de contact și îți răspundem în maxim 24h."
        />
        <meta
          property="og:image"
          content="https://ofertemutare.ro/pics/index.webp"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact | OferteMutare.ro" />
        <meta
          name="twitter:description"
          content="Completează formularul de contact și îți răspundem în maxim 24h."
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
              "@type": "ContactPage",
              name: "Contact | OferteMutare.ro",
              description:
                "Contactează echipa Ofertemutare Ltd pentru întrebări, suport sau parteneriate.",
              url: "https://ofertemutare.ro/contact",
              mainEntity: {
                "@type": "Organization",
                name: "Ofertemutare Ltd",
                url: "https://ofertemutare.ro",
                email: "info@ofertemutare.ro",
                image: "https://ofertemutare.ro/pics/index.webp",
                areaServed: {
                  "@type": "Country",
                  name: "România",
                },
              },
            }),
          }}
        />
      </Head>

      <Breadcrumbs items={[{ name: "Acasă", href: "/" }, { name: "Contact" }]} />

      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white py-16 sm:py-20">
          {/* Grid Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative container mx-auto px-4 text-center">
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

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Contactează
              <br />
              <span className="relative inline-block">
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
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
            >
              Ai o întrebare, ai nevoie de ajutor cu o cerere sau vrei să devii
              partener? Completează formularul și îți răspundem în maxim 24h.
            </motion.p>
          </div>
        </section>

        {/* Main Content - Form + Sidebar */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
              {/* Contact Form - 3 cols */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  {sent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-slate-900">
                        Mesaj trimis cu succes
                      </h3>
                      <p className="mb-6 text-slate-600">
                        Îți mulțumim. Te vom contacta în cel mai scurt timp.
                      </p>
                      <button
                        onClick={() => setSent(false)}
                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Trimite alt mesaj
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="mb-1 text-xl font-bold text-slate-900 sm:text-2xl">
                        Trimite-ne un mesaj
                      </h2>
                      <p className="mb-6 text-sm text-slate-500">
                        Toate câmpurile marcate cu * sunt obligatorii.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Type Selector */}
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, type: "client" })
                            }
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                              formData.type === "client"
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 text-slate-500 hover:border-slate-300"
                            }`}
                          >
                            <User className="h-4 w-4" />
                            Sunt Client
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, type: "company" })
                            }
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                              formData.type === "company"
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 text-slate-500 hover:border-slate-300"
                            }`}
                          >
                            <Building2 className="h-4 w-4" />
                            Sunt Companie
                          </button>
                        </div>

                        {/* Name & Email */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="contact-name"
                              className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                              Nume complet *
                            </label>
                            <input
                              id="contact-name"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                              placeholder="Numele tău"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="contact-email"
                              className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                              Email *
                            </label>
                            <input
                              id="contact-email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                              placeholder="email@exemplu.ro"
                            />
                          </div>
                        </div>

                        {/* Subject */}
                        <div>
                          <label
                            htmlFor="contact-subject"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                          >
                            Subiect *
                          </label>
                          <input
                            id="contact-subject"
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                            placeholder="Despre ce dorești să discutăm?"
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label
                            htmlFor="contact-message"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                          >
                            Mesaj *
                          </label>
                          <textarea
                            id="contact-message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                            placeholder="Scrie mesajul tău aici..."
                          />
                        </div>

                        {error && (
                          <div
                            role="alert"
                            aria-live="polite"
                            className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                          >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={sending}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                                className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                              />
                              Se trimite...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Trimite mesajul
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar - 2 cols */}
              <div className="space-y-6 lg:col-span-2">
                {/* Response Time */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900">Răspundem rapid</h3>
                  </div>
                  <p className="mb-4 text-sm text-slate-600">
                    Îți răspundem de obicei în aceeași zi lucrătoare. Mesajele
                    din weekend sunt procesate luni dimineață.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-3">
                      <Clock className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="text-sm text-slate-700">
                        Răspuns în sub 24h în zilele lucrătoare
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-3">
                      <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="text-sm text-slate-700">
                        Nu partajăm datele tale cu terți
                      </span>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900">
                      Întrebări frecvente
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {faqs.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-slate-100 p-3"
                      >
                        <h4 className="mb-1 text-sm font-semibold text-slate-900">
                          {item.q}
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-500">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/faq"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Toate întrebările
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* CTA */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">
                      Ești firmă de mutări?
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    Devino partener
                  </h3>
                  <p className="mb-4 text-sm text-slate-600">
                    Înscrie-te gratuit, verificăm firma ta și începi să
                    primești cereri de mutare din 41 de orașe.
                  </p>
                  <Link
                    href="/company/auth"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Înregistrează-te gratuit
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
