import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import LayoutWrapper from "@/components/layout/Layout";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ArticleMetadata from "@/components/content/ArticleMetadata";
import TableOfContents from "@/components/content/TableOfContents";
import {
    BuildingOffice2Icon as Building,
    CurrencyEuroIcon as Currency,
    TruckIcon as Truck,
    WrenchScrewdriverIcon as Wrench,
    ExclamationTriangleIcon as Warning,
    CheckCircleIcon as CheckCircle,
    ClockIcon as Clock,
    ArrowUpIcon as ArrowUp,
} from "@heroicons/react/24/outline";

export default function ArticleMutareFaraLift() {
    const currentYear = new Date().getFullYear();

    const faqs = [
        {
            question: "Cât costă în plus mutarea fără lift?",
            answer: `În ${currentYear}, majoritatea firmelor de mutări percep un supliment de 50-150 RON per etaj. De exemplu, mutarea la etajul 4 fără lift poate costa 200-600 RON în plus față de parter. Acest cost acoperă efortul fizic suplimentar și timpul mai mare necesar.`,
        },
        {
            question: "Se poate urca o canapea la etajul 8 fără lift?",
            answer: "Da, dar depinde de dimensiunile canapelei și lățimea scării. Firmele profesioniste au echipament special (chingi, cărucioare de scări) și experiență cu blocurile din România. Dacă piesa nu încape pe scări, se poate folosi un lift exterior (macara) pe lângă bloc.",
        },
        {
            question: "Ce este liftul exterior și cât costă?",
            answer: "Liftul exterior (elevator de mobilă) este o platformă motorizată montată pe fațada blocului. Costul închirierii variază între 800-2.000 RON/zi, în funcție de înălțime și disponibilitate. Merită pentru mutări de la etajele 5+ sau pentru obiecte foarte grele (piane, seifuri).",
        },
        {
            question: "Ce mobilă trebuie demontată obligatoriu pentru scări?",
            answer: "Dulapurile mari, paturile supraetajate, birourile în L și bibliotecile trebuie demontate aproape întotdeauna. Canapelele extensibile se dezmembrează ușor. Frigiderele side-by-side și mașinile de spălat încap de obicei, dar măsoară lățimea scării (minim 80cm).",
        },
        {
            question: "Cât durează o mutare fără lift comparativ cu una cu lift?",
            answer: "O mutare fără lift durează de 2-3 ori mai mult. Un apartament cu 2 camere la etajul 4 fără lift necesită 4-6 ore (vs. 2-3 ore cu lift). La etajele 7+, durata poate depăși 8 ore și sunt necesari mai mulți muncitori.",
        },
        {
            question: "Pot fi deteriorate lucrurile când sunt cărate pe scări?",
            answer: "Riscul de zgârieturi sau lovituri crește la mutările fără lift. De aceea, împachetarea profesională este esențială: folii cu bule pentru sticlă, pături groase pentru mobilă, colțare din carton. Asigurarea bunurilor (5-10% din valoare) este foarte recomandată.",
        },
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    const costuriPerEtaj = [
        { etaj: "Parter → 1", supliment: "50 – 100 RON", timp: "+30 min", dificultate: "Ușor" },
        { etaj: "Parter → 2-3", supliment: "100 – 200 RON", timp: "+45-60 min", dificultate: "Moderat" },
        { etaj: "Parter → 4-5", supliment: "200 – 400 RON", timp: "+1-2 ore", dificultate: "Dificil" },
        { etaj: "Parter → 6-8", supliment: "400 – 800 RON", timp: "+2-4 ore", dificultate: "Foarte dificil" },
        { etaj: "Parter → 9+", supliment: "800+ RON", timp: "+4-6 ore", dificultate: "Lift exterior recomandat" },
    ];

    const solutii = [
        {
            title: "Demontare & Remontare Mobilă",
            icon: Wrench,
            desc: "Orice piesă care nu trece prin ușa scării se demontează. Firmele profesioniste vin cu scule electrice și etichetează fiecare șurub. Costul mediu: 200-500 RON pentru un apartament cu 2 camere.",
            tip: "Fotografiază fiecare pas al demontării pe telefon — ajută enorm la remontare.",
        },
        {
            title: "Lift Exterior (Macara Mobilă)",
            icon: ArrowUp,
            desc: "Pentru etaje înalte sau obiecte imposibil de cărat pe scări (piane, canapele colțar XXL), liftul exterior este singura soluție. Se montează pe fațada blocului și ridică bunurile direct la geam.",
            tip: "Verifică dacă ai nevoie de autorizație de la Primărie și anunță vecinii din timp.",
        },
        {
            title: "Cărucior Electric de Scări",
            icon: Truck,
            desc: "Echipament specializat care urcă obiecte grele (mașini de spălat, frigidere) pe scări, treaptă cu treaptă. Reduce efortul și riscul de accidentări. Majoritatea firmelor profesioniste au unul.",
            tip: "Întreabă firma dacă dispune de cărucior electric — nu toate au acest echipament.",
        },
        {
            title: "Echipă Suplimentară",
            icon: Building,
            desc: "La etajele 5+, în loc de 2 muncitori se recomandă 3-4. Unii formează un lanț pe scări, pasându-și obiectele. Costul suplimentar: 100-200 RON per om extra.",
            tip: "O echipă mai mare reduce timpul total și riscul de deteriorare din cauza oboselii.",
        },
    ];

    return (
        <>
            <Head>
                <title>Mutare la Etaj fără Lift — Soluții și Costuri {currentYear} | Ghid Complet</title>
                <meta
                    name="description"
                    content={`Ghid complet ${currentYear} pentru mutări la bloc fără lift. Costuri per etaj, soluții (lift exterior, demontare mobilă), sfaturi practice și prețuri reale.`}
                />
                <meta
                    name="keywords"
                    content={`mutare fara lift, mutare etaj, cost mutare bloc fara lift, mutare etaj 4 fara lift, lift exterior mutare, pret mutare pe scari ${currentYear}`}
                />
                <meta
                    property="og:title"
                    content={`Mutare la Etaj fără Lift ${currentYear} | Soluții și Costuri Reale`}
                />
                <meta
                    property="og:description"
                    content="Cât costă în plus mutarea fără lift? Soluții: demontare mobilă, lift exterior, cărucior de scări. Prețuri reale per etaj."
                />
                <meta property="og:type" content="article" />
                <meta property="og:url" content="https://ofertemutare.ro/articole/mutare-fara-lift" />
                <meta property="og:image" content="https://ofertemutare.ro/pics/blog/mutare-fara-lift.webp" />
                <link rel="canonical" href="https://ofertemutare.ro/articole/mutare-fara-lift" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://ofertemutare.ro/articole/mutare-fara-lift" />
                <meta name="twitter:title" content={`Mutare fără Lift ${currentYear} — Soluții și Costuri`} />
                <meta
                    name="twitter:description"
                    content="Ghid detaliat cu costuri per etaj, soluții practice și sfaturi pentru mutări la bloc fără lift."
                />
                <meta name="twitter:image" content="https://ofertemutare.ro/pics/blog/mutare-fara-lift.webp" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            <ArticleSchema
                title={`Mutare la Etaj fără Lift — Soluții și Costuri ${currentYear}`}
                description="Ghid complet pentru mutări la bloc fără lift cu prețuri reale per etaj și soluții practice."
                datePublished="2026-02-12"
                image="https://ofertemutare.ro/pics/blog/mutare-fara-lift.webp"
            />
            <BreadcrumbSchema
                items={[
                    { name: "Acasă", url: "/" },
                    { name: "Articole", url: "/articole" },
                    { name: `Mutare fără Lift — Soluții și Costuri ${currentYear}` },
                ]}
            />
            <LayoutWrapper>
                <article className="mx-auto max-w-4xl px-4 py-12">
                    {/* Header */}
                    <header className="mb-12 text-center">
                        <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-800">
                            Ghid Practic
                        </span>
                        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl px-4">
                            Mutare la Etaj{" "}
                            <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                                fără Lift {currentYear}
                            </span>
                        </h1>
                        <ArticleMetadata />
                        <TableOfContents
                            items={[
                                { id: "costuri-per-etaj", text: "Costuri per Etaj" },
                                { id: "solutii-practice", text: "4 Soluții Practice" },
                                { id: "sfaturi-economisire", text: "Cum Economisești" },
                                { id: "intrebari-frecvente", text: "Întrebări Frecvente" },
                                { id: "cere-oferte", text: "Cere Oferte Acum" },
                            ]}
                        />
                        <div className="mb-6 overflow-hidden rounded-2xl shadow-xl">
                            <Image
                                src="/pics/blog/mutare-fara-lift.webp"
                                alt="Mutare la etaj fără lift — muncitori cară mobilă pe scări"
                                width={1200}
                                height={1200}
                                className="h-auto w-full"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                            />
                        </div>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Locuiești la etaj într-un bloc fără lift? Nu ești singur — peste 40% din blocurile
                            din România nu au lift. Află exact cât costă, ce soluții există și cum eviți surprizele.
                        </p>
                    </header>

                    {/* Alert Box */}
                    <div className="mb-12 rounded-xl bg-amber-50 p-6 border border-amber-200 flex gap-4 items-start">
                        <Warning className="h-8 w-8 text-amber-600 shrink-0" />
                        <div>
                            <h3 className="text-lg font-bold text-amber-900">Important: Menționează Etajul și Lipsa Liftului!</h3>
                            <p className="text-amber-800">
                                Cea mai frecventă cauză de <strong>prețuri surpriză</strong> la mutări este lipsa informației
                                despre etaj sau lift. Când ceri ofertă, specifică întotdeauna: etajul exact, dacă ai lift,
                                lățimea scării și dacă ai obiecte grele (canapea, frigider, mașină de spălat).
                            </p>
                        </div>
                    </div>

                    {/* Costuri per Etaj */}
                    <section id="costuri-per-etaj" className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900 text-center">
                            Costuri Suplimentare per Etaj (fără lift)
                        </h2>
                        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                            Prețuri orientative {currentYear} pentru apartament cu 2 camere.
                            Suplimentul se adaugă la prețul standard al mutării.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="px-6 py-4 text-left font-semibold">Etaj</th>
                                        <th className="px-6 py-4 text-left font-semibold">Supliment</th>
                                        <th className="px-6 py-4 text-left font-semibold">Timp Extra</th>
                                        <th className="px-6 py-4 text-left font-semibold">Dificultate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {costuriPerEtaj.map((row, i) => (
                                        <tr
                                            key={i}
                                            className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} border-b border-slate-100`}
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900">{row.etaj}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">{row.supliment}</td>
                                            <td className="px-6 py-4 text-gray-600">{row.timp}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                                                        row.dificultate === "Ușor"
                                                            ? "bg-green-100 text-green-700"
                                                            : row.dificultate === "Moderat"
                                                              ? "bg-yellow-100 text-yellow-700"
                                                              : row.dificultate === "Dificil"
                                                                ? "bg-orange-100 text-orange-700"
                                                                : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {row.dificultate}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-sm text-gray-500 text-center">
                            * Prețurile variază în funcție de firmă, oraș și volumul bunurilor. Solicită mereu ofertă personalizată.
                        </p>
                    </section>

                    {/* Soluții Practice */}
                    <section id="solutii-practice" className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900 text-center">
                            4 Soluții Practice pentru Mutare fără Lift
                        </h2>
                        <div className="space-y-6">
                            {solutii.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col md:flex-row gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:border-emerald-200 transition-colors"
                                >
                                    <div className="flex bg-slate-50 h-16 w-16 items-center justify-center rounded-full shrink-0">
                                        <item.icon className="h-8 w-8 text-slate-600" />
                                    </div>
                                    <div className="grow">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-600 mb-3">{item.desc}</p>
                                        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                            <strong className="text-blue-800">💡 Pont:</strong>{" "}
                                            <span className="text-blue-700">{item.tip}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sfaturi Economisire */}
                    <section id="sfaturi-economisire" className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900 text-center">
                            Cum Economisești la Mutarea fără Lift
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Debarasează-te de mobilă veche</h3>
                                        <p className="text-gray-600 text-sm">
                                            Mai puține obiecte = mai puține drumuri pe scări. Vinde pe OLX, donează sau
                                            comandă un serviciu de debarasare. Fiecare piesă în minus economisește 20-50 RON la etajele înalte.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Demontează singur ce poți</h3>
                                        <p className="text-gray-600 text-sm">
                                            Paturile, birourile și rafturile IKEA se demontează ușor. Dacă le dezasamblezi
                                            înainte, echipa lucrează mai repede pe scări. Economie: 200-400 RON.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Alege ziua potrivită</h3>
                                        <p className="text-gray-600 text-sm">
                                            Marți-Joi sunt cele mai ieftine zile. Evită finalul de lună și weekendul —
                                            firmele au cerere mai mare și prețuri cu 20-30% mai mari.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Compară minimum 3 oferte</h3>
                                        <p className="text-gray-600 text-sm">
                                            Diferențele de preț pot fi de 30-50% între firme. Specifică clar etajul, lipsa
                                            liftului și obiectele grele. Pe ofertemutare.ro primești mai multe oferte într-un singur loc.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Exemplu Real */}
                    <section className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900 text-center">
                            Exemplu Real de Cost
                        </h2>
                        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-start gap-4">
                                <Currency className="mt-1 h-8 w-8 shrink-0 text-emerald-600" />
                                <div>
                                    <h3 className="mb-3 text-xl font-bold text-slate-900">
                                        Apartament 2 camere, Etaj 4 fără lift — București
                                    </h3>
                                    <div className="space-y-2 text-gray-700 mb-4">
                                        <p>📦 Mobilă standard: dormitor, living, bucătărie (frigider, mașină spălat)</p>
                                        <p>📍 Distanță: 8 km (Drumul Taberei → Titan)</p>
                                        <p>🏢 Preluare: etaj 4 fără lift → Livrare: etaj 2 cu lift</p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2 mb-4">
                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <span className="block text-sm font-medium text-slate-600">Mutare de bază</span>
                                            <span className="text-lg font-bold text-slate-900">1.400 RON</span>
                                        </div>
                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <span className="block text-sm font-medium text-slate-600">Supliment et. 4 fără lift</span>
                                            <span className="text-lg font-bold text-orange-600">+350 RON</span>
                                        </div>
                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <span className="block text-sm font-medium text-slate-600">Demontare/remontare mobilă</span>
                                            <span className="text-lg font-bold text-slate-900">+300 RON</span>
                                        </div>
                                        <div className="rounded-lg bg-emerald-50 p-4 ring-2 ring-emerald-200">
                                            <span className="block text-sm font-medium text-emerald-800">Total Estimat</span>
                                            <span className="text-2xl font-bold text-emerald-600">2.050 RON</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        * Prețul real poate varia cu ±15%. Include manipulare, transport și remontare.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section id="intrebari-frecvente" className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900 text-center">
                            Întrebări Frecvente
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details
                                    key={i}
                                    className="group rounded-xl border border-gray-100 bg-white shadow-sm"
                                >
                                    <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
                                        {faq.question}
                                    </summary>
                                    <p className="px-6 pb-4 text-gray-600">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section id="cere-oferte" className="mt-16 rounded-2xl bg-slate-900 px-6 py-12 text-center text-white">
                        <h2 className="mb-4 text-3xl font-bold">Mutare fără Lift? Noi Rezolvăm.</h2>
                        <p className="mb-8 text-slate-300 max-w-xl mx-auto">
                            Completează formularul, menționează etajul și primești oferte de la firme cu experiență
                            în mutări pe scări. Gratuit, fără obligații.
                        </p>
                        <Link
                            href="/#request-form"
                            className="inline-block rounded-full bg-emerald-500 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-emerald-600"
                        >
                            Cere Oferte de Mutare
                        </Link>
                    </section>
                </article>
            </LayoutWrapper>
        </>
    );
}
