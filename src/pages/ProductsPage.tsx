import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { formatINR, type PublishStatus } from "@/data/catalog";
import { FeaturedBadge } from "@/components/ui/Badges";
import { cn } from "@/lib/cn";

export function ProductsPage() {
  const {
    products,
    setProductStatus,
    setProductFeatured,
  } = useCatalog();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | PublishStatus>("all");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q.trim()) return true;
      const hay = `${p.title} ${p.vendor} ${p.category}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [products, q, status]);

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function bulkStatus(next: PublishStatus) {
    selected.forEach((id) => setProductStatus(id, next));
    setSelected([]);
  }

  function bulkFeature(featured: boolean) {
    selected.forEach((id) => setProductFeatured(id, featured));
    setSelected([]);
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
            Catalog
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white">Products</h1>
          <p className="mt-2 text-sm text-muted">
            {filtered.length} of {products.length} products
          </p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex cursor-pointer items-center gap-2 bg-gold px-4 py-2.5 text-sm font-medium text-background hover:bg-gold-accent"
        >
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, vendor, category…"
            className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="all">All status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {selected.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 border border-gold/30 bg-gold/10 px-4 py-3 text-sm">
          <span className="text-gold">{selected.length} selected</span>
          <button
            type="button"
            className="cursor-pointer border border-white/15 px-2 py-1 text-xs hover:border-gold/40"
            onClick={() => bulkStatus("published")}
          >
            Publish
          </button>
          <button
            type="button"
            className="cursor-pointer border border-white/15 px-2 py-1 text-xs hover:border-gold/40"
            onClick={() => bulkStatus("draft")}
          >
            Unpublish
          </button>
          <button
            type="button"
            className="cursor-pointer border border-white/15 px-2 py-1 text-xs hover:border-gold/40"
            onClick={() => bulkFeature(true)}
          >
            Feature
          </button>
          <button
            type="button"
            className="cursor-pointer border border-white/15 px-2 py-1 text-xs hover:border-gold/40"
            onClick={() => setSelected([])}
          >
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto border border-white/10 bg-background-secondary">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="cursor-pointer accent-[var(--gold)]"
                  checked={
                    filtered.length > 0 &&
                    filtered.every((p) => selected.includes(p.id))
                  }
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? filtered.map((p) => p.id) : [],
                    )
                  }
                />
              </th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="cursor-pointer accent-[var(--gold)]"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt=""
                      className="h-12 w-12 object-cover border border-white/10"
                    />
                    <div>
                      <p className="text-white">{p.title}</p>
                      <p className="text-xs text-muted">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{p.vendor}</td>
                <td className="px-4 py-3">
                  <span className="text-gold">{formatINR(p.price)}</span>
                  <span className="ml-2 text-xs text-muted line-through">
                    {formatINR(p.mrp)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      p.stock <= 5 ? "text-amber-400" : "text-foreground",
                    )}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={p.status}
                    onChange={(e) =>
                      setProductStatus(p.id, e.target.value as PublishStatus)
                    }
                    className="cursor-pointer border border-white/10 bg-transparent px-2 py-1 text-xs outline-none"
                  >
                    <option value="published">published</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setProductFeatured(p.id, !p.featured)}
                  >
                    <FeaturedBadge featured={p.featured} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/products/${p.id}`}
                    className="text-gold hover:text-gold-accent"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted">
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
