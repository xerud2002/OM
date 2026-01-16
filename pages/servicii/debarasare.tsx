import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import FAQSection from "@/components/content/FAQSection";
import { FAQPageSchema, LocalBusinessSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { SERVICE_FAQS } from "@/data/faqData";
import {
  Trash2,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Star,
  Package,
  Sofa,
  Recycle,
} from "lucide-react";

export default function DebarasarePage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>Debarasare Mobilă și Gunoi {currentYear} | Evacuare Rapidă</title>
        <meta
          name="description"
          content="Servicii debarasare mobilă veche, gunoi, moloz. Evacuare rapidă apartamente, case, pivnițe, mansarde. Transport și reciclare responsabilă. De la 150 lei!"
        />
        <meta
          name="keywords"
          content="debarasare, evacuare mobilă, debarasare apartament, gunoi mari, moloz, debarasare pivniță, transport gunoi"
        />
        <link rel="canonical" href="https://ofertemutare.ro/servicii/debarasare" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/servicii/debarasare" />
        <meta property="og:title" content={`Debarasare ${currentYear}`} />
        <meta property="og:description" content="Evacuare mobilă și gunoi. Transport și reciclare!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
      </Head>

      <LayoutWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-green-700 via-emerald-700 to-teal-800 py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <Trash2 className="h-6 w-6 text-green-200" />
              <span className="text-green-100 text-sm font-medium">Servicii Debarasare • Eco-Friendly</span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
              Debarasare{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Mobilă & Gunoi
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-green-100 md:text-xl">
              Conectăm-te cu firme de debarasare pentru evacuare rapidă apartamente, case, 
              pivnițe. Transport și reciclare responsabilă!
            </p>

            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">150+</div>
                <div className="text-sm text-green-100">Lei de la</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">2-4h</div>
                <div className="text-sm text-green-100">Durată medie</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">♻️</div>
                <div className="text-sm text-green-100">Reciclare</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-green-100">Aceeași zi</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/customer/auth"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-green-700 shadow-xl transition-all hover:bg-green-50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Cere Ofertă Debarasare
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Main Article */}
        <article className="mx-auto max-w-4xl px-4 py-16">
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Când ai nevoie de debarasare?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                <strong>Debarasarea</strong> este soluția perfectă când ai mobilă veche, gunoi voluminos, 
                sau pur și simplu vrei să scapi de lucruri inutile rapid. Firmele partenere oferă evacuare 
                completă pentru apartamente, case, pivnițe, mansarde, sau garaje.
              </p>
            </div>
          </section>

          {/* What We Remove */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-green-50 to-emerald-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-7 w-7 text-green-600" />
              Ce evacuăm?
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Sofa className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span className="text-gray-700">Mobilă veche (canapele, dulapuri, paturi)</span>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span className="text-gray-700">Electrocasnice (frigidere, mașini de spălat)</span>
              </div>
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span className="text-gray-700">Gunoi menaj și moloz</span>
              </div>
              <div className="flex items-start gap-3">
                <Recycle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span className="text-gray-700">Deșeuri reciclabile (hârtie, plastic, metal)</span>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-green-600" />
              Prețuri debarasare în {currentYear}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Câteva piese mobilă</h3>
                  <p className="text-sm text-gray-500">1-3 obiecte mari</p>
                </div>
                <div className="text-xl font-bold text-green-600">150-300 lei</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Debarasare apartament mic</h3>
                  <p className="text-sm text-gray-500">Garsonieră, cameră</p>
                </div>
                <div className="text-xl font-bold text-green-600">400-800 lei</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border-2 border-green-300 bg-green-50 p-4">
                <div>
                  <h3 className="font-bold text-gray-900">Debarasare completă căsută</h3>
                  <p className="text-sm text-gray-500">Apartament 3-4 camere sau casă mică</p>
                </div>
                <div className="text-xl font-bold text-green-600">1.000-2.500 lei</div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Star className="h-7 w-7 text-green-600" />
              Avantajele serviciului
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span><strong>Evacuare rapidă:</strong> Programare în aceeași zi sau a doua zi</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span><strong>Reciclare responsabilă:</strong> Separăm și ducem la reciclare ce se poate</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span><strong>Fără efort din partea ta:</strong> Echipa se ocupă de tot, inclusiv coborât</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-1" />
                <span><strong>Curățenie după:</strong> Lăsăm spațiul curat după evacuare</span>
              </li>
            </ul>
          </section>

          {/* Final CTA */}
          <section className="rounded-2xl bg-linear-to-r from-green-700 to-emerald-700 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Scapă de mobilă veche și gunoi!
            </h2>
            <p className="mb-8 text-lg text-green-100">
              Compară oferte pentru debarasare de la firme din zona ta în 24h!
            </p>
            <Link
              href="/customer/auth"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-green-700 shadow-xl transition-all hover:bg-green-50"
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
