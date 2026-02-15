import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import LayoutWrapper from "@/components/layout/Layout";
import { ArticleSchema } from "@/components/seo/SchemaMarkup";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import ArticleMetadata from "@/components/content/ArticleMetadata";
import TableOfContents from "@/components/content/TableOfContents";
import {
    CurrencyEuroIcon as Currency,
    CheckCircleIcon as CheckCircle,
    XCircleIcon as XCircle,
} from "@heroicons/react/24/outline";

export default function ArticleCartiereBucuresti() {
    const currentYear = new Date().getFullYear();

    // FAQ Schema for SEO - optimized for high-volume Romanian keywords
    const faqData = [
        {
            question: "Care este cel mai bun cartier din București pentru familii?",
            answer: "Drumul Taberei și Titan sunt cele mai bune opțiuni pentru familii, oferind parcuri mari, metrou, și chirii accesibile (350-600€/lună pentru 2 camere)."
        },
        {
            question: "Unde să locuiesc în București dacă lucrez în Pipera?",
            answer: "Zonele ideale sunt Aviației, Pipera Nouă sau Băneasa. Alternativ, orice zonă cu metrou M2 (Berceni, Tineretului) oferă acces direct."
        },
        {
            question: "Care sunt cele mai ieftine cartiere din București?",
            answer: "Militari Residence și Berceni oferă cele mai mici chirii (300-500€ pentru 2 camere), cu acces la metrou și mall-uri."
        },
        {
            question: "Ce cartiere din București au metrou?",
            answer: "Titan (M1/M3), Drumul Taberei (M5), Berceni/Tineretului (M2), Dristor (M1/M3), și Pipera (M2) sunt toate pe linii de metrou."
        },
        {
            question: "Cât costă chiria în București pe zone în 2026?",
            answer: "Chirii medii 2026: Militari 300-450€, Berceni/Titan 400-600€, Tineretului 500-750€, Aviației 600-900€, Floreasca/Dorobanți 700-1200€ pentru 2 camere."
        },
        {
            question: "Care sunt cele mai sigure cartiere din București?",
            answer: "Zonele considerate cele mai sigure sunt Aviației, Băneasa, Floreasca și Primăverii. Acestea au rate scăzute ale criminalității, străzi iluminate și pază privată în multe complexuri."
        }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };


    const cartiere = [
        {
            name: "Aviației",
            tag: "Corporate & Premium",
            desc: "Ideal pentru cei care lucrează în zona de nord (Pipera/Aurel Vlaicu). Blocuri mici, liniște, dar prețuri ridicate.",
            price: "600-900€ (2 camere)",
            pros: ["Aproape de birouri", "Parcul Herăstrău", "Liniște"],
            cons: ["Prețuri mari", "Locuri de parcare limitate"]
        },
        {
            name: "Drumul Taberei",
            tag: "Familii & Verde",
            desc: "Unul dintre cele mai verzi cartiere. De când a apărut metroul M5, a devenit extrem de accesibil și atractiv.",
            price: "350-500€ (2 camere)",
            pros: ["Metrou M5", "Parcul Moghioroș", "Prețuri bune"],
            cons: ["Trafic spre centru", "Blocuri vechi"]
        },
        {
            name: "Titan",
            tag: "Parcuri & Echilibru",
            desc: "Dominat de Parcul IOR. O alegere excelentă pentru familii și tineri care vor natură și conexiuni bune (Metrou M1/M3).",
            price: "400-600€ (2 camere)",
            pros: ["Parcul IOR", "Mall ParkLake", "Metrou"],
            cons: ["Aglomerat la ore de vârf"]
        },
        {
            name: "Tineretului",
            tag: "Activ & Aproape de Centru",
            desc: "La doi pași de Piața Unirii. Parcul Tineretului este uriaș, iar accesul spre centru este instantaneu.",
            price: "500-750€ (2 camere)",
            pros: ["Parcul Tineretului", "Lângă Centru", "Metrou M2"],
            cons: ["Zgomotos", "Blocuri la bulevard"]
        },
        {
            name: "Militari",
            tag: "Buget & Studenți",
            desc: "Prețuri accesibile și multe apartamente noi în zona Militari Residence. Traficul este însă o provocare majoră.",
            price: "300-450€ (2 camere)",
            pros: ["Chirii ieftine", "Multe construcții noi", "Comerț (Plaza/Afi)"],
            cons: ["Traficul pe Iuliu Maniu", "Aglomerație extremă"]
        },
        {
            name: "Berceni",
            tag: "Accesibil & Sud",
            desc: "Un cartier clasic de familii, cu prețuri bune și acces rapid la metrou M2 (care duce direct în Pipera).",
            price: "350-500€ (2 camere)",
            pros: ["Metrou M2", "Prețuri bune", "Mall Sun Plaza"],
            cons: ["Aspect gri în unele zone", "Distanță mare de Nord"]
        },
        {
            name: "Băneasa",
            tag: "Lux & Pădure",
            desc: "Zona de nord, aproape de Pădure și Mall. Predomină vilele și complexele rezidențiale noi de lux.",
            price: "800-1500€ (2 camere/vilă)",
            pros: ["Aer curat", "Shopping (Băneasa Mall)", "Exclusivist"],
            cons: ["Fără metrou", "Dependent de mașină"]
        },
        {
            name: "Dorobanți / Floreasca",
            tag: "Elite & Social",
            desc: "Centrul vieții sociale de lux. Cafenele, restaurante, parcuri mici și o atmosferă boemă scumpă.",
            price: "700-1200€ (2 camere)",
            pros: ["Viață socială", "Central", "Prestigiu"],
            cons: ["Foarte scump", "Parcare imposibilă", "Zgomot"]
        },
        {
            name: "Dristor",
            tag: "Conexiuni",
            desc: "Nodul de transport al Bucureștiului (M1 & M3). Nu este cel mai frumos, dar e cel mai practic pentru navetă.",
            price: "400-550€ (2 camere)",
            pros: ["Conexiuni Metrou", "Aproape de centru", "Shaorma (istoric)"],
            cons: ["Aglomerat", "Poluat"]
        },
        {
            name: "Pipera (Zona nouă)",
            tag: "Business & Nou",
            desc: "Cartierul corporatiștilor. Blocuri noi, moderne, lângă birouri. Seara poate fi pustiu.",
            price: "600-900€ (2 camere)",
            pros: ["Blocuri noi", "Lângă job", "Parcare subterană"],
            cons: ["Șantier continuu", "Fără viață socială", "Trafic"]
        },
    ];

    return (
        <>
            <Head>
                <title>{`Top 10 Cartiere București pentru Relocare ${currentYear} | OferteMutare.ro`}</title>
                <meta
                    name="description"
                    content={`Descoperă cele mai bune zone de locuit în București în ${currentYear}. Analizăm prețuri, parcuri și transport pentru Aviației, Titan, Drumul Taberei și altele.`}
                />
                <meta
                    name="keywords"
                    content="cele mai bune cartiere bucuresti, unde sa locuiesti bucuresti, chirie bucuresti, zone bune bucuresti, top cartiere"
                />
                <link rel="canonical" href="https://ofertemutare.ro/articole/cele-mai-bune-cartiere-bucuresti" />
                <meta property="og:title" content={`Top 10 Cartiere București ${currentYear} | Ghid Relocare`} />
                <meta
                    property="og:description"
                    content="Analiză detaliată a zonelor de locuit în București: prețuri, transport, avantaje și dezavantaje pentru fiecare cartier."
                />
                <meta property="og:type" content="article" />
                <meta property="og:url" content="https://ofertemutare.ro/articole/cele-mai-bune-cartiere-bucuresti" />
                <meta property="og:image" content="https://ofertemutare.ro/pics/blog/bucharest-neighborhoods-map.webp" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://ofertemutare.ro/articole/cele-mai-bune-cartiere-bucuresti" />
                <meta name="twitter:title" content={`Top 10 Cartiere București ${currentYear}`} />
                <meta
                    name="twitter:description"
                    content="Unde să locuiești în București? Ghid complet cu prețuri, transport și avantaje pentru fiecare zonă."
                />
                <meta name="twitter:image" content="https://ofertemutare.ro/pics/blog/bucharest-neighborhoods-map.webp" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            
      <ArticleSchema
        title={`Top 10 Cartiere București pentru Relocare ${currentYear}`}
        description={`Descoperă cele mai bune zone de locuit în București în ${currentYear}. Analizăm prețuri, parcuri și transport pentru Aviației, Titan, Drumul Taberei și altele.`}
        datePublished="2026-02-02"
        image="https://ofertemutare.ro/pics/blog/bucharest-neighborhoods-map.webp"
      />
      <LayoutWrapper>
                <Breadcrumbs
                  items={[
                    { name: "Acasă", href: "/" },
                    { name: "Articole", href: "/articole" },
                    { name: `Top 10 Cartiere București pentru Relocare ${currentYear}` },
                  ]}
                />
                <article className="mx-auto max-w-4xl px-4 py-12">
                    {/* Header */}
                    <header className="mb-12 text-center">
                        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl px-4">
                            Top 10 Cartiere din{" "}
                            <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                                București în {currentYear}
                            </span>
                        </h1>
            <ArticleMetadata />
            <TableOfContents items={[
              
              { id: "te-ai-hotrt-unde-te-mui", text: "Te-ai hotărât unde te muți?" } 
            ]} />
                        <div className="mb-6 overflow-hidden rounded-2xl shadow-xl">
                            <Image
                                src="/pics/blog/bucharest-neighborhoods-map.webp"
                                alt="Harta Cartiere Bucuresti"
                                width={1200}
                                height={675}
                                className="h-auto w-full"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                            />
                        </div>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Unde te muți în București? Am analizat prețurile, traficul și calitatea vieții
                            pentru a crea topul definitiv al zonelor din Capitală.
                        </p>
                    </header>

                    {/* Intro */}
                    <div className="prose prose-slate mx-auto mb-16 max-w-none">
                        <p>
                            Alegerea cartierului potrivit în București este mai importantă decât alegerea apartamentului în sine.
                            Diferența dintre o navetă de 20 de minute și una de 90 de minute poate schimba complet calitatea vieții.
                            Indiferent dacă ești student, tânăr profesionist sau ai o familie, există un cartier perfect pentru tine.
                        </p>
                    </div>

                    {/* List */}
                    <div className="space-y-12">
                        {cartiere.map((zona, index) => (
                            <div key={index} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                                                {index + 1}
                                            </span>
                                            <h2 className="text-2xl font-bold text-slate-900">{zona.name}</h2>
                                        </div>
                                        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                            {zona.tag}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-emerald-700 font-bold">
                                        <Currency className="h-5 w-5" />
                                        {zona.price}
                                    </div>
                                </div>

                                <p className="mb-6 text-gray-700">{zona.desc}</p>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg bg-green-50 p-4">
                                        <h4 className="mb-2 font-bold text-green-800 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" /> Avantaje
                                        </h4>
                                        <ul className="list-disc pl-5 text-sm text-green-900">
                                            {zona.pros.map((p, i) => <li key={i}>{p}</li>)}
                                        </ul>
                                    </div>
                                    <div className="rounded-lg bg-red-50 p-4">
                                        <h4 className="mb-2 font-bold text-red-800 flex items-center gap-2">
                                            <XCircle className="h-5 w-5" /> Dezavantaje
                                        </h4>
                                        <ul className="list-disc pl-5 text-sm text-red-900">
                                            {zona.cons.map((c, i) => <li key={i}>{c}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <section className="mt-16 rounded-2xl bg-indigo-900 px-6 py-12 text-center text-white">
                        <h2 id="te-ai-hotrt-unde-te-mui" className="mb-4 text-3xl font-bold">Te-ai hotărât unde te muți?</h2>
                        <p className="mb-8 text-indigo-200">
                            Indiferent de cartierul ales, noi te ajutăm să ajungi acolo rapid și sigur.
                            Cere o ofertă de mutare personalizată.
                        </p>
                        <Link
                            href="/#request-form"
                            className="inline-block rounded-full bg-white px-8 py-3 text-lg font-bold text-indigo-900 transition-hover hover:bg-emerald-400"
                        >
                            Calculează Preț Mutare
                        </Link>
                    </section>
                </article>
            </LayoutWrapper>
        </>
    );
}


