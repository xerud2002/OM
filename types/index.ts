import { Timestamp } from "firebase/firestore";

export type UserRole = "customer" | "company";

export type BaseProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CustomerProfile = BaseProfile & {
  phone?: string;
  city?: string;
  county?: string;
};

export type CompanyProfile = BaseProfile & {
  companyName?: string;
  cif?: string;
  phone?: string;
  city?: string;
  county?: string;
  description?: string;
  verified?: boolean;
};

export type MovingRequest = {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  fromCity: string;
  fromCounty?: string;
  toCity: string;
  toCounty?: string;
  moveDate?: string;
  details?: string;
  rooms?: number | string;
  volumeM3?: number;
  phone?: string;
  budgetEstimate?: number;
  needPacking?: boolean;
  hasElevator?: boolean;
  specialItems?: string;
  createdAt: Timestamp;
  status?: "pending" | "in-progress" | "completed" | "cancelled";
};

export type Offer = {
  id: string;
  requestId: string;
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  status?: "pending" | "accepted" | "declined" | "rejected";
  createdAt: Timestamp;
};
