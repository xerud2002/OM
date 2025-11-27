// API Response Types - Standardized across all endpoints
export type ApiSuccessResponse<T = void> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  code?: string;
};

export type ApiResponse<T = void> = ApiSuccessResponse<T> | ApiErrorResponse;

// Helper functions for API responses
export const apiSuccess = <T = void>(data: T): ApiSuccessResponse<T> => ({
  success: true,
  data,
});

export const apiError = (error: string, code?: string): ApiErrorResponse => ({
  success: false,
  error,
  code,
});

// Common error codes
export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  BAD_REQUEST: "BAD_REQUEST",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  INVALID_TOKEN: "INVALID_TOKEN",
  EXPIRED_TOKEN: "EXPIRED_TOKEN",
  TOKEN_USED: "TOKEN_USED",
  ROLE_CONFLICT: "ROLE_CONFLICT",
  ADMIN_NOT_READY: "ADMIN_NOT_READY",
} as const;
