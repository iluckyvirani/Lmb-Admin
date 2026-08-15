import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import { useGrowth } from "@/context/GrowthContext";
import {
  COUPON_STATUS_LABEL,
  formatCouponValue,
  formatINR,
  type AdminCoupon,
  type CouponStatus,
  type CouponType,
} from "@/data/growth";
import { cn } from "@/lib/cn";

function CouponBadge({ status }: { status: CouponStatus }) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        status === "active" && "border-emerald-500/40 text-emerald-400",
        status === "scheduled" && "border-sky-500/40 text-sky-400",
        status === "expired" && "border-white/20 text-muted",
        status === "disabled" && "border-red-500/40 text-red-400",
      )}
    >
      {COUPON_STATUS_LABEL[status]}
    </span>
  );
}

export function CouponsPage() {
  const { coupons, addCoupon, setCouponStatus } = useGrowth();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | CouponStatus>("all");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    return coupons.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (!q.trim()) return true;
      return `${c.code} ${c.note ?? ""}`
        .toLowerCase()
        .includes(q.trim().toLowerCase());
    });
  }, [coupons, q, status]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
            Growth & content
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white">Coupons</h1>
          <p className="mt-2 text-sm text-muted">
            {filtered.length} of {coupons.length} · % or flat · min cart & expiry
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/products"
            className="border border-white/15 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40 hover:text-gold"
          >
            Featured in catalog
          </Link>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex cursor-pointer items-center gap-2 bg-gold px-3 py-2 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent"
          >
            <Plus className="h-3.5 w-3.5" />
            Create coupon
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search code…"
            className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="all">All status</option>
          {(Object.keys(COUPON_STATUS_LABEL) as CouponStatus[]).map((s) => (
            <option key={s} value={s}>
              {COUPON_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-background-secondary">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Min cart</th>
              <th className="px-4 py-3 font-medium">Usage</th>
              <th className="px-4 py-3 font-medium">Window</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <CouponRow
                key={c.id}
                coupon={c}
                onStatus={(s) => setCouponStatus(c.id, s)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <CreateCouponModal
          onClose={() => setShowForm(false)}
          onCreate={(input) => {
            addCoupon(input);
            setShowForm(false);
          }}
        />
      )}
    </>
  );
}

function CouponRow({
  coupon: c,
  onStatus,
}: {
  coupon: AdminCoupon;
  onStatus: (s: CouponStatus) => void;
}) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02]">
      <td className="px-4 py-3">
        <span className="font-medium tracking-wide text-gold">{c.code}</span>
        {c.note && (
          <span className="mt-0.5 block text-xs text-muted">{c.note}</span>
        )}
      </td>
      <td className="px-4 py-3 text-white">
        {formatCouponValue(c)}
        {c.maxDiscount != null && (
          <span className="mt-0.5 block text-xs text-muted">
            Cap {formatINR(c.maxDiscount)}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-muted">{formatINR(c.minCart)}</td>
      <td className="px-4 py-3">
        {c.usedCount}/{c.usageLimit}
      </td>
      <td className="px-4 py-3 text-muted">
        {c.startsAt} → {c.expiresAt}
      </td>
      <td className="px-4 py-3">
        <CouponBadge status={c.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {c.status !== "active" && c.status !== "expired" && (
            <button
              type="button"
              onClick={() => onStatus("active")}
              className="cursor-pointer border border-emerald-500/35 px-2 py-1 text-[10px] tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
            >
              Activate
            </button>
          )}
          {c.status === "active" && (
            <button
              type="button"
              onClick={() => onStatus("disabled")}
              className="cursor-pointer border border-red-500/30 px-2 py-1 text-[10px] tracking-wide text-red-400 uppercase hover:bg-red-500/10"
            >
              Disable
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function CreateCouponModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: {
    code: string;
    type: CouponType;
    value: number;
    minCart: number;
    maxDiscount?: number;
    startsAt: string;
    expiresAt: string;
    usageLimit: number;
    status: CouponStatus;
    note?: string;
  }) => void;
}) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<CouponType>("percent");
  const [value, setValue] = useState(10);
  const [minCart, setMinCart] = useState(2999);
  const [maxDiscount, setMaxDiscount] = useState(1500);
  const [startsAt, setStartsAt] = useState("2026-08-13");
  const [expiresAt, setExpiresAt] = useState("2026-09-30");
  const [usageLimit, setUsageLimit] = useState(100);
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md border border-white/10 bg-background-secondary p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
              New coupon
            </p>
            <h2 className="mt-1 font-heading text-2xl text-white">
              Create offer
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-3 text-sm">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="CODE"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CouponType)}
              className="cursor-pointer border border-white/10 bg-background px-3 py-2 outline-none focus:border-gold/50"
            >
              <option value="percent">Percent %</option>
              <option value="flat">Flat ₹</option>
            </select>
            <input
              type="number"
              min={1}
              value={value}
              onChange={(e) => setValue(Number(e.target.value) || 0)}
              className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-muted">
              Min cart
              <input
                type="number"
                value={minCart}
                onChange={(e) => setMinCart(Number(e.target.value) || 0)}
                className="mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
              />
            </label>
            <label className="text-xs text-muted">
              Max discount (optional)
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(Number(e.target.value) || 0)}
                className="mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-muted">
              Starts
              <input
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
              />
            </label>
            <label className="text-xs text-muted">
              Expires
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
              />
            </label>
          </div>
          <label className="text-xs text-muted">
            Usage limit
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(Number(e.target.value) || 1)}
              className="mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
            />
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Internal note (optional)"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
        </div>
        <button
          type="button"
          disabled={!code.trim()}
          onClick={() =>
            onCreate({
              code,
              type,
              value,
              minCart,
              maxDiscount: type === "percent" ? maxDiscount : undefined,
              startsAt,
              expiresAt,
              usageLimit,
              status: "active",
              note: note.trim() || undefined,
            })
          }
          className="mt-4 w-full cursor-pointer bg-gold py-2.5 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent disabled:opacity-40"
        >
          Save coupon
        </button>
      </div>
    </div>
  );
}
