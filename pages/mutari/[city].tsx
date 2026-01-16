import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import {
  MapPin,
  Shield,
  Truck,
  Package,
  Star,
  CheckCircle,
  ArrowRight,
  Building2,
  Home,
  Calendar,
  TrendingDown,
} from "lucide-react";
import { getCityBySlug, getAllCitySlugs, CityData } from "@/utils/citySlugData";

interface CityPageProps {
  city: CityData;
}

export default function CityPage({ city }: CityPageProps) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>Mutări {city.name} {currentYear} | Firme Verificate & Oferte Gratuite</title>
        <meta name="description" content={city.metaDescription} />
        <meta
          name="keywords"
          content={`mutări ${city.name}, firme mutări ${city.name}, transport mobilă ${city.name}, mutări ${city.county}, servicii mutare ${city.name}`}
        />
        <link rel="canonical" href={`https://ofertemutare.ro/mutari/${city.slug}`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://ofertemutare.ro/mutari/${city.slug}`} />
        <meta
          property="og:title"
          content={`Mutări ${city.name} ${currentYear} | Economisește până la 40%`}
        />
        <meta property="og:description" content={city.metaDescription} />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://ofertemutare.ro/mutari/${city.slug}`} />
        <meta
          name="twitter:title"
          content={`Mutări ${city.name} ${currentYear} | Economisește până la 40%`}
        />
        <meta name="twitter:description" content={city.metaDescription} />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />
      </Head>

      <LayoutWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 py-20">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/3" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-emerald-200" />
              <span className="text-emerald-100 text-sm font-medium">
                Județul {city.county} • {city.population} locuitori
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
              Mutări în{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {city.name}
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-emerald-100 md:text-xl">
              {city.heroSubtitle}
            </p>

            {/* Stats */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">3-5</div>
                <div className="text-sm text-emerald-100">Oferte în 24h</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">40%</div>
                <div className="text-sm text-emerald-100">Economie medie</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-emerald-100">Gratuit</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-emerald-100">Firme verificate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/customer/auth"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-emerald-700 shadow-xl transition-all hover:bg-emerald-50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Cere Oferte Gratuite
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 font-semibold text-white transition-all hover:bg-white/10"
              >
                Cum funcționează?
              </Link>
            </div>
          </div>
        </section>

        {/* Main Article Content */}
        <article className="mx-auto max-w-4xl px-4 py-16">
          {/* Intro Section */}
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Cum găsești cea mai bună firmă de mutări în {city.name}?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                {city.articleIntro || 
                  `Te pregătești pentru o mutare în ${city.name}? Înțelegem cât de stresant
                  poate fi procesul – de la găsirea firmei potrivite, la negocierea prețurilor și
                  coordonarea logisticii. Cu o populație de ${city.population} de locuitori,
                  ${city.name} este unul dintre cele mai dinamice orașe din România, cu zeci de firme de
                  mutări active în zonă.`
                }
              </p>
              {!city.articleIntro && (
                <p>
                  Vestea bună? Pe <strong>OferteMutare.ro</strong> simplifici tot procesul. Completezi un
                  singur formular în 3 minute și primești 3-5 oferte personalizate de la firme verificate
                  din {city.county}. Compari prețurile, citești recenziile și alegi varianta perfectă
                  pentru tine – <strong>100% gratuit, fără obligații</strong>.
                </p>
              )}
            </div>
          </section>

          {/* Neighborhoods Section */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-slate-50 to-gray-50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-7 w-7 text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Mutări în toate cartierele din {city.name}
              </h2>
            </div>
            <p className="mb-6 text-gray-700">
              Indiferent dacă te muți din sau în cartierele {city.neighborhoods.slice(0, 3).join(", ")} sau
              alte zone ale orașului, firmele noastre partenere cunosc perfect {city.name}-ul. Beneficiezi de:
            </p>
            <div className="flex flex-wrap gap-2">
              {city.neighborhoods.map((neighborhood) => (
                <span
                  key={neighborhood}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200"
                >
                  {neighborhood}
                </span>
              ))}
            </div>
          </section>

          {/* Services Grid */}
          <section className="mb-12">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-7 w-7 text-emerald-600" />
              Servicii de mutări disponibile în {city.name}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-3">
                  <Home className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Mutări Apartamente</h3>
                <p className="text-gray-600">
                  De la garsoniere la apartamente cu 4+ camere. Echipe experimentate pentru blocuri
                  cu sau fără lift în {city.name}.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Mutări Case</h3>
                <p className="text-gray-600">
                  Mutări complete pentru case și vile. Transport mobilier voluminos, obiecte delicate
                  și grădină.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Mutări Birouri</h3>
                <p className="text-gray-600">
                  Relocare firme și birouri în {city.name}. Mutări în weekend pentru zero downtime.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-orange-100 p-3">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Împachetare & Depozitare</h3>
                <p className="text-gray-600">
                  Servicii complete: materiale de ambalare, împachetare profesională și depozitare
                  temporară sau pe termen lung.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Info */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingDown className="h-7 w-7 text-emerald-600" />
              Prețuri mutări {city.name} în {currentYear}
            </h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                {city.priceContext || 
                  `Prețurile pentru servicii de mutări în ${city.name} variază în funcție de mai mulți factori:
                  volumul bunurilor, distanța, etajul și serviciile suplimentare (împachetare, demontare
                  mobilier). Orientativ, pentru o mutare standard în ${city.name}:`
                }
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-5 text-center shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Garsonieră/Studio</div>
                <div className="text-2xl font-bold text-emerald-600">400-800 lei</div>
              </div>
              <div className="rounded-xl bg-white p-5 text-center shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Apartament 2-3 camere</div>
                <div className="text-2xl font-bold text-emerald-600">800-1.800 lei</div>
              </div>
              <div className="rounded-xl bg-white p-5 text-center shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Casă/Vilă</div>
                <div className="text-2xl font-bold text-emerald-600">2.000-5.000 lei</div>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              💡 <strong>Sfat:</strong> Compară minimum 3 oferte pentru a găsi cel mai bun raport
              calitate-preț. Diferențele pot fi de până la 40%!
            </p>
          </section>

          {/* Why Choose Us */}
          <section className="mb-12">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-7 w-7 text-emerald-600" />
              De ce să alegi OferteMutare.ro pentru mutări în {city.name}?
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {city.whyChooseUs && city.whyChooseUs.length > 0 ? (
                city.whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex gap-4">
                    <CheckCircle className="h-6 w-6 shrink-0 text-emerald-500 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900">{reason.split(':')[0]}</h3>
                      <p className="text-gray-600">{reason.split(':').slice(1).join(':').trim()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 shrink-0 text-emerald-500 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900">Firme verificate local</h3>
                      <p className="text-gray-600">
                        Toate firmele partenere sunt verificate și au experiență dovedită în {city.name}
                        și județul {city.county}.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 shrink-0 text-emerald-500 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900">Oferte rapide în 24h</h3>
                      <p className="text-gray-600">
                        Primești 3-5 oferte personalizate direct de la firme din {city.name}, fără să
                        suni sau negociezi.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 shrink-0 text-emerald-500 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900">100% gratuit și transparent</h3>
                      <p className="text-gray-600">
                        Serviciul nostru este complet gratuit. Nu există costuri ascunse sau obligații.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 shrink-0 text-emerald-500 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900">Recenzii reale</h3>
                      <p className="text-gray-600">
                        Citești recenzii verificate de la clienți reali din {city.name} care au folosit
                        aceste firme.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Local Tips */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="h-7 w-7 text-amber-600" />
              Sfaturi pentru mutări în {city.name}
            </h2>
            <ul className="space-y-4 text-gray-700">
              {city.localTips && city.localTips.length > 0 ? (
                city.localTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Star className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                    <span>
                      <strong>Rezervă din timp:</strong> În {city.name}, firmele bune se ocupă repede,
                      mai ales în perioadele de vârf (mai-septembrie, sfârșitul de lună).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                    <span>
                      <strong>Verifică accesul:</strong> Asigură-te că firma știe exact condițiile
                      de acces la ambele locații (lift, scări, parcare pentru camion).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                    <span>
                      <strong>Declară obiectele valoroase:</strong> Informează firma despre obiecte
                      fragile sau de valoare pentru transport în siguranță.
                    </span>
                  </li>
                  {city.landmarks.length > 0 && (
                    <li className="flex items-start gap-3">
                      <Star className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                      <span>
                        <strong>Orientare locală:</strong> Firmele cunosc bine zonele din jurul
                        {" "}{city.landmarks[0]} și alte repere importante din {city.name}.
                      </span>
                    </li>
                  )}
                </>
              )}
            </ul>
          </section>

          {/* Final CTA */}
          <section className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Gata să te muți în {city.name}?
            </h2>
            <p className="mb-8 text-lg text-emerald-100">
              Primește 3-5 oferte gratuite în 24h și economisește până la 40% la mutarea ta.
            </p>
            <Link
              href="/customer/auth"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-emerald-700 shadow-xl transition-all hover:bg-emerald-50 hover:shadow-2xl"
            >
              Cere Oferte Gratuite Acum
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>
        </article>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: `Servicii Mutări ${city.name}`,
              description: city.metaDescription,
              url: `https://ofertemutare.ro/mutari/${city.slug}`,
              areaServed: {
                "@type": "City",
                name: city.name,
                containedIn: {
                  "@type": "AdministrativeArea",
                  name: city.county,
                },
              },
              serviceType: "Moving Services",
              priceRange: "$$",
            }),
          }}
        />
      </LayoutWrapper>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllCitySlugs().map((slug) => ({
    params: { city: slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<CityPageProps> = async ({ params }) => {
  const slug = params?.city as string;
  const city = getCityBySlug(slug);

  if (!city) {
    return { notFound: true };
  }

  return {
    props: { city },
  };
};
