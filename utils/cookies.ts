// utils/cookies.ts
// Cookie utilities: get/set/delete + GDPR consent management

export interface CookieOptions {
  /** Days until expiry. Default: 365 */
  days?: number;
  /** Cookie path. Default: "/" */
  path?: string;
  /** SameSite attribute. Default: "Lax" */
  sameSite?: "Strict" | "Lax" | "None";
  /** Secure flag (HTTPS only). Default: true in production */
  secure?: boolean;
}

// ============================================
// LOW-LEVEL COOKIE HELPERS
// ============================================

/**
 * Set a cookie with the given name, value, and options.
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  if (typeof document === "undefined") return;

  const {
    days = 365,
    path = "/",
    sameSite = "Lax",
    secure = process.env.NODE_ENV === "production",
  } = options;

  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=${sameSite}`;
  if (secure) cookie += "; Secure";

  document.cookie = cookie;
}

/**
 * Get a cookie value by name. Returns null if not found.
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        encodeURIComponent(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        "=([^;]*)",
    ),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Delete a cookie by name.
 */
export function deleteCookie(name: string, path = "/"): void {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}

// ============================================
// GDPR CONSENT MANAGEMENT
// ============================================

export interface CookieConsent {
  /** Essential cookies - always true, cannot be disabled */
  necessary: true;
  /** Analytics cookies (Google Analytics, etc.) */
  analytics: boolean;
  /** Marketing/third-party cookies */
  marketing: boolean;
  /** Timestamp when consent was given/updated */
  updatedAt: string;
}

const CONSENT_KEY = "om_cookie_consent";

/**
 * Get the current consent preferences. Returns null if user hasn't chosen yet.
 */
export function getConsent(): CookieConsent | null {
  const raw = getCookie(CONSENT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

/**
 * Save consent preferences. Persists for 365 days.
 */
export function setConsent(
  consent: Omit<CookieConsent, "necessary" | "updatedAt">,
): CookieConsent {
  const full: CookieConsent = {
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    updatedAt: new Date().toISOString(),
  };

  setCookie(CONSENT_KEY, JSON.stringify(full), { days: 365 });
  return full;
}

/**
 * Accept all cookie categories.
 */
export function acceptAllCookies(): CookieConsent {
  return setConsent({ analytics: true, marketing: true });
}

/**
 * Accept only necessary cookies.
 */
export function acceptNecessaryOnly(): CookieConsent {
  return setConsent({ analytics: false, marketing: false });
}

/**
 * Check if a specific consent category is granted.
 */
export function hasConsent(
  category: keyof Omit<CookieConsent, "updatedAt">,
): boolean {
  const consent = getConsent();
  if (!consent) return false;
  return consent[category] === true;
}

/**
 * Clear consent (forces banner to reappear).
 */
export function clearConsent(): void {
  deleteCookie(CONSENT_KEY);
}

/**
 * Check if user has made a consent choice (banner already shown).
 */
export function hasConsentChoice(): boolean {
  return getConsent() !== null;
}
