// components/company/requestsView/types.ts
// Shared types for company requests view

export type MovingRequest = {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  fromCity: string;
  toCity: string;
  moveDate?: string;
  details?: string;
  createdAt?: { toMillis: () => number } | number;
  fromCounty?: string;
  toCounty?: string;
  rooms?: number | string;
  phone?: string;
  fromType?: "house" | "flat";
  toType?: "house" | "flat";
  fromFloor?: string;
  toFloor?: string;
  fromRooms?: number | string;
  toRooms?: number | string;
  fromStreet?: string;
  fromNumber?: string;
  fromBloc?: string;
  fromStaircase?: string;
  fromApartment?: string;
  toStreet?: string;
  toNumber?: string;
  toBloc?: string;
  toStaircase?: string;
  toApartment?: string;
  status?: string;
  archived?: boolean;
  requestCode?: string;
  contactFirstName?: string;
  contactLastName?: string;
  moveDateMode?: string;
  moveDateStart?: string;
  moveDateEnd?: string;
  moveDateFlexDays?: number;
  serviceMoving?: boolean;
  servicePacking?: boolean;
  serviceDisassembly?: boolean;
  serviceCleanout?: boolean;
  serviceStorage?: boolean;
  surveyType?: string;
  mediaUrls?: string[];
};

export type CompanyUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
} | null;

export type Offer = {
  id: string;
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  status?: "pending" | "accepted" | "declined" | "rejected";
  createdAt?: { toMillis: () => number };
};
