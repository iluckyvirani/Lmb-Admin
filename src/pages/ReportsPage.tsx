import {
  BOOKING_CONVERSION,
  SALES_BY_CATEGORY,
  TOP_VENDORS,
  formatINR,
} from "@/data/platform";
import { cn } from "@/lib/cn";

export function ReportsPage() {
  const maxSales = Math.max(...SALES_BY_CATEGORY.map((r) => r.revenue));
  const maxVendor = Math.max(...TOP_VENDORS.map((r) => r.revenue));
  const bc = BOOKING_CONVERSION;

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Platform
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">Reports</h1>
        <p className="mt-2 text-sm text-muted">
          Sales by category · top vendors · booking conversion 
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Enquiry → confirm",
            value: `${bc.conversionRate}%`,
          },
          { label: "Enquiries", value: String(bc.enquiries) },
          { label: "Confirmed", value: String(bc.confirmed) },
          { label: "Completed", value: String(bc.completed) },
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

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="border border-white/10 bg-background-secondary p-5">
          <h2 className="text-xs tracking-wide text-muted uppercase">
            Sales by category
          </h2>
          <ul className="mt-4 space-y-3">
            {SALES_BY_CATEGORY.map((row) => (
              <li key={row.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-white">{row.category}</span>
                  <span className="text-gold">{formatINR(row.revenue)}</span>
                </div>
                <div className="h-1.5 bg-white/10">
                  <div
                    className="h-full bg-gold"
                    style={{
                      width: `${Math.round((row.revenue / maxSales) * 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{row.orders} orders</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-white/10 bg-background-secondary p-5">
          <h2 className="text-xs tracking-wide text-muted uppercase">
            Top vendors
          </h2>
          <ul className="mt-4 space-y-3">
            {TOP_VENDORS.map((row, i) => (
              <li key={row.vendorName}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-white">
                    <span className="mr-2 text-muted">#{i + 1}</span>
                    {row.vendorName}
                  </span>
                  <span className="text-gold">{formatINR(row.revenue)}</span>
                </div>
                <div className="h-1.5 bg-white/10">
                  <div
                    className={cn("h-full", i === 0 ? "bg-gold" : "bg-gold/60")}
                    style={{
                      width: `${Math.round((row.revenue / maxVendor) * 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {row.orders} orders · ★ {row.rating}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-white/10 bg-background-secondary p-5 xl:col-span-2">
          <h2 className="text-xs tracking-wide text-muted uppercase">
            Booking funnel
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              { label: "Enquiries", n: bc.enquiries },
              { label: "Confirmed", n: bc.confirmed },
              { label: "Completed", n: bc.completed },
              { label: "Cancelled", n: bc.cancelled },
            ].map((step) => (
              <div
                key={step.label}
                className="border border-white/10 bg-white/[0.02] px-4 py-4 text-center"
              >
                <p className="font-heading text-3xl text-white">{step.n}</p>
                <p className="mt-1 text-xs tracking-wide text-muted uppercase">
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
