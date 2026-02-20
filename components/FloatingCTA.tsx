import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightIcon as ArrowRight,
  XMarkIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange } from "@/services/firebaseHelpers";
import { trackCTAClick } from "@/utils/analytics";
import dynamic from "next/dynamic";

const HomeRequestForm = dynamic(
  () => import("@/components/home/HomeRequestForm"),
  {
    loading: () => (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-100" />
        <div className="mt-6 space-y-3">
          <div className="h-12 rounded-xl bg-gray-100" />
          <div className="h-12 rounded-xl bg-gray-100" />
        </div>
      </div>
    ),
    ssr: false,
  },
);

export default function FloatingCTA() {
  const router = useRouter();
  const pathname = router.pathname;
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return () => unsub();
  }, []);

  // Show FAB after scrolling down a bit, but hide on form/dashboard pages
  useEffect(() => {
    const hiddenPaths = [
      "/form",
      "/customer/dashboard",
      "/company/dashboard",
      "/customer/auth",
      "/company/auth",
    ];
    const shouldHide = hiddenPaths.some((path) => pathname?.startsWith(path));

    if (shouldHide) {
      return;
    }

    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Hide FAB on specific pages
  const hiddenPaths = [
    "/form",
    "/customer/dashboard",
    "/company/dashboard",
    "/customer/auth",
    "/company/auth",
  ];
  const shouldHide = hiddenPaths.some((path) => pathname?.startsWith(path));

  const handleClick = () => {
    trackCTAClick("get_offers", "mobile_fab");
    setShowModal(true);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  if (shouldHide) return null;

  return (
    <>
      {/* FAB Button */}
      {visible && !showModal && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="fixed right-6 bottom-6 z-40 flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-sky-500 px-5 py-3 font-bold text-white shadow-2xl transition-all hover:shadow-emerald-400/50 md:hidden"
          aria-label="Primește oferte gratuite"
        >
          📋 Primește Oferte
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      )}

      {/* Request Form Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-3 top-3 z-10 rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                    <DocumentPlusIcon className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Cerere nouă
                    </p>
                    <p className="text-xs text-gray-500">
                      Completează pentru a primi oferte de la firme verificate
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <HomeRequestForm
                  user={
                    user
                      ? {
                          displayName: user.displayName || undefined,
                          email: user.email || undefined,
                        }
                      : undefined
                  }
                  onSuccess={() => {
                    setShowModal(false);
                    import("sonner").then(({ toast }) => {
                      toast.success(
                        "Cererea a fost trimisă cu succes! Vei primi oferte în maxim 24h.",
                      );
                    });
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
