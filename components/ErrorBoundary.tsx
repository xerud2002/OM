import React, { Component, ReactNode } from "react";
import { logger } from "@/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("ErrorBoundary caught an error:", error, errorInfo);
    // Report to error tracking service if available
    if (typeof window !== "undefined" && (window as any).__SENTRY__) {
      try {
        (window as any).Sentry?.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
      } catch { /* ignore if Sentry not loaded */ }
    }
    // Also report to GA4 if available
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "exception", {
        description: error.message,
        fatal: true,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-2 text-xl font-bold text-red-600">Ceva nu a mers bine</h2>
              <p className="text-gray-600">
                Ne cerem scuze pentru inconvenient. Te rugăm să reîncarci pagina.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                Reîncarcă pagina
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
