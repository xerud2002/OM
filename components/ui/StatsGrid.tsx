import { motion } from "framer-motion";

export type StatItem = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type StatsGridProps = {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "glass" | "solid";
  animate?: boolean;
};

export default function StatsGrid({
  stats,
  columns = 4,
  variant = "glass",
  animate = true,
}: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  const variantStyles = {
    default: "bg-white shadow-md",
    glass: "bg-white/10 backdrop-blur-sm",
    solid: "bg-emerald-600 text-white",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const Container = animate ? motion.div : "div";
  const Item = animate ? motion.div : "div";

  return (
    <Container
      className={`mb-10 grid ${gridCols[columns]} gap-4`}
      {...(animate
        ? {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            variants: containerVariants,
          }
        : {})}
    >
      {stats.map((stat, index) => (
        <Item
          key={index}
          className={`rounded-xl ${variantStyles[variant]} p-4 text-center transition-transform hover:scale-105`}
          {...(animate ? { variants: itemVariants } : {})}
        >
          {stat.icon && <div className="mb-2 flex justify-center">{stat.icon}</div>}
          <div className="text-3xl font-bold">{stat.value}</div>
          <div className="text-sm opacity-90">{stat.label}</div>
        </Item>
      ))}
    </Container>
  );
}
