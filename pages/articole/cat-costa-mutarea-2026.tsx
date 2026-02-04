import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import LayoutWrapper from "@/components/layout/Layout";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ArticleMetadata from "@/components/content/ArticleMetadata";
import TableOfContents from "@/components/content/TableOfContents";
import {
    CurrencyEuroIcon as Currency,
    TruckIcon as Truck,
    CubeIcon as Box,
    ClockIcon as Clock,
    MapPinIcon as MapPin,
    QuestionMarkCircleIcon as Question,
    CheckCircleIcon as CheckCircle,
    ExclamationTriangleIcon as Warning,
} from "@heroicons/react/24/outline";

export default function ArticleCostMutare() {
    const currentYear = new Date().getFullYear();

    const faqs = [
        {
            question: "Cât costă o mutare locală în București?",
            answer: "O mutare locală în București pentru o garsonieră costă între 600-900 RON, iar pentru un apartament cu 2 camere între 1.200-1.800 RON. Prețul include transportul și manipularea, dar poate varia în funcție de etaj și accesul la lift.",
        },
        {
            question: "Cum se calculează prețul unei mutări?",
            answer: "Prețul se calculează în funcție de volumul bunurilor (mc), distanța parcursă (km), etajul la preluare/livrare, necesitatea liftului exterior și serviciile suplimentare (împachetare, demontare/remontare mobilă).",
        },
        {
            question: "Este mai ieftin să mă mut singur sau cu o firmă?",
            answer: "Deși aparent mai ieftin, mutatul pe cont propriu implică costuri ascunse (închiriere duba, combustibil, materiale, pizza pentru prieteni) și riscuri. Diferența reală este adesea de doar 20-30%, dar efortul și riscul de deteriorare sunt mult mai mari.",
        },
        {
            question: "Cât costă mutarea mobilei grele (pian, seif)?",
            answer: "Obiectele speciale precum piane, seifuri sau echipamente grele au tarife speciale, începând de la 300-500 RON/obiect, în funcție de greutate și dificultatea manipulării pe scări.",
        },
        {
            question: "Cât costă o mutare București-Cluj sau București-Timișoara?",
            answer: "Mutările interurbane: București-Cluj (450km) costă 2.500-4.500 RON, București-Timișoara (550km) 3.000-5.000 RON, în funcție de volum. Include transport, manipulare, dar exclude împachetarea.",
        },
        {
            question: "Ce servicii extra măresc prețul mutării?",
            answer: "Servicii extra: împachetare profesională (+30-50%), demontare/remontare mobilă (+200-500 RON), depozitare temporară (+100-300 RON/zi), asigurare bunuri (+5-10% din valoare).",
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
                <title>Cât Costă o Mutare în România {currentYear} | Prețuri Reale</title>
                <meta
                    name="description"
                    content={`Analiză completă prețuri mutări ${currentYear}: costuri mobilă, cutii, transport. Vezi cât costă să te muți în București, Cluj sau Timișoara cu o firmă profesionistă.`}
                />
                <meta
                    name="keywords"
                    content={`cat costa o mutare, pret mutare ${currentYear}, tarife mutari, pret mutare bucuresti, cost firma mutari, calculator mutare`}
                />
                <meta
                    property="og:title"
                    content={`Cât Costă o Mutare în România ${currentYear} | Ghid Prețuri Reale`}
                />
                <meta
                    property="og:description"
                    content="Ghid transparent de prețuri pentru mutări locale și interurbane. Află costurile reale și cum să eviți taxele ascunse."
                />
                <meta property="og:type" content="article" />
                <meta
                    property="og:url"
                    content="https://ofertemutare.ro/articole/cat-costa-mutarea-2026"
                />
                <meta property="og:image" content="https://ofertemutare.ro/pics/blog/moving-cost-2026.webp" />
                <link rel="canonical" href="https://ofertemutare.ro/articole/cat-costa-mutarea-2026" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://ofertemutare.ro/articole/cat-costa-mutarea-2026" />
                <meta name="twitter:title" content={`Cât Costă o Mutare în România ${currentYear}`} />
                <meta
                    name="twitter:description"
                    content="Ghid transparent de prețuri pentru mutări locale și interurbane. Află costurile reale și cum să eviți taxele ascunse."
                />
                <meta name="twitter:image" content="https://ofertemutare.ro/pics/blog/moving-cost-2026.webp" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            
      <ArticleSchema
        title="Cât Costă o Mutare în România {currentYear} | Prețuri Reale"
        description="Articol despre mutări"
        datePublished="2026-02-02"
        image="https://ofertemutare.ro/pics/blog/moving-cost-2026.webp"
      />
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "/" },
          { name: "Articole", url: "/articole" },
          { name: "Cât Costă o Mutare în România {currentYear} | Prețuri Reale" },
        ]}
      />
      <LayoutWrapper>
                <article className="mx-auto max-w-4xl px-4 py-12">
                    {/* Header */}
                    <header className="mb-12 text-center">
                        <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-800">
                            Actualizat Ianuarie {currentYear}
                        </span>
                        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                            Cât Costă o Mutare în România:{" "}
                            <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                                Ghid de Prețuri {currentYear}
                            </span>
                        </h1>
            <ArticleMetadata />
            <TableOfContents items={[
              { id: "atenie-la-costurile-ascunse", text: "Atenție la Costurile Ascunse!" },
              { id: "ntrebri-frecvente", text: "Întrebări Frecvente" },
              { id: "vrei-s-afli-preul-exact", text: "Vrei să afli prețul exact?" } 
            ]} />
                        <div className="mb-6 overflow-hidden rounded-2xl shadow-xl">
                            <Image
                                src="/pics/blog/moving-cost-2026.webp"
                                alt="Costuri Mutare 2026"
                                width={1200}
                                height={675}
                                className="h-auto w-full"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                            />
                        </div>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Analiză detaliată a costurilor pentru mutări locale și naționale.
                            Află la ce să te aștepți și cum să obții cel mai bun preț.
                        </p>
                    </header>

                    {/* Intro Box */}
                    <section className="mb-12 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start gap-4">
                            <Currency className="mt-1 h-8 w-8 shrink-0 text-emerald-600" />
                            <div>
                                <h2 className="mb-3 text-xl font-bold text-slate-900">
                                    Răspuns Rapid: La ce prețuri să te aștepți?
                                </h2>
                                <p className="mb-4 text-gray-700">
                                    În {currentYear}, costul mediu pentru o mutare locală (în același oraș) variază între:
                                </p>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-lg bg-emerald-50 p-4 text-center">
                                        <span className="block text-sm font-medium text-emerald-800">Garsonieră</span>
                                        <span className="text-xl font-bold text-emerald-600">600 - 900 RON</span>
                                    </div>
                                    <div className="rounded-lg bg-emerald-50 p-4 text-center">
                                        <span className="block text-sm font-medium text-emerald-800">2 Camere</span>
                                        <span className="text-xl font-bold text-emerald-600">1.200 - 1.800 RON</span>
                                    </div>
                                    <div className="rounded-lg bg-emerald-50 p-4 text-center">
                                        <span className="block text-sm font-medium text-emerald-800">3-4 Camere</span>
                                        <span className="text-xl font-bold text-emerald-600">2.000 - 3.500 RON</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Factori de Cost */}
                    <section className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900">
                            Top 5 Factori care Influențează Prețul
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="flex gap-4">
                                <Box className="h-8 w-8 shrink-0 text-emerald-500" />
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">1. Volumul Bunurilor</h3>
                                    <p className="text-gray-600">
                                        Cel mai important factor. Mai multă mobilă înseamnă camion mai mare și mai mulți oameni.
                                        Un inventar corect este crucial pentru o estimare precisă.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <MapPin className="h-8 w-8 shrink-0 text-emerald-500" />
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">2. Distanța</h3>
                                    <p className="text-gray-600">
                                        Pentru mutări locale, distanța contează mai puțin. Pentru mutări interurbane,
                                        se taxează per kilometru (aprox. 4-6 RON/km dus-întors).
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Clock className="h-8 w-8 shrink-0 text-emerald-500" />
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">3. Accesibilitatea (Etaj/Lift)</h3>
                                    <p className="text-gray-600">
                                        lipsa liftului sau imposibilitatea parcării camionului aproape de scară adaugă
                                        costuri suplimentare pentru manipulare &quot;la distanță&quot;.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Truck className="h-8 w-8 shrink-0 text-emerald-500" />
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">4. Perioada Mutării</h3>
                                    <p className="text-gray-600">
                                        Mutările la sfârșit de lună sau în weekend sunt cu 15-20% mai scumpe.
                                        Alege mijlocul săptămânii pentru cel mai bun preț.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle className="h-8 w-8 shrink-0 text-emerald-500" />
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">5. Servicii Extra</h3>
                                    <p className="text-gray-600">
                                        Demontarea mobilei, împachetarea în <Link href="/servicii/impachetare/materiale" className="text-indigo-600 hover:underline font-medium">cutii</Link> sau manipularea obiectelor speciale (pian)
                                        se tarifează separat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tabel Detaliat Prețuri */}
                    <section className="mb-16">
                        <h2 className="mb-6 text-3xl font-bold text-slate-900">
                            Tabel Detaliat: Prețuri Estimative {currentYear}
                        </h2>
                        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                            <table className="w-full text-left text-xs md:text-base">
                                <thead className="bg-slate-50 text-slate-900">
                                    <tr>
                                        <th className="px-3 py-3 md:px-6 md:py-4 font-semibold">Tip Locuință</th>
                                        <th className="px-3 py-3 md:px-6 md:py-4 font-semibold">Timp Estimat</th>
                                        <th className="px-3 py-3 md:px-6 md:py-4 font-semibold">Echipă</th>
                                        <th className="px-3 py-3 md:px-6 md:py-4 font-semibold">Preț Mediu (Local)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-medium text-slate-900">Garsonieră</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600">3-4 ore</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600">2 oameni</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-bold text-emerald-600">600 - 900 RON</td>
                                    </tr>
                                    <tr className="bg-slate-50/50">
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-medium text-slate-900">2 Camere</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600">4-6 ore</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600">3 oameni</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-bold text-emerald-600">1.200 - 1.800 RON</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-medium text-slate-900">3 Camere</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600">6-8 ore</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600">3-4 oameni</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-bold text-emerald-600">1.800 - 2.500 RON</td>
                                    </tr>
                                    <tr className="bg-slate-50/50">
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-medium text-slate-900">Casă (4+ Camere)</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600">8-12 ore</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-600">4-6 oameni</td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 font-bold text-emerald-600">3.000+ RON</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-xs md:text-sm text-gray-500">
                            *Sursă date: <strong>OferteMutare.ro - Analiză Piață {currentYear}</strong>. Prețurile sunt estimative pentru o mutare locală (sub 50km) și includ transport + manipulare standard.
                        </p>
                    </section>

                    {/* Hidden Costs */}
                    <section className="mb-16 rounded-xl bg-amber-50 p-8 border border-amber-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Warning className="h-8 w-8 text-amber-600" />
                            <h2 id="atenie-la-costurile-ascunse" className="text-2xl font-bold text-slate-900">Atenție la Costurile Ascunse!</h2>
                        </div>
                        <p className="mb-4 text-gray-700">
                            Nu te lăsa păcălit de ofertele telefonice suspect de mici. Iată ce poate umfla factura finală:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 marker:text-amber-500">
                            <li><strong>Taxa de distanță lungă (long-carry):</strong> Dacă camionul nu poate parca la scara blocului (peste 15-20m).</li>
                            <li><strong>Taxa de etaj:</strong> Dacă liftul este stricat sau mobila nu încape în el.</li>
                            <li><strong>Materiale de ambalare:</strong> Cutiile și folia aduse de firmă pot fi taxate dublu față de prețul din magazin.</li>
                            <li><strong>TVA:</strong> Verifică întotdeauna dacă prețul ofertat include sau nu TVA.</li>
                        </ul>
                    </section>

                    {/* DIY vs Pro */}
                    <section className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900">
                            Mutare DIY vs. Firmă: Analiză Costuri
                        </h2>
                        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
                            <p className="mb-8 text-lg text-gray-600">
                                Mulți cred că economisesc enorm mutându-se singuri. Hai să calculăm costul real
                                pentru o mutare de 2 camere, weekend, prieteni:
                            </p>

                            <div className="grid gap-8 md:grid-cols-2">
                                {/* DIY */}
                                <div className="relative">
                                    <h3 className="mb-4 text-xl font-bold text-slate-900">Mutare pe Cont Propriu (DIY)</h3>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex justify-between border-b pb-2">
                                            <span>Închiriere Dubă (24h)</span>
                                            <span className="font-semibold">400 RON</span>
                                        </li>
                                        <li className="flex justify-between border-b pb-2">
                                            <span>Combustibil (Urban)</span>
                                            <span className="font-semibold">100 RON</span>
                                        </li>
                                        <li className="flex justify-between border-b pb-2">
                                            <span>Materiale (Cutii, Folie)</span>
                                            <span className="font-semibold">300 RON</span>
                                        </li>
                                        <li className="flex justify-between border-b pb-2">
                                            <span>Mâncare/Băutură (3 prieteni)</span>
                                            <span className="font-semibold">250 RON</span>
                                        </li>
                                        <li className="flex justify-between border-b pb-2">
                                            <span>Risc deteriorare (fără asigurare)</span>
                                            <span className="font-semibold text-red-500">?</span>
                                        </li>
                                        <li className="flex justify-between pt-2 text-lg font-bold text-slate-900">
                                            <span>TOTAL ESTIMAT</span>
                                            <span>~1.050 RON</span>
                                        </li>
                                    </ul>
                                    <p className="mt-4 text-sm italic text-gray-500">
                                        + 2 zile de efort fizic intens, stres și risc de accidentare.
                                    </p>
                                </div>

                                {/* PRO */}
                                <div className="relative md:border-l md:pl-8">
                                    <h3 className="mb-4 text-xl font-bold text-emerald-700">Firmă Profesionistă</h3>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex justify-between border-b pb-2">
                                            <span>Pachet Standard (Transport + Manipulare)</span>
                                            <span className="font-semibold">1.400 RON</span>
                                        </li>
                                        <li className="flex justify-between border-b pb-2">
                                            <span>Asigurare Bunuri</span>
                                            <span className="font-semibold text-green-600">Inclusă</span>
                                        </li>
                                        <li className="flex justify-between border-b pb-2">
                                            <span>Echipament (Cărucioare, Chingi)</span>
                                            <span className="font-semibold text-green-600">Inclus</span>
                                        </li>
                                        <li className="flex justify-between border-b pb-2">
                                            <span>Timp Execuție</span>
                                            <span className="font-semibold text-green-600">4-5 Ore</span>
                                        </li>
                                        <li className="flex justify-between pt-2 text-lg font-bold text-slate-900">
                                            <span>TOTAL ESTIMAT</span>
                                            <span>~1.400 RON</span>
                                        </li>
                                    </ul>
                                    <p className="mt-4 text-sm italic text-gray-500">
                                        Diferența este de doar 350 RON, dar câștigi timp și siguranță.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Schema Section */}
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <Question className="h-8 w-8 text-emerald-600" />
                            <h2 id="ntrebri-frecvente" className="text-3xl font-bold text-slate-900">Întrebări Frecvente</h2>
                        </div>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="rounded-lg border border-gray-100 bg-slate-50 p-6">
                                    <h3 className="mb-3 text-lg font-bold text-slate-900">{faq.question}</h3>
                                    <p className="text-gray-700">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Calculator */}
                    <section className="rounded-2xl bg-slate-900 px-6 py-12 text-center md:px-12">
                        <h2 id="vrei-s-afli-preul-exact" className="mb-4 text-3xl font-bold text-white">Vrei să afli prețul exact?</h2>
                        <p className="mb-8 text-lg text-slate-300">
                            Completează formularul nostru și primești oferte personalizate de la firme verificate,
                            în funcție de inventarul tău specific.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href="/calculator"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
                            >
                                Launch Calculator
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-3 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            >
                                Contactează-ne
                            </Link>
                        </div>
                    </section>

                </article>
            </LayoutWrapper>
        </>
    );
}

