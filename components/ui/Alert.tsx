import React, { ReactNode } from "react";
import { AlertTriangle, Info, CheckCircle2, Lock, AlertCircle } from "lucide-react";

type AlertVariant = "warning" | "info" | "success" | "locked" | "error";

type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

const variantStyles: Record<AlertVariant, string> = {
  warning: "border-amber-200 bg-amber-50",
  info: "border-sky-200 bg-sky-50",
  success: "border-emerald-200 bg-emerald-50",
  locked: "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50",
  error: "border-rose-200 bg-rose-50",
};

const variantTitleStyles: Record<AlertVariant, string> = {
  warning: "text-amber-900",
  info: "text-sky-900",
  success: "text-emerald-900",
  locked: "text-amber-900",
  error: "text-rose-900",
};

const variantTextStyles: Record<AlertVariant, string> = {
  warning: "text-amber-800",
  info: "text-sky-800",
  success: "text-emerald-800",
  locked: "text-amber-800",
  error: "text-rose-800",
};

const variantIcons: Record<AlertVariant, ReactNode> = {
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  locked: <Lock className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
};

export default function Alert({
  variant = "info",
  title,
  children,
  icon,
  action,
  className = "",
}: AlertProps) {
  const displayIcon = icon || variantIcons[variant];

  return (
    <div
      className={`rounded-xl border ${variantStyles[variant]} p-4 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="flex items-start gap-3">
        {displayIcon && (
          <div className={`mt-0.5 flex-shrink-0 ${variantTitleStyles[variant]}`}>
            {displayIcon}
          </div>
        )}
        <div className="flex-1">
          {title && (
            <h4 className={`mb-2 text-sm font-semibold ${variantTitleStyles[variant]}`}>
              {title}
            </h4>
          )}
          <div className={`text-sm ${variantTextStyles[variant]}`}>{children}</div>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}
