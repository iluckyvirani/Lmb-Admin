import { Link } from "react-router-dom";
import {
  Package,
  ConciergeBell,
  ShoppingBag,
  CalendarCheck,
  Store,
  Users,
  Truck,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  ACTIVITY_FEED,
  DASHBOARD_KPIS,
  LOW_STOCK,
  RECENT_BOOKINGS,
  RECENT_ORDERS,
  WEEKLY_REVENUE,
  formatINR,
} from "@/data/mock";
import { cn } from "@/lib/cn";

const QUICK = [
  { to: "/products", label: "Add / manage products", icon: Package },
  { to: "/vendors", label: "Approve vendors", icon: Store },
  { to: "/orders/upcoming", label: "Upcoming shipments", icon: Truck },
  { to: "/bookings", label: "Booking requests", icon: CalendarCheck },
  { to: "/payments", label: "View payments", icon: CreditCard },
  { to: "/users", label: "Customers", icon: Users },
];

function statusClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes("deliver") || s.includes("completed") || s.includes("confirm"))
    return "border-emerald-500/40 text-emerald-400";
  if (s.includes("pending") || s.includes("ordered"))
    return "border-gold/40 text-gold";
  if (s.includes("cancel")) return "border-red-400/40 text-red-400";
  return "border-white/20 text-muted";
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardPage() {
  const k = DASHBOARD_KPIS;
  const maxWeek = Math.max(...WEEKLY_REVENUE.map((d) => d.amount));

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
            Overview
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            LMB Bar Market ops — products, bookings, partners, and shipping at a
            glance.
          </p>
        </div>
        <p className="flex items-center gap-2 text-xs text-muted">
          <Clock className="h-3.5 w-3.5 text-gold" />
          {new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Revenue strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Revenue today", value: k.revenueToday, icon: TrendingUp },
          { label: "This week", value: k.revenueWeek, icon: TrendingUp },
          { label: "This month", value: k.revenueMonth, icon: TrendingUp },
        ].map((card) => (
          <div
            key={card.label}
            className="border border-white/10 bg-background-secondary p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-wide text-muted uppercase">
                {card.label}
              </p>
              <card.icon className="h-4 w-4 text-gold" strokeWidth={1.5} />
            </div>
            <p className="mt-3 font-heading text-3xl text-gold">
              {formatINR(card.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Ops KPIs */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Orders"
          value={String(k.ordersCount)}
          hint={`${k.upcomingShipments} upcoming shipments`}
          to="/orders"
        />
        <Kpi
          label="Bookings"
          value={String(k.bookingsCount)}
          hint={`${k.pendingBookings} pending requests`}
          to="/bookings"
        />
        <Kpi
          label="Vendors"
          value={String(k.vendorsCount)}
          hint={`${k.pendingVendors} awaiting approval`}
          to="/vendors"
        />
        <Kpi
          label="Customers"
          value={String(k.customersCount)}
          hint="Active buyer accounts"
          to="/users"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border border-white/10 bg-background-secondary p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl text-white">Weekly revenue</h2>
            <Link to="/reports" className="text-xs text-gold hover:text-gold-accent">
              Reports →
            </Link>
          </div>
          <div className="mt-5 flex items-end gap-2 sm:gap-3">
            {WEEKLY_REVENUE.map((d) => {
              const barH = Math.max(12, Math.round((d.amount / maxWeek) * 112));
              return (
                <div
                  key={d.day}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                >
                  <span className="text-[10px] leading-none tabular-nums text-muted">
                    {formatINR(d.amount)}
                  </span>
                  <div
                    className="w-full max-w-10 rounded-t-sm bg-[#c9a227] transition-opacity hover:opacity-90"
                    style={{ height: barH }}
                    title={formatINR(d.amount)}
                  />
                  <span className="text-xs leading-none text-muted">{d.day}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border border-white/10 bg-background-secondary p-5">
          <h2 className="font-heading text-xl text-white">Activity</h2>
          <ul className="mt-4 space-y-3">
            {ACTIVITY_FEED.map((a) => (
              <li key={a.id} className="flex gap-3 text-sm">
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    a.tone === "gold" && "bg-gold",
                    a.tone === "alert" && "bg-amber-400",
                    a.tone === "muted" && "bg-white/30",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="text-foreground/90">{a.text}</span>
                  <span className="mt-0.5 block text-xs text-muted">{a.time}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 border border-amber-500/30 bg-amber-500/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h2 className="font-heading text-lg text-white">Low stock</h2>
          </div>
          <Link
            to="/products"
            className="text-xs text-gold hover:text-gold-accent"
          >
            Manage products →
          </Link>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LOW_STOCK.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 border border-amber-500/20 bg-background/40 px-3 py-3 text-sm"
            >
              <span className="min-w-0">
                <span className="block truncate text-foreground">{item.title}</span>
                <span className="text-xs text-muted">
                  {item.vendor} · {item.sku}
                </span>
              </span>
              <span className="shrink-0 border border-amber-400/40 px-2 py-0.5 text-xs text-amber-400">
                {item.stock} left
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick actions */}
      <h2 className="mt-10 font-heading text-xl text-white">Quick actions</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex cursor-pointer items-center gap-3 border border-white/10 bg-white/[0.02] px-4 py-4 transition-colors hover:border-gold/40"
          >
            <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <span className="text-sm text-foreground">{label}</span>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <section className="mt-10 border border-white/10 bg-background-secondary">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-gold" />
            <h2 className="font-heading text-xl text-white">Recent orders</h2>
          </div>
          <Link to="/orders" className="text-xs text-gold hover:text-gold-accent">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Vendor</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3 font-medium text-gold">{o.id}</td>
                  <td className="px-5 py-3">{o.customer}</td>
                  <td className="px-5 py-3 text-muted">{o.vendor}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
                        statusClass(o.status),
                      )}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">{formatINR(o.total)}</td>
                  <td className="px-5 py-3 text-muted">{formatWhen(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent bookings */}
      <section className="mt-6 border border-white/10 bg-background-secondary">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ConciergeBell className="h-4 w-4 text-gold" />
            <h2 className="font-heading text-xl text-white">Recent bookings</h2>
          </div>
          <Link
            to="/bookings"
            className="text-xs text-gold hover:text-gold-accent"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Booking</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Partner</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">From</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3 font-medium text-gold">{b.id}</td>
                  <td className="px-5 py-3">
                    <span className="block">{b.service}</span>
                    <span className="text-xs text-muted">
                      {b.customer} · {b.guests} guests
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{b.partner}</td>
                  <td className="px-5 py-3">
                    {new Date(b.eventDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-block border px-2 py-0.5 text-[10px] tracking-wide uppercase",
                        statusClass(b.status),
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">{formatINR(b.priceFrom)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Kpi({
  label,
  value,
  hint,
  to,
}: {
  label: string;
  value: string;
  hint: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="block cursor-pointer border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-gold/40"
    >
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 font-heading text-3xl text-white">{value}</p>
      <p className="mt-1 text-xs text-gold">{hint}</p>
    </Link>
  );
}
