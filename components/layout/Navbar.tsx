"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PhoneCall, LogOut, User, LayoutDashboard } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange, logout } from "@/utils/firebaseHelpers";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  /* 🔹 Scroll shadow logic */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* 🔹 Firebase user state */
  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return () => unsub();
  }, []);

  /* 🔹 Navigation logic */
  const handleGetOffers = () => {
    if (user) router.push("/form");
    else {
      localStorage.setItem("redirectAfterLogin", "form");
      router.push("/customer/auth");
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/about", label: "Despre Noi" },
    { href: "/contact", label: "Contact" },
    { href: "/company/auth", label: "Devino Partener" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-emerald-100 bg-white/90 shadow-md backdrop-blur-xl"
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* === LOGO === */}
        <Link href="/" aria-label="Acasă" className="flex select-none items-center space-x-2">
          <Image
            src="/logo.png"
            alt="ofertemutare.ro logo"
            width={180}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        {/* === DESKTOP NAV === */}
        <nav className="hidden items-center space-x-2 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
                pathname === href
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {label}
            </Link>
          ))}

          {!user ? (
            <button
              onClick={handleGetOffers}
              aria-label="Primește Oferte Gratuite"
              className="ml-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 font-bold text-white shadow-lg transition-all hover:scale-[1.06] hover:shadow-xl"
            >
              <PhoneCall size={18} /> Primește Oferte GRATUITE
            </button>
          ) : (
            <div className="relative ml-3">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                aria-haspopup="true"
                aria-expanded={showUserMenu}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:scale-[1.04]"
              >
                <User size={18} />
                <span className="max-w-[140px] truncate">{user.email?.split("@")[0]}</span>
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-lg"
                  >
                    <Link
                      href="/customer/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all hover:bg-emerald-50"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 transition-all hover:bg-emerald-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* === MOBILE MENU TOGGLE === */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Menu"
          className="rounded-lg p-2 text-emerald-700 transition hover:bg-emerald-50 md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === MOBILE MENU === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="border-t border-emerald-100 bg-white/95 shadow-lg backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col space-y-2 px-6 py-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-2 font-medium transition-all ${
                    pathname === href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {label}
                </Link>
              ))}

              <button
                onClick={handleGetOffers}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2 font-semibold text-white shadow-md transition-all hover:shadow-lg"
              >
                <PhoneCall size={18} /> Obține Oferte
              </button>

              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-gray-700 transition-all hover:bg-emerald-50"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
