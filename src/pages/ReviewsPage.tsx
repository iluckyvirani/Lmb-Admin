import { useMemo, useState } from "react";
import { Flag, Search, Star, X } from "lucide-react";
import { useGrowth } from "@/context/GrowthContext";
import {
  REVIEW_STATUS_LABEL,
  type AdminReview,
  type ReviewStatus,
} from "@/data/growth";
import { cn } from "@/lib/cn";

function ReviewBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        status === "approved" && "border-emerald-500/40 text-emerald-400",
        status === "pending" && "border-gold/40 text-gold",
        status === "hidden" && "border-red-500/40 text-red-400",
      )}
    >
      {REVIEW_STATUS_LABEL[status]}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating ? "fill-gold" : "text-white/20",
          )}
        />
      ))}
    </span>
  );
}

export function ReviewsPage() {
  const { reviews, setReviewStatus, setVendorReply } = useGrowth();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | ReviewStatus | "flagged">(
    "pending",
  );
  const [type, setType] = useState<"all" | "product" | "service">("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (status === "flagged" && !r.flagged) return false;
      if (status !== "all" && status !== "flagged" && r.status !== status)
        return false;
      if (type !== "all" && r.targetType !== type) return false;
      if (!q.trim()) return true;
      const hay =
        `${r.targetTitle} ${r.customerName} ${r.title} ${r.body}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [reviews, q, status, type]);

  const active = reviews.find((r) => r.id === activeId) ?? null;

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Growth & content
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">Reviews</h1>
        <p className="mt-2 text-sm text-muted">
          {filtered.length} shown · {pendingCount} awaiting moderation
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search product, service, customer…"
            className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="pending">Pending</option>
          <option value="all">All status</option>
          <option value="approved">Approved</option>
          <option value="hidden">Hidden</option>
          <option value="flagged">Flagged</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="all">Products & services</option>
          <option value="product">Products</option>
          <option value="service">Services</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-background-secondary">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Listing</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Review</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="cursor-pointer text-left"
                    onClick={() => setActiveId(r.id)}
                  >
                    <span className="block text-white hover:text-gold">
                      {r.targetTitle}
                    </span>
                    <span className="text-xs capitalize text-muted">
                      {r.targetType}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 text-muted">{r.customerName}</td>
                <td className="px-4 py-3">
                  <Stars rating={r.rating} />
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <span className="flex items-center gap-1.5 text-white">
                    {r.flagged && (
                      <Flag className="h-3.5 w-3.5 shrink-0 text-red-400" />
                    )}
                    {r.title}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-muted">
                    {r.body}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ReviewBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {r.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => setReviewStatus(r.id, "approved")}
                        className="cursor-pointer border border-emerald-500/35 px-2 py-1 text-[10px] tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
                      >
                        Approve
                      </button>
                    )}
                    {r.status !== "hidden" && (
                      <button
                        type="button"
                        onClick={() => setReviewStatus(r.id, "hidden")}
                        className="cursor-pointer border border-red-500/30 px-2 py-1 text-[10px] tracking-wide text-red-400 uppercase hover:bg-red-500/10"
                      >
                        Hide
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {active && (
        <ReviewDrawer
          key={active.id}
          review={active}
          onClose={() => setActiveId(null)}
          onStatus={(s) => setReviewStatus(active.id, s)}
          onReply={(reply) => setVendorReply(active.id, reply)}
        />
      )}
    </>
  );
}

function ReviewDrawer({
  review,
  onClose,
  onStatus,
  onReply,
}: {
  review: AdminReview;
  onClose: () => void;
  onStatus: (s: ReviewStatus) => void;
  onReply: (reply: string) => void;
}) {
  const [reply, setReply] = useState(review.vendorReply ?? "");

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-background-secondary shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
              Review detail
            </p>
            <h2 className="mt-1 font-heading text-2xl text-white">
              {review.id}
            </h2>
            <div className="mt-2">
              <ReviewBadge status={review.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 text-sm">
          <section>
            <p className="text-xs tracking-wide text-muted uppercase">
              {review.targetType}
            </p>
            <p className="mt-1 text-white">{review.targetTitle}</p>
            <p className="mt-2 text-muted">{review.customerName}</p>
            <div className="mt-2">
              <Stars rating={review.rating} />
            </div>
          </section>

          <section>
            <h3 className="font-medium text-white">{review.title}</h3>
            <p className="mt-2 text-muted">{review.body}</p>
            {review.flagged && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-red-400">
                <Flag className="h-3.5 w-3.5" /> Flagged for abuse review
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">
              Moderation
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onStatus("approved")}
                className="cursor-pointer border border-emerald-500/35 px-3 py-2 text-xs tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => onStatus("hidden")}
                className="cursor-pointer border border-red-500/30 px-3 py-2 text-xs tracking-wide text-red-400 uppercase hover:bg-red-500/10"
              >
                Hide
              </button>
              <button
                type="button"
                onClick={() => onStatus("pending")}
                className="cursor-pointer border border-white/15 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40"
              >
                Back to pending
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">
              Vendor reply
            </h3>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              className="w-full border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
              placeholder="Public reply from vendor / ops…"
            />
            <button
              type="button"
              onClick={() => onReply(reply)}
              className="mt-2 cursor-pointer border border-white/15 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40 hover:text-gold"
            >
              Save reply
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
}
