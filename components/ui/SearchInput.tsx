import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  focusColor?: "emerald" | "purple" | "blue";
}

const focusColorClasses = {
  emerald: "focus:border-emerald-500 focus:ring-emerald-500/20",
  purple: "focus:border-purple-500 focus:ring-purple-500/20",
  blue: "focus:border-blue-500 focus:ring-blue-500/20",
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Caută...",
  className = "",
  focusColor = "emerald",
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 ${focusColorClasses[focusColor]} sm:w-64`}
      />
    </div>
  );
}
