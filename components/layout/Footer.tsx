"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

/* 🔹 Constants */
const CONTACT_INFO = [
  { icon: Mail, text: "info@ofertemutare.ro", label: null },
];

const USEFUL_LINKS = [
  { href: "/about", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
  { href: "/customer/auth", label: "Autentificare client" },
  { href: "/company/auth", label: "Devino partener" },
];

const RESOURCES = [
  { href: "/articles/tips", label: "Tips & Tricks mutare" },
  { href: "/faq", label: "Întrebări frecvente" },
  { href: "/guides/mutare", label: "Ghid complet de mutare" },
];

const SERVICE_LINKS = [
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

const LEGAL = [
  { href: "/terms", label: "Termeni și condiții" },
  { href: "/privacy", label: "Politica de confidențialitate" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-gray-200 bg-white text-gray-700 shadow-inner">
      {/* Main content - using CSS animations instead of framer-motion */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:gap-10 px-4 py-10 sm:px-6 sm:py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Logo & about */}
        <div className="text-center sm:text-left">
          <div className="mb-4 sm:mb-5 flex items-center justify-center sm:justify-start">
            <div className="bg-linear-to-r from-emerald-600 to-emerald-800 bg-clip-text text-xl font-bold text-transparent">
              <span className="tracking-tight">Oferte</span>
              <span className="text-emerald-400">mutare</span>
              <span className="align-top text-xs text-emerald-500">.ro</span>
            </div>
          </div>

          <p className="mb-3 sm:mb-4 mx-auto sm:mx-0 max-w-xs text-sm leading-relaxed text-gray-600">
            Platforma care conectează clienți și firme de mutări verificate din România. Rapid,
            sigur și transparent.
          </p>

          <div className="flex flex-col gap-1 text-sm text-gray-600 items-center sm:items-start">
            {CONTACT_INFO.map(({ icon: Icon, text, label }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon size={16} className="text-emerald-500" />
                <a href={`mailto:${text}`} className="hover:text-emerald-600">
                  {text}
                </a>
                {label && <span className="text-xs text-gray-500">({label})</span>}
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
          <FooterColumn title="Tipuri Servicii" links={SERVICE_LINKS} />
        </div>

        {/* Legal & social */}
        <div className="text-center sm:text-left">
          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-emerald-600">Legal</h3>
          <ul className="mb-4 sm:mb-6 space-y-2 text-sm">
            {LEGAL.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group relative inline-block transition-all duration-300 hover:text-emerald-600"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-emerald-500 to-sky-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 justify-center sm:justify-start">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full border border-gray-200 p-2 text-gray-600 transition-all duration-200 hover:scale-110 hover:border-emerald-500 hover:text-emerald-600 active:scale-95"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-gray-50 py-4 sm:py-5 px-4 text-center text-xs sm:text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-emerald-600">ofertemutare.ro</span> · Toate drepturile
          rezervate
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
      <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-emerald-600">{title}</h3>
      <ul className="space-y-1.5 sm:space-y-2 text-sm">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="group relative inline-block transition-all duration-300 hover:text-emerald-600"
            >
              {label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-emerald-500 to-sky-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
