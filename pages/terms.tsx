import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Termeni și Condiții | OferteMutare.ro</title>
        <meta
          name="description"
          content="Termenii și condițiile de utilizare a platformei OferteMutare.ro. Citește regulile și responsabilitățile pentru utilizatori și firme partenere."
        />
        <link rel="canonical" href="https://ofertemutare.ro/terms" />
        <meta property="og:title" content="Termeni și Condiții | OferteMutare.ro" />
        <meta
          property="og:description"
          content="Termenii și condițiile de utilizare a platformei OferteMutare.ro."
        />
        <meta property="og:url" content="https://ofertemutare.ro/terms" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ofertemutare.ro/pics/index.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ofertemutare.ro/terms" />
        <meta name="twitter:title" content="Termeni și Condiții | OferteMutare.ro" />
        <meta
          name="twitter:description"
          content="Termenii și condițiile de utilizare a platformei OferteMutare.ro."
        />
        <meta name="twitter:image" content="https://ofertemutare.ro/pics/index.webp" />
      </Head>

      <LayoutWrapper>
        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 p-3 shadow-sm">
              <FileText className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-slate-900">
              Termeni și{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Condiții
              </span>
            </h1>
            <p className="text-gray-600">Ultima actualizare: 5 Noiembrie 2025</p>
          </div>

          <div className="prose prose-emerald max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">1. Introducere</h2>
              <p className="leading-relaxed text-gray-600">
                Bine ați venit pe <strong>OferteMutare.ro</strong> (denumită în continuare
                &ldquo;Platforma&rdquo;, &ldquo;Noi&rdquo; sau &ldquo;Site-ul&rdquo;). Prin
                accesarea și utilizarea acestui site, acceptați să respectați și să fiți obligat de
                următorii termeni și condiții. Dacă nu sunteți de acord cu acești termeni, vă rugăm
                să nu utilizați Platforma.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">2. Definiții</h2>
              <ul className="list-disc space-y-2 pl-6 text-gray-600">
                <li>
                  <strong>Client/Utilizator</strong>: Persoană fizică sau juridică care solicită
                  oferte pentru servicii de mutare prin intermediul Platformei.
                </li>
                <li>
                  <strong>Firmă Parteneră</strong>: Companie de mutări verificată și înregistrată pe
                  Platformă care oferă servicii de transport bunuri și mutări.
                </li>
                <li>
                  <strong>Cerere</strong>: Formular completat de Client cu detalii despre mutarea
                  dorită, transmis către Firmele Partenere.
                </li>
                <li>
                  <strong>Ofertă</strong>: Propunere comercială transmisă de o Firmă Parteneră către
                  Client, conținând prețul și detaliile serviciului.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                3. Serviciile Oferite de Platformă
              </h2>
              <p className="mb-3 leading-relaxed text-gray-600">
                OferteMutare.ro este un intermediar care facilitează conectarea între Clienți și
                Firme de Mutări. Platforma:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-gray-600">
                <li>
                  Permite Clienților să solicite oferte gratuite de la mai multe Firme Partenere
                  printr-un singur formular.
                </li>
                <li>
                  Transmite cererile către Firmele Partenere care operează în zona geografică
                  specificată.
                </li>
                <li>Facilitează compararea ofertelor și comunicarea dintre părți.</li>
                <li>
                  <strong>NU furnizează servicii de mutare directe</strong>. Contractul de mutare se
                  încheie direct între Client și Firma Parteneră aleasă.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                4. Obligațiile Utilizatorilor (Clienți)
              </h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">4.1. Informații Corecte</h3>
                  <p>
                    Clienții se obligă să furnizeze informații complete, corecte și actualizate în
                    formularul de cerere. Informații incorecte pot duce la oferte inexacte sau
                    refuzul prestării serviciului.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">4.2. Utilizare Responsabilă</h3>
                  <p>
                    Utilizatorii se angajează să nu trimită cereri false, spam sau să abuzeze de
                    Platformă. Acest lucru include: solicitări multiple duplicate, informații false
                    intenționate, hărțuirea Firmelor Partenere.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">
                    4.3. Comunicare Directă cu Firmele
                  </h3>
                  <p>
                    După primirea ofertelor, Clienții comunică și negociază direct cu Firmele
                    Partenere. Platforma nu este responsabilă pentru negocierile sau contractele
                    încheiate între părți.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                5. Obligațiile Firmelor Partenere
              </h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">
                    5.1. Verificare și Autorizare
                  </h3>
                  <p>
                    Firmele Partenere trebuie să dețină: CUI valid și înregistrare ONRC, asigurare
                    de răspundere civilă profesională, autorizații legale pentru transport bunuri.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">5.2. Oferte Reale</h3>
                  <p>
                    Firmele se obligă să transmită oferte realiste, bazate pe informațiile din
                    cerere. Modificările majore de preț în ziua mutării sunt interzise și pot duce
                    la excluderea de pe Platformă.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">5.3. Profesionalism</h3>
                  <p>
                    Firmele trebuie să respecte standardele profesionale: personal instruit,
                    echipament adecvat, respectarea termenelor, comportament profesional față de
                    clienți.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                6. Limitarea Responsabilității
              </h2>
              <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6">
                <p className="mb-3 font-semibold text-gray-800">
                  ⚠️ IMPORTANT: OferteMutare.ro acționează exclusiv ca INTERMEDIAR.
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    <strong>NU suntem responsabili</strong> pentru: calitatea serviciilor de mutare
                    efectuate de Firmele Partenere, deteriorarea sau pierderea bunurilor în timpul
                    transportului, nerespectarea termenelor sau contractelor de către Firme,
                    litigiile comerciale între Clienți și Firme.
                  </li>
                  <li>
                    <strong>Contractul de mutare</strong> se încheie direct între Client și Firma
                    aleasă. Pentru orice problemă legată de serviciul de mutare, contactați direct
                    Firma.
                  </li>
                  <li>
                    Oferim <strong>suport în rezolvarea disputelor</strong>, dar nu putem garanta
                    rezultatul sau forța Firmele să acționeze într-un anumit mod.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                7. Prețuri și Modalități de Plată
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>7.1. Gratuitate pentru Clienți:</strong> Serviciile Platformei (solicitare
                  oferte, comparare, comunicare) sunt 100% gratuite pentru Clienți. Nu există
                  costuri ascunse.
                </p>
                <p>
                  <strong>7.2. Plata către Firme:</strong> Clienții plătesc direct Firmei alese,
                  conform contractului încheiat între părți. Platforma NU procesează plăți pentru
                  serviciile de mutare.
                </p>
                <p>
                  <strong>7.3. Comision Firme:</strong> Firmele Partenere plătesc un comision către
                  Platformă. Acest lucru permite menținerea serviciului gratuit pentru Clienți.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">8. Protecția Datelor</h2>
              <p className="leading-relaxed text-gray-600">
                Prelucrarea datelor personale se realizează conform <strong>GDPR</strong>{" "}
                (Regulamentul UE 2016/679). Pentru detalii complete, consultă{" "}
                <Link href="/privacy" className="font-semibold text-emerald-600 underline">
                  Politica de Confidențialitate
                </Link>
                . În rezumat:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-gray-600">
                <li>Datele sunt folosite exclusiv pentru facilitarea serviciului de conectare.</li>
                <li>
                  Nu vindem/partajăm datele cu terțe părți (cu excepția Firmelor Partenere pentru
                  oferte solicitate).
                </li>
                <li>
                  Utilizatorii au dreptul de acces, rectificare, ștergere și portabilitate a
                  datelor.
                </li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">9. Proprietate Intelectuală</h2>
              <p className="leading-relaxed text-gray-600">
                Toate drepturile de proprietate intelectuală asupra Platformei (design, logo, cod,
                conținut) aparțin OferteMutare.ro. Este interzisă copierea, reproducerea sau
                distribuirea conținutului fără acordul scris prealabil.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                10. Modificări ale Termenilor
              </h2>
              <p className="leading-relaxed text-gray-600">
                Ne rezervăm dreptul de a modifica acești Termeni și Condiții în orice moment.
                Modificările vor fi comunicate prin email și/sau notificare pe site. Continuarea
                utilizării Platformei după modificări constituie acceptarea noilor termeni.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">11. Legea Aplicabilă</h2>
              <p className="leading-relaxed text-gray-600">
                Acești termeni sunt reglementați de legea română. Orice litigiu va fi soluționat de
                instanțele competente din România, în conformitate cu legislația în vigoare.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">12. Contact</h2>
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="mb-2 text-gray-700">
                  Pentru întrebări referitoare la acești Termeni și Condiții:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <strong>Email clienți:</strong>{" "}
                    <a href="mailto:contact@ofertemutare.ro" className="text-emerald-600 underline">
                      contact@ofertemutare.ro
                    </a>
                  </li>
                  <li>
                    <strong>Email companii partenere:</strong>{" "}
                    <a
                      href="mailto:partener@ofertemutare.ro"
                      className="text-emerald-600 underline"
                    >
                      partener@ofertemutare.ro
                    </a>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
}
