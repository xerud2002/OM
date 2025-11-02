import React, { Component, ReactNode } from "react";
import { RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  dashboardType: "customer" | "company";
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`${this.props.dashboardType} Dashboard error:`, error, errorInfo);
    
    // In production, you could send this to an error tracking service
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      // Example: Send to Sentry, LogRocket, etc.
      // captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      const isCustomer = this.props.dashboardType === "customer";
      
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-emerald-50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-100 p-4">
                <RefreshCw className="h-8 w-8 text-red-600" />
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                Oops! Ceva nu a mers bine
              </h2>
              
              <p className="mt-2 text-sm text-gray-600">
                {isCustomer 
                  ? "Panoul tău de client a întâmpinat o problemă tehnică. Te rugăm să încerci din nou."
                  : "Panoul companiei tale a întâmpinat o problemă tehnică. Te rugăm să încerci din nou."
                }
              </p>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
                >
                  <RefreshCw size={16} />
                  Reîncarcă panoul
                </button>
                
                <button
                  onClick={() => window.location.href = "/"}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Home size={16} />
                  Înapoi acasă
                </button>
              </div>

              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Dacă problema persistă, te rugăm să ne contactezi la{" "}
                  <a 
                    href="mailto:support@ofertemutare.ro"
                    className="font-medium text-emerald-600 hover:underline"
                  >
                    support@ofertemutare.ro
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}