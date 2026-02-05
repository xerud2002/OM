interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "emerald" | "blue" | "purple" | "gray";
  className?: string;
}

const sizeClasses = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-10 w-10 border-4",
};

const colorClasses = {
  emerald: "border-emerald-200 border-t-emerald-600",
  blue: "border-blue-200 border-t-blue-600",
  purple: "border-purple-200 border-t-purple-600",
  gray: "border-gray-200 border-t-gray-600",
};

export default function LoadingSpinner({
  size = "md",
  color = "emerald",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
}

// Wrapper component for centered loading states
export function LoadingContainer({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      {children || <LoadingSpinner size="lg" />}
    </div>
  );
}
