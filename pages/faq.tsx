import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import { HelpCircle, Check } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "Ce este OferteMutare.ro?",
          a: "OferteMutare.ro este o platformă gratuită care conectează clienții cu firme de mutări verificate din România. Completezi un singur formular și primești 3-5 oferte personalizate în 24 ore.",
        },
        {
          q: "Serviciul este cu adevărat gratuit?",
          a: "Da, 100% gratuit pentru clienți! Nu există costuri ascunse. Firmele de mutări plătesc un comision mic, astfel platforma rămâne gratuită pentru utilizatori.",
        },
        {
          q: "Câte oferte voi primi?",
          a: "De obicei primești între 3-5 oferte de la firme verificate în termen de 24 ore. Numărul depinde de disponibilitatea firmelor în zona ta și complexitatea mutării.",
        },
        {
          q: "Sunt obligat să aleg una din oferte?",
          a: "Nu, nu există nicio obligație! Poți compara ofertele primite și alegi doar dacă găsești ceva potrivit. Dacă nicio ofertă nu te mulțumește, nu ești obligat să accepți.",
        },
      ],
    },
    {
      category: "Procesul de Solicitare",
      questions: [
        {
          q: "Cum funcționează procesul?",
          a: "1) Completezi formularul cu detalii despre mutare (5 minute), 2) Firmele verificate primesc cererea ta, 3) Primești 3-5 oferte în 24h, 4) Compari și alegi oferta potrivită, 5) Confirmarea directă cu firma aleasă.",
        },
        {
          q: "Ce informații trebuie să furnizez?",
          a: "Informații de bază: adresele de la și către, numărul de camere, data dorită, servicii suplimentare (ambalare, demontare, etc.), și date de contact pentru a primi ofertele.",
        },
        {
          q: "Pot modifica cererea după ce am trimis-o?",
          a: "Da! După autentificare în contul de client, poți edita detaliile cererii, adăuga/șterge fotografii sau anula cererea complet dacă planurile s-au schimbat.",
        },
        {
          q: "Cât timp durează până primesc ofertele?",
          a: "Majoritatea clienților primesc prima ofertă în câteva ore. Toate ofertele sosesc de obicei în 24 ore. În perioade aglomerate (weekenduri, sfârșitul lunii) poate dura până la 48h.",
        },
      ],
    },
    {
      category: "Firmele de Mutări",
      questions: [
        {
          q: "Cum sunt verificate firmele?",
          a: "Verificăm: CUI valid și firmă activă, asigurare de răspundere civilă, recenzii de la clienți reali, experiență în domeniu (minim 1 an), echipament profesional și personal specializat.",
        },
        {
          q: "Ce fac dacă am probleme cu o firmă?",
          a: "Contactează-ne imediat la contact@ofertemutare.ro. Investigăm toate reclamațiile și, dacă firma nu respectă standardele, este exclusă de pe platformă. De asemenea, poți lăsa o recenzie după mutare.",
        },
        {
          q: "Pot vedea recenzii despre firme înainte să aleg?",
          a: "Da! Fiecare ofertă include rating-ul și recenziile firmei. Poți citi experiențele altor clienți pentru a lua o decizie informată.",
        },
        {
          q: "Firmele oferă asigurare pentru bunuri?",
          a: "Da, firmele serioase oferă asigurare standard (50-100 lei/m³). Pentru obiecte valoroase (>5.000 lei), poți cere asigurare suplimentară. Verifică întotdeauna detaliile în contract.",
        },
      ],
    },
    {
      category: "Prețuri și Plata",
      questions: [
        {
          q: "Cât costă o mutare în România?",
          a: "Depinde de: distanță, volum, etaj, acces, servicii extra. Orientativ: garsonieră 800-1.500 lei, 2 camere 1.500-2.500 lei, 3+ camere 2.500-4.500 lei, casă/vilă 4.000-10.000+ lei.",
        },
        {
          q: "Cum plătesc firma de mutări?",
          a: "Plata se face direct către firma aleasă, nu prin platformă. Majoritatea firmelor cer avans (20-30%) la rezervare și restul la finalizarea mutării. Metode acceptate: cash, transfer bancar, card.",
        },
        {
          q: "Pot negocia prețul din ofertă?",
          a: "Da! Prețurile nu sunt fixe. Poți negocia cu firmele, mai ales dacă ai oferte competitive de la mai multe companii. Firmele sunt adesea dispuse să reducă 5-10%.",
        },
        {
          q: "Ce costuri suplimentare pot apărea?",
          a: "Posibile costuri extra: etaje fără lift (50-100 lei/etaj), acces dificil (parcare departe), mutare weekend/sărbători (+15-20%), transport la gunoi, materiale ambalare suplimentare.",
        },
      ],
    },
    {
      category: "Ziua Mutării",
      questions: [
        {
          q: "Trebuie să fiu prezent în timpul mutării?",
          a: "Da, este recomandat să fii prezent la ambele locații pentru a coordona echipa, verifica încărcarea/descărcarea și semna procesul-verbal de predare-primire.",
        },
        {
          q: "Cât durează o mutare?",
          a: "Depinde de volum și distanță: garsonieră 2-4h, apartament 2 camere 4-6h, 3+ camere 6-10h, casă 8-16h. Include încărcare, transport și descărcare.",
        },
        {
          q: "Ce fac dacă apar deteriorări?",
          a: "Documentează imediat cu poze/video, nu semna procesul-verbal fără să menționezi daunele, contactează firma și asiguratorul lor. Păstrează factura și contractul pentru reclamații.",
        },
        {
          q: "Pot anula sau reprograma mutarea?",
          a: "Da, dar respectă termenele din contract. De obicei: anulare cu >7 zile = rambursare avans, 3-7 zile = 50% avans, <3 zile = pierdere avans. Reprogramarea de obicei e gratuită cu >48h avans.",
        },
      ],
    },
    {
      category: "Cont și Date Personale",
      questions: [
        {
          q: "Trebuie să creez cont pentru a solicita oferte?",
          a: "Nu inițial! Poți completa formularul fără cont. După trimitere, vei primi un email pentru a-ți crea cont și a gestiona cererile și ofertele primite.",
        },
        {
          q: "Ce faceți cu datele mele personale?",
          a: "Le folosim doar pentru a-ți trimite oferte și a facilita comunicarea cu firmele. Nu vindem/partajăm datele cu terțe părți. Vezi Politica de confidențialitate pentru detalii complete.",
        },
        {
          q: "Pot șterge contul și datele mele?",
          a: "Da, oricând! Accesează Setările contului și alege 'Șterge cont'. Toate datele tale vor fi șterse permanent în conformitate cu GDPR.",
        },
        {
          q: "Primesc spam după ce solicit oferte?",
          a: "Nu! Primești doar ofertele solicitate de la firmele verificate. Nu vindem email-ul tău către terțe părți și nu trimitem newsletter decât dacă te abonezi explicit.",
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Întrebări Frecvente (FAQ) | OferteMutari.ro</title>
        <meta
          name="description"
          content="Răspunsuri la cele mai frecvente întrebări despre OferteMutari.ro: cum funcționează, prețuri, firme verificate, proces de solicitare și mai mult."
        />
      </Head>

      <LayoutWrapper>
        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 p-3 shadow-sm">
              <HelpCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-slate-900">
              Întrebări{" "}
              <span className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1 text-white">
                Frecvente
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Răspunsuri clare la cele mai comune întrebări despre platformă, proces, prețuri și mai
              mult.
            </p>
          </div>

          {/* Quick Contact */}
          <div className="mb-12 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6">
            <p className="text-center text-gray-700">
              <strong>Nu găsești răspunsul?</strong> Contactează-ne la{" "}
              <a
                href="mailto:contact@ofertemutare.ro"
                className="font-semibold text-emerald-600 underline hover:text-emerald-700"
              >
                contact@ofertemutare.ro
              </a>
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="mb-6 text-2xl font-bold text-gray-800">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, qIndex) => (
                    <details
                      key={qIndex}
                      className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <summary className="flex cursor-pointer items-start justify-between gap-4 font-semibold text-gray-800 hover:text-emerald-600">
                        <span className="flex-1">{faq.q}</span>
                        <Check className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-500 opacity-0 transition-opacity group-open:opacity-100" />
                      </summary>
                      <p className="mt-4 leading-relaxed text-gray-600">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-center text-white">
            <h3 className="mb-4 text-2xl font-bold">Gata să Începi?</h3>
            <p className="mb-6 text-lg">
              Solicită oferte gratuite de la cele mai bune firme de mutări din România
            </p>
            <Link
              href="/customer/dashboard"
              className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-emerald-600 transition-transform hover:scale-105 hover:shadow-lg"
            >
              Solicită Oferte Gratuite
            </Link>
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
}
