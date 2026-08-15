import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import {
  TICKET_STATUS_LABEL,
  type SupportTicket,
  type TicketStatus,
} from "@/data/platform";
import { cn } from "@/lib/cn";

const AGENTS = ["Meera Ops", "Support Riya", "Anika Shah"];

function TicketBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        status === "open" && "border-gold/40 text-gold",
        status === "pending" && "border-sky-500/40 text-sky-400",
        status === "resolved" && "border-emerald-500/40 text-emerald-400",
        status === "closed" && "border-white/20 text-muted",
      )}
    >
      {TICKET_STATUS_LABEL[status]}
    </span>
  );
}

export function SupportPage() {
  const { tickets, setTicketStatus, assignTicket } = usePlatform();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | TicketStatus | "inbox">("inbox");
  const [activeId, setActiveId] = useState<string | null>(null);

  const inboxCount = tickets.filter(
    (t) => t.status === "open" || t.status === "pending",
  ).length;

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (status === "inbox") {
        if (t.status !== "open" && t.status !== "pending") return false;
      } else if (status !== "all" && t.status !== status) {
        return false;
      }
      if (!q.trim()) return true;
      const hay =
        `${t.id} ${t.subject} ${t.customerName} ${t.linkedOrderId ?? ""} ${t.linkedBookingId ?? ""}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [tickets, q, status]);

  const active = tickets.find((t) => t.id === activeId) ?? null;

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Platform
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">Support</h1>
        <p className="mt-2 text-sm text-muted">
          {filtered.length} shown · {inboxCount} need attention
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ticket, customer, order…"
            className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="inbox">Inbox</option>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-background-secondary">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Link</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Assignee</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="cursor-pointer text-left"
                    onClick={() => setActiveId(t.id)}
                  >
                    <span className="block text-white hover:text-gold">
                      {t.id}
                    </span>
                    <span className="text-xs text-muted">{t.subject}</span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className="block">{t.customerName}</span>
                  <span className="text-xs capitalize text-muted">
                    {t.channel.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {t.linkedOrderId ?? t.linkedBookingId ?? "—"}
                </td>
                <td className="px-4 py-3 capitalize">{t.priority}</td>
                <td className="px-4 py-3 text-muted">
                  {t.assignee ?? "Unassigned"}
                </td>
                <td className="px-4 py-3">
                  <TicketBadge status={t.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {t.status === "open" && (
                      <button
                        type="button"
                        onClick={() => setTicketStatus(t.id, "pending")}
                        className="cursor-pointer border border-sky-500/35 px-2 py-1 text-[10px] tracking-wide text-sky-400 uppercase hover:bg-sky-500/10"
                      >
                        Pending
                      </button>
                    )}
                    {(t.status === "open" || t.status === "pending") && (
                      <button
                        type="button"
                        onClick={() => setTicketStatus(t.id, "resolved")}
                        className="cursor-pointer border border-emerald-500/35 px-2 py-1 text-[10px] tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
                      >
                        Resolve
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
        <TicketDrawer
          key={active.id}
          ticket={active}
          onClose={() => setActiveId(null)}
          onStatus={(s) => setTicketStatus(active.id, s)}
          onAssign={(name) => assignTicket(active.id, name)}
        />
      )}
    </>
  );
}

function TicketDrawer({
  ticket,
  onClose,
  onStatus,
  onAssign,
}: {
  ticket: SupportTicket;
  onClose: () => void;
  onStatus: (s: TicketStatus) => void;
  onAssign: (name: string) => void;
}) {
  const [assignee, setAssignee] = useState(ticket.assignee ?? "");

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
              Ticket
            </p>
            <h2 className="mt-1 font-heading text-2xl text-white">
              {ticket.id}
            </h2>
            <div className="mt-2">
              <TicketBadge status={ticket.status} />
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
            <h3 className="text-white">{ticket.subject}</h3>
            <p className="mt-2 text-muted">{ticket.message}</p>
          </section>
          <section>
            <p className="text-xs tracking-wide text-muted uppercase">
              Customer
            </p>
            <p className="mt-1 text-white">{ticket.customerName}</p>
            <p className="text-muted">{ticket.customerPhone}</p>
            <p className="mt-2 text-xs text-muted">
              Linked: {ticket.linkedOrderId ?? ticket.linkedBookingId ?? "—"}
            </p>
          </section>
          <section>
            <p className="mb-2 text-xs tracking-wide text-muted uppercase">
              Assign agent
            </p>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full cursor-pointer border border-white/10 bg-background px-3 py-2 outline-none focus:border-gold/50"
            >
              <option value="">Unassigned</option>
              {AGENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onAssign(assignee)}
              className="mt-2 cursor-pointer border border-white/15 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40 hover:text-gold"
            >
              Save assignee
            </button>
          </section>
          <section>
            <p className="mb-2 text-xs tracking-wide text-muted uppercase">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TICKET_STATUS_LABEL) as TicketStatus[]).map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onStatus(s)}
                    className={cn(
                      "cursor-pointer border px-3 py-2 text-xs tracking-wide uppercase",
                      ticket.status === s
                        ? "border-gold/50 text-gold"
                        : "border-white/15 text-muted hover:border-white/30",
                    )}
                  >
                    {TICKET_STATUS_LABEL[s]}
                  </button>
                ),
              )}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
