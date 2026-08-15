import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, Search } from "lucide-react";
import { usePeople } from "@/context/PeopleContext";
import { type VendorStatus } from "@/data/people";
import { cn } from "@/lib/cn";

export function VendorsPage() {
  const navigate = useNavigate();
  const { vendors, setVendorStatus } = usePeople();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | VendorStatus | "queue">("all");

  const pendingCount = vendors.filter((v) => v.status === "pending").length;

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (status === "queue" && v.status !== "pending") return false;
      if (status !== "all" && status !== "queue" && v.status !== status)
        return false;
      if (!q.trim()) return true;
      const hay = `${v.name} ${v.city} ${v.email}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [vendors, q, status]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
            People
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white">
            Product vendors
          </h1>
          <p className="mt-2 text-sm text-muted">
            {filtered.length} shown · {pendingCount} awaiting approval · open a
            vendor for orders, returns, payouts & ID proof
          </p>
        </div>
        {pendingCount > 0 && (
          <button
            type="button"
            onClick={() => setStatus("queue")}
            className="cursor-pointer border border-gold/40 bg-gold/10 px-4 py-2 text-sm text-gold hover:bg-gold/20"
          >
            Approval queue ({pendingCount})
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, city, email…"
            className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="all">All status</option>
          <option value="queue">Pending queue</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-background-secondary">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Listings</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr
                key={v.id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-3 text-left"
                    onClick={() => navigate(`/vendors/${v.id}`)}
                  >
                    <img
                      src={v.logo}
                      alt=""
                      className="h-10 w-10 rounded-full border border-gold/30 object-cover"
                    />
                    <span>
                      <span className="flex items-center gap-1.5 text-white hover:text-gold">
                        {v.name}
                        {v.verified && (
                          <BadgeCheck className="h-3.5 w-3.5 text-gold" />
                        )}
                      </span>
                      <span className="text-xs text-muted">{v.email}</span>
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 text-muted">{v.city}</td>
                <td className="px-4 py-3">
                  {v.productCount} products
                  {v.serviceCount ? ` · ${v.serviceCount} svc` : ""}
                </td>
                <td className="px-4 py-3">★ {v.rating}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "border px-2 py-0.5 text-[10px] tracking-wide uppercase",
                      v.status === "approved" &&
                        "border-emerald-500/40 text-emerald-400",
                      v.status === "pending" && "border-gold/40 text-gold",
                      v.status === "rejected" &&
                        "border-red-400/40 text-red-400",
                      v.status === "suspended" &&
                        "border-amber-400/40 text-amber-400",
                    )}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/vendors/${v.id}`}
                      className="text-gold hover:text-gold-accent"
                    >
                      View
                    </Link>
                    {v.status === "pending" && (
                      <>
                        <button
                          type="button"
                          className="cursor-pointer text-emerald-400 hover:underline"
                          onClick={() => setVendorStatus(v.id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer text-red-400 hover:underline"
                          onClick={() => setVendorStatus(v.id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  No vendors match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
