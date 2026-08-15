import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, FileText } from "lucide-react";
import { usePeople } from "@/context/PeopleContext";
import {
  formatINR,
  formatPhone,
  type AdminVendor,
  type VendorStatus,
} from "@/data/people";
import { apiRequest } from "@/lib/connect";
import { cn } from "@/lib/cn";
import { ErrorBanner } from "@/components/ui/States";

type Tab =
  | "overview"
  | "orders"
  | "returns"
  | "payments"
  | "documents"
  | "products";

type VendorDetail = {
  vendor: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    city?: string;
    bio?: string;
    logo?: string;
    status: string;
    verified?: boolean;
    upiId?: string;
    bankAccount?: string;
    idProofUrl?: string;
    productCount?: number;
    createdAt?: string;
  };
  products: {
    id: string;
    title: string;
    price: number;
    stock: number;
    status: string;
    image: string;
    category: string;
  }[];
  orders: {
    shipmentId: string;
    orderId: string;
    createdAt: string;
    customerName: string;
    status: string;
    trackingId?: string;
    courier?: string;
    paymentMethod: string;
    amount: number;
  }[];
  returns: {
    id: string;
    orderId: string;
    productTitle: string;
    customerName: string;
    reason: string;
    amount: number;
    status: string;
    createdAt: string;
  }[];
  payouts: {
    id: string;
    periodLabel: string;
    amount: number;
    ordersCount: number;
    status: string;
    scheduledFor: string;
  }[];
  documents: { type: string; label: string; url: string; required: boolean }[];
  commissionPercent: number;
};

function seedDetail(v: AdminVendor): VendorDetail {
  return {
    vendor: {
      id: v.id,
      name: v.name,
      email: v.email,
      phone: v.phone,
      city: v.city,
      bio: v.bio,
      logo: v.logo,
      status: v.status,
      verified: v.verified,
      productCount: v.productCount,
      createdAt: v.joinedAt,
      idProofUrl: "",
    },
    products: [],
    orders: [],
    returns: [],
    payouts: [],
    documents: [{ type: "id_proof", label: "ID proof", url: "", required: true }],
    commissionPercent: 10,
  };
}

export function VendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVendor, setVendorStatus, setVendorVerified, vendors } =
    usePeople();
  const seed = id ? getVendor(id) : undefined;

  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<VendorDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [idProofUrl, setIdProofUrl] = useState("");
  const [docSaved, setDocSaved] = useState(false);

  function reload() {
    if (!id) return;
    setLoading(true);
    void apiRequest<VendorDetail>(`/admin/vendors/${id}`)
      .then((res) => {
        setData(res);
        setIdProofUrl(res.documents?.[0]?.url || res.vendor.idProofUrl || "");
      })
      .catch((err) => {
        if (seed) {
          setData(seedDetail(seed));
          setError(null);
        } else {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const live = vendors.find((v) => v.id === id);
  const status = (live?.status ?? data?.vendor.status ?? "pending") as VendorStatus;

  const tabs = useMemo(
    () =>
      [
        { id: "overview" as const, label: "Overview" },
        { id: "orders" as const, label: `Orders (${data?.orders.length ?? 0})` },
        {
          id: "returns" as const,
          label: `Returns (${data?.returns.length ?? 0})`,
        },
        {
          id: "payments" as const,
          label: `Payouts (${data?.payouts.length ?? 0})`,
        },
        { id: "documents" as const, label: "Documents" },
        {
          id: "products" as const,
          label: `Products (${data?.products.length ?? 0})`,
        },
      ] as const,
    [data],
  );

  async function saveIdProof() {
    if (!id) return;
    try {
      await apiRequest(`/admin/vendors/${id}`, {
        method: "PATCH",
        body: { idProofUrl: idProofUrl.trim() },
      });
      setDocSaved(true);
      window.setTimeout(() => setDocSaved(false), 2000);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save document");
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-muted">Loading vendor…</p>;
  }

  if (!data) {
    return (
      <div className="py-16 text-center">
        {error && <ErrorBanner message={error} />}
        <p className="mt-4 text-muted">Vendor not found.</p>
        <Link to="/vendors" className="mt-4 inline-block text-gold">
          Back to vendors
        </Link>
      </div>
    );
  }

  const v = data.vendor;
  const orderGross = data.orders.reduce((n, o) => n + o.amount, 0);
  const commissionCut = Math.round(
    (orderGross * (data.commissionPercent || 0)) / 100,
  );

  return (
    <>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/vendors")}
          className="mb-3 inline-flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          All vendors
        </button>
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          People · Product vendor
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            {v.logo ? (
              <img
                src={v.logo}
                alt=""
                className="h-14 w-14 rounded-full border border-gold/40 object-cover"
              />
            ) : null}
            <div>
              <h1 className="flex items-center gap-2 font-heading text-3xl text-white">
                {v.name}
                {v.verified && <BadgeCheck className="h-6 w-6 text-gold" />}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {v.city || "—"}
                {v.email ? ` · ${v.email}` : ""}
                {v.phone ? ` · ${formatPhone(v.phone)}` : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={status} />
            {status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => setVendorStatus(v.id, "approved")}
                  className="cursor-pointer bg-gold px-3 py-1.5 text-xs text-background uppercase"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setVendorStatus(v.id, "rejected")}
                  className="cursor-pointer border border-red-400/40 px-3 py-1.5 text-xs text-red-300 uppercase"
                >
                  Reject
                </button>
              </>
            )}
            {status === "approved" && (
              <button
                type="button"
                onClick={() => setVendorStatus(v.id, "suspended")}
                className="cursor-pointer border border-white/20 px-3 py-1.5 text-xs text-muted uppercase"
              >
                Suspend
              </button>
            )}
            <button
              type="button"
              onClick={() => setVendorVerified(v.id, !v.verified)}
              className="cursor-pointer border border-gold/40 px-3 py-1.5 text-xs text-gold uppercase"
            >
              {v.verified ? "Unverify" : "Verify"}
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

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="border border-white/10 bg-background-secondary p-5 text-sm">
            <p className="text-[11px] tracking-wide text-gold uppercase">
              Profile
            </p>
            <p className="mt-3 text-muted">{v.bio || "No bio yet."}</p>
            <dl className="mt-4 space-y-2">
              <Row label="UPI" value={v.upiId || "—"} />
              <Row label="Bank" value={v.bankAccount || "—"} />
              <Row
                label="Joined"
                value={
                  v.createdAt
                    ? new Date(v.createdAt).toLocaleDateString("en-IN")
                    : "—"
                }
              />
            </dl>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {[
              { label: "Orders", value: String(data.orders.length) },
              { label: "Returns", value: String(data.returns.length) },
              { label: "Payouts", value: String(data.payouts.length) },
              { label: "Products", value: String(data.products.length) },
              {
                label: `GMV (shipments)`,
                value: formatINR(orderGross),
              },
              {
                label: `LMB commission (${data.commissionPercent}%)`,
                value: formatINR(commissionCut),
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
      )}

      {tab === "orders" && <OrdersTable orders={data.orders} />}
      {tab === "returns" && <ReturnsTable returns={data.returns} />}
      {tab === "payments" && <PayoutsTable payouts={data.payouts} />}
      {tab === "products" && <ProductsTable products={data.products} />}

      {tab === "documents" && (
        <div className="max-w-xl border border-white/10 bg-background-secondary p-5">
          <p className="flex items-center gap-2 text-[11px] tracking-wide text-gold uppercase">
            <FileText className="h-4 w-4" /> ID proof (one document)
          </p>
          <p className="mt-2 text-sm text-muted">
            Aadhaar / PAN / business ID — required for vendor verification.
          </p>
          {idProofUrl ? (
            <a
              href={idProofUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block overflow-hidden border border-white/15"
            >
              {/\.(png|jpe?g|webp|gif)(\?|$)/i.test(idProofUrl) ? (
                <img
                  src={idProofUrl}
                  alt="ID proof"
                  className="max-h-72 w-full object-contain bg-black/40"
                />
              ) : (
                <span className="block px-4 py-6 text-sm text-gold underline">
                  Open uploaded document
                </span>
              )}
            </a>
          ) : (
            <p className="mt-4 border border-dashed border-white/15 px-4 py-8 text-center text-sm text-muted">
              No ID proof uploaded yet
            </p>
          )}
          <label className="mt-4 block text-xs text-muted">
            Document URL
            <input
              value={idProofUrl}
              onChange={(e) => setIdProofUrl(e.target.value)}
              className="mt-1 w-full border border-white/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
              placeholder="https://… (Cloudinary or file link)"
            />
          </label>
          <button
            type="button"
            onClick={() => void saveIdProof()}
            className="mt-3 cursor-pointer bg-gold px-4 py-2 text-sm text-background"
          >
            {docSaved ? "Saved" : "Save ID proof"}
          </button>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: VendorStatus }) {
  return (
    <span
      className={cn(
        "border px-2 py-1 text-[10px] tracking-wide uppercase",
        status === "approved" && "border-emerald-500/40 text-emerald-400",
        status === "pending" && "border-gold/40 text-gold",
        status === "rejected" && "border-red-400/40 text-red-400",
        status === "suspended" && "border-amber-400/40 text-amber-400",
      )}
    >
      {status}
    </span>
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

function Empty({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-white/15 px-6 py-14 text-center text-sm text-muted">
      {text}
    </div>
  );
}

function OrdersTable({ orders }: { orders: VendorDetail["orders"] }) {
  if (!orders.length) return <Empty text="No orders for this vendor yet." />;
  return (
    <div className="overflow-x-auto border border-white/10 bg-background-secondary">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Tracking</th>
            <th className="px-4 py-3 font-medium">Pay</th>
            <th className="px-4 py-3 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.shipmentId} className="border-b border-white/5">
              <td className="px-4 py-3">
                <Link to="/orders" className="text-gold hover:underline">
                  {o.orderId}
                </Link>
                <span className="mt-0.5 block text-xs text-muted">
                  {new Date(o.createdAt).toLocaleDateString("en-IN")}
                </span>
              </td>
              <td className="px-4 py-3">{o.customerName}</td>
              <td className="px-4 py-3 capitalize">{o.status}</td>
              <td className="px-4 py-3 text-muted">
                {o.trackingId || "—"}
                {o.courier ? ` · ${o.courier}` : ""}
              </td>
              <td className="px-4 py-3 uppercase">{o.paymentMethod}</td>
              <td className="px-4 py-3 text-gold">{formatINR(o.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReturnsTable({ returns }: { returns: VendorDetail["returns"] }) {
  if (!returns.length) return <Empty text="No returns for this vendor." />;
  return (
    <div className="overflow-x-auto border border-white/10 bg-background-secondary">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Return</th>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((r) => (
            <tr key={r.id} className="border-b border-white/5">
              <td className="px-4 py-3 text-white">{r.id}</td>
              <td className="px-4 py-3">{r.orderId}</td>
              <td className="px-4 py-3">
                <span className="block">{r.productTitle}</span>
                <span className="text-xs text-muted">{r.customerName}</span>
              </td>
              <td className="px-4 py-3 text-muted">{r.reason}</td>
              <td className="px-4 py-3 capitalize">{r.status}</td>
              <td className="px-4 py-3 text-gold">{formatINR(r.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PayoutsTable({ payouts }: { payouts: VendorDetail["payouts"] }) {
  if (!payouts.length) return <Empty text="No payout records yet." />;
  return (
    <div className="overflow-x-auto border border-white/10 bg-background-secondary">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Payout</th>
            <th className="px-4 py-3 font-medium">Period</th>
            <th className="px-4 py-3 font-medium">Orders</th>
            <th className="px-4 py-3 font-medium">Scheduled</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((p) => (
            <tr key={p.id} className="border-b border-white/5">
              <td className="px-4 py-3 text-white">{p.id}</td>
              <td className="px-4 py-3">{p.periodLabel}</td>
              <td className="px-4 py-3">{p.ordersCount}</td>
              <td className="px-4 py-3 text-muted">
                {new Date(p.scheduledFor).toLocaleDateString("en-IN")}
              </td>
              <td className="px-4 py-3 capitalize">{p.status}</td>
              <td className="px-4 py-3 text-gold">{formatINR(p.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsTable({ products }: { products: VendorDetail["products"] }) {
  if (!products.length) return <Empty text="No products listed." />;
  return (
    <div className="overflow-x-auto border border-white/10 bg-background-secondary">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-white/5">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {p.image ? (
                    <img src={p.image} alt="" className="h-10 w-10 object-cover" />
                  ) : null}
                  <span className="text-white">{p.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted">{p.category}</td>
              <td className="px-4 py-3">{p.stock}</td>
              <td className="px-4 py-3 capitalize">{p.status}</td>
              <td className="px-4 py-3 text-gold">{formatINR(p.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
