import { useEffect, useState } from "react";
import { X, Sparkles, ArrowRight, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { trackExitIntentShown, trackExitIntentConversion } from "@/utils/analytics";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 &&
        !hasShown &&
        window.innerWidth > 768
      ) {
        setIsVisible(true);
        setHasShown(true);
        trackExitIntentShown();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 text-gray-400 backdrop-blur-sm transition-all hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 px-6 py-8 text-center text-white">
          {/* Animated sparkle */}
          <div className="absolute top-4 left-4 animate-pulse">
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </div>
          <div className="absolute bottom-4 right-4 animate-pulse delay-150">
            <Sparkles className="h-5 w-5 text-yellow-300/80" />
          </div>
          
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            Ofertă limitată
          </div>
          
          <h3 className="mb-2 text-2xl font-bold">
            Hei, nu pleca încă! 👋
          </h3>
          <p className="text-emerald-50">
            Ai uitat să ceri oferte gratuite pentru mutarea ta
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-5 space-y-3">
            {[
              "Compari până la 5 oferte în 24h",
              "Firme verificate, fără bătăi de cap",
              "100% gratuit, fără obligații"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/customer/auth"
            className="group mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            onClick={handleConvert}
          >
            Vreau oferte gratuite
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={handleClose}
            className="w-full text-center text-xs text-gray-400 transition-colors hover:text-gray-500"
          >
            Nu acum, poate mai târziu
          </button>
        </div>
      </div>
    </div>
  );
}

