import {
  CheckCircleIcon,
  ClockIcon,
  PauseCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

type RequestStatus =
  | "active"
  | "closed"
  | "paused"
  | "cancelled"
  | "pending"
  | "accepted";
type VerificationStatus = "verified" | "pending" | "rejected" | "none";
type OfferStatus = "pending" | "accepted" | "declined" | "rejected";

interface StatusBadgeProps {
  type: "request" | "verification" | "offer";
  status: RequestStatus | VerificationStatus | OfferStatus;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

// Request status configuration
const requestStatusConfig: Record<
  RequestStatus,
  { icon: typeof ClockIcon; bgClass: string; textClass: string; label: string }
> = {
  active: {
    icon: ClockIcon,
    bgClass: "bg-blue-100",
    textClass: "text-blue-700",
    label: "Activă",
  },
  closed: {
    icon: CheckCircleIcon,
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-700",
    label: "Finalizată",
  },
  paused: {
    icon: PauseCircleIcon,
    bgClass: "bg-amber-100",
    textClass: "text-amber-700",
    label: "Pauză",
  },
  cancelled: {
    icon: XCircleIcon,
    bgClass: "bg-red-100",
    textClass: "text-red-700",
    label: "Anulată",
  },
  pending: {
    icon: ClockIcon,
    bgClass: "bg-amber-100",
    textClass: "text-amber-700",
    label: "În așteptare",
  },
  accepted: {
    icon: CheckCircleIcon,
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-700",
    label: "Acceptată",
  },
};

// Verification status configuration
const verificationStatusConfig: Record<
  VerificationStatus,
  { icon: typeof ClockIcon; bgClass: string; textClass: string; label: string }
> = {
  verified: {
    icon: CheckBadgeIcon,
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-700",
    label: "Verificat",
  },
  pending: {
    icon: ClockIcon,
    bgClass: "bg-amber-100",
    textClass: "text-amber-700",
    label: "În așteptare",
  },
  rejected: {
    icon: XCircleIcon,
    bgClass: "bg-red-100",
    textClass: "text-red-700",
    label: "Respins",
  },
  none: {
    icon: ClockIcon,
    bgClass: "bg-gray-100",
    textClass: "text-gray-600",
    label: "Neverificat",
  },
};

// Offer status configuration
const offerStatusConfig: Record<
  OfferStatus,
  { icon: typeof ClockIcon; bgClass: string; textClass: string; label: string }
> = {
  pending: {
    icon: ClockIcon,
    bgClass: "bg-amber-100",
    textClass: "text-amber-700",
    label: "În așteptare",
  },
  accepted: {
    icon: CheckCircleIcon,
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-700",
    label: "Acceptată",
  },
  declined: {
    icon: XCircleIcon,
    bgClass: "bg-red-100",
    textClass: "text-red-700",
    label: "Declinată",
  },
  rejected: {
    icon: XCircleIcon,
    bgClass: "bg-red-100",
    textClass: "text-red-700",
    label: "Respinsă",
  },
};

export default function StatusBadge({
  type,
  status,
  size = "md",
}: StatusBadgeProps) {
  const config =
    type === "request"
      ? requestStatusConfig[status as RequestStatus]
      : type === "verification"
        ? verificationStatusConfig[status as VerificationStatus]
        : offerStatusConfig[status as OfferStatus];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]} ${config.bgClass} ${config.textClass}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

// Utility function for getting request status badge (for backwards compatibility)
export function getRequestStatusBadge(
  status: RequestStatus,
  size: "sm" | "md" = "md",
) {
  return <StatusBadge type="request" status={status} size={size} />;
}

// Utility function for getting verification status badge
export function getVerificationStatusBadge(
  status: VerificationStatus,
  size: "sm" | "md" = "md",
) {
  return <StatusBadge type="verification" status={status} size={size} />;
}

// Utility function for getting offer status badge
export function getOfferStatusBadge(
  status: OfferStatus,
  size: "sm" | "md" = "md",
) {
  return <StatusBadge type="offer" status={status} size={size} />;
}
