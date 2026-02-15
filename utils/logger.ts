// Centralized logging utility
// Debug/info logs only in development; errors and warnings always logged
// PM2 captures stdout/stderr in production logs

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  warn: (...args: unknown[]) => {
    // Warnings always logged — important for deprecations and issues
    console.warn(...args);
  },

  error: (...args: unknown[]) => {
    // Errors always logged — PM2 captures stderr for production monitoring
    console.error(...args);
    // In production, you could also send to error tracking service:
    // if (!isDevelopment) {
    //   // Sentry.captureException(...args);
    // }
  },

  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};

// For critical errors that should always be logged
export const logCritical = (...args: unknown[]) => {
  console.error(...args);
  // Always send critical errors to monitoring service
  // Sentry.captureException(...args);
};
