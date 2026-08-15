import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload, GripVertical } from "lucide-react";
import {
  isCloudinaryConfigured,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";
import { cn } from "@/lib/cn";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  max?: number;
};

export function CloudinaryGalleryField({
  value,
  onChange,
  folder = "lmb/services",
  label = "Gallery images",
  max = 8,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasteUrl, setPasteUrl] = useState("");
  const configured = isCloudinaryConfigured();
  const images = value.filter(Boolean);
  const canAdd = images.length < max;

  async function onFiles(files: FileList | null) {
    if (!files?.length || !canAdd) return;
    setError(null);
    setUploading(true);
    try {
      const remaining = max - images.length;
      const batch = Array.from(files).slice(0, remaining);
      const uploaded: string[] = [];
      for (const file of batch) {
        const result = await uploadImageToCloudinary(file, folder);
        uploaded.push(result.url);
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= images.length) return;
    const copy = [...images];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    onChange(copy);
  }

  function addPasteUrl() {
    const url = pasteUrl.trim();
    if (!url || !canAdd) return;
    setError(null);
    onChange([...images, url]);
    setPasteUrl("");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-0.5 text-xs text-muted">
            First image is the cover. Up to {max} photos for the storefront
            gallery.
          </p>
        </div>
        <p className="text-xs text-muted">
          {images.length} / {max}
        </p>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden border bg-background",
                i === 0 ? "border-gold/60" : "border-white/15",
              )}
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="h-full w-full object-cover"
              />
              {i === 0 && (
                <span className="absolute top-2 left-2 bg-gold px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-background uppercase">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/70 px-1.5 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    title="Move left"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="cursor-pointer p-1 text-white/80 hover:text-gold disabled:opacity-30"
                  >
                    <GripVertical className="h-3.5 w-3.5 rotate-90" />
                  </button>
                  <button
                    type="button"
                    title="Move right"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, 1)}
                    className="cursor-pointer p-1 text-white/80 hover:text-gold disabled:opacity-30"
                  >
                    <GripVertical className="h-3.5 w-3.5 -rotate-90" />
                  </button>
                </div>
                <button
                  type="button"
                  title="Remove"
                  onClick={() => removeAt(i)}
                  className="cursor-pointer p-1 text-red-300 hover:text-red-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {canAdd && (
            <button
              type="button"
              disabled={uploading || !configured}
              onClick={() => inputRef.current?.click()}
              className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-white/20 text-muted hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ImagePlus className="h-6 w-6 opacity-60" strokeWidth={1.25} />
              )}
              <span className="text-xs">Add photo</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-white/20 px-4 py-12 text-muted">
          <ImagePlus className="h-10 w-10 opacity-40" strokeWidth={1.25} />
          <p className="text-sm">No gallery photos yet</p>
          <button
            type="button"
            disabled={uploading || !configured}
            onClick={() => inputRef.current?.click()}
            className="inline-flex cursor-pointer items-center gap-2 bg-gold px-4 py-2.5 text-sm font-medium text-background hover:bg-gold-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading…" : "Upload photos"}
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => void onFiles(e.target.files)}
      />

      {images.length > 0 && canAdd && (
        <button
          type="button"
          disabled={uploading || !configured}
          onClick={() => inputRef.current?.click()}
          className="inline-flex cursor-pointer items-center gap-2 border border-white/20 px-4 py-2 text-sm text-muted hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload more
        </button>
      )}

      {!configured && (
        <p className="text-xs text-amber-400/90">
          Add{" "}
          <code className="text-gold">VITE_CLOUDINARY_CLOUD_NAME</code> and{" "}
          <code className="text-gold">VITE_CLOUDINARY_UPLOAD_PRESET</code> to{" "}
          <code className="text-gold">admin/.env</code>, then restart the admin
          app.
        </p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {canAdd && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="block min-w-0 flex-1 text-xs text-muted">
            Or paste image URL
            <input
              value={pasteUrl}
              onChange={(e) => setPasteUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPasteUrl();
                }
              }}
              className="mt-1 w-full border border-white/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
              placeholder="https://…"
            />
          </label>
          <button
            type="button"
            onClick={addPasteUrl}
            disabled={!pasteUrl.trim()}
            className="cursor-pointer border border-white/20 px-4 py-2.5 text-sm text-muted hover:border-gold/40 hover:text-gold disabled:opacity-40"
          >
            Add URL
          </button>
        </div>
      )}
    </div>
  );
}
