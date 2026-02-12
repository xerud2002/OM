import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { logger } from "@/utils/logger";
import {
  CheckCircleIcon as CheckCircle,
  UsersIcon as Users,
  ArrowTrendingUpIcon as TrendingUp,
  ShieldCheckIcon as Shield,
  BellIcon as Bell,
  ChartBarIcon as BarChart3,
  ArrowRightIcon as ArrowRight,
  BuildingOfficeIcon as Building2,
  TruckIcon as Truck,
  StarIcon as Star,
  EnvelopeIcon as Mail,
  InboxIcon,
  DocumentTextIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  HomeModernIcon,
  ArchiveBoxIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PaperAirplaneIcon,
  GiftIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CheckBadgeIcon,
  PhoneIcon,
  EyeIcon,
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";

type LatestRequest = {
  fromCity: string;
  fromCounty: string;
  toCity: string;
  toCounty: string;
  fromRooms: string | number;
  moveDate: string;
  createdAt: string;
} | null;

const benefits = [
  {
    icon: Users,
    title: "Clienți Reali, Verificați",
    description:
      "Primești cereri doar de la clienți care au nevoie de mutare în zona ta. Fără spam, fără cereri false.",
  },
  {
    icon: Shield,
    title: "Plătești Doar La Vizualizare",
    description:
      "Creditele se consumă doar dacă clientul ți-a vizualizat oferta. Dacă nu o vede, nu plătești nimic.",
  },
  {
    icon: Bell,
    title: "Notificări Instant",
    description:
      "Fii primul care răspunde! Primești notificare imediat când apare o cerere nouă în zona ta.",
  },
  {
    icon: TrendingUp,
    title: "Creștere Fără Marketing",
    description:
      "Extinde-ți baza de clienți fără costuri de publicitate. Clientul vine la tine prin platformă.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Complet",
    description:
      "Gestionează cereri, oferte, chat și statistici – totul dintr-un singur loc, de pe orice dispozitiv.",
  },
  {
    icon: Star,
    title: "Recenzii & Rating",
    description:
      "Construiește-ți reputația online. Clienții mulțumiți lasă recenzii care îți aduc mai multe contracte.",
  },
];

const steps = [
  {
    number: "1",
    title: "Creează Cont Gratuit",
    description:
      "Înregistrare rapidă în mai puțin de 2 minute. Fără carduri sau plăți.",
    icon: RocketLaunchIcon,
  },
  {
    number: "2",
    title: "Completează Profilul",
    description:
      "Adaugă detalii despre firma ta, zonele deservite și serviciile oferite. Ghidul de onboarding te ajută.",
    icon: Building2,
  },
  {
    number: "3",
    title: "Primește Cereri",
    description:
      "Când un client solicită mutare în zona ta, primești notificare instant pe dashboard.",
    icon: Bell,
  },
  {
    number: "4",
    title: "Trimite Oferte",
    description:
      "Evaluezi cererea, vezi detaliile și trimiți oferta ta personalizată direct din platformă.",
    icon: PaperAirplaneIcon,
  },
  {
    number: "5",
    title: "Câștigă Contracte",
    description:
      "Clientul alege cea mai bună ofertă. Comunici direct prin chat sau telefon.",
    icon: CheckCircle,
  },
];

const stats = [
  { value: "500+", label: "Mutări Realizate" },
  { value: "50+", label: "Firme Partenere" },
  { value: "4.9/5", label: "Rating Mediu" },
  { value: "24h", label: "Timp Răspuns" },
];

// Dashboard navigation preview
const dashboardNav = [
  { name: "Cereri Disponibile", icon: InboxIcon },
  { name: "Ofertele Mele", icon: DocumentTextIcon },
  { name: "Credite", icon: CreditCardIcon },
  { name: "Profil Companie", icon: Building2 },
  { name: "Setări", icon: Cog6ToothIcon },
];

type Props = {
  latestRequest: LatestRequest;
};

// Helper to format time ago with proper Romanian grammar
const getTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Chiar acum";
  if (diffMins === 1) return "Acum 1 minut";
  if (diffMins < 20) return `Acum ${diffMins} minute`;
  if (diffMins < 60) return `Acum ${diffMins} de minute`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return "Acum 1 oră";
  if (diffHours < 20) return `Acum ${diffHours} ore`;
  if (diffHours < 24) return `Acum ${diffHours} de ore`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Ieri";
  if (diffDays < 20) return `Acum ${diffDays} zile`;
  return `Acum ${diffDays} de zile`;
};

// Helper to extract first number from rooms (e.g., "2-3" -> "2")
const extractRooms = (rooms: string | number | undefined): string => {
  if (!rooms) return "3";
  const str = String(rooms);
  const match = str.match(/^\d+/);
  return match ? match[0] : str;
};

// Helper to format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const months = [
    "Ian",
    "Feb",
    "Mar",
    "Apr",
    "Mai",
    "Iun",
    "Iul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/* ─── Mock job cards for dashboard preview ─── */
function MockJobCard({
  from,
  to,
  rooms,
  date,
  services,
}: {
  from: string;
  to: string;
  rooms: string;
  date: string;
  services: string[];
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        <div className="flex flex-1 flex-col p-4">
          {/* Route */}
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
            <Truck className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="truncate">{from}</span>
            <span className="text-gray-300">→</span>
            <span className="truncate">{to}</span>
          </div>
          {/* Details */}
          <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <HomeModernIcon className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              {rooms} camere
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              {date}
            </div>
          </div>
          {/* Services */}
          <div className="mb-3 flex min-h-5.5 flex-wrap gap-1">
            {services.map((s) => (
              <span
                key={s}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
              >
                {s}
              </span>
            ))}
          </div>
          {/* Actions - pinned to bottom */}
          <div className="mt-auto flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <EyeIcon className="mr-1 inline h-3.5 w-3.5" />
              Detalii
            </button>
            <button className="flex-1 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600">
              <PaperAirplaneIcon className="mr-1 inline h-3.5 w-3.5" />
              Trimite Ofertă
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* Header */}
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Detalii Cerere de Mutare
            </h3>

            {/* Route */}
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-blue-50 p-4">
              <div className="flex flex-col items-center gap-1">
                <MapPinIcon className="h-5 w-5 text-blue-500" />
                <div className="h-6 w-px bg-blue-300" />
                <MapPinIcon className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">De la</p>
                  <p className="text-sm font-bold text-gray-800">{from}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">Către</p>
                  <p className="text-sm font-bold text-gray-800">{to}</p>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <HomeModernIcon className="h-4 w-4" />
                  Locuință
                </div>
                <p className="mt-1 text-sm font-bold text-gray-800">{rooms} camere</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarIcon className="h-4 w-4" />
                  Data mutării
                </div>
                <p className="mt-1 text-sm font-bold text-gray-800">{date}</p>
              </div>
            </div>

            {/* Services */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium text-gray-500">Servicii solicitate</p>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              <PaperAirplaneIcon className="mr-1.5 inline h-4 w-4" />
              Trimite Ofertă
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function PartenerPage({
  latestRequest: ssrLatestRequest,
}: Props) {
  const [latestRequest, setLatestRequest] =
    useState<LatestRequest>(ssrLatestRequest);

  // Client-side fallback when server-side fetch fails (admin not ready)
  useEffect(() => {
    if (ssrLatestRequest) return;

    const fetchLatestRequest = async () => {
      try {
        const { db } = await import("@/services/firebase");
        const { collection, query, orderBy, limit, getDocs } =
          await import("firebase/firestore");

        const q = query(
          collection(db, "requests"),
          orderBy("createdAt", "desc"),
          limit(1),
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
          setLatestRequest({
            fromCity: data.fromCity || "București",
            fromCounty: data.fromCounty || "",
            toCity: data.toCity || "România",
            toCounty: data.toCounty || "",
            fromRooms: extractRooms(data.rooms),
            moveDate: data.moveDate || "",
            createdAt:
              data.createdAt?.toDate?.()?.toISOString() ||
              new Date().toISOString(),
          });
        }
      } catch (error) {
        logger.error("[partener] Client-side fetch failed:", error);
      }
    };

    fetchLatestRequest();
  }, [ssrLatestRequest]);

  return (
    <Layout>
      <Head>
        <title>Devino Partener | OferteMutare.ro - Firme de Mutări</title>
        <meta
          name="description"
          content="Înscrie-ți firma de mutări pe OferteMutare.ro și primește cereri de la clienți verificați. Fără abonamente, plătești doar pentru succes. Creștere garantată!"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ofertemutare.ro/partener" />
      </Head>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900 py-20 lg:py-28">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left – Text */}
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-sm">
                <Truck className="h-4 w-4" />
                Pentru Firme de Mutări
              </div>
              <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Primește Cereri.{" "}
                <span className="bg-linear-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">
                  Trimite Oferte.
                </span>{" "}
                Crește Afacerea.
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-slate-200 md:text-xl">
                Dashboard-ul tău complet pentru a gestiona cereri de mutare, a
                trimite oferte și a comunica direct cu clienții – totul dintr-un
                singur loc.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/company/auth?tab=register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 hover:shadow-xl"
                >
                  <Building2 className="h-5 w-5" />
                  Înregistrează Firma
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/company/auth?tab=login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  Am deja cont
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-300 lg:justify-start">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" /> Gratuit
                  la înregistrare
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-400" /> Fără
                  abonamente
                </span>
                <span className="flex items-center gap-1.5">
                  <GiftIcon className="h-4 w-4 text-emerald-400" /> 50 credite
                  bonus
                </span>
              </div>
            </div>

            {/* Right – Live request card (hero mock) */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-linear-to-br from-emerald-500/20 to-blue-500/20 blur-xl" />
                <div className="relative rounded-2xl border border-white/10 bg-white p-6 shadow-2xl">
                  {/* Fake notification header */}
                  <div className="mb-5 flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                      <Bell className="h-6 w-6 text-emerald-600" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Cerere Nouă de Mutare!
                      </p>
                      <p className="text-sm text-gray-500">
                        {latestRequest
                          ? getTimeAgo(latestRequest.createdAt)
                          : "Acum 2 minute"}
                      </p>
                    </div>
                    <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      50 credite
                    </span>
                  </div>

                  {/* Request details */}
                  <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Truck className="h-3.5 w-3.5" /> De la
                      </span>
                      <span className="font-medium text-gray-900">
                        {latestRequest
                          ? `${latestRequest.fromCity}, ${latestRequest.fromCounty}`
                          : "București, Sector 3"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Truck className="h-3.5 w-3.5" /> Către
                      </span>
                      <span className="font-medium text-gray-900">
                        {latestRequest
                          ? latestRequest.toCounty
                            ? `${latestRequest.toCity}, ${latestRequest.toCounty}`
                            : latestRequest.toCity
                          : "Cluj-Napoca"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <HomeModernIcon className="h-3.5 w-3.5" /> Camere
                      </span>
                      <span className="font-medium text-gray-900">
                        {latestRequest ? latestRequest.fromRooms : "3"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <CalendarIcon className="h-3.5 w-3.5" /> Data mutării
                      </span>
                      <span className="font-medium text-gray-900">
                        {latestRequest
                          ? formatDate(latestRequest.moveDate)
                          : "15 Feb 2026"}
                      </span>
                    </div>
                  </div>

                  {/* Services requested */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["Transport", "Împachetare", "Demontare"].map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600">
                    <PaperAirplaneIcon className="h-4 w-4" />
                    Trimite Ofertă
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="border-b border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-1 text-3xl font-extrabold text-emerald-600 md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DASHBOARD PREVIEW ═══════════ */}
      <section className="bg-linear-to-b from-gray-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              <SparklesIcon className="h-3.5 w-3.5" /> PREVIEW DASHBOARD
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Totul dintr-un singur loc
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Gestionează cereri, trimite oferte, comunică prin chat și
              urmărește-ți performanța – exact ca firmele partenere care deja
              folosesc platforma.
            </p>
          </div>

          {/* Fake dashboard frame */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-linear-to-br from-emerald-500 to-sky-500" />
                <span className="text-sm font-bold text-gray-700">
                  Firma Ta de Mutări
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <CurrencyDollarIcon className="h-3.5 w-3.5" />
                  50 credite
                </span>
                <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    3
                  </span>
                </span>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar nav (hidden on mobile) */}
              <div className="hidden w-56 shrink-0 border-r border-gray-100 bg-gray-50/50 p-3 lg:block">
                {dashboardNav.map((item, i) => (
                  <div
                    key={item.name}
                    className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      i === 0
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </div>
                ))}
              </div>

              {/* Main content area */}
              <div className="flex-1 p-4 sm:p-6">
                {/* Tab bar */}
                <div className="mb-5 flex gap-1 rounded-lg bg-gray-100 p-1">
                  <div className="flex items-center gap-1.5 rounded-md bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
                    <InboxIcon className="h-3.5 w-3.5" /> Cereri Disponibile
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium text-gray-500">
                    <DocumentTextIcon className="h-3.5 w-3.5" /> Ofertele Mele
                  </div>
                </div>

                {/* Job cards grid */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <MockJobCard
                    from={
                      latestRequest ? `${latestRequest.fromCity}` : "București"
                    }
                    to={latestRequest ? latestRequest.toCity : "Cluj-Napoca"}
                    rooms={
                      latestRequest ? String(latestRequest.fromRooms) : "3"
                    }
                    date={
                      latestRequest
                        ? formatDate(latestRequest.moveDate)
                        : "15 Feb 2026"
                    }
                    services={["Transport", "Împachetare"]}
                  />
                  <MockJobCard
                    from="Timișoara"
                    to="Arad"
                    rooms="2"
                    date="20 Feb 2026"
                    services={["Transport", "Demontare"]}
                  />
                  <MockJobCard
                    from="Brașov"
                    to="Sibiu"
                    rooms="4"
                    date="22 Feb 2026"
                    services={["Transport", "Împachetare", "Depozitare"]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlights under the dashboard preview */}
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <InboxIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Cereri în timp real</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Vezi cererile noi instant, cu toate detaliile: rută, camere,
                  servicii, dată.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Chat integrat</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comunică direct cu clientul prin chat, telefon sau email –
                  fără intermediari.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Statistici oferte</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Urmărește ofertele trimise, acceptate și rata de succes, totul
                  pe dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ BENEFITS ═══════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              De Ce Să Fii Partener?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Alătură-te celor peste 50 de firme de mutări care își găsesc
              clienți noi prin platforma noastră.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 transition group-hover:bg-emerald-100">
                  <benefit.icon className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Cum Funcționează?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              De la înregistrare la primul contract – în 5 pași simpli.
            </p>
          </div>
          <div className="relative space-y-0">
            {/* Connection line */}
            <div className="absolute top-0 bottom-0 left-8 hidden w-0.5 bg-emerald-200 md:block" />

            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex gap-6 pb-10 last:pb-0"
              >
                {/* Step number circle */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xl font-bold text-white shadow-lg shadow-emerald-500/30">
                  {step.number}
                </div>
                {/* Content */}
                <div className="flex-1 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-1 flex items-center gap-2">
                    <step.icon className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CREDITS INFO ═══════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              <CurrencyDollarIcon className="h-3.5 w-3.5" /> SISTEM DE CREDITE
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Plătești doar dacă clientul îți vede oferta
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Fără abonamente sau taxe lunare. Creditele se consumă doar când
              clientul ți-a vizualizat oferta. Dacă nu o vede, nu plătești
              nimic. La înregistrare primești{" "}
              <strong className="text-emerald-600">50 credite gratuit</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-600 to-blue-600 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Gata să Crești Afacerea?
          </h2>
          <p className="mb-8 text-lg text-emerald-100">
            Înregistrarea durează sub 2 minute. Primești 50 credite gratuit și
            poți trimite prima ofertă imediat!
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/company/auth?tab=register"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-emerald-600 shadow-lg transition hover:bg-gray-50 hover:shadow-xl"
            >
              <CheckCircle className="h-5 w-5" />
              Înregistrează-te Gratuit
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/company/auth?tab=login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Intră în Cont
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACT ═══════════ */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            Ai Întrebări?
          </h2>
          <p className="mb-6 text-gray-600">
            Echipa noastră este aici să te ajute. Contactează-ne pentru orice
            nelămurire.
          </p>
          <a
            href="mailto:info@ofertemutare.ro"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
          >
            <Mail className="h-5 w-5 text-emerald-600" />
            info@ofertemutare.ro
          </a>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    if (!adminReady || !adminDb) {
      logger.log("[partener] Admin not ready");
      return { props: { latestRequest: null } };
    }

    const snapshot = await adminDb
      .collection("requests")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return { props: { latestRequest: null } };
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    const roomsStr = String(data.rooms || "3");
    const roomsMatch = roomsStr.match(/^\d+/);
    const fromRooms = roomsMatch ? roomsMatch[0] : roomsStr;

    const latestRequest = {
      fromCity: data.fromCity || "București",
      fromCounty: data.fromCounty || "",
      toCity: data.toCity || "România",
      toCounty: data.toCounty || "",
      fromRooms,
      moveDate: data.moveDate || "",
      createdAt:
        data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };

    return { props: { latestRequest } };
  } catch (error) {
    logger.error("[partener] Error fetching latest request:", error);
    return { props: { latestRequest: null } };
  }
};
