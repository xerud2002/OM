"use client";

import {
  Home,
  Building2,
  Building,
  Wrench,
  Warehouse,
  Box,
  Piano,
  Factory,
  Truck,
} from "lucide-react";

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
        <p className="mb-8 text-center text-sm font-semibold tracking-wider text-slate-400 uppercase">
          Servicii populare solicitate pe platformă
        </p>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          {/* Gradient Masks */}
          <div className="pointer-events-none absolute left-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent md:w-40" />
          <div className="pointer-events-none absolute right-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent md:w-40" />

          {/* Marquee Container - CSS Animation */}
          <div className="flex w-full overflow-hidden">
            <div
              className="animate-marquee flex shrink-0 items-center gap-12 sm:gap-24"
              style={{ animationDuration: "40s" }}
            >
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group flex flex-shrink-0 items-center gap-2 grayscale transition-all duration-300 hover:scale-105 hover:grayscale-0"
                >
                  <service.icon className="h-6 w-6 text-emerald-600 sm:h-8 sm:w-8" />
                  <span className="text-lg font-bold whitespace-nowrap text-slate-700 sm:text-xl">
                    {service.name}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="animate-marquee flex shrink-0 items-center gap-12 sm:gap-24"
              style={{ animationDuration: "40s" }}
              aria-hidden="true"
            >
              {services.map((service, index) => (
                <div
                  key={`clone-${index}`}
                  className="group flex flex-shrink-0 items-center gap-2 grayscale transition-all duration-300 hover:scale-105 hover:grayscale-0"
                >
                  <service.icon className="h-6 w-6 text-emerald-600 sm:h-8 sm:w-8" />
                  <span className="text-lg font-bold whitespace-nowrap text-slate-700 sm:text-xl">
                    {service.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
