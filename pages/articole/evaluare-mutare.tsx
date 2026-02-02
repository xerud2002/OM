import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import ArticleMetadata from "@/components/content/ArticleMetadata";
import TableOfContents from "@/components/content/TableOfContents";
import { VideoCameraIcon as Video, HomeIcon as Home, BoltIcon as Zap, ShieldCheckIcon as Shield, CheckCircleIcon as CheckCircle, XCircleIcon as XCircle, ExclamationCircleIcon as AlertCircle, CameraIcon as Camera, PhoneIcon as Phone, DocumentTextIcon as FileText } from "@heroicons/react/24/outline";

export default function ArticleSurvey() {
  return (
    <>
      <Head>
        <title>Survey Mutări: Fizic vs. Video vs. Estimare | OferteMutare.ro</title>
        <meta
          name="description"
          content="Cele 3 tipuri de survey la mutări: vizită fizică, survey video și estimare rapidă. Află care se potrivește și cum obții cel mai bun preț."
        />
        <meta
          name="keywords"
          content="survey mutări, vizită fizică mutare, survey video, estimare ofertă mutare, evaluare volume, preț exact mutare, cum se face survey, mutare online"
        />
        <meta property="og:title" content="Tipuri de Survey Pentru Mutări: Ghid Complet 2025" />
        <meta
          property="og:description"
          content="Compară cele 3 tipuri de survey la mutări și alege cel mai potrivit pentru tine: vizită fizică, video call sau estimare rapidă."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://ofertemutare.ro/articole/evaluare-mutare" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/articole/evaluare-mutare" />
        <meta name="twitter:title" content="Tipuri de Survey Pentru Mutări: Ghid Complet 2025" />
        <meta
          name="twitter:description"
          content="Compară cele 3 tipuri de survey la mutări și alege cel mai potrivit pentru tine."
        />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />
        <link rel="canonical" href="https://ofertemutare.ro/articole/evaluare-mutare" />
      </Head>

      
      <ArticleSchema
        title="Survey Mutări: Fizic vs. Video vs. Estimare"
        description="Cele 3 tipuri de survey la mutări: vizită fizică, survey video și estimare rapidă. Află care se potrivește și cum obții cel mai bun preț."
        datePublished="2026-02-02"
        image="https://ofertemutare.ro/pics/index.webp"
      />
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "/" },
          { name: "Articole", url: "/articole" },
          { name: "Survey Mutări: Fizic vs. Video vs. Estimare" },
        ]}
      />
      <LayoutWrapper>
        <article className="mx-auto max-w-4xl px-4 py-12">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Tipuri de Survey Pentru Mutări:{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ce Să Alegi?
              </span>
            </h1>
            <ArticleMetadata />
            <TableOfContents items={[
              { id: "2-survey-video-virtual-survey", text: "2. Survey Video (Virtual Survey)" },
              { id: "primete-3-5-oferte-cu-survey-gratuit", text: "Primește 3-5 Oferte Cu Survey Gratuit" } 
            ]} />
            <div className="mb-6 overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/pics/blog/video-survey-v2.webp"
                alt="Survey Mutare Video vs Fizic"
                width={1200}
                height={675}
                className="h-auto w-full"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
              />
            </div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Un survey corect = preț exact = zero surprize în ziua mutării. Descoperă cele 3 metode
              principale și când să le folosești.
            </p>
          </header>

          {/* Why Survey Matters */}
          <section className="mb-12 rounded-lg bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <Shield className="mt-1 h-8 w-8 shrink-0 text-blue-600" />
              <div>
                <h2 className="mb-2 text-xl font-semibold text-blue-800">
                  De ce este important survey-ul?
                </h2>
                <p className="mb-3 text-gray-700">
                  Survey-ul (evaluarea preliminară) este procesul prin care firma de mutări{" "}
                  <strong>evaluează volumul, complexitatea și necesarul de resurse</strong> pentru
                  mutarea ta. Fără survey, oferta este estimativă și poate crește semnificativ în
                  ziua mutării.
                </p>
                <div className="rounded-lg bg-white p-4">
                  <p className="text-sm font-semibold text-gray-800">Statistici importante:</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>
                      • 68% din reclamațiile la mutări provin din <strong>diferențe de preț</strong>{" "}
                      față de oferta inițială
                    </li>
                    <li>
                      • Mutările cu survey detaliat au <strong>95% acuratețe de preț</strong>, vs.
                      60% fără survey
                    </li>
                    <li>
                      • Estimările &ldquo;la telefon&rdquo; diferă în medie cu{" "}
                      <strong>30-50%</strong> de prețul final
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">
              Comparație: Cele 3 Tipuri de Survey
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse overflow-x-auto rounded-lg border border-gray-200">
                <thead className="bg-emerald-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Tip Survey</th>
                    <th className="px-4 py-3 text-left">Durată</th>
                    <th className="px-4 py-3 text-left">Precizie</th>
                    <th className="px-4 py-3 text-left">Cost</th>
                    <th className="px-4 py-3 text-left">Ideal Pentru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-emerald-600" />
                        Vizită Fizică
                      </div>
                    </td>
                    <td className="px-4 py-3">30-60 min</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        95-98%
                      </span>
                    </td>
                    <td className="px-4 py-3">Gratuit*</td>
                    <td className="px-4 py-3 text-sm">
                      Mutări complexe, obiecte valoroase, case &gt;3 camere
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-blue-600" />
                        Survey Video
                      </div>
                    </td>
                    <td className="px-4 py-3">15-30 min</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                        85-90%
                      </span>
                    </td>
                    <td className="px-4 py-3">Gratuit</td>
                    <td className="px-4 py-3 text-sm">
                      Apartamente standard, mutări urgente, program flexibil
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-600" />
                        Estimare Rapidă
                      </div>
                    </td>
                    <td className="px-4 py-3">5-10 min</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                        70-80%
                      </span>
                    </td>
                    <td className="px-4 py-3">Gratuit</td>
                    <td className="px-4 py-3 text-sm">
                      Mutări mici (garsoniere), puține obiecte, buget informativ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              * Vizita fizică este gratuită pentru majoritatea firmelor, dar unele pot percepe taxă
              rambursabilă (50-100 lei) la semnarea contractului.
            </p>
          </section>

          {/* Type 1: Physical Visit */}
          <section className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <Home className="h-8 w-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-800">
                1. Vizita Fizică (In-Person Survey)
              </h2>
            </div>

            <div className="mb-6 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-emerald-800">Cum funcționează?</h3>
              <p className="mb-4 text-gray-700">
                Un reprezentant al firmei de mutări vine la tine acasă și{" "}
                <strong>evaluează direct</strong> volumul bunurilor, accesul (lift, scări, etaj),
                gradul de dificultate și necesarul de resurse (echipă, vehicul, echipamente).
              </p>
              <div className="rounded-lg bg-white p-4">
                <p className="mb-2 font-semibold text-gray-800">Ce verifică surveyorul:</p>
                <ul className="grid gap-2 md:grid-cols-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Număr și dimensiuni mobilier
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Acces (lift, lățime scări, intrare)
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Obiecte fragile/valoroase
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Necesarul de demontare
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Distanța parcării de intrare
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Necesarul de ambalaje speciale
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Advantages */}
              <div className="rounded-lg border border-green-200 bg-white p-6">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  Avantaje
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>
                      <strong>Precizie maximă</strong> (95-98% acuratețe finală)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Identifică potențiale probleme (mobilier mare, acces dificil)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Recomandări personalizate pentru împachetare</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Poți pune întrebări direct și primi sfaturi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Ofertă scrisă, detaliată, cu inventar complet</span>
                  </li>
                </ul>
              </div>

              {/* Disadvantages */}
              <div className="rounded-lg border border-red-200 bg-white p-6">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-700">
                  <XCircle className="h-6 w-6" />
                  Dezavantaje
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Necesită programare (așteptare 1-3 zile)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Trebuie să fii acasă (30-60 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Unele firme percep taxă rambursabilă</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Mai puțin convenabil pentru program încărcat</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="font-semibold text-blue-800">💡 Ideal pentru tine dacă:</p>
              <ul className="mt-2 space-y-1 text-gray-700">
                <li>• Ai &gt;3 camere sau mutare complexă (casă, vilă)</li>
                <li>• Ai obiecte valoroase (pian, tablouri, antichități, electronice scumpe)</li>
                <li>• Ai mobilier foarte mare sau acces dificil (etaj 5 fără lift)</li>
                <li>• Vrei preț final garantat 100% (fără surprize)</li>
              </ul>
            </div>
          </section>

          {/* Type 2: Video Survey */}
          <section className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <Video className="h-8 w-8 text-blue-600" />
              <h2 id="2-survey-video-virtual-survey" className="text-3xl font-bold text-gray-800">2. Survey Video (Virtual Survey)</h2>
            </div>

            <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-800">Cum funcționează?</h3>
              <p className="mb-4 text-gray-700">
                Te conectezi cu un reprezentant al firmei printr-un apel video (WhatsApp, Zoom,
                Google Meet) și <strong>filmezi în direct</strong> fiecare cameră, mobilierul și
                accesul. Surveyorul îți dă instrucțiuni în timp real despre ce să arăți.
              </p>
              <div className="rounded-lg bg-white p-4">
                <p className="mb-2 font-semibold text-gray-800">
                  Pașii tipici pentru survey video:
                </p>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">1.</span>
                    Programezi apelul video (de obicei în aceeași zi sau în max 24h)
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">2.</span>
                    Primeștilinkul pentru call (WhatsApp video sau platformă dedicată)
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">3.</span>
                    Filmezi fiecare cameră, dulapuri deschise, acces (scări, lift)
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">4.</span>
                    Surveyorul face notițe și îți comunică oferta în 1-2 ore
                  </li>
                </ol>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Advantages */}
              <div className="rounded-lg border border-green-200 bg-white p-6">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  Avantaje
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>
                      <strong>Rapid</strong> &ndash; ofertă în aceeași zi sau în 24h
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Flexibil &ndash; faci apelul când vrei (seară, weekend)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>100% gratuit, fără costuri ascunse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Precizie bună (85-90%) pentru apartamente standard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Poți arăta detalii pe care le-ai uita la telefon</span>
                  </li>
                </ul>
              </div>

              {/* Disadvantages */}
              <div className="rounded-lg border border-red-200 bg-white p-6">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-700">
                  <XCircle className="h-6 w-6" />
                  Dezavantaje
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Precizie mai mică decât vizita fizică (riscul de a rata detalii)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Necesită conexiune bună la internet + smartphone decent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Greu de evaluat accesul (lățime uși, înălțime lift)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Nu prea funcționează pentru mutări foarte complexe</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="font-semibold text-blue-800">💡 Ideal pentru tine dacă:</p>
              <ul className="mt-2 space-y-1 text-gray-700">
                <li>• Ai apartament standard (1-3 camere, cu lift)</li>
                <li>• Vrei ofertă rapidă (nu poți aștepta vizita fizică)</li>
                <li>• Ai program încărcat și nu poți fi acasă pentru vizită</li>
                <li>• Mutarea ta nu e foarte complexă (fără pian, obiecte fragile premium)</li>
              </ul>
            </div>

            <div className="mt-6 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 shrink-0 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-800">
                    Sfat important pentru survey video:
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    Deschide TOATE dulapurile, debara, balconul &ndash; arată tot ce trebuie mutat.
                    Subestimarea volumului e principala cauză de diferențe de preț!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Type 3: Quick Estimate */}
          <section className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <Zap className="h-8 w-8 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-800">
                3. Estimarea Rapidă (Quick Estimate)
              </h2>
            </div>

            <div className="mb-6 rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-orange-800">Cum funcționează?</h3>
              <p className="mb-4 text-gray-700">
                Completezi un formular online sau vorbești la telefon cu firma și descrii{" "}
                <strong>pe scurt</strong> ce trebuie mutat: număr camere, lista mobilierului
                principal, etaj, distanța. Firma îți dă o ofertă estimativă pe baza experienței.
              </p>
              <div className="rounded-lg bg-white p-4">
                <p className="mb-2 font-semibold text-gray-800">
                  Informații necesare pentru estimare:
                </p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Suprafața/numărul de camere (ex: 2 camere, 60 mp)</li>
                  <li>• Lista mobilierului mare (pat, canapea, dulap, masă, etc.)</li>
                  <li>• Etaj + există lift? (la ambele locații)</li>
                  <li>• Distanța între cele două adrese</li>
                  <li>• Servicii extra (demontare, ambalare, depozitare)</li>
                </ul>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Advantages */}
              <div className="rounded-lg border border-green-200 bg-white p-6">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  Avantaje
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>
                      <strong>Ultra-rapid</strong> &ndash; ofertă în 10-30 minute
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Zero efort &ndash; doar completezi un formular</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Perfect pentru a compara rapid mai multe firme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Util pentru bugetare inițială</span>
                  </li>
                </ul>
              </div>

              {/* Disadvantages */}
              <div className="rounded-lg border border-red-200 bg-white p-6">
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-700">
                  <XCircle className="h-6 w-6" />
                  Dezavantaje
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>
                      <strong>Precizie scăzută</strong> (70-80%) &ndash; risc mare de diferență de
                      preț
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Bazată pe descrierea ta (poți uita lucruri importante)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Prețul final poate crește cu 30-50% în ziua mutării</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Nu identifică probleme de acces sau complexitate</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-orange-50 p-4">
              <p className="font-semibold text-orange-800">💡 Ideal pentru tine dacă:</p>
              <ul className="mt-2 space-y-1 text-gray-700">
                <li>• Ai mutare foarte mică (garsonieră, cameră de student)</li>
                <li>• Vrei doar o idee aproximativă de buget</li>
                <li>• Urmează să faci survey detaliat, dar vrei o estimare inițială</li>
                <li>• Mutarea e foarte urgentă și nu ai timp de survey video/fizic</li>
              </ul>
            </div>

            <div className="mt-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">⚠️ ATENȚIE:</p>
                  <p className="mt-1 text-sm text-gray-700">
                    Estimarea rapidă NU este un contract final. Multe firme îți pot majora prețul cu
                    30-50% în ziua mutării dacă volumul e mai mare decât ai descris. Pentru
                    siguranță, cere ÎNTOTDEAUNA un survey video sau fizic după estimarea inițială.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Prepare for Survey */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">
              Cum Te Pregătești Pentru Survey?
            </h2>

            <div className="space-y-6">
              <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-emerald-800">
                  <Camera className="h-6 w-6" />
                  Înainte de Survey (Fizic sau Video)
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>
                      <strong>Sortează și aruncă lucrurile</strong> pe care nu le mai vrei &ndash;
                      cu cât mai puține obiecte, cu atât mai ieftin.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>
                      <strong>Grupează obiectele similare</strong> într-o cameră pentru evaluare mai
                      ușoară (ex: toate cărțile, toate hainele).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>
                      <strong>Măsoară mobilierul mare</strong> și verifica dimensiunile
                      ușilor/liftului la noua locuință.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>
                      <strong>Fă o listă cu obiecte fragile</strong> (tablouri, oglinzi,
                      electronice) &ndash; surveyorul trebuie să știe.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>
                      <strong>Verifică accesul</strong>: este nevoie de autorizație pentru
                      parcare/intrare mașină mare?
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-blue-800">
                  <FileText className="h-6 w-6" />
                  În Timpul Survey-ului
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <span>
                      <strong>Fii sincer despre volume</strong> &ndash; arată TOT ce trebuie mutat,
                      inclusiv debara, balconul, podul.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <span>
                      <strong>Pune întrebări</strong>: despre asigurare, ambalare, servicii extra,
                      termene de plată.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <span>
                      <strong>Cere clarificări</strong> despre costuri adiționale (taxe parcare,
                      etaje fără lift, transport la gunoi).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <span>
                      <strong>Solicită ofertă scrisă</strong> cu inventar complet și prețul final
                      garantat.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-purple-800">
                  <Phone className="h-6 w-6" />
                  După Survey
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-purple-600" />
                    <span>
                      <strong>Compară cel puțin 3 oferte</strong> &ndash; pe OferteMutare.ro le
                      primești gratuit în 24h.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-purple-600" />
                    <span>
                      <strong>Verifică ce include prețul</strong>: transport, asigurare, echipă,
                      demontare, ambalaje?
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-purple-600" />
                    <span>
                      <strong>Citește recenziile firmei</strong> &ndash; prețul cel mai mic nu
                      înseamnă întotdeauna cea mai bună alegere.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-purple-600" />
                    <span>
                      <strong>Semnează contract clar</strong> cu prețul final, data, și
                      responsabilități.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common Questions */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">
              Întrebări Frecvente Despre Survey
            </h2>
            <div className="space-y-4">
              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  Survey-ul este obligatoriu sau pot cere doar estimare?
                </summary>
                <p className="mt-3 text-gray-700">
                  Nu e obligatoriu, dar <strong>foarte recomandat</strong>. Fără survey, prețul
                  poate crește cu 30-50% în ziua mutării. Pentru mutări &gt;2 camere sau obiecte
                  valoroase, survey-ul e esențial.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  Cât de mult se poate schimba prețul după survey față de estimarea inițială?
                </summary>
                <p className="mt-3 text-gray-700">
                  După un survey bine făcut (fizic sau video), prețul final ar trebui să fie{" "}
                  <strong>identic sau +/-5%</strong>. Dacă diferă cu &gt;10%, cere explicații sau
                  schimbă firma.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  Pot face survey video chiar dacă firma oferă și vizită fizică?
                </summary>
                <p className="mt-3 text-gray-700">
                  Da! De fapt, multe firme preferă survey video pentru eficiență. E rapid, gratuit,
                  și suficient de precis pentru majoritatea mutărilor standard.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  Ce fac dacă volumul crește între survey și ziua mutării?
                </summary>
                <p className="mt-3 text-gray-700">
                  <strong>Anunță firma IMEDIAT</strong>. Multe firme permit ajustări până cu 48h
                  înainte. În ziua mutării, costuri extra pot fi semnificative (până la +50% din
                  preț).
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  Firma a refuzat să facă survey. Este normal?
                </summary>
                <p className="mt-3 text-gray-700">
                  <strong>RED FLAG!</strong> Firmele serioase oferă întotdeauna măcar survey video
                  gratuit. Dacă refuză, probabil vor să-ți majoreze prețul în ziua mutării.{" "}
                  <strong>Evită-le!</strong>
                </p>
              </details>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-center text-white">
            <h2 id="primete-3-5-oferte-cu-survey-gratuit" className="mb-4 text-3xl font-bold">Primește 3-5 Oferte Cu Survey Gratuit</h2>
            <p className="mb-6 text-lg">
              Completează un singur formular și primește oferte personalizate de la cele mai bune
              firme de mutări. Survey video sau fizic inclus, fără costuri!
            </p>
            <Link
              href="/#request-form"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-emerald-600 transition-transform hover:scale-105 hover:shadow-lg"
            >
              <Home className="h-5 w-5" />
              Solicită Oferte Gratuite Acum
            </Link>
            <p className="mt-4 text-sm opacity-90">
              ⏱️ Răspuns în max 24h • 100% gratuit • Fără obligație de cumpărare
            </p>
          </section>

          {/* Related Articles */}
          <section>
            <h3 className="mb-4 text-2xl font-bold text-gray-800">Citește și:</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/articole/pregatire"
                className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
              >
                <h4 className="mb-2 font-semibold text-emerald-700">Pregătirea Mutării</h4>
                <p className="text-sm text-gray-600">Planificare în 8 săptămâni, pas cu pas</p>
              </Link>
              <Link
                href="/articole/impachetare"
                className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
              >
                <h4 className="mb-2 font-semibold text-emerald-700">Ghid Împachetare</h4>
                <p className="text-sm text-gray-600">Tehnici profesionale pentru ambalare</p>
              </Link>
              <Link
                href="/articole/sfaturi-mutari"
                className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
              >
                <h4 className="mb-2 font-semibold text-emerald-700">Sfaturi Generale</h4>
                <p className="text-sm text-gray-600">Trucuri și best practices</p>
              </Link>
            </div>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}
