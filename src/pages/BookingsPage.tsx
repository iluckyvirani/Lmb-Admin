import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useCommerceOps } from "@/context/CommerceOpsContext";
import {
  BOOKING_STATUS_LABEL,
  formatINR,
  formatPhone,
  type AdminBooking,
  type BookingStatus,
} from "@/data/commerceOps";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { apiRequest } from "@/lib/connect";

type ApprovedPartner = {
  id: string;
  name: string;
  city: string;
  serviceCategories: string[];
  status: string;
  verified: boolean;
};

function BookingBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
        status === "pending" && "border-gold/40 text-gold",
        status === "info_requested" && "border-sky-500/40 text-sky-400",
        status === "confirmed" && "border-emerald-500/40 text-emerald-400",
        status === "completed" && "border-white/25 text-muted",
        status === "cancelled" && "border-red-500/40 text-red-400",
      )}
    >
      {BOOKING_STATUS_LABEL[status]}
    </span>
  );
}

export function BookingsPage() {
  const { bookings, setBookingStatus, setBookingNote, assignBooking } =
    useCommerceOps();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | BookingStatus | "inbox">("inbox");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [partners, setPartners] = useState<ApprovedPartner[]>([]);

  useEffect(() => {
    void apiRequest<{ partners: ApprovedPartner[] }>(
      "/admin/service-partners?status=approved",
    )
      .then((res) =>
        setPartners(
          (res.partners ?? []).filter((p) => p.verified || p.status === "approved"),
        ),
      )
      .catch(() => setPartners([]));
  }, []);

  const inboxCount = bookings.filter(
    (b) => b.status === "pending" || b.status === "info_requested",
  ).length;

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (status === "inbox") {
        if (b.status !== "pending" && b.status !== "info_requested")
          return false;
      } else if (status !== "all" && b.status !== status) {
        return false;
      }
      if (!q.trim()) return true;
      const hay =
        `${b.id} ${b.serviceTitle} ${b.customerName} ${b.assignedName} ${b.city}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [bookings, q, status]);

  const active = bookings.find((b) => b.id === activeId) ?? null;

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Commerce ops
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">
          Service bookings
        </h1>
        <p className="mt-2 text-sm text-muted">
          Leads stay LMB-branded on the website. Assign fulfillment to LMB self
          or a verified service partner.
        </p>
        <p className="mt-1 text-sm text-muted">
          {filtered.length} shown · {inboxCount} need attention
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search booking, service, customer…"
            className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="inbox">Inbox (pending / info)</option>
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="info_requested">Info requested</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No bookings match"
          description="Switch to All status or clear search."
        />
      ) : (
        <div className="overflow-x-auto border border-white/10 bg-background-secondary">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Booking</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Assigned to</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Guests</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="cursor-pointer text-left text-white hover:text-gold"
                      onClick={() => setActiveId(b.id)}
                    >
                      {b.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-white">{b.serviceTitle}</td>
                  <td className="px-4 py-3">
                    <span className="block">{b.customerName}</span>
                    <span className="text-xs text-muted">{b.city}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {b.assignedName || "LMB (self)"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(b.eventDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">{b.guests}</td>
                  <td className="px-4 py-3 text-gold">{formatINR(b.amount)}</td>
                  <td className="px-4 py-3">
                    <BookingBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(b.status === "pending" ||
                        b.status === "info_requested") && (
                        <button
                          type="button"
                          onClick={() => setBookingStatus(b.id, "confirmed")}
                          className="cursor-pointer border border-emerald-500/35 px-2 py-1 text-[10px] tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status === "pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            setBookingStatus(b.id, "info_requested")
                          }
                          className="cursor-pointer border border-sky-500/35 px-2 py-1 text-[10px] tracking-wide text-sky-400 uppercase hover:bg-sky-500/10"
                        >
                          Request info
                        </button>
                      )}
                      {b.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => setBookingStatus(b.id, "completed")}
                          className="cursor-pointer border border-white/20 px-2 py-1 text-[10px] tracking-wide uppercase hover:border-gold/40 hover:text-gold"
                        >
                          Complete
                        </button>
                      )}
                      {b.status !== "cancelled" &&
                        b.status !== "completed" && (
                          <button
                            type="button"
                            onClick={() => setBookingStatus(b.id, "cancelled")}
                            className="cursor-pointer border border-red-500/30 px-2 py-1 text-[10px] tracking-wide text-red-400 uppercase hover:bg-red-500/10"
                          >
                            Cancel
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

      {active && (
        <BookingDrawer
          key={active.id}
          booking={active}
          partners={partners}
          onClose={() => setActiveId(null)}
          onStatus={(s) => setBookingStatus(active.id, s)}
          onSaveNote={(note) => setBookingNote(active.id, note)}
          onAssign={(to, name) => assignBooking(active.id, to, name)}
        />
      )}
    </>
  );
}

function BookingDrawer({
  booking,
  partners,
  onClose,
  onStatus,
  onSaveNote,
  onAssign,
}: {
  booking: AdminBooking;
  partners: ApprovedPartner[];
  onClose: () => void;
  onStatus: (s: BookingStatus) => void;
  onSaveNote: (note: string) => void;
  onAssign: (assignedTo: string, assignedName: string) => void;
}) {
  const [note, setNote] = useState(booking.adminNote ?? "");
  const [assignValue, setAssignValue] = useState(
    booking.assignedTo || "lmb",
  );

  function applyAssign() {
    if (assignValue === "lmb") {
      onAssign("lmb", "LMB (self)");
      return;
    }
    const partner = partners.find((p) => p.id === assignValue);
    onAssign(assignValue, partner?.name ?? "Service partner");
  }

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
              Booking detail
            </p>
            <h2 className="mt-1 font-heading text-2xl text-white">
              {booking.id}
            </h2>
            <div className="mt-2">
              <BookingBadge status={booking.status} />
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
            <h3 className="mb-1 text-xs tracking-wide text-muted uppercase">
              Service (LMB catalog)
            </h3>
            <p className="text-white">{booking.serviceTitle}</p>
            <p className="text-muted">{booking.partnerName}</p>
            <p className="mt-2 text-gold">{formatINR(booking.amount)}</p>
          </section>

          <section>
            <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">
              Assign fulfillment
            </h3>
            <p className="mb-2 text-xs text-muted">
              Current: {booking.assignedName || "LMB (self)"}
            </p>
            <select
              value={assignValue}
              onChange={(e) => setAssignValue(e.target.value)}
              className="w-full cursor-pointer border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-gold/50"
            >
              <option value="lmb">LMB (self / in-house)</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.city}
                  {p.serviceCategories?.length
                    ? ` · ${p.serviceCategories.join(", ")}`
                    : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={applyAssign}
              className="mt-2 cursor-pointer bg-gold px-3 py-2 text-xs tracking-wide text-background uppercase"
            >
              Save assignment
            </button>
            {partners.length === 0 && (
              <p className="mt-2 text-xs text-muted">
                No verified partners yet — approve applications under Service
                partners.
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-1 text-xs tracking-wide text-muted uppercase">
              Customer
            </h3>
            <p className="text-white">{booking.customerName}</p>
            <p className="text-muted">{formatPhone(booking.customerPhone)}</p>
          </section>

          <section>
            <h3 className="mb-1 text-xs tracking-wide text-muted uppercase">
              Event
            </h3>
            <p className="text-white">
              {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-muted">
              {booking.guests} guests · {booking.city}
              {booking.venue ? ` · ${booking.venue}` : ""}
            </p>
          </section>

          <section>
            <h3 className="mb-1 text-xs tracking-wide text-muted uppercase">
              Enquiry message
            </h3>
            <p className="border border-white/10 bg-white/[0.02] p-3 text-muted">
              {booking.message}
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">
              Actions
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onStatus("confirmed")}
                className="cursor-pointer border border-emerald-500/35 px-3 py-2 text-xs tracking-wide text-emerald-400 uppercase hover:bg-emerald-500/10"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => onStatus("info_requested")}
                className="cursor-pointer border border-sky-500/35 px-3 py-2 text-xs tracking-wide text-sky-400 uppercase hover:bg-sky-500/10"
              >
                Request info
              </button>
              <button
                type="button"
                onClick={() => onStatus("completed")}
                className="cursor-pointer border border-white/20 px-3 py-2 text-xs tracking-wide uppercase hover:border-gold/40"
              >
                Complete
              </button>
              <button
                type="button"
                onClick={() => onStatus("cancelled")}
                className="cursor-pointer border border-red-500/30 px-3 py-2 text-xs tracking-wide text-red-400 uppercase hover:bg-red-500/10"
              >
                Cancel
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">
              Admin note
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
              placeholder="Partner assignment, follow-ups…"
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
