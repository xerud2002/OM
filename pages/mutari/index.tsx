import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import { ArrowRightIcon as ArrowRight, MapPinIcon as MapPin } from "@heroicons/react/24/outline";

interface MutariIndexPageProps {
  currentYear: number;
}

export default function MutariIndexPage({ currentYear }: MutariIndexPageProps) {

  const mutariTypes = [
    {
      title: "Mutări Apartamente",
      description: "De la garsoniere la apartamente cu 4+ camere. Prețuri de la 400 lei.",
      href: "/mutari/tipuri/apartamente",
    },
    {
      title: "Mutări Case și Vile",
      description: "Transport profesional pentru case mari și vile. Echipe 4-6 persoane.",
      href: "/mutari/tipuri/case",
    },
    {
      title: "Mutări Studenți",
      description: "Prețuri speciale pentru studenți. De la 300 lei pentru cămine.",
      href: "/mutari/tipuri/studenti",
    },
    {
      title: "Mutări Birouri",
      description: "Relocare companii cu zero downtime. Weekend și program noapte.",
      href: "/mutari/tipuri/birouri",
    },
  ];

  const mutariSpecializate = [
    {
      title: "Mutări Piane",
      description: "Transport specializat pentru piane verticale și cu coadă.",
      href: "/mutari/specializate/piane",
    },
  ];

  const topCities = [
    { name: "București", href: "/mutari/bucuresti" },
    { name: "Cluj-Napoca", href: "/mutari/cluj-napoca" },
    { name: "Timișoara", href: "/mutari/timisoara" },
    { name: "Iași", href: "/mutari/iasi" },
    { name: "Constanța", href: "/mutari/constanta" },
    { name: "Brașov", href: "/mutari/brasov" },
  ];

  return (
    <>
      <Head>
        <title>{`Servicii Mutări ${currentYear} | Toate Tipurile de Mutări`}</title>
        <meta
          name="description"
          content="✓ Găsește firma perfectă pentru mutarea ta ✓ Apartamente, case, birouri, studenți ✓ 3-5 oferte GRATUITE în 24h → Compară și economisești 40%!"
        />
        <meta name="keywords" content="mutări, firme mutări, servicii mutare, oferte mutare, transport mobilă" />
        <link rel="canonical" href="https://ofertemutare.ro/mutari" />
        
        <meta name="robots" content="index, follow, max-image-preview:large" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/mutari" />
        <meta property="og:title" content={`Servicii Mutări ${currentYear} | Toate Tipurile`} />
        <meta property="og:description" content="Găsește firma perfectă pentru orice tip de mutare. Oferte gratuite în 24h!" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
        <meta property="og:locale" content="ro_RO" />
        <meta property="og:site_name" content="OferteMutare.ro" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/mutari" />
        <meta name="twitter:title" content={`Servicii Mutări ${currentYear}`} />
        <meta name="twitter:description" content="Toate tipurile de mutări. Oferte gratuite!" />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              serviceType: "Servicii Mutări România",
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
              description: "Găsește firma perfectă pentru mutarea ta. Apartamente, case, birouri, studenți. 3-5 oferte GRATUITE în 24h.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Acasă", item: "https://ofertemutare.ro" },
                { "@type": "ListItem", position: 2, name: "Mutări" },
              ],
            }),
          }}
        />
      </Head>

      <LayoutWrapper>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-mutari py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-2xl font-extrabold text-white! md:text-5xl lg:text-6xl">
              Servicii Complete de{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Mutări
              </span>
            </h1>
            <p className="mb-10 mx-auto max-w-2xl text-lg text-purple-100 md:text-xl">
              Găsește firma perfectă pentru orice tip de mutare. Compară 3-5 oferte gratuite și economisești până la 40%!
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          {/* Tipuri de Mutări */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Tipuri de Mutări</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {mutariTypes.map((type) => {
                return (
                  <Link
                    key={type.href}
                    href={type.href}
                    className="group rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                  >
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-purple-600">
                        {type.title}
                      </h3>
                      <p className="mb-3 text-gray-600">{type.description}</p>
                      <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                        Vezi detalii
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Mutări Specializate */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Mutări Specializate</h2>
            <div className="grid gap-6">
              {mutariSpecializate.map((type) => {
                return (
                  <Link
                    key={type.href}
                    href={type.href}
                    className="group rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-xl"
                  >
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-purple-600">
                        {type.title}
                      </h3>
                      <p className="mb-3 text-gray-600">{type.description}</p>
                      <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                        Vezi detalii
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Top Cities */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="h-7 w-7 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Mutări pe Orașe</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {topCities.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  className="group rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-purple-400 hover:shadow-lg"
                >
                  <span className="font-semibold text-gray-900 group-hover:text-purple-600">
                    Mutări {city.name} →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-linear-to-r from-purple-600 to-violet-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Gata să începi?</h2>
            <p className="mb-8 text-lg text-purple-100">
              Primește 3-5 oferte gratuite în 24h și economisește până la 40%.
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
  return {
    props: {
      currentYear: new Date().getFullYear(),
    },
  };
};



