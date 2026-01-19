// lib/apiAuth.ts
// Shared authentication middleware for API routes

import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminReady } from "@/lib/firebaseAdmin";
import { apiError, ErrorCodes } from "@/types/api";

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
