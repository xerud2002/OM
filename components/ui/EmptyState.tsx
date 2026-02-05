import { ComponentType } from "react";
import {
  InboxIcon,
  UsersIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "dashed";
}

export default function EmptyState({
  icon: Icon = InboxIcon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const containerClasses =
    variant === "dashed"
      ? "rounded-xl border-2 border-dashed border-gray-200 bg-white"
      : "rounded-xl bg-white";

  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${containerClasses}`}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Preset empty states for common scenarios
export function EmptyRequestsState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={TruckIcon}
      title="Nu există cereri"
      description="Nu s-au găsit cereri de mutare."
      action={onAction ? { label: "Creează cerere", onClick: onAction } : undefined}
      variant="dashed"
    />
  );
}

export function EmptyUsersState() {
  return (
    <EmptyState
      icon={UsersIcon}
      title="Nu există utilizatori"
      description="Nu s-au găsit utilizatori înregistrați."
    />
  );
}

export function EmptyCompaniesState() {
  return (
    <EmptyState
      icon={BuildingOfficeIcon}
      title="Nu există companii"
      description="Nu s-au găsit companii înregistrate."
      variant="dashed"
    />
  );
}

export function EmptyOffersState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={DocumentTextIcon}
      title="Nu ai oferte încă"
      description="Trimite oferte la cererile clienților pentru a le vedea aici."
      action={onAction ? { label: "Vezi cereri", onClick: onAction } : undefined}
    />
  );
}

export function NoSearchResultsState({ searchTerm }: { searchTerm?: string }) {
  return (
    <EmptyState
      icon={InboxIcon}
      title="Nu s-au găsit rezultate"
      description={searchTerm ? `Nu s-au găsit rezultate pentru "${searchTerm}"` : "Încearcă o altă căutare."}
    />
  );
}
