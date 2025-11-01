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
  averageRating?: number;
  totalReviews?: number;
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
  moveDate?: string;
  details?: string;
  rooms?: number | string;
  volumeM3?: number;
  phone?: string;
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
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  status?: "pending" | "accepted" | "declined" | "rejected";
  createdAt: Timestamp;
};
