import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePeople } from "@/context/PeopleContext";
import { formatINR, formatPhone, type AdminUser } from "@/data/people";
import { apiRequest } from "@/lib/connect";
import { cn } from "@/lib/cn";
import { ErrorBanner } from "@/components/ui/States";

type Tab =
  | "overview"
  | "orders"
  | "addresses"
  | "wishlist"
  | "payments"
  | "enquiries";

type UserDetail = {
  user: {
    id: string;
    name?: string | null;
    phone: string;
    email?: string | null;
    status: string;
    createdAt?: string;
    address?: Record<string, string> | null;
    profile?: Record<string, unknown>;
    ordersCount?: number;
    bookingsCount?: number;
  };
  orders: {
    id: string;
    createdAt: string;
    total: number;
    statusLabel: string;
    paymentMethod: string;
    address: Record<string, string>;
    shipments: {
      vendorName?: string;
      status?: string;
      trackingId?: string;
    }[];
  }[];
  addresses: {
    label: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    source: string;
  }[];
  wishlist: {
    productId: string;
    title: string;
    slug: string;
    price: number;
    image: string;
    stock: number;
    addedAt: string;
  }[];
  payments: {
    id: string;
    refType: string;
    refId: string;
    method: string;
    amount: number;
    status: string;
    createdAt: string;
    note?: string | null;
  }[];
  serviceEnquiries: {
    id: string;
    serviceTitle: string;
    serviceCategory?: string;
    preferredDate: string;
    amount: number;
    status: string;
    statusLabel: string;
    note?: string;
    assignedName?: string;
    createdAt: string;
  }[];
};

function seedDetail(user: AdminUser): UserDetail {
  return {
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      status: user.status,
      createdAt: user.joinDate,
      ordersCount: user.ordersCount,
      bookingsCount: user.bookingsCount,
      address: {
        addressLine1: user.address.line1,
        city: user.address.city,
        state: user.address.state,
        pincode: user.address.pincode,
      },
    },
    orders: user.recentOrders.map((o) => ({
      id: o.id,
      createdAt: o.date,
      total: o.total,
      statusLabel: o.status,
      paymentMethod: "upi",
      address: {},
      shipments: [],
    })),
    addresses: user.address.line1
      ? [
          {
            label: "Profile",
            fullName: user.name,
            phone: user.phone,
            addressLine1: user.address.line1,
            city: user.address.city,
            state: user.address.state,
            pincode: user.address.pincode,
            source: "profile",
          },
        ]
      : [],
    wishlist: [],
    payments: user.recentOrders.map((o) => ({
      id: `PAY-${o.id}`,
      refType: "order",
      refId: o.id,
      method: "upi",
      amount: o.total,
      status: "paid",
      createdAt: o.date,
    })),
    serviceEnquiries: [],
  };
}

export function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUser, setUserStatus, users } = usePeople();
  const seedUser = id ? getUser(id) : undefined;

  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<UserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    void apiRequest<UserDetail>(`/admin/users/${id}`)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (cancelled) return;
        if (seedUser) {
          setData(seedDetail(seedUser));
          setError(null);
        } else {
          setError(err instanceof Error ? err.message : "Failed to load user");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, seedUser]);

  const liveStatus =
    users.find((u) => u.id === id)?.status ??
    (data?.user.status === "blocked" ? "blocked" : "active");

  const displayName =
    data?.user.name || seedUser?.name || data?.user.phone || "Customer";

  const tabs = useMemo(
    () =>
      [
        { id: "overview" as const, label: "Overview" },
        {
          id: "orders" as const,
          label: `Orders (${data?.orders.length ?? 0})`,
        },
        {
          id: "addresses" as const,
          label: `Addresses (${data?.addresses.length ?? 0})`,
        },
        {
          id: "wishlist" as const,
          label: `Wishlist (${data?.wishlist.length ?? 0})`,
        },
        {
          id: "payments" as const,
          label: `Payments (${data?.payments.length ?? 0})`,
        },
        {
          id: "enquiries" as const,
          label: `Service enquiries (${data?.serviceEnquiries.length ?? 0})`,
        },
      ] as const,
    [data],
  );

  if (loading) {
    return <p className="py-16 text-center text-muted">Loading customer…</p>;
  }

  if (!data) {
    return (
      <div className="py-16 text-center">
        {error && <ErrorBanner message={error} />}
        <p className="mt-4 text-muted">Customer not found.</p>
        <Link to="/users" className="mt-4 inline-block text-gold">
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="mb-3 inline-flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          All users
        </button>
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          People · Customer
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl text-white">{displayName}</h1>
            <p className="mt-2 text-sm text-muted">
              {formatPhone(data.user.phone)}
              {data.user.email ? ` · ${data.user.email}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "border px-2 py-1 text-[10px] tracking-wide uppercase",
                liveStatus === "active"
                  ? "border-emerald-500/40 text-emerald-400"
                  : "border-red-400/40 text-red-400",
              )}
            >
              {liveStatus}
            </span>
            <button
              type="button"
              onClick={() =>
                setUserStatus(
                  data.user.id,
                  liveStatus === "active" ? "blocked" : "active",
                )
              }
              className={cn(
                "cursor-pointer px-3 py-1.5 text-xs tracking-wide uppercase",
                liveStatus === "active"
                  ? "border border-red-400/40 text-red-300"
                  : "bg-gold text-background",
              )}
            >
              {liveStatus === "active" ? "Block" : "Unblock"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "cursor-pointer border px-3 py-2 text-xs tracking-wide uppercase",
              tab === t.id
                ? "border-gold/50 text-gold"
                : "border-white/15 text-muted hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewPanel data={data} />}
      {tab === "orders" && <OrdersPanel orders={data.orders} />}
      {tab === "addresses" && <AddressesPanel addresses={data.addresses} />}
      {tab === "wishlist" && <WishlistPanel items={data.wishlist} />}
      {tab === "payments" && <PaymentsPanel payments={data.payments} />}
      {tab === "enquiries" && (
        <EnquiriesPanel enquiries={data.serviceEnquiries} />
      )}
    </>
  );
}

function OverviewPanel({ data }: { data: UserDetail }) {
  const joined = data.user.createdAt
    ? new Date(data.user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";
  const profile = (data.user.profile ?? {}) as Record<string, string>;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="border border-white/10 bg-background-secondary p-5 lg:col-span-1">
        <p className="text-[11px] tracking-wide text-gold uppercase">Profile</p>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Name" value={data.user.name || "—"} />
          <Row label="Phone" value={formatPhone(data.user.phone)} />
          <Row label="Email" value={data.user.email || "—"} />
          <Row label="Joined" value={joined} />
          {profile.gender && <Row label="Gender" value={profile.gender} />}
        </dl>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
        {[
          { label: "Orders", value: String(data.orders.length) },
          { label: "Addresses", value: String(data.addresses.length) },
          { label: "Wishlist items", value: String(data.wishlist.length) },
          {
            label: "Service enquiries",
            value: String(data.serviceEnquiries.length),
          },
          {
            label: "Payments",
            value: formatINR(
              data.payments
                .filter((p) => p.status === "paid")
                .reduce((n, p) => n + p.amount, 0),
            ),
          },
          {
            label: "Pending COD / dues",
            value: formatINR(
              data.payments
                .filter((p) => p.status === "pending")
                .reduce((n, p) => n + p.amount, 0),
            ),
          },
        ].map((k) => (
          <div
            key={k.label}
            className="border border-white/10 bg-background-secondary px-4 py-4"
          >
            <p className="text-[11px] tracking-wide text-muted uppercase">
              {k.label}
            </p>
            <p className="mt-2 font-heading text-2xl text-gold">{k.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersPanel({ orders }: { orders: UserDetail["orders"] }) {
  if (!orders.length) {
    return <Empty title="No orders" hint="Product checkouts will show here." />;
  }
  return (
    <div className="overflow-x-auto border border-white/10 bg-background-secondary">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Vendors</th>
            <th className="px-4 py-3 font-medium">Payment</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-white/5">
              <td className="px-4 py-3">
                <Link to="/orders" className="text-gold hover:underline">
                  {o.id}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">
                {new Date(o.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-muted">
                {o.shipments?.map((s) => s.vendorName).filter(Boolean).join(", ") ||
                  "—"}
              </td>
              <td className="px-4 py-3 uppercase">{o.paymentMethod}</td>
              <td className="px-4 py-3">{o.statusLabel}</td>
              <td className="px-4 py-3 text-gold">{formatINR(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddressesPanel({
  addresses,
}: {
  addresses: UserDetail["addresses"];
}) {
  if (!addresses.length) {
    return (
      <Empty title="No addresses" hint="Saved profile or checkout addresses appear here." />
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {addresses.map((a, i) => (
        <div
          key={`${a.addressLine1}-${i}`}
          className="border border-white/10 bg-background-secondary p-5 text-sm"
        >
          <p className="text-[11px] tracking-wide text-gold uppercase">
            {a.label} · {a.source}
          </p>
          <p className="mt-2 text-white">{a.fullName}</p>
          <p className="mt-1 text-muted">{formatPhone(a.phone)}</p>
          <p className="mt-3 text-foreground/90">
            {a.addressLine1}
            {a.addressLine2 ? `, ${a.addressLine2}` : ""}
            <br />
            {a.city}, {a.state} — {a.pincode}
          </p>
        </div>
      ))}
    </div>
  );
}

function WishlistPanel({ items }: { items: UserDetail["wishlist"] }) {
  if (!items.length) {
    return (
      <Empty title="Wishlist empty" hint="Products the customer saved will show here." />
    );
  }
  return (
    <div className="overflow-x-auto border border-white/10 bg-background-secondary">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Added</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productId} className="border-b border-white/5">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="h-10 w-10 object-cover"
                    />
                  ) : null}
                  <span className="text-white">{item.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gold">{formatINR(item.price)}</td>
              <td className="px-4 py-3">{item.stock}</td>
              <td className="px-4 py-3 text-muted">
                {new Date(item.addedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentsPanel({ payments }: { payments: UserDetail["payments"] }) {
  if (!payments.length) {
    return <Empty title="No payments" hint="Order and booking payments show here." />;
  }
  return (
    <div className="overflow-x-auto border border-white/10 bg-background-secondary">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Payment</th>
            <th className="px-4 py-3 font-medium">Ref</th>
            <th className="px-4 py-3 font-medium">Method</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={`${p.id}-${p.refId}`} className="border-b border-white/5">
              <td className="px-4 py-3 text-white">{p.id}</td>
              <td className="px-4 py-3">
                <span className="text-white">{p.refId}</span>
                <span className="mt-0.5 block text-xs text-muted capitalize">
                  {p.refType}
                </span>
              </td>
              <td className="px-4 py-3 uppercase">{p.method}</td>
              <td className="px-4 py-3 capitalize">{p.status}</td>
              <td className="px-4 py-3 text-gold">{formatINR(p.amount)}</td>
              <td className="px-4 py-3 text-muted">
                {new Date(p.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnquiriesPanel({
  enquiries,
}: {
  enquiries: UserDetail["serviceEnquiries"];
}) {
  if (!enquiries.length) {
    return (
      <Empty
        title="No service enquiries"
        hint="Booking requests from the website services page appear here."
      />
    );
  }
  return (
    <div className="space-y-3">
      {enquiries.map((e) => (
        <div
          key={e.id}
          className="border border-white/10 bg-background-secondary p-4 text-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-wide text-gold uppercase">
                {e.id}
              </p>
              <h3 className="mt-1 font-heading text-xl text-white">
                {e.serviceTitle}
              </h3>
              <p className="mt-1 text-muted">
                {e.serviceCategory?.replace(/-/g, " ") ?? "Service"} · Event{" "}
                {e.preferredDate
                  ? new Date(e.preferredDate).toLocaleDateString("en-IN")
                  : "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gold">{formatINR(e.amount)}</p>
              <p className="mt-1 text-xs capitalize text-muted">
                {e.statusLabel || e.status}
              </p>
            </div>
          </div>
          {e.note && <p className="mt-3 text-muted">Note: {e.note}</p>}
          {e.assignedName && (
            <p className="mt-2 text-xs text-muted">
              Assigned: {e.assignedName}
            </p>
          )}
          <Link
            to="/bookings"
            className="mt-3 inline-block text-xs text-gold hover:underline"
          >
            Open bookings →
          </Link>
        </div>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-white">{value}</dd>
    </div>
  );
}

function Empty({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="border border-dashed border-white/15 px-6 py-14 text-center">
      <p className="text-white">{title}</p>
      <p className="mt-2 text-sm text-muted">{hint}</p>
    </div>
  );
}
