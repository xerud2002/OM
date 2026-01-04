// components/customer/dashboard/types.ts
// Shared types for customer dashboard

export type Request = {
  id: string;
  fromCity?: string;
  toCity?: string;
  moveDate?: string;
  details?: string;
  fromCounty?: string;
  toCounty?: string;
  rooms?: number | string;
  volumeM3?: number;
  phone?: string;
  budgetEstimate?: number;
  needPacking?: boolean;
  hasElevator?: boolean;
  specialItems?: string;
  customerName?: string | null;
  customerEmail?: string | null;
  archived?: boolean;
  createdAt?: { toMillis: () => number } | number;
  status?: "active" | "closed" | "paused" | "cancelled" | "accepted";
  requestCode?: string;
};

export type Offer = {
  id: string;
  companyName?: string;
  price?: number;
  message?: string;
  status?: "pending" | "accepted" | "declined";
  createdAt?: { toDate: () => Date };
  requestId?: string;
};

export type DashboardTab = "new" | "requests" | "offers" | "archive";
