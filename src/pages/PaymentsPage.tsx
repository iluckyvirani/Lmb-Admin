import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useMoneyLogistics } from "@/context/MoneyLogisticsContext";
import {
  PAYMENT_STATUS_LABEL,
  PAYOUT_STATUS_LABEL,
  formatINR,
  type PaymentStatus,
  type PayoutStatus,
} from "@/data/moneyLogistics";
import { cn } from "@/lib/cn";

type Tab = "ledger" | "issues" | "payouts";

function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        status === "paid" && "border-emerald-500/40 text-emerald-400",
        status === "pending" && "border-gold/40 text-gold",
        status === "failed" && "border-red-500/40 text-red-400",
        status === "refunded" && "border-white/25 text-muted",
        status === "partial_refund" && "border-sky-500/40 text-sky-400",
      )}
    >
      {PAYMENT_STATUS_LABEL[status]}
    </span>
  );
}

function PayoutBadge({ status }: { status: PayoutStatus }) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        status === "paid" && "border-emerald-500/40 text-emerald-400",
        status === "processing" && "border-sky-500/40 text-sky-400",
        status === "scheduled" && "border-gold/40 text-gold",
        status === "on_hold" && "border-red-500/40 text-red-400",
      )}
    >
      {PAYOUT_STATUS_LABEL[status]}
    </span>
  );
}

export function PaymentsPage() {
  const { payments, payouts, setPaymentStatus, setPayoutStatus } =
    useMoneyLogistics();
  const [tab, setTab] = useState<Tab>("ledger");
  const [q, setQ] = useState("");
  const [method, setMethod] = useState<"all" | "UPI" | "Card" | "COD">("all");
  const [status, setStatus] = useState<"all" | PaymentStatus>("all");

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (tab === "issues") {
        if (!["failed", "refunded", "partial_refund", "pending"].includes(p.status))
          return false;
      }
      if (method !== "all" && p.method !== method) return false;
      if (status !== "all" && p.status !== status) return false;
      if (!q.trim()) return true;
      const hay =
        `${p.id} ${p.refId} ${p.customerName} ${p.vendorName} ${p.gatewayRef ?? ""}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [payments, tab, method, status, q]);

  const totals = useMemo(() => {
    const paid = payments
      .filter((p) => p.status === "paid" || p.status === "partial_refund")
      .reduce((n, p) => n + p.amount, 0);
    const pending = payments
      .filter((p) => p.status === "pending")
      .reduce((n, p) => n + p.amount, 0);
    const failed = payments.filter((p) => p.status === "failed").length;
    const payoutDue = payouts
      .filter((p) => p.status !== "paid")
      .reduce((n, p) => n + p.amount, 0);
    return { paid, pending, failed, payoutDue };
  }, [payments, payouts]);

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Money & logistics
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">
          Payments history
        </h1>
        <p className="mt-2 text-sm text-muted">
          Orders & booking advances · UPI / Card / COD
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Captured", value: formatINR(totals.paid) },
          { label: "Pending", value: formatINR(totals.pending) },
          { label: "Failed", value: String(totals.failed) },
          { label: "Payouts due", value: formatINR(totals.payoutDue) },
        ].map((k) => (
          <div
            key={k.label}
            className="border border-white/10 bg-background-secondary px-4 py-3"
          >
            <p className="text-[11px] tracking-wide text-muted uppercase">
              {k.label}
            </p>
            <p className="mt-1 font-heading text-2xl text-gold">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["ledger", "Ledger"],
            ["issues", "Refunds & failed"],
            ["payouts", "Vendor payouts"],
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

      {tab !== "payouts" && (
        <>
          <div className="mb-4 flex flex-wrap gap-3">
            <label className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search payment, order, booking…"
                className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
              />
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as typeof method)}
              className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
            >
              <option value="all">All methods</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="COD">COD</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
            >
              <option value="all">All status</option>
              {(Object.keys(PAYMENT_STATUS_LABEL) as PaymentStatus[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {PAYMENT_STATUS_LABEL[s]}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="overflow-x-auto border border-white/10 bg-background-secondary">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Ref</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Vendor</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-sm text-muted"
                    >
                      No payments yet. New checkout orders appear here
                      automatically.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <span className="text-white">{p.id}</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {new Date(p.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white">{p.refId}</span>
                      <span className="mt-0.5 block text-xs text-muted capitalize">
                        {p.refType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.customerName}</td>
                    <td className="px-4 py-3 text-muted">{p.vendorName}</td>
                    <td className="px-4 py-3">{p.method}</td>
                    <td className="px-4 py-3 text-gold">
                      {formatINR(p.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge status={p.status} />
                      {p.note && (
                        <p className="mt-1 max-w-[180px] text-xs text-muted">
                          {p.note}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {p.status === "paid" && (
                          <button
                            type="button"
                            onClick={() =>
                              setPaymentStatus(
                                p.id,
                                "refunded",
                                "Full refund issued",
                              )
                            }
                            className="cursor-pointer border border-red-500/30 px-2 py-1 text-[10px] tracking-wide text-red-400 uppercase hover:bg-red-500/10"
                          >
                            Refund
                          </button>
                        )}
                        {p.status === "failed" && (
                          <button
                            type="button"
                            onClick={() =>
                              setPaymentStatus(p.id, "paid", "Retried & paid")
                            }
                            className="cursor-pointer border border-emerald-500/35 px-2 py-1 text-[10px] tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
                          >
                            Mark paid
                          </button>
                        )}
                        {p.status === "pending" && p.method === "COD" && (
                          <button
                            type="button"
                            onClick={() =>
                              setPaymentStatus(p.id, "paid", "COD collected")
                            }
                            className="cursor-pointer border border-emerald-500/35 px-2 py-1 text-[10px] tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
                          >
                            COD collected
                          </button>
                        )}
                        {p.status === "pending" && p.method !== "COD" && (
                          <button
                            type="button"
                            onClick={() =>
                              setPaymentStatus(p.id, "failed", "Payment timed out")
                            }
                            className="cursor-pointer border border-red-500/30 px-2 py-1 text-[10px] tracking-wide text-red-400 uppercase hover:bg-red-500/10"
                          >
                            Mark failed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "payouts" && (
        <div className="overflow-x-auto border border-white/10 bg-background-secondary">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Payout</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Scheduled</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((po) => (
                <tr
                  key={po.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 text-white">{po.id}</td>
                  <td className="px-4 py-3">{po.vendorName}</td>
                  <td className="px-4 py-3 text-muted">{po.periodLabel}</td>
                  <td className="px-4 py-3">{po.ordersCount}</td>
                  <td className="px-4 py-3 text-gold">
                    {formatINR(po.amount)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(po.scheduledFor).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <PayoutBadge status={po.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {po.status === "scheduled" && (
                        <button
                          type="button"
                          onClick={() => setPayoutStatus(po.id, "processing")}
                          className="cursor-pointer border border-sky-500/35 px-2 py-1 text-[10px] tracking-wide text-sky-400 uppercase hover:bg-sky-500/10"
                        >
                          Process
                        </button>
                      )}
                      {po.status === "processing" && (
                        <button
                          type="button"
                          onClick={() => setPayoutStatus(po.id, "paid")}
                          className="cursor-pointer border border-emerald-500/35 px-2 py-1 text-[10px] tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
                        >
                          Mark paid
                        </button>
                      )}
                      {po.status !== "on_hold" && po.status !== "paid" && (
                        <button
                          type="button"
                          onClick={() => setPayoutStatus(po.id, "on_hold")}
                          className="cursor-pointer border border-red-500/30 px-2 py-1 text-[10px] tracking-wide text-red-400 uppercase hover:bg-red-500/10"
                        >
                          Hold
                        </button>
                      )}
                      {po.status === "on_hold" && (
                        <button
                          type="button"
                          onClick={() => setPayoutStatus(po.id, "scheduled")}
                          className="cursor-pointer border border-gold/40 px-2 py-1 text-[10px] tracking-wide text-gold uppercase hover:bg-gold/10"
                        >
                          Release
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
