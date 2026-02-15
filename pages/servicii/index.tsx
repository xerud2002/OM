import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { AggregateRatingSchema, FAQPageSchema } from "@/components/seo/SchemaMarkup";
import { getReviewStats } from "@/lib/firebaseAdmin";
import {
  CubeIcon as Package,
  WrenchScrewdriverIcon as Wrench,
  BuildingStorefrontIcon as Warehouse,
  TrashIcon as Trash2,
  ArrowRightIcon as ArrowRight,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface ServiciiIndexPageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

const serviciiPageFaqs = [
  {
    question: "Pot comanda doar împachetare, fără mutare?",
    answer: "Da! Fiecare serviciu poate fi comandat separat. Poți solicita doar materiale de împachetare, doar montaj mobilă, doar depozitare sau orice combinație. Firmele partenere se adaptează nevoilor tale.",
  },
  {
    question: "Ce materiale de împachetare sunt incluse?",
    answer: "Pachetul standard include: cutii de carton (diferite dimensiuni), bubble wrap, folie stretch, bandă adezivă, hârtie de ambalat și markere. Pentru obiecte fragile se folosesc coltare din spumă și carton ondulat dublu.",
  },
  {
    question: "Cât timp pot depozita mobilă?",
    answer: "Depozitarea este flexibilă: de la 1 săptămână la 12+ luni. Spațiile sunt climatizate, securizate 24/7 cu camere video și acces controlat. Prețurile pornesc de la 150 lei/lună pentru un boxpalot de 3-4 mc.",
  },
  {
    question: "Montatorii pot asambla mobilă IKEA?",
    answer: "Da! Echipele partenerilor noștri sunt specializate în asamblare/dezasamblare mobilier IKEA, Jysk, Mobexpert și orice mobilier cu instrucțiuni. Timpul mediu: 30-60 minute per piesă de mobilier.",
  },
  {
    question: "Ce se întâmplă cu mobila veche la debarasare?",
    answer: "Mobila veche este evacuată profesional. Firmele partenere reciclează ce se poate (lemn, metal, textile) și transportă restul la centrele autorizate de colectare deșeuri. Primești confirmare de reciclare eco-friendly.",
  },
];

export default function ServiciiIndexPage({ currentYear, reviewStats }: ServiciiIndexPageProps) {

  const servicii = [
    {
      title: "Împachetare Profesională",
      description: "Firmele partenere oferă echipe dedicate care împachetează totul: veselă, electronice, haine, cărți, decorațiuni. Se folosesc materiale premium cu protecție multi-strat și asigurare inclusă.",
      icon: Package,
      href: "/servicii/impachetare/profesionala",
      color: "rose",
      price: "de la 200 lei",
      duration: "2-4 ore",
    },
    {
      title: "Materiale de Împachetare",
      description: "Kit-uri complete de ambalare disponibile prin firmele partenere: cutii în 5 mărimi, bubble wrap, folie stretch, bandă adezivă, hârtie, markere. Livrare la domiciliu, cu posibilitatea returnării materialelor nefolosite.",
      icon: SparklesIcon,
      href: "/servicii/impachetare/materiale",
      color: "indigo",
      price: "de la 80 lei / kit",
      duration: "Livrare în aceeași zi",
    },
    {
      title: "Montaj și Demontare Mobilă",
      description: "Firmele partenere pun la dispoziție montatori profesioniști pentru dulapuri, paturi, bucătării, mobilier IKEA/Jysk și mobilier personalizat. Experiență 5+ ani, scule proprii. Inclusiv montaj lustre și cornișe.",
      icon: Wrench,
      href: "/servicii/montaj/mobila",
      color: "cyan",
      price: "de la 150 lei",
      duration: "1-3 ore",
    },
    {
      title: "Depozitare Temporară",
      description: "Boxe securizate 24/7 cu climatizare, camere video și acces controlat. Ideale între vânzare și cumpărare, renovări sau relocări internaționale. Contracte flexibile de la 1 săptămână.",
      icon: Warehouse,
      href: "/servicii/depozitare",
      color: "amber",
      price: "de la 150 lei / lună",
      duration: "Contract flexibil",
    },
    {
      title: "Debarasare și Evacuare",
      description: "Evacuare mobilă veche, electrocasnice, moloz și deșeuri voluminoase. Reciclare eco-friendly cu confirmare. Ideală după renovări, moșteniri sau curățări generale ale locuinței.",
      icon: Trash2,
      href: "/servicii/debarasare",
      color: "emerald",
      price: "de la 250 lei",
      duration: "2-4 ore",
    },
  ];

  const bundles = [
    {
      name: "Pachet Standard",
      desc: "Împachetare + Mutare",
      detail: "Cel mai popular. Include ambalarea completă a bunurilor + transportul la noua adresă.",
      saving: "Economie ~15%",
    },
    {
      name: "Pachet Confort",
      desc: "Împachetare + Mutare + Montaj",
      detail: "Tot ce include Standard + demontare/montare mobilier la ambele adrese.",
      saving: "Economie ~20%",
    },
    {
      name: "Pachet Premium",
      desc: "Totul inclus",
      detail: "Împachetare, mutare, montaj, debarasare mobilă veche la adresa nouă. Zero stres.",
      saving: "Economie ~25%",
    },
  ];

  return (
    <>
      <Head>
        <title>{`Servicii Mutare ${currentYear} | Împachetare, Montaj, Depozitare, Debarasare`}</title>
        <meta
          name="description"
          content={`✓ Servicii auxiliare pentru mutare ${currentYear} ✓ Împachetare profesională, montaj mobilă, depozitare securizată, debarasare eco ✓ Oferte de la firme verificate → Compară gratuit!`}
        />
        <meta name="keywords" content="împachetare profesională, montaj mobilă, depozitare mobilă, materiale ambalare, debarasare, servicii mutare auxiliare" />
        <link rel="canonical" href="https://ofertemutare.ro/servicii" />

        <meta name="robots" content="index, follow, max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/servicii" />
        <meta property="og:title" content={`Servicii Auxiliare Mutare ${currentYear}`} />
        <meta property="og:description" content="Împachetare, montaj, depozitare, debarasare. Oferte de la firme verificate!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
        <meta property="og:locale" content="ro_RO" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/servicii" />
        <meta name="twitter:title" content={`Servicii Auxiliare Mutare ${currentYear}`} />
        <meta name="twitter:description" content="Împachetare, montaj, depozitare, debarasare. Oferte de la firme verificate!" />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* JSON-LD: Service + OfferCatalog */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: "Servicii Auxiliare pentru Mutări",
              serviceType: "Servicii Complementare Mutări",
              provider: {
                "@type": "Organization",
                name: "OferteMutare.ro",
                url: "https://ofertemutare.ro",
                logo: "https://ofertemutare.ro/pics/index.webp",
              },
              areaServed: {
                "@type": "Country",
                name: "România",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicii Disponibile",
                itemListElement: servicii.map((s, i) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: s.title,
                    description: s.description,
                  },
                  position: i + 1,
                })),
              },
              description: "Compară oferte de la firme partenere verificate pentru servicii auxiliare de mutare: împachetare profesională, montaj mobilă, materiale ambalare, depozitare securizată, debarasare. Prețuri orientative.",
            }),
          }}
        />
      </Head>

      <LayoutWrapper>
        <Breadcrumbs items={[{ name: "Acasă", href: "/" }, { name: "Servicii" }]} />
        {reviewStats.reviewCount > 0 && (
          <AggregateRatingSchema ratingValue={reviewStats.ratingValue} reviewCount={reviewStats.reviewCount} />
        )}
        <FAQPageSchema faqs={serviciiPageFaqs} />

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-brand py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Servicii Auxiliare{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                pentru Mutare
              </span>
            </h1>
            <p className="mb-8 mx-auto max-w-2xl text-lg text-purple-100 md:text-xl">
              Compară oferte pentru împachetare, montaj mobilă, depozitare și debarasare — servicii oferite de firmele noastre partenere verificate. Prețurile afișate sunt orientative.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200">
              <span className="flex items-center gap-1.5"><ShieldCheckIcon className="h-5 w-5 text-green-400" /> Firme verificate</span>
              <span className="flex items-center gap-1.5"><ClockIcon className="h-5 w-5 text-yellow-400" /> Programare flexibilă</span>
              <span className="flex items-center gap-1.5"><CheckCircleIcon className="h-5 w-5 text-blue-400" /> Prețuri indicative</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          {/* All Services */}
          <section className="mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Toate Serviciile Disponibile</h2>
            <p className="mb-8 max-w-3xl text-gray-600">
              Toate serviciile de mai jos sunt oferite de firmele noastre partenere verificate. Poți solicita oferte separate sau combinate, cu prețuri transparente. Prețurile afișate sunt orientative.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {servicii.map((serviciu) => {
                const Icon = serviciu.icon;
                return (
                  <Link
                    key={serviciu.href}
                    href={serviciu.href}
                    className="group rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`rounded-xl bg-${serviciu.color}-100 p-3 shrink-0`}>
                        <Icon className={`h-6 w-6 text-${serviciu.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-purple-600">
                          {serviciu.title}
                        </h3>
                        <p className="mb-4 text-gray-600 leading-relaxed">{serviciu.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">{serviciu.price}</span>
                          <span className="text-xs text-gray-400">{serviciu.duration}</span>
                        </div>
                        <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                          Vezi detalii
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Bundles */}
          <section className="mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Pachete Combinate — Economie Garantată</h2>
            <p className="mb-8 max-w-3xl text-gray-600">
              Combinarea serviciilor într-un singur pachet reduce costul total. Firmele oferă reduceri între 15-25% pentru pachete complete față de rezervări individuale.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {bundles.map((bundle) => (
                <div key={bundle.name} className="rounded-2xl border-2 border-gray-200 bg-white p-6 hover:border-purple-300 transition-colors">
                  <div className="mb-2 text-xs font-bold text-purple-600 uppercase tracking-wide">{bundle.saving}</div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900">{bundle.name}</h3>
                  <p className="mb-3 text-sm font-medium text-gray-500">{bundle.desc}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{bundle.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-16 rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 p-8 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">De Ce Să Adaugi Servicii Suplimentare?</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">50%</div>
                <div className="text-sm text-gray-600">Mai puține daune cu ambalare profesională</div>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">2x</div>
                <div className="text-sm text-gray-600">Mai rapid cu montaj profesionist</div>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <SparklesIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">0 stres</div>
                <div className="text-sm text-gray-600">Depozitare securizată, climatizată</div>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Trash2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">Eco</div>
                <div className="text-sm text-gray-600">Debarasare cu reciclare certificată</div>
              </div>
            </div>
          </section>

          {/* SEO Text Section */}
          <section className="mb-16 prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900">Ce Servicii Suplimentare Ai Nevoie la Mutare?</h2>

            <p className="text-gray-700 leading-relaxed">
              O mutare nu înseamnă doar transportul mobilei de la A la B. Cele mai stresante aspecte sunt, de fapt, <strong>pregătirea bunurilor</strong> (împachetare,
              dezasamblare mobilier), <strong>protejarea obiectelor fragile</strong> și <strong>organizarea spațiilor</strong> la noua adresă (montaj, despachetare).
              Prin adăugarea serviciilor auxiliare, transformi o experiență obositoare într-un proces gestionat profesional.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">Când Merită Împachetarea Profesională?</h3>
            <p className="text-gray-700 leading-relaxed">
              Dacă ai veselă, tablouri, obiecte de valoare sau electronice sensibile, împachetarea profesională reduce dramatic riscul de daune.
              Echipele firmelor partenere folosesc <strong>materiale multi-strat</strong> (carton ondulat, spumă polietilenică, folie cu bule de aer) și tehnici
              specifice fiecărui tip de obiect. În plus, firmele care oferă împachetare profesională acoperă daunele prin asigurare.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">Cât Costă Serviciile Suplimentare în {currentYear}?</h3>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Împachetare completă:</strong> 200 – 600 lei (în funcție de volum)</span></li>
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Kit materiale DIY:</strong> 80 – 200 lei (cutii, folie, bandă)</span></li>
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Montaj / demontare:</strong> 150 – 400 lei per locație</span></li>
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Depozitare:</strong> 150 – 400 lei / lună (3-10 mc)</span></li>
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Debarasare:</strong> 250 – 800 lei (în funcție de volum)</span></li>
            </ul>
            <p className="text-gray-500 text-sm italic">
              Prețurile sunt orientative pentru {currentYear} și pot varia în funcție de firma parteneră. Solicită oferte personalizate pentru un preț exact.
            </p>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Întrebări Frecvente despre Servicii</h2>
            <div className="space-y-4">
              {serviciiPageFaqs.map((faq) => (
                <details key={faq.question} className="group rounded-xl border border-gray-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900 hover:text-purple-600">
                    {faq.question}
                    <ArrowRight className="h-4 w-4 rotate-90 transition-transform group-open:rotate-270 text-gray-400" />
                  </summary>
                  <p className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Cross-link to Mutări */}
          <section className="mb-16 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-8">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Cauți și o firmă de mutări?</h2>
            <p className="mb-6 text-gray-600">
              Compară firme verificate pentru mutare de apartament, casă, birou sau cameră de student. Primești 3-5 oferte gratuite în 24h.
            </p>
            <Link
              href="/mutari"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-all hover:bg-indigo-700"
            >
              Vezi Tipuri de Mutări
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Adaugă Servicii la Mutarea Ta</h2>
            <p className="mb-8 mx-auto max-w-xl text-lg text-purple-100">
              Completează formularul gratuit, menționează serviciile dorite și primești oferte personalizate de la firme care le pot livra la pachet.
            </p>
            <Link
              href="/#request-form"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-purple-700 shadow-xl transition-all hover:bg-purple-50"
            >
              Cere Oferte Gratuite
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>
        </div>
      </LayoutWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<ServiciiIndexPageProps> = async () => {
  const reviewStats = await getReviewStats();
  return {
    props: {
      currentYear: new Date().getFullYear(),
      reviewStats,
    },
    revalidate: 3600,
  };
};



