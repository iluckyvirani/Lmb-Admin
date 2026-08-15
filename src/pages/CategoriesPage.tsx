import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { cn } from "@/lib/cn";

export function CategoriesPage() {
  const { categories, toggleCategoryVisible, addCategory } = useCatalog();
  const [tab, setTab] = useState<"product" | "service">("product");
  const [label, setLabel] = useState("");

  const list = useMemo(
    () => categories.filter((c) => c.kind === tab),
    [categories, tab],
  );

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    addCategory({ label: label.trim(), kind: tab });
    setLabel("");
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Catalog
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">Categories</h1>
        <p className="mt-2 text-sm text-muted">
          Product and service category trees for the storefront.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["product", "Product categories"],
            ["service", "Service categories"],
          ] as const
        ).map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "cursor-pointer border px-4 py-2 text-sm transition-colors",
              tab === id
                ? "border-gold text-gold"
                : "border-white/15 text-muted hover:border-gold/40",
            )}
          >
            {text}
          </button>
        ))}
      </div>

      <form
        onSubmit={onAdd}
        className="mb-6 flex flex-wrap gap-3 border border-white/10 bg-background-secondary p-4"
      >
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={`New ${tab} category name`}
          className="min-w-[200px] flex-1 border border-white/15 bg-background px-3 py-2 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 bg-gold px-4 py-2 text-sm font-medium text-background hover:bg-gold-accent"
        >
          <Plus className="h-4 w-4" />
          Add category
        </button>
      </form>

      <div className="overflow-x-auto border border-white/10 bg-background-secondary">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Label</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Listings</th>
              <th className="px-4 py-3 font-medium">Visible</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr
                key={c.id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 text-white">{c.label}</td>
                <td className="px-4 py-3 text-muted">{c.slug}</td>
                <td className="px-4 py-3">{c.count}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "text-xs uppercase tracking-wide",
                      c.visible ? "text-emerald-400" : "text-muted",
                    )}
                  >
                    {c.visible ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleCategoryVisible(c.id)}
                    className="cursor-pointer text-gold hover:text-gold-accent"
                  >
                    {c.visible ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
