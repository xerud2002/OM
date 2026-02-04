import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import FAQSection from "@/components/content/FAQSection";
import {
  FAQPageSchema,
  LocalBusinessSchema,
  BreadcrumbSchema,
} from "@/components/seo/SchemaMarkup";
import { SERVICE_FAQS } from "@/data/faqData";
import { AcademicCapIcon as GraduationCap, CheckCircleIcon as CheckCircle, ArrowRightIcon as ArrowRight, CubeIcon as Package, ClockIcon as Clock, CurrencyDollarIcon as DollarSign, HomeIcon as Bed, BookOpenIcon as BookOpen, CalendarIcon as Calendar, StarIcon as Star, ReceiptPercentIcon as Percent, UsersIcon as Users, MapPinIcon as MapPin } from "@heroicons/react/24/outline";

interface MutariStudentiPageProps {
  currentYear: number;
}

export default function MutariStudentiPage({ currentYear }: MutariStudentiPageProps) {
  const faqItems = SERVICE_FAQS.studenti;

  return (
    <>
      <Head>
        <title>{`Mutări Studenți ${currentYear} → Prețuri de la 250 lei`}</title>
        <meta
          name="description"
          content="Mutări studenți în România de la 250 lei! Transport cămine și garsoniere. Primești 3-5 oferte GRATUITE în 24h. Tarife speciale grupe!"
        />
        <meta
          name="keywords"
          content="mutări studenți, mutare cămin, transport bagaje student, mutare garsonieră student, firme mutări ieftine studenți, mutare universitate"
        />
        <link rel="canonical" href="https://ofertemutare.ro/mutari/tipuri/studenti" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/mutari/tipuri/studenti" />
        <meta property="og:title" content={`Mutări Studenți ${currentYear} | Prețuri Reduse`} />
        <meta
          property="og:description"
          content="Servicii mutări pentru studenți. Prețuri accesibile, transport rapid!"
        />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
      </Head>

      {/* Schema Markup */}
      <FAQPageSchema faqs={faqItems} />
      <LocalBusinessSchema serviceName="Mutări Studenți" />
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "/" },
          { name: "Mutări", url: "/mutari" },
          { name: "Tipuri", url: "/mutari/tipuri" },
          { name: "Studenți" },
        ]}
      />

      <LayoutWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-orange py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="mb-6 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-orange-200" />
              <span className="text-sm font-medium text-orange-100">
                Oferte Speciale • Studenți
              </span>
            </div>

            <h1 className="mb-6 text-2xl md:text-4xl font-extrabold !text-white md:text-5xl lg:text-6xl">
              Mutări pentru{" "}
              <span className="bg-linear-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Studenți
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-orange-100 md:text-xl">
              Prețuri prietenoase pentru buzunarul studentului. Transport rapid pentru cămine,
              garsoniere și chirie. Flexibilitate maximă!
            </p>

            {/* Stats */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">200+</div>
                <div className="text-sm text-orange-100">Lei minim</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">1-2h</div>
                <div className="text-sm text-orange-100">Durată medie</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-orange-100">Gratuit</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">🎓</div>
                <div className="text-sm text-orange-100">Discount studenți</div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/#request-form"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-orange-600 shadow-xl transition-all hover:-translate-y-0.5 hover:bg-orange-50 hover:shadow-2xl"
              >
                Cere Oferte Gratuite
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Main Article Content */}
        <article className="mx-auto max-w-4xl px-4 py-16">
          {/* Intro */}
          <section className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Mutare de student? Noi înțelegem!
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Viața de <strong>student</strong> înseamnă schimbări frecvente: de la cămin la
                chirie, de la un apartament la altul, sau înapoi acasă în vacanțe. Știm că bugetul
                este limitat, dar asta nu înseamnă că trebuie să cari totul singur!
              </p>
              <p>
                Pe <strong>OferteMutare.ro</strong>, găsești firme care oferă{" "}
                <strong>prețuri speciale pentru studenți</strong>. Completezi un formular rapid,
                primești oferte, și alegi cea mai bună variantă pentru buzunarul tău.
              </p>
            </div>
          </section>

          {/* Student Scenarios */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-orange-50 to-red-50 p-8">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
              <BookOpen className="h-7 w-7 text-orange-600" />
              Scenarii tipice pentru studenți
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                  <Bed className="h-5 w-5 text-orange-500" />
                  Cămin → Chirie
                </h3>
                <p className="mb-2 text-sm text-gray-600">
                  Ai terminat anul și te muți într-o garsonieră sau cameră la chirie.
                </p>
                <div className="text-lg font-bold text-orange-600">200-400 lei</div>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  Schimbare chirie
                </h3>
                <p className="mb-2 text-sm text-gray-600">
                  Te muți într-un alt cartier sau găsești o chirie mai bună.
                </p>
                <div className="text-lg font-bold text-orange-600">300-600 lei</div>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                  <GraduationCap className="h-5 w-5 text-orange-500" />
                  După absolvire
                </h3>
                <p className="mb-2 text-sm text-gray-600">
                  Ai terminat facultatea și te muți pentru job în alt oraș.
                </p>
                <div className="text-lg font-bold text-orange-600">400-1.000 lei</div>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                  <Users className="h-5 w-5 text-orange-500" />
                  Vacanță acasă
                </h3>
                <p className="mb-2 text-sm text-gray-600">
                  Trimiți bagaje mai mari acasă pentru vară sau iarnă.
                </p>
                <div className="text-lg font-bold text-orange-600">150-350 lei</div>
              </div>
            </div>
          </section>

          {/* Why Students Choose Us */}
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
              <Percent className="h-7 w-7 text-orange-600" />
              De ce studenții ne aleg
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5">
                <div className="h-fit rounded-lg bg-orange-100 p-2">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Prețuri accesibile</h3>
                  <p className="text-gray-600">
                    Multe firme oferă tarife reduse pentru studenți. Menționează că ești student
                    când ceri oferta!
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5">
                <div className="h-fit rounded-lg bg-green-100 p-2">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Flexibilitate orară</h3>
                  <p className="text-gray-600">
                    Mutări în weekend, seara sau în perioadele de vacanță când ai timp.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5">
                <div className="h-fit rounded-lg bg-blue-100 p-2">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Volume mici, fără probleme</h3>
                  <p className="text-gray-600">
                    Chiar și pentru câteva cutii și un pat, găsești oferte. Nu e nevoie de mutare
                    &ldquo;completă&rdquo;.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12 rounded-2xl bg-linear-to-r from-amber-50 to-yellow-50 p-8">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
              <Star className="h-7 w-7 text-amber-600" />
              Sfaturi pentru mutarea de student
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                <span>
                  <strong>Grupează-te cu colegi:</strong> Dacă mai mulți studenți se mută în aceeași
                  perioadă, puteți împărți costul unui transport mai mare.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                <span>
                  <strong>Evită începutul/finalul de semestru:</strong> Prețurile cresc în
                  septembrie și februarie când toți studenții se mută.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                <span>
                  <strong>Vinde ce nu îți trebuie:</strong> Mai puține lucruri = transport mai
                  ieftin. Vinde pe OLX sau dă la colegi.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                <span>
                  <strong>Cere cutii gratuite:</strong> Supermarketurile (Kaufland, Lidl) dau cutii
                  gratis. Nu cumpăra material de ambalat scump!
                </span>
              </li>
            </ul>
          </section>

          {/* Peak Times */}
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
              <Calendar className="h-7 w-7 text-orange-600" />
              Când să te muți pentru cel mai bun preț
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
                <h3 className="mb-2 font-bold text-green-800">✓ Perioade ieftine</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Noiembrie - Februarie (iarnă)</li>
                  <li>• Marți - Joi (mijlocul săptămânii)</li>
                  <li>• Mijlocul lunii (zile 10-20)</li>
                </ul>
              </div>
              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5">
                <h3 className="mb-2 font-bold text-red-800">✕ Perioade scumpe</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Septembrie (început an universitar)</li>
                  <li>• Weekend-uri (toată lumea se mută)</li>
                  <li>• Sfârșitul de lună</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <FAQSection items={faqItems} title="Întrebări Frecvente - Mutări Studenți" />

          {/* Final CTA */}
          <section className="rounded-2xl bg-linear-to-r from-orange-500 to-red-500 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Gata de mutare, coleg(ă)?</h2>
            <p className="mb-8 text-lg text-orange-100">
              Primește oferte gratuite în 24h și vezi cât economisești!
            </p>
            <Link
              href="/#request-form"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-orange-600 shadow-xl transition-all hover:bg-orange-50"
            >
              Cere Oferte Gratuite Acum
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<MutariStudentiPageProps> = async () => {
  return {
    props: {
      currentYear: new Date().getFullYear(),
    },
  };
};


