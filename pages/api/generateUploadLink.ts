import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import { db } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { requestId, customerEmail, customerName } = req.body || {};
  if (!requestId || !customerEmail) {
    return res.status(400).json({ error: "Missing required fields: requestId, customerEmail" });
  }

  try {
    // Generate unique upload token
    const uploadToken = randomBytes(32).toString("hex");
    const uploadLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/upload/${uploadToken}`;
    
    // Calculate expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save token to Firestore
    const tokenRef = doc(db, "uploadTokens", uploadToken);
    await setDoc(tokenRef, {
      requestId,
      customerEmail,
      customerName,
      uploadLink,
      createdAt: serverTimestamp(),
      expiresAt: expiresAt.toISOString(),
      used: false,
      uploadedAt: null,
    });

    // Also update the request with the token
    const requestRef = doc(db, "requests", requestId);
    await setDoc(requestRef, { mediaUploadToken: uploadToken }, { merge: true });

    // Return token - email will be sent client-side via EmailJS
    return res.status(200).json({ 
      ok: true, 
      uploadToken, 
      uploadLink,
      customerEmail,
      customerName
    });
  } catch (error) {
    console.error("Error generating upload link:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
