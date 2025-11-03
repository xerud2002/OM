import Link from "next/link";

type TextLogoProps = {
  className?: string;
  linkClassName?: string;
  variant?: "primary" | "secondary" | "minimal";
};

export default function TextLogo({ 
  className = "", 
  linkClassName = "",
  variant = "primary"
}: TextLogoProps) {
  const variants = {
    primary: "text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent",
    secondary: "text-xl md:text-2xl font-semibold text-emerald-700",
    minimal: "text-lg md:text-xl font-medium text-gray-800"
  };

  return (
    <Link 
      href="/" 
      aria-label="Acasă" 
      className={`flex select-none items-center ${linkClassName}`}
    >
      <div className={`transition-transform duration-200 hover:scale-105 ${variants[variant]} ${className}`}>
        <span className="tracking-tight">Oferte</span>
        <span className="text-emerald-500">mutare</span>
        <span className="align-top text-xs text-emerald-600">.ro</span>
      </div>
    </Link>
  );
}