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
  verificationStatus?: "unverified" | "pending" | "verified" | "rejected";
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
  guestEmail?: string;
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
  hasElevator?: boolean;
  // Services
  serviceMoving?: boolean;
  serviceTransportOnly?: boolean;
  servicePacking?: boolean;
  serviceAssembly?: boolean;
  serviceDisposal?: boolean;
  servicePackingMaterials?: boolean;
  // Media upload
  mediaUpload?: "now" | "later";
  mediaUploadToken?: string;
  mediaUrls?: string[];
  createdAt: Timestamp;
  status?:
    | "active"
    | "closed"
    | "paused"
    | "cancelled"
    | "accepted"
    | "pending";
  archived?: boolean;
  // Admin pricing & approval
  adminApproved?: boolean; // Must be true for request to appear in company dashboard
  adminCreditCost?: number; // Manually set credit cost (overrides auto-calculation)
  // Lead source tracking
  leadSource?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    gclid?: string;
    fbclid?: string;
    referrer?: string;
    landingPage?: string;
    channel:
      | "google_ads"
      | "facebook_ads"
      | "organic"
      | "direct"
      | "referral"
      | "other";
    capturedAt: string;
  };
};

export type Offer = {
  id: string;
  requestId: string;
  requestCode?: string;
  companyId: string;
  companyName: string;
  companyLogo?: string | null;
  companyPhone?: string;
  companyEmail?: string;
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

/**
 * Input data for the createGuest API route.
 * Represents form data before it's cleaned and stored as a MovingRequest.
 */
export type CreateGuestRequestInput = {
  // Contact info (required)
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone: string;
  acceptedTerms: boolean;
  // Locations (required)
  fromCounty: string;
  fromCity: string;
  fromRooms: number | string;
  toCounty: string;
  toCity: string;
  toRooms: number | string;
  // Optional address details
  fromStreet?: string;
  fromNumber?: string;
  fromType?: "house" | "flat";
  fromBloc?: string;
  fromStaircase?: string;
  fromApartment?: string;
  fromFloor?: string;
  fromElevator?: boolean;
  toStreet?: string;
  toNumber?: string;
  toType?: "house" | "flat";
  toBloc?: string;
  toStaircase?: string;
  toApartment?: string;
  toFloor?: string;
  toElevator?: boolean;
  // Date fields
  moveDateMode?: "exact" | "range" | "none" | "flexible";
  moveDateStart?: string;
  moveDateEnd?: string;
  moveDateFlexDays?: number;
  // Services
  serviceMoving?: boolean;
  serviceTransportOnly?: boolean;
  servicePacking?: boolean;
  serviceAssembly?: boolean;
  serviceDisposal?: boolean;
  servicePackingMaterials?: boolean;
  // Other
  details?: string;
  volumeM3?: number;
  furniture?: string;
  mediaUpload?: "now" | "later";
  mediaFiles?: File[];
  fromCityManual?: string;
  toCityManual?: string;
  // Lead source (auto-injected at submit time)
  leadSource?: Record<string, any>;
};
