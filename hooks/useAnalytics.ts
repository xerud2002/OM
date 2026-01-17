// hooks/useAnalytics.ts
// Convenient hooks for analytics tracking in components

import { useCallback } from "react";
import {
  trackButtonClick,
  trackCTAClick,
  trackFormStart,
  trackFormStepComplete,
  trackFormSubmit,
  trackNavClick,
} from "@/utils/analytics";

/**
 * Hook for tracking button clicks
 * Usage: const { trackClick } = useButtonTracking("hero_section");
 *        <button onClick={() => { trackClick("get_started"); doSomething(); }}>
 */
export function useButtonTracking(location: string) {
  const trackClick = useCallback(
    (buttonName: string) => {
      trackButtonClick(buttonName, location);
    },
    [location]
  );

  const trackCTA = useCallback(
    (ctaName: string) => {
      trackCTAClick(ctaName, location);
    },
    [location]
  );

  return { trackClick, trackCTA };
}

/**
 * Hook for tracking multi-step forms
 * Usage: const { startForm, completeStep, submitForm } = useFormTracking("request_form");
 */
export function useFormTracking(formName: string) {
  const startForm = useCallback(() => {
    trackFormStart(formName);
  }, [formName]);

  const completeStep = useCallback(
    (step: number, stepName: string) => {
      trackFormStepComplete(formName, step, stepName);
    },
    [formName]
  );

  const submitForm = useCallback(
    (success: boolean) => {
      trackFormSubmit(formName, success);
    },
    [formName]
  );

  return { startForm, completeStep, submitForm };
}

/**
 * Hook for tracking navigation
 */
export function useNavTracking() {
  const trackNav = useCallback((destination: string) => {
    trackNavClick(destination);
  }, []);

  return { trackNav };
}

/**
 * Create onClick handler that tracks and then calls original handler
 * Usage: <button onClick={withTracking("signup_btn", "header", originalHandler)}>
 */
export function withTracking(
  buttonName: string,
  location: string,
  handler?: () => void
): () => void {
  return () => {
    trackButtonClick(buttonName, location);
    handler?.();
  };
}
