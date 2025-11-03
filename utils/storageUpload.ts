/**
 * Upload file via Next.js API route (server-side) or fallback to client-side
 * Bypasses client-side CORS issues on localhost
 */

import { auth, storage } from "@/services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

  // Try API route first
  const response = await fetch("/api/uploadMedia", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  // If API returns 503 (Admin not configured), use client-side upload
  if (response.status === 503) {
    console.warn("API upload not available, using client-side upload");
    return uploadFileClientSide(file, requestId, customerId);
  }

  // If API returns 500 with storage config error, try client-side as fallback
  if (response.status === 500) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.error?.includes("Storage") || errorData.error?.includes("configured")) {
      console.warn("Storage configuration issue, trying client-side upload");
      return uploadFileClientSide(file, requestId, customerId);
    }
  }

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

/**
 * Client-side upload directly to Firebase Storage
 */
async function uploadFileClientSide(
  file: File,
  requestId: string,
  customerId: string
): Promise<string> {
  const fileName = `${Date.now()}_${file.name}`;
  const storagePath = `requests/${requestId}/customers/${customerId}/${fileName}`;

  const storageRef = ref(storage, storagePath);

  // Upload file
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.warn(`Upload progress: ${progress.toFixed(0)}%`);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
