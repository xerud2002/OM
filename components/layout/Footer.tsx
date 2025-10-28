"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Linkedin,
  PhoneCall,
  Mail,
  MapPin,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animations"; 
import { onAuthChange, logout } from "@/utils/firebaseHelpers";

/* 🔹 Constant link groups */
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
    <footer className="relative bg-[radial-gradient(circle_at_center,_#012015,_#000)] text-gray-300 mt-28 overflow-hidden">
      {/* Decorative top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/mesh.svg')] opacity-[0.07] bg-cover" />

      {/* Main footer content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-6 py-14 md:py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 sm:gap-12 z-10"
      >
        {/* About section */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center mb-5 gap-3">
            <Image
              src="/logo.png"
              alt="Logo ofertemutare.ro"
              width={140}
              height={80}
              className="rounded-lg opacity-95"
              priority
            />
          </div>

          <p className="text-gray-400 leading-relaxed text-sm max-w-xs mb-4">
            Platforma care conectează clienți și firme de mutări verificate din
            România. Rapid, sigur și transparent.
          </p>

          <div className="flex flex-col gap-1 text-sm text-gray-400">
            {CONTACT_INFO.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon size={16} className="text-emerald-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Useful Links */}
        <motion.div variants={fadeUp}>
          <FooterColumn title="Linkuri utile" links={USEFUL_LINKS} />
        </motion.div>

        {/* Resources */}
        <motion.div variants={fadeUp}>
          <FooterColumn title="Resurse" links={RESOURCES} />
        </motion.div>

        {/* Legal + Social */}
        <motion.div variants={fadeUp}>
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Legal</h3>
          <ul className="space-y-2 text-sm mb-6">
            {LEGAL.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group relative inline-block hover:text-emerald-300 transition-all duration-300"
                >
                  {label}
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-300 group-hover:w-full" />
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
                whileHover={{ scale: 1.15, rotate: 4 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-sky-500 transition-all duration-300 shadow-md hover:shadow-emerald-500/20"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Sub-footer */}
      <div className="relative border-t border-emerald-800/40 py-5 text-center text-gray-400 text-sm bg-black/40 backdrop-blur-sm shadow-inner">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-emerald-400 font-medium">ofertemutare.ro</span>{" "}
          · Toate drepturile rezervate
        </p>
      </div>
    </footer>
  );
}

/* 🔸 Reusable footer column */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-emerald-400 mb-4">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="group relative inline-block hover:text-emerald-300 transition-all duration-300"
            >
              {label}
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
