import { useEffect, useState } from "react";
import { X, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import { trackExitIntentShown, trackExitIntentConversion } from "@/utils/analytics";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 && // Mouse leaves top of screen
        !hasShown && // Haven't shown it yet
        window.innerWidth > 768 // Desktop only
      ) {
        setIsVisible(true);
        setHasShown(true);
        trackExitIntentShown(); // Track impression
        // Optionally save to localStorage to not annoy user
        // localStorage.setItem('exitPopupShown', 'true');
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    trackExitIntentConversion("dismissed");
  };

  const handleConvert = () => {
    setIsVisible(false);
    trackExitIntentConversion("clicked_cta");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image Side */}
          <div className="hidden bg-orange-600 p-8 text-white md:flex md:flex-col md:justify-center">
            <Gift className="mb-4 h-12 w-12" />
            <h3 className="mb-2 text-2xl font-bold">Așteaptă!</h3>
            <p className="text-orange-100">
              Nu rata ocazia de a economisi până la 40% la mutarea ta.
            </p>
          </div>

          {/* Content Side */}
          <div className="p-8">
            <h3 className="mb-2 text-xl font-bold text-gray-900 md:hidden">
              Așteaptă! Nu pleca încă!
            </h3>
            <p className="mb-6 text-gray-600">
              Primești <span className="font-bold text-orange-600">Ghidul Complet de Mutare</span> + 
              Checklist gratuit dacă soliciți oferte acum.
            </p>

            <Link
              href="/customer/auth"
              className="group mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-orange-700 hover:shadow-xl hover:-translate-y-0.5"
              onClick={handleConvert}
            >
              Vreau Oferte & Ghid
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={handleClose}
              className="w-full text-center text-sm font-medium text-gray-400 hover:text-gray-600"
            >
              Nu, mulțumesc, prefer să plătesc prețul întreg
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
