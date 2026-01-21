// utils/citySlugData.ts
// SEO-optimized city data for dynamic /mutari/[city] pages

export interface CityData {
  slug: string;
  name: string;
  county: string;
  population: string;
  tier: 1 | 2;
  landmarks: string[];
  neighborhoods: string[];
  metaDescription: string;
  heroSubtitle: string;
  // Unique SEO content
  articleIntro?: string;
  whyChooseUs?: string[];
  localTips?: string[];
  priceContext?: string;
}

// Helper to create URL-friendly slugs from Romanian city names
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/ș/g, "s")
    .replace(/ț/g, "t")
    .replace(/ă/g, "a")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export const cityData: CityData[] = [
  // Tier 1 - Major Cities (10)
  {
    slug: "bucuresti",
    name: "București",
    county: "București",
    population: "2.100.000",
    tier: 1,
    landmarks: ["Palatul Parlamentului", "Centrul Vechi", "Parcul Herăstrău"],
    neighborhoods: ["Militari", "Drumul Taberei", "Titan", "Berceni", "Pipera", "Dorobanți"],
    metaDescription:
      "Servicii de mutări în București ✓ Compară 3-5 oferte gratuite de la firme verificate ✓ Economisește până la 40% ✓ Transport mobilă în toate sectoarele",
    heroSubtitle:
      "Capitala României merită firme de mutări de top. Primește oferte personalizate pentru mutarea ta în București.",
    articleIntro:
      "Cu peste 2,1 milioane de locuitori și 6 sectoare distincte, București este cel mai mare oraș din România și hub-ul principal pentru servicii de mutări. Datorită traficului intens, accesului dificil în cartiere precum Drumul Taberei sau Militari și  complexității blocurilor fără lift, alegerea firmei potrivite face diferența între o mutare fără stres și o experiență dificilă. Pe OferteMutare.ro, compari instantaneu firme experimentate din fiecare sector, care cunosc perfect provocările Capitalei - de la parcarea camionului pe șosele aglomerate la navigarea în cartiere cu străzi înguste.",
    whyChooseUs: [
      "Firme specializate pe sectoare: Fie că te muți din Pipera în Berceni sau din Militari în Dorobanți, găsești firme care știu perfect zona ta.",
      "Experiență cu blocuri fără lift: Companiile noastre au echipamente și echipe pentru blocuri de 10 etaje din Drumul Taberei sau Titan.",
      "Flexibilitate orară pentru trafic: Firmele oferă mutări în weekend sau seara pentru a evita aglomerația din București.",
    ],
    localTips: [
      "**Rezervă din timp în sezonul de vară**: Mai-septembrie sunt lunile de vârf pentru mutări în București. Firmele bune se ocupă cu 2-3 săptămâni înainte.",
      "**Verifică restricțiile de parcare**: În sectoare precum Sector 1 (Dorobanți, Primăverii) există zone cu acces restricționat pentru camioane mari. Informează firma din timp.",
      "**Solicită recunoaștere**: Pentru mutări complexe din case mari în Băneasa sau apartamente de lux din Pipera, cere firmei o vizită prealabilă pentru estimare precisă.",
    ],
    priceContext:
      "În București, prețurile variază semnificativ în funcție de sector și complexitatea mutării. Mutările în blocuri vechi fără lift din Drumul Taberei sau Militari (800-1200 lei pentru 2 camere) sunt mai scumpe decât cele din complexe noi cu lift din Pipera (600-900 lei). Traficul și distanțele mari între sectoare influențează costurile - o mutare din Berceni în Pipera poate costa cu 20-30% mai mult decât una locală.",
  },
  {
    slug: "cluj-napoca",
    name: "Cluj-Napoca",
    county: "Cluj",
    population: "324.000",
    tier: 1,
    landmarks: ["Piața Unirii", "Cetățuia", "Grădina Botanică"],
    neighborhoods: ["Mărăști", "Gheorgheni", "Mănăștur", "Zorilor", "Bună Ziua", "Borhanci"],
    metaDescription:
      "Mutări în Cluj-Napoca ✓ 3-5 oferte GRATUITE în 24h ✓ Firme verificate ✓ Transport mobilă, împachetare, depozitare ✓ Economisește 40%",
    heroSubtitle:
      "Inima Transilvaniei, centru universitar și IT. Mutări profesionale pentru clujeni exigenți.",
    articleIntro:
      "Cluj-Napoca este capitala neoficială a Transilvaniei și cel mai dinamic oraș universitar din România, cu peste 100.000 de studenți și o piață imobiliară în continuă expansiune. Datorită prețurilor ridicate, clujenii se mută frecvent între cartiere - din Mănăștur accesibil către Zorilor sau din Gheorgheni către complexele noi din Bună Ziua. Terenul accidentat (dealuri, străzi în pantă) și blocurile vechi din Mărăști necesită firme cu experiență locală. OferteMutare.ro conectează cu companii care cunosc perfect provocările Clujului și oferă servicii adaptate cerințelor tale specifice.",
    whyChooseUs: [
      "Experiență cu terenul dificil: Firme care operează frecvent în zone cu dealuri și străzi în pantă (Cetățuia, Faget, Bună Ziua).",
      "Prețuri competitive în oraș scump: Comparând oferte, economisești semnificativ într-o piață cu costuri de mutare ridicate.",
      "Conexiuni universitare: Servicii speciale pentru studenți cu tarife preferențiale în septembrie și februarie.",
    ],
    localTips: [
      "**Evită începutul anului universitar**: Septembrie și februarie sunt extrem de aglomerate cu mutări de studenți. Rezervă cu minim 3 săptămâni înainte sau programează în mijlocul lunii.",
      "**Atenție la străzile în pantă**: Informează firma dacă te muți pe străzi cu înclinație mare (Dealul Faget, zona Cetățuia). Pot fi necesare echipamente speciale.",
      "**Parcări limitate în centru**: În Zorilor și pe lângă Piața Unirii există parcări limitate. Coordonează cu firma ore de dimineață pentru acces mai ușor.",
    ],
    priceContext:
      "Cluj-Napoca are cele mai ridicate prețuri de mutări din Transilvania, reflectând costurile generale crescute din oraș. O garsonieră în Mărăști costă 500-700 lei, un apartament cu 2 camere în Gheorgheni 900-1400 lei, iar o vilă din Bună Ziua 3000-5000 lei. Mutările către complexele rezidențiale noi sunt mai scumpe datorită accesului dificil și parcărilor limitate.",
  },
  {
    slug: "timisoara",
    name: "Timișoara",
    county: "Timiș",
    population: "319.000",
    tier: 1,
    landmarks: ["Piața Victoriei", "Piața Unirii", "Parcul Rozelor"],
    neighborhoods: ["Fabric", "Iosefin", "Lipovei", "Girocului", "Dâmbovița", "Aradului"],
    metaDescription:
      "Firme de mutări Timișoara ✓ Compară oferte gratuite ✓ Transport mobilă în tot Banatul ✓ Servicii complete: împachetare, demontare, depozitare",
    heroSubtitle:
      "Capitala Banatului, Capitală Culturală Europeană. Servicii de mutări la standarde europene.",
    articleIntro:
      "Timișoara, prima Capitală Culturală Europeană din România, combină arhitectura austro-ungară impunătoare din centru cu cartiere modernizate precum Dâmbovița și Girocului. Cu peste 319.000 de locuitori și o piață imobiliară în creștere, timișorenii se mută des între cartierele istorice (Fabric, Iosefin) și zonele noi de dezvoltare (Dumbrăvița, Braytim). Firmele locale cunosc perfect specificul clădirilor vechi cu tavan înalt din centru, accesul îngust în Fabric și provocările parcării în Piața Unirii. OferteMutare.ro te conectează cu companii experimentate care oferă standarde europene de servicii.",
    whyChooseUs: [
      "Expertiză în clădiri istorice: Firme specializate în mutări delicate din imobile vechi cu scări înguste și tavane înalte din Fabric și Iosefin.",
      "Mutări internaționale către Vest: Companii cu rute frecvente către Ungaria, Serbia și Austria pentru timișorenii care emigrează.",
      "Profesionalism european: Standarde ridicate de servire, punctualitate și comunicare - specific mentalității bănățene.",
    ],
    localTips: [
      "**Atenție la clădirile istorice**: Dacă te muți din centru (Piața Victoriei, Iosefin), anunță firma despre scări înguste, plafoane înalte și lipsa liftului în multe clădiri vechi.",
      "**Programează evitând orele de vârf**: Timișoara are trafic intens dimineața (7:30-9:00) și seara (17:00-19:00). Mutările în weekend sau la prânz sunt mai rapide.",
      "**Consideră depozitarea**: Mulți timișoreni folosesc servicii de depozitare temporară când se mută din apartamente mari vechi în garsoniere moderne.",
    ],
    priceContext:
      "Timișoara oferă prețuri moderate comparativ cu Cluj sau București. O garsonieră în Girocului costă 450-650 lei, un apartament cu 3 camere în Fabric 1000-1500 lei, iar o casă în Dumbrăvița 2500-4000 lei. Mutările din clădiri istorice pot adăuga 15-20% la preț datorită muncii suplimentare în scări înguste.",
  },
  {
    slug: "iasi",
    name: "Iași",
    county: "Iași",
    population: "382.000",
    tier: 1,
    landmarks: ["Palatul Culturii", "Grădina Copou", "Universitatea Al.I. Cuza"],
    neighborhoods: ["Copou", "Păcurari", "Alexandru cel Bun", "Galata", "Nicolina", "Tătărași"],
    metaDescription:
      "Mutări Iași ✓ 3-5 oferte în 24h de la firme locale verificate ✓ 100% gratuit ✓ Transport mobilă în Moldova ✓ Economii până la 40%",
    heroSubtitle: "Capitala Moldovei, oraș universitar. Mutări rapide și sigure pentru ieșeni.",
    articleIntro:
      "Iașiul, capitala istorică a Moldovei cu 382.000 de locuitori, este cel mai mare oraș din estul României și un important centru universitar cu peste 60.000 de studenți. Topografia muntoasă (7 coline), traficul aglomerat pe șoselele principale și blocurile vechi din Tătărași și Păcurari fac din alegerea firmei de mutări o decizie crucială. Ieșenii se mută frecvent între zona centrală (Copou, Centru) și cartierele-dormitor (Galata, Nicolae, Alexandru cel Bun). Pe OferteMutare.ro găsești firme locale care navighează perfect dealurile Iașiului și cunosc fiecare cartier în detaliu.",
    whyChooseUs: [
      "Experiență cu terenul muntos: Firme echipate pentru mutări în zone cu pantă mare și străzi înguste pe cele 7 coline ale Iașului.",
      "Tarife speciale studenți: Reduceri pentru studenți în septembrie și februarie, cele mai aglomerate luni pentru mutări.",
      "Acoperire Moldova: Companii cu rute regulate între Iași și alte orașe din Moldova (Suceava, Bacău, Vaslui) pentru costuri reduse.",
    ],
    localTips: [
      "**Evită începutul anului școlar**: Septembrie este extrem de aglomerat cu mutări de studenți. Rezervă din iulie-august pentru prețuri mai bune.",
      "**Informează despre dealuri**: Multe străzi din Copou, Galata și Tătărași au pante abrupte. Firmele trebuie să știe pentru echipamente adecvate.",
      "**Planifică parcarea**: În Centru și Copou există probleme majore cu parcarea. Coordonează cu firma ore matinale (7:00-9:00) pentru acces liber.",
    ],
    priceContext:
      "Iașiul oferă prețuri accesibile comparativ cu Cluj sau București. O garsonieră în Tătărași costă 400-600 lei, un apartament cu 2 camere în Păcurari 700-1100 lei, iar o casă în Galata 1800-3500 lei. Mutările în zone greu accesibile (pante mari, străzi înguste) pot adăuga 10-15% la preț.",
  },
  {
    slug: "constanta",
    name: "Constanța",
    county: "Constanța",
    population: "283.000",
    tier: 1,
    landmarks: ["Cazinoul", "Portul Tomis", "Delfinariul"],
    neighborhoods: ["Tomis", "Mamaia", "Palazu Mare", "Compozitorilor", "Km 4-5", "Poarta 6"],
    metaDescription:
      "Servicii mutări Constanța ✓ Transport mobilă pe litoral ✓ Oferte gratuite de la firme verificate ✓ Mutări apartamente și case",
    heroSubtitle: "Perlă la Marea Neagră. Mutări profesionale pentru locuitorii litoralului.",
    articleIntro:
      "Constanța, principalul port la Marea Neagră și cel mai mare oraș de pe litoral, atrage anual mii de noi locuitori cu job-uri în turism, shipping și industrie. Cu 283.000 de locuitori și cartiere extinse de la Mamaia Nord până la Palazu Mare, constănțenii se confruntă cu provocări unice: traficul de vară cu turiști, saltul marin care afectează mobilierul și necesitatea mutărilor rapide între sezoane. Fie că te muți într-un apartament în Tomis, o vilă în Mamaia sau un bloc în Km 4-5, firmele de pe OferteMutare.ro cunosc perfect specificul litoralului și oferă servicii adaptate climei maritime.",
    whyChooseUs: [
      "Experiență litoral: Firme specializate în protecția mobilierului împotriva umezelii și sării marine specifice Constanței.",
      "Flexibilitate sezonieră: Mutări rapide în sezonul de vârf (mai-septembrie) când mulți lucrători se mută temporar pe litoral.",
      "Acoperire completă județ: Servicii în toate stațiunile (Mamaia, Eforie, Mangalia, Vama Veche) nu doar în Constanța.",
    ],
    localTips: [
      "**Evită sezonul estival**: Iunie-august sunt luni haotice pe litoral. Mutările costă cu 30-40% mai mult și traficul îngreunează transportul. Alege mai sau septembrie.",
      "**Protejează mobilierul de umiditate**: Dacă te muți într-o locuință aproape de mare, solicită materiale impermeabile pentru protecție împotriva coroziunii.",
      "**Planifică depozitarea**: Mulți proprietari de vile închiriază vara și au nevoie de depozitare mobilier în sezonul rece (octombrie-aprilie).",
    ],
    priceContext:
      "Constanța are prețuri variabile sezonier. Iarna (octombrie-martie), o garsonieră costă 400-550 lei, un apartament 2 camere 700-1000 lei. Vara, aceleași servicii cresc cu 30-40%. Mutările în Mamaia sau stațiuni sunt semnificativ mai scumpe (1500-3000 lei pentru 2 camere) datorită distanței și traficului.",
  },
  {
    slug: "brasov",
    name: "Brașov",
    county: "Brașov",
    population: "253.000",
    tier: 1,
    landmarks: ["Biserica Neagră", "Tâmpa", "Piața Sfatului"],
    neighborhoods: ["Astra", "Tractorul", "Răcădău", "Bartolomeu", "Scriitorilor", "Noua"],
    metaDescription:
      "Mutări Brașov ✓ Firme verificate pentru transport mobilă ✓ Compară 3-5 oferte GRATUIT ✓ Servicii în tot județul și stațiuni",
    heroSubtitle: "La poalele Tâmpei, în inima munților. Mutări sigure pentru brașoveni.",
    articleIntro:
      "Brașovul, orașul înconjurat de munți Carpați și cunoscut pentru ambianța medievală din Centrul Vechi, atrage anual mii de noi locuitori atrași de calitatea vieții și oportunitățile în turism și IT. Cu 253.000 de locuitori și terenul accidentat specific zonei montane, brașovenii se confruntă cu provocări unice: străzi în pantă abruptă în Tractorul și Răcădău, accesul dificil către casele din Tâmpa și traficul intens pe axele principale spre Poiană Brașov. Firmele locale de pe OferteMutare.ro cunosc perfect specificul mutărilor în Brașov - de la navigarea străzilor înguste din Centrul Vechi la transportul mobilierului în zone greu accesibile din Schei sau Stupini.",
    whyChooseUs: [
      "Experiență cu terenul montan: Firme specializate în mutări pe străzi cu pante mari și acces dificil în cartierele din dealurile Brașovului.",
      "Mutări către stațiuni: Servicii regulate către Poiana Brașov, Predeal, Bran pentru proprietarii de case de vacanță.",
      "Protecție mobilier în climat montan: Expertiză în împachetare și protecție împotriva umezelii și temperaturii variabile specifice Carpaților.",
    ],
    localTips: [
      "**Evită sezonul turistic**: Vara și iarna (sărbători, sezon de schi) Brașovul este aglomerat cu turiști. Programează mutarea în aprilie-mai sau septembrie-octombrie pentru trafic fluid.",
      "**Anunță despre pante**: Străzile din Răcădău, Tractorul și zona Tâmpei au pante de peste 15-20%. Informează firma pentru echipamente adecvate și personal suplimentar.",
      "**Coordonează accesul în Centrul Vechi**: Piața Sfatului și străzile adiacente au acces restricționat pentru vehicule mari. Solicită permis special sau programează dimineața devreme (6:00-8:00).",
    ],
    priceContext:
      "Brașovul oferă prețuri moderate în zone rezidențiale și mai ridicate în Centrul Istoric. O garsonieră în Astra costă 450-650 lei, un apartament cu 2 camere în Tractorul 800-1200 lei, iar o casă în Răcădău sau Stupini 2000-3500 lei. Mutările în zone cu acces dificil sau către stațiuni montane (Poiana Brașov, Predeal) pot adăuga 20-35% la preț.",
  },
  {
    slug: "craiova",
    name: "Craiova",
    county: "Dolj",
    population: "269.000",
    tier: 1,
    landmarks: ["Parcul Nicolae Romanescu", "Teatrul Național", "Universitatea"],
    neighborhoods: ["Craiovița Nouă", "Brazda lui Novac", "Romanești", "1 Mai", "Lăpuș", "Centru"],
    metaDescription:
      "Firme mutări Craiova ✓ Transport mobilă în Oltenia ✓ Oferte gratuite în 24h ✓ Servicii complete pentru apartamente și case",
    heroSubtitle:
      "Capitala Olteniei, centru economic în sud. Mutări de încredere pentru craioveni.",
    articleIntro:
      "Craiova, capitala Olteniei cu 269.000 de locuitori, este cel mai important centru economic, universitar și cultural din sud-vestul României. Cu cartiere extinse precum Craiovița Nouă, Brazda lui Novac și 1 Mai, craioveii se mută frecvent atât în interiorul orașului cât și între localitățile din Dolj. Complexitatea mutărilor vine din combinația de blocuri vechi comuniste fără lift în Craiovița Nouă, vila modernizate în Romanești și ansambluri rezidențiale noi în zona Universității. Firmele de pe OferteMutare.ro cunosc perfect specificul Craiovei - de la navigarea în cartierele cu străzi largi la mutările în blocurile tip construite în anii '70-'80.",
    whyChooseUs: [
      "Acoperire completă Oltenia: Firme cu rute regulate către Calafat, Băilești, Filiași pentru costuri reduse la mutări intercity.",
      "Experiență cu blocuri comuniste: Specialiști în mutări din blocuri vechi fără lift, specifice cartierelor Craiovița Nouă și 1 Mai.",
      "Prețuri competitive: Tarife accesibile reflectând costul vieții mai redus comparativ cu București sau Cluj.",
    ],
    localTips: [
      "**Aprovizionare materiale locale**: Craiova are furnizori locali de materiale de împachetare la preț bun. Negociază cu firma pentru reducere.",
      "**Evită orele de vârf**: Traficul în Craiova se aglomerează dimineața (7:30-9:00) și seara (17:00-18:30) pe axele principale. Programează mutarea la prânz sau în weekend.",
      "**Coordonează cu asociația**: În blocurile vechi din Craiovița Nouă și Brazda lui Novac, anunță asociația de locatari pentru a evita conflicte legate de lift sau acces.",
    ],
    priceContext:
      "Craiova oferă prețuri foarte accesibile pentru servicii de mutări. O garsonieră în 1 Mai costă 350-500 lei, un apartament cu 2 camere în Craiovița Nouă 600-900 lei, iar o casă în Romanești 1500-2800 lei. Costurile reduse fac din Craiova una dintre cele mai avantajoase opțiuni pentru mutări din orașele majore.",
  },
  {
    slug: "galati",
    name: "Galați",
    county: "Galați",
    population: "249.000",
    tier: 1,
    landmarks: ["Dunărea", "Grădina Publică", "Complexul Muzeal"],
    neighborhoods: ["Micro", "Țiglina", "Mazepa", "Dunărea", "Centru", "Siderurgiștilor"],
    metaDescription:
      "Mutări Galați ✓ Transport mobilă pe Dunăre ✓ Compară oferte gratuite de la firme locale ✓ Economisește până la 40%",
    heroSubtitle:
      "Oraș portuar pe Dunăre, inimă industrială. Mutări rapide în Galați și împrejurimi.",
    articleIntro:
      "Galațiul, cel mai mare port fluvial din România pe malul Dunării, este un oraș industrial cu 249.000 de locuitori și cartiere extinse construite în epoca comunistă pentru muncitorii de la Combinatul Siderurgic. Gălățenii se mută frecvent între cartierele-dormitor (Micro 13-21, Țiglina, Mazepa) și zona centrală modernizată. Provocările specifice includ blocurile înalte fără lift din Micro 19 și 20, accesul dificil în cartierul Siderurgiștilor și umezeala cauzată de proximitatea Dunării care afectează mobilierul. Firmele de pe OferteMutare.ro înțeleg perfect nevoile gălățenilor și oferă servicii adaptate specificului urban-industrial al orașului.",
    whyChooseUs: [
      "Experiență industrială: Firme obișnuite cu mutări pentru muncitori siderurgiști și personal portuar, cu cerințe specifice și bugete limitate.",
      "Protecție împotriva umezelii: Materiale speciale de împachetare pentru protecția mobilierului împotriva umidității de la Dunăre.",
      "Rute către Moldova: Conexiuni regulate către Brăila, Tecuci, Bârlad pentru mutări intercounty la prețuri competitive.",
    ],
    localTips: [
      "**Verifică starea lifturilor**: În blocurile din Micro 13-21, multe lifturi sunt defecte. Confirmă funcționalitatea înainte de mutare sau solicită personal suplimentar.",
      "**Protejează mobilierul de umiditate**: Dacă te muți într-un bloc aproape de Dunăre (cartier Dunărea, Faleza), folosește materiale impermeabile pentru protecție.",
      "**Negociază tarife grupate**: Multe familii se mută simultan în Galați (comunitatea siderurgiștilor). Întreabă firma despre reduceri pentru mutări multiple.",
    ],
    priceContext:
      "Galațiul oferă unele dintre cele mai accesibile prețuri din orașele mari. O garsonieră în Micro 18 costă 350-500 lei, un apartament cu 2 camere în Țiglina 550-850 lei, iar o casă în zona Dunării 1400-2500 lei. Prețurile reflectă economia locală și sunt printre cele mai competitive din Moldova.",
  },
  {
    slug: "oradea",
    name: "Oradea",
    county: "Bihor",
    population: "196.000",
    tier: 1,
    landmarks: ["Cetatea Oradea", "Piața Unirii", "Băile Felix"],
    neighborhoods: ["Rogerius", "Nufărul", "Ioșia", "Velența", "Decebal", "Centru"],
    metaDescription:
      "Servicii mutări Oradea ✓ Firme verificate în Bihor ✓ Transport mobilă către Ungaria și Europa ✓ Oferte gratuite",
    heroSubtitle:
      "Poartă spre Europa, bijuterie Art Nouveau. Mutări la nivel european pentru orădeni.",
    articleIntro:
      "Oradea, bijuteria Art Nouveau de la granița cu Ungaria, este un oraș în plină renaștere urbană cu 196.000 de locuitori și o comunitate dinamică de tineri profesioniști. Arhitectura splendidă din centru, cartierele modernizate precum Rogerius și Nufărul și dezvoltarea imobiliară accelerată în Ioșia Nord fac din Oradea unul dintre cele mai atractive orașe pentru relocare. Orădenii se mută frecvent între apartamentele renovate din clădiri istorice în centru și ansamblurile rezidențiale noi din Ioșia sau Nufărul. Firmele de pe OferteMutare.ro oferă standarde europene de servicii - de la mutări delicate în clădiri clasiciste cu 100+ ani vechime la transporturi internaționale către Ungaria și Austria.",
    whyChooseUs: [
      "Mutări internaționale: Firme cu rute săptămânale către Budapesta, Viena și orașele din vestul Europei pentru orădenii care emigrează.",
      "Expertiză clădiri istorice: Specialiști în mutări delicate din imobile Art Nouveau și Baroc cu scări înguste și detalii arhitecturale fragile.",
      "Standarde europene: Profesionalism de tip occidental, punctualitate elvețiană și comunicare impecabilă - specific culturii orădene.",
    ],
    localTips: [
      "**Rezervă din vreme pentru mutări internaționale**: Rutele către Ungaria și Austria sunt populare. Programează cu 3-4 săptămâni înainte pentru a prinde grupaje avantajoase.",
      "**Atenție la clădirile istorice**: Dacă te muți în/din Centrul Istoric (Piața Unirii, Republicii), verifică lățimea scărilor și rezistența plafoanelor vechi.",
      "**Aprovizionează din Ungaria**: Multe firme orădene colaborează cu furnizori maghiari. Poți obține materiale de împachetare premium la prețuri competitive.",
    ],
    priceContext:
      "Oradea oferă prețuri moderate-ridicate, reflectând standardele europene. O garsonieră în Rogerius costă 500-700 lei, un apartament cu 2 camere în Nufărul 850-1300 lei, iar o vilă în Ioșia Nord 2500-4500 lei. Mutările internaționale către Ungaria încep de la 1500 lei pentru o garsonieră.",
  },
  {
    slug: "ploiesti",
    name: "Ploiești",
    county: "Prahova",
    population: "209.000",
    tier: 1,
    landmarks: ["Ceasul din centru", "Parcul Bucov", "Halele Centrale"],
    neighborhoods: ["Nord", "Sud", "Vest", "Malu Roșu", "Bereasca", "9 Mai"],
    metaDescription:
      "Mutări Ploiești ✓ Transport mobilă în Prahova ✓ Compară 3-5 oferte GRATUIT ✓ Firme verificate pentru mutări sigure",
    heroSubtitle:
      "Capitala aurului negru, la porțile munților. Mutări profesionale pentru ploieșteni.",
    articleIntro:
      "Ploieștiul, istoric oraș petrolier cu 209.000 de locuitori, este poarta către Valea Prahovei și un important centru industrial la doar 60 km de București. Datorită proximității de Capitală, mulți ploieșteni lucrează în București dar locuiesc în Ploiești pentru costuri mai mici, generând flux constant de mutări. Cartierele Nord, Sud și Vest sunt dominante de blocuri comuniste, în timp ce zona Malu Roșu și Bereasca oferă case și vile. Provocările includ traficul intens pe DN1 către București, blocurile vechi fără lift din Vest și 9 Mai, și necesitatea mutărilor rapide pentru comuterii zilnici. Firmele de pe OferteMutare.ro oferă servicii flexibile adaptate ritmului alert al ploieștenilor.",
    whyChooseUs: [
      "Rute frecvente către București: Firme cu transport zilnic între Ploiești și Capitală, ideal pentru mutări combinate sau etapizate.",
      "Experiență zona montană: Servicii către Sinaia, Bușteni, Azuga pentru proprietarii de case de vacanță din Valea Prahovei.",
      "Flexibilitate orară: Mutări devreme dimineața sau seara pentru comuterii care lucrează în București și nu pot lipsi ziua.",
    ],
    localTips: [
      "**Evită orele de comuting**: DN1 către București se blochează în zilele lucrătoare (7:00-9:00, 17:00-20:00). Programează mutarea în weekend sau la prânz.",
      "**Coordonează mutări combinate**: Dacă te muți și ai bunuri în București și Ploiești, multe firme oferă pachete combinate la preț avantajos.",
      "**Verifică accesul în cartierele vechi**: Străzile din zona Vest și 9 Mai sunt înguste. Anunță firma dacă locuiești pe străzi secundare.",
    ],
    priceContext:
      "Ploieștiul oferă prețuri moderate, mai scăzute decât în București dar mai ridicate decât media națională. O garsonieră în Nord costă 400-600 lei, un apartament cu 2 camere în Sud 700-1000 lei, iar o casă în Malu Roșu 1600-3000 lei. Mutările combinate Ploiești-București costă 900-1500 lei în funcție de volum.",
  },

  // Tier 2 - County Capitals (32)
  {
    slug: "alba-iulia",
    name: "Alba Iulia",
    county: "Alba",
    population: "74.000",
    tier: 2,
    landmarks: ["Cetatea Alba Carolina", "Catedrala Încoronării"],
    neighborhoods: ["Cetate", "Ampoi", "Pâclișa", "Micești"],
    metaDescription:
      "Mutări Alba Iulia ✓ Transport mobilă în județul Alba ✓ Oferte gratuite de la firme locale verificate",
    heroSubtitle: "Cetate istorică, capitală a Marii Uniri. Mutări de încredere în Alba.",
    articleIntro:
      "Alba Iulia, capitala spirituală a României și locul Marii Uniri din 1918, este un oraș compact cu 74.000 de locuitori și o cetate medievală impresionantă. Locuitorii se mută frecvent între apartamentele din cartierul Ampoi și casele din zona Pâclișa sau Micești, sau către locuințe renovate în apropierea Cetății Alba Carolina. Provocările specifice includ accesul restricționat în zonele protejate ale Cetății, străzile înguste din centrul istoric și necesitatea protejării mobilierului în clădirile vechi.",
    whyChooseUs: [
      "Expertiză locală: Firme care cunosc perfect regulile de acces în Cetatea Alba Carolina și zonele protejate istoric.",
      "Tarife accesibile: Prețuri competitive specifice orașelor mici, semnificativ mai mici decât în Cluj sau Sibiu.",
      "Acoperire județ: Transport către Sebes, Aiud, Blaj și alte localități din Alba la costuri reduse.",
    ],
    localTips: [
      "**Solicită permis pentru Cetate**: Accesul vehiculelor în Cetatea Alba Carolina este strict reglementat. Anunță firma din timp pentru a obține autorizare.",
      "**Programează flexibil**: Alba Iulia fiind oraș mic, traficul nu este problemă. Poți programa mutarea oricând fără îngrijorare.",
      "**Verifică găzimbele**: Multe case din Pâclișa au pivnițe tradiționale. Informă firma dacă ai bunuri de depozitat/mutat din subsol.",
    ],
    priceContext:
      "Alba Iulia oferă prețuri foarte accesibile. O garsonieră în Ampoi costă 300-450 lei, un apartament cu 2 camere în zona centrală 500-750 lei, iar o casă în Pâclișa 1000-1800 lei. Prețurile sunt printre cele mai mici din Transilvania.",
  },
  {
    slug: "arad",
    name: "Arad",
    county: "Arad",
    population: "159.000",
    tier: 2,
    landmarks: ["Palatul Administrativ", "Cetatea Arad", "Parcul Reconcilierii"],
    neighborhoods: ["Centru", "Subcetate", "Micalaca", "Aurel Vlaicu", "Grădiste"],
    metaDescription:
      "Firme mutări Arad ✓ Transport mobilă în Vest ✓ Compară oferte gratuite ✓ Mutări către Ungaria și Europa",
    heroSubtitle: "Poartă vestică a României. Mutări profesionale pentru arădeni.",
    articleIntro:
      "Aradul, orașul martirilor din 1848 cu 159.000 de locuitori, este poarta vestică a României la doar 60 km de Ungaria. Arhitectura austro-ungară impresionantă din centru, cartierele modernizate precum Micalaca și Aurel Vlaicu, și proximitatea graniței fac din Arad un hub pentru mutări atât naționale cât și internaționale. Arădenii se mută frecvent între blocurile din Micalaca și Grădiste și casele din zona Subcetate, sau emigrează către țările occidentale. Firmele locale oferă servicii la standarde europene, de la mutări delicate în clădiri istorice la transporturi internaționale.",
    whyChooseUs: [
      "Mutări internaționale regulate: Rute săptămânale către Budapesta, Viena, Germania pentru arădenii care emigrează sau lucrează în străinătate.",
      "Expertiză arhitectură austro-ungară: Firme specializate în mutări delicate din imobile istorice cu scări înguste și plafoane înalte.",
      "Tarife competitive: Prețuri moderate-reduse comparativ cu orașele mari, reflectând costul vieții din vestul României.",
    ],
    localTips: [
      "**Rezervă din vreme pentru mutări internaționale**: Rutele către Europa sunt căutate. Programează cu 3-4 săptămâni înainte pentru groupage avantajos.",
      "**Atenție la clădirile vechi**: Dacă te muți în/din Centru (Bulevardul Revoluției, Piața Avram Iancu), verifică lățimea scărilor în imobilele din 1800-1900.",
      "**Profidă de rute către Ungaria**: Multe firme au transport zilnic către Budapesta. Negociază tarife pentru grupaje comune.",
    ],
    priceContext:
      "Aradul oferă prețuri moderate. O garsonieră în Micalaca costă 400-550 lei, un apartament cu 2 camere în Grădiste 700-1000 lei, iar o casă în Subcetate 1500-2800 lei. Mutările internaționale către Ungaria încep de la 1200 lei pentru o garsonieră.",
  },
  {
    slug: "pitesti",
    name: "Pitești",
    county: "Argeș",
    population: "155.000",
    tier: 2,
    landmarks: ["Parcul Trivale", "Primărie", "Bascov"],
    neighborhoods: ["Nord", "Sud", "Găvana", "Craiovei", "Exercițiu"],
    metaDescription:
      "Mutări Pitești ✓ Compară 3-5 oferte GRATUITE în 24h ✓ Transport mobilă în tot județul Argeș ✓ Firme verificate ✓ Economisești 40%",
    heroSubtitle: "Capitală auto a României, la poalele Carpaților. Mutări rapide în Pitești.",
    articleIntro:
      "Piteștiul, capitala auto a României și gazda uzinei Dacia-Renault, este un oraș industrial dinamic cu 155.000 de locuitori și economie în creștere. Piteștenii lucrează în mare parte la Dacia sau companiile furnizoare, ceea ce generează flux constant de mutări între cartierele Nord, Sud și Găvana. Provocările specifice includ traficul intens pe DN7 către București și către Curtea de Argeș, blocurile înalte fără lift din zona Exercițiu și necesitatea mutărilor rapide pentru angajații mobilizați de Dacia. Firmele de pe OferteMutare.ro oferă servicii flexibile adaptate ritmului alert al industriei auto.",
    whyChooseUs: [
      "Pachet corporate Dacia: Multe firme oferă tarife speciale pentru angajații Dacia-Renault care se mută pentru job.",
      "Rute frecvente către București: Transport zilnic pe DN7 pentru mutări combinate sau etapizate Capitală-Pitești.",
      "Flexibilitate program: Mutări în schimburile de noapte sau weekend pentru angajații cu program 3x8 de la Dacia.",
    ],
    localTips: [
      "**Evită schimbarea de tură**: Orele 6:00-7:00, 14:00-15:00 și 22:00-23:00 sunt aglomerate cu angajații Dacia. Programează în afara acestor intervale.",
      "**Verifică asociația**: Multe blocuri din Nord și Sud au reguli stricte despre folosirea liftului pentru mutări. Coordonează din timp.",
      "**Negociază pentru groupage București**: Dacă te muți pe ruta Pitești-București (sau invers), poți economisi 30-40% prin grupaj.",
    ],
    priceContext:
      "Piteștiul oferă prețuri accesibile. O garsonieră în Exercițiu costă 350-500 lei, un apartament cu 2 camere în Nord 600-900 lei, iar o casă în Găvana 1400-2500 lei. Prețurile sunt mai mici decât în București, refleftând costul vieții redus.",
  },
  {
    slug: "bacau",
    name: "Bacău",
    county: "Bacău",
    population: "144.000",
    tier: 2,
    landmarks: ["Teatrul Bacovia", "Parcul Cancicov", "Centrul Vechi"],
    neighborhoods: ["Centru", "Ștefan cel Mare", "Cornișa", "Sud", "Miorița"],
    metaDescription:
      "Mutări Bacău ✓ Compară 3-5 oferte GRATUITE în 24h de la firme locale verificate ✓ Transport mobilă în Moldova ✓ Economisești 40%",
    heroSubtitle: "În inima Moldovei, oraș în dezvoltare. Mutări de calitate pentru băcăuani.",
    articleIntro:
      "Bacăul, important nod feroviar și rutier în inima Moldovei cu 144.000 de locuitori, este un oraș dinamic cu economie în diversificare. Băcăuanii se mută frecvent între blocurile din cartierele Ștefan cel Mare și Sud și casele din zona Cornișa, sau către apartamente renovate în Centrul Vechi. Provocările specifice includ blocurile înalte fără lift din era comunistă, străzile înguste în zona Cornișa cu vedere la Bârlad, și traficul pe drumurile europene E85 și E574. Firmele locale oferă servicii adaptate nevoilor moldovenilor.",
    whyChooseUs: [
      "Acoperire Moldova: Rute regulate către Iași, Vaslui, Piatra Neamț, Roman pentru mutări intercity avantajoase.",
      "Tarife accesibile: Prețuri competitive refleftând economia locală din Moldova, printre cele mai mici din țară.",
      "Expertiză blocuri comuniste: Firme specializate în mutări din blocuri de 10+ etaje fără lift, specifice cartierelor băcăuane.",
    ],
    localTips: [
      "**Verifică lifturi în blocurile vechi**: Multe blocuri din Ștefan cel Mare au lifturi defecte. Confirmă funcționarea sau solicită personal suplimentar.",
      "**Coordonează pe E85**: Traficul pe E85 (București-Suceava) poate fi intens. Programează mutarea în afara orelor de vârf (9:00-16:00).",
      "**Profidă de groupaje Moldova**: Multe firme au rute regulate către Iași. Negociază pentru groupage și economisește 20-30%.",
    ],
    priceContext:
      "Bacăul oferă prețuri foarte accesibile. O garsonieră în Sud costă 300-450 lei, un apartament cu 2 camere în Ștefan cel Mare 550-800 lei, iar o casă pe Cornișa 1200-2200 lei. Prețurile sunt printre cele mai mici din Moldova.",
  },
  {
    slug: "bistrita",
    name: "Bistrița",
    county: "Bistrița-Năsăud",
    population: "75.000",
    tier: 2,
    landmarks: ["Turnul Bisericii Evanghelice", "Piața Centrală", "Codrișor"],
    neighborhoods: ["Centru", "Viișoara", "Unirea", "Subcetate"],
    metaDescription:
      "Mutări Bistrița ✓ Transport mobilă în nord-vestul Transilvaniei ✓ Oferte gratuite de la firme verificate",
    heroSubtitle: "Ținutul lui Dracula, frumusețe transilvăneană. Mutări sigure în Bistrița.",
    articleIntro:
      "Bistrița, renumit oraș medieval din nord-vestul Transilvaniei cu 75.000 de locuitori și legături cu legenda lui Dracula, este un centru urban liniștit înconjurat de munți. Bistrițenii se mută între apartamentele din cartierele Viișoara și Unirea și casele din zona Subcetate sau către locuințe renovate în Centrul Istoric. Provocările specifice includ accesul limitat în Centrul Vechi cu străzi înguste din epoca medievală, terenul accidentat în zona Codrișor și necesitatea protejării mobilierului de temperatura rece specifică climatului montan.",
    whyChooseUs: [
      "Expertiză locală: Firme care cunosc perfect străzile înguste din Centrul Medieval și accesul în zone rezidențiale noi.",
      "Tarife mici-oraș: Prețuri foarte accesibile specifice orașelor sub 100.000 locuitori din Transilvania.",
      "Acoperire zona montană: Servicii către stațiuni din Bârgău, Vatra Dornei pentru case de vacanță.",
    ],
    localTips: [
      "**Rezervă pentru Centrul Vechi**: Accesul vehiculelor în zona medievală (Piața Centrală, Turnul Bisericii) este restricționat. Anunță firma din timp.",
      "**Protejează mobilierul de frig**: Bistrița are ierni friguroase. Dacă te muți iarna, solicită acoperiri termice pentru mobilă.",
      "**Flexibilitate orară**: Fiind oraș mic, traficul nu este problemă. Poți programa mutarea oricând fără restricții.",
    ],
    priceContext:
      "Bistrița oferă prețuri foarte accesibile. O garsonieră în Unirea costă 280-400 lei, un apartament cu 2 camere în Viișoara 450-700 lei, iar o casă în Subcetate 900-1600 lei. Prețurile sunt printre cele mai mici din Transilvania.",
  },
  {
    slug: "botosani",
    name: "Botoșani",
    county: "Botoșani",
    population: "106.000",
    tier: 2,
    landmarks: ["Centrul Vechi", "Parcul Mihai Eminescu", "Memorial Eminescu"],
    neighborhoods: ["Centru", "Imparat Traian", "Bucovina", "Plevna"],
    metaDescription:
      "Mutări Botoșani ✓ Compară 3-5 oferte GRATUITE în 24h ✓ Transport mobilă în nordul Moldovei ✓ Firme verificate ✓ Prețuri accesibile",
    heroSubtitle: "Plaiuri eminesciene, tradiție și cultură. Mutări profesionale în Botoșani.",
    articleIntro:
      "Botoșaniul, orașul lui Mihai Eminescu și Nicolae Iorga cu 106.000 de locuitori, este cel mai nordic oraș important din Moldova și un centru cultural tradițional. Botoșănenii se mută între apartamentele din cartierele Imparat Traian și Plevna și casele din zona Bucovina, sau emigrează către orașe mai mari (Iași, București). Provocările specifice includ blocurile vechi fără lift din era comunistă, infrastructura deficitară în cartierele periferice și necesitatea mutărilor rapide pentru tinerii care pleacă la studii.",
    whyChooseUs: [
      "Tarife foarte accesibile: Prețuri minime refleftând economia locală din nordul Moldovei, printre cele mai mici din țară.",
      "Rute către Iași: Transport regulat către Iași (100 km) pentru studenți și tineri profesioniști.",
      "Flexibilitate și înțelegere: Firme locale care înțeleg nevoile comunității și oferă soluții personalizate.",
    ],
    localTips: [
      "**Verifică lifturile obligatoriu**: Botoșanii are cele mai vechi blocuri din Moldova. Confirmă funcționarea lifturilor în Imparat Traian și Plevna.",
      "**Programează combinat cu Iași**: Dacă te muți către/de la Iași, multe firme oferă groupaje avantajoase pe această rută.",
      "**Atenție la străzile secundare**: Multe zone au străzi nepavate sau cu gropi. Anunță firma despre condițiile de acces.",
    ],
    priceContext:
      "Botoșaniul oferă cele mai accesibile prețuri din orașele mari. O garsonieră în Plevna costă 250-400 lei, un apartament cu 2 camere în Imparat Traian 450-700 lei, iar o casă în Bucovina 1000-1800 lei. Prețurile refleftă economia locală modestă.",
  },
  {
    slug: "braila",
    name: "Brăila",
    county: "Brăila",
    population: "168.000",
    tier: 2,
    landmarks: ["Faleza Dunării", "Piața Traian", "Teatrul Maria Filotti"],
    neighborhoods: ["Centru", "Viziru", "Radu Negru", "Chercea", "Apollo"],
    metaDescription:
      "Mutări Brăila ✓ Transport mobilă pe Dunăre ✓ Oferte gratuite în 24h ✓ Firme locale verificate ✓ Economisește până la 40% la servicii de mutare",
    heroSubtitle: "Port dunărean, spirit pescaresc. Mutări de încredere în Brăila.",
    articleIntro:
      "Brăila, istoric oraș portuar pe malul Dunării cu 168.000 de locuitori, este un centru economic important cu arhitectură impresionantă din secolul al XIX-lea. Brăilenii se mută frecvent între blocurile din cartierele Viziru, Radu Negru și Chercea și apartamentele renovate în Centru sau case în zona Apollo. Provocările specifice includ umezeala de la Dunăre care afectează mobilierul, blocurile foarte înalte fără lift din era comunistă, și accesul dificil în zona portului. Firmele locale cunosc perfect aceste specificități și oferă soluții adaptate.",
    whyChooseUs: [
      "Protecție umezeală Dunăre: Materiale speciale de împachetare pentru protecția mobilierului împotriva umidității dunărene.",
      "Experiență blocuri portuar: Firme specializate în mutări din blocurile înalte din Viziru și Chercea, construite pentru muncitorii portului.",
      "Rute către Galați și Tulcea: Transport regulat către alte orașe dunărene pentru costuri reduse la groupaje.",
    ],
    localTips: [
      "**Protejează mobilierul de umiditate**: Blocurile de lângă Dunăre (Faleza, zona portului) au umiditate ridicată. Folosește materiale impermeabile.",
      "**Verifică starea lifturilor**: Brăila are blocuri foarte înalte (12-15 etaje) din anii '70. Multe lifturi sunt defecte - confirmă funcționalitatea.",
      "**Evită zona portului în orele de lucru**: Accesul în zona portului este restricționat 7:00-17:00. Programează mutarea seara sau weekend.",
    ],
    priceContext:
      "Brăila oferă prețuri accesibile. O garsonieră în Viziru costă 320-480 lei, un apartament cu 2 camere în Radu Negru 550-850 lei, iar o casă în Apollo 1300-2300 lei. Prețurile sunt competitive comparativ cu Galațiul.",
  },
  {
    slug: "buzau",
    name: "Buzău",
    county: "Buzău",
    population: "115.000",
    tier: 2,
    landmarks: ["Parcul Crâng", "Episcopia", "Centrul Vechi"],
    neighborhoods: ["Centru", "Dorobanți", "Micro 14", "Broșteni"],
    metaDescription:
      "Servicii mutări Buzău ✓ Transport mobilă în Muntenia ✓ Compară oferte gratuite de la firme verificate ✓ Economisește până la 40% la mutarea ta",
    heroSubtitle: "La răscruce de drumuri, tradiție și modernitate. Mutări sigure în Buzău.",
    articleIntro:
      "Buzăul, oraș la răscruce între Moldova și Muntenia cu 115.000 de locuitori, este un centru urban dinamic la 100 km de București. Buzăuanii se mută frecvent între apartamentele din Micro 14 și Dorobanți și casele din zona Broșteni, sau către București pentru job-uri. Provocările specifice includ traficul intens pe DN2 către București, blocurile vechi fără lift din Micro 14, și necesitatea mutărilor rapide pentru comuterii zilnici. Firmele locale oferă servicii flexibile adaptate nevoilor comunității.",
    whyChooseUs: [
      "Rute regulate București: Transport zilnic pe DN2 pentru mutări combinate sau etapizate Capitală-Buzău la prețuri competitive.",
      "Tarife accesibile: Prețuri moderate refleftând costul vieții mai redus decât în București.",
      "Acoperire Muntenia-Moldova: Servicii către Focșani, Brașov, Ploiești pentru mutări intercounty avantajoase.",
    ],
    localTips: [
      "**Evită DN2 în orele de vârf**: Traficul către București se blochează dimineața (7:00-9:00) și seara (17:00-19:00). Programează mutarea la prânz.",
      "**Verifică lifturile în Micro 14**: Cartierul Micro 14 are blocuri vechi cu lifturi uzate. Confirmă funcționalitatea sau solicită personal extra.",
      "**Negociază groupaje București**: Multe firme au rute zilnice către Capitală. Poți economisi 25-35% prin groupaj.",
    ],
    priceContext:
      "Buzăul oferă prețuri accesibile. O garsonieră în Micro 14 costă 300-450 lei, un apartament cu 2 camere în Dorobanți 550-800 lei, iar o casă în Broșteni 1200-2100 lei. Mutările către București încep de la 700 lei.",
  },
  {
    slug: "resita",
    name: "Reșița",
    county: "Caraș-Severin",
    population: "73.000",
    tier: 2,
    landmarks: ["Muzeul Locomotivelor", "Secu", "Nera"],
    neighborhoods: ["Centru", "Govândari", "Mociur", "Stavila"],
    metaDescription:
      "Mutări Reșița ✓ Transport mobilă în Banat ✓ Oferte gratuite de la firme locale verificate ✓ Servicii profesionale pentru teren montan dificil",
    heroSubtitle: "Capitala fierului, în inima munților. Mutări profesionale în Reșița.",
    articleIntro:
      "Reșița, istoric oraș industrial în Munții Banatului cu 73.000 de locuitori, este cunoscut pentru tradiția siderurgică și terenul extrem de accidentat. Reșițenii se mută între apartamentele din cartierele Govândari și Mociur construite pe dealuri abrupte și casele din zona Stavila. Provocările specifice sunt unice: străzi în pantă extremă (unele peste 20%), blocuri construite pe niveluri diferite datorită terenului, și accesul dificil în cartierele miniere izolate. Firmele locale au echipamente speciale și expertiză necesară pentru aceste condiții extreme.",
    whyChooseUs: [
      "Expertiză teren extrem: Firme specializate în mutări pe pante abrupte și străzi înguste în munți, unică în România.",
      "Echipamente speciale: Vehicule 4x4, trolii, utilaje pentru transport în condiții montane dificile.",
      "Tarife accesibile: Prețuri competitive refleftând economia locală în declin după închiderea uzinelor.",
    ],
    localTips: [
      "**Anunță obligatoriu despre pante**: Reșița are cele mai abrupte străzi din România. Informează firma despre localizarea exactă pentru echipamente adecvate.",
      "**Verifică accesul iarna**: Străzile din Govândari și Mociur sunt greu accesibile iarna. Planifică mutarea primăvară-vară-toamnă.",
      "**Solicită recunoaștere**: Pentru condiții extrem de dificile, cere firmei o vizită prealabilă pentru evaluare corectă.",
    ],
    priceContext:
      "Reșița oferă prețuri moderate dar costurile cresc semnificativ în zone dificile. O garsonieră în Centru costă 280-420 lei, un apartament cu 2 camere în Govândari 500-800 lei (cu supliment 20-30% pentru acces dificil), iar o casă în Stavila 1000-1800 lei.",
  },
  {
    slug: "calarasi",
    name: "Călărași",
    county: "Călărași",
    population: "65.000",
    tier: 2,
    landmarks: ["Dunărea", "Parcul Central", "Lacul Iezer"],
    neighborhoods: ["Centru", "Măgureni", "Mircea Vodă", "Orizont"],
    metaDescription:
      "Firme mutări Călărași ✓ Transport mobilă în sudul României ✓ Compară oferte gratuite ✓ Servicii de mutare accesibile și profesionale în Bărăgan",
    heroSubtitle: "Pe malul Dunării, la granița cu Bulgaria. Mutări rapide în Călărași.",
    articleIntro:
      "Călărașiul, oraș portuar pe malul Dunării cu 65.000 de locuitori la granița cu Bulgaria, este un centru agricol și comercial în Bărăgan. Călărășenii se mută între blocurile din cartierele Măgureni și Orizont și casele din zona Mircea Vodă, sau către București (120 km). Provocările specifice includ umezeala de la Dunăre, infrastructura învăchită în cartierele vechi, și traficul pe DN3 către București. Firmele locale oferă servicii accesibile adaptate economiei agricole.",
    whyChooseUs: [
      "Tarife minime: Prețuri foarte accesibile refleftând economia agrară din Bărăgan, printre cele mai mici din țară.",
      "Rute către București: Transport regulat pe DN3 pentru tineri care se mută în Capitală pentru studii/job-uri.",
      "Protecție umezeală: Materiale speciale pentru protecția mobilierului împotriva umidității dunărene.",
    ],
    localTips: [
      "**Protejează mobilierul de Dunăre**: Blocurile aproape de mală au umiditate ridicată. Folosește materiale impermeabile.",
      "**Verifică DN3 înainte**: Drumul către București poate fi aglomerat cu TIR-uri agricole. Programează mutarea în weekend.",
      "**Flexibilitate orară**: Fiind oraș mic, traficul local nu este problemă. Poți programa mutarea oricând.",
    ],
    priceContext:
      "Călărașiul oferă prețuri foarte accesibile. O garsonieră în Orizont costă 250-380 lei, un apartament cu 2 camere în Măgureni 400-650 lei, iar o casă în Mircea Vodă 900-1600 lei. Mutările către București încep de la 600 lei.",
  },
  {
    slug: "sfantu-gheorghe",
    name: "Sfântu Gheorghe",
    county: "Covasna",
    population: "56.000",
    tier: 2,
    landmarks: ["Cetatea Sfântu Gheorghe", "Parcul Central", "Muzeul Național"],
    neighborhoods: ["Centru", "Câmpul Frumos", "Simeria", "Ciucului"],
    metaDescription:
      "Mutări Sfântu Gheorghe ✓ Transport mobilă în Covasna ✓ Oferte gratuite în 24h ✓ Servicii bilingve română-maghiară ✓ Firme locale verificate",
    heroSubtitle: "Capitala Secuimii, tradiție și armonie. Mutări sigure în Sfântu Gheorghe.",
    articleIntro:
      "Sfântu Gheorghe, capitala județului Covasna cu 56.000 de locuitori și majoritate maghiară, este un oraș liniștit înconjurat de munți la poalele Carpaților. Locuitorii se mută între apartamentele din cartierele Câmpul Frumos și Simeria și casele din zonele rezidențiale noi. Provocările specifice includ terenul accidentat, străzile înguste în Centrul Istoric, și necesitatea serviciilor bilingve (română-maghiară). Firmele locale oferă servicii culturally-adapted la standardele comunității secuiești.",
    whyChooseUs: [
      "Servicii bilingve: Personal care vorbește română și maghiară pentru comunicare perfectă cu clienții.",
      "Expertiză teren montan: Firme obișnuite cu străzi în pantă și acces dificil în zonele rezidențiale din dealuri.",
      "Tarife accesibile: Prețuri foarte competitive specifice orașelor mici din Covasna.",
    ],
    localTips: [
      "**Solicită servicii în maghiară**: Multe firme oferă servicii bilingve. Specifică limba preferată la rezervare.",
      "**Programează flexibil**: Fiind oraș mic fără trafic, poți programa mutarea oricând fără restricții.",
      "**Verifică accesul iarna**: Străzile pe dealuri pot fi greu accesibile iarna. Planifică mutarea în sezonul cald.",
    ],
    priceContext:
      "Sfântu Gheorghe oferă prețuri foarte accesibile. O garsonieră în Simeria costă 280-400 lei, un apartament cu 2 camere în Câmpul Frumos 450-700 lei, iar o casă în zona rezidențială 900-1600 lei. Prețurile sunt printre cele mai mici din Transilvania.",
  },
  {
    slug: "targoviste",
    name: "Târgoviște",
    county: "Dâmbovița",
    population: "79.000",
    tier: 2,
    landmarks: ["Curtea Domnească", "Turnul Chindiei", "Parcul Chindia"],
    neighborhoods: ["Centru", "Micro", "Priseaca", "Matei Voievod"],
    metaDescription:
      "Servicii mutări Târgoviște ✓ Transport mobilă în Dâmbovița ✓ Compară oferte gratuite ✓ Rute către București ✓ Economisești până la 40%",
    heroSubtitle: "Vechea capitală a Țării Românești. Mutări de încredere în Târgoviște.",
    articleIntro:
      "Târgoviștea, vechea capitală a Țării Românești și reședință domnească istorică cu 79.000 de locuitori, este un oraș la 80 km de București cu patrimoniu cultural bogat. Târgoviștenii se mută între apartamentele din cartierul Micro și Priseaca și casele din zona Matei Voievod, sau către Capitală pentru job-uri. Provocările specifice includ accesul restricționat în zona Curții Domnești (zonă protejată), blocurile vechi fără lift din Micro, și traficul pe DN72 către București. Firmele locale oferă servicii adaptate specificului urban-istoric.",
    whyChooseUs: [
      "Expertiză zonă istorică: Firme care cunosc perfect regulile de acces în zona protejată a Curții Domnești și centrului medieval.",
      "Rute către București: Transport regulat pe DN72 pentru comuterii și tineri care se mută în Capitală.",
      "Tarife moderate: Prețuri accesibile refleftând costul vieții mai redus decât în București.",
    ],
    localTips: [
      "**Solicită permis pentru zona istorică**: Accesul vehiculelor în zona Curții Domnești este restricționat. Anunță firma din timp.",
      "**Evită DN72 în orele de comuting**: Traficul către București se blochează dimineața (7:00-9:00). Programează mutarea la prânz sau weekend.",
      "**Verifică lifturile în Micro**: Cartierul are blocuri comuniste vechi. Confirmă funcționalitatea lifturilor sau solicită personal extra.",
    ],
    priceContext:
      "Târgoviștea oferă prețuri accesibile. O garsonieră în Micro costă 300-450 lei, un apartament cu 2 camere în Priseaca 550-800 lei, iar o casă în Matei Voievod 1200-2100 lei. Mutările către București încep de la 600 lei.",
  },
  {
    slug: "slobozia",
    name: "Slobozia",
    county: "Ialomița",
    population: "45.000",
    tier: 2,
    landmarks: ["Parcul Central", "Biserica Sfântul Nicolae", "Ialomița"],
    neighborhoods: ["Centru", "Bora", "Matei Basarab"],
    metaDescription:
      "Mutări Slobozia ✓ Transport mobilă în Ialomița ✓ Oferte gratuite de la firme verificate ✓ Rute către București și Constanța ✓ Prețuri accesibile",
    heroSubtitle: "În Bărăgan, între București și Constanța. Mutări profesionale în Slobozia.",
    articleIntro:
      "Slobozia, capitală a județului Ialomița cu 45.000 de locuitori, este un oraș agricol în inima Bărăganului la jumătatea drumului între București și Constanța. Slobozenii se mută între blocurile din Centru și zona Bora, sau către orașe mai mari pentru job-uri (București la 120 km, Constanța la 130 km). Provocările specifice includ infrastructura învăchită, lipsa de alternative de locuințe moderne, și traficul agricol pe DN2 care traversează orașul. Firmele locale oferă servicii simple și accesibile adaptate economiei rurale.",
    whyChooseUs: [
      "Tarife minime: Prețuri foarte accesibile refleftând economia agrară din Bărăgan, printre cele mai mici din țară.",
      "Rute către București/Constanța: Transport pe DN2 și A2 pentru tineri care emigrează către Capitală sau litoral.",
      "Flexibilitate totală: Firme mici, familiale care oferă program flexibil și soluții personalizate.",
    ],
    localTips: [
      "**Evită DN2 în sezonul agricol**: Vara și toamna drumul este aglomerat cu combine și TIR-uri cu cereale. Programează mutarea primăvara sau iarna.",
      "**Programează flexibil**: Fiind oraș mic, traficul local nu există. Poți programa mutarea oricând.",
      "**Negociază direct**: Firmele din Slobozia sunt mici și familiale. Poți negocia direct prețuri avantajoase.",
    ],
    priceContext:
      "Slobozia oferă cele mai accesibile prețuri. O garsonieră în Centru costă 220-350 lei, un apartament cu 2 camere în Bora 380-600 lei, iar o casă 800-1400 lei. Prețurile refleftă economia rurală modestă. Mutările către București încep de la 550 lei.",
  },
  {
    slug: "baia-mare",
    name: "Baia Mare",
    county: "Maramureș",
    population: "123.000",
    tier: 2,
    landmarks: ["Turnul lui Ștefan", "Piața Libertății", "Centrul Vechi"],
    neighborhoods: ["Centru", "Vasile Alecsandri", "Săsar", "Ferneziu", "Firiza"],
    metaDescription:
      "Firme mutări Baia Mare ✓ Transport mobilă în Maramureș ✓ Compară oferte gratuite în 24h ✓ Expertiză teren montan ✓ Economisești până la 40%",
    heroSubtitle: "Poartă către Maramureșul tradițional. Mutări de calitate în Baia Mare.",
    articleIntro:
      "Baia Mare, capitala Maramureșului cu 123.000 de locuitori, este un oraș minero-industrial înconjurat de munți și poarta către zona etno-culturală Maramureș. Băimărenii se mută frecvent între blocurile din cartierele Vasile Alecsandri și Săsar și casele din zona Ferneziu sau Firiza. Provocările specifice includ terenul accidentat cu străzi în pantă, traficul intens pe DN1C către Satu Mare, și iernile geroase care necesită protecție specială a mobilierului. Firmele locale oferă servicii robuste adaptate climatului montan dur.",
    whyChooseUs: [
      "Expertiză teren montan: Firme specializate în mutări pe străzi în pantă și acces dificil în zonele rezidențiale din dealuri.",
      "Protecție climat dur: Materiale termice pentru protecția mobilierului în ierni geroase specifice Maramureșului.",
      "Acoperire regională: Servicii către Sighetu Marmației, Vișeu de Sus, Borșa pentru locuințe în zona rurală.",
    ],
    localTips: [
      "**Evită iarna pentru mutări**: Decembrie-februarie sunt foarte friguroase cu zăpadă abunedentă. Programează mutarea primăvară-vară-toamnă.",
      "**Anunță despre pante**: Multe străzi din Săsar și Ferneziu au pante semnificative. Informează firma pentru echipamente adecvate.",
      "**Coordonează DN1C**: Traficul pe DN1C către Satu Mare poate fi intens. Programează mutarea în afara orelor de vârf (9:00-15:00).",
    ],
    priceContext:
      "Baia Mare oferă prețuri moderate. O garsonieră în Săsar costă 350-520 lei, un apartament cu 2 camere în Vasile Alecsandri 650-950 lei, iar o casă în Ferneziu 1400-2600 lei. Prețurile refleftă terenul dificil și climatul dur.",
  },
  {
    slug: "drobeta-turnu-severin",
    name: "Drobeta-Turnu Severin",
    county: "Mehedinți",
    population: "92.000",
    tier: 2,
    landmarks: ["Podul lui Traian", "Cetatea Severinului", "Dunărea"],
    neighborhoods: ["Centru", "Crihala", "Kiseleff", "Aluniș"],
    metaDescription:
      "Mutări Drobeta-Turnu Severin ✓ Transport mobilă în Mehedinți ✓ Oferte gratuite ✓ Servicii transfrontaliere Serbia ✓ Firme locale verificate",
    heroSubtitle: "Unde Dunărea își face drum prin munți. Mutări sigure în Drobeta.",
    articleIntro:
      "Drobeta-Turnu Severin, oraș istoric pe malul Dunării în Cazanele Dunării cu 92.000 de locuitori, este poarta către Oltenia de nord și Serbia. Severienii se mută între blocurile din cartierele Crihala și Kiseleff și casele din zona Aluniș, sau emigrează către orașe mai mari sau Serbia (15 km). Provocările specifice includ umezeala extrema de la Dunăre, terenul accidentat în zona Cazanelor, și infrastructura învăchită post-industrială. Firmele locale oferă servicii adaptate specificului dunărean și montan.",
    whyChooseUs: [
      "Protecție umezeală extremă: Materiale impermeabile speciale pentru protecția mobilierului împotriva umidității din Cazanele Dunării.",
      "Mutări către Serbia: Servicii transfrontaliere către Kladovo, Negotin pentru severienii cu legături în Serbia.",
      "Tarife accesibile: Prețuri competitive refleftând economia locală în tranziție post-industrială.",
    ],
    localTips: [
      "**Protejează mobilierul obligatoriu**: Umezeala de la Dunăre este extremă în Cazane. Solicită materiale impermeabile premium.",
      "**Verifică accesul în zone montane**: Străzile în zona Cazanelor pot fi înguste și în pantă. Anunță firma despre localizare.",
      "**Programează flexibil**: Traficul în Severin nu este problemă. Poți programa mutarea oricând.",
    ],
    priceContext:
      "Drobeta-Turnu Severin oferă prețuri accesibile. O garsonieră în Kiseleff costă 300-450 lei, un apartament cu 2 camere în Crihala 550-800 lei, iar o casă în Aluniș 1200-2100 lei. Prețurile sunt printre cele mai mici din Oltenia.",
  },
  {
    slug: "targu-mures",
    name: "Târgu Mureș",
    county: "Mureș",
    population: "134.000",
    tier: 2,
    landmarks: ["Palatul Culturii", "Cetatea Medievală", "Grădina Zoo"],
    neighborhoods: ["Centru", "Tudor", "Cornișa", "Unirii", "7 Noiembrie"],
    metaDescription:
      "Servicii mutări Târgu Mureș ✓ Transport mobilă în Transilvania ✓ Compară oferte gratuite ✓ Servicii bilingve ✓ Economisești până la 40%",
    heroSubtitle: "Capitală culturală în inima țării. Mutări profesionale în Târgu Mureș.",
    articleIntro:
      "Târgu Mureșul, important centru cultural și universitar în inima Transilvaniei cu 134.000 de locuitori și o comunitate mixtă româno-maghiară, este un oraș dinamic cu arhitectură Art Nouveau impresionantă. Mureșenii se mută frecvent între apartamentele din cartierele Tudor și 7 Noiembrie și casele din zona Cornișa sau locuințe renovate în Centru. Provocările specifice includ accesul limitat în Centrul Istoric, râul Mureș care traversează orașul (necesită coordonare poduri), și necesitatea serviciilor bilingve. Firmele locale oferă standarde ridicate la prețuri competitive.",
    whyChooseUs: [
      "Servicii bilingve: Personal care vorbește română și maghiară pentru comunicare perfectă cu toate comunitățile.",
      "Expertiză urbană: Firme care cunosc perfect podurile peste Mureș, străzile înguste din Centru și cartierele rezidențiale.",
      "Prețuri competitive: Tarife moderate comparativ cu Cluj sau Brașov, la standarde similare de servicii.",
    ],
    localTips: [
      "**Coordonează traversarea Mureșului**: Dacă mutarea implică traversarea râului, anunță firma pentru a evita orele de vârf pe poduri.",
      "**Solicită servicii în limba preferată**: Multe firme oferă servicii bilingve. Specifică la rezervare.",
      "**Atenție la Centrul Istoric**: Accesul în zona Palatului Culturii este restricționat. Solicită autorizare din timp.",
    ],
    priceContext:
      "Târgu Mureșul oferă prețuri moderate. O garsonieră în 7 Noiembrie costă 380-550 lei, un apartament cu 2 camere în Tudor 700-1050 lei, iar o casă pe Cornișa 1500-2800 lei. Prețurile sunt mai mici decât în Cluj dar mai ridicate decât în orașele mici.",
  },
  {
    slug: "piatra-neamt",
    name: "Piatra Neamț",
    county: "Neamț",
    population: "85.000",
    tier: 2,
    landmarks: ["Turnul lui Ștefan cel Mare", "Parcul Central", "Telecabina"],
    neighborhoods: ["Centru", "Precista", "Dărmănești", "Speranța"],
    metaDescription:
      "Mutări Piatra Neamț ✓ Transport mobilă în Neamț ✓ Oferte gratuite de la firme verificate ✓ Expertiză teren montan ✓ Servicii către stațiuni",
    heroSubtitle: "La poalele munților, în inima naturii. Mutări de încredere în Piatra Neamț.",
    articleIntro:
      "Piatra Neamțul, orașul înconjurat de munți cu 85.000 de locuitori și renumit pentru frumusețea naturală, este un centru turistic și cultural în nordul Moldovei. Pietrenii se mută între apartamentele din cartierele Precista și Dărmănești și casele din zona Speranța, sau către locuințe de vacanță în stațiunile montane. Provocările specifice includ terenul extrem de accidentat (orașul este construit pe dealuri abrupte), străzile în serpentine în zonele rezidențiale, și accesul dificil iarna cu zăpadă abunedentă. Firmele locale au echipamente speciale pentru condiții montane.",
    whyChooseUs: [
      "Expertiză teren extrem montan: Firme specializate în mutări pe străzi în serpentine și pante foarte abrupte, specific Pietrei Neamț.",
      "Servicii către stațiuni: Transport regulat către Durau, Ceahlău pentru case de vacanță și cabană montane.",
      "Tarife accesibile: Prețuri competitive refleftând economia locală din nordul Moldovei.",
    ],
    localTips: [
      "**Anunță obligatoriu despre teren**: Piatra Neamț are cele mai abrupte străzi din Moldova. Informează firma despre localizarea exactă.",
      "**Evită iarna pentru mutări**: Decembrie-martie străzile pot fi acoperite cu zăpadă/gheață. Programează mutarea aprilie-noiembrie.",
      "**Solicită recunoaștere**: Pentru zone foarte dificile (Precista pe deal), cere firmei vizită prealabilă pentru evaluare.",
    ],
    priceContext:
      "Piatra Neamțul oferă prețuri accesibile. O garsonieră în Dărmănești costă 300-450 lei, un apartament cu 2 camere în Precista 550-850 lei (cu supliment 15-20% pentru acces dificil), iar o casă în Speranța 1100-2000 lei.",
  },
  {
    slug: "slatina",
    name: "Slatina",
    county: "Olt",
    population: "70.000",
    tier: 2,
    landmarks: ["Turnul de Apă", "Parcul Central", "Malul Oltului"],
    neighborhoods: ["Centru", "Steaua", "Crișan", "Primăverii"],
    metaDescription:
      "Firme mutări Slatina ✓ Transport mobilă în județul Olt ✓ Compară oferte gratuite ✓ Rute către Craiova ✓ Prețuri accesibile și servicii de calitate",
    heroSubtitle: "Pe malul Oltului, centru industrial. Mutări rapide în Slatina.",
    articleIntro:
      "Slatina, capitală a județului Olt cu 70.000 de locuitori, este un oraș industrial pe malul râului Olt în vestul Munteniei. Slătinenii se mută între blocurile din cartierele Steaua și Crișan și casele din zona Primăverii, sau către orașe mai mari (Craiova, Pitești). Provocările specifice includ blocurile comuniste vechi fără lift, infrastructura învăchită post-industrială, și traficul pe DN65 către Craiova. Firmele locale oferă servicii simple și accesibile adaptate economiei industriale în tranziție.",
    whyChooseUs: [
      "Tarife foarte accesibile: Prețuri minime refleftând economia locală din Olt, printre cele mai mici din Oltenia.",
      "Rute către Craiova: Transport regulat către capitala Olteniei (50 km) pentru mutări intercity avantajoase.",
      "Flexibilitate și simț practic: Firme locale care înțeleg nevoile comunității muncitorești.",
    ],
    localTips: [
      "**Verifică lifturile obligatoriu**: Slătinenii are multe blocuri comuniste vechi în Steaua și Crișan. Confirmă funcționalitatea sau solicită personal extra.",
      "**Programează combinat cu Craiova**: Dacă te muți către/de la Craiova, multe firme oferă groupaje avantajoase.",
      "**Flexibilitate orară**: Traficul în Slatina este minimal. Poți programa mutarea oricând.",
    ],
    priceContext:
      "Slatina oferă prețuri foarte accesibile. O garsonieră în Steaua costă 250-380 lei, un apartament cu 2 camere în Crișan 420-650 lei, iar o casă în Primăverii 900-1600 lei. Prețurile sunt printre cele mai mici din Muntenia.",
  },
  {
    slug: "satu-mare",
    name: "Satu Mare",
    county: "Satu Mare",
    population: "102.000",
    tier: 2,
    landmarks: ["Turnul Pompierilor", "Parcul Vasile Lucaciu", "Centrul Vechi"],
    neighborhoods: ["Centru", "Carpați", "Micro 17", "Solidarității"],
    metaDescription:
      "Mutări Satu Mare ✓ Compară 3-5 oferte GRATUITE în 24h ✓ Transport mobilă în nord-vest ✓ Firme verificate ✓ Economisești 40%",
    heroSubtitle: "În țara Oașului, la granița cu Ungaria. Mutări profesionale în Satu Mare.",
    articleIntro:
      "Satu Mare, orașul de la granița cu Ungaria cu 102.000 de locuitori și o comunitate multietnică româno-maghiară, este poarta către Ținutul Oașului și nordul Transilvaniei. Sătmărenii se mută frecvent între blocurile din cartierele Carpați și Micro 17 și casele din zona Solidarității, sau emigrează către Ungaria (15 km). Provocările specifice includ necesitatea serviciilor bilingve, traficul pe DN19 către Ungaria, și infrastructura învăchită în cartierele comuniste. Firmele locale oferă servicii la standarde europene datorită proximității graniței.",
    whyChooseUs: [
      "Servicii bilingve și transfrontaliere: Firme care oferă servicii în română și maghiară, cu rute regulate către Ungaria.",
      "Standarde europene: Profesionalism ridicat influențat de proximitatea Ungariei și legăturile cu Vestul.",
      "Tarife competitive: Prețuri moderate mai mici decât în Ungaria dar la standarde similare.",
    ],
    localTips: [
      "**Solicită servicii în limba preferată**: Multe firme oferă servicii bilingve română-maghiară. Specifică la rezervare.",
      "**Rezervă pentru mutări către Ungaria**: Rutele internaționale necesită programare din timp (2-3 săptămâni).",
      "**Verifică DN19**: Traficul către graniță poate fi intens. Programează mutarea în afara orelor de vârf.",
    ],
    priceContext:
      "Satu Mare oferă prețuri moderate. O garsonieră în Micro 17 costă 350-500 lei, un apartament cu 2 camere în Carpați 650-950 lei, iar o casă în Solidarității 1300-2400 lei. Mutările către Ungaria încep de la 1000 lei.",
  },
  {
    slug: "zalau",
    name: "Zalău",
    county: "Sălaj",
    population: "56.000",
    tier: 2,
    landmarks: ["Ruinele Castrul Roman", "Parcul Central", "Meseș"],
    neighborhoods: ["Centru", "Dumbrava", "Ortelec", "Porolissum"],
    metaDescription:
      "Servicii mutări Zalău ✓ Transport mobilă în Sălaj ✓ Compară oferte gratuite ✓ Rute către Cluj-Napoca ✓ Prețuri accesibile în Transilvania",
    heroSubtitle: "Capitala Sălajului, istorie și natură. Mutări sigure în Zalău.",
    articleIntro:
      "Zalăul, capitală a județului Sălaj cu 56.000 de locuitori, este un oraș liniștit în nord-vestul Transilvaniei la poalele Munților Meseș. Zalăuanii se mută între apartamentele din cartierele Dumbrava și Ortelec și casele din zonele rezidențiale noi. Provocările specifice includ infrastructura limitată specific orașelor mici, terenul ușor accidentat, și distanța față de orașele mari (Cluj la 100 km). Firmele locale oferă servicii personalizate și tarife foarte accesibile.",
    whyChooseUs: [
      "Tarife minime: Prețuri foarte accesibile specifice orașelor sub 60.000 locuitori, printre cele mai mici din Transilvania.",
      "Servicii personalizate: Firme mici, familiale care oferă atenție individuală fiecărui client.",
      "Rute către Cluj: Transport regulat către Cluj-Napoca pentru tineri care se mută pentru studii/cariere.",
    ],
    localTips: [
      "**Programează flexibil**: Fiind oraș mic, traficul nu este problemă. Poți programa mutarea oricând.",
      "**Negociază direct**: Firmele din Zalău sunt mici și familiale. Poți negocia personal prețuri avantajoase.",
      "**Coordonează cu Cluj**: Dacă te muți către/de la Cluj, multe firme oferă groupaje pe această rută.",
    ],
    priceContext:
      "Zalăul oferă prețuri foarte accesibile. O garsonieră în Ortelec costă 250-380 lei, un apartament cu 2 camere în Dumbrava 400-650 lei, iar o casă în zona nouă 800-1500 lei. Prețurile sunt printre cele mai mici din Transilvania.",
  },
  {
    slug: "sibiu",
    name: "Sibiu",
    county: "Sibiu",
    population: "147.000",
    tier: 2,
    landmarks: ["Piața Mare", "Podul Minciunilor", "Casele cu Ochi"],
    neighborhoods: ["Centru Istoric", "Hipodrom", "Cibin", "Ștrand", "Turnișor"],
    metaDescription:
      "Mutări Sibiu ✓ Transport mobilă în Transilvania ✓ Oferte gratuite de la firme verificate ✓ Economisește 40%",
    heroSubtitle: "Bijuterie medievală, Capitală Culturală Europeană. Mutări premium în Sibiu.",
    articleIntro:
      "Sibiul, fostă Capitală Culturală Europeană cu 147.000 de locuitori, este cel mai prezerval oraș medieval din România și un magnet pentru tinerii profesioniști și expat. Sibienii se mută frecvent între apartamentele renovate în Centrul Istoric și ansamblurile rezidențiale noi din Hipodrom, Cibin sau Turnișor. Provocările specifice sunt unique: accesul strict restricționat în Centrul Medieval (zonă UNESCO), clădiri istorice cu scări înguste și plafoane boltite, și standarde ridicate de servire așteptate de comunitatea internațională. Firmele locale oferă servicii premium la standarde europene.",
    whyChooseUs: [
      "Expertiză patrimoniu UNESCO: Firme specializate în mutări delicate în clădiri medievale protejate cu scări înguste și arhitectură fragilă.",
      "Standarde premium: Profesionalism de nivel european, punctualitate și comunicare impecabilă pentru clienții exigenți.",
      "Servicii internaționale: Rute regulate către Germania, Austria pentru expat și românii care emigrează.",
    ],
    localTips: [
      "**Solicită autorizare Centru**: Accesul în Centrul Medieval (Piața Mare, Piața Mică) este strict reglementat. Firma trebuie să obțină permis cu 1-2 săptămâni înainte.",
      "**Verifică scările în clădiri vechi**: Multe imobile din centru au scări medievale înguste și în spirală. Măsoară mobila mare înainte.",
      "**Rezervă din vreme**: Sibiul este foarte solicitat. Programează cu 3-4 săptămâni înainte, mai ales vara (sezon turistic).",
    ],
    priceContext:
      "Sibiul oferă prețuri ridicate refleftând calitatea vieții premium. O garsonieră în Cibin costă 500-750 lei, un apartament cu 2 camere în Hipodrom 900-1400 lei, iar o casă în Turnișor 2000-4000 lei. Mutările în Centrul Istoric costă cu 30-50% mai mult datorită complexității.",
  },
  {
    slug: "suceava",
    name: "Suceava",
    county: "Suceava",
    population: "92.000",
    tier: 2,
    landmarks: ["Cetatea de Scaun", "Mănăstirile din Bucovina", "Parcul Central"],
    neighborhoods: ["Centru", "George Enescu", "Obcini", "Burdujeni"],
    metaDescription:
      "Firme mutări Suceava ✓ Transport mobilă în Bucovina ✓ Compară oferte gratuite în 24h ✓ Acoperire mănăstiri UNESCO ✓ Firme locale verificate",
    heroSubtitle: "Poartă către Bucovina, țara mănăstirilor. Mutări de încredere în Suceava.",
    articleIntro:
      "Suceava, vechea capitală a Moldovei cu 92.000 de locuitori și poarta către mănăstirile pictate din Bucovina (UNESCO), este un centru turistic și economic în nordul țării. Sucevenii se mută frecvent între blocurile din cartierele George Enescu și Obcini și casele din zona Burdujeni, sau către locuințe de vacanță în zonele montane. Provocările specifice includ terenul accidentat, iernile extrem de geroase cu zăpadă abunedentă, și accesul restricționat în zona Cetății de Scaun. Firmele locale oferă servicii robuste adaptate climatului dur bucovinean.",
    whyChooseUs: [
      "Expertiză climat montan dur: Firme specializate în protecția mobilierului în ierni extrem de geroase specifice Bucovinei.",
      "Acoperire Bucovina: Servicii către Rădăuți, Câmpulung Moldovenesc, Vatra Dornei pentru case și cabană montane.",
      "Tarife accesibile: Prețuri competitive refleftând economia locală din nordul Moldovei.",
    ],
    localTips: [
      "**Evită iarna pentru mutări**: Noiembrie-martie Suceava are ierni extrem de geroase cu zăpadă. Programează mutarea aprilie-octombrie.",
      "**Solicită acces Cetate**: Dacă locuiești aproape de Cetatea de Scaun, accesul vehiculelor este restricționat. Anunță firma din timp.",
      "**Protejează mobilierul de frig**: Solicită materiale termice pentru protecție în transportul prin zonă montană.",
    ],
    priceContext:
      "Suceava oferă prețuri accesibile. O garsonieră în Obcini costă 300-450 lei, un apartament cu 2 camere în George Enescu 550-850 lei, iar o casă în Burdujeni 1200-2200 lei. Prețurile sunt mai mici decât în Iași dar refleftă condițiile dificile.",
  },
  {
    slug: "alexandria",
    name: "Alexandria",
    county: "Teleorman",
    population: "45.000",
    tier: 2,
    landmarks: ["Parcul Central", "Primăria", "Centrul Civic"],
    neighborhoods: ["Centru", "Vedea", "Libertății"],
    metaDescription:
      "Mutări Alexandria ✓ Transport mobilă în Teleorman ✓ Oferte gratuite de la firme locale ✓ Rute către București ✓ Cele mai accesibile prețuri din țară",
    heroSubtitle: "În câmpia Teleormanului, spirit agrar. Mutări profesionale în Alexandria.",
    articleIntro:
      "Alexandria, capitală a județului Teleorman cu 45.000 de locuitori, este un oraș agricol în câmpia Teleormanului la sud de București. Alexandrinii se mută între blocurile din Centru și zona Vedea, sau către orașe mai mari pentru job-uri (București la 90 km). Provocările specifice includ infrastructura minimală specific orașelor mici agricole, lipsa firmelor specializate, și traficul agricol pe DN6 care traversează orașul. Firmele locale oferă servicii simple și foarte accesibile adaptate economiei rurale.",
    whyChooseUs: [
      "Tarife minime: Prețuri foarte accesibile refleftând economia agrară din Teleorman, printre cele mai mici din țară.",
      "Rute către București: Transport pe DN6 pentru tineri care se mută în Capitală pentru studii/cariere.",
      "Servicii personalizate: Firme mici, familiale care oferă flexibilitate maximă și înțelegere.",
    ],
    localTips: [
      "**Evită sezonul agricol**: Vara și toamna DN6 este aglomerat cu combine și TIR-uri cu cereale. Programează mutarea primăvara sau iarna.",
      "**Programează flexibil**: Fiind oraș foarte mic, traficul local nu există. Poți programa mutarea oricând.",
      "**Negociază direct**: Firmele din Alexandria sunt familiale. Poți negocia personal prețuri foarte avantajoase.",
    ],
    priceContext:
      "Alexandria oferă cele mai accesibile prețuri. O garsonieră în Centru costă 200-330 lei, un apartament cu 2 camere în Vedea 350-550 lei, iar o casă 750-1300 lei. Prețurile refleftă economia rurală modestă. Mutările către București încep de la 500 lei.",
  },
  {
    slug: "tulcea",
    name: "Tulcea",
    county: "Tulcea",
    population: "73.000",
    tier: 2,
    landmarks: ["Deltă Dunării", "Monumentul Independenței", "Portul"],
    neighborhoods: ["Centru", "Piața Nouă", "Cima", "Vest"],
    metaDescription:
      "Servicii mutări Tulcea ✓ Transport mobilă în Dobrogea ✓ Compară oferte gratuite ✓ Acces Delta Dunării ✓ Protecție specială umezeală extremă",
    heroSubtitle: "Poarta Deltei, paradis natural. Mutări sigure în Tulcea.",
    articleIntro:
      "Tulcea, orașul-portă către Delta Dunării (UNESCO) cu 73.000 de locuitori, este un centru turistic și de pescuit la sud-estul țării. Tulcenii se mută între blocurile din cartierele Piața Nouă și Vest și casele din zona Cima, sau către Constanța (130 km). Provocările specifice sunt unice: umezeala extremă de la Dunăre și Delta, traficul sezonier cu turiști vara, și necesitatea transportului special către localitățile din Deltă (acces naval/terestru limitat). Firmele locale oferă servicii adaptate specificului deltaic.",
    whyChooseUs: [
      "Protecție umezeală deltaică: Expertiză unică în protecția mobilierului împotriva umidității extreme din zona Deltei.",
      "Acces în Deltă: Servicii specializate către localitățile din Delta Dunării cu acces limitat (Sulina, Sfântu Gheorghe).",
      "Tarife accesibile: Prețuri competitive refleftând economia locală bazată pe pescuit și turism sezonier.",
    ],
    localTips: [
      "**Protejează mobilierul obligatoriu**: Umezeala din Tulcea și Deltă este extremă. Solicită materiale impermeabile premium și tratament anti-mucegai.",
      "**Evită sezonul turistic**: Iunie-august Tulcea este aglomerată cu turiști. Mutările costă cu 30-40% mai mult. Alege primăvara sau toamna.",
      "**Coordonează transport Deltă**: Dacă te muți în/din localități din Deltă, planifică din timp - accesul este limitat și necesită combinații terestru-naval.",
    ],
    priceContext:
      "Tulcea oferă prețuri moderate, variabile sezonier. O garsonieră în Vest costă 300-450 lei (400-600 lei vara), un apartament cu 2 camere în Piața Nouă 550-850 lei (700-1100 lei vara), iar o casă în Cima 1200-2200 lei. Mutările în Deltă costă semnificativ mai mult (dublu-triplu).",
  },
  {
    slug: "vaslui",
    name: "Vaslui",
    county: "Vaslui",
    population: "55.000",
    tier: 2,
    landmarks: ["Statuia lui Ștefan cel Mare", "Parcul Copou", "Centrul Istoric"],
    neighborhoods: ["Centru", "Traian", "Republicii", "Olteni"],
    metaDescription:
      "Mutări Vaslui ✓ Transport mobilă în Moldova ✓ Oferte gratuite de la firme verificate ✓ Rute către Iași și Bacău ✓ Prețuri foarte accesibile",
    heroSubtitle: "Locul victoriei lui Ștefan cel Mare. Mutări de încredere în Vaslui.",
    articleIntro:
      "Vasluiul, oraș istoric cu 55.000 de locuitori și locul victoriei lui Ștefan cel Mare în 1475, este un centru urban modest în estul Moldovei. Vasluienii se mută între blocurile din cartierele Traian și Republicii și casele din zona Olteni, sau emigrează către orașe mai mari (Iași, Bacău). Provocările specifice includ infrastructura limitată și învăchită, economia locală slabă, și lipsa firmelor specializate de mutări. Firmele locale oferă servicii simple la prețuri foarte accesibile.",
    whyChooseUs: [
      "Tarife minime: Prețuri foarte accesibile refleftând economia locală modestă, printre cele mai mici din Moldova.",
      "Rute către Iași/Bacău: Transport regulat către orașele majore din Moldova pentru tineri care emigrează.",
      "Flexibilitate și înțelegere: Firme locale care înțeleg nevoile comunității și oferă soluții personalizate.",
    ],
    localTips: [
      "**Programează flexibil**: Fiind oraș mic, traficul nu este problemă. Poți programa mutarea oricând.",
      "**Verifică starea blocurilor**: Vasluiul are infrastructură învăchită. Confirmă funcționalitatea lifturilor în blocurile vechi.",
      "**Negociază pentru rute Moldova**: Dacă te muți către Iași sau Bacău, multe firme oferă groupaje avantajoase.",
    ],
    priceContext:
      "Vasluiul oferă prețuri foarte accesibile. O garsonieră în Republicii costă 220-350 lei, un apartament cu 2 camere în Traian 380-600 lei, iar o casă în Olteni 800-1500 lei. Prețurile sunt printre cele mai mici din Moldova.",
  },
  {
    slug: "ramnicu-valcea",
    name: "Râmnicu Vâlcea",
    county: "Vâlcea",
    population: "98.000",
    tier: 2,
    landmarks: ["Barajul Vidraru", "Parcul Zăvoi", "Mănăstiri Oltenia"],
    neighborhoods: ["Centru", "Traian", "Nord", "Ostroveni"],
    metaDescription:
      "Firme mutări Râmnicu Vâlcea ✓ Transport mobilă în Vâlcea ✓ Compară oferte gratuite ✓ Servicii către stațiuni montane ✓ Expertiză Valea Oltului",
    heroSubtitle: "La poalele Carpaților, pe Valea Oltului. Mutări profesionale în Râmnicu Vâlcea.",
    articleIntro:
      "Râmnicu Vâlcea, orașul de pe Valea Oltului cu 98.000 de locuitori și poarta către stațiunile Oltenia (Călimănești, Căciulata), este un centru urban la poalele Carpaților. Vâlcenii se mută frecvent între blocurile din cartierele Traian și Nord și casele din zona Ostroveni, sau către stațiunile montane pentru locuințe de vacanță. Provocările specifice includ terenul accidentat cu dealuri și văi, traficul pe DN7 către Sibiu, și necesitatea mutărilor speciale către zonele montane. Firmele locale oferă servicii adaptate reliefului variat.",
    whyChooseUs: [
      "Expertiză Valea Oltului: Firme specializate în mutări pe terenul accidentat specific Văii Oltului și către stațiuni montane.",
      "Servicii către stațiuni: Transport regulat către Călimănești, Căciulata, Băile Olănești pentru case de vacanță.",
      "Tarife moderate: Prețuri accesibile refleftând economia locală din nordul Olteniei.",
    ],
    localTips: [
      "**Anunță despre teren**: Vâlcea are relief variat cu dealuri și văi. Informează firma despre localizarea exactă.",
      "**Coordonează DN7**: Traficul pe DN7 către Sibiu poate fi intens. Programează mutarea în afara orelor de vârf (9:00-15:00).",
      "**Profidă de rute stațiuni**: Dacă te muți către/de la Călimănești, multe firme au transport regulat și oferă tarife avantajoase.",
    ],
    priceContext:
      "Râmnicu Vâlcea oferă prețuri moderate. O garsonieră în Nord costă 320-480 lei, un apartament cu 2 camere în Traian 600-900 lei, iar o casă în Ostroveni 1300-2400 lei. Mutările către stațiuni montane adăugă 10-20% la preț.",
  },
  {
    slug: "focsani",
    name: "Focșani",
    county: "Vrancea",
    population: "79.000",
    tier: 2,
    landmarks: ["Mausoleul Unirii", "Parcul Bujorilor", "Centrul Vechi"],
    neighborhoods: ["Centru", "Sud", "Nord", "Vest"],
    metaDescription:
      "Mutări Focșani ✓ Transport mobilă în Vrancea ✓ Oferte gratuite în 24h ✓ Rute către Brașov, Bacău, Galați ✓ Firme locale verificate",
    heroSubtitle: "Orașul Unirii, la confluența istoriei. Mutări sigure în Focșani.",
    articleIntro:
      "Focșaniul, orașul Unirii Principatelor din 1859 cu 79.000 de locuitori, este un centru urban la răscruce între Moldova și Muntenia, renumit pentru vinurile de Cotești și Odobești. Focșănenii se mută între blocurile din cartierele Sud, Nord și Vest și casele din zonele rezidențiale, sau către Brașov/Bacău (ambele la ~100 km). Provocările specifice includ infrastructura învăchită, blocurile vechi fără lift, și traficul pe DN2 care traversează orașul. Firmele locale oferă servicii accesibile adaptate economiei locale.",
    whyChooseUs: [
      "Poziție strategică: Rute regulate către Brașov, Bacău, Galați pentru mutări intercounty avantajoase.",
      "Tarife accesibile: Prețuri competitive refleftând economia locală din Vrancea.",
      "Flexibilitate: Firme locale care oferă program flexibil și soluții personalizate.",
    ],
    localTips: [
      "**Evită DN2 în orele de vârf**: Traficul pe DN2 (București-Suceava) poate fi intens. Programează mutarea la prânz sau weekend.",
      "**Verifică lifturile**: Multe blocuri din Sud și Nord au lifturi defecte. Confirmă funcționalitatea sau solicită personal extra.",
      "**Profidă de poziție centrală**: Dacă te muți către Brașov sau Bacău, Focșaniul este la jumătatea drumului - negociază tarife pentru groupaje.",
    ],
    priceContext:
      "Focșaniul oferă prețuri accesibile. O garsonieră în Sud costă 280-420 lei, un apartament cu 2 camere în Nord 500-750 lei, iar o casă în zona nouă 1100-2000 lei. Prețurile sunt medii între Moldova și Muntenia.",
  },
  {
    slug: "deva",
    name: "Deva",
    county: "Hunedoara",
    population: "61.000",
    tier: 2,
    landmarks: ["Cetatea Deva", "Telecabina", "Parcul Cetate"],
    neighborhoods: ["Centru", "Bejan", "Micro", "Progresul"],
    metaDescription:
      "Servicii mutări Deva ✓ Transport mobilă în Hunedoara ✓ Compară oferte gratuite ✓ Rute către Timișoara și Cluj ✓ Prețuri accesibile Transilvania",
    heroSubtitle: "Sub cetatea medievală, capitală a aurului. Mutări de încredere în Deva.",
    articleIntro:
      "Deva, capitală a județului Hunedoara cu 61.000 de locuitori, este un oraș istoric dominat de Cetatea medievală pe deal și fost centru minier. Devenii se mută între blocurile din cartierele Micro și Progresul și casele din zona Bejan, sau către orașe mai mari (Timișoara, Cluj). Provocările specifice includ terenul accidentat (Cetatea pe deal, orașul pe văi), infrastructura post-industrială, și economia în tranziție după închiderea minelor. Firmele locale oferă servicii accesibile adaptate nevoilor comunității.",
    whyChooseUs: [
      "Expertiză teren accidentat: Firme care operează pe terenul variat al Devei cu dealuri și văi.",
      "Tarife accesibile: Prețuri competitive refleftând economia locală în tranziție post-industrială.",
      "Rute către orașe mari: Transport regulat către Timișoara, Cluj, Sibiu pentru tineri care emigrează.",
    ],
    localTips: [
      "**Anunță despre teren**: Deva are relief variat. Informează firma despre localizarea exactă, mai ales dacă locuiești aproape de Cetate.",
      "**Programează flexibil**: Traficul în Deva este minimal. Poți programa mutarea oricând fără restricții.",
      "**Verifică lifturile**: Multe blocuri din Micro au lifturi vechi defecte. Confirmă funcționalitatea sau solicită personal extra.",
    ],
    priceContext:
      "Deva oferă prețuri accesibile. O garsonieră în Progresul costă 280-420 lei, un apartament cu 2 camere în Micro 500-750 lei, iar o casă în Bejan 1000-1800 lei. Prețurile sunt printre cele mai mici din Transilvania.",
  },
  {
    slug: "miercurea-ciuc",
    name: "Miercurea Ciuc",
    county: "Harghita",
    population: "38.000",
    tier: 2,
    landmarks: ["Cetatea Mikó", "Parcul Central", "Pârtia de schi"],
    neighborhoods: ["Centru", "Topliței", "Jigodin"],
    metaDescription:
      "Mutări Miercurea Ciuc ✓ Transport mobilă în Harghita ✓ Oferte gratuite de la firme verificate ✓ Servicii bilingve ✓ Expertiză climat montan",
    heroSubtitle: "În țara secuiască, la poalele Harghitei. Mutări profesionale în Miercurea Ciuc.",
    articleIntro:
      "Miercurea Ciuc, capitală a Ținutului Secuiesc cu 38.000 de locuitori și majoritate maghiară, este cel mai înalt oraș din România (661m altitudine) în depresiunea Ciuc. Locuitorii se mută între blocurile din cartierele Centru și Topliței și casele din zonele rezidențiale, sau către Brașov/Cluj. Provocările specifice sunt extreme: ierni foarte geroase (temperaturi de -30°C), zăpadă abunedentă octombrie-aprilie, terenul montan, și necesitatea serviciilor bilingve. Firmele locale oferă servicii adaptate climatului extrem.",
    whyChooseUs: [
      "Expertiză climat extrem: Firme specializate în protecția mobilierului în condiții arctice, unic în România.",
      "Servicii bilingve: Personal care vorbește română și maghiară pentru comunicare perfectă cu comunitatea secuiască.",
      "Tarife accesibile: Prețuri competitive refleftând economia locală din Harghita.",
    ],
    localTips: [
      "**Evită iarna obligatoriu**: Octombrie-aprilie Miercurea Ciuc are ierni extrem de geroase. Programează mutarea mai-septembrie.",
      "**Protejează mobilierul de frig**: Solicită materiale termice premium pentru protecție în temperaturi de -20/-30°C.",
      "**Solicită servicii bilingve**: Specifică limba preferată (română/maghiară) la rezervare.",
    ],
    priceContext:
      "Miercurea Ciuc oferă prețuri accesibile dar cu suplimente pentru condiții extreme. O garsonieră în Centru costă 280-420 lei, un apartament cu 2 camere în Topliței 500-750 lei, iar o casă 900-1600 lei. Mutările iarna adăugă 30-50% la preț datorită riscurilor.",
  },
  {
    slug: "targu-jiu",
    name: "Târgu Jiu",
    county: "Gorj",
    population: "82.000",
    tier: 2,
    landmarks: ["Coloana Infinitului", "Poarta Sărutului", "Parcul Central"],
    neighborhoods: ["Centru", "Drăgoeni", "Tudor Vladimirescu", "Primăverii"],
    metaDescription:
      "Firme mutări Târgu Jiu ✓ Transport mobilă în Gorj ✓ Compară oferte gratuite în 24h ✓ Rute către Craiova ✓ Prețuri accesibile în Oltenia",
    heroSubtitle: "Orașul lui Brâncuși, artă și tradiție. Mutări sigure în Târgu Jiu.",
    articleIntro:
      "Târgu Jiul, orașul lui Constantin Brâncuși cu 82.000 de locuitori și renumit pentru ansamblul sculptural Calea Eroilor, este capitală a județului Gorj și centru minier în sud-vestul țării. Gorjenii se mută frecvent între blocurile din cartierele Drăgoeni și Tudor Vladimirescu și casele din zona Primăverii, sau către Craiova (90 km). Provocările specifice includ infrastructura post-industrială, blocurile vechi comuniste, și economia în tranziție după declinul industriei cărbunelui. Firmele locale oferă servicii accesibile adaptate nevoilor comunității miniere.",
    whyChooseUs: [
      "Tarife accesibile: Prețuri competitive refleftând economia locală din Gorj, printre cele mai mici din Oltenia.",
      "Rute către Craiova: Transport regulat către capitala Olteniei pentru mutări intercity avantajoase.",
      "Înțelegere comunitate: Firme locale care înțeleg nevoile comunității muncitorești miniere.",
    ],
    localTips: [
      "**Verifică lifturile obligatoriu**: Multe blocuri din Drăgoeni și Tudor Vladimirescu au lifturi vechi defecte. Confirmă funcționalitatea.",
      "**Programează combinat cu Craiova**: Dacă te muți către/de la Craiova, multe firme oferă groupaje avantajoase pe această rută.",
      "**Flexibilitate orară**: Traficul în Târgu Jiu este minimal. Poți programa mutarea oricând.",
    ],
    priceContext:
      "Târgu Jiul oferă prețuri accesibile. O garsonieră în Tudor Vladimirescu costă 280-420 lei, un apartament cu 2 camere în Drăgoeni 500-750 lei, iar o casă în Primăverii 1100-2000 lei. Prețurile sunt printre cele mai mici din Oltenia.",
  },
  {
    slug: "giurgiu",
    name: "Giurgiu",
    county: "Giurgiu",
    population: "54.000",
    tier: 2,
    landmarks: ["Turnul cu Ceas", "Dunărea", "Podul Prieteniei"],
    neighborhoods: ["Centru", "Dunărea", "Slobozia", "Giurgiu Nord"],
    metaDescription:
      "Mutări Giurgiu ✓ Transport mobilă la Dunăre ✓ Oferte gratuite ✓ Mutări către Bulgaria ✓ Rute București ✓ Servicii transfrontaliere profesionale",
    heroSubtitle: "La poarta spre Bulgaria, port dunărean. Mutări rapide în Giurgiu.",
    articleIntro:
      "Giurgiul, oraș -portă la granița cu Bulgaria cu 54.000 de locuitori, este legăt de orașul bulgăresc Ruse prin Podul Prieteniei peste Dunăre. Giurgiuvenii se mută între blocurile din cartierele Centru și Slobozia și casele din zona Dunării, sau către București (60 km). Provocările specifice includ umezeala extremă de la Dunăre, infrastructura limitată, traficul cu TIR-uri către Bulgaria, și economia modestă dependentă de traficul transfrontalier. Firmele locale oferă servicii simple și accesibile, inclusiv transporturi către Bulgaria.",
    whyChooseUs: [
      "Servicii transfrontaliere: Firme specializate în mutări către Bulgaria (Ruse, Plovdiv) pentru giurgiuvenii cu legături în Bulgaria.",
      "Tarife minime: Prețuri foarte accesibile refleftând economia locală modestă, printre cele mai mici din țară.",
      "Rute către București: Transport regulat pe DN5 pentru tineri care se mută în Capitală.",
    ],
    localTips: [
      "**Protejează mobilierul de Dunăre**: Umezeala de la Dunăre este extremă. Solicită materiale impermeabile pentru protecție.",
      "**Evită traficul TIR-uri**: DN5 și Podul Prieteniei sunt aglomerate cu camioane către Bulgaria. Programează mutarea în weekend.",
      "**Rezervă pentru Bulgaria**: Dacă te muți către/de la Bulgaria, rezervă cu 2-3 săptămâni înainte pentru documente vamale.",
    ],
    priceContext:
      "Giurgiul oferă prețuri foarte accesibile. O garsonieră în Slobozia costă 220-350 lei, un apartament cu 2 camere în Centru 380-600 lei, iar o casă 800-1500 lei. Mutările către București încep de la 450 lei, către Bulgaria de la 800 lei.",
  },
];

// Get all city slugs for static paths
export function getAllCitySlugs(): string[] {
  return cityData.map((city) => city.slug);
}

// Get city data by slug
export function getCityBySlug(slug: string): CityData | undefined {
  return cityData.find((city) => city.slug === slug);
}

// Get top cities for footer/navigation
export function getTopCities(limit: number = 10): CityData[] {
  return cityData.filter((city) => city.tier === 1).slice(0, limit);
}
