// Centralized logging utility
// Logs only in development, silent in production

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
    // In production, you could send to error tracking service:
    // if (!isDevelopment) {
    //   // Sentry.captureException(...args);
    // }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};

// For critical errors that should always be logged
export const logCritical = (...args: any[]) => {
  console.error(...args);
  // Always send critical errors to monitoring service
  // Sentry.captureException(...args);
};
