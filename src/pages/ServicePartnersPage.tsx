import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { apiRequest } from "@/lib/connect";
import { EmptyState, ErrorBanner } from "@/components/ui/States";
import { cn } from "@/lib/cn";

type PartnerStatus = "pending" | "approved" | "rejected";

type ServicePartner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  experienceYears: number;
  experienceNotes: string;
  bio: string;
  serviceCategories: string[];
  status: PartnerStatus;
  verified: boolean;
  reviewNote: string;
  createdAt: string;
};

export function ServicePartnersPage() {
  const [partners, setPartners] = useState<ServicePartner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | PartnerStatus | "inbox">("inbox");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ partners: ServicePartner[] }>(
        "/admin/service-partners",
      );
      setPartners(res.partners ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load partners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const pendingCount = partners.filter((p) => p.status === "pending").length;

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (status === "inbox" && p.status !== "pending") return false;
      if (status !== "all" && status !== "inbox" && p.status !== status)
        return false;
      if (!q.trim()) return true;
      const hay =
        `${p.name} ${p.email} ${p.phone} ${p.city} ${p.serviceCategories.join(" ")}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [partners, q, status]);

  const active = partners.find((p) => p.id === activeId) ?? null;

  async function setPartnerStatus(id: string, next: PartnerStatus) {
    try {
      const res = await apiRequest<{ partner: ServicePartner }>(
        `/admin/service-partners/${id}`,
        {
          method: "PATCH",
          body: {
            status: next,
            verified: next === "approved",
            reviewNote: note.trim(),
          },
        },
      );
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? res.partner : p)),
      );
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          People · Service partners
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">
          Service partner applications
        </h1>
        <p className="mt-2 text-sm text-muted">
          Manually verify partners for selected service categories. Website
          services stay LMB-branded; you assign booking leads after approval.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, city, category…"
            className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="inbox">Inbox (pending · {pendingCount})</option>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved / verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          type="button"
          onClick={() => void load()}
          className="cursor-pointer border border-white/15 px-3 py-2 text-sm text-muted hover:text-white"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No applications"
          description="Service partners who apply from the website appear here."
        />
      ) : (
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Partner</th>
                <th className="px-4 py-3 font-medium">Services</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Exp.</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <p className="text-white">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.email} · {p.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {(p.serviceCategories ?? []).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {p.city}, {p.pincode}
                  </td>
                  <td className="px-4 py-3 text-muted">{p.experienceYears}y</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} verified={p.verified} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(p.id);
                        setNote(p.reviewNote || "");
                      }}
                      className="cursor-pointer text-xs text-gold hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close"
            onClick={() => setActiveId(null)}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-background-secondary">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
                Application
              </p>
              <h2 className="mt-1 font-heading text-2xl text-white">
                {active.name}
              </h2>
              <StatusBadge status={active.status} verified={active.verified} />
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm">
              <Row label="Contact" value={`${active.email} · ${active.phone}`} />
              <Row
                label="Address"
                value={`${active.addressLine1}${active.addressLine2 ? `, ${active.addressLine2}` : ""}, ${active.city}, ${active.state} ${active.pincode}`}
              />
              <Row
                label="Services"
                value={(active.serviceCategories ?? []).join(", ")}
              />
              <Row
                label="Experience"
                value={`${active.experienceYears} years — ${active.experienceNotes || "—"}`}
              />
              <Row label="Bio" value={active.bio || "—"} />
              <label className="block text-xs text-muted">
                Review note
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-1 w-full border border-white/15 bg-background px-3 py-2 text-sm text-white outline-none focus:border-gold"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/10 px-5 py-4">
              {active.status !== "approved" && (
                <button
                  type="button"
                  onClick={() => void setPartnerStatus(active.id, "approved")}
                  className="cursor-pointer bg-gold px-4 py-2 text-sm font-medium text-background"
                >
                  Verify & approve
                </button>
              )}
              {active.status !== "rejected" && (
                <button
                  type="button"
                  onClick={() => void setPartnerStatus(active.id, "rejected")}
                  className="cursor-pointer border border-red-400/40 px-4 py-2 text-sm text-red-300"
                >
                  Reject
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="cursor-pointer border border-white/15 px-4 py-2 text-sm text-muted"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function StatusBadge({
  status,
  verified,
}: {
  status: PartnerStatus;
  verified: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        status === "pending" && "border-gold/40 text-gold",
        status === "approved" && "border-emerald-500/40 text-emerald-400",
        status === "rejected" && "border-red-500/40 text-red-400",
      )}
    >
      {status}
      {verified ? " · verified" : ""}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-white/90">{value}</p>
    </div>
  );
}
