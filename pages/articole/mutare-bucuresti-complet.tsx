import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import LayoutWrapper from "@/components/layout/Layout";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ArticleMetadata from "@/components/content/ArticleMetadata";
import TableOfContents from "@/components/content/TableOfContents";
import {
    TruckIcon as Truck,
    AcademicCapIcon as Student,
    QuestionMarkCircleIcon as Question,
    CheckCircleIcon as CheckCircle,
    ExclamationTriangleIcon as Warning,
} from "@heroicons/react/24/outline";

export default function GuideBucuresti() {
    const currentYear = new Date().getFullYear();

    const faqs = [
        {
            question: "Am nevoie de autorizație pentru camionul de mutări în București?",
            answer: "Da, pentru zona centrală (Zona A și B) este necesară achitarea taxei de acces pentru vehicule grele dacă camionul depășește 5 tone. Firmele de mutări profesioniste se ocupă de obicei de acest aspect.",
        },
        {
            question: "Cum rezerv un loc de parcare pentru ziua mutării?",
            answer: "Nu există un sistem oficial de rezervare temporară la ADP pentru mutări. Recomandăm să blochezi locul cu mașina personală sau tomberoane cu o seară înainte și să lași un bilet vizibil pentru vecini.",
        },
        {
            question: "Care sunt cele mai ieftine firme de mutări din București?",
            answer: "Prețurile încep de la 150-200 RON/oră pentru o echipă de 2 oameni cu dubă. Evită ofertele ‚la negru’ de pe OLX pentru a nu risca costuri ascunse sau furturi. Folosește OferteMutare.ro pentru oferte verificate.",
        },
        {
            question: "Cât costă o mutare în București pentru o garsonieră?",
            answer: "O mutare de garsonieră în București costă în medie între 600 și 900 RON, incluzând transportul și manipularea, dacă nu există obiecte foarte grele sau etaje superioare fără lift.",
        },
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
            },
        })),
    };

    return (
        <>
            <Head>
                <title>Ghid Complet Mutare București {currentYear}: Cartiere, Prețuri și Sfaturi | OferteMutare.ro</title>
                <meta
                    name="description"
                    content={`Tot ce trebuie să știi despre mutarea în București în ${currentYear}. Ghid pe sectoare, prețuri actualizate, sfaturi parcare și transport.`}
                />
                <meta
                    name="keywords"
                    content={`mutare bucuresti, firma mutari bucuresti, pret mutare bucuresti, ghid mutare bucuresti, transport mobila bucuresti, relocare bucuresti`}
                />
                <meta
                    property="og:title"
                    content={`Ghid Complet Mutare București ${currentYear} | OferteMutare.ro`}
                />
                <meta
                    property="og:description"
                    content="Ghidul complet pentru o mutare fără stres în Capitală. Prețuri, zone, logistică și sfaturi utile."
                />
                <meta property="og:type" content="article" />
                <meta
                    property="og:url"
                    content="https://ofertemutare.ro/articole/mutare-bucuresti-complet"
                />
                <meta property="og:image" content="https://ofertemutare.ro/pics/blog/bucharest-guide-2026.webp" />
                <link rel="canonical" href="https://ofertemutare.ro/articole/mutare-bucuresti-complet" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://ofertemutare.ro/articole/mutare-bucuresti-complet" />
                <meta name="twitter:title" content={`Ghid Complet Mutare București ${currentYear}`} />
                <meta
                    name="twitter:description"
                    content="Ghidul complet pentru o mutare fără stres în Capitală. Prețuri, zone, logistică și sfaturi utile."
                />
                <meta name="twitter:image" content="https://ofertemutare.ro/pics/blog/bucharest-guide-2026.webp" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            
      <ArticleSchema
        title="Ghid Complet Mutare București {currentYear}: Cartiere, Prețuri și Sfaturi"
        description="Articol despre mutări"
        datePublished="2026-02-02"
        image="https://ofertemutare.ro/pics/blog/bucharest-guide-2026.webp"
      />
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "/" },
          { name: "Articole", url: "/articole" },
          { name: "Ghid Complet Mutare București {currentYear}: Cartiere, Prețuri și Sfaturi" },
        ]}
      />
      <LayoutWrapper>
                <article className="mx-auto max-w-4xl px-4 py-12">
                    {/* Header */}
                    <header className="mb-12 text-center">
                        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl px-4">
                            Ghid Complet Mutare în{" "}
                            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                                București {currentYear}
                            </span>
                        </h1>
            <ArticleMetadata />
            <TableOfContents items={[
              { id: "logistic-parcare-reguli", text: "Logistică: Parcare & Reguli" },
              { id: "ghid-special-pentru-studeni", text: "Ghid Special pentru Studenți" },
              { id: "preuri-mutri-bucureti-2026", text: "Prețuri Mutări București 2026" },
              { id: "ntrebri-frecvente-despre-bucureti", text: "Întrebări Frecvente despre București" },
              { id: "te-mui-n-bucureti", text: "Te muți în București?" } 
            ]} />
                        <div className="mb-6 overflow-hidden rounded-2xl shadow-xl">
                            <Image
                                src="/pics/blog/bucharest-guide-2026.webp"
                                alt="Harta Bucuresti Mutari"
                                width={1200}
                                height={675}
                                className="h-auto w-full"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                            />
                        </div>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Capitala poate fi haotică, dar mutarea ta nu trebuie să fie.
                            Am pregătit cel mai detaliat ghid pentru a te ajuta să navighezi prin traficul,
                            birocrația și cartierele Bucureștiului.
                        </p>
                    </header>

                    {/* Intro Context */}
                    <section className="mb-12 grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-6 border border-slate-100">
                            <h2 className="mb-3 text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Truck className="h-6 w-6 text-emerald-600" />
                                Provocările Capitalei
                            </h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex gap-2"><span className="text-red-500 font-bold">!</span> Trafic infernal la orele de vârf (07:30-09:30 & 16:30-18:30).</li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">!</span> Lipsa cronică a locurilor de parcare.</li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">!</span> Blocuri vechi cu lifturi mici sau defecte.</li>
                            </ul>
                        </div>
                        <div className="rounded-xl bg-emerald-50 p-6 border border-emerald-100">
                            <h2 className="mb-3 text-xl font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle className="h-6 w-6 text-emerald-600" />
                                Soluții Practice
                            </h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> Programează mutarea între 10:00 - 15:00 sau în weekend.</li>
                                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> Rezervă locul de parcare cu o zi înainte (blochează-l).</li>
                                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> Verifică dimensiunile liftului înainte de a cumpăra mobilă.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Top Neighborhoods */}
                    <section className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900 text-center">
                            Top Zone pentru Locuit în 2026
                        </h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Zone 1 */}
                            <div className="rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <div className="mb-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold inline-block">Sector 1</div>
                                <h3 className="text-xl font-bold mb-2">Aviației & Băneasa</h3>
                                <p className="text-sm text-gray-600 mb-3">Ideal pentru corporatiști și familii. Aproape de parcuri și birouri.</p>
                                <div className="text-sm font-semibold text-slate-900">Chirie 2 camere: ~600-800€</div>
                            </div>
                            {/* Zone 2 */}
                            <div className="rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <div className="mb-3 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold inline-block">Sector 3</div>
                                <h3 className="text-xl font-bold mb-2">Titan & Dristor</h3>
                                <p className="text-sm text-gray-600 mb-3">Cel mai verde sector. Parc IOR, metrou, prețuri accesibile.</p>
                                <div className="text-sm font-semibold text-slate-900">Chirie 2 camere: ~400-550€</div>
                            </div>
                            {/* Zone 3 */}
                            <div className="rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <div className="mb-3 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold inline-block">Sector 6</div>
                                <h3 className="text-xl font-bold mb-2">Drumul Taberei</h3>
                                <p className="text-sm text-gray-600 mb-3">Metrou nou, parcuri renovate, liniște și comunitate.</p>
                                <div className="text-sm font-semibold text-slate-900">Chirie 2 camere: ~350-500€</div>
                            </div>
                        </div>
                    </section>

                    {/* Logistics & Parking */}
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <Warning className="h-8 w-8 text-amber-500" />
                            <h2 id="logistic-parcare-reguli" className="text-3xl font-bold text-slate-900">Logistică: Parcare & Reguli</h2>
                        </div>
                        <div className="prose prose-slate max-w-none text-gray-700">
                            <p>
                                Una dintre cele mai mari probleme la mutarea în București este parcarea camionului.
                                Majoritatea locurilor sunt de reședință (plătite la ADP) și nu pot fi ocupate abuziv.
                            </p>
                            <h3 className="text-xl font-bold mt-4 mb-2">Strategia de parcare:</h3>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li><strong>Blochează locul:</strong> Dacă te muți la bloc, roagă un vecin sau folosește mașina proprie pentru a bloca 2 locuri în fața scării cu 24h înainte.</li>
                                <li><strong>Lasă un bilet:</strong> Pune un afiș vizibil: <em>&ldquo;Mă mut mâine între 10-14. Vă rog nu parcați. Mulțumesc pentru înțelegere!&rdquo;</em></li>
                                <li><strong>Atenție la Trotuare:</strong> Nu bloca trotuarul complet. Poliția Locală (Sector 1-6) este foarte activă și amenzile sunt mari.</li>
                            </ol>
                            <h3 className="text-xl font-bold mt-4 mb-2">Accesul în Centru (Zonă A/B):</h3>
                            <p>
                                Dacă te muți în zona Unirii, Universitate sau Romană cu un camion mare (&gt;5 tone),
                                asigură-te că firma de mutări are autorizație de acces. Altfel, amenda poate ajunge la 2.500 RON.
                            </p>
                        </div>
                    </section>

                    {/* Student Moving */}
                    <section className="mb-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Student className="h-8 w-8 text-indigo-600" />
                            <h2 id="ghid-special-pentru-studeni" className="text-2xl font-bold text-slate-900">Ghid Special pentru Studenți</h2>
                        </div>
                        <p className="mb-4 text-gray-700">
                            Te muți în <strong>Regie, Grozăvești sau Complex Leu</strong>? Iată ce trebuie să știi:
                        </p>
                        <ul className="grid gap-4 sm:grid-cols-2">
                            <li className="bg-white p-4 rounded-lg shadow-sm">
                                <strong>Perioada critică:</strong> Final de septembrie și început de octombrie este haos. Rezervă firma cu 3 săptămâni înainte.
                            </li>
                            <li className="bg-white p-4 rounded-lg shadow-sm">
                                <strong>Accesul în campus:</strong> Portarii pot fi stricți. Ai nevoie de legitimație și uneori de o &ldquo;atenție&rdquo; pentru a băga mașina până la scară.
                            </li>
                            <li className="bg-white p-4 rounded-lg shadow-sm">
                                <strong>Shared Transport:</strong> Dacă ai puține lucruri, combină-te cu un coleg pentru a împărți costul dubei.
                            </li>
                            <li className="bg-white p-4 rounded-lg shadow-sm">
                                <strong>Depozitare vară:</strong> Există servicii de &ldquo;Boxă temporară&rdquo; dacă trebuie să eliberezi camera pe vară.
                            </li>
                        </ul>
                    </section>

                    {/* Pricing Details */}
                    <section className="mb-16">
                        <h2 id="preuri-mutri-bucureti-currentyear" className="mb-6 text-3xl font-bold text-slate-900">Prețuri Mutări București {currentYear}</h2>
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="px-3 py-3 md:px-6 md:py-4 font-semibold text-slate-700">Serviciu</th>
                                        <th className="px-3 py-3 md:px-6 md:py-4 font-semibold text-slate-700">Preț Mediu</th>
                                        <th className="px-3 py-3 md:px-6 md:py-4 font-semibold text-slate-700">Detalii</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-medium">Mutare Garsonieră</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-emerald-600 font-bold">600 - 900 RON</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600">Volum mic, 2-3 ore</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-medium">Mutare 2 Camere</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-emerald-600 font-bold">1.200 - 1.600 RON</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600">Standard, etaje inferioare</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-medium">Taxi Mobilă (Doar transport)</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-emerald-600 font-bold">150 - 250 RON</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600">Per cursă, fără manipulare</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-medium">Manipulare (Per om)</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-emerald-600 font-bold">50 - 80 RON/oră</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600">Minim 2 ore</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 text-center">
                            <Link href="/articole/cat-costa-mutarea-2026" className="text-emerald-600 font-semibold hover:text-emerald-700 underline">
                                Vezi analiza detaliată a costurilor de mutare →
                            </Link>
                        </div>
                    </section>

                    {/* FAQ Schema Section */}
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <Question className="h-8 w-8 text-emerald-600" />
                            <h2 id="ntrebri-frecvente-despre-bucureti" className="text-3xl font-bold text-slate-900">Întrebări Frecvente despre București</h2>
                        </div>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                                    <h3 className="mb-3 text-lg font-bold text-slate-900">{faq.question}</h3>
                                    <p className="text-gray-700">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Calculator */}
                    <section className="rounded-2xl bg-slate-900 px-6 py-12 text-center md:px-12 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                        </div>

                        <h2 id="te-mui-n-bucureti" className="mb-4 text-3xl font-bold text-white relative z-10">Te muți în București?</h2>
                        <p className="mb-8 text-lg text-slate-300 relative z-10 max-w-2xl mx-auto">
                            Nu pierde timpul sunând la zeci de firme. Completează formularul și primești
                            oferte de la firme verificate din Sectorul tău.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row relative z-10">
                            <Link
                                href="/#request-form"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
                            >
                                Cere Oferte București
                            </Link>
                        </div>
                    </section>
                </article>
            </LayoutWrapper>
        </>
    );
}
