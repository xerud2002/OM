"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange } from "@/utils/firebaseHelpers";

export default function FloatingCTA() {
  const router = useRouter();
  const pathname = router.pathname;
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [visible, setVisible] = useState(false);

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

  if (shouldHide) return null;

  const handleClick = () => {
    if (user) router.push("/customer/dashboard");
    else {
      localStorage.setItem("redirectAfterLogin", "form");
      router.push("/customer/auth");
    }
  };

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed right-6 bottom-6 z-40 flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-sky-500 px-5 py-3 font-bold text-white shadow-2xl transition-all hover:shadow-emerald-400/50 md:hidden"
      aria-label="Primește oferte gratuite"
    >
      🎁 Primește Oferte
      <ArrowRight size={20} />
    </motion.button>
  );
}
