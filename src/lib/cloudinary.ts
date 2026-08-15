/**
 * Cloudinary unsigned upload (browser → Cloudinary).
 * Set in admin/.env:
 *   VITE_CLOUDINARY_CLOUD_NAME=your_cloud
 *   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 */

const cloudName = () =>
  (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined)?.trim() ??
  "";
const uploadPreset = () =>
  (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined)?.trim() ??
  "";

export function isCloudinaryConfigured() {
  return Boolean(cloudName() && uploadPreset());
}

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

export async function uploadImageToCloudinary(
  file: File,
  folder = "lmb/products",
): Promise<CloudinaryUploadResult> {
  const cloud = cloudName();
  const preset = uploadPreset();
  if (!cloud || !preset) {
    throw new Error(
      "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to admin/.env",
    );
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be under 8 MB");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", preset);
  body.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
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
