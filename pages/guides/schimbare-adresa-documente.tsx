import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import LayoutWrapper from "@/components/layout/Layout";
import {
    DocumentTextIcon as Document,
    HomeIcon as Home,
    IdentificationIcon as IdCard,
    CreditCardIcon as Card,
    ScaleIcon as Scale,
    ExclamationTriangleIcon as Warning,
    ClockIcon as Clock,
} from "@heroicons/react/24/outline";

export default function GhidSchimbareAdresa() {
    const currentYear = new Date().getFullYear();

    const checklist = [
        {
            title: "Cartea de Identitate (Buletin)",
            icon: IdCard,
            deadline: "15 zile de la mutare",
            desc: "Primul și cel mai important pas. Ai nevoie de actul de proprietate al noii locuințe (original + copie) și prezența proprietarului (dacă stai în chirie).",
            priority: "Urgent"
        },
        {
            title: "Rol Fiscal & Impozite",
            icon: Scale,
            deadline: "30 zile de la achiziție",
            desc: "Dacă ai cumpărat o casă, trebuie să o declari la Direcția de Taxe și Impozite Locale (DITL) de sector pentru impozit.",
            priority: "Critic"
        },
        {
            title: "Furnizori Utilități",
            icon: Home,
            deadline: "Imediat după mutare",
            desc: "Schimbă contractele (sau titularul) la energie electrică (PPC/Hidroelectrica) și gaze (Engie/E.ON). Indexul vechi trebuie închis.",
            priority: "Important"
        },
        {
            title: "Internet & TV",
            icon: Document,
            deadline: "Cu 1 săptămână înainte",
            desc: "Programează transferul serviciilor (Digi/Orange/Vodafone) la noua adresă. Tehnicienii pot fi aglomerați.",
            priority: "Mediu"
        },
        {
            title: "Bănci & Asigurări",
            icon: Card,
            deadline: "Oricând",
            desc: "Actualizează adresa în aplicațiile bancare (Home Bank) și anunță asiguratorul auto/RCA.",
            priority: "Scăzut"
        }
    ];

    return (
        <>
            <Head>
                <title>Acte Necesare Schimbare Adresă/Domiciliu {currentYear} | Ghid Complet</title>
                <meta
                    name="description"
                    content={`Ghid complet ${currentYear} pentru schimbarea adresei în buletin. Lista de acte necesare la evidența populației, taxe locale și utilități.`}
                />
                <meta
                    name="keywords"
                    content="schimbare adresa buletin, acte necesare buletin, schimbare domiciliu, flotant, declarare taxe locale"
                />
            </Head>

            <LayoutWrapper>
                <article className="mx-auto max-w-4xl px-4 py-12">
                    {/* Header */}
                    <header className="mb-12 text-center">
                        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl px-4">
                            Ghid Acte{" "}
                            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                                Schimbare Adresă {currentYear}
                            </span>
                        </h1>
                        <div className="mb-6 overflow-hidden rounded-2xl shadow-xl">
                            <Image
                                src="/pics/blog/guide-banner-v2.png"
                                alt="Acte Schimbare Adresa"
                                width={1200}
                                height={675}
                                className="h-auto w-full"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                            />
                        </div>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Mutarea fizică s-a terminat, dar acum începe birocrația.
                            Lista completă cu tot ce trebuie să actualizezi pentru a fi 100% legal la noua ta casă.
                        </p>
                    </header>

                    {/* Alert Box */}
                    <div className="mb-12 rounded-xl bg-amber-50 p-6 border border-amber-200 flex gap-4 items-start">
                        <Warning className="h-8 w-8 text-amber-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-bold text-amber-900">Termen Legal: 15 Zile</h3>
                            <p className="text-amber-800">
                                Conform legii, ai obligația să soliciți schimbarea actului de identitate în termen de
                                <strong> 15 zile</strong> de la mutarea la noua adresă (schimbarea domiciliului).
                                Nerespectarea termenului se sancționează cu amendă (40-80 lei).
                            </p>
                        </div>
                    </div>

                    {/* Checklist Grid */}
                    <section className="mb-16">
                        <h2 className="mb-8 text-3xl font-bold text-slate-900 text-center">
                            Checklist Documente & Instituții
                        </h2>
                        <div className="space-y-6">
                            {checklist.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:border-emerald-200 transition-colors">
                                    <div className="flex bg-slate-50 h-16 w-16 items-center justify-center rounded-full flex-shrink-0">
                                        <item.icon className="h-8 w-8 text-slate-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.priority === "Urgent" ? "bg-red-100 text-red-700" :
                                                item.priority === "Critic" ? "bg-orange-100 text-orange-700" :
                                                    "bg-emerald-100 text-emerald-700"
                                                }`}>
                                                {item.priority}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-2">{item.desc}</p>
                                        <div className="text-sm font-semibold text-slate-500 flex items-center gap-1">
                                            <Clock className="h-4 w-4" /> Termen: {item.deadline}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Detailed Steps for ID */}
                    <section className="mb-16 prose prose-slate max-w-none">
                        <h2 className="text-3xl font-bold text-slate-900">1. Cum schimbi buletinul (Pas cu Pas)</h2>
                        <p>
                            Trebuie să te prezinți la <strong>SPCLEP (Evidența Populației)</strong> de care aparține noua stradă.
                        </p>
                        <h3>Acte Necesare {currentYear}:</h3>
                        <ul>
                            <li>Cerere tip (se primește la ghișeu sau se descarcă online).</li>
                            <li>Actul de identitate vechi (original).</li>
                            <li>Certificatul de naștere (original).</li>
                            <li>Certificatul de căsătorie/divorț (dacă e cazul, original).</li>
                            <li><strong>Actul de spațiu</strong> (contract vânzare-cumpărare sau chirie) - Original.</li>
                            <li>Chitanța reprezentând contravaloarea cărții de identitate (7 lei, se poate plăti pe Ghiseul.ro sau SMS).</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-lg not-prose border-l-4 border-blue-500">
                            <strong>Pont:</strong> Dacă locuiești cu chirie și nu ai viză de flotant, proprietarul TREBUIE să fie prezent fizic la ghișeu cu tine pentru a-și da acordul.
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="mt-16 rounded-2xl bg-slate-900 px-6 py-12 text-center text-white">
                        <h2 className="mb-4 text-3xl font-bold">Te-ai încurcat în hârtii?</h2>
                        <p className="mb-8 text-slate-300">
                            Măcar mutarea fizică să fie simplă. Lasă greul în seama noastră.
                        </p>
                        <Link
                            href="/#request-form"
                            className="inline-block rounded-full bg-emerald-500 px-8 py-3 text-lg font-bold text-white transition-hover hover:bg-emerald-600"
                        >
                            Vezi Oferte Mutare
                        </Link>
                    </section>
                </article>
            </LayoutWrapper>
        </>
    );
}
