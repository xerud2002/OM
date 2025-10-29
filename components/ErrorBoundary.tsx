import React, { Component, ReactNode } from "react";

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
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-2 text-xl font-bold text-red-600">
                Ceva nu a mers bine
              </h2>
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
