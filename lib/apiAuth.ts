// lib/apiAuth.ts
// Shared authentication middleware for API routes

import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminReady } from "@/lib/firebaseAdmin";
import { apiError, ErrorCodes } from "@/types/api";
import { logCritical, logger } from "@/utils/logger";

// ── T4 fix: Boot-time validation of INTERNAL_API_SECRET ──────────────
const MIN_SECRET_LENGTH = 32;
const internalSecret = process.env.INTERNAL_API_SECRET;
const secretConfigured =
  typeof internalSecret === "string" && internalSecret.length >= MIN_SECRET_LENGTH;

if (!secretConfigured) {
  logCritical(
    "[SECURITY] INTERNAL_API_SECRET is missing or too short (< 32 chars). " +
      "All internal API requests will be REJECTED until this is fixed.",
  );
}

/**
 * Validate the x-internal-key header against INTERNAL_API_SECRET.
 * Returns { valid: true } on success, or error details on failure.
 */
export function validateInternalSecret(req: NextApiRequest): 
  | { valid: true }
  | { valid: false; status: number; error: string; code: string } {
  if (!secretConfigured) {
    return {
      valid: false,
      status: 503,
      error: "Internal API secret not configured",
      code: ErrorCodes.ADMIN_NOT_READY,
    };
  }
  const provided = req.headers["x-internal-key"];
  if (provided !== internalSecret) {
    return {
      valid: false,
      status: 401,
      error: "Unauthorized",
      code: ErrorCodes.UNAUTHORIZED,
    };
  }
  return { valid: true };
}

export type AuthResult =
  | { success: true; uid: string }
  | { success: false; error: string; status: number; code: string };

/**
 * Verify Firebase ID token from Authorization header
 * @returns AuthResult with uid on success, or error details on failure
 */
export async function verifyAuth(req: NextApiRequest): Promise<AuthResult> {
  if (!adminReady) {
    return {
      success: false,
      error: "Admin not configured in this environment",
      status: 503,
      code: ErrorCodes.ADMIN_NOT_READY,
    };
  }

  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    return {
      success: false,
      error: "Missing Authorization bearer token",
      status: 401,
      code: ErrorCodes.UNAUTHORIZED,
    };
  }

  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    return { success: true, uid: decoded.uid };
  } catch {
    return {
      success: false,
      error: "Invalid or expired token",
      status: 401,
      code: ErrorCodes.INVALID_TOKEN,
    };
  }
}

/**
 * Helper to send auth error response
 */
export function sendAuthError(res: NextApiResponse, result: AuthResult) {
  if (!result.success) {
    return res.status(result.status).json(apiError(result.error, result.code));
  }
}

/**
 * Wrapper for protected API handlers
 * Automatically handles auth and provides uid to handler
 */
export function withAuth(
  handler: (_req: NextApiRequest, _res: NextApiResponse, _uid: string) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authResult = await verifyAuth(req);
    if (!authResult.success) {
      return sendAuthError(res, authResult);
    }
    return handler(req, res, authResult.uid);
  };
}

/**
 * Wrapper that adds consistent try/catch error handling + logging.
 * Use around any API handler to prevent uncaught exceptions from leaking.
 *
 * @example
 * export default withErrorHandler(async (req, res) => { ... });
 */
export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void | NextApiResponse>,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`[API ${req.method} ${req.url}] Unhandled error:`, message);
      if (!res.headersSent) {
        return res.status(500).json(apiError("Internal server error", ErrorCodes.INTERNAL_ERROR));
      }
    }
  };
}
