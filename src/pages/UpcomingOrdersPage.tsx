import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { useCommerceOps } from "@/context/CommerceOpsContext";
import {
  SHIPMENT_BOARD_COLUMNS,
  formatINR,
  type AdminOrder,
  type ShipmentStatus,
} from "@/data/commerceOps";
import { cn } from "@/lib/cn";

export function UpcomingOrdersPage() {
  const { orders, advanceOrderStatus, setOrderTracking } = useCommerceOps();
  const [activeId, setActiveId] = useState<string | null>(null);

  const boardOrders = useMemo(
    () =>
      orders.filter((o) =>
        SHIPMENT_BOARD_COLUMNS.some((c) => c.status === o.status),
      ),
    [orders],
  );

  const byStatus = useMemo(() => {
    const map: Record<string, AdminOrder[]> = {};
    for (const col of SHIPMENT_BOARD_COLUMNS) {
      map[col.status] = boardOrders.filter((o) => o.status === col.status);
    }
    return map;
  }, [boardOrders]);

  const active = orders.find((o) => o.id === activeId) ?? null;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
            Commerce ops
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white">
            Upcoming shipments
          </h1>
          <p className="mt-2 text-sm text-muted">
            {boardOrders.length} active · pack → ship → out for delivery
          </p>
        </div>
        <Link
          to="/orders"
          className="border border-white/15 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40 hover:text-gold"
        >
          All orders
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
        {SHIPMENT_BOARD_COLUMNS.map((col) => (
          <div
            key={col.status}
            className="flex min-h-[320px] flex-col border border-white/10 bg-background-secondary"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
              <h2 className="text-xs tracking-wide text-muted uppercase">
                {col.label}
              </h2>
              <span className="text-xs text-gold">
                {byStatus[col.status]?.length ?? 0}
              </span>
            </div>
            <ul className="flex flex-1 flex-col gap-2 p-3">
              {(byStatus[col.status] ?? []).map((o) => (
                <li key={o.id}>
                  <ShipmentCard
                    order={o}
                    onOpen={() => setActiveId(o.id)}
                    onAdvance={() => advanceOrderStatus(o.id)}
                  />
                </li>
              ))}
              {(byStatus[col.status] ?? []).length === 0 && (
                <li className="flex flex-1 items-center justify-center py-10 text-xs text-muted">
                  Empty
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {active && (
        <QuickShipModal
          key={active.id}
          order={active}
          onClose={() => setActiveId(null)}
          onAdvance={() => {
            advanceOrderStatus(active.id);
            setActiveId(null);
          }}
          onSaveTracking={(trackingId, courier) => {
            setOrderTracking(active.id, trackingId, courier);
          }}
        />
      )}
    </>
  );
}

function ShipmentCard({
  order,
  onOpen,
  onAdvance,
}: {
  order: AdminOrder;
  onOpen: () => void;
  onAdvance: () => void;
}) {
  const nextLabel: Partial<Record<ShipmentStatus, string>> = {
    ordered: "Mark packed",
    packed: "Mark shipped",
    shipped: "Out for delivery",
    out_for_delivery: "Mark delivered",
  };

  return (
    <div className="border border-white/10 bg-white/[0.02] p-3">
      <button
        type="button"
        onClick={onOpen}
        className="w-full cursor-pointer text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium text-white hover:text-gold">
            {order.id}
          </span>
          <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
        </div>
        <p className="mt-1 text-xs text-muted">{order.customerName}</p>
        <p className="mt-0.5 text-xs text-muted">{order.vendorName}</p>
        <p className="mt-2 text-sm text-gold">{formatINR(order.total)}</p>
        <p className="mt-1 text-[11px] text-muted">
          ETA {order.expectedDelivery} · {order.courier}
        </p>
      </button>
      {nextLabel[order.status] && (
        <button
          type="button"
          onClick={onAdvance}
          className={cn(
            "mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 border px-2 py-1.5 text-[11px] tracking-wide uppercase",
            "border-gold/35 text-gold hover:bg-gold/10",
          )}
        >
          {nextLabel[order.status]}
          <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function QuickShipModal({
  order,
  onClose,
  onAdvance,
  onSaveTracking,
}: {
  order: AdminOrder;
  onClose: () => void;
  onAdvance: () => void;
  onSaveTracking: (trackingId: string, courier: string) => void;
}) {
  const [trackingId, setTrackingId] = useState(order.trackingId);
  const [courier, setCourier] = useState(
    order.courier === "Pending assign" ? "Rocket Express" : order.courier,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md border border-white/10 bg-background-secondary p-5 shadow-2xl">
        <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
          Shipment
        </p>
        <h2 className="mt-1 font-heading text-2xl text-white">{order.id}</h2>
        <p className="mt-2 text-sm text-muted">
          {order.customerName} · {order.address.city} {order.address.pincode}
        </p>
        <ul className="mt-4 space-y-1 text-sm text-muted">
          {order.lines.map((l) => (
            <li key={l.id}>
              {l.title} ×{l.qty}
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2">
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Tracking ID"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-gold/50"
          />
          <input
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            placeholder="Courier"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-gold/50"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              onSaveTracking(trackingId, courier);
              onAdvance();
            }}
            className="cursor-pointer bg-gold px-3 py-2 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent"
          >
            Save & advance
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border border-white/15 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
