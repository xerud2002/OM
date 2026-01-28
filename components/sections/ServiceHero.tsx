import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import StatsGrid, { StatItem } from "@/components/ui/StatsGrid";

type ServiceHeroProps = {
  title: string;
  subtitle: string;
  gradient: string;
  stats: StatItem[];
  backgroundImage?: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
};

export default function ServiceHero({
  title,
  subtitle,
  gradient,
  stats,
  backgroundImage,
  showCTA = false,
  ctaText = "Cere oferte gratuite",
  ctaHref = "/#form",
}: ServiceHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className={`relative overflow-hidden ${gradient} pt-32 pb-20 text-white`}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Animated Background Elements */}
      <motion.div className="absolute inset-0 opacity-20" style={{ y: heroY }} aria-hidden="true">
        <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </motion.div>

      <motion.div className="container relative mx-auto px-4" style={{ opacity: heroOpacity }}>
        {/* Title */}
        <motion.h1
          className="mb-6 text-center text-4xl font-bold sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mb-12 max-w-3xl text-center text-lg sm:text-xl text-white/90"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        {/* Stats Grid */}
        <StatsGrid stats={stats} columns={4} variant="glass" animate />

        {/* CTA Button */}
        {showCTA && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-emerald-600 shadow-xl transition-all hover:shadow-2xl"
            >
              {ctaText}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
