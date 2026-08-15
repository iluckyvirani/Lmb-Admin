import { cn } from "@/lib/cn";
import type { PublishStatus } from "@/data/catalog";

export function StatusBadge({ status }: { status: PublishStatus | string }) {
  const s = status.toLowerCase();
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        s === "published" && "border-emerald-500/40 text-emerald-400",
        s === "draft" && "border-gold/40 text-gold",
        s === "archived" && "border-white/20 text-muted",
        !["published", "draft", "archived"].includes(s) &&
          "border-white/20 text-muted",
      )}
    >
      {status}
    </span>
  );
}

export function FeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) return <span className="text-xs text-muted">—</span>;
  return (
    <span className="inline-block border border-gold/40 px-2 py-0.5 text-[10px] tracking-wide text-gold uppercase">
      Featured
    </span>
  );
}
