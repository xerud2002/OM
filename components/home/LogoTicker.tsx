"use client";

import { motion } from "framer-motion";
import { Truck, Home, Building2, Building, Wrench, Warehouse, Box, Piano, Factory } from "lucide-react";

const services = [
  { name: "Mutări Case", icon: Home },
  { name: "Transport Mobilă", icon: Truck },
  { name: "Depozitare", icon: Warehouse },
  { name: "Mutări Apartamente", icon: Building },
  { name: "Servicii Împachetare", icon: Box },
  { name: "Mutări Birouri", icon: Building2 },
  { name: "Transport Pian", icon: Piano },
  { name: "Montaj Mobilă", icon: Wrench },
  { name: "Relocare Firme", icon: Factory },
];

export default function LogoTicker() {
  return (
    <div className="w-full border-b border-gray-100 bg-white py-10">
      <div className="container mx-auto px-4">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
          Servicii populare solicitate pe platformă
        </p>
        
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent md:w-40" />
          <div className="absolute right-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent md:w-40" />

          {/* Marquee Container */}
          <div className="flex w-full overflow-hidden">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity,
              }}
              className="flex min-w-full shrink-0 items-center justify-around gap-12 sm:gap-24"
            >
              {[...services, ...services].map((service, index) => (
                <div
                  key={index}
                  className="group flex flex-shrink-0 items-center gap-2 grayscale transition-all duration-300 hover:scale-105 hover:grayscale-0"
                >
                  <service.icon className="h-6 w-6 text-emerald-600 sm:h-8 sm:w-8" />
                  <span className="text-lg font-bold text-slate-700 sm:text-xl">
                    {service.name}
                  </span>
                </div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity,
              }}
              className="flex min-w-full shrink-0 items-center justify-around gap-12 sm:gap-24"
              aria-hidden="true"
            >
              {[...services, ...services].map((service, index) => (
                <div
                  key={`clone-${index}`}
                  className="group flex flex-shrink-0 items-center gap-2 grayscale transition-all duration-300 hover:scale-105 hover:grayscale-0"
                >
                  <service.icon className="h-6 w-6 text-emerald-600 sm:h-8 sm:w-8" />
                  <span className="text-lg font-bold text-slate-700 sm:text-xl">
                    {service.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
