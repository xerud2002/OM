// components/customer/requestForm/types.ts
// Shared types for the request form

export type SurveyType = "in-person" | "video" | "quick-estimate";
export type MediaUpload = "now" | "later" | "none";
export type MoveDateMode = "exact" | "range" | "none" | "flexible";
export type PropertyType = "house" | "flat";

export type FormShape = {
  fromCounty?: string;
  fromCity?: string;
  fromCityManual?: boolean;
  fromAddress?: string;
  fromStreet?: string;
  fromNumber?: string;
  fromBloc?: string;
  fromStaircase?: string;
  fromApartment?: string;
  toCounty?: string;
  toCity?: string;
  toCityManual?: boolean;
  toAddress?: string;
  toStreet?: string;
  toNumber?: string;
  toBloc?: string;
  toStaircase?: string;
  toApartment?: string;
  moveDate?: string;
  fromType?: PropertyType;
  fromFloor?: string;
  fromElevator?: boolean;
  toType?: PropertyType;
  toFloor?: string;
  toElevator?: boolean;
  fromRooms?: string | number;
  toRooms?: string | number;
  rooms?: string | number;
  phone?: string;
  details?: string;
  serviceMoving?: boolean;
  servicePacking?: boolean;
  serviceDisassembly?: boolean;
  serviceCleanout?: boolean;
  serviceStorage?: boolean;
  surveyType?: SurveyType;
  mediaUpload?: MediaUpload;
  mediaFiles?: File[];
  moveDateMode?: MoveDateMode;
  moveDateStart?: string;
  moveDateEnd?: string;
  moveDateFlexDays?: number;
  contactName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  acceptedTerms?: boolean;
};

export type FormSectionProps = {
  form: FormShape;
  setForm: React.Dispatch<React.SetStateAction<FormShape>>;
};
