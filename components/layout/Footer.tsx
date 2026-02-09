"use client";

import Link from "next/link";
import {
  BuildingOfficeIcon as Facebook,
  EnvelopeIcon as Mail,
} from "@heroicons/react/24/outline";

/* 🔹 Constants */
const CONTACT_INFO = [
  { icon: Mail, text: "info@ofertemutare.ro", label: null },
];

const USEFUL_LINKS = [
  { href: "/about", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
  { href: "/customer/auth", label: "Autentificare client" },
  { href: "/partener", label: "Devino partener" },
];

const RESOURCES = [
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "Întrebări frecvente" },
  { href: "/articole/mutare", label: "Ghid complet de mutare" },
  {
    href: "/articole/cat-costa-mutarea-2026",
    label: "Cât costă o mutare 2026",
  },
  { href: "/articole/sfaturi-mutari", label: "50+ Sfaturi pentru mutări" },
  {
    href: "/articole/schimbare-adresa-documente",
    label: "Acte schimbare adresă",
  },
];

const SERVICE_LINKS = [
  { href: "/servicii", label: "Toate Serviciile" },
  { href: "/mutari/tipuri/apartamente", label: "Mutări Apartamente" },
  { href: "/mutari/tipuri/case", label: "Mutări Case" },
  { href: "/mutari/tipuri/studenti", label: "Mutări Studenți" },
  { href: "/mutari/tipuri/birouri", label: "Mutări Birouri" },
  { href: "/servicii/impachetare/profesionala", label: "Împachetare" },
  { href: "/servicii/montaj/mobila", label: "Montare Mobilă" },
  { href: "/servicii/depozitare", label: "Depozitare" },
  { href: "/mutari/specializate/piane", label: "Mutări Piane" },
  { href: "/servicii/debarasare", label: "Debarasare" },
];

const CITIES = [
  { href: "/mutari/bucuresti", label: "Mutări București" },
  { href: "/mutari/cluj-napoca", label: "Mutări Cluj-Napoca" },
  { href: "/mutari/timisoara", label: "Mutări Timișoara" },
  { href: "/mutari/iasi", label: "Mutări Iași" },
  { href: "/mutari/brasov", label: "Mutări Brașov" },
  { href: "/mutari/constanta", label: "Mutări Constanța" },
];

const LEGAL = [
  { href: "/terms", label: "Termeni și condiții" },
  { href: "/privacy", label: "Politica de confidențialitate" },
];

const SOCIAL_LINKS = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61585990396718",
    label: "Facebook",
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-gray-200 bg-white text-gray-700 shadow-inner">
      {/* Main content - using CSS animations instead of framer-motion */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-14 md:grid-cols-3 lg:grid-cols-6">
        {/* Logo & about */}
        <div className="text-center sm:text-left">
          <div className="mb-4 flex items-center justify-center sm:mb-5 sm:justify-start">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-xl font-bold text-transparent">
              <span className="tracking-tight">Oferte</span>
              <span className="text-emerald-400">mutare</span>
              <span className="align-top text-xs text-emerald-500">.ro</span>
            </div>
          </div>

          <p className="mx-auto mb-3 max-w-xs text-sm leading-relaxed text-gray-600 sm:mx-0 sm:mb-4">
            Platforma care conectează clienți și firme de mutări verificate din
            România. Rapid, sigur și transparent.
          </p>

          <div className="flex flex-col items-center gap-1 text-sm text-gray-600 sm:items-start">
            {CONTACT_INFO.map(({ icon: Icon, text, label }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-emerald-500" />
                <a href={`mailto:${text}`} className="hover:text-emerald-600">
                  {text}
                </a>
                {label && (
                  <span className="text-xs text-gray-500">({label})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div>
          <FooterColumn title="Linkuri utile" links={USEFUL_LINKS} />
        </div>

        <div>
          <FooterColumn title="Resurse" links={RESOURCES} />
        </div>

        {/* Service Links for SEO */}
        <div>
          <FooterColumn title="Servicii" links={SERVICE_LINKS} />
        </div>

        {/* City Links for SEO */}
        <div>
          <FooterColumn title="Orașe populare" links={CITIES} />
        </div>

        {/* Legal & social */}
        <div className="text-center sm:text-left">
          <h3 className="mb-3 text-base font-semibold text-emerald-600 sm:mb-4 sm:text-lg">
            Legal
          </h3>
          <ul className="mb-4 space-y-2 text-sm sm:mb-6">
            {LEGAL.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group relative inline-block transition-all duration-300 hover:text-emerald-600"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new Event("om:consent-reopen"));
                }}
                className="group relative inline-block transition-all duration-300 hover:text-emerald-600"
              >
                🍪 Setări cookie-uri
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          </ul>

          <div className="flex justify-center gap-4 sm:justify-start">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full border border-gray-200 p-2 text-gray-600 transition-all duration-200 hover:border-emerald-500 hover:text-emerald-600 active:scale-95"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 text-center text-xs text-gray-500 sm:py-5 sm:text-sm">
        <p suppressHydrationWarning>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-emerald-600">ofertemutare.ro</span>{" "}
          · Toate drepturile rezervate
        </p>
      </div>
    </footer>
  );
}

/* 🔸 Reusable column component */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="text-center sm:text-left">
      <h3 className="mb-3 text-base font-semibold text-emerald-600 sm:mb-4 sm:text-lg">
        {title}
      </h3>
      <ul className="space-y-1.5 text-sm sm:space-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="group relative inline-block transition-all duration-300 hover:text-emerald-600"
            >
              {label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
