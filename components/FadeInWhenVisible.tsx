"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  as?: keyof React.JSX.IntrinsicElements; // ✅ schimbat aici
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}>;

export default function FadeInWhenVisible({
  as = "div",
  delay = 0.1,
  y = 16,
  once = true,
  className,
  children,
}: Props) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once });

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const Tag = as as any;

  return (
    <Tag ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
        }}
      >
        {children}
      </motion.div>
    </Tag>
  );
}
