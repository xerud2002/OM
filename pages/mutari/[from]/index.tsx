import Head from "next/head";
import Link from "next/link";
import NextImage from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import LayoutWrapper from "@/components/layout/Layout";
import {
    MapPinIcon as MapPin,
    ShieldCheckIcon as Shield,
    TruckIcon as Truck,
    CubeIcon as Package,
    StarIcon as Star,
    CheckCircleIcon as CheckCircle,
    ArrowRightIcon as ArrowRight,
    ChevronLeftIcon as ChevronLeft,
    ChevronRightIcon as ChevronRight,
    BuildingOfficeIcon as Building2,
    HomeIcon as Home,
    CalendarIcon as Calendar,
    ArrowTrendingDownIcon as TrendingDown,
} from "@heroicons/react/24/outline";
import { getCityBySlug, getAllCitySlugs, CityData, cityData } from "@/data/geo/citySlugData";
import { LocalBusinessSchema, AggregateRatingSchema } from "@/components/seo/SchemaMarkup";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getReviewStats } from "@/lib/firebaseAdmin";

interface CityPageProps {
    city: CityData;
    prevCity: { slug: string; name: string } | null;
    nextCity: { slug: string; name: string } | null;
    currentYear: number;
    reviewStats: { ratingValue: number; reviewCount: number };
}

// Matching text gradients for city names (pairs with hero gradients)
const textGradients = [
    "from-yellow-300 to-orange-300", // Warm contrast for Emerald
    "from-yellow-200 to-amber-300", // Warm contrast for Blue
    "from-yellow-300 to-orange-400", // Warm contrast for Cyan
    "from-pink-300 to-rose-400", // Pink contrast for Violet
    "from-amber-300 to-yellow-400", // Warm contrast for Teal
    "from-yellow-200 to-orange-300", // Warm contrast for Rose
    "from-white to-yellow-100", // Light contrast for Orange
    "from-cyan-300 to-sky-200", // Cool contrast for Indigo
    "from-green-300 to-lime-300", // Added for variety
    "from-purple-300 to-fuchsia-300", // Added for variety
    "from-red-300 to-orange-300", // Added for variety
    "from-blue-300 to-indigo-300", // Added for variety
];

export default function CityPage({ city, prevCity, nextCity, currentYear, reviewStats }: CityPageProps) {
    // Use a hash for text gradient to ensure more variety if heroGradients and textGradients have different lengths
    const textGradientIndex =
        city.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0) * 2, 0) %
        textGradients.length;
    const textGradient = textGradients[textGradientIndex];
    // Check if city has a hero image
    const hasHeroImage = Boolean(city.heroImage);

    return (
        <>
            <Head>
                <title>{"Mutări " + city.name + " " + currentYear + " → Oferte Gratuite"}</title>
                <meta name="description" content={city.metaDescription} />
                <meta
                    name="keywords"
                    content={
                        "mutări " +
                        city.name +
                        ", firme mutări " +
                        city.name +
                        ", transport mobilă " +
                        city.name +
                        ", mutări " +
                        city.county +
                        ", servicii mutare " +
                        city.name
                    }
                />
                <link rel="canonical" href={"https://ofertemutare.ro/mutari/" + city.slug} />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={"https://ofertemutare.ro/mutari/" + city.slug} />
                <meta
                    property="og:title"
                    content={"Mutări " + city.name + " " + currentYear + " | Economisește până la 40%"}
                />
                <meta property="og:description" content={city.metaDescription} />
                <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={"https://ofertemutare.ro/mutari/" + city.slug} />
                <meta
                    name="twitter:title"
                    content={"Mutări " + city.name + " " + currentYear + " | Economisește până la 40%"}
                />
                <meta name="twitter:description" content={city.metaDescription} />
                <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />
            </Head>

            <LocalBusinessSchema city={city.name} serviceName={"Servicii Mutări " + city.name} />
            <LayoutWrapper>
                {/* Hero Section - Image background on desktop, gradient on mobile */}
                <Breadcrumbs
                  items={[
                    { name: "Acasă", href: "/" },
                    { name: "Mutări", href: "/mutari" },
                    { name: city.name },
                  ]}
                />
                {reviewStats.reviewCount > 0 && (
                  <AggregateRatingSchema ratingValue={reviewStats.ratingValue} reviewCount={reviewStats.reviewCount} />
                )}
                <div className="container mx-auto px-4 py-8">
                    <div className="relative max-w-6xl mx-auto">
                        {/* Desktop Navigation Arrows (Outside) */}
                        {prevCity && (
                            <Link
                                href={`/mutari/${prevCity.slug}`}
                                className="hidden xl:flex absolute -left-20 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 text-gray-400 shadow-lg transition-all hover:border-emerald-500 hover:text-emerald-600 hover:shadow-xl"
                                title={`Înapoi la ${prevCity.name}`}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Link>
                        )}
                        {nextCity && (
                            <Link
                                href={`/mutari/${nextCity.slug}`}
                                className="hidden xl:flex absolute -right-20 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 text-gray-400 shadow-lg transition-all hover:border-emerald-500 hover:text-emerald-600 hover:scale-110 hover:shadow-xl"
                                title={`Înainte la ${nextCity.name}`}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Link>
                        )}

                        <section className="group relative overflow-hidden rounded-3xl min-h-[85vh] flex flex-col justify-center px-6 md:px-12 max-w-5xl mx-auto">
                            {/* Background: Hidden on mobile (except for color), visible as image on desktop */}
                            <div
                                className={`absolute inset-0 ${hasHeroImage ? "bg-slate-900" : "bg-linear-to-r from-green-600 to-blue-600"}`}
                                style={{
                                    backgroundImage: hasHeroImage
                                        ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("${city.heroImage}")`
                                        : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            >
                                {/* Mobile overlay to hide the desktop background image but keep the color */}
                                {hasHeroImage && <div className="absolute inset-0 bg-slate-900 lg:hidden" />}
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
                                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
                            </div>

                            {/* Mobile Navigation Arrows (Overlay) - Hidden on XL */}
                            {prevCity && (
                                <Link
                                    href={`/mutari/${prevCity.slug}`}
                                    className="xl:hidden absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/20 p-2 text-white/40 backdrop-blur-sm transition-all hover:bg-emerald-500/80 hover:text-white md:left-6 opacity-60 hover:opacity-100"
                                    title={`Înapoi la ${prevCity.name}`}
                                >
                                    <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
                                </Link>
                            )}
                            {nextCity && (
                                <Link
                                    href={`/mutari/${nextCity.slug}`}
                                    className="xl:hidden absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/20 p-2 text-white/40 backdrop-blur-sm transition-all hover:bg-emerald-500/80 hover:text-white md:right-6 opacity-60 hover:opacity-100"
                                    title={`Înainte la ${nextCity.name}`}
                                >
                                    <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
                                </Link>
                            )}

                            {/* Content */}
                            <div className="relative z-10 mx-auto w-full max-w-4xl px-4 md:px-0">
                                <div className="mb-6 flex items-center justify-center gap-2 pt-6 md:justify-start md:pt-0">
                                    <MapPin className="h-5 w-5 text-white drop-shadow-md" />
                                    <span className="text-sm font-medium text-white drop-shadow-md">
                                        Județul {city.county} • {city.population} locuitori
                                    </span>
                                </div>

                                <h1 className="mb-6 text-center text-2xl font-extrabold text-white drop-shadow-lg md:text-left md:text-5xl lg:text-6xl">
                                    <span className="text-white">Mutări în </span>
                                    <span className="relative inline-block">
                                        <span
                                            className={`bg-linear-to-r ${textGradient} bg-clip-text text-transparent`}
                                        >
                                            {city.name}
                                        </span>
                                        {/* Decorative underline */}
                                        <span
                                            className={`absolute -bottom-2 left-0 h-1 w-full bg-linear-to-r ${textGradient} rounded-full`}
                                            style={{ opacity: 0.6 }}
                                        />
                                    </span>
                                </h1>

                                <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-white md:mx-0 md:text-left md:text-xl">
                                    {city.heroSubtitle}
                                </p>

                                {/* Mobile only: Image card displayed below text */}
                                {hasHeroImage && (
                                    <div className="mb-8 lg:hidden block">
                                        <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                                            <NextImage
                                                src={city.heroImage!}
                                                alt={`${city.name} - ${city.landmarks[0]}`}
                                                width={800}
                                                height={600}
                                                className="w-full h-auto"
                                                priority
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
                                                <p className="text-sm font-semibold text-white">{city.landmarks[0]}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div className="rounded-2xl border border-white/20 bg-transparent p-4 text-center transition-transform hover:scale-105">
                                        <div className="text-3xl font-bold text-white">3-5</div>
                                        <div className="text-sm text-white/90">Oferte în 24h</div>
                                    </div>
                                    <div className="rounded-2xl border border-white/20 bg-transparent p-4 text-center transition-transform hover:scale-105">
                                        <div className="text-3xl font-bold text-white">40%</div>
                                        <div className="text-sm text-white/90">Economie medie</div>
                                    </div>
                                    <div className="rounded-2xl border border-white/20 bg-transparent p-4 text-center transition-transform hover:scale-105">
                                        <div className="text-3xl font-bold text-white">100%</div>
                                        <div className="text-sm text-white/90">Gratuit</div>
                                    </div>
                                    <div className="rounded-2xl border border-white/20 bg-transparent p-4 text-center transition-transform hover:scale-105">
                                        <div className="text-3xl font-bold text-white">✓</div>
                                        <div className="text-sm text-white/90">Firme verificate</div>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col gap-4 sm:flex-row pb-6 md:pb-0">
                                    <Link
                                        href="/customer/auth"
                                        className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-emerald-700 shadow-xl transition-all hover:shadow-2xl sm:w-auto"
                                    >
                                        Cere Oferte Gratuite
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link
                                        href="/faq"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-4 font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
                                    >
                                        Cum funcționează?
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Main Article Content */}
                <article className="mx-auto max-w-4xl px-4 py-16">
                    {/* Intro Section */}
                    <section className="mb-12">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900">
                            Cum găsești cea mai bună firmă de mutări în {city.name}?
                        </h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p>
                                {city.articleIntro ||
                                    `Te pregătești pentru o mutare în ${city.name}? Înțelegem cât de stresant
                  poate fi procesul, de la găsirea firmei potrivite, la negocierea prețurilor și
                  coordonarea logisticii. Cu o populație de ${city.population} de locuitori,
                  ${city.name} este unul dintre cele mai dinamice orașe din România, cu zeci de firme de
                  mutări active în zonă.`}
                            </p>
                            {!city.articleIntro && (
                                <p>
                                    Vestea bună? Pe <strong>OferteMutare.ro</strong> simplifici tot procesul.
                                    Completezi un singur formular în 3 minute și primești 3-5 oferte personalizate de
                                    la firme verificate din {city.county}. Compari prețurile, citești recenziile și
                                    alegi varianta perfectă pentru tine:{" "}
                                    <strong>100% gratuit, fără obligații</strong>.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Neighborhoods Section */}
                    <section className="mb-12 rounded-2xl bg-linear-to-r from-slate-50 to-gray-50 p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <Building2 className="h-7 w-7 text-emerald-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                Mutări în toate cartierele din {city.name}
                            </h2>
                        </div>
                        <p className="mb-6 text-gray-700">
                            Indiferent dacă te muți din sau în cartierele{" "}
                            {city.neighborhoods.slice(0, 3).join(", ")} sau alte zone ale orașului, firmele
                            noastre partenere cunosc perfect {city.name}-ul. Beneficiezi de:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {city.neighborhoods.map((neighborhood) => (
                                <span
                                    key={neighborhood}
                                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
                                >
                                    {neighborhood}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Services Grid */}
                    <section className="mb-12">
                        <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <Package className="h-7 w-7 text-emerald-600" />
                            Servicii de mutări disponibile în {city.name}
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                                <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-3">
                                    <Home className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-gray-900">Mutări Apartamente</h3>
                                <p className="text-gray-600">
                                    De la garsoniere la apartamente cu 4+ camere. Echipe experimentate pentru blocuri
                                    cu sau fără lift în {city.name}.
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-gray-900">Mutări Case</h3>
                                <p className="text-gray-600">
                                    Mutări complete pentru case și vile. Transport mobilier voluminos, obiecte
                                    delicate și grădină.
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                                <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
                                    <Truck className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-gray-900">Mutări Birouri</h3>
                                <p className="text-gray-600">
                                    Relocare firme și birouri în {city.name}. Mutări în weekend pentru zero downtime.
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                                <div className="mb-4 inline-flex rounded-lg bg-orange-100 p-3">
                                    <Package className="h-6 w-6 text-orange-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-gray-900">Împachetare & Depozitare</h3>
                                <p className="text-gray-600">
                                    Servicii complete: materiale de ambalare, împachetare profesională și depozitare
                                    temporară sau pe termen lung.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Info */}
                    <section className="mb-12 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 p-8">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <TrendingDown className="h-7 w-7 text-emerald-600" />
                            Prețuri mutări {city.name} în {currentYear}
                        </h2>
                        <div className="prose max-w-none text-gray-700">
                            <p>
                                {city.priceContext ||
                                    `Prețurile pentru servicii de mutări în ${city.name} variază în funcție de mai mulți factori:
                  volumul bunurilor, distanța, etajul și serviciile suplimentare (împachetare, demontare
                  mobilier). Orientativ, pentru o mutare standard în ${city.name}:`}
                            </p>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl bg-white p-5 text-center shadow-sm">
                                <div className="mb-1 text-sm text-gray-500">Garsonieră/Studio</div>
                                <div className="text-2xl font-bold text-emerald-600">400-800 lei</div>
                            </div>
                            <div className="rounded-xl bg-white p-5 text-center shadow-sm">
                                <div className="mb-1 text-sm text-gray-500">Apartament 2-3 camere</div>
                                <div className="text-2xl font-bold text-emerald-600">800-1.800 lei</div>
                            </div>
                            <div className="rounded-xl bg-white p-5 text-center shadow-sm">
                                <div className="mb-1 text-sm text-gray-500">Casă/Vilă</div>
                                <div className="text-2xl font-bold text-emerald-600">2.000-5.000 lei</div>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-gray-600">
                            💡 <strong>Sfat:</strong> Compară minimum 3 oferte pentru a găsi cel mai bun raport
                            calitate-preț. Diferențele pot fi de până la 40%!
                        </p>
                    </section>

                    {/* Why Choose Us */}
                    <section className="mb-12">
                        <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <Shield className="h-7 w-7 text-emerald-600" />
                            De ce să alegi OferteMutare.ro pentru mutări în {city.name}?
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {city.whyChooseUs && city.whyChooseUs.length > 0 ? (
                                city.whyChooseUs.map((reason, index) => (
                                    <div key={index} className="flex gap-4">
                                        <CheckCircle className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />
                                        <div>
                                            <h3 className="font-bold text-gray-900">{reason.split(":")[0]}</h3>
                                            <p className="text-gray-600">{reason.split(":").slice(1).join(":").trim()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="flex gap-4">
                                        <CheckCircle className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />
                                        <div>
                                            <h3 className="font-bold text-gray-900">Firme verificate local</h3>
                                            <p className="text-gray-600">
                                                Toate firmele partenere sunt verificate și au experiență dovedită în{" "}
                                                {city.name}
                                                și județul {city.county}.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <CheckCircle className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />
                                        <div>
                                            <h3 className="font-bold text-gray-900">Oferte rapide în 24h</h3>
                                            <p className="text-gray-600">
                                                Primești 3-5 oferte personalizate direct de la firme din {city.name}, fără
                                                să suni sau negociezi.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <CheckCircle className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />
                                        <div>
                                            <h3 className="font-bold text-gray-900">100% gratuit și transparent</h3>
                                            <p className="text-gray-600">
                                                Serviciul nostru este complet gratuit. Nu există costuri ascunse sau
                                                obligații.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <CheckCircle className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />
                                        <div>
                                            <h3 className="font-bold text-gray-900">Recenzii reale</h3>
                                            <p className="text-gray-600">
                                                Citești recenzii verificate de la clienți reali din {city.name} care au
                                                folosit aceste firme.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Local Tips */}
                    <section className="mb-12 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 p-8">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <Calendar className="h-7 w-7 text-amber-600" />
                            Sfaturi pentru mutări în {city.name}
                        </h2>
                        <ul className="space-y-4 text-gray-700">
                            {city.localTips && city.localTips.length > 0 ? (
                                city.localTips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Star className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: tip.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                                            }}
                                        />
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li className="flex items-start gap-3">
                                        <Star className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                                        <span>
                                            <strong>Rezervă din timp:</strong> În {city.name}, firmele bune se ocupă
                                            repede, mai ales în perioadele de vârf (mai-septembrie, sfârșitul de lună).
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Star className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                                        <span>
                                            <strong>Verifică accesul:</strong> Asigură-te că firma știe exact condițiile
                                            de acces la ambele locații (lift, scări, parcare pentru camion).
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Star className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                                        <span>
                                            <strong>Declară obiectele valoroase:</strong> Informează firma despre obiecte
                                            fragile sau de valoare pentru transport în siguranță.
                                        </span>
                                    </li>
                                    {city.landmarks.length > 0 && (
                                        <li className="flex items-start gap-3">
                                            <Star className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                                            <span>
                                                <strong>Orientare locală:</strong> Firmele cunosc bine zonele din jurul{" "}
                                                {city.landmarks[0]} și alte repere importante din {city.name}.
                                            </span>
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>
                    </section>

                    {/* Final CTA */}
                    <section className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 p-8 text-center text-white">
                        <h2 className="mb-4 text-3xl font-bold">Gata să te muți în {city.name}?</h2>
                        <p className="mb-8 text-lg text-emerald-100">
                            Primește 3-5 oferte gratuite în 24h și economisește până la 40% la mutarea ta.
                        </p>
                        <Link
                            href="/customer/auth"
                            className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-emerald-700 shadow-xl transition-all hover:bg-emerald-50 hover:shadow-2xl"
                        >
                            Cere Oferte Gratuite Acum
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </section>
                </article>

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            name: `OferteMutare.ro - Mutări ${city.name}`,
                            description: city.metaDescription,
                            url: `https://ofertemutare.ro/mutari/${city.slug}`,
                            image: "https://ofertemutare.ro/pics/index.webp",
                            address: {
                                "@type": "PostalAddress",
                                addressLocality: city.name,
                                addressRegion: city.county,
                                addressCountry: "RO",
                            },
                            areaServed: {
                                "@type": "City",
                                name: city.name,
                                containedIn: {
                                    "@type": "AdministrativeArea",
                                    name: city.county,
                                },
                            },
                            geo: {
                                "@type": "GeoCoordinates",
                                // Coordinates would ideally come from city data, defaulting to center of RO for generic
                                latitude: "46.0",
                                longitude: "25.0",
                            },
                            openingHoursSpecification: [
                                {
                                    "@type": "OpeningHoursSpecification",
                                    dayOfWeek: [
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                        "Sunday",
                                    ],
                                    opens: "08:00",
                                    closes: "22:00",
                                },
                            ],
                            serviceType: "Moving Services",
                            priceRange: "250 RON - 3000 RON",
                        }),
                    }}
                />
            </LayoutWrapper>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllCitySlugs().map((slug) => ({
        params: { from: slug },
    }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<CityPageProps> = async ({ params }) => {
    const slug = params?.from as string;
    const city = getCityBySlug(slug);

    if (!city) {
        return { notFound: true };
    }

    // Find previous and next cities for navigation
    const currentIndex = cityData.findIndex((c) => c.slug === slug);
    // Ensure strict non-negative modulo result
    const prevIndex = (currentIndex - 1 + cityData.length) % cityData.length;
    const nextIndex = (currentIndex + 1) % cityData.length;

    const prevCity = { slug: cityData[prevIndex].slug, name: cityData[prevIndex].name };
    const nextCity = { slug: cityData[nextIndex].slug, name: cityData[nextIndex].name };

    return {
        props: { city, prevCity, nextCity, currentYear: new Date().getFullYear(), reviewStats: await getReviewStats() },
        revalidate: 3600,
    };
};
