"use client";

import { motion } from "framer-motion";
import { CheckCircle2, PackageCheck, MessageSquare } from "lucide-react";

type TimelineProps = {
  createdAt?: any;
  offersCount: number;
  acceptedOfferExists?: boolean;
  status?: "active" | "closed" | "paused" | "cancelled";
};

export default function RequestTimeline({
  createdAt,
  offersCount,
  acceptedOfferExists,
  status,
}: TimelineProps) {
  const steps = [
    {
      icon: CheckCircle2,
      label: "Cerere trimisă",
      completed: true,
      color: "emerald",
    },
    {
      icon: MessageSquare,
      label: `${offersCount} ${offersCount === 1 ? "ofertă primită" : "oferte primite"}`,
      completed: offersCount > 0,
      color: "sky",
    },
    {
      icon: PackageCheck,
      label: acceptedOfferExists ? "Ofertă acceptată" : "În așteptare decizie",
      completed: acceptedOfferExists || false,
      color: acceptedOfferExists ? "emerald" : "amber",
    },
  ];

  if (status === "closed") {
    steps[2] = {
      icon: CheckCircle2,
      label: "Cerere finalizată",
      completed: true,
      color: "emerald",
    };
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Progres cerere</p>
        {createdAt && (
          <p className="text-xs text-gray-500">
            {new Date(
              createdAt.toDate ? createdAt.toDate() : createdAt
            ).toLocaleDateString("ro-RO", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-5 h-[calc(100%-40px)] w-0.5 bg-gray-200" />
        <div
          className="absolute left-4 top-5 w-0.5 bg-gradient-to-b from-emerald-500 to-sky-500 transition-all duration-500"
          style={{
            height: `${
              acceptedOfferExists || status === "closed"
                ? 100
                : offersCount > 0
                ? 50
                : 0
            }%`,
          }}
        />

        {/* Steps */}
        <div className="relative space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const colorClasses = {
              emerald: {
                bg: "bg-emerald-500",
                text: "text-emerald-700",
                border: "border-emerald-200",
                bgLight: "bg-emerald-50",
              },
              sky: {
                bg: "bg-sky-500",
                text: "text-sky-700",
                border: "border-sky-200",
                bgLight: "bg-sky-50",
              },
              amber: {
                bg: "bg-amber-500",
                text: "text-amber-700",
                border: "border-amber-200",
                bgLight: "bg-amber-50",
              },
            }[step.color as "emerald" | "sky" | "amber"];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3"
              >
                {/* Icon */}
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    step.completed
                      ? `${colorClasses.bg} shadow-lg`
                      : "border-2 border-gray-300 bg-white"
                  }`}
                >
                  <Icon
                    size={16}
                    className={step.completed ? "text-white" : "text-gray-400"}
                  />
                </div>

                {/* Label */}
                <div
                  className={`flex-1 rounded-lg border px-3 py-2 transition-all ${
                    step.completed
                      ? `${colorClasses.border} ${colorClasses.bgLight}`
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      step.completed ? colorClasses.text : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-4 border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">Progres total</span>
          <span className="text-sm font-bold text-emerald-600">
            {acceptedOfferExists || status === "closed"
              ? "100%"
              : offersCount > 0
              ? "66%"
              : "33%"}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width:
                acceptedOfferExists || status === "closed"
                  ? "100%"
                  : offersCount > 0
                  ? "66%"
                  : "33%",
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 to-sky-500"
          />
        </div>
      </div>
    </div>
  );
}
