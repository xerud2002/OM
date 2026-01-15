import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import {
  Building,
  CheckCircle,
  ArrowRight,
  Shield,
  Truck,
  Package,
  Clock,
  DollarSign,
  Monitor,
  Server,
  Calendar,
  Star,
  Users,
  FileText,
  Briefcase,
  Phone,
} from "lucide-react";

export default function MutariCompaniiPage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>Mutări Birouri și Companii {currentYear} | Relocare Firme</title>
        <meta
          name="description"
          content="Servicii mutări birouri și companii în România. Relocare firme, transport echipamente IT, mobilier office. Zero downtime, weekend sau noapte!"
        />
        <meta
          name="keywords"
          content="mutări birouri, mutare firmă, relocare companie, transport echipamente IT, mutări office, mutare sediu social, mutări corporative"
        />
        <link rel="canonical" href="https://ofertemutare.ro/mutari/tipuri/birouri" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/mutari/tipuri/birouri" />
        <meta property="og:title" content={`Mutări Birouri și Companii ${currentYear}`} />
        <meta
          property="og:description"
          content="Relocare firme profesionale. Transport echipamente IT, zero downtime!"
        />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
      </Head>

      <LayoutWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
            <div className="absolute top-1/3 left-1/4 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="absolute top-2/3 right-1/3 h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <Building className="h-6 w-6 text-slate-300" />
              <span className="text-slate-300 text-sm font-medium">
                Servicii B2B • Corporativ
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
              Mutări{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Birouri & Companii
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-slate-300 md:text-xl">
              Relocare profesională pentru firme, birouri și sedii corporate. 
              Transport echipamente IT, mobilier office, arhive. Zero downtime!
            </p>

            {/* Stats */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-slate-300">Disponibilitate</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">0%</div>
                <div className="text-sm text-slate-300">Downtime</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-slate-300">Asigurare extinsă</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">B2B</div>
                <div className="text-sm text-slate-300">Factură fiscală</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/customer/auth"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 font-bold text-white shadow-xl transition-all hover:bg-emerald-600 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Solicită Ofertă B2B
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 font-semibold text-white transition-all hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                Contactează-ne
              </Link>
            </div>
          </div>
        </section>

        {/* Main Article Content */}
        <article className="mx-auto max-w-4xl px-4 py-16">
          {/* Intro */}
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Relocarea biroului: minimizează impactul asupra business-ului
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Mutarea unui <strong>birou sau sediu de companie</strong> este o decizie strategică 
                importantă. Trebuie coordonată perfect pentru a minimiza timpul de inactivitate și 
                a proteja echipamentele valoroase &ndash; de la servere și calculatoare, până la 
                mobilierul de birou și arhivele confidențiale.
              </p>
              <p>
                Pe <strong>OferteMutare.ro</strong>, conectăm companiile cu firme de mutări 
                specializate în relocări corporate. Oferim <strong>mutări în weekend sau noaptea</strong> 
                pentru zero impact asupra programului de lucru, plus documentație completă și 
                factură fiscală.
              </p>
            </div>
          </section>

          {/* What We Move */}
          <section className="mb-12 rounded-2xl bg-gradient-to-r from-slate-50 to-gray-100 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-7 w-7 text-slate-600" />
              Ce transportăm pentru companii
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Monitor className="h-6 w-6 shrink-0 text-blue-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Echipamente IT</h3>
                  <p className="text-sm text-gray-600">
                    Calculatoare, monitoare, laptopuri, imprimante, scanere, echipamente rețea
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Server className="h-6 w-6 shrink-0 text-purple-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Servere & Data Center</h3>
                  <p className="text-sm text-gray-600">
                    Servere, rack-uri, UPS-uri, echipamente de telecomunicații
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Briefcase className="h-6 w-6 shrink-0 text-emerald-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Mobilier Office</h3>
                  <p className="text-sm text-gray-600">
                    Birouri, scaune ergonomice, dulapuri, săli de conferințe
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <FileText className="h-6 w-6 shrink-0 text-amber-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Arhive & Documente</h3>
                  <p className="text-sm text-gray-600">
                    Dosare, arhive fizice, cutii documente, materiale confidențiale
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-emerald-600" />
              Prețuri orientative mutări birouri
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-gray-200 bg-white p-6 text-center hover:border-emerald-300 transition-colors">
                <Users className="h-10 w-10 mx-auto mb-3 text-slate-400" />
                <div className="text-sm text-gray-500 mb-1">Birou mic (5-10 angajați)</div>
                <div className="text-2xl font-bold text-gray-900">1.500-3.000 lei</div>
              </div>
              <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 p-6 text-center">
                <Building className="h-10 w-10 mx-auto mb-3 text-emerald-600" />
                <div className="text-sm text-gray-500 mb-1">Birou mediu (20-50 angajați)</div>
                <div className="text-2xl font-bold text-gray-900">4.000-8.000 lei</div>
                <div className="text-xs text-emerald-600 mt-1">Cel mai frecvent</div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 bg-white p-6 text-center hover:border-emerald-300 transition-colors">
                <Building className="h-10 w-10 mx-auto mb-3 text-slate-500" />
                <div className="text-sm text-gray-500 mb-1">Corporate (100+ angajați)</div>
                <div className="text-2xl font-bold text-gray-900">Ofertă personalizată</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              💼 Toate prețurile includ TVA. Oferim factură fiscală și contract B2B.
            </p>
          </section>

          {/* Benefits */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-7 w-7 text-slate-600" />
              De ce companii aleg OferteMutare.ro
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Clock className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Mutări în weekend sau noapte</h3>
                    <p className="text-gray-600">
                      Relocare completă vineri seara &rarr; luni dimineața operationali. 
                      Zero impact asupra clienților și angajaților.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-100 p-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Asigurare extinsă pentru echipamente</h3>
                    <p className="text-gray-600">
                      Asigurare cargo pentru servere, echipamente IT și mobilier valoros. 
                      Acoperire completă în caz de daune.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Documentație completă</h3>
                    <p className="text-gray-600">
                      Factură fiscală, contract de prestări servicii, proces verbal de 
                      predare-primire, inventar detaliat.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Echipe dedicate & project manager</h3>
                    <p className="text-gray-600">
                      Pentru mutări mari, primești un manager de proiect dedicat care 
                      coordonează întreaga operațiune.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="mb-12 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="h-7 w-7 text-emerald-600" />
              Procesul de relocare corporativă
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Survey la sediu</h3>
                  <p className="text-sm text-gray-600">
                    Evaluare la fața locului: inventar echipamente, măsurători, identificare 
                    provocări logistice.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Ofertă detaliată & contract</h3>
                  <p className="text-sm text-gray-600">
                    Primești ofertă transparentă cu toate costurile, timeline și responsabilități.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Planificare & împachetare</h3>
                  <p className="text-sm text-gray-600">
                    Etichetare sistematică, împachetare profesională IT, pregătire documente.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Relocare & instalare</h3>
                  <p className="text-sm text-gray-600">
                    Transport, montare mobilier, reconectare echipamente. Predare la cheie!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Relocați biroul în siguranță
            </h2>
            <p className="mb-8 text-lg text-slate-300">
              Solicită o ofertă personalizată pentru compania ta. Răspundem în maxim 24h.
            </p>
            <Link
              href="/customer/auth"
              className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 font-bold text-white shadow-xl transition-all hover:bg-emerald-600"
            >
              Solicită Ofertă B2B
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}
