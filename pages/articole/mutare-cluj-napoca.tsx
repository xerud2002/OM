import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import LayoutWrapper from "@/components/layout/Layout";
import {
    TruckIcon as Truck,
    AcademicCapIcon as Student,
    QuestionMarkCircleIcon as Question,
    CheckCircleIcon as CheckCircle,
    ExclamationTriangleIcon as Warning,
} from "@heroicons/react/24/outline";

export default function GuideCluj() {
    const currentYear = new Date().getFullYear();

    const faqs = [
        {
            question: "Cât costă o mutare în Cluj-Napoca?",
            answer: "Clujul are prețuri similare cu Bucureștiul. O mutare de garsonieră costă între 500-750 RON, iar un apartament cu 2 camere între 900-1.400 RON. Prețurile pot crește pentru zonele greu accesibile (străzi în pantă).",
        },
        {
            question: "Care sunt cele mai bune cartiere de locuit în Cluj?",
            answer: "Gheorgheni și Grigorescu sunt cele mai căutate pentru liniște și spații verzi. Mănăștur este cel mai accesibil și bine conectat, iar Bună Ziua oferă apartamente noi și moderne, ideale pentru familii tinere.",
        },
        {
            question: "Când este cel mai bine să te muți în Cluj?",
            answer: "Evită absolut lunile Septembrie și Februarie (începutul semestrelor universitare) când prețurile cresc și disponibilitatea firmelor scade drastic. Vara (Iulie-August) este ideală.",
        },
        {
            question: "Este dificilă mutarea în zonele de deal (Zorilor, Bună Ziua)?",
            answer: "Da, relieful Clujului pune probleme. Multe străzi din Zorilor, Gruia sau Bună Ziua sunt în pantă abruptă. Asigură-te că firma de mutări știe locația exactă pentru a trimite o mașină potrivită.",
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
                <title>Ghid Mutare Cluj-Napoca {currentYear}: Cartiere, Prețuri și Sfaturi | OferteMutare.ro</title>
                <meta
                    name="description"
                    content={`Ghid complet pentru mutarea în Cluj-Napoca în ${currentYear}. Află prețurile reale, cele mai bune cartiere (Gheorgheni, Zorilor) și sfaturi pentru studenți.`}
                />
                <meta
                    name="keywords"
                    content={`mutare cluj, firma mutari cluj, pret mutare cluj napoca, ghid cluj, transport mobila cluj, chirii cluj`}
                />
                <meta
                    property="og:title"
                    content={`Ghid Mutare Cluj-Napoca ${currentYear} | OferteMutare.ro`}
                />
                <meta
                    property="og:description"
                    content="Tot ce trebuie să știi despre viața și mutarea în 'Silicon Valley' de România. Prețuri, zone și logistică."
                />
                <meta property="og:type" content="article" />
                <meta
                    property="og:url"
                    content="https://ofertemutare.ro/articole/mutare-cluj-napoca"
                />
                <meta property="og:image" content="https://ofertemutare.ro/pics/blog/cluj-guide-2026.png" />
                <link rel="canonical" href="https://ofertemutare.ro/articole/mutare-cluj-napoca" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://ofertemutare.ro/articole/mutare-cluj-napoca" />
                <meta name="twitter:title" content={`Ghid Mutare Cluj-Napoca ${currentYear}`} />
                <meta
                    name="twitter:description"
                    content="Tot ce trebuie să știi despre viața și mutarea în 'Silicon Valley' de România. Prețuri, zone și logistică."
                />
                <meta name="twitter:image" content="https://ofertemutare.ro/pics/blog/cluj-guide-2026.png" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            <LayoutWrapper>
                <article className="mx-auto max-w-4xl px-4 py-12">
                    {/* Header */}
                    <header className="mb-12 text-center">
                        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl px-4">
                            Ghid Mutare în{" "}
                            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                                Cluj-Napoca {currentYear}
                            </span>
                        </h1>
                        <div className="mb-6 overflow-hidden rounded-2xl shadow-xl">
                            <Image
                                src="/pics/blog/cluj-guide-2026.png"
                                alt="Panorama Cluj Napoca Mutari"
                                width={1200}
                                height={675}
                                className="h-auto w-full"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                            />
                        </div>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Cunoscut ca &quot;Silicon Valley&quot; al Europei de Est, Clujul este cel mai dinamic oraș din România.
                            Dacă plănuiești să te muți aici, pregătește-te pentru o piață imobiliară competitivă,
                            dar și pentru o calitate a vieții pe măsură.
                        </p>
                    </header>

                    {/* Intro Context */}
                    <section className="mb-12 grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-6 border border-slate-100">
                            <h2 className="mb-3 text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Warning className="h-6 w-6 text-amber-500" />
                                Provocările Clujului
                            </h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex gap-2"><span className="text-amber-500 font-bold">!</span> <strong>Costuri Ridicate:</strong> Chiriile și serviciile sunt comparabile cu Bucureștiul.</li>
                                <li className="flex gap-2"><span className="text-amber-500 font-bold">!</span> <strong>Relief Accidentat:</strong> Multe cartiere (Zorilor, Gruia, Europa) sunt pe dealuri abrupte.</li>
                                <li className="flex gap-2"><span className="text-amber-500 font-bold">!</span> <strong>Trafic Intens:</strong> Axa Florești - Cluj este celebră pentru blocaje.</li>
                            </ul>
                        </div>
                        <div className="rounded-xl bg-emerald-50 p-6 border border-emerald-100">
                            <h2 className="mb-3 text-xl font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle className="h-6 w-6 text-emerald-600" />
                                De ce merită efortul?
                            </h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> <strong>Oportunități IT:</strong> Hub-ul principal pentru job-uri tech.</li>
                                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> <strong>Evenimente:</strong> UNTOLD, TIFF, Electric Castle la doi pași.</li>
                                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> <strong>Comunitate:</strong> Atmosferă cosmopolită, tânără și safe.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Neighborhoods */}
                    <section className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900 text-center">
                            Unde să locuiești? Top Cartiere
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Gheorgheni */}
                            <div className="rounded-xl border border-gray-200 p-4 hover:border-emerald-500 transition-colors">
                                <div className="h-2 w-12 bg-emerald-500 rounded-full mb-4"></div>
                                <h3 className="text-lg font-bold mb-2">Gheorgheni</h3>
                                <p className="text-sm text-gray-600 mb-2">Cel mai verde și liniștit. Aproape de Iulius Mall și baza sportivă.</p>
                                <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">Familii / IT</span>
                            </div>
                            {/* Manastur */}
                            <div className="rounded-xl border border-gray-200 p-4 hover:border-blue-500 transition-colors">
                                <div className="h-2 w-12 bg-blue-500 rounded-full mb-4"></div>
                                <h3 className="text-lg font-bold mb-2">Mănăștur</h3>
                                <p className="text-sm text-gray-600 mb-2">Cel mai mare cartier. Prețuri mai accesibile, conectat, aglomerat.</p>
                                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">Studenți / Buget</span>
                            </div>
                            {/* Zorilor */}
                            <div className="rounded-xl border border-gray-200 p-4 hover:border-purple-500 transition-colors">
                                <div className="h-2 w-12 bg-purple-500 rounded-full mb-4"></div>
                                <h3 className="text-lg font-bold mb-2">Zorilor</h3>
                                <p className="text-sm text-gray-600 mb-2">Pe deal, panoramic. Aproape de UMF și Sigma Center.</p>
                                <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-1 rounded">Studenți Medicină</span>
                            </div>
                            {/* Buna Ziua */}
                            <div className="rounded-xl border border-gray-200 p-4 hover:border-amber-500 transition-colors">
                                <div className="h-2 w-12 bg-amber-500 rounded-full mb-4"></div>
                                <h3 className="text-lg font-bold mb-2">Bună Ziua</h3>
                                <p className="text-sm text-gray-600 mb-2">Blocuri noi, modern, aerisit. Mai scump și dependent de mașină.</p>
                                <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">Premium</span>
                            </div>
                        </div>
                    </section>

                    {/* Logistics specific to Cluj */}
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <Truck className="h-8 w-8 text-indigo-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Logistică: Dealuri și Străzi Înguste</h2>
                        </div>
                        <div className="prose prose-slate max-w-none text-gray-700">
                            <p>
                                Relieful Clujului este un factor crucial în planificarea mutării. Spre deosebire de Bucureștiul plat,
                                aici va trebui să iei în calcul pantele.
                            </p>
                            <h3 className="text-xl font-bold mt-4 mb-2">Zonele dificile pentru camioane:</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Zorilor & Europa:</strong> Multe străzi secundare au pante de 10-15%. Iarna accesul poate fi imposibil pentru dube mari fără lanțuri.</li>
                                <li><strong>Gruia & Cetățuia:</strong> Străzi înguste, viraje strânse și pante abrupte.</li>
                                <li><strong>Centrul Vechi:</strong> Zone pietonale (Piața Muzeului) sau cu acces restricționat. Ai nevoie de autorizație de la Primărie pentru vehicule &gt;3.5 tone.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Price Table */}
                    <section className="mb-16">
                        <h2 className="mb-6 text-3xl font-bold text-slate-900">Prețuri Mutări Cluj {currentYear}</h2>
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-emerald-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Tip Locuință</th>
                                        <th className="px-6 py-4 font-semibold">Interval Preț</th>
                                        <th className="px-6 py-4 font-semibold hidden md:table-cell">Durată Medie</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 font-medium">Garsonieră (Mărăști/Mănăștur)</td>
                                        <td className="px-6 py-4 font-bold text-emerald-700">500 - 750 RON</td>
                                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell">3 ore</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium">Apartament 2 Camere</td>
                                        <td className="px-6 py-4 font-bold text-emerald-700">900 - 1.400 RON</td>
                                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell">4-5 ore</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium">Casă/Vilă (Bună Ziua/Făget)</td>
                                        <td className="px-6 py-4 font-bold text-emerald-700">2.500 - 4.500 RON</td>
                                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell">1 zi</td>
                                    </tr>
                                    <tr className="bg-amber-50">
                                        <td className="px-6 py-4 font-medium text-amber-900">Supliment Manipulare Pantă</td>
                                        <td className="px-6 py-4 font-bold text-amber-700">+15-20%</td>
                                        <td className="px-6 py-4 text-amber-800 hidden md:table-cell">Dacă camionul nu ajunge la scară</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Student Info */}
                    <section className="mb-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Student className="h-8 w-8 text-blue-600" />
                            <h2 className="text-2xl font-bold text-slate-900">Studenți UBB & UTCN</h2>
                        </div>
                        <p className="mb-4 text-gray-700">
                            Clujul găzduiește peste 100.000 de studenți. &quot;Marea Migrație&quot; are loc în <strong>sfârșit de Septembrie</strong> și <strong>final de Iunie</strong>.
                        </p>
                        <ul className="grid gap-4 sm:grid-cols-2">
                            <li className="bg-white p-4 rounded-lg shadow-sm">
                                <strong>Hașdeu & Observator:</strong> Accesul cu mașina în complexele studențești este limitat la bariere. Pregătește-te să cari bagajele 50-100m.
                            </li>
                            <li className="bg-white p-4 rounded-lg shadow-sm">
                                <strong>Chirii scumpe:</strong> Mulți studenți aleg Floreștiul pentru chirii mai mici. Ia în calcul traficul infernal de dimineață (45-60 min).
                            </li>
                        </ul>
                    </section>

                    {/* FAQ Schema Section */}
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <Question className="h-8 w-8 text-emerald-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Întrebări Frecvente Cluj</h2>
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
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                        <h2 className="mb-4 text-3xl font-bold text-white relative z-10">Te muți la Cluj?</h2>
                        <p className="mb-8 text-lg text-slate-300 relative z-10 max-w-2xl mx-auto">
                            Firmele noastre partenere din Cluj sunt obișnuite cu pantele din Zorilor și traficul din Mărăști.
                            Primește oferte corecte, fără costuri ascunse.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row relative z-10">
                            <Link
                                href="/#request-form"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
                            >
                                Cere Oferte Cluj
                            </Link>
                        </div>
                    </section>
                </article>
            </LayoutWrapper>
        </>
    );
}
