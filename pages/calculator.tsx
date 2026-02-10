import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import LayoutWrapper from "@/components/layout/Layout";

const SavingsCalculator = dynamic(
  () => import("@/components/cro/SavingsCalculator"),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 rounded-2xl h-96" /> }
);
import CTASection from "@/components/home/CTASection";
import { BreadcrumbSchema, FAQPageSchema } from "@/components/seo/SchemaMarkup";
import ArticleMetadata from "@/components/content/ArticleMetadata";
import TableOfContents from "@/components/content/TableOfContents";

export default function CalculatorPage() {
  const currentYear = new Date().getFullYear();

  const faqs = [
    {
      question: "Cât de precisă este estimarea din calculator?",
      answer: "Calculatorul oferă o estimare bazată pe prețurile medii din piață pentru tipul de proprietate și județul selectat. Prețul final poate varia cu ±15% în funcție de factori specifici precum etajul, accesul la lift sau volumul exact de mobilier.",
    },
    {
      question: "Ce include prețul afișat de calculator?",
      answer: "Prețul estimat include de regulă: transportul cu dubă sau camion, manipularea standard (încărcare/descărcare), și asigurarea de bază. Nu include servicii extra precum împachetare profesională, demontare/remontare mobilă sau depozitare.",
    },
    {
      question: "De ce variază prețul în funcție de județ?",
      answer: "Tarifele diferă în funcție de costul vieții din fiecare regiune, disponibilitatea firmelor de mutări și cererea locală. București și Cluj au de regulă cele mai mari tarife, în timp ce județele mai mici pot avea prețuri cu 10-20% mai mici.",
    },
    {
      question: "Cum pot obține un preț exact pentru mutarea mea?",
      answer: "Pentru un preț exact, completează formularul de cerere de ofertă de pe pagina principală. Vei primi oferte personalizate de la firme verificate care vor analiza detaliile specifice ale mutării tale: inventar, etaj, distanță exactă.",
    },
    {
      question: "Calculatorul funcționează și pentru mutări internaționale?",
      answer: "Nu, în prezent calculatorul estimează doar mutări în interiorul României. Pentru mutări internaționale, te rugăm să ne contactezi direct pentru o ofertă personalizată.",
    },
  ];

  // WebApplication Schema for the calculator tool
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculator Cost Mutare",
    "description": "Instrument online gratuit pentru estimarea costului unei mutări în România. Calculează bugetul necesar în funcție de tipul locuinței și locație.",
    "url": "https://ofertemutare.ro/calculator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "RON"
    },
    "provider": {
      "@type": "Organization",
      "name": "OferteMutare.ro",
      "url": "https://ofertemutare.ro"
    }
  };

  const tocItems = [
    { id: "calculator", text: "Calculator Estimare Preț" },
    { id: "cum-functioneaza", text: "Cum Funcționează Calculatorul" },
    { id: "factori-pret", text: "Ce Influențează Prețul" },
    { id: "intrebari-frecvente", text: "Întrebări Frecvente" },
  ];

  return (
    <>
      <Head>
        <title>{`Calculator Cost Mutare ${currentYear} - Estimare Preț Instantanee | OferteMutare.ro`}</title>
        <meta
          name="description"
          content={`Calculează gratuit costul estimat al mutării tale în ${currentYear}. Instrument online pentru estimarea bugetului necesar în funcție de tip locuință, număr camere și locație. Rezultat instant!`}
        />
        <meta
          name="keywords"
          content={`calculator mutare, calculator cost mutare, estimare pret mutare, cat costa mutare ${currentYear}, pret mutare bucuresti, calculator mutari, buget mutare online`}
        />
        <link rel="canonical" href="https://ofertemutare.ro/calculator" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/calculator" />
        <meta property="og:title" content={`Calculator Cost Mutare ${currentYear} | Estimare Gratuită`} />
        <meta
          property="og:description"
          content="Află în 30 de secunde cât te costă să te muți. Calculator gratuit bazat pe prețuri reale din piață."
        />
        <meta property="og:image" content="https://ofertemutare.ro/pics/calculator-mutare.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/calculator" />
        <meta name="twitter:title" content={`Calculator Cost Mutare ${currentYear}`} />
        <meta
          name="twitter:description"
          content="Află în 30 de secunde cât te costă să te muți. Calculator gratuit bazat pe prețuri reale din piață."
        />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/calculator-mutare.webp" />

        {/* WebApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </Head>

      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "/" },
          { name: "Calculator Cost Mutare" },
        ]}
      />
      <FAQPageSchema faqs={faqs} />

      <LayoutWrapper>
        <article className="bg-gray-50">
          {/* Breadcrumb Navigation */}
          <div className="mx-auto max-w-5xl px-4 pt-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-orange-600 transition-colors">
                Acasă
              </Link>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              <span className="font-medium text-gray-900">Calculator Cost Mutare</span>
            </nav>
          </div>

          {/* Header */}
          <header className="pb-12 pt-8 md:pt-12">
            <div className="mx-auto max-w-5xl px-4 text-center">
              <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">
                Actualizat {currentYear}
              </span>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
                Calculator Cost Mutare:{" "}
                <span className="bg-linear-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
                  Estimare Instantanee
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Află în 30 de secunde cât te costă să te muți. Calculator gratuit bazat pe prețurile medii din piața din România.
              </p>
              
              <ArticleMetadata date={`Februarie ${currentYear}`} readTime="3 min" />
              <TableOfContents items={tocItems} />
            </div>
          </header>

          {/* Calculator Section */}
          <section id="calculator" className="pb-20">
            <div className="mx-auto max-w-3xl px-4">
              <SavingsCalculator />
            </div>
          </section>

          {/* Article Content - SEO Optimized */}
          <section className="bg-white py-20">
            <div className="mx-auto max-w-4xl px-4">
              
              {/* Intro */}
              <div className="prose prose-lg max-w-none mb-16">
                <h2 id="cum-functioneaza" className="text-3xl font-bold text-gray-900 mb-6">
                  Cum Funcționează Calculatorul de Mutări?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Calculatorul nostru de mutări este cel mai rapid mod de a afla <strong>cât costă o mutare în România în {currentYear}</strong>. 
                  Am analizat peste 10.000 de mutări efectuate anul trecut pentru a crea un algoritm care estimează prețul în funcție de trei factori principali: 
                  tipul proprietății, numărul de camere și județul în care te afli.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Spre deosebire de alte calculatoare online, estimările noastre sunt bazate pe <strong>date reale din piața românească</strong>, 
                  actualizate lunar. Monitorizăm constant tarifele practicate de firmele de mutări partenere pentru a-ți oferi o imagine cât mai precisă.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Rezultatul afișat este un <strong>interval de preț (minim - maxim)</strong> care acoperă aproximativ 85% din cazuri. 
                  Prețul final poate varia în funcție de factori specifici precum etajul, disponibilitatea liftului sau distanța exactă de transport.
                </p>
              </div>

              {/* Factors Section */}
              <div className="mb-16">
                <h2 id="factori-pret" className="text-3xl font-bold text-gray-900 mb-8">
                  Ce Influențează Prețul Unei Mutări?
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Volumul Bunurilor</h3>
                    <p className="text-gray-600">
                      Cel mai important factor. Un apartament cu 3 camere necesită mai multă forță de muncă și un camion mai mare decât o garsonieră.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-orange-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Locația</h3>
                    <p className="text-gray-600">
                      Prețurile variază semnificativ între județe. București și Cluj au cele mai mari tarife, urmate de Timișoara și Brașov.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Accesibilitate</h3>
                    <p className="text-gray-600">
                      Etajul, prezența liftului și distanța de la scară la locul de parcare a camionului influențează direct timpul necesar.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-purple-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Perioada</h3>
                    <p className="text-gray-600">
                      Mutările la sfârșit de lună sau în weekend costă cu 15-20% mai mult din cauza cererii ridicate.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-16">
                <h2 id="intrebari-frecvente" className="text-3xl font-bold text-gray-900 mb-8">
                  Întrebări Frecvente despre Calculator
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="rounded-xl border border-gray-200 bg-white p-6">
                      <h3 className="mb-3 text-lg font-bold text-gray-900">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Table */}
              <div className="rounded-2xl bg-linear-to-br from-orange-50 to-amber-50 p-8 border border-orange-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Prețuri Orientative {currentYear}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-orange-200">
                      <tr>
                        <th className="pb-4 font-semibold text-gray-900">Tip Proprietate</th>
                        <th className="pb-4 font-semibold text-gray-900 text-right">Preț Estimat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-100">
                      <tr>
                        <td className="py-4 text-gray-700">Garsonieră / 1 cameră</td>
                        <td className="py-4 text-right font-bold text-orange-600">500 - 800 RON</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-gray-700">Apartament 2 camere</td>
                        <td className="py-4 text-right font-bold text-orange-600">800 - 1.400 RON</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-gray-700">Apartament 3 camere</td>
                        <td className="py-4 text-right font-bold text-orange-600">1.200 - 2.000 RON</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-gray-700">Casă (4+ camere)</td>
                        <td className="py-4 text-right font-bold text-orange-600">2.500 - 5.000+ RON</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  *Prețuri pentru mutări locale (sub 50km). Tarifele pot varia ±20% în funcție de specificul fiecărei mutări.
                </p>
              </div>

            </div>
          </section>
        </article>

        <CTASection />
      </LayoutWrapper>
    </>
  );
}


