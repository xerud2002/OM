import Link from "next/link";
import { Truck, Home, ArrowRight, Package } from "lucide-react";

type IconLogoProps = {
  className?: string;
  linkClassName?: string;
  variant?: "truck" | "home" | "package" | "minimal";
  showText?: boolean;
};

export default function IconLogo({ 
  className = "", 
  linkClassName = "",
  variant = "truck",
  showText = true
}: IconLogoProps) {
  const icons = {
    truck: <Truck className="h-8 w-8 text-emerald-600" />,
    home: <Home className="h-8 w-8 text-emerald-600" />,
    package: <Package className="h-8 w-8 text-emerald-600" />,
    minimal: <ArrowRight className="h-6 w-6 text-emerald-600" />
  };

  return (
    <Link 
      href="/" 
      aria-label="Acasă" 
      className={`flex select-none items-center gap-2 ${linkClassName}`}
    >
      <div className="flex items-center gap-2">
        {icons[variant]}
        {showText && (
          <div className={`font-bold text-emerald-800 ${className}`}>
            <div className="text-lg leading-tight md:text-xl">
              <span>Oferte</span>
              <span className="text-emerald-600">mutare</span>
            </div>
            <div className="text-xs text-emerald-600">.ro</div>
          </div>
        )}
      </div>
    </Link>
  );
}