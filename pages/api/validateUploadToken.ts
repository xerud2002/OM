import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { token } = req.query;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Missing token parameter", valid: false });
  }

  try {
    // Get token from Firestore
    const tokenRef = doc(db, "uploadTokens", token);
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) {
      return res.status(404).json({ error: "Token not found", valid: false });
    }

    const tokenData = tokenSnap.data();

    // Check if token is already used
    if (tokenData.used) {
      return res.status(200).json({
        valid: false,
        reason: "already_used",
        message: "Acest link a fost deja folosit pentru upload.",
      });
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expiresAt);
    const now = new Date();
    if (now > expiresAt) {
      return res.status(200).json({
        valid: false,
        reason: "expired",
        message: "Acest link a expirat. Te rugăm să contactezi echipa pentru un link nou.",
      });
    }

    // Token is valid
    return res.status(200).json({
      valid: true,
      requestId: tokenData.requestId,
      customerEmail: tokenData.customerEmail,
      customerName: tokenData.customerName,
      expiresAt: tokenData.expiresAt,
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return res.status(500).json({ error: "Internal server error", valid: false });
  }
}
