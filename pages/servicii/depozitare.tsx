import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import FAQSection from "@/components/content/FAQSection";
import { FAQPageSchema, LocalBusinessSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { SERVICE_FAQS } from "@/data/faqData";
import {
  Warehouse,
  CheckCircle,
  ArrowRight,
  Shield,
  DollarSign,
  Star,
  Lock,
  Thermometer,
  Camera,
  Key,
  Calendar,
} from "lucide-react";

interface DepozitarePageProps {
  currentYear: number;
}

export default function DepozitarePage({ currentYear }: DepozitarePageProps) {
  const faqItems = SERVICE_FAQS.depozitare;

  return (
    <>
      <Head>
        <title>Depozitare Mobilă și Bunuri {currentYear} | Storage Securizat</title>
        <meta
          name="description"
          content="Servicii depozitare mobilă și bunuri în România. Spații securizate, monitorizate 24/7, climatiz ate. De la 150 lei/lună. Depozitare pe termen scurt sau lung!"
        />
        <meta
          name="keywords"
          content="depozitare mobilă, storage, depozitare bunuri, magazie, depozit mobilier, self storage, depozitare pe termen lung"
        />
        <link rel="canonical" href="https://ofertemutare.ro/servicii/depozitare" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/servicii/depozitare" />
        <meta property="og:title" content={`Depozitare Mobilă ${currentYear}`} />
        <meta property="og:description" content="Spații securizate pentru depozitare mobilă și bunuri!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
      </Head>

      {/* Schema Markup */}
      <FAQPageSchema faqs={faqItems} />
      <LocalBusinessSchema serviceName="Depozitare Mobilă și Bunuri" />
      <BreadcrumbSchema items={[{ name: "Acasă", url: "/" }, { name: "Servicii", url: "/servicii" }, { name: "Depozitare" }]} />

      <LayoutWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-orange py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <Warehouse className="h-6 w-6 text-amber-200" />
              <span className="text-amber-100 text-sm font-medium">Servicii Storage • Depozitare</span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
              Depozitare{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Mobilă & Bunuri
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-amber-100 md:text-xl">
              Spații securizate pentru depozitare pe termen scurt sau lung. Monitorizare 24/7, 
              climatizare, acces flexibil. De la 150 lei/lună!
            </p>

            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-amber-100">Securitate</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">150+</div>
                <div className="text-sm text-amber-100">Lei/lună</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-amber-100">Climatizat</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">🔑</div>
                <div className="text-sm text-amber-100">Acces privat</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/customer/auth"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-amber-700 shadow-xl transition-all hover:bg-amber-50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Cere Ofertă Depozitare
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Main Article Content */}
        <article className="mx-auto max-w-4xl px-4 py-16">
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Când ai nevoie de depozitare?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                <strong>Depozitarea mobilei și bunurilor</strong> este soluția perfectă în multe situații: 
                renovezi casa, te muți temporar, ai nevoie de spațiu suplimentar, sau vrei să păstrezi 
                bunurile în siguranță între două mutări.
              </p>
              <p>
                Conectăm-te cu <strong>spații securizate și monitorizate</strong> în întreaga țară. De la boxe 
                de 2m² până la depozite de 50m², cu acces flexibil la orele tale convenabile. Spații 
                climatizate, protejate de umiditate, și asigurate.
              </p>
            </div>
          </section>

          {/* Scenarios */}
          <section className="mb-12 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="h-7 w-7 text-amber-600" />
              Situații când ai nevoie de storage
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">🏗️ Renovare casă</h3>
                <p className="text-sm text-gray-600">
                  Renovezi și ai nevoie să protejezi mobilierul de praf și vopsea timp de 1-3 luni.
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📦 Downsizing</h3>
                <p className="text-sm text-gray-600">
                  Te muți într-un spațiu mai mic și nu ai unde pune toate lucrurile.
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">✈️ Relocare temporară</h3>
                <p className="text-sm text-gray-600">
                  Pleci în străinătate câteva luni/ani și vrei să păstrezi bunurile în siguranță.
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">🔄 Între mutări</h3>
                <p className="text-sm text-gray-600">
                  Datele de predare și preluare nu coincid - ai nevoie de storage 1-4 săptămâni.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-green-600" />
              Prețuri depozitare în {currentYear}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Box mic (2-4m²)</h3>
                  <p className="text-sm text-gray-500">Garsonieră, câteva piese mobilier</p>
                </div>
                <div className="text-xl font-bold text-amber-600">150-250 lei/lună</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Box mediu (5-10m²)</h3>
                  <p className="text-sm text-gray-500">Apartament 2-3 camere</p>
                </div>
                <div className="text-xl font-bold text-amber-600">300-500 lei/lună</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Box mare (15-25m²)</h3>
                  <p className="text-sm text-gray-500">Casă, mobilier complet</p>
                </div>
                <div className="text-xl font-bold text-amber-600">600-1.000 lei/lună</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              💡 Reduceri pentru contracte pe 6+ luni. Prima oară plătești și garanție (= 1 lună chirie).
            </p>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-7 w-7 text-amber-600" />
              Ce include serviciul de depozitare?
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <Camera className="h-6 w-6 shrink-0 text-blue-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Supraveghere 24/7</h3>
                  <p className="text-sm text-gray-600">Camere video, alarmă, pază permanentă</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <Thermometer className="h-6 w-6 shrink-0 text-red-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Climatizare</h3>
                  <p className="text-sm text-gray-600">Protecție împotriva umezelii și temperaturi extreme</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <Key className="h-6 w-6 shrink-0 text-amber-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Acces privat</h3>
                  <p className="text-sm text-gray-600">Doar tu ai cheia boxului tău</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <Lock className="h-6 w-6 shrink-0 text-green-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Asigurare inclusă</h3>
                  <p className="text-sm text-gray-600">Bunurile tale sunt asigurate</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Star className="h-7 w-7 text-blue-600" />
              Sfaturi pentru depozitare
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-blue-500 mt-1" />
                <span><strong>Calculează dimensiunea:</strong> Mai bine un box mai mare decât să înghesui totul.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-blue-500 mt-1" />
                <span><strong>Împachetează corect:</strong> Foloseşte cutii rezistente și protejează mobilierul cu folie.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-blue-500 mt-1" />
                <span><strong>Etichetează:</strong> Scrie pe fiecare cutie ce conține pentru acces ușor.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-blue-500 mt-1" />
                <span><strong>Organizează strategic:</strong> Pune în față lucrurile la care vei accesa des.</span>
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <FAQSection items={faqItems} title="Întrebări Frecvente - Depozitare" />

          {/* Final CTA */}
          <section className="rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Găsește spațiu de depozitare în zona ta
            </h2>
            <p className="mb-8 text-lg text-amber-100">
              Compară oferte pentru boxe de storage de la furnizori din zona ta în 24h!
            </p>
            <Link
              href="/customer/auth"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-amber-700 shadow-xl transition-all hover:bg-amber-50"
            >
              Cere Oferte Acum
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<DepozitarePageProps> = async () => {
  return {
    props: {
      currentYear: new Date().getFullYear(),
    },
  };
};
