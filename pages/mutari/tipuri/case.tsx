import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import FAQSection from "@/components/content/FAQSection";
import { FAQPageSchema, LocalBusinessSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { HomeIcon as Home, CheckCircleIcon as CheckCircle, ArrowRightIcon as ArrowRight, ShieldCheckIcon as Shield, TruckIcon as Truck, CubeIcon as Package, UsersIcon as Users, CurrencyDollarIcon as DollarSign, HomeIcon as Sofa, KeyIcon as Key, HeartIcon as Heart, StarIcon as Star } from "@heroicons/react/24/outline";

interface MutariCasePageProps {
  currentYear: number;
}

export default function MutariCasePage({ currentYear }: MutariCasePageProps) {

  const faqItems = [
    {
      question: "Cât costă mutarea unei case în România?",
      answer: "Prețurile orientative sunt: 1.500-2.500 lei pentru case mici (2-3 camere), 2.500-4.000 lei pentru case medii (4-5 camere) și 5.000+ lei pentru vile mari. Depinde de volum, distanță și servicii suplimentare.",
    },
    {
      question: "Cât durează o mutare de casă?",
      answer: "Mutarea unei case durează de obicei 6-12 ore pentru case medii și până la 2 zile pentru vile mari cu multe bunuri. Timpul depinde de volumul mobilei, grădină și necesitatea de demontare/montare.",
    },
    {
      question: "Ce vehicule sunt necesare pentru mutarea unei case?",
      answer: "Pentru case sunt necesare camioane mari (3.5t, 7.5t sau chiar TIR pentru vile mari). Firmele de pe platformă au vehicule potrivite pentru volume mari de mobilă și obiecte grele.",
    },
    {
      question: "Pot solicita și transport pentru mobilier de grădină?",
      answer: "Da! Firmele partenere transportă tot ce ai: mobilier terasă, grătare, jardiniere mari, sculă de grădină și echipamente exterioare voluminoase.",
    },
  ];

  return (
    <>
      <Head>
        <title>{`Mutări Case și Vile ${currentYear} | Transport Mobilă Complet`}</title>
        <meta
          name="description"
          content="Servicii complete de mutări case și vile în România. Transport mobilă voluminos, grădină, obiecte delicate. Primește 3-5 oferte GRATUITE în 24h!"
        />
        <meta
          name="keywords"
          content="mutări case, mutare vilă, transport mobilă casă, mutare grădină, mutări case mari, firme mutări case, transport mobilă grea"
        />
        <link rel="canonical" href="https://ofertemutare.ro/mutari/tipuri/case" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/mutari/tipuri/case" />
        <meta property="og:title" content={`Mutări Case și Vile ${currentYear} | Economisește 40%`} />
        <meta
          property="og:description"
          content="Servicii complete de mutări case și vile. Primește oferte gratuite de la firme verificate!"
        />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Mutări Case și Vile ${currentYear}`} />
        <meta
          name="twitter:description"
          content="Servicii complete de mutări case și vile. Primește oferte gratuite!"
        />
      </Head>

      {/* Schema Markup */}
      <FAQPageSchema faqs={faqItems} />
      <LocalBusinessSchema serviceName="Mutări Case și Vile" />
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "/" },
          { name: "Mutări", url: "/mutari" },
          { name: "Tipuri", url: "/mutari/tipuri" },
          { name: "Case" },
        ]}
      />

      <LayoutWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-company py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-2 mb-6">
              <Home className="h-6 w-6 text-blue-200" />
              <span className="text-blue-100 text-sm font-medium">
                Servicii Specializate • Case și Vile
              </span>
            </div>

            <h1 className="mb-6 text-2xl md:text-4xl font-extrabold !text-white md:text-5xl lg:text-6xl">
              Mutări{" "}
              <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Case și Vile
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-blue-100 md:text-xl">
              Transport profesional pentru case mari, vile și proprietăți cu grădină.
              Echipe experimentate pentru mobilier voluminos și obiecte delicate.
            </p>

            {/* Stats */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">3-5</div>
                <div className="text-sm text-blue-100">Oferte în 24h</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">40%</div>
                <div className="text-sm text-blue-100">Economie medie</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-blue-100">Gratuit</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center">
                <div className="text-3xl font-bold text-white">✓</div>
                <div className="text-sm text-blue-100">Asigurare inclusă</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#request-form"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-blue-700 shadow-xl transition-all hover:bg-blue-50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Cere Oferte Gratuite
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Main Article Content */}
        <article className="mx-auto max-w-4xl px-4 py-16">
          {/* Intro */}
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              De ce mutarea unei case este diferită?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Mutarea unei <strong>case sau vile</strong> implică provocări unice față de mutarea
                unui apartament. Volumul mai mare de bunuri, mobilierul masiv, obiectele de grădină,
                și adesea distanțele mai mari fac această experiență mai complexă.
              </p>
              <p>
                La <strong>OferteMutare.ro</strong>, conectăm proprietarii de case cu firme specializate
                care au experiență în gestionarea mutărilor de mari dimensiuni. De la demontarea
                mobilierului de terasă până la transportul sigur al obiectelor de artă și antichităților,
                partenerii noștri știu exact ce presupune mutarea unei case.
              </p>
            </div>
          </section>

          {/* What's Included */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-7 w-7 text-blue-600" />
              Ce include serviciul de mutare casă?
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 shrink-0 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Transport mobilier masiv</h3>
                  <p className="text-gray-600">
                    Canapele colțar, dulapuri mari, paturi king-size, biblioteci și piese de mobilier
                    personalizat.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 shrink-0 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Obiecte de grădină</h3>
                  <p className="text-gray-600">
                    Mobilier de terasă, grătare, umbrele, jardiniere mari și echipamente de grădină.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 shrink-0 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Electrocasnice mari</h3>
                  <p className="text-gray-600">
                    Frigidere side-by-side, mașini de spălat, uscătoare, cuptoare și aparate de aer
                    condiționat.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 shrink-0 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Obiecte delicate și valoroase</h3>
                  <p className="text-gray-600">
                    Tablouri, sculpturi, antichități, oglinzi mari și colecții valoroase.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-green-600" />
              Prețuri orientative mutări case în {currentYear}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-gray-200 bg-white p-6 text-center hover:border-blue-300 transition-colors">
                <Sofa className="h-10 w-10 mx-auto mb-3 text-blue-500" />
                <div className="text-sm text-gray-500 mb-1">Casă 2-3 camere</div>
                <div className="text-2xl font-bold text-gray-900">1.500-2.500 lei</div>
              </div>
              <div className="rounded-xl border-2 border-blue-400 bg-blue-50 p-6 text-center">
                <Home className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                <div className="text-sm text-gray-500 mb-1">Casă 4-5 camere</div>
                <div className="text-2xl font-bold text-gray-900">2.500-4.000 lei</div>
                <div className="text-xs text-blue-600 mt-1">Cel mai popular</div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 bg-white p-6 text-center hover:border-blue-300 transition-colors">
                <Key className="h-10 w-10 mx-auto mb-3 text-blue-500" />
                <div className="text-sm text-gray-500 mb-1">Vilă mare / Conac</div>
                <div className="text-2xl font-bold text-gray-900">5.000+ lei</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              💡 Prețurile variază în funcție de distanță, volum și servicii suplimentare (împachetare,
              depozitare).
            </p>
          </section>

          {/* Why Choose Us */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-7 w-7 text-blue-600" />
              De ce să alegi OferteMutare.ro pentru mutarea casei tale?
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Vehicule potrivite pentru case</h3>
                    <p className="text-gray-600">
                      Camioane de 3.5t, 7.5t și TIR pentru volume mari. Platforme pentru obiecte
                      foarte grele sau voluminoase.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Echipe mai mari, experiență dovedită</h3>
                    <p className="text-gray-600">
                      Mutările de case necesită 4-6 persoane. Firmele noastre au echipe pregătite
                      pentru a gestiona volume mari eficient.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Heart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Grijă pentru obiectele tale valoroase</h3>
                    <p className="text-gray-600">
                      Ambalare profesională pentru antichități, tablouri și obiecte fragile.
                      Asigurare extinsă disponibilă.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Star className="h-7 w-7 text-amber-600" />
              Sfaturi pentru mutarea casei
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Programează un survey:</strong> Pentru case, o evaluare la fața locului
                  este esențială pentru o ofertă corectă.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Verifică accesul:</strong> Asigură-te că există loc de parcare pentru
                  camionul mare la ambele adrese.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Declară obiectele valoroase:</strong> Antichități, tablouri sau mobilier
                  făcut la comandă necesită atenție specială.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500 mt-1" />
                <span>
                  <strong>Rezervă din timp:</strong> Mutările de case durează mai mult - rezervă
                  cu 4-6 săptămâni înainte.
                </span>
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <FAQSection items={faqItems} title="Întrebări Frecvente - Mutări Case" />

          {/* Final CTA */}
          <section className="rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Gata să îți muți casa?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Primește 3-5 oferte gratuite în 24h de la firme specializate în mutări case și vile.
            </p>
            <Link
              href="/#request-form"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-blue-700 shadow-xl transition-all hover:bg-blue-50"
            >
              Cere Oferte Gratuite Acum
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<MutariCasePageProps> = async () => {
  return {
    props: {
      currentYear: new Date().getFullYear(),
    },
  };
};


