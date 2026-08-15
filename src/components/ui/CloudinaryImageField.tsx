import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { API_BASE } from "@/lib/connect";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
};

export function CloudinaryImageField({
  value,
  onChange,
  folder = "lmb/products",
  label = "Product image",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverReady, setServerReady] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/uploads/cloudinary-status`)
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => {
        if (!cancelled) setServerReady(Boolean(d.configured));
      })
      .catch(() => {
        if (!cancelled) setServerReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const result = await uploadImageToCloudinary(file, folder);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">{label}</p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-36 w-full max-w-[220px] items-center justify-center overflow-hidden border border-white/15 bg-background">
          {value ? (
            <img
              src={value}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center text-muted">
              <ImagePlus className="h-8 w-8 opacity-50" strokeWidth={1.25} />
              <span className="text-xs">No image yet</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-2 bg-gold px-4 py-2.5 text-sm font-medium text-background hover:bg-gold-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Uploading…" : "Upload to Cloudinary"}
            </button>
            {value && (
              <button
                type="button"
                disabled={uploading}
                onClick={() => onChange("")}
                className="inline-flex cursor-pointer items-center gap-2 border border-white/20 px-4 py-2.5 text-sm text-muted hover:border-red-400/40 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>

          {serverReady === false && (
            <p className="text-xs text-amber-400/90">
              API Cloudinary is not configured. Set{" "}
              <code className="text-gold">CLOUDINARY_*</code> in{" "}
              <code className="text-gold">server/.env</code> (or Vercel API
              env), restart the API, and stay logged in as admin.
            </p>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <label className="block text-xs text-muted">
            Or paste image URL
            <input
              value={value}
              onChange={(e) => {
                setError(null);
                onChange(e.target.value);
              }}
              className="mt-1 w-full border border-white/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
              placeholder="https://…"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
