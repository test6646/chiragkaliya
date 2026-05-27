// Cloudinary unsigned upload helper. Browser-only.
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export type CloudinaryAsset = {
  url: string;
  public_id: string;
  resource_type: "image" | "video" | "raw";
  format?: string;
  width?: number;
  height?: number;
  duration?: number;
};

export function cloudinaryConfigured() {
  return Boolean(CLOUD && PRESET);
}

export async function uploadToCloudinary(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): Promise<CloudinaryAsset> {
  if (!CLOUD || !PRESET) {
    throw new Error(
      "Cloudinary not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env"
    );
  }
  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);
  if (folder) fd.append("folder", folder);

  return new Promise<CloudinaryAsset>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress)
        onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            url: json.secure_url,
            public_id: json.public_id,
            resource_type: json.resource_type,
            format: json.format,
            width: json.width,
            height: json.height,
            duration: json.duration,
          });
        } else {
          reject(new Error(json?.error?.message || `Upload failed (${xhr.status})`));
        }
      } catch (err) {
        reject(err);
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(fd);
  });
}
