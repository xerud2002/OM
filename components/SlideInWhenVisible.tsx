"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, PropsWithChildren, ElementType } from "react";

interface SlideInProps extends PropsWithChildren {
  as?: ElementType;
  direction?: "left" | "right"; // ✅ choose slide-in direction
  delay?: number;
  distance?: number; // how far it slides in px
  once?: boolean;
  className?: string;
}

export default function SlideInWhenVisible({
  as: Tag = "div",
  direction = "left",
  delay = 0.1,
  distance = 60,
  once = true,
  className,
  children,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once });

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const xOffset = direction === "left" ? -distance : distance;

  return (
    <Tag ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, x: xOffset },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, delay, ease: "easeOut" },
          },
        }}
      >
        {children}
      </motion.div>
    </Tag>
  );
}
