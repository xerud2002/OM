"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, PropsWithChildren, ElementType } from "react";

interface FadeInProps extends PropsWithChildren {
  as?: ElementType; // ✅ More accurate type than keyof JSX.IntrinsicElements
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}

export default function FadeInWhenVisible({
  as: Tag = "div",
  delay = 0.1,
  y = 16,
  once = true,
  className,
  children,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once });

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <Tag ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay, ease: "easeOut" },
          },
        }}
      >
        {children}
      </motion.div>
    </Tag>
  );
}
