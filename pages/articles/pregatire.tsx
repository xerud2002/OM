import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import { CalendarIcon as Calendar, CheckCircleIcon as CheckCircle, ClockIcon as Clock, HomeIcon as Home, CubeIcon as Package, TruckIcon as Truck, UsersIcon as Users, ExclamationTriangleIcon as AlertTriangle, DocumentTextIcon as FileText, PhoneIcon as Phone } from "@heroicons/react/24/outline";

export default function ArticlePregatire() {
  return (
    <>
      <Head>
        <title>Cum să Te Pregătești pentru Mutare | OferteMutare.ro</title>
        <meta
          name="description"
          content="Ghid pregătire mutare: planificare în 8 săptămâni, liste complete, când să rezervi firma și cum să economisești."
        />
        <meta
          name="keywords"
          content="pregătire mutare, planificare mutare, listă mutare, când rezerv firmă mutări, pregătire relocare, mutare organizată, checklist mutare, mutare eficientă"
        />
        <meta
          property="og:title"
          content="Ghid Complet: Cum să Te Pregătești pentru Mutare în România"
        />
        <meta
          property="og:description"
          content="Tot ce trebuie să știi pentru o mutare bine organizată: planificare pas cu pas, liste complete și sfaturi pentru economisire."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://ofertemutare.ro/articles/pregatire" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/articles/pregatire" />
        <meta name="twitter:title" content="Ghid Complet: Cum să Te Pregătești pentru Mutare" />
        <meta
          name="twitter:description"
          content="Tot ce trebuie să știi pentru o mutare bine organizată: planificare pas cu pas, liste complete."
        />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />
        <link rel="canonical" href="https://ofertemutare.ro/articles/pregatire" />
      </Head>

      <LayoutWrapper>
        <article className="mx-auto max-w-4xl px-4 py-12">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Cum să Te Pregătești pentru Mutare:{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Ghid Complet
              </span>
            </h1>
            <div className="mb-6 overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/pics/blog/moving-prep.png"
                alt="Pregatire Mutare"
                width={1200}
                height={675}
                className="h-auto w-full"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
              />
            </div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Planifică-ți mutarea pas cu pas cu acest ghid complet. De la 8 săptămâni înainte până
              în ziua mutării &ndash; totul organizat și simplu.
            </p>
          </header>

          {/* Intro */}
          <section className="mb-12 rounded-lg bg-emerald-50 p-6">
            <div className="flex items-start gap-4">
              <Calendar className="mt-1 h-8 w-8 shrink-0 text-emerald-600" />
              <div>
                <h2 className="mb-2 text-xl font-semibold text-emerald-800">
                  De ce este importantă pregătirea?
                </h2>
                <p className="text-gray-700">
                  O mutare bine pregătită înseamnă{" "}
                  <strong>mai puțin stres, costuri reduse și zero surprize neplăcute</strong>.
                  Statisticile arată că peste 70% din problemele la mutare apar din cauza lipsei de
                  planificare. Cu acest ghid, vei ști exact ce să faci și când.
                </p>
              </div>
            </div>
          </section>

          {/* Timeline - 8 Weeks */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">
              Planificarea Mutării: Cronologie de 8 Săptămâni
            </h2>

            {/* Week 8 */}
            <div className="mb-8 border-l-4 border-emerald-500 pl-6">
              <div className="mb-2 flex items-center gap-3">
                <Clock className="h-6 w-6 text-emerald-600" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Săptămâna 8: Planificarea Inițială
                </h3>
              </div>
              <ul className="ml-6 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Stabilește data mutării</strong> &ndash; Evită sfârșitul de lună
                    (prețuri mai mari) și weekendurile (lipsa disponibilității).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Creează un buget</strong> &ndash; Include: firmă mutări (1.500-4.000
                    lei), ambalaje (200-500 lei), utilități noi (500 lei), chirie/garanție.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Măsoară mobilierul mare</strong> &ndash; Verifică dacă intră pe ușile
                    noii locuințe (intrare, lift, scări).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Informează proprietarul actual</strong> &ndash; Respectă preavizul din
                    contract (de obicei 30 zile).
                  </span>
                </li>
              </ul>
            </div>

            {/* Week 6-7 */}
            <div className="mb-8 border-l-4 border-emerald-500 pl-6">
              <div className="mb-2 flex items-center gap-3">
                <Truck className="h-6 w-6 text-emerald-600" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Săptămâna 6-7: Rezervarea Firmei de Mutări
                </h3>
              </div>
              <ul className="ml-6 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Solicită oferte</strong> &ndash; Pe OferteMutare.ro primești 3-5 oferte
                    gratuite în 24h, fără obligație de cumpărare.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Compară prețurile și serviciile</strong> &ndash; Verifică: asigurare
                    transport, echipamente (rampe, lifturi), personal specializat.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Programează survey-ul</strong> &ndash; Lasă firma să vadă exact ce
                    trebuie mutat pentru ofertă finală precisă.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Rezervă data</strong> &ndash; Firmele bune se rezervă cu 3-4 săptămâni
                    înainte, mai ales în sezon (aprilie-octombrie).
                  </span>
                </li>
              </ul>
            </div>

            {/* Week 4-5 */}
            <div className="mb-8 border-l-4 border-emerald-500 pl-6">
              <div className="mb-2 flex items-center gap-3">
                <Package className="h-6 w-6 text-emerald-600" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Săptămâna 4-5: Sortarea și Pregătirea Obiectelor
                </h3>
              </div>
              <ul className="ml-6 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Sortează tot ce ai</strong> &ndash; Metodă simplă:{" "}
                    <em>păstrez, donez, arunc, vând</em>. Economia: cu 30% mai puține obiecte,
                    reduci costul mutării.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Vinde lucrurile valoroase</strong> &ndash; Olx, Facebook Marketplace,
                    second-hand. Poți recupera 500-2.000 lei.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Donează sau aruncă restul</strong> &ndash; Caritas, centre de colectare,
                    asociații sociale.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Cumpără materiale de ambalare</strong> &ndash; Vezi{" "}
                    <Link
                      href="/articles/impachetare"
                      className="text-emerald-600 underline hover:text-emerald-700"
                    >
                      ghidul nostru complet despre împachetare
                    </Link>
                    .
                  </span>
                </li>
              </ul>
            </div>

            {/* Week 2-3 */}
            <div className="mb-8 border-l-4 border-emerald-500 pl-6">
              <div className="mb-2 flex items-center gap-3">
                <FileText className="h-6 w-6 text-emerald-600" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Săptămâna 2-3: Birocrația și Serviciile
                </h3>
              </div>
              <ul className="ml-6 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Schimbă adresa la utilități</strong> &ndash; Electricitate, gaze, apă,
                    internet (unele necesită 10-14 zile pentru conectare).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Actualizează adresa oficială</strong> &ndash; Buletin (dacă schimbi
                    localitatea), permis auto, asigurare RCA, loc de muncă.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Transferă abonamentele</strong> &ndash; Internet, TV, telefonie. Unele
                    operatori oferă transfer gratuit.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Redirectionează corespondența</strong> &ndash; Bănci, primărie, medicul
                    de familie.
                  </span>
                </li>
              </ul>
            </div>

            {/* Week 1 */}
            <div className="mb-8 border-l-4 border-emerald-500 pl-6">
              <div className="mb-2 flex items-center gap-3">
                <Home className="h-6 w-6 text-emerald-600" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Săptămâna 1: Pregătirea Finală
                </h3>
              </div>
              <ul className="ml-6 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Împachetează tot (mai puțin esențialele)</strong> &ndash; Cameră cu
                    cameră, etichetează clar fiecare cutie.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Pregătește &ldquo;geanta de supraviețuire&rdquo;</strong> &ndash; Haine
                    pentru 2-3 zile, produse igienă, documente importante, încărcătoare,
                    medicamente.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Confirmă cu firma de mutări</strong> &ndash; Ora exactă, adresele
                    corecte, număr de telefon activ.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Curăță locuința veche</strong> &ndash; Dacă vrei să recuperezi garanția
                    integral.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>
                    <strong>Pregătește noua locuință</strong> &ndash; Verifică cheile, curățenie
                    generală, funcționare lift/interfon.
                  </span>
                </li>
              </ul>
            </div>

            {/* Moving Day */}
            <div className="mb-8 border-l-4 border-red-500 pl-6">
              <div className="mb-2 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-2xl font-semibold text-gray-800">
                  Ziua Mutării: Ce Trebuie Să Știi
                </h3>
              </div>
              <ul className="ml-6 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                  <span>
                    <strong>Fii prezent tot timpul</strong> &ndash; Coordonează echipa, verifică
                    încărcarea, răspunde la întrebări.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                  <span>
                    <strong>Verifică starea obiectelor</strong> &ndash; Înainte și după mutare.
                    Fotografiază mobilierul valoros.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                  <span>
                    <strong>Ai cash la tine</strong> &ndash; Pentru bacșiș (10-15% din cost) și
                    eventuale cheltuieli neprevăzute.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                  <span>
                    <strong>Predă cheia veche</strong> &ndash; Documentează starea locuinței
                    (poze/video) pentru recuperarea garanției.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Essential Checklist */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">
              Lista Completă de Pregătire (Printabilă)
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Documente */}
              <div className="rounded-lg border-2 border-emerald-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Documente Esențiale</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Contract închiriere/vânzare-cumpărare</li>
                  <li>✓ Documente identitate (buletin, CI)</li>
                  <li>✓ Contract firmă mutări + asigurare</li>
                  <li>✓ Documente utilități (dezdăbiri)</li>
                  <li>✓ Dovada plății chiriei/garanției noi</li>
                  <li>✓ Proces-verbal predare-primire locuință</li>
                </ul>
              </div>

              {/* Utilități */}
              <div className="rounded-lg border-2 border-emerald-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Phone className="h-6 w-6 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Servicii de Contactat</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Furnizor energie electrică</li>
                  <li>✓ Furnizor gaze naturale</li>
                  <li>✓ Compania de apă</li>
                  <li>✓ Furnizor internet/TV/telefonie</li>
                  <li>✓ Bancă (schimbare adresă)</li>
                  <li>✓ Asigurare locuință/mașină</li>
                </ul>
              </div>

              {/* Cu 1 Lună Înainte */}
              <div className="rounded-lg border-2 border-blue-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Cu 1 Lună Înainte</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Anunță proprietarul</li>
                  <li>✓ Solicită oferte mutări</li>
                  <li>✓ Rezervă data cu firma aleasă</li>
                  <li>✓ Începe sortarea obiectelor</li>
                  <li>✓ Vinde/donează lucruri neutilizate</li>
                </ul>
              </div>

              {/* Cu 2 Săptămâni Înainte */}
              <div className="rounded-lg border-2 border-purple-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Package className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Cu 2 Săptămâni Înainte</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Cumpără materiale ambalare</li>
                  <li>✓ Începe împachetarea</li>
                  <li>✓ Actualizează adresa la bănci</li>
                  <li>✓ Programează transfer utilități</li>
                  <li>✓ Anunță prietenii/familia</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">
              7 Greșeli Comune în Pregătirea Mutării
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <h4 className="mb-1 font-semibold text-red-800">
                  1. Rezervarea târzie a firmei de mutări
                </h4>
                <p className="text-gray-700">
                  În sezon, firmele bune sunt ocupate cu 3-4 săptămâni înainte. Riști prețuri mai
                  mari sau să nu găsești disponibilitate.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <h4 className="mb-1 font-semibold text-red-800">
                  2. Subestimarea cantității de obiecte
                </h4>
                <p className="text-gray-700">
                  Fără survey, riscă să fie nevoie de a doua cursă (cost dublu). Lasă firma să vadă
                  exact ce muți.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <h4 className="mb-1 font-semibold text-red-800">
                  3. Neglijarea birocrației pentru utilități
                </h4>
                <p className="text-gray-700">
                  Unele servicii (internet, gaze) necesită 10-14 zile pentru conectare. Riști să
                  rămâi fără servicii esențiale.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <h4 className="mb-1 font-semibold text-red-800">4. Împachetarea în ultima clipă</h4>
                <p className="text-gray-700">
                  Stresul crește, riști să încarci lucruri pe care nu le mai vrei, ambalajul prost
                  duce la deteriorări.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <h4 className="mb-1 font-semibold text-red-800">
                  5. Uitatul de a măsura mobilierul mare
                </h4>
                <p className="text-gray-700">
                  Canapeaua, dulapul sau mașina de spălat pot să nu încapă pe lift/scări în noua
                  locuință. Măsoară DIN TIMP!
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <h4 className="mb-1 font-semibold text-red-800">
                  6. Lipsa asigurării pentru bunuri valoroase
                </h4>
                <p className="text-gray-700">
                  Fără asigurare, firma nu răspunde pentru deteriorări. Pentru bunuri peste 5.000
                  lei, asigură-te că ai acoperire.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <h4 className="mb-1 font-semibold text-red-800">
                  7. Nu lăsarea de timp pentru neprevăzut
                </h4>
                <p className="text-gray-700">
                  Trafic, lift blocat, uitat o cheie &ndash; lasă 2-3 ore buffer în ziua mutării.
                </p>
              </div>
            </div>
          </section>

          {/* Budget Planning */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">
              Bugetul Pentru Mutare: Estimări Realiste (2025)
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-emerald-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Cheltuială</th>
                    <th className="px-4 py-3 text-left">Cost Estimat</th>
                    <th className="px-4 py-3 text-left">Obs.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-4 py-3 font-medium">Firmă mutări (2 camere)</td>
                    <td className="px-4 py-3">1.500-2.500 lei</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      În funcție de distanță și sezon
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Materiale ambalare</td>
                    <td className="px-4 py-3">200-500 lei</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      Cutii, folie, scotch, bubble wrap
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Garanție chirie nouă (1-2 luni)</td>
                    <td className="px-4 py-3">1.500-4.000 lei</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Recuperabilă la final</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Utilități noi (depozit/avans)</td>
                    <td className="px-4 py-3">300-800 lei</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      Electricitate, gaze, apă, internet
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Curățenie profesională</td>
                    <td className="px-4 py-3">200-400 lei</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      Opțional, pentru recuperare garanție
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Diverse (mâncare, taxe parcare)</td>
                    <td className="px-4 py-3">100-300 lei</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      Bacșiș, taxe acces mașini, etc.
                    </td>
                  </tr>
                  <tr className="bg-emerald-100">
                    <td className="px-4 py-3 font-bold">TOTAL ESTIMAT</td>
                    <td className="px-4 py-3 font-bold">3.800-8.500 lei</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Variabil, mediu ~5.000 lei</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              <strong>💡 Sfat de economisire:</strong> Solicită oferte pe OferteMutare.ro pentru a
              compara prețuri. Mutările midweek (marți-joi) sunt de obicei mai ieftine cu 10-20%.
            </p>
          </section>

          {/* Tips for Efficiency */}
          <section className="mb-16 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 p-8">
            <h2 className="mb-6 text-3xl font-bold text-gray-800">
              Sfaturi pentru o Mutare Ultra-Eficientă
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-emerald-700">
                  <Users className="h-5 w-5" />
                  Cere ajutor din timp
                </h4>
                <p className="text-gray-700">
                  Anunță prietenii cu 2-3 săptămâni înainte dacă ai nevoie de ajutor. Oferă pizza și
                  băuturi ca mulțumire!
                </p>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-emerald-700">
                  <Package className="h-5 w-5" />
                  Etichetează TOTUL
                </h4>
                <p className="text-gray-700">
                  Scrie camera destinație + conținutul pe fiecare cutie. Culori diferite pe cameră =
                  super eficient!
                </p>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-emerald-700">
                  <Clock className="h-5 w-5" />
                  Mutări în sezon vs. off-season
                </h4>
                <p className="text-gray-700">
                  Primăvara/vara sunt scumpe. Mutările iarna (noiembrie-martie) pot fi 20-30% mai
                  ieftine.
                </p>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-emerald-700">
                  <Home className="h-5 w-5" />
                  Vizitează noua casă înainte
                </h4>
                <p className="text-gray-700">
                  Măsoară spațiile, notează prize/lumini, plănuiește unde va sta fiecare mobila
                  &ndash; vei economisi ore în ziua mutării.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12 rounded-lg bg-emerald-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Pregătit să Începi Mutarea?</h2>
            <p className="mb-6 text-lg">
              Obține 3-5 oferte personalizate de la cele mai bune firme de mutări din România.
              Gratuit, fără obligații, răspuns în 24h.
            </p>
            <Link
              href="/customer/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-emerald-600 transition-transform hover:scale-105 hover:shadow-lg"
            >
              <Truck className="h-5 w-5" />
              Solicită Oferte Gratuite
            </Link>
          </section>

          {/* Related Articles */}
          <section>
            <h3 className="mb-4 text-2xl font-bold text-gray-800">Alte Articole Utile</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/articles/impachetare"
                className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
              >
                <h4 className="mb-2 font-semibold text-emerald-700">Ghid Împachetare</h4>
                <p className="text-sm text-gray-600">Tehnici profesionale și materiale necesare</p>
              </Link>
              <Link
                href="/articles/survey"
                className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
              >
                <h4 className="mb-2 font-semibold text-emerald-700">Tipuri de Survey</h4>
                <p className="text-sm text-gray-600">Fizic, video sau estimare rapidă?</p>
              </Link>
              <Link
                href="/articles/tips"
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
