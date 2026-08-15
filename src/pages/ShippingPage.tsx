import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Rocket, Truck } from "lucide-react";
import { useMoneyLogistics } from "@/context/MoneyLogisticsContext";
import { useCommerceOps } from "@/context/CommerceOpsContext";
import { formatINR } from "@/data/moneyLogistics";
import { cn } from "@/lib/cn";

type Tab = "providers" | "zones" | "rates" | "assign";

export function ShippingPage() {
  const {
    couriers,
    zones,
    rates,
    toggleCourier,
    updateZone,
    updateRate,
  } = useMoneyLogistics();
  const { orders, setOrderTracking, advanceOrderStatus } = useCommerceOps();
  const [tab, setTab] = useState<Tab>("providers");

  const needsTracking = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status !== "delivered" &&
          o.status !== "cancelled" &&
          (o.courier === "Pending assign" || !o.trackingId),
      ),
    [orders],
  );

  const activeCouriers = couriers.filter((c) => c.active);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
            Money & logistics
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white">
            Shipping / Rocket
          </h1>
          <p className="mt-2 text-sm text-muted">
            Couriers, zones, rates · assign tracking to open shipments
          </p>
        </div>
        <Link
          to="/orders/upcoming"
          className="inline-flex items-center gap-2 border border-gold/40 px-3 py-2 text-xs tracking-wide text-gold uppercase hover:bg-gold/10"
        >
          <Truck className="h-3.5 w-3.5" />
          Upcoming board
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["providers", "Providers"],
            ["zones", "Zones & ETA"],
            ["rates", "Rate table"],
            ["assign", `Assign tracking (${needsTracking.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "cursor-pointer border px-3 py-2 text-xs tracking-wide uppercase",
              tab === id
                ? "border-gold/50 text-gold"
                : "border-white/15 text-muted hover:border-white/30 hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "providers" && (
        <div className="grid gap-4 md:grid-cols-2">
          {couriers.map((c) => (
            <div
              key={c.id}
              className={cn(
                "border bg-background-secondary p-4",
                c.kind === "rocket" && c.active
                  ? "border-gold/40"
                  : "border-white/10",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-9 w-9 items-center justify-center border",
                      c.kind === "rocket"
                        ? "border-gold/40 text-gold"
                        : "border-white/15 text-muted",
                    )}
                  >
                    {c.kind === "rocket" ? (
                      <Rocket className="h-4 w-4" />
                    ) : (
                      <Truck className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <h2 className="font-heading text-xl text-white">{c.name}</h2>
                    <p className="mt-1 text-xs tracking-wide text-muted uppercase">
                      {c.code} · {c.kind} · ~{c.avgEtaDays}d avg
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Prefix {c.trackingPrefix} · Support {c.supportPhone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCourier(c.id)}
                  className={cn(
                    "shrink-0 cursor-pointer border px-2.5 py-1 text-[10px] tracking-wide uppercase",
                    c.active
                      ? "border-emerald-500/40 text-emerald-400"
                      : "border-white/20 text-muted",
                  )}
                >
                  {c.active ? "Active" : "Off"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "zones" && (
        <div className="overflow-x-auto border border-white/10 bg-background-secondary">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Zone</th>
                <th className="px-4 py-3 font-medium">Pincode prefixes</th>
                <th className="px-4 py-3 font-medium">ETA (days)</th>
                <th className="px-4 py-3 font-medium">Base rate</th>
                <th className="px-4 py-3 font-medium">Free above</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.id} className="border-b border-white/5">
                  <td className="px-4 py-3 text-white">{z.name}</td>
                  <td className="px-4 py-3 text-muted">
                    {z.pincodePrefixes.join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={z.etaMinDays}
                        onChange={(e) =>
                          updateZone(z.id, {
                            etaMinDays: Number(e.target.value) || 1,
                          })
                        }
                        className="w-16 border border-white/10 bg-white/[0.04] px-2 py-1 outline-none focus:border-gold/50"
                      />
                      <span className="text-muted">–</span>
                      <input
                        type="number"
                        min={1}
                        value={z.etaMaxDays}
                        onChange={(e) =>
                          updateZone(z.id, {
                            etaMaxDays: Number(e.target.value) || 1,
                          })
                        }
                        className="w-16 border border-white/10 bg-white/[0.04] px-2 py-1 outline-none focus:border-gold/50"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={z.baseRate}
                      onChange={(e) =>
                        updateZone(z.id, {
                          baseRate: Number(e.target.value) || 0,
                        })
                      }
                      className="w-24 border border-white/10 bg-white/[0.04] px-2 py-1 outline-none focus:border-gold/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={z.freeAbove}
                      onChange={(e) =>
                        updateZone(z.id, {
                          freeAbove: Number(e.target.value) || 0,
                        })
                      }
                      className="w-28 border border-white/10 bg-white/[0.04] px-2 py-1 outline-none focus:border-gold/50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "rates" && (
        <div className="overflow-x-auto border border-white/10 bg-background-secondary">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Zone</th>
                <th className="px-4 py-3 font-medium">Max weight (kg)</th>
                <th className="px-4 py-3 font-medium">Surface rate</th>
                <th className="px-4 py-3 font-medium">Rocket surcharge</th>
                <th className="px-4 py-3 font-medium">Rocket total</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="px-4 py-3 text-white">{r.zoneName}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={r.weightKgMax}
                      onChange={(e) =>
                        updateRate(r.id, {
                          weightKgMax: Number(e.target.value) || 1,
                        })
                      }
                      className="w-20 border border-white/10 bg-white/[0.04] px-2 py-1 outline-none focus:border-gold/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={r.rate}
                      onChange={(e) =>
                        updateRate(r.id, {
                          rate: Number(e.target.value) || 0,
                        })
                      }
                      className="w-24 border border-white/10 bg-white/[0.04] px-2 py-1 outline-none focus:border-gold/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={r.rocketSurcharge}
                      onChange={(e) =>
                        updateRate(r.id, {
                          rocketSurcharge: Number(e.target.value) || 0,
                        })
                      }
                      className="w-24 border border-white/10 bg-white/[0.04] px-2 py-1 outline-none focus:border-gold/50"
                    />
                  </td>
                  <td className="px-4 py-3 text-gold">
                    {formatINR(r.rate + r.rocketSurcharge)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "assign" && (
        <div className="space-y-3">
          {needsTracking.length === 0 && (
            <p className="border border-white/10 bg-background-secondary px-4 py-8 text-center text-sm text-muted">
              All open shipments have courier + tracking assigned.
            </p>
          )}
          {needsTracking.map((o) => (
            <AssignCard
              key={o.id}
              orderId={o.id}
              customer={o.customerName}
              city={o.address.city}
              pincode={o.address.pincode}
              statusLabel={o.statusLabel}
              defaultCourier={
                activeCouriers.find((c) => c.kind === "rocket")?.name ??
                activeCouriers[0]?.name ??
                "Rocket Express"
              }
              defaultPrefix={
                activeCouriers.find((c) => c.kind === "rocket")
                  ?.trackingPrefix ?? "LMBTRACK"
              }
              couriers={activeCouriers.map((c) => c.name)}
              onAssign={(trackingId, courier, advance) => {
                setOrderTracking(o.id, trackingId, courier);
                if (advance && o.status === "ordered") {
                  advanceOrderStatus(o.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

function AssignCard({
  orderId,
  customer,
  city,
  pincode,
  statusLabel,
  defaultCourier,
  defaultPrefix,
  couriers,
  onAssign,
}: {
  orderId: string;
  customer: string;
  city: string;
  pincode: string;
  statusLabel: string;
  defaultCourier: string;
  defaultPrefix: string;
  couriers: string[];
  onAssign: (trackingId: string, courier: string, advance: boolean) => void;
}) {
  const [courier, setCourier] = useState(defaultCourier);
  const [trackingId, setTrackingId] = useState(
    `${defaultPrefix}${orderId.replace(/\D/g, "").slice(-4)}${Math.floor(
      10 + Math.random() * 89,
    )}`,
  );

  return (
    <div className="border border-white/10 bg-background-secondary p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white">{orderId}</p>
          <p className="mt-1 text-sm text-muted">
            {customer} · {city} {pincode} · {statusLabel}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <select
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
          className="cursor-pointer border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          {couriers.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="min-w-[200px] flex-1 border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-gold/50"
        />
        <button
          type="button"
          onClick={() => onAssign(trackingId, courier, false)}
          className="cursor-pointer border border-white/15 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40 hover:text-gold"
        >
          Save tracking
        </button>
        <button
          type="button"
          onClick={() => onAssign(trackingId, courier, true)}
          className="cursor-pointer bg-gold px-3 py-2 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent"
        >
          Save & pack
        </button>
      </div>
    </div>
  );
}
