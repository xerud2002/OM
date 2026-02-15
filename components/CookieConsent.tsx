// components/CookieConsent.tsx
// GDPR cookie consent banner with granular category control (Romanian)

import { useState, useEffect, useCallback } from "react";
import {
  acceptAllCookies,
  acceptNecessaryOnly,
  setConsent,
  getConsent,
  hasConsentChoice,
  type CookieConsent as ConsentType,
} from "@/utils/cookies";
import Link from "next/link";

/** Emitted when consent changes - listeners can react (e.g. load GA). */
export const CONSENT_EVENT = "om:consent-update";

/** Dispatch this event to re-open the cookie banner (e.g. from Footer link). */
export const REOPEN_CONSENT_EVENT = "om:consent-reopen";

function dispatchConsentEvent(consent: ConsentType) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Show banner only if user hasn't made a choice yet
  useEffect(() => {
    // Small delay to avoid layout shift on initial paint
    const timer = setTimeout(() => {
      if (!hasConsentChoice()) {
        setVisible(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Allow re-opening banner via custom event (e.g. Footer "Setări cookie-uri" link)
  useEffect(() => {
    const onReopen = () => {
      // Restore saved preferences into toggles when re-opening settings
      const saved = getConsent();
      if (saved) {
        setAnalytics(saved.analytics);
        setMarketing(saved.marketing);
      }
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener(REOPEN_CONSENT_EVENT, onReopen);
    return () => window.removeEventListener(REOPEN_CONSENT_EVENT, onReopen);
  }, []);

  const handleAcceptAll = useCallback(() => {
    const consent = acceptAllCookies();
    dispatchConsentEvent(consent);
    setVisible(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    const consent = acceptNecessaryOnly();
    dispatchConsentEvent(consent);
    setVisible(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    const consent = setConsent({ analytics, marketing });
    dispatchConsentEvent(consent);
    setVisible(false);
    setShowSettings(false);
  }, [analytics, marketing]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consimțământ cookie-uri"
      aria-modal="false"
      className="fixed bottom-0 inset-x-0 z-9999 animate-slideUp"
    >
      {/* Backdrop shadow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-full h-16 bg-linear-to-t from-black/10 to-transparent" />

      <div className="border-t border-gray-200 bg-white px-4 py-5 shadow-2xl sm:px-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Main banner */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            {/* Text */}
            <div className="flex-1 pr-0 md:pr-8">
              <h3 className="mb-1.5 text-base font-semibold text-gray-900">
                🍪 Acest site folosește cookie-uri
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Folosim cookie-uri esențiale pentru funcționarea site-ului și,
                cu acordul tău, cookie-uri de analiză pentru a îmbunătăți
                experiența ta. Poți accepta toate cookie-urile, doar pe cele
                necesare, sau{" "}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
                >
                  personaliza preferințele
                </button>
                . Mai multe detalii în{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
                >
                  Politica de Confidențialitate
                </Link>
                .
              </p>
            </div>

            {/* Buttons */}
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                onClick={handleRejectAll}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Doar necesare
              </button>
              <button
                onClick={handleAcceptAll}
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Acceptă toate
              </button>
            </div>
          </div>

          {/* Expandable settings panel */}
          {showSettings && (
            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
              <h4 className="mb-3 text-sm font-semibold text-gray-800">
                Preferințe cookie-uri
              </h4>

              <div className="space-y-3">
                {/* Necessary - always on */}
                <label className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Necesare
                    </span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Esențiale pentru autentificare, securitate și funcționare
                      de bază.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 opacity-60"
                  />
                </label>

                {/* Analytics */}
                <label className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Analiză
                    </span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Google Analytics: ne ajută să înțelegem cum folosești
                      site-ul.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                {/* Marketing */}
                <label className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Marketing
                    </span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Cookie-uri pentru publicitate și remarketing (nefolosite
                      încă, pregătite pentru viitor).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSavePreferences}
                  className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Salvează preferințele
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
