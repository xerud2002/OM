// utils/analytics.ts
// Google Analytics 4 helper for tracking events

// GA4 Measurement ID - from Firebase config
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// Type for gtag function
type GtagCommand = "config" | "event" | "js" | "set";

// Check if GA is loaded
export const isGALoaded = (): boolean => {
  return (
    typeof window !== "undefined" &&
    "gtag" in window &&
    typeof (window as { gtag?: unknown }).gtag === "function"
  );
};

// Helper to call gtag safely
const gtag = (command: GtagCommand, ...args: unknown[]) => {
  if (isGALoaded()) {
    (window as unknown as { gtag: (cmd: string, ...a: unknown[]) => void }).gtag(command, ...args);
  }
};

// ============================================
// USER IDENTIFICATION
// ============================================

/**
 * Set the logged-in user's ID for GA4 tracking
 * Call this when user logs in or on app load if already authenticated
 */
export const setUserId = (userId: string) => {
  if (!isGALoaded() || !GA_MEASUREMENT_ID) return;
  gtag("config", GA_MEASUREMENT_ID, {
    user_id: userId,
  });
};

/**
 * Set user properties (role, city, etc.) for segmentation
 */
export const setUserProperties = (properties: {
  user_role?: "customer" | "company";
  user_city?: string;
  user_county?: string;
  account_created?: string;
}) => {
  if (!isGALoaded()) return;
  gtag("set", "user_properties", properties);
};

/**
 * Clear user data on logout
 */
export const clearUserId = () => {
  if (!isGALoaded() || !GA_MEASUREMENT_ID) return;
  gtag("config", GA_MEASUREMENT_ID, {
    user_id: undefined,
  });
  gtag("set", "user_properties", {
    user_role: undefined,
    user_city: undefined,
    user_county: undefined,
  });
};

// Track page views (called automatically by GA4, but useful for SPA navigation)
export const pageView = (url: string) => {
  if (!isGALoaded() || !GA_MEASUREMENT_ID) return;
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  additionalParams?: Record<string, unknown>
) => {
  if (!isGALoaded()) return;
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
    ...additionalParams,
  });
};

// ============================================
// PREDEFINED EVENTS FOR OM
// ============================================

// Button click tracking
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent("click", "button", buttonName, undefined, {
    button_location: location || "unknown",
  });
};

// CTA clicks
export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent("cta_click", "engagement", ctaName, undefined, {
    cta_location: location,
  });
};

// Form events
export const trackFormStart = (formName: string) => {
  trackEvent("form_start", "form", formName);
};

export const trackFormStepComplete = (formName: string, step: number, stepName: string) => {
  trackEvent("form_step_complete", "form", `${formName}_step_${step}`, step, {
    step_name: stepName,
  });
};

export const trackFormSubmit = (formName: string, success: boolean) => {
  trackEvent("form_submit", "form", formName, success ? 1 : 0, {
    success: success,
  });
};

// Request events
export const trackRequestCreated = (fromCity: string, toCity: string, rooms?: number) => {
  trackEvent("request_created", "conversion", `${fromCity}_to_${toCity}`, rooms, {
    from_city: fromCity,
    to_city: toCity,
    rooms: rooms,
  });
};

// Offer events
export const trackOfferSubmitted = (requestId: string, priceRange?: string) => {
  trackEvent("offer_submitted", "company_action", requestId, undefined, {
    price_range: priceRange,
  });
};

export const trackOfferAccepted = (requestId: string, price?: number) => {
  trackEvent("offer_accepted", "conversion", requestId, price, {
    conversion_value: price,
  });
};

// Media upload
export const trackMediaUpload = (requestId: string, fileCount: number) => {
  trackEvent("media_uploaded", "engagement", requestId, fileCount, {
    file_count: fileCount,
  });
};

// Auth events
export const trackSignUp = (method: string, role: "customer" | "company") => {
  trackEvent("sign_up", "auth", method, undefined, {
    user_role: role,
  });
};

export const trackLogin = (method: string, role: "customer" | "company") => {
  trackEvent("login", "auth", method, undefined, {
    user_role: role,
  });
};

// Navigation
export const trackNavClick = (destination: string) => {
  trackEvent("nav_click", "navigation", destination);
};

// Outbound links
// CRO Events
export const trackCalculatorUsage = (serviceType: string, city: string, savingsValue: number) => {
  trackEvent("calculator_used", "cro", `${serviceType}_${city}`, savingsValue, {
    service_type: serviceType,
    city: city,
    savings_value: savingsValue,
  });
};

export const trackExitIntentShown = () => {
  trackEvent("exit_intent_shown", "cro", "popup_displayed");
};

export const trackExitIntentConversion = (action: "clicked_cta" | "dismissed") => {
  trackEvent("exit_intent_interaction", "cro", action);
};

export const trackPhoneClick = (location: string, phoneNumber: string) => {
  trackEvent("phone_click", "contact", location, undefined, {
    phone_number: phoneNumber,
  });
};

export const trackServicePageView = (serviceName: string) => {
  trackEvent("service_view", "content", serviceName);
};
