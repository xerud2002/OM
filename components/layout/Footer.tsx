"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, PhoneCall, Mail, MapPin } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animations";

/* 🔹 Constants */
const CONTACT_INFO = [
  { icon: PhoneCall, text: "+40 700 000 000" },
  { icon: Mail, text: "contact@ofertemutare.ro" },
  { icon: MapPin, text: "București, România" },
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
    <footer className="relative mt-28 border-t border-gray-200 bg-white text-gray-700 shadow-inner">
      {/* Main content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr]"
      >
        {/* Logo & about */}
        <motion.div variants={fadeUp}>
          <div className="mb-5 flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo ofertemutare.ro"
              width={140}
              height={80}
              className="rounded-lg"
              priority
            />
          </div>

          <p className="mb-4 max-w-xs text-sm leading-relaxed text-gray-600">
            Platforma care conectează clienți și firme de mutări verificate din România. Rapid,
            sigur și transparent.
          </p>

          <div className="flex flex-col gap-1 text-sm text-gray-600">
            {CONTACT_INFO.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon size={16} className="text-emerald-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Columns */}
        <motion.div variants={fadeUp}>
          <FooterColumn title="Linkuri utile" links={USEFUL_LINKS} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <FooterColumn title="Resurse" links={RESOURCES} />
        </motion.div>

        {/* Legal & social */}
        <motion.div variants={fadeUp}>
          <h3 className="mb-4 text-lg font-semibold text-emerald-600">Legal</h3>
          <ul className="mb-6 space-y-2 text-sm">
            {LEGAL.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group relative inline-block transition-all duration-300 hover:text-emerald-600"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }, i) => (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full border border-gray-200 p-2 text-gray-600 transition-all hover:border-emerald-500 hover:text-emerald-600"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-gray-50 py-5 text-center text-sm text-gray-500">
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
    <div>
      <h3 className="mb-4 text-lg font-semibold text-emerald-600">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="group relative inline-block transition-all duration-300 hover:text-emerald-600"
            >
              {label}
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
