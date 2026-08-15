import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload, GripVertical } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { API_BASE } from "@/lib/connect";
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
  const [serverReady, setServerReady] = useState<boolean | null>(null);
  const images = value.filter(Boolean);
  const canAdd = images.length < max;

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

  function addPasteUrl() {
    const url = pasteUrl.trim();
    if (!url || !canAdd) return;
    onChange([...images, url]);
    setPasteUrl("");
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= images.length) return;
    const copy = [...images];
    const tmp = copy[index]!;
    copy[index] = copy[next]!;
    copy[next] = tmp;
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
        <p className="text-[11px] text-muted">
          {images.length}/{max} · storefront gallery
        </p>
      </div>

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-white/20 bg-white/[0.02] px-4 py-10 text-sm text-muted hover:border-gold/40 hover:text-gold disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          ) : (
            <ImagePlus className="h-6 w-6 text-gold/70" />
          )}
          {uploading ? "Uploading…" : "Upload photos"}
        </button>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((src, i) => (
            <li
              key={`${src}-${i}`}
              className="group relative overflow-hidden border border-white/10 bg-background"
            >
              <img src={src} alt="" className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/70 px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    className="p-1 text-muted hover:text-white disabled:opacity-30"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    title="Move left"
                  >
                    <GripVertical className="h-3.5 w-3.5 rotate-90" />
                  </button>
                </div>
                <button
                  type="button"
                  className="p-1 text-red-300 hover:text-red-200"
                  onClick={() => removeAt(i)}
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-gold/90 px-1.5 py-0.5 text-[9px] font-medium text-background uppercase">
                  Cover
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void onFiles(e.target.files)}
      />

      {canAdd && images.length > 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 border border-white/15 px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-gold",
            uploading && "opacity-50",
          )}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload more
        </button>
      )}

      {serverReady === false && (
        <p className="text-xs text-amber-400/90">
          API Cloudinary is not configured. Set{" "}
          <code className="text-gold">CLOUDINARY_CLOUD_NAME</code>,{" "}
          <code className="text-gold">CLOUDINARY_API_KEY</code>,{" "}
          <code className="text-gold">CLOUDINARY_API_SECRET</code> in{" "}
          <code className="text-gold">server/.env</code> (or Vercel API env),
          restart the API, and stay logged in as admin.
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
              className="mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-gold/50"
              placeholder="https://…"
            />
          </label>
          <button
            type="button"
            onClick={addPasteUrl}
            className="border border-white/15 px-3 py-2 text-xs text-gold hover:bg-gold/10"
          >
            Add URL
          </button>
        </div>
      )}
    </div>
  );
}
