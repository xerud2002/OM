import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import {
  ShieldCheckIcon as Shield,
  EyeIcon as Eye,
  LockClosedIcon as Lock,
  UserCircleIcon as UserCheck,
  EnvelopeIcon as Mail,
} from "@heroicons/react/24/outline";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Politica de Confidențialitate | OferteMutare.ro</title>
        <meta
          name="description"
          content="Politica de confidențialitate OferteMutare.ro - Cum colectăm, folosim și protejăm datele tale personale conform GDPR."
        />
        <link rel="canonical" href="https://ofertemutare.ro/privacy" />
        <meta
          property="og:title"
          content="Politica de Confidențialitate | OferteMutare.ro"
        />
        <meta
          property="og:description"
          content="Cum colectăm, folosim și protejăm datele tale personale conform GDPR."
        />
        <meta property="og:url" content="https://ofertemutare.ro/privacy" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://ofertemutare.ro/pics/index.webp"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/privacy" />
        <meta
          name="twitter:title"
          content="Politica de Confidențialitate | OferteMutare.ro"
        />
        <meta
          name="twitter:description"
          content="Cum colectăm, folosim și protejăm datele tale personale conform GDPR."
        />
        <meta
          name="twitter:image"
          content="https://ofertemutare.ro/pics/index.webp"
        />
      </Head>

      <LayoutWrapper>
        <Breadcrumbs items={[{ name: "Acasă", href: "/" }, { name: "Politica de Confidențialitate" }]} />
        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex rounded-full bg-linear-to-r from-blue-100 to-indigo-100 p-3 shadow-sm">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="mb-4 text-2xl md:text-4xl font-bold text-slate-900">
              Politica de{" "}
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Confidențialitate
              </span>
            </h1>
            <p className="text-gray-600">
              Ultima actualizare: 9 Februarie 2026 | Conform GDPR (Regulamentul
              UE 2016/679)
            </p>
          </div>

          {/* Trust Banner */}
          <div className="mb-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 text-center">
              <Lock className="mx-auto mb-3 h-8 w-8 text-blue-600" />
              <h3 className="mb-2 font-semibold text-gray-800">
                Date Securizate
              </h3>
              <p className="text-sm text-gray-600">
                Criptare SSL 256-bit pentru toate datele
              </p>
            </div>
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 text-center">
              <UserCheck className="mx-auto mb-3 h-8 w-8 text-green-600" />
              <h3 className="mb-2 font-semibold text-gray-800">
                Control Total
              </h3>
              <p className="text-sm text-gray-600">
                Poți accesa, modifica sau șterge datele oricând
              </p>
            </div>
            <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6 text-center">
              <Eye className="mx-auto mb-3 h-8 w-8 text-purple-600" />
              <h3 className="mb-2 font-semibold text-gray-800">
                Transparență 100%
              </h3>
              <p className="text-sm text-gray-600">
                Știi exact ce date colectăm și de ce
              </p>
            </div>
          </div>

          <div className="prose prose-blue max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                1. Introducere
              </h2>
              <p className="leading-relaxed text-gray-600">
                <strong>Ofertemutare Ltd</strong> (denumită în continuare
                &ldquo;Compania&rdquo;, &ldquo;Noi&rdquo;), operatorul
                platformei OferteMutare.ro (denumită în continuare
                &ldquo;Platforma&rdquo; sau &ldquo;Site-ul&rdquo;), respectă
                confidențialitatea utilizatorilor și se angajează să protejeze
                datele personale conform <strong>GDPR</strong> (Regulamentul
                General privind Protecția Datelor UE 2016/679) și legislației
                aplicabile.
              </p>
              <p className="leading-relaxed text-gray-600">
                Această Politică explică ce date colectăm, cum le folosim, cum
                le protejăm și care sunt drepturile tale în ceea ce privește
                informațiile personale.
              </p>
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-gray-800">
                  Operator de date (Data Controller):
                </p>
                <p className="text-sm text-gray-600">Ofertemutare Ltd</p>
                <p className="text-sm text-gray-600">
                  Website: ofertemutare.ro
                </p>
                <p className="text-sm text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:info@ofertemutare.ro"
                    className="text-blue-600 underline"
                  >
                    info@ofertemutare.ro
                  </a>
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                2. Date Pe Care Le Colectăm
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                    <Eye className="h-5 w-5 text-blue-600" />
                    2.1. Date Furnizate Direct de Tine
                  </h3>
                  <p className="mb-2 text-gray-600">
                    Când completezi formularul de cerere oferte sau creezi cont,
                    colectăm:
                  </p>
                  <ul className="list-disc space-y-1 pl-6 text-gray-600">
                    <li>
                      <strong>Date de identificare:</strong> Nume, prenume
                    </li>
                    <li>
                      <strong>Date de contact:</strong> Adresă email, număr
                      telefon
                    </li>
                    <li>
                      <strong>Date despre mutare:</strong> Adrese (de la și
                      către), număr camere, dată dorită, tip locuință, servicii
                      solicitate
                    </li>
                    <li>
                      <strong>Media (opțional):</strong> Fotografii sau video cu
                      bunurile de mutat
                    </li>
                    <li>
                      <strong>Mesaje:</strong> Comunicările tale cu Firmele
                      Partenere prin Platformă
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                    <Lock className="h-5 w-5 text-blue-600" />
                    2.2. Date Colectate Automat
                  </h3>
                  <p className="mb-2 text-gray-600">
                    Când vizitezi Site-ul, colectăm automat (prin cookie-uri și
                    tehnologii similare):
                  </p>
                  <ul className="list-disc space-y-1 pl-6 text-gray-600">
                    <li>Adresa IP, tipul browser-ului, sistem de operare</li>
                    <li>Pagini vizitate, timp petrecut, link-uri accesate</li>
                    <li>Referrer URL (de unde ai ajuns pe site)</li>
                    <li>Dispozitiv folosit (desktop, mobile, tabletă)</li>
                    <li>
                      <strong>Amprentă digitală a dispozitivului:</strong> La
                      autentificare, colectăm un identificator unic (hash) al
                      dispozitivului tău, generat din: rezoluția ecranului,
                      fusul orar, limba browserului, numărul de procesoare și
                      memoria disponibilă. Acest identificator este folosit
                      exclusiv pentru prevenirea fraudei și protejarea contului
                      tău (temei legal: interes legitim, conform Art. 6(1)(f)
                      GDPR). Hash-ul nu permite reconstituirea datelor
                      individuale din care a fost generat.
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Notă:</strong> Datele de navigare sunt anonimizate și
                    folosite doar pentru îmbunătățirea experienței
                    utilizatorului. Amprenta dispozitivului este păstrată doar pe
                    durata existenței contului tău.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                3. Cum Folosim Datele Tale
              </h2>
              <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6">
                <p className="mb-4 font-semibold text-gray-800">
                  📌 Scopurile pentru care prelucrăm datele tale:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    <span>
                      <strong>Furnizarea serviciului:</strong> Transmiterea
                      cererii tale către Firmele Partenere și facilitarea
                      primirii ofertelor.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    <span>
                      <strong>Comunicare:</strong> Trimiterea ofertelor,
                      notificări importante, răspunsuri la întrebările tale.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    <span>
                      <strong>Îmbunătățirea platformei:</strong> Analiză
                      statistică pentru optimizarea experienței utilizatorilor.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    <span>
                      <strong>Securitate:</strong> Prevenirea fraudelor,
                      spam-ului și abuzurilor.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-600">✓</span>
                    <span>
                      <strong>Marketing (doar cu consimțământ):</strong>{" "}
                      Newsletter, oferte speciale, sfaturi despre mutări.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                4. Cu Cine Partajăm Datele Tale
              </h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">
                    4.1. Firme Partenere de Mutări
                  </h3>
                  <p>
                    Când soliciți oferte, trimitem datele tale (nume, contact,
                    detalii mutare) către Firmele Partenere din zona ta.{" "}
                    <strong>Acestea sunt singurele terțe părți</strong> cu care
                    partajăm datele tale.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">
                    4.2. Furnizori de Servicii
                  </h3>
                  <p>
                    Folosim furnizori de servicii tehnice (hosting, email,
                    analiză) care au acces limitat la date doar pentru a ne
                    ajuta să operăm Platforma. Toți furnizorii sunt contractați
                    să respecte GDPR.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">
                    4.3. ❌ NU Vindem Datele Tale
                  </h3>
                  <p className="font-semibold text-red-600">
                    Nu vindem, închiriem sau comercializăm datele tale personale
                    către terțe părți în scopuri de marketing.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                5. Drepturile Tale Conform GDPR
              </h2>
              <div className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-2 font-semibold text-gray-800">
                    🔹 Dreptul de Acces (Art. 15)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Poți solicita o copie a tuturor datelor personale pe care le
                    deținem despre tine.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-2 font-semibold text-gray-800">
                    🔹 Dreptul de Rectificare (Art. 16)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Poți corecta oricând datele incorecte sau incomplete din
                    contul tău.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-2 font-semibold text-gray-800">
                    🔹 Dreptul la Ștergere / &ldquo;Dreptul de a fi uitat&rdquo;
                    (Art. 17)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Poți solicita ștergerea completă a contului și datelor tale
                    (cu excepția cazurilor în care avem obligații legale de
                    păstrare).
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-2 font-semibold text-gray-800">
                    🔹 Dreptul la Portabilitate (Art. 20)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Poți obține datele tale într-un format structurat (JSON,
                    CSV) pentru a le transfera altei platforme.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-2 font-semibold text-gray-800">
                    🔹 Dreptul de Opoziție (Art. 21)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Poți refuza oricând procesarea datelor tale pentru marketing
                    sau alte scopuri non-esențiale.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-2 font-semibold text-gray-800">
                    🔹 Dreptul de a Depune Plângere
                  </h3>
                  <p className="text-sm text-gray-600">
                    Dacă consideri că nu respectăm GDPR, poți depune plângere la
                    Autoritatea Națională de Supraveghere a Prelucrării Datelor
                    cu Caracter Personal (ANSPDCP) din România.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-lg bg-blue-50 p-6">
                <p className="mb-2 font-semibold text-gray-800">
                  📧 Cum îți exerciți drepturile?
                </p>
                <p className="text-gray-600">
                  Trimite-ne un email la{" "}
                  <a
                    href="mailto:info@ofertemutare.ro"
                    className="font-semibold text-blue-600 underline"
                  >
                    info@ofertemutare.ro
                  </a>{" "}
                  cu subiectul &ldquo;Solicitare GDPR&rdquo; și vom răspunde în{" "}
                  <strong>maximum 30 zile</strong>.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                6. Securitatea Datelor
              </h2>
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                <p className="mb-4 font-semibold text-gray-800">
                  Măsuri de Securitate Implementate:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    ✓ <strong>Criptare SSL/TLS</strong> (HTTPS) pentru toate
                    conexiunile
                  </li>
                  <li>
                    ✓ <strong>Firewall</strong> și protecție împotriva
                    atacurilor DDoS
                  </li>
                  <li>
                    ✓ <strong>Autentificare securizată</strong> prin Firebase
                    Authentication (hash securizat)
                  </li>
                  <li>
                    ✓ <strong>Backup regulat</strong> al bazelor de date
                  </li>
                  <li>
                    ✓ <strong>Monitorizare 24/7</strong> pentru activități
                    suspecte
                  </li>
                  <li>
                    ✓ <strong>Acces limitat</strong> la date doar pentru
                    personal autorizat
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Notă:</strong> Deși luăm toate măsurile rezonabile de
                  securitate, nicio metodă de transmitere pe Internet nu este
                  100% sigură. Îți recomandăm să folosești parole puternice și
                  să nu le partajezi cu nimeni.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                7. Retenția Datelor (Cât Timp Le Păstrăm)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse overflow-hidden rounded-lg border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">
                        Tip Date
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">
                        Perioadă Retenție
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">
                        Cereri oferte active/complete
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        12 luni de la finalizare
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">
                        Conturi utilizatori inactive
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        24 luni fără activitate
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">
                        Date financiare (facturi)
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        10 ani (obligație legală)
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">
                        Cookie-uri analiză
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        26 luni
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">
                        Recenzii clienți
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        Permanent (sau până la solicitare ștergere)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                După expirarea perioadei, datele sunt șterse automat sau
                anonimizate irreversibil.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                8. Cookie-uri
              </h2>
              <p className="mb-3 leading-relaxed text-gray-600">
                Folosim cookie-uri pentru a îmbunătăți experiența ta pe site și
                a analiza traficul. La prima vizită, îți cerem consimțământul
                prin bannerul de cookie-uri și poți alege ce categorii de
                cookie-uri accepți.
              </p>
              <div className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-1 font-semibold text-gray-800">
                    🍪 Cookie-uri Esențiale (mereu active)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Necesare pentru funcționarea de bază: autentificare,
                    sesiune, preferințe cookie-uri. Nu pot fi dezactivate.
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Exemplu: <code>om_cookie_consent</code>
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-1 font-semibold text-gray-800">
                    📊 Cookie-uri de Analiză (opt-in)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Google Analytics 4 — colectează date anonime despre
                    vizitatori pentru îmbunătățirea platformei. Se încarcă doar
                    dacă accepți această categorie.
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Exemplu: <code>_ga</code>, <code>_ga_*</code> — Expirare: 26
                    luni
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-1 font-semibold text-gray-800">
                    🎯 Cookie-uri de Marketing (opt-in)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pentru reclame personalizate și remarketing. Momentan
                    inactive — vor fi utilizate doar cu consimțământul tău
                    explicit.
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-700">
                  <strong>Îți poți schimba preferințele oricand</strong>{" "}
                  ștergând cookie-ul{" "}
                  <code className="rounded bg-gray-100 px-1 text-xs">
                    om_cookie_consent
                  </code>{" "}
                  din browser, iar bannerul va reapărea la următoarea vizită.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                9. Modificări Politică
              </h2>
              <p className="leading-relaxed text-gray-600">
                Ne rezervăm dreptul de a actualiza această Politică de
                Confidențialitate. Orice modificare semnificativă va fi
                comunicată prin email și/sau notificare pe site. Data ultimei
                actualizări este afișată în partea de sus a paginii.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                10. Contact
              </h2>
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Pentru întrebări despre confidențialitate sau exercitarea
                  drepturilor GDPR:
                </p>
                <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                  <p className="font-semibold text-gray-800">
                    Ofertemutare Ltd
                  </p>
                  <p className="text-sm text-gray-600">
                    Website: ofertemutare.ro
                  </p>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:info@ofertemutare.ro"
                      className="text-blue-600 underline"
                    >
                      info@ofertemutare.ro
                    </a>
                  </li>
                  <li>
                    <strong>Email companii partenere:</strong>{" "}
                    <a
                      href="mailto:info@ofertemutare.ro"
                      className="text-blue-600 underline"
                    >
                      info@ofertemutare.ro
                    </a>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">
                  <strong>Timp de răspuns:</strong> Maximum 30 zile conform GDPR
                  (în general răspundem în 3-5 zile lucrătoare)
                </p>
              </div>
            </section>

            {/* Quick Links */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Documente Conexe
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/terms"
                  className="rounded-lg border-2 border-emerald-200 bg-emerald-50 px-6 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                >
                  Termeni și Condiții
                </Link>
                <Link
                  href="/faq"
                  className="rounded-lg border-2 border-blue-200 bg-blue-50 px-6 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  Întrebări Frecvente
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg border-2 border-purple-200 bg-purple-50 px-6 py-3 font-semibold text-purple-700 transition-colors hover:bg-purple-100"
                >
                  Contactează-ne
                </Link>
              </div>
            </section>
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
}
