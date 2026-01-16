// Script pentru crearea FAQ-urilor pentru toate paginile de servicii
// Acesta este un fișier helper - FAQs organizate pe categorii

export const SERVICE_FAQS = {
  case: [
    {
      question: "Cât costă mutarea unei case în România?",
      answer: "Prețurile orientative sunt: 1.500-2.500 lei pentru case mici (2-3 camere), 2.500-4.000 lei pentru case medii (4-5 camere) și 5.000+ lei pentru vile mari. Depinde de volum, distanță și servicii suplimentare.",
    },
    {
      question: "Cât durează o mutare de casă?",
      answer: "Mutarea unei case durează de obicei 6-12 ore pentru case medii și până la 2 zile pentru vile mari cu multe bunuri. Timpul depinde de volumul mobilei, grădină și necesitatea de demontare/montare.",
    },
    {
      question: "Ce vehicule sunt necesare pentru mutarea unei case?",
      answer: "Pentru case sunt necesare camioane mari (3.5t, 7.5t sau chiar TIR pentru vile mari). Firmele de pe platformă au vehicule potrivite pentru volume mari de mobilă și obiecte grele.",
    },
    {
      question: "Pot solicita și transport pentru mobilier de grădină?",
      answer: "Da! Firmele partenere transportă tot ce ai: mobilier terasă, grătare, jardiniere mari, sculă de grădină și echipamente exterioare voluminoase.",
    },
  ],
  studenti: [
    {
      question: "Cât costă o mutare pentru studenți?",
      answer: "Prețurile pentru studenți sunt reduse: 300-600 lei pentru mutări locale (garsoniere/cămine) și 500-1.000 lei pentru mutări între orașe. Multe firme oferă reduceri speciale pentru studenți.",
    },
    {
      question: "Pot muta doar câteva bagaje fără mobilă?",
      answer: "Da! Multe firme oferă servicii de transport bagaje/cutii pentru studenți. Este perfect pentru mutări între cămine sau când ai doar bunuri personale.",
    },
    {
      question: "Există reduceri pentru studenți?",
      answer: "Da! Multe firme de pe platformă oferă prețuri speciale pentru studenți, mai ales în perioadele de început și sfârșit de an universitar (septembrie și iulie).",
    },
    {
      question: "Cât durează o mutare de student?",
      answer: "Mutarea unui student durează de obicei 1-2 ore pentru cămine/garsoniere cu puține bunuri. Este rapid dacă ai deja totul împachetat.",
    },
  ],
  birouri: [
    {
      question: "Cât costă relocarea unui birou?",
      answer: "Prețurile variază între 1.500-5.000+ lei pentru birouri mici (10-20 angajați) și pot depăși 10.000 lei pentru birouri mari cu sute de angajați. Depinde de echipamente IT, mobilier și necesitate planificare.",
    },
    {
      question: "Puteți face mutarea în weekend sau noaptea?",
      answer: "Da! Firmele specializate în mutări birouri oferă servicii weekend și noapte pentru a minimiza downtime-ul business-ului tău. Acest lucru poate costa cu 20-30% mai mult.",
    },
    {
      question: "Cum se transportă echipamentele IT și serverele?",
      answer: "Firmele partenere au experiență cu echipamente IT delicate. Folosesc lăzi speciale antistatice, protecție ESD și asigurare extinsă pentru servere și hardware scump.",
    },
    {
      question: "Oferă firmele și servicii de instalare la noua locație?",
      answer: "Da! Multe firme oferă servicii complete: demontare, transport, montare și chiar configurare mobilier birou (birouri, scaune ergonomice, dulapuri arhivă).",
    },
  ],
  piane: [
    {
      question: "Cât costă transportul unui pian?",
      answer: "Prețurile orientative: 400-700 lei pentru pian vertical (local), 800-1.500 lei pentru pian vertical între orașe și 1.500-3.000+ lei pentru piane cu coadă care necesită echipă mare și echipament special.",
    },
    {
      question: "Este nevoie de echipamente speciale pentru mutarea unui pian?",
      answer: "Da! Pianele necesită cărucioare speciale cu suspensie, curele de ridicare profesionale, protecții pături groase și rampă pentru urcarea în camion. Firmele specializate au toate aceastea.",
    },
    {
      question: "Se va dezacorda pianul după mutare?",
      answer: "Este normal ca pianul să se dezacordeze ușor după transport. Recomandăm acordarea după 2-4 săptămâni de la mutare, când s-a adaptat la noile condiții de temperatură și umiditate.",
    },
    {
      question: "Ce asigurare este disponibilă pentru transport piane?",
      answer: "Firmele oferă asigurare extinsă pentru piane. Declară valoarea reală a pianului pentru acoperire completă în caz de daune (rare cu specialiști).",
    },
  ],
  impachetare: [
    {
      question: "Cât costă serviciul de împachetare profesională?",
      answer: "Prețurile orientative din piață: 150-300 lei pentru garsoniere, 300-600 lei pentru apartamente 2-3 camere și 600-1.200 lei pentru apartamente/case mari. Include materiale și manoperă.",
    },
    {
      question: "Ce materiale sunt incluse în serviciu?",
      answer: "Firmele folosesc: cutii profesionale rezistente, bubble wrap, hârtie de protecție, folie stretch, protecții pentru colțuri, markere de etichetare și scotch profesional.",
    },
    {
      question: "Cât timp economisesc cu împachetare profesională?",
      answer: "O echipă profesionistă împachetează un apartament 3 camere în 2-3 ore. Singur ai nevoie de 6-8 ore. Economisești timp prețios și reduci riscul de daune cu 15-20%.",
    },
    {
      question: "Pot cere împachetare doar pentru anumite obiecte fragile?",
      answer: "Da! Poți solicita împachetare selectivă doar pentru: veselă, tablouri, electronice sau antichități. Multe firme oferă pachete flexibile.",
    },
  ],
  montaj: [
    {
      question: "Cât costă demontarea și montarea mobilei?",
      answer: "Prețurile orientative pe piață: 80-120 lei pentru dulap simplu, 150-250 lei pentru dulap mare PAX, 100-150 lei pentru pat și 400-1.200 lei pentru pachet complet apartament.",
    },
    {
      question: "Ce tipuri de mobilă pot demonta/monta?",
      answer: "Firmele lucrează cu: dulapuri (IKEA, personalizate), paturi, canapele extensibile, mobilă bucătărie, birouri, biblioteci și chiar mobilier antichități cu atenție specială.",
    },
    {
      question: "Vin montatorii cu sculele lor?",
      answer: "Da! Montatorii profesioniști vin cu scule profesionale complete. Nu trebuie să cumperi sau să împrumuți nimic.",
    },
    {
      question: "Ce se întâmplă dacă mobilierul se deteriorează?",
      answer: "Montatorii profesioniști au experiență și etichetează piesele sistematic. Dacă se identifică deteriorări preexistente, te vor anunța. Lucrările sunt garantate.",
    },
  ],
  depozitare: [
    {
      question: "Cât costă depozitarea mobilei?",
      answer: "Prețurile orientative pe piață: 150-300 lei/lună pentru boxe mici (2-5m²), 300-600 lei/lună pentru boxe medii (5-10m²) și 600-1.500 lei/lună pentru boxe mari (10-25m²). Depinde de locație și facilități.",
    },
    {
      question: "Sunt spațiile climatizate și securizate?",
      answer: "Da! Furnizorii de pe platformă oferă: climatizare controlată, monitorizare video 24/7, alarme și acces restrict cu carduri. Mobilierul tău este în siguranță.",
    },
    {
      question: "Pot accesa boxul oricând?",
      answer: "Majoritatea facilităților oferă acces 24/7 sau program extins (7:00-22:00). Verifică condițiile specifice în oferta primită.",
    },
    {
      question: "Este necesară asigurare pentru bunurile depozitate?",
      answer: "Unele facilități includ asigurare de bază, altele o oferă opțional. Recomandăm asigurare pentru obiecte valoroase sau depozitare pe termen lung.",
    },
  ],
  debarasare: [
    {
      question: "Cât costă debarasarea mobilei vechi?",
      answer: "Prețurile orientative: 150-300 lei pentru câteva piese, 400-800 lei pentru debarasare apartament mic și 1.000-2.500 lei pentru debarasare completă căsuță/apartament mare.",
    },
    {
      question: "Se reciclează materialele evacuate?",
      answer: "Da! Firmele responsabile de pe platformă separă materialele reciclabile (lemn, metal, plastic, carton) și le duc la centre de reciclare. Este eco-friendly.",
    },
    {
      question: "Cât de rapid pot programa o debarasare?",
      answer: "Multe firme oferă servicii în aceeași zi sau a doua zi. Pentru debarasări urgente, specifică în cerere și vei primi oferte rapide.",
    },
    {
      question: "Trebuie să cobor eu mobilele?",
      answer: "Nu! Echipa se ocupă de tot: coboară mobilierul de la orice etaj, încarcă în camion și transportă la depozit/reciclare. Zero efort din partea ta.",
    },
  ],
};
