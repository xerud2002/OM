// Development error suppressor for cleaner console
// Only active in development mode

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Suppress specific development-only warnings/errors
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = (...args: any[]) => {
    const errorMessage = args.join(" ");
    
    // Suppress common development errors that don't affect functionality
    const suppressedErrors = [
      "WebSocket connection to",
      "net::ERR_CONNECTION_REFUSED",
      "_next/webpack-hmr",
      "link preload",
      "was preloaded using link preload but not used within a few seconds",
    ];

    const shouldSuppress = suppressedErrors.some(pattern => 
      errorMessage.includes(pattern)
    );

    if (!shouldSuppress) {
      originalConsoleError.apply(console, args);
    }
  };

  console.warn = (...args: any[]) => {
    const warnMessage = args.join(" ");
    
    // Suppress common development warnings
    const suppressedWarnings = [
      "was preloaded using link preload",
      "WebSocket connection",
      "Cross origin request detected",
    ];

    const shouldSuppress = suppressedWarnings.some(pattern => 
      warnMessage.includes(pattern)
    );

    if (!shouldSuppress) {
      originalConsoleWarn.apply(console, args);
    }
  };
}