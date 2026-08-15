/**
 * Cloudinary signed upload via LMB API (API secret stays on server).
 * Requires server/.env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * Admin must be logged in (Bearer token).
 */

import { API_BASE, getAdminToken } from "@/lib/connect";

export function isCloudinaryConfigured() {
  // Uploads use signed API on the server — no VITE_CLOUDINARY_* needed in admin.
  return true;
}

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

type SignResponse = {
  ok: boolean;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  error?: string;
};

async function getSignedParams(folder: string): Promise<SignResponse> {
  const token = getAdminToken();
  if (!token) {
    throw new Error("Login required to upload images");
  }
  const res = await fetch(`${API_BASE}/uploads/cloudinary-sign`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ folder }),
  });
  const data = (await res.json()) as SignResponse;
  if (!res.ok || !data.ok) {
    throw new Error(
      data.error ||
        "Cloudinary sign failed. Set CLOUDINARY_* in server/.env and restart the API.",
    );
  }
  return data;
}

export async function uploadImageToCloudinary(
  file: File,
  folder = "lmb/products",
): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be under 8 MB");
  }

  const signed = await getSignedParams(folder);

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", signed.apiKey);
  body.append("timestamp", String(signed.timestamp));
  body.append("signature", signed.signature);
  body.append("folder", signed.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
    { method: "POST", body },
  );

  const data = (await res.json()) as {
    secure_url?: string;
    public_id?: string;
    width?: number;
    height?: number;
    error?: { message?: string };
  };

  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || `Upload failed (${res.status})`);
  }

  return {
    url: data.secure_url,
    publicId: data.public_id ?? "",
    width: data.width,
    height: data.height,
  };
}
