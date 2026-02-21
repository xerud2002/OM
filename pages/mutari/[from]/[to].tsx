import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import {
    MapPinIcon as MapPin,
    TruckIcon as Truck,
    CurrencyEuroIcon as Currency,
    ClockIcon as Clock,
    ShieldCheckIcon as Shield,
    ArrowRightIcon as ArrowRight,
    ArrowsRightLeftIcon as Swap,
} from "@heroicons/react/24/outline";
import { getAllRoutePaths, getRouteData, RouteData } from "@/data/geo/routeData";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { AggregateRatingSchema } from "@/components/seo/SchemaMarkup";
import { getReviewStats } from "@/lib/firebaseAdmin";

interface RoutePageProps {
    routeData: RouteData;
    formattedDate: string;
    reviewStats: { ratingValue: number; reviewCount: number };
}

export default function RoutePage({ routeData, formattedDate, reviewStats }: RoutePageProps) {
    const { fromCity, toCity, distanceKm, durationHrs, priceEstimate } = routeData;

    const fullTitle = `Mutări ${fromCity.name} - ${toCity.name} | Preț & Durată | OferteMutare.ro`;
    const shortTitle = `Mutări ${fromCity.name} - ${toCity.name} | OferteMutare.ro`;
    const title = fullTitle.length > 60 ? shortTitle : fullTitle;
    const description = `Transport mobilă ${fromCity.name} - ${toCity.name}. Distanță ${distanceKm} km, durată ${durationHrs}h. Prețuri estimative de la ${priceEstimate.studio}. Compară oferte gratuite.`;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link
                    rel="canonical"
                    href={`https://ofertemutare.ro/mutari/${fromCity.slug}/${toCity.slug}`}
                />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://ofertemutare.ro/mutari/${fromCity.slug}/${toCity.slug}`} />
                <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={`https://ofertemutare.ro/mutari/${fromCity.slug}/${toCity.slug}`} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />

                {/* JSON-LD Structured Data */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "Service",
                      serviceType: `Comparare oferte transport mobilă ${fromCity.name} - ${toCity.name}`,
                      broker: {
                        "@type": "Organization",
                        name: "OferteMutare.ro",
                        url: "https://ofertemutare.ro",
                        logo: "https://ofertemutare.ro/pics/index.webp",
                      },
                      areaServed: [
                        { "@type": "City", name: fromCity.name },
                        { "@type": "City", name: toCity.name },
                      ],
                      description: description,
                    }),
                  }}
                />
            </Head>

            <LayoutWrapper>
                <Breadcrumbs
                  items={[
                    { name: "Acasă", href: "/" },
                    { name: "Mutări", href: "/mutari" },
                    { name: fromCity.name, href: `/mutari/${fromCity.slug}` },
                    { name: toCity.name },
                  ]}
                />
                {reviewStats.reviewCount > 0 && (
                  <AggregateRatingSchema ratingValue={reviewStats.ratingValue} reviewCount={reviewStats.reviewCount} />
                )}
                <div className="bg-slate-50 pb-16">
                    {/* Header Section */}
                    <div className="bg-emerald-900 py-12 text-white">
                        <div className="container mx-auto px-4">
                            <div className="mx-auto max-w-4xl text-center">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-1 text-sm font-medium text-emerald-100">
                                    <Truck className="h-4 w-4" />
                                    Rute Naționale {formattedDate}
                                </div>
                                <h1 className="mb-6 text-3xl font-bold md:text-5xl">
                                    Transport Mobilă <br />
                                    <span className="text-emerald-400">{fromCity.name}</span> <span className="text-slate-400">➔</span>{" "}
                                    <span className="text-emerald-400">{toCity.name}</span>
                                </h1>
                                <p className="text-lg text-emerald-100">
                                    Servicii rapide și sigure pe ruta {distanceKm} km. Poți economisi prin
                                    grupaj (spațiu partajat în camion).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="container mx-auto -mt-8 px-4">
                        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
                            <div className="rounded-xl bg-white p-6 shadow-lg">
                                <div className="mb-2 flex items-center justify-center gap-2 text-slate-500">
                                    <MapPin className="h-5 w-5" />
                                    <span>Distanță Rutieră</span>
                                </div>
                                <div className="text-center text-2xl font-bold text-slate-900">{distanceKm} km</div>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-lg">
                                <div className="mb-2 flex items-center justify-center gap-2 text-slate-500">
                                    <Clock className="h-5 w-5" />
                                    <span>Durată Estimată</span>
                                </div>
                                <div className="text-center text-2xl font-bold text-slate-900">~{durationHrs} ore</div>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-lg">
                                <div className="mb-2 flex items-center justify-center gap-2 text-slate-500">
                                    <Currency className="h-5 w-5" />
                                    <span>Preț Start</span>
                                </div>
                                <div className="text-center text-2xl font-bold text-emerald-600">
                                    {priceEstimate.studio.split("-")[0]}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="container mx-auto mt-12 grid max-w-5xl gap-12 px-4 md:grid-cols-3">
                        {/* Left Column (Content) */}
                        <div className="md:col-span-2 space-y-12">
                            <section>
                                <h2 className="mb-6 text-2xl font-bold text-slate-900">
                                    Ce trebuie să știi despre mutarea {fromCity.name} - {toCity.name}
                                </h2>
                                <div className="prose text-slate-600 text-lg leading-relaxed">
                                    <p className="mb-4">
                                        Planifici o relocare din <strong>{fromCity.name}</strong> către{" "}
                                        <strong>{toCity.name}</strong>? Această rută de {distanceKm} km este una
                                        frecventată de partenerii noștri, ceea ce înseamnă că poți beneficia des de
                                        tarife reduse prin sistemul de grupaj (folosirea spațiului rămas în camioane
                                        care se întorc goale).
                                    </p>
                                    <p>
                                        Indiferent dacă muți o garsonieră, un apartament complet sau doar câteva piese
                                        de mobilier, firmele verificate de pe OferteMutare.ro îți pot asigura un
                                        transport sigur și rapid, direct la noul tău domiciliu din {toCity.county}.
                                    </p>
                                </div>
                            </section>

                            {/* Price Table with Estimation */}
                            <section>
                                <h3 className="mb-4 text-xl font-bold text-slate-900">Costuri Estimative Mutare</h3>
                                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-100 text-sm font-semibold uppercase text-slate-500">
                                            <tr>
                                                <th className="px-3 py-2 md:px-6 md:py-4">Tip Locuință</th>
                                                <th className="px-3 py-2 md:px-6 md:py-4">Preț Estimat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-700">
                                            <tr>
                                                <td className="px-3 py-2 md:px-6 md:py-4 font-medium">Garsonieră</td>
                                                <td className="px-3 py-2 md:px-6 md:py-4 text-emerald-700 font-bold">{priceEstimate.studio}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-3 py-2 md:px-6 md:py-4 font-medium">Apartament 2 Camere</td>
                                                <td className="px-3 py-2 md:px-6 md:py-4 text-emerald-700 font-bold">{priceEstimate.twoRoom}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-3 py-2 md:px-6 md:py-4 font-medium">Casă / Vilă</td>
                                                <td className="px-3 py-2 md:px-6 md:py-4 text-emerald-700 font-bold">{priceEstimate.house}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="bg-emerald-50 p-4 text-sm text-emerald-800">
                                        * Prețurile sunt estimative și includ transportul pe baza distanței. Serviciile extra (manipulare, lift exterior) se calculează separat.
                                    </div>
                                </div>
                            </section>

                            {/* FAQ Section */}
                            <section>
                                <h3 className="mb-4 text-xl font-bold text-slate-900">Întrebări Frecvente</h3>
                                <div className="space-y-4">
                                    <details className="group rounded-lg bg-white p-4 shadow-sm open:ring-1 open:ring-emerald-500">
                                        <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-900">
                                            Cât durează transportul?
                                            <span className="transition group-open:rotate-180">▼</span>
                                        </summary>
                                        <p className="mt-4 text-slate-600">
                                            Pentru distanța de {distanceKm} km, transportul efectiv durează aproximativ {durationHrs} ore. Totuși, ia în calcul și timpii de încărcare/descărcare (2-4 ore), deci o mutare completă durează de obicei o zi întreagă.
                                        </p>
                                    </details>
                                    <details className="group rounded-lg bg-white p-4 shadow-sm open:ring-1 open:ring-emerald-500">
                                        <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-900">
                                            Există asigurare pentru bunuri?
                                            <span className="transition group-open:rotate-180">▼</span>
                                        </summary>
                                        <p className="mt-4 text-slate-600">
                                            Da, toate firmele partenere Premium includ asigurare CMR pentru transportul rutier de marfă, acoperind daune de până la 20.000 EUR pe durata transportului.
                                        </p>
                                    </details>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* CTA Card */}
                            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Primește Oferte Reale</h3>
                                <p className="text-sm text-slate-500 mb-6">Firmele concurează pentru mutarea ta. Economisești timp și bani.</p>
                                <Link
                                    href="/customer/auth"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 shadow-md hover:shadow-lg"
                                >
                                    Cere Oferte Acum
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <Shield className="h-4 w-4" />
                                    100% Gratuit și Fără Obligații
                                </div>
                            </div>

                            {/* Reverse Route Link */}
                            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                                <h4 className="text-sm font-semibold text-slate-500 mb-3">Cauți ruta inversă?</h4>
                                <Link
                                    href={`/mutari/${toCity.slug}/${fromCity.slug}`}
                                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                                >
                                    <Swap className="h-5 w-5" />
                                    Vezi {toCity.name} - {fromCity.name}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutWrapper>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllRoutePaths();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<RoutePageProps> = async ({ params }) => {
    const fromSlug = params?.from as string;
    const toSlug = params?.to as string;

    const routeData = getRouteData(fromSlug, toSlug);

    if (!routeData) {
        return { notFound: true };
    }

    return {
        props: {
            routeData,
            formattedDate: new Date().toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' }),
            reviewStats: await getReviewStats(),
        },
        revalidate: 3600,
    };
};
