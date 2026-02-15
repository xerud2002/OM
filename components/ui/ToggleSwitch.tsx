interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: "blue" | "purple" | "emerald" | "red";
  disabled?: boolean;
  label?: string;
}

const colorClasses = {
  blue: "peer-checked:bg-blue-600",
  purple: "peer-checked:bg-purple-600",
  emerald: "peer-checked:bg-emerald-600",
  red: "peer-checked:bg-red-600",
};

export default function ToggleSwitch({
  checked,
  onChange,
  color = "blue",
  disabled = false,
  label,
}: ToggleSwitchProps) {
  return (
    <label className={`relative inline-flex items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
        aria-label={label}
      />
      <div
        className={`peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none ${colorClasses[color]}`}
      />
    </label>
  );
}
