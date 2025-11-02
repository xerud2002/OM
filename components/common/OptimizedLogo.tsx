"use client";

import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "full" | "small" | "square";
  className?: string;
  linkClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export default function OptimizedLogo({ 
  variant = "full", 
  className = "", 
  linkClassName = "",
  priority = false,
  width,
  height
}: LogoProps) {
  const logoConfig = {
    full: {
      src: "/logo.webp",
      alt: "Ofertemutare.ro - Platforma de mutări",
      width: width || 180,
      height: height || 40,
      className: "object-contain",
    },
    small: {
      src: "/logo-small.webp", 
      alt: "Ofertemutare.ro",
      width: width || 120,
      height: height || 32,
      className: "object-contain",
    },
    square: {
      src: "/logo-square.webp",
      alt: "Ofertemutare.ro",
      width: width || 40,
      height: height || 40,
      className: "object-contain",
    },
  };

  const config = logoConfig[variant];

  return (
    <Link 
      href="/" 
      aria-label="Acasă" 
      className={`flex select-none items-center ${linkClassName}`}
    >
      <Image
        src={config.src}
        alt={config.alt}
        width={config.width}
        height={config.height}
        className={`${config.className} ${className}`}
        priority={priority}
        sizes="(max-width: 768px) 120px, (max-width: 1200px) 160px, 180px"
      />
    </Link>
  );
}