import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { 
  GiftIcon, 
  PhoneIcon, 
  CheckCircleIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  BoltIcon,
  StarIcon,
  ArrowRightIcon,
  FireIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export default function BuyCredits() {
  const { dashboardUser, user } = useAuth();
  const [isFirstDeposit, setIsFirstDeposit] = useState(true);
  const [currentCredits, setCurrentCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstDeposit = async () => {
      if (!user?.uid) return;
      try {
        const companyDoc = await getDoc(doc(db, "companies", user.uid));
        if (companyDoc.exists()) {
          const data = companyDoc.data();
          setCurrentCredits(data.credits || 0);
          // Check if they've ever had more credits or made a purchase
          setIsFirstDeposit(!data.firstPurchaseDate);
        }
      } catch (err) {
        console.error("Error checking deposit status:", err);
      } finally {
        setLoading(false);
      }
    };
    checkFirstDeposit();
  }, [user?.uid]);

  return (
    <RequireRole allowedRole="company">
      <DashboardLayout role="company" user={dashboardUser}>
        <div className="space-y-6 sm:space-y-8">
          
          {/* First Deposit Hero Banner */}
          {isFirstDeposit && !loading && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 p-6 sm:p-8 text-white shadow-lg">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl" />
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-orange-300/20 blur-3xl" />
              
              <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                <div className="shrink-0 hidden sm:block">
                  <div className="relative">
                    <div className="rounded-2xl bg-white/30 p-4 shadow-lg">
                      <GiftIcon className="h-12 w-12 text-white drop-shadow-md" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <SparklesIcon className="h-6 w-6 text-yellow-300 animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-1.5 text-sm font-semibold mb-3 shadow-sm">
                    <FireIcon className="h-4 w-4 text-yellow-300" />
                    <span>Ofertă Exclusivă pentru Parteneri Noi</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold drop-shadow-sm">
                    Prima achiziție? Primești <span className="text-yellow-300 drop-shadow-md">+50% BONUS!</span>
                  </h2>
                  <p className="mt-2 text-white/95 text-sm sm:text-base max-w-xl">
                    Fă prima încărcare și primești credite bonus să începi în forță!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Balance Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-100 p-3">
                <BoltIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sold curent</p>
                <p className="text-2xl font-bold text-gray-900">{currentCredits} <span className="text-base font-medium text-gray-500">credite</span></p>
              </div>
            </div>
            {currentCredits < 50 && (
              <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Sold scăzut - încarcă acum!
              </div>
            )}
          </div>

          {/* First Deposit Special Offer */}
          {isFirstDeposit && !loading && (
            <div className="relative rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wide mb-4">
                    <StarIconSolid className="h-3 w-3" />
                    Ofertă Exclusivă - Doar Prima Achiziție
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    🎁 Pachet de Start Exclusiv
                  </h3>
                  <p className="text-gray-600 mb-5 max-w-md">
                    Începe să câștigi clienți de pe platformă cu oferta noastră specială pentru parteneri noi.
                  </p>
                  
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm border border-gray-100">
                      <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Fără comisioane ascunse</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm border border-gray-100">
                      <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Suport dedicat</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm border border-gray-100">
                      <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Activare instantă</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto">
                  <div className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-amber-200 min-w-[240px]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase shadow-md">
                        +50% Bonus
                      </span>
                    </div>
                    
                    <div className="text-center pt-3">
                      <p className="text-sm text-gray-500 mb-1">Plătești doar</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-extrabold text-gray-900">199</span>
                        <span className="text-lg text-gray-500">RON</span>
                      </div>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-400 line-through">400 credite</span>
                        <ArrowRightIcon className="h-4 w-4 text-amber-500" />
                        <span className="text-lg font-bold text-amber-600">600 credite</span>
                      </div>
                      <p className="text-xs text-emerald-600 font-semibold mt-1">+200 credite GRATIS!</p>
                    </div>
                    
                    <button 
                      onClick={() => window.open("mailto:contact@ofertemutare.ro?subject=Prima Achizitie - Pachet Start 199 RON&body=Bună ziua,%0A%0ADoresc să beneficiez de oferta de bun venit pentru prima mea achiziție.%0A%0AMulțumesc!", "_blank")}
                      className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 px-5 text-center font-bold text-white shadow-lg shadow-amber-500/30 transition hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <RocketLaunchIcon className="h-5 w-5" />
                      Vreau Oferta!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Title */}
          <div className="text-center pt-4">
            <h2 className="text-xl font-bold text-gray-900">
              {isFirstDeposit ? "Sau alege alt pachet" : "Alege pachetul potrivit"}
            </h2>
            <p className="mt-1 text-gray-500 text-sm">
              Toate pachetele includ acces complet la platformă
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {/* Basic Pack */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-lg hover:border-gray-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <StarIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Start</h3>
                  <p className="text-xs text-gray-500">Pentru început</p>
                </div>
              </div>
              
              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-900">250</span>
                  <span className="text-base font-medium text-gray-500">RON</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">500 credite</p>
              </div>
              
              <ul className="mb-6 space-y-3 text-sm text-gray-600 flex-1">
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>~10 oferte trimise</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Chat nelimitat</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Suport email</span>
                </li>
              </ul>
              
              <button 
                onClick={() => window.open("mailto:contact@ofertemutare.ro?subject=Achizitie Pachet Start 250 RON", "_blank")}
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 text-center font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
              >
                Contactează-ne
              </button>
            </div>

            {/* Pro Pack - Popular */}
            <div className="relative flex flex-col rounded-2xl border-2 border-emerald-500 bg-white p-5 sm:p-6 shadow-xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 text-sm font-bold text-white shadow-lg">
                  <SparklesIcon className="h-4 w-4" />
                  Recomandat
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4 pt-2">
                <div className="rounded-xl bg-emerald-100 p-2.5">
                  <RocketLaunchIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Pro</h3>
                  <p className="text-xs text-gray-500">Cel mai ales</p>
                </div>
              </div>
              
              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-900">500</span>
                  <span className="text-base font-medium text-gray-500">RON</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">1200 credite</p>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">+20%</span>
                </div>
              </div>
              
              <ul className="mb-6 space-y-3 text-sm text-gray-600 flex-1">
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>~24 oferte trimise</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Chat nelimitat</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Suport prioritar</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Badge &quot;Partener Verificat&quot;</span>
                </li>
              </ul>
              
              <button 
                onClick={() => window.open("mailto:contact@ofertemutare.ro?subject=Achizitie Pachet Pro 500 RON", "_blank")}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-center font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Alege Pro
              </button>
            </div>

            {/* Business Pack */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-lg hover:border-gray-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-purple-100 p-2.5">
                  <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Business</h3>
                  <p className="text-xs text-gray-500">Volum mare</p>
                </div>
              </div>
              
              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-900">1000</span>
                  <span className="text-base font-medium text-gray-500">RON</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">2500 credite</p>
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">+25%</span>
                </div>
              </div>
              
              <ul className="mb-6 space-y-3 text-sm text-gray-600 flex-1">
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>~50 oferte trimise</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Chat nelimitat</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Manager dedicat</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Rapoarte lunare</span>
                </li>
              </ul>
              
              <button 
                onClick={() => window.open("mailto:contact@ofertemutare.ro?subject=Achizitie Pachet Business 1000 RON", "_blank")}
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 text-center font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
              >
                Contactează-ne
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheckIcon, label: "Plată Securizată" },
              { icon: BoltIcon, label: "Activare Instant" },
              { icon: CheckCircleIcon, label: "Fără Contracte" },
              { icon: StarIconSolid, label: "Suport Rapid" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 p-4 text-center">
                <badge.icon className="h-6 w-6 text-emerald-600" />
                <span className="text-xs font-medium text-gray-600">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* Custom CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8 text-center text-white">
            <h2 className="text-xl font-bold">Ai nevoie de mai multe credite?</h2>
            <p className="mt-2 text-gray-300 text-sm sm:text-base">
              Contactează-ne pentru un pachet personalizat adaptat nevoilor tale.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
              <a 
                href="tel:+40700000000" 
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-gray-900 transition hover:bg-gray-100 active:scale-[0.98]"
              >
                <PhoneIcon className="h-5 w-5" />
                Sună-ne
              </a>
              <a 
                href="mailto:contact@ofertemutare.ro?subject=Pachet Personalizat Credite" 
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10 active:scale-[0.98]"
              >
                Trimite email
              </a>
            </div>
          </div>

          {/* FAQ Teaser */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              Ai întrebări? <a href="/faq" className="text-emerald-600 font-medium hover:underline">Vezi secțiunea FAQ</a> sau contactează-ne direct.
            </p>
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}


