import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { logger } from "@/utils/logger";
import { CheckCircleIcon as CheckCircle, UsersIcon as Users, ArrowTrendingUpIcon as TrendingUp, ShieldCheckIcon as Shield, BellIcon as Bell, ChartBarIcon as BarChart3, ArrowRightIcon as ArrowRight, BuildingOfficeIcon as Building2, TruckIcon as Truck, StarIcon as Star, EnvelopeIcon as Mail } from "@heroicons/react/24/outline";
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
    title: "Clienți Verificați",
    description:
      "Primești cereri de la clienți reali, care au nevoie de servicii de mutare în zona ta.",
  },
  {
    icon: TrendingUp,
    title: "Creștere Afacere",
    description:
      "Extinde-ți baza de clienți fără costuri de marketing. Plătești doar pentru cererile la care răspunzi.",
  },
  {
    icon: Bell,
    title: "Notificări Instant",
    description:
      "Fii primul care răspunde! Primești notificări imediat când apare o cerere nouă în zona ta.",
  },
  {
    icon: Shield,
    title: "Zero Risc",
    description: "Fără abonamente sau taxe fixe. Plătești doar când câștigi contracte noi.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Complet",
    description:
      "Gestionează toate cererile, ofertele și comunicarea cu clienții dintr-un singur loc.",
  },
  {
    icon: Star,
    title: "Recenzii & Rating",
    description: "Construiește-ți reputația online prin recenzii de la clienți mulțumiți.",
  },
];

const steps = [
  {
    number: "1",
    title: "Creează Cont Gratuit",
    description: "Înregistrare rapidă în mai puțin de 2 minute. Fără carduri sau plăți.",
  },
  {
    number: "2",
    title: "Completează Profilul",
    description: "Adaugă detalii despre firma ta, zonele deservite și serviciile oferite.",
  },
  {
    number: "3",
    title: "Primește Cereri",
    description: "Când un client solicită mutare în zona ta, primești notificare instant.",
  },
  {
    number: "4",
    title: "Trimite Oferte",
    description: "Evaluezi cererea și trimiți oferta ta personalizată clientului.",
  },
  {
    number: "5",
    title: "Câștigă Contracte",
    description: "Clientul alege cea mai bună ofertă. Dacă te alege, ai un client nou!",
  },
];

const stats = [
  { value: "500+", label: "Mutări Realizate" },
  { value: "50+", label: "Firme Partenere" },
  { value: "4.9/5", label: "Rating Mediu" },
  { value: "24h", label: "Timp Răspuns" },
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

export default function PartenerPage({ latestRequest: ssrLatestRequest }: Props) {
  const [latestRequest, setLatestRequest] = useState<LatestRequest>(ssrLatestRequest);

  // Client-side fallback when server-side fetch fails (admin not ready)
  useEffect(() => {
    if (ssrLatestRequest) return; // Already have data from SSR

    const fetchLatestRequest = async () => {
      try {
        const { db } = await import("@/services/firebase");
        const { collection, query, orderBy, limit, getDocs } = await import("firebase/firestore");

        const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(1));
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
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
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

      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg, #16a34a 0%, #3b82f6 100%)" }}
      >
        <div className="absolute inset-0 bg-[url('/pics/pattern.svg')] opacity-10" />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Truck className="h-4 w-4" />
                Pentru Firme de Mutări
              </div>
              <h1 className="mb-6 text-2xl md:text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Crește-ți Afacerea cu <span className="text-yellow-300">Clienți Noi</span>
              </h1>
              <p className="mb-8 text-lg text-emerald-100 md:text-xl">
                Înscrie-ți firma pe OferteMutare.ro și primește cereri de mutare de la clienți
                verificați din toată România. Fără abonamente, plătești doar pentru succes!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/company/auth?tab=register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-emerald-600 shadow-lg transition hover:bg-gray-100 hover:shadow-xl"
                >
                  <Building2 className="h-5 w-5" />
                  Înregistrează Firma
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/company/auth?tab=login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Am deja cont
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-white/10 backdrop-blur-sm" />
                <div className="relative rounded-2xl bg-white p-8 shadow-2xl">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                      <Bell className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Cerere Nouă!</p>
                      <p className="text-sm text-gray-500">
                        {latestRequest ? getTimeAgo(latestRequest.createdAt) : "Acum 2 minute"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">De la:</span>
                      <span className="font-medium text-gray-900">
                        {latestRequest
                          ? `${latestRequest.fromCity}, ${latestRequest.fromCounty}`
                          : "București, Sector 3"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Către:</span>
                      <span className="font-medium text-gray-900">
                        {latestRequest
                          ? latestRequest.toCounty
                            ? `${latestRequest.toCity}, ${latestRequest.toCounty}`
                            : latestRequest.toCity
                          : "Cluj-Napoca"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Camere:</span>
                      <span className="font-medium text-gray-900">
                        {latestRequest ? latestRequest.fromRooms : "3"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Data:</span>
                      <span className="font-medium text-gray-900">
                        {latestRequest ? formatDate(latestRequest.moveDate) : "15 Feb 2026"}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600">
                    Trimite Ofertă →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-1 text-3xl font-bold text-emerald-600 md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              De Ce Să Fii Partener?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Alătură-te celor peste 50 de firme de mutări care își găsesc clienți noi prin
              platforma noastră.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                  <benefit.icon className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Cum Funcționează?</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Începe să primești cereri de mutare în doar 5 pași simpli.
            </p>
          </div>
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-0 left-1/2 hidden h-full w-0.5 -translate-x-1/2 bg-emerald-200 lg:block" />
            <div className="space-y-8 lg:space-y-0">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative flex flex-col items-center gap-4 lg:flex-row ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-full lg:w-5/12 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}
                  >
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                      <h3 className="mb-2 text-lg font-bold text-gray-900">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xl font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                  <div className="hidden w-5/12 lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #16a34a 0%, #3b82f6 100%)" }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Gata să Crești Afacerea?
          </h2>
          <p className="mb-8 text-lg text-emerald-100">
            Înregistrarea este gratuită și durează sub 2 minute. Începe să primești cereri de mutare
            chiar azi!
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/company/auth?tab=register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-emerald-600 shadow-lg transition hover:bg-gray-100"
            >
              <CheckCircle className="h-5 w-5" />
              Înregistrează-te Gratuit
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

      {/* Contact Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Ai Întrebări?</h2>
          <p className="mb-6 text-gray-600">
            Echipa noastră este aici să te ajute. Contactează-ne pentru orice nelămurire.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:parteneri@ofertemutare.ro"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Mail className="h-5 w-5 text-emerald-600" />
              parteneri@ofertemutare.ro
            </a>
          </div>
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

    // Query the most recent request (any status for now, to test)
    const snapshot = await adminDb
      .collection("requests")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    logger.log("[partener] Query returned", snapshot.size, "documents");

    if (snapshot.empty) {
      logger.log("[partener] No requests found");
      return { props: { latestRequest: null } };
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    logger.log(
      "[partener] Found request:",
      doc.id,
      "fromCity:",
      data.fromCity,
      "toCity:",
      data.toCity
    );

    // Extract just the first number from rooms (e.g., "2-3" -> "2")
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
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };

    return { props: { latestRequest } };
  } catch (error) {
    logger.error("[partener] Error fetching latest request:", error);
    return { props: { latestRequest: null } };
  }
};
