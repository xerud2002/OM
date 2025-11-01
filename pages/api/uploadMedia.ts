import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "@/lib/firebaseAdmin";
import admin from "@/lib/firebaseAdmin";
import { IncomingForm, File as FormidableFile } from "formidable";
import fs from "fs";

// Disable body parsing so formidable can handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse form data
    const form = new IncomingForm({ multiples: true });
    const [fields, files] = await new Promise<[any, any]>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      }
    );

    // Verify Firebase auth token
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ error: "No auth token provided" });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get upload parameters
    const requestId = Array.isArray(fields.requestId) ? fields.requestId[0] : fields.requestId;
    const customerId = Array.isArray(fields.customerId) ? fields.customerId[0] : fields.customerId;

    if (!requestId || !customerId) {
      return res.status(400).json({ error: "Missing requestId or customerId" });
    }

    // Verify user owns this request
    if (uid !== customerId) {
      return res.status(403).json({ error: "Permission denied" });
    }

    // Upload file(s) to Storage
    const uploadedUrls: string[] = [];
    const fileArray = Array.isArray(files.file) ? files.file : files.file ? [files.file] : [];

    // Resolve bucket name explicitly to avoid default-bucket config issues
    const bucketName =
      (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "").trim() || `${process.env.FIREBASE_ADMIN_PROJECT_ID}.appspot.com`;
  const bucket = admin.storage().bucket(bucketName);
  console.warn("[uploadMedia] Using bucket:", bucketName);

    // Debug: verify bucket existence before attempting upload
    try {
      const [exists] = await bucket.exists();
      if (!exists) {
        console.error("[uploadMedia] Bucket does not exist:", bucketName);
        throw new Error(
          `The specified bucket does not exist: ${bucketName}. Open Firebase Console → Storage and ensure the default bucket is created, or set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET to your bucket (e.g. omro-e5a88.appspot.com).`
        );
      }
    } catch (existErr: any) {
      // If exists() itself fails, surface a clearer message
      if (existErr?.message?.includes("does not exist")) {
        throw existErr;
      }
      console.error("[uploadMedia] Bucket exists() check failed:", existErr);
    }

    for (const file of fileArray) {
      if (!file) continue;

      const formFile = file as FormidableFile;
      const fileName = `${Date.now()}_${formFile.originalFilename}`;
      const storagePath = `requests/${requestId}/customers/${customerId}/${fileName}`;
      
      // Upload to Firebase Storage via Admin SDK
      await bucket.upload(formFile.filepath, {
        destination: storagePath,
        metadata: {
          contentType: formFile.mimetype || "application/octet-stream",
          metadata: {
            uploadedBy: uid,
          },
        },
      });

      const fileRef = bucket.file(storagePath);
      // Generate a long-lived signed URL for reading
      const [signedUrl] = await fileRef.getSignedUrl({
        action: "read",
        // Far future expiry; for tighter control store short-lived and refresh on access
        expires: "03-01-2500",
      });
      uploadedUrls.push(signedUrl);

      // Clean up temp file
      try {
        fs.unlinkSync(formFile.filepath);
      } catch {
        // Ignore cleanup errors
      }
    }

    return res.status(200).json({ 
      ok: true, 
      urls: uploadedUrls 
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({ 
      error: error.message || "Upload failed" 
    });
  }
}
