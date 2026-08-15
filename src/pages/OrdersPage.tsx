import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Truck, X } from "lucide-react";
import { useCommerceOps } from "@/context/CommerceOpsContext";
import {
  PRODUCT_TIMELINE_TEMPLATE,
  formatINR,
  formatPhone,
  type AdminOrder,
  type ShipmentStatus,
} from "@/data/commerceOps";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";

function OrderStatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        status === "delivered" && "border-emerald-500/40 text-emerald-400",
        status === "out_for_delivery" && "border-sky-500/40 text-sky-400",
        status === "shipped" && "border-violet-500/40 text-violet-300",
        status === "packed" && "border-gold/40 text-gold",
        status === "ordered" && "border-white/25 text-muted",
        status === "cancelled" && "border-red-500/40 text-red-400",
      )}
    >
      {status === "out_for_delivery" ? "Out for delivery" : status.replace(/_/g, " ")}
    </span>
  );
}

export function OrdersPage() {
  const {
    orders,
    setOrderStatus,
    advanceOrderStatus,
    setOrderTracking,
    setOrderNote,
  } = useCommerceOps();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | ShipmentStatus>("all");
  const [vendor, setVendor] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const vendors = useMemo(
    () => [...new Set(orders.map((o) => o.vendorName))].sort(),
    [orders],
  );

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (vendor !== "all" && o.vendorName !== vendor) return false;
      if (!q.trim()) return true;
      const hay =
        `${o.id} ${o.customerName} ${o.vendorName} ${o.trackingId}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [orders, q, status, vendor]);

  const active = orders.find((o) => o.id === activeId) ?? null;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
            Commerce ops
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white">Orders</h1>
          <p className="mt-2 text-sm text-muted">
            {filtered.length} of {orders.length} · timeline syncs with storefront
            track UI
          </p>
        </div>
        <Link
          to="/orders/upcoming"
          className="inline-flex items-center gap-2 border border-gold/40 px-3 py-2 text-xs tracking-wide text-gold uppercase hover:bg-gold/10"
        >
          <Truck className="h-3.5 w-3.5" />
          Upcoming shipments
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order, customer, tracking…"
            className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="all">All status</option>
          {PRODUCT_TIMELINE_TEMPLATE.map((t) => (
            <option key={t.status} value={t.status}>
              {t.label}
            </option>
          ))}
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="all">All vendors</option>
          {vendors.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No orders match"
          description="Try clearing filters or search for another order ID."
        />
      ) : (
      <div className="overflow-x-auto border border-white/10 bg-background-secondary">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr
                key={o.id}
                className="cursor-pointer border-b border-white/5 hover:bg-white/[0.02]"
                onClick={() => setActiveId(o.id)}
              >
                <td className="px-4 py-3">
                  <span className="text-white hover:text-gold">{o.id}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {o.lines.length} item{o.lines.length === 1 ? "" : "s"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="block text-white">{o.customerName}</span>
                  <span className="text-xs text-muted">
                    {formatPhone(o.customerPhone)}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{o.vendorName}</td>
                <td className="px-4 py-3 text-gold">{formatINR(o.total)}</td>
                <td className="px-4 py-3 text-muted">{o.paymentMethod}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(o.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {active && (
        <OrderDrawer
          key={active.id}
          order={active}
          onClose={() => setActiveId(null)}
          onAdvance={() => advanceOrderStatus(active.id)}
          onSetStatus={(s) => setOrderStatus(active.id, s)}
          onSaveTracking={(trackingId, courier) =>
            setOrderTracking(active.id, trackingId, courier)
          }
          onSaveNote={(note) => setOrderNote(active.id, note)}
        />
      )}
    </>
  );
}

function OrderDrawer({
  order,
  onClose,
  onAdvance,
  onSetStatus,
  onSaveTracking,
  onSaveNote,
}: {
  order: AdminOrder;
  onClose: () => void;
  onAdvance: () => void;
  onSetStatus: (s: ShipmentStatus) => void;
  onSaveTracking: (trackingId: string, courier: string) => void;
  onSaveNote: (note: string) => void;
}) {
  const [trackingId, setTrackingId] = useState(order.trackingId);
  const [courier, setCourier] = useState(order.courier);
  const [note, setNote] = useState(order.note ?? "");

  const canAdvance =
    order.status !== "delivered" && order.status !== "cancelled";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-lg flex-col border-l border-white/10 bg-background-secondary shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
              Order detail
            </p>
            <h2 className="mt-1 font-heading text-2xl text-white">{order.id}</h2>
            <div className="mt-2">
              <OrderStatusBadge status={order.status} />
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

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 text-sm">
          <section>
            <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">
              Customer & ship-to
            </h3>
            <p className="text-white">{order.customerName}</p>
            <p className="text-muted">{formatPhone(order.customerPhone)}</p>
            <p className="mt-2 text-muted">
              {order.address.line1}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">
              Lines · {order.vendorName}
            </h3>
            <ul className="space-y-2 border border-white/10 bg-white/[0.02] p-3">
              {order.lines.map((l) => (
                <li key={l.id} className="flex justify-between gap-3">
                  <span className="text-white">
                    {l.title}{" "}
                    <span className="text-muted">×{l.qty}</span>
                  </span>
                  <span className="text-gold">
                    {formatINR(l.unitPrice * l.qty)}
                  </span>
                </li>
              ))}
              <li className="flex justify-between border-t border-white/10 pt-2 text-muted">
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </li>
              <li className="flex justify-between text-muted">
                <span>Shipping</span>
                <span>{formatINR(order.shipping)}</span>
              </li>
              <li className="flex justify-between font-medium text-white">
                <span>Total</span>
                <span className="text-gold">{formatINR(order.total)}</span>
              </li>
            </ul>
            <p className="mt-2 text-xs text-muted">
              Payment: {order.paymentMethod} · {order.paymentStatus}
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">
              Tracking
            </h3>
            <div className="grid gap-2">
              <input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Tracking ID"
                className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
              />
              <input
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                placeholder="Courier (e.g. Rocket Express)"
                className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
              />
              <button
                type="button"
                onClick={() => onSaveTracking(trackingId, courier)}
                className="cursor-pointer border border-white/15 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40 hover:text-gold"
              >
                Save tracking
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              ETA {order.expectedDelivery}
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-xs tracking-wide text-muted uppercase">
              Timeline editor
            </h3>
            <p className="mb-3 text-xs text-muted">
              Matches storefront: Ordered → Packed → Shipped → Out for delivery →
              Delivered
            </p>
            <ol className="space-y-3">
              {order.timeline.map((step) => (
                <li key={step.status} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                      step.done ? "bg-gold" : "bg-white/20",
                    )}
                  />
                  <div>
                    <p className={step.done ? "text-white" : "text-muted"}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted">
                      {step.at
                        ? new Date(step.at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Pending"}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap gap-2">
              {canAdvance && (
                <button
                  type="button"
                  onClick={onAdvance}
                  className="cursor-pointer bg-gold px-3 py-2 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent"
                >
                  Advance status
                </button>
              )}
              <select
                value={order.status}
                onChange={(e) =>
                  onSetStatus(e.target.value as ShipmentStatus)
                }
                className="cursor-pointer border border-white/10 bg-background px-3 py-2 text-xs outline-none focus:border-gold/50"
              >
                {PRODUCT_TIMELINE_TEMPLATE.map((t) => (
                  <option key={t.status} value={t.status}>
                    Jump to {t.label}
                  </option>
                ))}
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">
              Internal note
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
              placeholder="Ops note…"
            />
            <button
              type="button"
              onClick={() => onSaveNote(note)}
              className="mt-2 cursor-pointer border border-white/15 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40 hover:text-gold"
            >
              Save note
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
}
