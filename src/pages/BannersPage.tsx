import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Link2 } from "lucide-react";
import { useGrowth } from "@/context/GrowthContext";
import {
  BANNER_STATUS_LABEL,
  type AdminBanner,
  type BannerPlacement,
  type BannerStatus,
} from "@/data/growth";
import { cn } from "@/lib/cn";

function BannerBadge({ status }: { status: BannerStatus }) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        status === "live" && "border-emerald-500/40 text-emerald-400",
        status === "scheduled" && "border-sky-500/40 text-sky-400",
        status === "draft" && "border-gold/40 text-gold",
        status === "archived" && "border-white/20 text-muted",
      )}
    >
      {BANNER_STATUS_LABEL[status]}
    </span>
  );
}

export function BannersPage() {
  const { banners, setBannerStatus, updateBanner, moveBanner } = useGrowth();
  const [placement, setPlacement] = useState<"all" | BannerPlacement>("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list =
      placement === "all"
        ? [...banners]
        : banners.filter((b) => b.placement === placement);
    return list.sort((a, b) => {
      if (a.placement !== b.placement)
        return a.placement.localeCompare(b.placement);
      return a.sortOrder - b.sortOrder;
    });
  }, [banners, placement]);

  const editing = banners.find((b) => b.id === editingId) ?? null;

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Growth & content
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">Banners</h1>
        <p className="mt-2 text-sm text-muted">
          Home carousel + mid-page promo · aligned with storefront slides
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["home_carousel", "Home carousel"],
            ["mid_promo", "Mid promo"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPlacement(id)}
            className={cn(
              "cursor-pointer border px-3 py-2 text-xs tracking-wide uppercase",
              placement === id
                ? "border-gold/50 text-gold"
                : "border-white/15 text-muted hover:border-white/30 hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="flex flex-col gap-4 border border-white/10 bg-background-secondary p-4 md:flex-row"
          >
            <div className="h-28 w-full shrink-0 overflow-hidden border border-white/10 bg-black/40 md:w-44">
              <img
                src={b.image}
                alt=""
                className="h-full w-full object-cover opacity-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <BannerBadge status={b.status} />
                <span className="text-[10px] tracking-wide text-muted uppercase">
                  {b.placement === "home_carousel"
                    ? "Home carousel"
                    : "Mid promo"}{" "}
                  · #{b.sortOrder}
                </span>
              </div>
              <p className="mt-2 text-[11px] tracking-[0.2em] text-gold uppercase">
                {b.eyebrow}
              </p>
              <h2 className="font-heading text-xl text-white">{b.title}</h2>
              <p className="mt-1 text-sm text-muted">{b.subtitle}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                <Link2 className="h-3.5 w-3.5" />
                {b.href}
              </p>
              <p className="mt-1 text-xs text-muted">
                Publish {b.publishAt}
                {b.unpublishAt ? ` → ${b.unpublishAt}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 flex-row flex-wrap gap-2 md:flex-col">
              <button
                type="button"
                onClick={() => moveBanner(b.id, "up")}
                className="cursor-pointer border border-white/15 p-2 text-muted hover:border-gold/40 hover:text-gold"
                title="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveBanner(b.id, "down")}
                className="cursor-pointer border border-white/15 p-2 text-muted hover:border-gold/40 hover:text-gold"
                title="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setEditingId(b.id)}
                className="cursor-pointer border border-white/15 px-3 py-2 text-[10px] tracking-wide uppercase hover:border-gold/40 hover:text-gold"
              >
                Edit
              </button>
              {b.status !== "live" && (
                <button
                  type="button"
                  onClick={() => setBannerStatus(b.id, "live")}
                  className="cursor-pointer border border-emerald-500/35 px-3 py-2 text-[10px] tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
                >
                  Go live
                </button>
              )}
              {b.status === "live" && (
                <button
                  type="button"
                  onClick={() => setBannerStatus(b.id, "archived")}
                  className="cursor-pointer border border-white/20 px-3 py-2 text-[10px] tracking-wide uppercase hover:border-red-500/40 hover:text-red-400"
                >
                  Archive
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EditBannerModal
          key={editing.id}
          banner={editing}
          onClose={() => setEditingId(null)}
          onSave={(patch) => {
            updateBanner(editing.id, patch);
            setEditingId(null);
          }}
        />
      )}
    </>
  );
}

function EditBannerModal({
  banner,
  onClose,
  onSave,
}: {
  banner: AdminBanner;
  onClose: () => void;
  onSave: (patch: Partial<AdminBanner>) => void;
}) {
  const [eyebrow, setEyebrow] = useState(banner.eyebrow);
  const [title, setTitle] = useState(banner.title);
  const [subtitle, setSubtitle] = useState(banner.subtitle);
  const [href, setHref] = useState(banner.href);
  const [publishAt, setPublishAt] = useState(banner.publishAt);
  const [unpublishAt, setUnpublishAt] = useState(banner.unpublishAt ?? "");
  const [status, setStatus] = useState(banner.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg border border-white/10 bg-background-secondary p-5 shadow-2xl">
        <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
          Edit banner
        </p>
        <h2 className="mt-1 font-heading text-2xl text-white">{banner.id}</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <input
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            placeholder="Eyebrow"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="Subtitle"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
          <input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="/shop or /services…"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-muted">
              Publish
              <input
                type="date"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
              />
            </label>
            <label className="text-xs text-muted">
              Unpublish
              <input
                type="date"
                value={unpublishAt}
                onChange={(e) => setUnpublishAt(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
              />
            </label>
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BannerStatus)}
            className="cursor-pointer border border-white/10 bg-background px-3 py-2 outline-none focus:border-gold/50"
          >
            {(Object.keys(BANNER_STATUS_LABEL) as BannerStatus[]).map((s) => (
              <option key={s} value={s}>
                {BANNER_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() =>
              onSave({
                eyebrow,
                title,
                subtitle,
                href,
                publishAt,
                unpublishAt: unpublishAt || undefined,
                status,
              })
            }
            className="cursor-pointer bg-gold px-4 py-2 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border border-white/15 px-4 py-2 text-xs tracking-wide uppercase hover:border-gold/40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
