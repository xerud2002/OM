import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import { BookOpen, Package, Clipboard, Lightbulb, ArrowRight, CheckCircle } from "lucide-react";

export default function GuideMutare() {
  return (
    <>
      <Head>
        <title>Ghid Complet Mutare Locuință | OferteMutari.ro</title>
        <meta
          name="description"
          content="Ghidul complet pentru o mutare fără stres - pregătire, împachetare, evaluare și sfaturi practice de la experți."
        />
      </Head>

      <LayoutWrapper>
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 p-4">
              <BookOpen className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-emerald-700">
              Ghidul Complet pentru Mutarea Ta
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Tot ce trebuie să știi pentru o mutare organizată și fără stres. De la pregătire și
              împachetare până la evaluare și sfaturi practice.
            </p>
          </div>

          {/* Why Follow Guide */}
          <div className="mb-12 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 p-8">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
              De Ce Să Urmezi Acest Ghid?
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-3 inline-flex rounded-full bg-white p-3 shadow-sm">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-800">Economisești Timp</h3>
                <p className="text-sm text-gray-600">
                  Planificare eficientă reduce timpul mutării cu până la 50%
                </p>
              </div>
              <div className="text-center">
                <div className="mb-3 inline-flex rounded-full bg-white p-3 shadow-sm">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-800">Reduci Stresul</h3>
                <p className="text-sm text-gray-600">
                  Știi exact ce să faci la fiecare pas - zero surprize
                </p>
              </div>
              <div className="text-center">
                <div className="mb-3 inline-flex rounded-full bg-white p-3 shadow-sm">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-800">Protejezi Bunurile</h3>
                <p className="text-sm text-gray-600">
                  Tehnici profesionale de împachetare și manipulare
                </p>
              </div>
            </div>
          </div>

          {/* Main Articles Grid */}
          <div className="mb-12 grid gap-8 md:grid-cols-2">
            {/* Article 1 - Pregatire */}
            <Link
              href="/articles/pregatire"
              className="group overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white">
                <div className="mb-3 inline-flex rounded-full bg-white/20 p-3">
                  <Clipboard className="h-8 w-8" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Pas 1: Pregătirea Mutării</h2>
                <p className="text-emerald-50">Planificare detaliată și organizare pre-mutare</p>
              </div>
              <div className="p-6">
                <ul className="mb-4 space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span>Timeline-ul mutării: Ce să faci în fiecare săptămână</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span>Checklist complet cu toate sarcinile necesare</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span>Cum să sortezi și organizezi bunurile înainte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span>Notificări autorități și schimbări administrative</span>
                  </li>
                </ul>
                <div className="flex items-center gap-2 font-semibold text-emerald-600 transition-colors group-hover:text-emerald-700">
                  Citește ghidul complet
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Article 2 - Impachetare */}
            <Link
              href="/articles/impachetare"
              className="group overflow-hidden rounded-xl border-2 border-blue-200 bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                <div className="mb-3 inline-flex rounded-full bg-white/20 p-3">
                  <Package className="h-8 w-8" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Pas 2: Împachetarea Corectă</h2>
                <p className="text-blue-50">Tehnici profesionale pentru fiecare tip de obiect</p>
              </div>
              <div className="p-6">
                <ul className="mb-4 space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <span>Materiale necesare și unde să le procuri ieftin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <span>Ghid pas-cu-pas pentru obiecte fragile și electronice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <span>Sisteme de etichetare și organizare cutii</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <span>Secrete profesionale pentru optimizarea spațiului</span>
                  </li>
                </ul>
                <div className="flex items-center gap-2 font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                  Citește ghidul complet
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Article 3 - Survey */}
            <Link
              href="/articles/survey"
              className="group overflow-hidden rounded-xl border-2 border-purple-200 bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
                <div className="mb-3 inline-flex rounded-full bg-white/20 p-3">
                  <Clipboard className="h-8 w-8" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Pas 3: Evaluarea Mutării</h2>
                <p className="text-purple-50">Alege metoda potrivită pentru situația ta</p>
              </div>
              <div className="p-6">
                <ul className="mb-4 space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                    <span>Survey la fața locului: Când și de ce să alegi această opțiune</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                    <span>Survey video: Evaluare rapidă din confortul casei</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                    <span>Estimare rapidă: Pentru mutări simple și rapide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                    <span>Cum să pregătești inventarul pentru oferte precise</span>
                  </li>
                </ul>
                <div className="flex items-center gap-2 font-semibold text-purple-600 transition-colors group-hover:text-purple-700">
                  Citește ghidul complet
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Article 4 - Tips */}
            <Link
              href="/articles/tips"
              className="group overflow-hidden rounded-xl border-2 border-amber-200 bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white">
                <div className="mb-3 inline-flex rounded-full bg-white/20 p-3">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Pas 4: Sfaturi Expert</h2>
                <p className="text-amber-50">Trucuri și sfaturi de la profesioniști</p>
              </div>
              <div className="p-6">
                <ul className="mb-4 space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                    <span>Top 10 greșeli comune și cum să le eviți</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                    <span>Trucuri pentru economisire bani la mutare</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                    <span>Sfaturi pentru mutarea cu animale de companie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                    <span>Lista completă ce să faci în prima zi în casa nouă</span>
                  </li>
                </ul>
                <div className="flex items-center gap-2 font-semibold text-amber-600 transition-colors group-hover:text-amber-700">
                  Citește ghidul complet
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>

          {/* Process Overview */}
          <div className="mb-12 rounded-xl bg-gray-50 p-8">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
              Procesul Complet în 4 Pași Simpli
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-600">
                  1
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-800">Pregătește</h3>
                  <p className="text-sm text-gray-600">
                    Planifică timeline-ul, creează checklist-uri, sortează bunurile (4-6 săptămâni
                    înainte)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  2
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-800">Împachetează</h3>
                  <p className="text-sm text-gray-600">
                    Folosește materialele corecte, etichetează totul, protejează fragilele (2-3
                    săptămâni înainte)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600">
                  3
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-800">Solicită Evaluare</h3>
                  <p className="text-sm text-gray-600">
                    Alege tipul de survey potrivit și primește oferte precise (1-2 săptămâni
                    înainte)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-600">
                  4
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-800">Execută Mutarea</h3>
                  <p className="text-sm text-gray-600">
                    Urmează sfaturile expertilor pentru o zi fără stres și instalează-te rapid în
                    noua casă
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-center text-white shadow-xl">
            <h2 className="mb-4 text-3xl font-bold">Gata să Începi Mutarea?</h2>
            <p className="mb-6 text-lg text-emerald-50">
              Solicită oferte personalizate de la firmele de mutări verificate din zona ta
            </p>
            <Link
              href="/customer/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-bold text-emerald-600 shadow-lg transition-transform hover:scale-105"
            >
              Solicită Oferte Gratuite
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-4 text-sm text-emerald-100">
              ✓ 100% Gratuit ✓ Fără Obligații ✓ Răspuns în 24h
            </p>
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
}
