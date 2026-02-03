import { Timestamp } from "firebase/firestore";

export type UserRole = "customer" | "company" | "admin";

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
  verified?: boolean; // Legacy verification
  averageRating?: number;
  totalReviews?: number;
  // Monetization & Verification
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  documents?: {
    registration?: string; // URL
    insurance?: string; // URL
  };
  phoneVerified?: boolean;
  emailVerified?: boolean;
  walletBalance?: number; // RON
  freeLeadCredits?: number; // Count
  trialEndsAt?: Timestamp;
};

export type Review = {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string;
  requestId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Timestamp;
  helpful?: number; // Count of helpful votes (optional pentru viitor)
};

export type MovingRequest = {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  contactName?: string; // Explicit contact name from form
  contactFirstName?: string;
  contactLastName?: string;
  fromCity: string;
  fromCounty?: string;
  fromAddress?: string; // Deprecated: folosit pentru compatibilitate backward
  fromStreet?: string;
  fromNumber?: string;
  fromBloc?: string;
  fromStaircase?: string;
  fromApartment?: string;
  fromType?: "house" | "flat";
  fromFloor?: string;
  fromElevator?: boolean;
  fromRooms?: number | string; // New: Number of rooms at pickup
  toCity: string;
  toCounty?: string;
  toAddress?: string; // Deprecated: folosit pentru compatibilitate backward
  toStreet?: string;
  toNumber?: string;
  toBloc?: string;
  toStaircase?: string;
  toApartment?: string;
  toType?: "house" | "flat";
  toFloor?: string;
  toElevator?: boolean;
  toRooms?: number | string; // New: Number of rooms at delivery
  // Dates
  moveDate?: string; // legacy single date, kept for backward compatibility and quick filters
  moveDateMode?: "exact" | "range" | "none" | "flexible";
  moveDateStart?: string; // YYYY-MM-DD
  moveDateEnd?: string; // YYYY-MM-DD (only for range)
  moveDateFlexDays?: number; // only for flexible
  // Friendly tracking code
  requestCode?: string;
  details?: string;
  rooms?: number | string; // Legacy aggregate rooms
  volumeM3?: number;
  phone?: string;
  phoneVerified?: boolean; // New
  emailVerified?: boolean; // New
  budgetEstimate?: number;
  needPacking?: boolean;
  hasElevator?: boolean;
  specialItems?: string;
  // Services
  serviceMoving?: boolean;
  servicePacking?: boolean;
  serviceDisassembly?: boolean;
  serviceCleanout?: boolean;
  serviceStorage?: boolean;
  // Additional service options
  serviceTransportOnly?: boolean; // Doar transport (fără încărcare/descărcare)
  servicePiano?: boolean; // Mutare pian
  serviceFewItems?: boolean; // Câteva lucruri
  // Survey & Estimate
  surveyType?: "in-person" | "video" | "quick-estimate";
  // Media upload
  mediaUpload?: "now" | "later";
  mediaUploadToken?: string;
  mediaUrls?: string[];
  createdAt: Timestamp;
  status?: "active" | "closed" | "paused" | "cancelled";
  archived?: boolean;
};

export type Offer = {
  id: string;
  requestId: string;
  requestCode?: string;
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  status?: "pending" | "accepted" | "declined" | "rejected";
  createdAt: Timestamp;
};

// Company user (authenticated company viewing requests)
export type CompanyUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
} | null;

// Customer dashboard tab navigation
export type DashboardTab = "new" | "requests" | "offers" | "archive";
