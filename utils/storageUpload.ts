/**
 * Upload file via Next.js API route (server-side)
 * Bypasses client-side CORS issues on localhost
 */

import { auth } from "@/services/firebase";

export async function uploadFileViaAPI(
  file: File,
  requestId: string,
  customerId: string
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  // Get fresh ID token
  const token = await user.getIdToken();

  // Create FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("requestId", requestId);
  formData.append("customerId", customerId);

  // Upload via API route
  const response = await fetch("/api/uploadMedia", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed: ${response.status}`);
  }

  const result = await response.json();
  
  if (!result.ok || !result.urls || result.urls.length === 0) {
    throw new Error("Upload failed: No URLs returned");
  }

  return result.urls[0];
}
