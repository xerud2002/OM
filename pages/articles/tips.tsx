import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import {
  DollarSign,
  Clock,
  Shield,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Users,
  Package,
  Truck,
  Home,
  Star,
  MessageCircle,
} from "lucide-react";

export default function ArticleTips() {
  return (
    <>
      <Head>
        <title>
          50+ Sfaturi Expert Pentru Mutări în România | Trucuri, Economii & Best Practices
        </title>
        <meta
          name="description"
          content="Cele mai bune sfaturi pentru mutări în 2025: cum economisești până la 40%, când e cel mai ieftin să te muți, cum eviți greșelile comune și trucuri de la profesioniști."
        />
        <meta
          name="keywords"
          content="sfaturi mutări, trucuri mutare, economii mutare, best practices, cum economisesc la mutare, mutare ieftină, sfaturi profesionale, erori mutare"
        />
        <meta property="og:title" content="50+ Sfaturi Expert Pentru Mutări în România" />
        <meta
          property="og:description"
          content="Ghid complet cu trucuri și sfaturi de la profesioniști: economisește bani, timp și stres la mutare."
        />
        <meta property="og:type" content="article" />
        <link rel="canonical" href="https://ofertemutari.ro/articles/tips" />
      </Head>

      <LayoutWrapper>
        <article className="mx-auto max-w-4xl px-4 py-12">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-emerald-700 md:text-5xl">
              50+ Sfaturi Expert Pentru Mutări în România
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Trucuri, economii și best practices de la profesioniști cu zeci de ani de experiență.
              Tot ce trebuie să știi pentru o mutare perfectă în 2025.
            </p>
          </header>

          {/* Stats Banner */}
          <section className="mb-12 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold">40%</div>
                <div className="text-sm opacity-90">Economie medie cu sfaturile noastre</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold">6h</div>
                <div className="text-sm opacity-90">Timp economisit prin planificare corectă</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold">95%</div>
                <div className="text-sm opacity-90">
                  Clienți mulțumiți care aplică aceste sfaturi
                </div>
              </div>
            </div>
          </section>

          {/* Money Saving Tips */}
          <section className="mb-16">
            <div className="mb-8 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-800">Cum Economisești Bani La Mutare</h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-green-800">
                  <TrendingDown className="h-6 w-6" />
                  Alege perioada potrivită (economie: 20-40%)
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <p className="font-semibold">✅ CEL MAI IEFTIN:</p>
                    <ul className="ml-6 mt-1 space-y-1 text-sm">
                      <li>
                        • <strong>Iarna (noiembrie-martie)</strong>: până la 40% mai ieftin decât
                        vara
                      </li>
                      <li>
                        • <strong>Mijlocul săptămânii (marți-joi)</strong>: 15-20% mai ieftin decât
                        weekendul
                      </li>
                      <li>
                        • <strong>Mijlocul lunii (zile 10-20)</strong>: evită sfârșitul de lună când
                        toată lumea se mută
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">❌ CEL MAI SCUMP:</p>
                    <ul className="ml-6 mt-1 space-y-1 text-sm">
                      <li>• Vară (iunie-august) + primăvară (aprilie-mai)</li>
                      <li>• Weekenduri (sâmbătă, duminică)</li>
                      <li>
                        • Sfârșitul lunii (ultimele 5 zile) &ndash; toți studenții și chiriaș se
                        mută
                      </li>
                    </ul>
                  </div>
                  <div className="mt-3 rounded-lg bg-white p-3">
                    <p className="text-sm font-semibold text-green-700">💰 Exemplu concret:</p>
                    <p className="text-sm text-gray-700">
                      Mutare 2 camere București: <strong>Sâmbătă iulie = 2.800 lei</strong> vs.{" "}
                      <strong>Miercuri ianuarie = 1.600 lei</strong> (economie: 1.200 lei!)
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-green-800">
                  <Package className="h-6 w-6" />
                  Reduce volumul cu 30% (economie: 25-35%)
                </h3>
                <div className="text-gray-700">
                  <p className="mb-3">
                    <strong>Regula de aur:</strong> Cu cât mai puține obiecte, cu atât mai ieftin.
                    Firma calculează prețul în funcție de volum și timp.
                  </p>
                  <div className="rounded-lg bg-white p-4">
                    <p className="mb-2 font-semibold">Strategia 4 categorii:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span>
                          <strong>Păstrez</strong> &ndash; lucruri esențiale folosite în ultimele 6
                          luni
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span>
                          <strong>Vând</strong> &ndash; obiecte valoroase neutilizate (Olx, Facebook
                          Marketplace, second-hand)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span>
                          <strong>Donez</strong> &ndash; haine, mobilă în stare bună (Caritas,
                          asociații sociale)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span>
                          <strong>Arunc</strong> &ndash; obiecte stricate sau inutile (centru
                          colectare, Rebu)
                        </span>
                      </li>
                    </ul>
                  </div>
                  <p className="mt-3 text-sm">
                    💡 <strong>Bonus:</strong> Vânzând lucruri vechi, poți recupera 500-2.000 lei
                    pentru bugetul de mutare!
                  </p>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-green-800">
                  <Truck className="h-6 w-6" />
                  Compară MINIM 3 oferte (economie: 15-30%)
                </h3>
                <div className="text-gray-700">
                  <p className="mb-3">
                    Prețurile variază <strong>enorm</strong> între firme &ndash; până la 40%
                    diferență pentru aceeași mutare. <strong>Nu te mulțumi cu prima ofertă!</strong>
                  </p>
                  <div className="rounded-lg bg-white p-4">
                    <p className="mb-2 font-semibold">Pe OferteMutari.ro:</p>
                    <ul className="space-y-1 text-sm">
                      <li>✓ Completezi UN singur formular (3 minute)</li>
                      <li>✓ Primești 3-5 oferte personalizate în 24h</li>
                      <li>✓ 100% gratuit, fără obligație de cumpărare</li>
                      <li>✓ Poți compara prețuri, servicii, recenzii într-un singur loc</li>
                    </ul>
                  </div>
                  <p className="mt-3 text-sm">
                    <strong>Exemplu real:</strong> Client din Cluj a primit 5 oferte între
                    1.800-2.900 lei. A ales a treia ofertă (2.100 lei) &ndash; economie: 800 lei
                    față de cea mai scumpă!
                  </p>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-green-800">
                  <Users className="h-6 w-6" />
                  Alte trucuri de economisire
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span>
                      <strong>Împachetează singur</strong> &ndash; economie 200-500 lei (vs.
                      serviciu de ambalare complet)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span>
                      <strong>Cere cutii gratuite</strong> &ndash; magazine (Kaufland, Lidl),
                      farmacii, librării le dau gratis
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span>
                      <strong>Demontează mobilierul singur</strong> &ndash; economie 150-300 lei
                      (dacă te pricepi!)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span>
                      <strong>Mută singur lucrurile mici</strong> (haine, cărți, obiecte decorative)
                      cu mașina personală înainte de ziua oficială
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span>
                      <strong>Negociază prețul</strong> &ndash; firmele sunt dispuse să reducă 5-10%
                      dacă ceri politicos și ai oferte competitive
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Time Saving Tips */}
          <section className="mb-16">
            <div className="mb-8 flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-800">Economisește Timp și Stres</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
                  <Calendar className="h-6 w-6" />
                  Planificare Avansată
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">6-8 săpt:</span>
                    <span>Solicită oferte și rezervă firma</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">4 săpt:</span>
                    <span>Sortează și vinde lucruri neutilizate</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">3 săpt:</span>
                    <span>Schimbă utilități, anunță banca/job</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">2 săpt:</span>
                    <span>Cumpără materiale și începe ambalarea</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">1 săpt:</span>
                    <span>Finalizează împachetarea, confirmă cu firma</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm italic text-blue-700">
                  Planificare bună = zero panică în ultima zi!
                </p>
              </div>

              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
                  <Package className="h-6 w-6" />
                  Împachetare Inteligentă
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    ✓ <strong>Etichetează TOTUL</strong> (cameră + conținut + fragil)
                  </li>
                  <li>
                    ✓ <strong>Sistem de culori</strong>: roșu=bucătărie, albastru=dormitor, etc.
                  </li>
                  <li>
                    ✓ <strong>Geantă esențiale</strong>: haine 2 zile, medicamente, documente,
                    încărcătoare
                  </li>
                  <li>
                    ✓ <strong>Fotografiază cablurile</strong> electronicelor înainte de deconectare
                  </li>
                  <li>
                    ✓ <strong>Cutii grele jos, ușoare sus</strong> în mașină
                  </li>
                  <li>
                    ✓ <strong>Împachetează cameră cu cameră</strong>, nu haotic din toată casa
                  </li>
                </ul>
                <p className="mt-3 text-sm">
                  💡 Vezi{" "}
                  <Link
                    href="/articles/impachetare"
                    className="font-semibold text-blue-600 underline"
                  >
                    ghidul nostru complet de împachetare
                  </Link>
                </p>
              </div>

              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
                  <Lightbulb className="h-6 w-6" />
                  Trucuri Rapide
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Fotografiază amenajarea veche pentru a replica în casa nouă</li>
                  <li>• Lasă hainele în sertare (închizi sertarele, muți dulapul așa)</li>
                  <li>• Pune folie stretch pe sertare să nu se deschidă</li>
                  <li>• Păstrează șuruburile în pungi Zip etichetate</li>
                  <li>• Fă check-list printată pentru ziua mutării</li>
                  <li>• Pregătește băuturi și gustări pentru echipa de mutare</li>
                </ul>
              </div>

              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
                  <Home className="h-6 w-6" />
                  Ziua Mutării
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • <strong>Fii prezent tot timpul</strong> &ndash; coordonează echipa
                  </li>
                  <li>
                    • <strong>Verifică fiecare cutie</strong> când se încarcă/descarcă
                  </li>
                  <li>
                    • <strong>Fotografiază contoarele</strong> vechi/noi pentru utilități
                  </li>
                  <li>
                    • <strong>Lasă 2-3h buffer</strong> pentru neprevăzut
                  </li>
                  <li>
                    • <strong>Ai cash la tine</strong> pentru bacșiș și eventuale taxe
                  </li>
                  <li>
                    • <strong>Verifică starea locuinței vechi</strong> și fă poze pentru garanție
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Safety & Protection Tips */}
          <section className="mb-16">
            <div className="mb-8 flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-800">
                Protejează-ți Bunurile și Drepturile
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-purple-800">Asigurarea Bunurilor</h3>
                <div className="text-gray-700">
                  <p className="mb-3">
                    <strong>Firmele serioase oferă asigurare standard</strong> (de obicei 50-100
                    lei/m³). Pentru obiecte valoroase (&gt;5.000 lei), cere asigurare suplimentară.
                  </p>
                  <div className="rounded-lg bg-white p-4">
                    <p className="mb-2 font-semibold">Ce verifici în contract:</p>
                    <ul className="space-y-1 text-sm">
                      <li>
                        ✓ <strong>Valoare maximă asigurată</strong> (ex: 10.000 lei acoperire
                        totală)
                      </li>
                      <li>
                        ✓ <strong>Valoare/item</strong> (ex: 1.000 lei/obiect individual)
                      </li>
                      <li>
                        ✓ <strong>Excluderi</strong> (unele nu acoperă electronice, bijuterii,
                        sticle)
                      </li>
                      <li>
                        ✓ <strong>Procedura de daune</strong> (cum reclami, în cât timp, ce
                        documente)
                      </li>
                    </ul>
                  </div>
                  <p className="mt-3 text-sm">
                    ⚠️ <strong>IMPORTANT:</strong> Declară obiectele valoroase în scris ÎNAINTE de
                    mutare. Fotografiază-le și păstrează dovada valorii (facturi).
                  </p>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-purple-800">Contractul De Mutare</h3>
                <div className="text-gray-700">
                  <p className="mb-3">
                    <strong>NU începe mutarea fără contract scris!</strong> Contractul te protejează
                    de prețuri mărite, daune nedeclarate sau servicii neprestate.
                  </p>
                  <div className="rounded-lg bg-white p-4">
                    <p className="mb-2 font-semibold">Ce TREBUIE să conțină contractul:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600" />
                        <span>
                          <strong>Prețul final exact</strong> (nu &ldquo;estimativ&rdquo;) și ce
                          include (transport, echipă, asigurare)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600" />
                        <span>
                          <strong>Data și ora exactă</strong> a mutării
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600" />
                        <span>
                          <strong>Adresele complete</strong> (vechie și nouă, inclusiv etaj, acces)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600" />
                        <span>
                          <strong>Lista serviciilor</strong> (demontare, ambalare, urcare scări,
                          etc.)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600" />
                        <span>
                          <strong>Detalii asigurare</strong> (acoperire, procedura de daune)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600" />
                        <span>
                          <strong>Condiții de anulare</strong> (termene, penalități)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600" />
                        <span>
                          <strong>Date firmă</strong> (CUI, nr. înregistrare, contact)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-red-800">
                  <AlertTriangle className="h-6 w-6" />
                  RED FLAGS: Evită Aceste Firme!
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">🚨</span>
                    <span>
                      <strong>Refuză survey</strong> sau oferă doar estimare telefonică pentru
                      mutări mari
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">🚨</span>
                    <span>
                      <strong>Nu oferă contract scris</strong> sau zice &ldquo;stabilim pe
                      drum&rdquo;
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">🚨</span>
                    <span>
                      <strong>Cer plată integrală în avans</strong> (firmele serioase cer 20-30%
                      avans, restul la finalizare)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">🚨</span>
                    <span>
                      <strong>Nu au CUI valid sau firmă înregistrată</strong> (verifică pe
                      openapi.ro)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">🚨</span>
                    <span>
                      <strong>Recenzii suspecte</strong> (multe pozitive în aceeași zi, fără
                      review-uri negative niciodată)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">🚨</span>
                    <span>
                      <strong>Prețul e &ldquo;prea bun ca să fie adevărat&rdquo;</strong> (50% mai
                      ieftin decât piața &rarr; ascund costuri)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">
              Top 10 Greșeli Comune (și Cum Să Le Eviți)
            </h2>
            <div className="space-y-4">
              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  1. Subestimarea volumului de bunuri
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Crezi că ai puține
                    lucruri, dar în realitate ai dublu.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Fă ÎNTOTDEAUNA un
                    survey (video sau fizic). Lista scrisă cu mobilier mare + număr cutii.
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  2. Rezervarea în ultima clipă
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Firmele bune sunt
                    ocupate, rămâi fără opțiuni sau plătești dublu.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Rezervă cu 4-6
                    săptămâni înainte, mai ales în sezon (aprilie-octombrie).
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  3. Alegerea doar după preț
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Firma ieftină =
                    servicii proaste, întârzieri, daune nedespăgubite.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Compară: preț +
                    recenzii + asigurare + experiență. Diferența de 200 lei poate însemna servicii
                    profesionale.
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  4. Împachetarea prost făcută
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Obiecte sparte,
                    cutii zdrobite, pierdere de timp la despachetare.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Citește{" "}
                    <Link
                      href="/articles/impachetare"
                      className="font-semibold text-emerald-600 underline"
                    >
                      ghidul nostru de împachetare
                    </Link>
                    . Investește în materiale de calitate.
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  5. Nu verifici accesul la ambele locuințe
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Mașina nu intră,
                    liftul e prea mic, trebuie autorizație parcare.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Măsoară: lățime
                    ușă intrare, dimensiuni lift, verifică regulament bloc pentru mașini mari.
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  6. Uitatul de utilități
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Rămâi fără
                    internet/gaze/electricitate în casa nouă.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Sună cu 2-3
                    săptămâni înainte: furnizori energie, gaze, apă, internet. Unele servicii
                    necesită 10-14 zile.
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  7. Nu declari obiectele fragile
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Firma le tratează
                    ca pe cutii normale &rarr; spargeri.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Declară în scris:
                    tablouri, oglinzi, electronice, sticle, antichități. Etichetează FRAGIL pe toate
                    părțile cutiei.
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  8. Lipsa planului pentru ziua mutării
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Haos, stres,
                    confuzie, uiți lucruri importante.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Check-list
                    printată: ce intră în mașină primul, ce rămâne ultimul, ce duci tu personal,
                    numere telefon importante.
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  9. Nu faci poze/video înainte de mutare
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Dacă sunt daune,
                    nu ai dovezi pentru asigurare.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Fotografiază:
                    mobilierul valoros, starea locuinței vechi, contorii. Video rapid prin toată
                    casa nouă (la preluare).
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-emerald-600">
                  10. Nu lași timp pentru neprevăzut
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-red-600">Problema:</span> Trafic, lift
                    blocat, cheie uită, furtună &rarr; program haotic.
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Soluția:</span> Lasă 2-3h buffer
                    în ziua mutării. Dacă firma zice 4h, planifică 6-7h să fii sigur.
                  </p>
                </div>
              </details>
            </div>
          </section>

          {/* Pro Tips from Experts */}
          <section className="mb-16 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-8">
            <div className="mb-6 flex items-center gap-3">
              <Star className="h-8 w-8 text-amber-600" />
              <h2 className="text-3xl font-bold text-gray-800">
                Sfaturi PRO de la Mutători cu 15+ Ani Experiență
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-amber-800">
                  🏆 Trucuri pe care clienții nu le știu:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • <strong>Hainele în valiză</strong> (nu cutie) &rarr; economisești spațiu și
                    cutii
                  </li>
                  <li>
                    • <strong>Prosoapele/paturiile = ambalaj</strong> pentru obiecte fragile
                    (economisești bubble wrap)
                  </li>
                  <li>
                    • <strong>Cutiile de pizza/băuturi</strong> sunt GRELE &rarr; ia cutii mici
                    pentru cărți/conserve
                  </li>
                  <li>
                    • <strong>Congelatorul</strong> trebuie decongelat cu 24h înainte (riști să
                    plouă în mașină)
                  </li>
                  <li>
                    • <strong>Plantele</strong> trebuie îngrijite special: udă cu 2 zile înainte, nu
                    în ziua mutării
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-amber-800">
                  💎 Secrete de eficiență maximă:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • <strong>Camera copiilor ultima</strong> &rarr; îi ții ocupați cu jucăriile
                    până la final
                  </li>
                  <li>
                    • <strong>Bucătăria prima</strong> în casa nouă &rarr; poți face cafeaua/masa
                    imediat
                  </li>
                  <li>
                    • <strong>Verifică priza internet</strong> în camera nouă DIN TIMP (unele nu
                    sunt activate)
                  </li>
                  <li>
                    • <strong>Rezervă lift</strong> în ziua mutării (blochează-l 2-3h pentru tine
                    exclusiv)
                  </li>
                  <li>
                    • <strong>Întreabă vecinii noi</strong> despre quirks-urile blocului (când vine
                    gunoiul, cine e administratorul)
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-lg border-2 border-amber-300 bg-white p-4">
              <p className="font-semibold text-amber-800">🎯 Secretul final:</p>
              <p className="text-gray-700">
                <strong>&ldquo;Cea mai bună mutare este cea bine planificată.&rdquo;</strong> Nu
                există mutare perfectă, dar cu pregătire corectă, poți reduce stresul cu 80% și
                costurile cu 30-40%. Investește timp în planificare &ndash; se întoarce înzecit!
              </p>
            </div>
          </section>

          {/* Final Checklist */}
          <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">
              Checklist Final: Ești Pregătit Pentru Mutare?
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
                <h3 className="mb-4 font-semibold text-emerald-800">✅ Cu 1 Lună Înainte</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>☐ Am solicitat 3-5 oferte (pe OferteMutari.ro)</li>
                  <li>☐ Am făcut survey (fizic sau video)</li>
                  <li>☐ Am rezervat firma și semnat contractul</li>
                  <li>☐ Am sortat și vândut lucruri neutilizate</li>
                  <li>☐ Am anunțat proprietarul/angajatorul</li>
                </ul>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                <h3 className="mb-4 font-semibold text-blue-800">✅ Cu 2 Săptămâni Înainte</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>☐ Am schimbat utilități (electricitate, gaze, apă, internet)</li>
                  <li>☐ Am actualizat adresa la bancă, job, primărie</li>
                  <li>☐ Am cumpărat materiale de ambalare</li>
                  <li>☐ Am început împachetarea (cameră cu cameră)</li>
                  <li>☐ Am programat curățenie finală (dacă e cazul)</li>
                </ul>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
                <h3 className="mb-4 font-semibold text-purple-800">✅ Cu 1 Săptămână Înainte</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>☐ Am împachetat 90% din lucruri</li>
                  <li>☐ Am etichetat toate cutiile</li>
                  <li>☐ Am confirmat cu firma (dată, oră, adrese)</li>
                  <li>☐ Am pregătit &ldquo;geanta de supraviețuire&rdquo;</li>
                  <li>☐ Am verificat accesul la ambele locuințe</li>
                </ul>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <h3 className="mb-4 font-semibold text-red-800">✅ În Ziua Mutării</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>☐ Am cash pentru bacșiș și eventuale taxe</li>
                  <li>☐ Am check-list printată cu mine</li>
                  <li>☐ Am fotografiat contoarele vechi/noi</li>
                  <li>☐ Am verificat încărcarea fiecărei cutii</li>
                  <li>☐ Am predat cheile și am documentat starea locuinței vechi</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-center text-white">
            <div className="mb-4 flex justify-center">
              <MessageCircle className="h-12 w-12" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">
              Primește Sfaturi Personalizate și Oferte Gratuite
            </h2>
            <p className="mb-6 text-lg">
              Completează formularul și primești 3-5 oferte personalizate + ghid complet de la
              experți. 100% gratuit, fără obligații.
            </p>
            <Link
              href="/form"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-emerald-600 transition-transform hover:scale-105 hover:shadow-lg"
            >
              <Truck className="h-5 w-5" />
              Solicită Oferte Gratuite Acum
            </Link>
            <p className="mt-4 text-sm opacity-90">
              ⏱️ Răspuns în max 24h • 50.000+ clienți mulțumiți
            </p>
          </section>

          {/* Related Articles */}
          <section>
            <h3 className="mb-4 text-2xl font-bold text-gray-800">
              Ghiduri Detaliate Complementare
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/articles/pregatire"
                className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
              >
                <h4 className="mb-2 font-semibold text-emerald-700">Pregătirea Pentru Mutare</h4>
                <p className="text-sm text-gray-600">Planificare pas cu pas în 8 săptămâni</p>
              </Link>
              <Link
                href="/articles/impachetare"
                className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
              >
                <h4 className="mb-2 font-semibold text-emerald-700">Ghid Împachetare</h4>
                <p className="text-sm text-gray-600">Tehnici profesionale și materiale</p>
              </Link>
              <Link
                href="/articles/survey"
                className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
              >
                <h4 className="mb-2 font-semibold text-emerald-700">Tipuri de Survey</h4>
                <p className="text-sm text-gray-600">Fizic, video sau estimare rapidă?</p>
              </Link>
            </div>
          </section>
        </article>
      </LayoutWrapper>
    </>
  );
}
