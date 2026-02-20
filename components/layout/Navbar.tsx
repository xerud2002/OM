import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bars3Icon as Menu,
  XMarkIcon as X,
  ArrowRightOnRectangleIcon as LogOut,
  UserIcon as User,
  CalculatorIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  NewspaperIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import type { User as FirebaseUser } from "firebase/auth";
import type { UserRole } from "@/types";
import { trackCTAClick } from "@/utils/analytics";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
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
        const { onAuthChange, getUserRole } =
          await import("@/services/firebaseHelpers");
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
    router.push("/");
    const { logout } = await import("@/services/firebaseHelpers");
    await logout();
    setUser(null);
  };

  // Primary nav links (high-value pages)
  const navLinks = [
    { href: "/servicii", label: "Servicii", icon: WrenchScrewdriverIcon },
    { href: "/calculator", label: "Calculator", icon: CalculatorIcon },
    { href: "/about", label: "Despre Noi", icon: InformationCircleIcon },
    { href: "/contact", label: "Contact", icon: EnvelopeIcon },
    { href: "/blog", label: "Blog", icon: NewspaperIcon },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-emerald-100 bg-white/90 shadow-md backdrop-blur-xl"
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        {/* === LOGO === */}
        <Link
          href="/"
          aria-label="Acasă"
          className="-ml-2 flex items-center select-none"
        >
          <div className="bg-linear-to-r from-emerald-600 to-emerald-800 bg-clip-text text-lg font-bold text-transparent sm:text-2xl md:text-3xl">
            <span className="tracking-tight">Oferte</span>
            <span className="text-emerald-500">mutare</span>
            <span className="align-top text-[9px] text-emerald-600 sm:text-xs">.ro</span>
          </div>
        </Link>

        {/* === DESKTOP NAV === */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navigare principală"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* === RIGHT SIDE ACTIONS === */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Devino Partener - secondary, for companies */}
          <Link
            href="/partener"
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
              pathname === "/partener"
                ? "text-emerald-700"
                : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            Devino Partener
          </Link>

          {/* Separator */}
          <div className="mx-1 h-5 w-px bg-gray-200" />

          {!user ? (
            <Link
              href="/customer/auth"
              aria-label="Contul Meu"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
            >
              <User className="h-4 w-4" />
              Contul Meu
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              {/* Smart Dashboard Link */}
              <Link
                href={
                  userRole === "company"
                    ? "/company/dashboard"
                    : "/customer/dashboard"
                }
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
              >
                <User className="h-4 w-4" />
                <span className="max-w-28 truncate">Contul Meu</span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                title="Deconectare"
                aria-label="Deconectare"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* === MOBILE: CTA + HAMBURGER === */}
        <div className="flex items-center gap-2 lg:hidden">
          {!user && (
            <Link
              href="/customer/auth"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 sm:text-sm"
            >
              <User className="h-3.5 w-3.5" />
              Contul Meu
            </Link>
          )}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Închide meniu" : "Deschide meniu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* === MOBILE MENU === */}
      <nav
        id="mobile-menu"
        role="navigation"
        aria-label="Meniu mobil"
        aria-hidden={!isOpen}
        // @ts-expect-error inert is valid HTML but React types lag behind
        inert={!isOpen ? "" : undefined}
        className={`transform overflow-hidden border-t border-gray-100 bg-white/95 shadow-lg backdrop-blur-xl transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-4 py-3">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {Icon && <Icon className="h-4.5 w-4.5 text-gray-400" />}
              {label}
            </Link>
          ))}

          {/* Separator */}
          <div className="my-2 border-t border-gray-100" />

          <Link
            href="/partener"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
              pathname === "/partener"
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <BuildingOfficeIcon className="h-4.5 w-4.5 text-gray-400" />
            Devino Partener
          </Link>

          {user && (
            <>
              <Link
                href={
                  userRole === "company"
                    ? "/company/dashboard"
                    : "/customer/dashboard"
                }
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
              >
                <User className="h-4 w-4" />
                Contul Meu
              </Link>

              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Deconectare
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
