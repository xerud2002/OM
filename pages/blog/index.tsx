import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import {
  ClockIcon as Clock,
  CalendarIcon as Calendar,
  ArrowRightIcon as ArrowRight,
  BookOpenIcon as BookOpen,
} from "@heroicons/react/24/outline";

const blogPosts = [
  {
    slug: "schimbare-adresa-documente",
    title: "Ghid Acte Schimbare Adresă 2026",
    excerpt: "Lista completă de documente pentru schimbarea buletinului, rolului fiscal și contractelor de utilități. Nu rata termenul legal de 15 zile!",
    category: "Ghid Birocrație",
    readTime: "5 min",
    date: "22 Ian 2026",
    image: "/pics/blog/guide-banner-v2.webp",
    gradient: "linear-gradient(to right, #f59e0b, #d97706)",
    link: "/articole/schimbare-adresa-documente",
  },
  {
    slug: "cele-mai-bune-cartiere-bucuresti",
    title: "Top 10 Cartiere București pentru Relocare 2026",
    excerpt: "Analiză detaliată a celor mai bune zone de locuit: Aviației, Titan, Drumul Taberei. Prețuri chirii, avantaje și dezavantaje pentru fiecare.",
    category: "Ghid Oraș",
    readTime: "6 min",
    date: "20 Ian 2026",
    image: "/pics/blog/bucharest-neighborhoods-map.webp",
    gradient: "linear-gradient(to right, #10b981, #059669)",
    link: "/articole/cele-mai-bune-cartiere-bucuresti",
  },
  {
    slug: "mutare-cluj-napoca",
    title: "Ghid Mutare în Cluj-Napoca 2026",
    excerpt: "Ghid complet pentru studenți și IT-iști. Tot ce trebuie să știi despre viața în 'Silicon Valley' de România, prețuri și relief.",
    category: "Ghid Oraș",
    readTime: "7 min",
    date: "18 Ian 2026",
    image: "/pics/blog/cluj-guide-2026.webp",
    gradient: "linear-gradient(to right, #2563eb, #60a5fa)",
    link: "/articole/mutare-cluj-napoca",
  },
  {
    slug: "mutare-bucuresti-complet",
    title: "Ghid Complet Mutare în București 2026",
    excerpt: "Cartiere, prețuri și sfaturi practice pentru o mutare fără stres în Capitală. Tot ce trebuie să știi despre logistică, parcare și zone.",
    category: "Ghid Oraș",
    readTime: "8 min",
    date: "16 Ian 2026",
    image: "/pics/blog/bucharest-guide-2026.webp",
    gradient: "linear-gradient(to right, #2563eb, #3b82f6)",
    link: "/articole/mutare-bucuresti-complet",
  },
  {
    slug: "cat-costa-mutarea-2026",
    title: "Cât costă o mutare în România 2026 | Prețuri Reale",
    excerpt:
      "Analiză completă a costurilor pentru mutări locale și naționale. Vezi prețurile medii pentru garsoniere, apartamente și case, plus taxele ascunse de evitat.",
    category: "Costuri & Buget",
    readTime: "6 min",
    date: "14 Ian 2026",
    image: "/pics/blog/moving-cost-2026.webp",
    gradient: "linear-gradient(to right, #059669, #34d399)",
  },
  {
    slug: "impachetare",
    title: "Top 5 trucuri pentru împachetarea obiectelor fragile",
    excerpt:
      "Află cum să eviți deteriorarea obiectelor tale preferate prin tehnici folosite de profesioniști. De la pahare la electronice, totul despre protecție.",
    category: "Împachetare",
    readTime: "5 min",
    date: "12 Ian 2026",
    image: "/pics/blog/packing-fragile.webp",
    gradient: "linear-gradient(to right, #3b82f6, #4f46e5)",
  },
  {
    slug: "pregatire",
    title: "Cum îți pregătești locuința pentru ziua mutării",
    excerpt:
      "De la etichetarea cutiilor până la protejarea podelelor, iată cum să ai o zi de mutare organizată și fără surprize neplăcute.",
    category: "Pregătire",
    readTime: "7 min",
    date: "10 Ian 2026",
    image: "/pics/blog/moving-prep.webp",
    gradient: "linear-gradient(to right, #10b981, #0d9488)",
  },
  {
    slug: "evaluare-mutare",
    title: "De ce o vizită virtuală te ajută să primești oferta corectă",
    excerpt:
      "Un video call rapid îți oferă o evaluare precisă și te ajută să economisești timp și bani. Află cum funcționează.",
    category: "Sfaturi",
    readTime: "4 min",
    date: "08 Ian 2026",
    image: "/pics/blog/video-survey-v2.webp",
    gradient: "linear-gradient(to right, #a855f7, #ec4899)",
  },
  {
    slug: "sfaturi-mutari",
    title: "50+ Sfaturi Expert Pentru Mutări în România",
    excerpt:
      "Ghid complet cu trucuri și sfaturi de la profesioniști: economisește până la 40% la mutare, alege perioada potrivită și evită greșelile comune.",
    category: "Ghid Complet",
    readTime: "15 min",
    date: "06 Ian 2026",
    image: "/pics/blog/guide-banner-v2.webp",
    gradient: "linear-gradient(to right, #f97316, #ef4444)",
    featured: true,
  },
];

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <>
      <Head>
        <title>Blog | Sfaturi și Ghiduri pentru Mutări | OferteMutare.ro</title>
        <meta
          name="description"
          content="Articole utile, sfaturi practice și ghiduri complete pentru o mutare reușită. Trucuri de la profesioniști pentru a economisi timp și bani."
        />
        <meta
          name="keywords"
          content="blog mutări, sfaturi mutare, ghid mutare, trucuri împachetare, cum să te muți, economii mutare"
        />
        <link rel="canonical" href="https://ofertemutare.ro/blog" />
        <meta property="og:title" content="Blog | Sfaturi pentru Mutări" />
        <meta
          property="og:description"
          content="Articole utile și ghiduri practice pentru o mutare reușită în România."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofertemutare.ro/blog" />
      </Head>

      <LayoutWrapper>
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/4 top-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-emerald-100/40 blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] translate-y-1/2 rounded-full bg-sky-100/40 blur-[100px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Blog</span>
                </div>
                <h1 className="mb-5 text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  Sfaturi pentru o{" "}
                  <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                    mutare reușită
                  </span>
                </h1>
                <p className="text-lg text-slate-600">
                  Articole utile și ghiduri practice care te ajută să te pregătești pentru ziua
                  mutării. Sfaturi de la profesioniști cu experiență.
                </p>
              </div>
            </div>
          </section>

          {/* Featured Post */}
          {featuredPost && (
            <section className="container mx-auto px-4 pb-12">
              <Link
                href={featuredPost.link || `/articles/${featuredPost.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-xl transition-all hover:shadow-2xl sm:rounded-3xl">
                  <div className="grid gap-0 lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden bg-slate-50 p-6 lg:h-auto lg:min-h-[400px]">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      {/* Badge overlay */}
                      <div className="absolute left-6 top-6 z-10">
                        <span className="inline-block rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-sm sm:text-sm">
                          ⭐ Articol Recomandat
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                          style={{ background: featuredPost.gradient }}
                        >
                          {featuredPost.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {featuredPost.readTime}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {featuredPost.date}
                        </span>
                      </div>

                      <h2 className="mb-3 text-2xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600 sm:text-3xl">
                        {featuredPost.title}
                      </h2>

                      <p className="mb-6 text-slate-600">{featuredPost.excerpt}</p>

                      <div className="flex items-center gap-2 font-semibold text-emerald-600 transition-all group-hover:gap-3">
                        Citește articolul
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Blog Posts Grid */}
          <section className="container mx-auto px-4 pb-20">
            <h2 className="mb-8 text-2xl font-bold text-slate-900">Toate articolele</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post, idx) => {
                const href = post.link ? post.link : `/articles/${post.slug}`;
                return (
                  <Link key={idx} href={href} className="group block">
                    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/50 bg-white shadow-lg transition-all hover:border-emerald-200 hover:shadow-xl sm:rounded-2xl">
                      {/* Top gradient bar */}
                      <div className="h-1 w-full" style={{ background: post.gradient }} />

                      {/* Image Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden bg-white">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                          priority={idx < 3}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        {/* Meta */}
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                            style={{ background: post.gradient }}
                          >
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
                          {post.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2">
                            Citește
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 pb-20">
            <div className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 p-8 text-center text-white sm:rounded-3xl sm:p-12">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Pregătit pentru mutare?</h2>
              <p className="mx-auto mb-6 max-w-xl opacity-90">
                Completează formularul și primește oferte personalizate de la firme locale. 100%
                gratuit, fără obligații.
              </p>
              <Link
                href="/#request-form"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-emerald-600 transition-all hover:bg-emerald-50 hover:shadow-lg"
              >
                Cere oferte gratuite
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </LayoutWrapper>
    </>
  );
}

