"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, PhoneCall, LogOut, User, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/router";
import type { User as FirebaseUser } from "firebase/auth";
import dynamic from "next/dynamic";
import { trackCTAClick } from "@/utils/analytics";

// Lazy load Firebase helpers to reduce initial bundle
const NotificationBell = dynamic(() => import("@/components/company/NotificationBell"), {
  ssr: false,
  loading: () => null,
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<"customer" | "company" | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;

  /* 🔹 Scroll shadow logic */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* 🔹 Lazy load Firebase auth on first user interaction for maximum performance */
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let mounted = true;

    const loadAuth = async () => {
      if (!mounted) return;
      try {
        const { onAuthChange, getUserRole } = await import("@/utils/firebaseHelpers");
        unsub = onAuthChange(async (u) => {
          if (!mounted) return;
          setUser(u);
          if (u) {
            const role = await getUserRole(u);
            if (mounted) setUserRole(role);
          } else {
            setUserRole(null);
          }
        });
      } catch {
        // Auth loading failed silently
      }
    };

    // Use interaction-based loading for maximum LCP performance
    // Firebase only loads when user clicks, scrolls, or touches the page
    import("@/utils/interactionLoader").then(({ loadOnInteraction }) => {
      loadOnInteraction(loadAuth);
    });

    return () => {
      mounted = false;
      unsub?.();
    };
  }, []);

  /* 🔹 Navigation logic */
  const handleGetOffers = () => {
    trackCTAClick("get_offers", "navbar");
    if (user) router.push("/customer/dashboard");
    else {
      localStorage.setItem("redirectAfterLogin", "/customer/dashboard");
      router.push("/customer/auth");
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    router.push("/");
    const { logout } = await import("@/utils/firebaseHelpers");
    await logout();
    setUser(null);
  };

  const navLinks = [
    { href: "/#services", label: "Servicii Mutare" },
    { href: "/#how-it-works", label: "Cum funcționează" },
    { href: "/partener", label: "Devino Partener" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${scrolled
        ? "border-b border-emerald-100 bg-white/90 shadow-md backdrop-blur-xl"
        : "bg-white/60 backdrop-blur-sm"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        {/* === LOGO === */}
        <Link href="/" aria-label="Acasă" className="-ml-2 flex items-center select-none">
          {/* Desktop Logo */}
          <div className="hidden sm:block">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-2xl font-bold text-transparent transition-transform duration-200 hover:scale-105 md:text-3xl">
              <span className="tracking-tight">Oferte</span>
              <span className="text-emerald-500">mutare</span>
              <span className="align-top text-xs text-emerald-600">.ro</span>
            </div>
          </div>

          {/* Mobile Logo */}
          <div className="block sm:hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-lg font-bold text-transparent">
              <span className="tracking-tight">Oferte</span>
              <span className="text-emerald-500">mutare</span>
              <span className="align-top text-xs text-emerald-600">.ro</span>
            </div>
          </div>
        </Link>

        {/* === DESKTOP NAV === */}
        <nav className="hidden items-center space-x-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex min-h-12 min-w-12 items-center justify-center rounded-full px-5 py-3 font-medium transition-all duration-300 ${pathname === href
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
              aria-label="Contul Meu"
              className="ml-3 inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.06] hover:shadow-xl"
            >
              <User size={18} /> Contul Meu
            </button>
          ) : (
            <div className="ml-3 flex items-center gap-3">
              {/* Notification Bell for Companies */}
              {userRole === "company" && user?.uid && <NotificationBell companyId={user.uid} />}

              {/* Smart Dashboard Link */}
              <Link
                href={userRole === "company" ? "/company/dashboard" : "/customer/dashboard"}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:scale-[1.04]"
              >
                <User size={18} />
                <span className="max-w-35 truncate">Contul Meu</span>
              </Link>

              {/* Explicit Logout Button */}
              <button
                onClick={handleLogout}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 hover:shadow-md"
                title="Deconectare"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </nav>

        {/* === MOBILE MENU TOGGLE === */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Menu"
          className="flex min-h-12 min-w-12 items-center justify-center rounded-lg p-3 text-emerald-700 transition hover:bg-emerald-50 md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === MOBILE MENU - CSS animation instead of framer-motion === */}
      <div
        className={`transform overflow-hidden border-t border-emerald-100 bg-white/95 shadow-lg backdrop-blur-xl transition-all duration-300 md:hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col space-y-1 px-6 py-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex min-h-12 items-center rounded-lg px-4 py-3 font-medium transition-all ${pathname === href
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
            >
              {label}
            </Link>
          ))}

          <button
            onClick={handleGetOffers}
            className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg"
          >
            <PhoneCall size={18} /> Obține Oferte
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-gray-700 transition-all hover:bg-emerald-50"
            >
              <LogOut size={18} /> Deconectare
            </button>
          )}
        </div>
      </div>
    </header >
  );
}
