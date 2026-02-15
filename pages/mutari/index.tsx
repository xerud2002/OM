import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { AggregateRatingSchema, FAQPageSchema } from "@/components/seo/SchemaMarkup";
import { getReviewStats } from "@/lib/firebaseAdmin";
import { SERVICE_FAQS } from "@/data/faqData";
import {
  ArrowRightIcon as ArrowRight,
  MapPinIcon as MapPin,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface MutariIndexPageProps {
  currentYear: number;
  reviewStats: { ratingValue: number; reviewCount: number };
}

export default function MutariIndexPage({ currentYear, reviewStats }: MutariIndexPageProps) {

  const mutariTypes = [
    {
      title: "Mutări Apartamente",
      description: "Cel mai solicitat tip de mutare pe platformă. Firmele partenere acoperă garsoniere, apartamente cu 2-4+ camere, inclusiv transport la etaj fără lift, cu echipe de 2-4 persoane experimentate.",
      price: "de la 400 lei",
      href: "/mutari/tipuri/apartamente",
      badge: "Popular",
    },
    {
      title: "Mutări Case și Vile",
      description: "Firmele partenere asigură transport profesional pentru case și vile de orice dimensiune: mobilier greu, electrocasnice mari, obiecte de grădină. Echipe de 4-6 persoane cu camioane de 7.5t+.",
      price: "de la 1.500 lei",
      href: "/mutari/tipuri/case",
      badge: null,
    },
    {
      title: "Mutări Studenți",
      description: "Pachete economic adaptate bugetului studențesc. Perfect pentru mutări între cămine, garsoniere sau între orașe la început/sfârșit de an universitar. Fără comision ascuns, preț fix.",
      price: "de la 300 lei",
      href: "/mutari/tipuri/studenti",
      badge: "Preț mic",
    },
    {
      title: "Mutări Birouri și Companii",
      description: "Relocare de firme cu zero downtime. Planificare în avans, mutare în weekend sau pe timp de noapte, manipulare echipamente IT, servere și mobilier de birou. Asigurare inclusă.",
      price: "de la 2.000 lei",
      href: "/mutari/tipuri/birouri",
      badge: null,
    },
  ];

  const mutariSpecializate = [
    {
      title: "Mutări Piane și Instrumente Muzicale",
      description: "Firmele partenere dispun de echipament specializat: platforme cu suspensie, chingi capitonate, rampe pentru piane verticale și cu coadă. Echipe antrenate pentru obiecte de 200-500 kg.",
      price: "de la 800 lei",
      href: "/mutari/specializate/piane",
    },
  ];

  const topCities = [
    { name: "București", href: "/mutari/bucuresti", pop: "2M+ loc." },
    { name: "Cluj-Napoca", href: "/mutari/cluj-napoca", pop: "400K loc." },
    { name: "Timișoara", href: "/mutari/timisoara", pop: "350K loc." },
    { name: "Iași", href: "/mutari/iasi", pop: "380K loc." },
    { name: "Constanța", href: "/mutari/constanta", pop: "340K loc." },
    { name: "Brașov", href: "/mutari/brasov", pop: "290K loc." },
    { name: "Craiova", href: "/mutari/craiova", pop: "300K loc." },
    { name: "Galați", href: "/mutari/galati", pop: "270K loc." },
    { name: "Oradea", href: "/mutari/oradea", pop: "220K loc." },
    { name: "Ploiești", href: "/mutari/ploiesti", pop: "230K loc." },
    { name: "Sibiu", href: "/mutari/sibiu", pop: "170K loc." },
    { name: "Arad", href: "/mutari/arad", pop: "170K loc." },
  ];

  const steps = [
    {
      icon: ClipboardDocumentCheckIcon,
      title: "1. Descrie mutarea",
      text: "Completezi formularul în 2 minute: de unde, unde, ce volum de mobilă ai și când vrei să te muți.",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "2. Primești până la 5 oferte",
      text: "Firmele verificate din zona ta îți trimit oferte personalizate cu preț, detalii și disponibilitate.",
    },
    {
      icon: TruckIcon,
      title: "3. Alegi și te muți",
      text: "Compari ofertele, alegi firma potrivită și te muți liniștit. Fără comisioane ascunse.",
    },
  ];

  const pageFaqs = SERVICE_FAQS.general;

  return (
    <>
      <Head>
        <title>{`Mutări ${currentYear} | Apartamente, Case, Birouri, Studenți | Oferte Gratuite`}</title>
        <meta
          name="description"
          content={`Compară firme de mutări verificate în România ${currentYear}. Apartamente, case, birouri, studenți. Până la 5 oferte gratuite în 24h.`}
        />
        <meta name="keywords" content="mutări, firme mutări, oferte mutare, transport mobilă, mutare apartament, mutare casă, mutări ieftine, firme mutări verificate" />
        <link rel="canonical" href="https://ofertemutare.ro/mutari" />

        <meta name="robots" content="index, follow, max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/mutari" />
        <meta property="og:title" content={`Mutări ${currentYear} | Apartamente, Case, Birouri`} />
        <meta property="og:description" content="Găsește firma perfectă pentru orice tip de mutare. Oferte gratuite în 24h!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
        <meta property="og:locale" content="ro_RO" />
        <meta property="og:site_name" content="OferteMutare.ro" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/mutari" />
        <meta name="twitter:title" content={`Mutări ${currentYear} | Oferte Gratuite`} />
        <meta name="twitter:description" content="Apartamente, case, birouri, studenți. Compară oferte gratuit!" />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* JSON-LD: Service + ItemList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: "Servicii de Mutări în România",
              serviceType: "Platformă comparare oferte mutări",
              broker: {
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
                name: "Tipuri de Mutări",
                itemListElement: mutariTypes.map((t, i) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: t.title,
                    description: t.description,
                  },
                  position: i + 1,
                })),
              },
              description: "Platformă de comparare oferte de la firme de mutări verificate. Mutări apartamente, case, birouri și studenți. Până la 5 oferte gratuite în 24h.",
            }),
          }}
        />
      </Head>

      <LayoutWrapper>
        <Breadcrumbs items={[{ name: "Acasă", href: "/" }, { name: "Mutări" }]} />
        {reviewStats.reviewCount > 0 && (
          <AggregateRatingSchema ratingValue={reviewStats.ratingValue} reviewCount={reviewStats.reviewCount} />
        )}
        <FAQPageSchema faqs={pageFaqs} />

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-mutari py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Compară Firme de{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Mutări Verificate
              </span>
            </h1>
            <p className="mb-8 mx-auto max-w-2xl text-lg text-purple-100 md:text-xl">
              Alege tipul de mutare, selectează orașul și primești până la 5 oferte gratuite de la firme verificate în maxim 24 de ore.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200">
              <span className="flex items-center gap-1.5"><ShieldCheckIcon className="h-5 w-5 text-green-400" /> Firme verificate</span>
              <span className="flex items-center gap-1.5"><ClockIcon className="h-5 w-5 text-yellow-400" /> Oferte în 24h</span>
              <span className="flex items-center gap-1.5"><CurrencyEuroIcon className="h-5 w-5 text-blue-400" /> 100% gratuit</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">Cum Funcționează?</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
              Procesul e simplu și complet gratuit. Noi te conectăm cu cele mai bune firme de mutări din zona ta.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                    <step.icon className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          {/* Tipuri de Mutări */}
          <section className="mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Tipuri de Mutări</h2>
            <p className="mb-8 max-w-3xl text-gray-600">
              Indiferent că te muți dintr-o garsonieră sau relocezi un sediu de firmă, pe platformă găsești firme partenere specializate pe fiecare tip de mutare.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {mutariTypes.map((type) => (
                <Link
                  key={type.href}
                  href={type.href}
                  className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                >
                  {type.badge && (
                    <span className="absolute -top-3 right-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                      {type.badge}
                    </span>
                  )}
                  <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-purple-600">
                    {type.title}
                  </h3>
                  <p className="mb-4 text-gray-600 leading-relaxed">{type.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">{type.price}</span>
                    <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                      Vezi detalii
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Mutări Specializate */}
          <section className="mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Mutări Specializate</h2>
            <p className="mb-8 max-w-3xl text-gray-600">
              Unele obiecte necesită echipament și expertiză specială. Firmele noastre partenere sunt echipate pentru transportul obiectelor grele sau fragile.
            </p>
            <div className="grid gap-6">
              {mutariSpecializate.map((type) => (
                <Link
                  key={type.href}
                  href={type.href}
                  className="group rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                >
                  <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-purple-600">
                    {type.title}
                  </h3>
                  <p className="mb-4 text-gray-600 leading-relaxed">{type.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">{type.price}</span>
                    <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                      Vezi detalii
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Why us - social proof + trust */}
          <section className="mb-16 rounded-2xl bg-linear-to-br from-purple-50 to-indigo-50 p-8 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">De ce OferteMutare.ro?</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Firme verificate legal</div>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">Până la 5</div>
                <div className="text-sm text-gray-600">Oferte per cerere</div>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <CurrencyEuroIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">Compari</div>
                <div className="text-sm text-gray-600">Prețuri și alegi liber</div>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <StarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">0 lei</div>
                <div className="text-sm text-gray-600">Comision pentru clienți</div>
              </div>
            </div>
          </section>

          {/* Top Cities */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-7 w-7 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Firme de Mutări pe Orașe</h2>
            </div>
            <p className="mb-8 max-w-3xl text-gray-600">
              Firmele partenere acoperă toate orașele mari din România. Selectează orașul tău pentru a vedea firmele disponibile și prețurile orientative.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {topCities.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-purple-400 hover:shadow-lg"
                >
                  <span className="block font-semibold text-gray-900 group-hover:text-purple-600">
                    Mutări {city.name}
                  </span>
                  <span className="text-xs text-gray-400">{city.pop}</span>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Nu ai găsit orașul tău? <Link href="/customer/auth" className="text-purple-600 font-medium hover:underline">Completează formularul</Link>, firmele partenere acoperă și localitățile mai mici.
            </p>
          </section>

          {/* SEO Text Section */}
          <section className="mb-16 prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900">Ghid Complet: Cum Să Alegi Firma de Mutări Potrivită în {currentYear}</h2>

            <p className="text-gray-700 leading-relaxed">
              Alegerea unei firme de mutări de încredere este esențială pentru o relocare fără probleme. În România, piața serviciilor de mutări
              a crescut semnificativ în ultimii ani, cu sute de firme active în fiecare județ. Cum diferențiezi o firmă profesionistă de una
              neserioasă? Prin <strong>compararea mai multor oferte</strong> de la firme verificate.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">Ce include o ofertă de mutare standard?</h3>
            <p className="text-gray-700 leading-relaxed">
              O ofertă completă de mutare trebuie să precizeze clar: <strong>prețul total</strong> (nu doar &ldquo;de la...&rdquo;),
              numărul de mutători, tipul și dimensiunea camionului, <strong>asigurarea bunurilor</strong> pe durata transportului,
              eventuale costuri suplimentare (etaj fără lift, obiecte grele) și intervalul orar. Pe OferteMutare.ro primești
              până la 5 astfel de oferte detaliate, gratuit.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">Cât costă o mutare în {currentYear}?</h3>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Garsonieră / studio:</strong> 300 – 600 lei (mutare locală)</span></li>
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Apartament 2-3 camere:</strong> 600 – 1.200 lei (mutare locală)</span></li>
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Casă / vilă:</strong> 1.500 – 4.000+ lei (în funcție de volum)</span></li>
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Birou / firmă:</strong> 2.000 – 8.000+ lei (în funcție de suprafață)</span></li>
              <li className="flex items-start gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> <span><strong>Mutare între orașe:</strong> +5-8 lei/km distanță suplimentară</span></li>
            </ul>
            <p className="text-gray-500 text-sm italic">
              Prețurile sunt orientative pentru {currentYear} și variază în funcție de sezon, disponibilitate și volum.{" "}
              <Link href="/calculator" className="text-purple-600 font-medium hover:underline">Calculează prețul exact →</Link>
            </p>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Întrebări Frecvente despre Mutări</h2>
            <div className="space-y-4">
              {pageFaqs.map((faq) => (
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

          {/* Cross-link to Servicii */}
          <section className="mb-16 rounded-2xl border-2 border-purple-200 bg-purple-50 p-8">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Ai nevoie și de servicii suplimentare?</h2>
            <p className="mb-6 text-gray-600">
              Pe lângă mutare, firmele partenere oferă și împachetare profesională, montaj mobilă, depozitare temporară și debarasare mobilă veche.
            </p>
            <Link
              href="/servicii"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition-all hover:bg-purple-700"
            >
              Vezi Servicii Suplimentare
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-linear-to-r from-purple-600 to-violet-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Gata să te muți?</h2>
            <p className="mb-8 mx-auto max-w-xl text-lg text-purple-100">
              Completeză formularul gratuit, primești până la 5 oferte în 24h și alegi cea mai bună variantă pentru bugetul tău.
            </p>
            <Link
              href="/customer/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-purple-700 shadow-xl transition-all hover:bg-purple-50"
            >
              Cere Oferte Gratuite Acum
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>
        </div>
      </LayoutWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<MutariIndexPageProps> = async () => {
  const reviewStats = await getReviewStats();
  return {
    props: {
      currentYear: new Date().getFullYear(),
      reviewStats,
    },
    revalidate: 3600,
  };
};



