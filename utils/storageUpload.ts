/**
 * Direct Firebase Storage upload via REST API
 * Bypasses Firebase SDK entirely to avoid CORS preflight issues on localhost
 */

import { auth } from "@/services/firebase";

export async function uploadFileDirectly(
  file: File,
  storagePath: string
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  // Get fresh ID token
  const token = await user.getIdToken();

  // Encode path for URL
  const encodedPath = encodeURIComponent(storagePath);
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  
  // Upload directly via Firebase Storage REST API
  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodedPath}`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  // Construct public download URL
  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${result.downloadTokens}`;
  
  return downloadUrl;
}
