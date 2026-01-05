import LayoutWrapper from "@/components/layout/Layout";
import Head from "next/head";
import Link from "next/link";
import { Package, Shield, Clock, CheckCircle } from "lucide-react";

export default function ArticleImpachetare() {
  return (
    <>
      <Head>
        <title>Ghid Complet de Împachetare pentru Mutare | OferteMutare.ro</title>
        <meta
          name="description"
          content="Descoperă tehnicile profesionale de împachetare pentru mutare. Sfaturi practice pentru protejarea obiectelor fragile, organizarea eficientă și economisirea timpului."
        />
        <meta
          name="keywords"
          content="împachetare mutare, cutii mutare, materiale ambalare, protejare obiecte fragile, organizare mutare"
        />
        <link rel="canonical" href="https://ofertemutare.ro/articles/impachetare" />
        <meta property="og:title" content="Ghid Complet de Împachetare pentru Mutare" />
        <meta
          property="og:description"
          content="Tehnici profesionale de împachetare pentru o mutare organizată și fără stres."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://ofertemutare.ro/articles/impachetare" />
      </Head>
      <LayoutWrapper>
        <article className="mx-auto max-w-4xl px-6 py-12">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Ghid Complet de Împachetare pentru{" "}
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mutare
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Tehnici profesionale și sfaturi practice pentru o mutare organizată și fără stres
            </p>
          </header>

          {/* Quick Tips Cards */}
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-emerald-50 p-6">
              <Package className="mb-3 text-emerald-600" size={32} />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Materiale Necesare</h3>
              <p className="text-sm text-gray-700">
                Cutii carton, bubble wrap, hârtie ziar, bandă adezivă, markere și etichete pentru
                organizare optimă.
              </p>
            </div>
            <div className="rounded-lg bg-sky-50 p-6">
              <Clock className="mb-3 text-sky-600" size={32} />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Timp Necesar</h3>
              <p className="text-sm text-gray-700">
                Începe împachetarea cu 2-3 săptămâni înainte pentru a evita stresul de ultim moment.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-900">
              Materiale Esențiale de Împachetare
            </h2>
            <p className="mb-4 text-gray-700">
              Pentru o mutare reușită, pregătirea materialelor potrivite este crucială:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="mt-1 mr-2 shrink-0 text-emerald-600" size={20} />
                <span>
                  <strong>Cutii de carton rezistente</strong> - diverse dimensiuni (mici pentru
                  cărți, mari pentru haine)
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mt-1 mr-2 shrink-0 text-emerald-600" size={20} />
                <span>
                  <strong>Folie cu bule (bubble wrap)</strong> - protecție excelentă pentru obiecte
                  fragile
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mt-1 mr-2 shrink-0 text-emerald-600" size={20} />
                <span>
                  <strong>Hârtie de ziar sau ambalare</strong> - pentru umplerea spațiilor goale
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mt-1 mr-2 shrink-0 text-emerald-600" size={20} />
                <span>
                  <strong>Bandă adezivă rezistentă</strong> - minimum 2 role pentru siguranță
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mt-1 mr-2 shrink-0 text-emerald-600" size={20} />
                <span>
                  <strong>Markere permanente</strong> - pentru etichetare clară și organizare
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mt-1 mr-2 shrink-0 text-emerald-600" size={20} />
                <span>
                  <strong>Folie stretch</strong> - pentru protejarea mobilierului și gruparea
                  obiectelor
                </span>
              </li>
            </ul>

            <div className="my-8 rounded-lg bg-amber-50 p-6">
              <Shield className="mb-3 text-amber-600" size={32} />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Sfat Profesional: Protejarea Obiectelor Fragile
              </h3>
              <p className="text-gray-700">
                Obiectele fragile (pahare, farfurii, decorațiuni) necesită atenție specială.
                Înfășoară fiecare piesă individual în bubble wrap sau hârtie, apoi umple spațiile
                goale din cutie cu material de umplutură. Marchează clar cutiile cu{" "}
                <strong>&ldquo;FRAGIL&rdquo;</strong> pe toate părțile.
              </p>
            </div>

            <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-900">
              Tehnici de Împachetare pe Categorii
            </h2>

            <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-800">Haine și Textile</h3>
            <p className="mb-4 text-gray-700">
              Hainele pot fi păstrate pe umerașe și acoperite cu folii de protecție, sau împăturite
              în cutii mari. Pentru economie de spațiu, folosește saci de vidat pentru lenjerie și
              pături. Textilele delicate (rochii de seară, costume) necesită cutii speciale cu
              umerașe.
            </p>

            <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-800">
              Electrocasnice și Electronice
            </h3>
            <p className="mb-4 text-gray-700">
              Ideal este să folosești cutiile originale. Dacă nu le mai ai, înfășoară fiecare aparat
              în bubble wrap și fixează cu bandă adezivă. Scoate toate cablurile și pune-le în pungi
              separate etichetate. Fotografiază conexiunile complexe înainte de deconectare pentru o
              reinstalare ușoară.
            </p>

            <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-800">Cărți și Documente</h3>
            <p className="mb-4 text-gray-700">
              Cărțile sunt grele, așa că folosește cutii mici pentru a evita supraîncărcarea.
              Pune-le pe verticală (ca pe raft) pentru protecție maximă. Documentele importante
              păstrează-le într-o mapă separată pe care o transporți personal, nu le lăsa în camion.
            </p>

            <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-800">Bucătărie</h3>
            <p className="mb-4 text-gray-700">
              Farfuriile se împachetează vertical (nu stivuite orizontal) separate prin carton sau
              bubble wrap. Paharele se înfășoară individual și se așază cu gura în jos. Cuțitele se
              leagă împreună cu carton pe partea ascuțită pentru siguranță.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-900">
              Sistem de Etichetare și Organizare
            </h2>
            <p className="mb-4 text-gray-700">
              Un sistem clar de etichetare te salvează de haos la destinație:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li>
                <strong>Culori pe cameră</strong> - roșu pentru bucătărie, albastru pentru dormitor,
                etc.
              </li>
              <li>
                <strong>Numerotare</strong> - &ldquo;Cutia 1/20&rdquo; pentru a ști ce lipsește
              </li>
              <li>
                <strong>Conținut scurt</strong> - &ldquo;Bucătărie - Vesela de zi cu zi&rdquo;
              </li>
              <li>
                <strong>Prioritate</strong> - &ldquo;DESCHIDE PRIMUL&rdquo; pentru esențiale
              </li>
              <li>
                <strong>Manevrare</strong> - &ldquo;FRAGIL&rdquo;, &ldquo;SUS&rdquo;,
                &ldquo;JOS&rdquo; unde e necesar
              </li>
            </ul>

            <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-900">
              Cutia de Prioritate - Prima Zi
            </h2>
            <p className="mb-4 text-gray-700">
              Pregătește o cutie specială cu tot ce ai nevoie în prima zi la noua locuință:
            </p>
            <ul className="mb-6 space-y-1 text-gray-700">
              <li>• Lenjerie de pat și prosoape</li>
              <li>• Produse de igienă personală</li>
              <li>• Medicamente</li>
              <li>• Haine pentru 2-3 zile</li>
              <li>• Încărcătoare telefon/laptop</li>
              <li>• Veselă de bază și tacâmuri</li>
              <li>• Gustări și cafea/ceai</li>
              <li>• Documente importante</li>
              <li>• Unelte de bază (șurubelniță, ciocan)</li>
            </ul>

            <div className="my-8 rounded-lg bg-emerald-50 p-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Când să Apelezi la Servicii Profesionale
              </h3>
              <p className="mb-4 text-gray-700">
                Dacă timpul este limitat sau ai obiecte de valoare (tablouri, antichități,
                instrumente muzicale), serviciile profesionale de împachetare merită investiția.
                Firmele specializate folosesc materiale premium și tehnici dovedite pentru protecție
                maximă.
              </p>
              <p className="text-gray-700">
                <strong>Primește oferte gratuite</strong> de la firme verificate prin platforma
                noastră. Compară prețuri și servicii pentru împachetare profesională!
              </p>
            </div>

            <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-900">Timeline de Împachetare</h2>
            <div className="mb-6 space-y-4">
              <div className="rounded-lg border-l-4 border-emerald-500 bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-gray-900">3 săptămâni înainte</h4>
                <p className="text-sm text-gray-700">
                  Comenzi materiale, sortezi și declutter-uiești (donează/aruncă ce nu mai
                  folosești)
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-sky-500 bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-gray-900">2 săptămâni înainte</h4>
                <p className="text-sm text-gray-700">
                  Împachetezi obiectele din debara, decorațiunile și lucrurile rar folosite
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-amber-500 bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-gray-900">1 săptămână înainte</h4>
                <p className="text-sm text-gray-700">
                  Cărți, veselă neesentială, haine sezoniere, electrocasnice neprioritare
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-rose-500 bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-gray-900">Ultimele 2 zile</h4>
                <p className="text-sm text-gray-700">
                  Haine zilnice, produse de igienă, bucătărie esențială, electronice folosite zilnic
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-lg bg-linear-to-r from-emerald-500 to-sky-500 p-8 text-center text-white">
            <h3 className="mb-4 text-2xl font-bold">Primește Oferte pentru Mutarea Ta!</h3>
            <p className="mb-6">
              Compară prețuri de la firme verificate. Servicii complete: transport, împachetare și
              demontare mobilier.
            </p>
            <Link
              href="/customer/dashboard"
              className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-emerald-600 transition hover:bg-gray-100"
            >
              Cere Oferte Gratuite
            </Link>
          </div>
        </article>
      </LayoutWrapper>
    </>
  );
}
