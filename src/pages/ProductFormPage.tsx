import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCatalog } from "@/context/CatalogContext";
import {
  PRODUCT_CATEGORIES,
  VENDOR_OPTIONS,
  slugify,
  type PublishStatus,
} from "@/data/catalog";
import { CloudinaryGalleryField } from "@/components/ui/CloudinaryGalleryField";

const inputClass =
  "mt-1 w-full border border-white/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-gold";

const textareaClass = inputClass;

function parseSpecs(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key && value) out[key] = value;
  }
  return out;
}

function specsToText(specs: Record<string, string>) {
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export function ProductFormPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { getProduct, saveProduct } = useCatalog();
  const existing = !isNew ? getProduct(id) : undefined;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [vendor, setVendor] = useState<string>(VENDOR_OPTIONS[0]);
  const [category, setCategory] = useState<string>(PRODUCT_CATEGORIES[0]);
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("0");
  const [mrp, setMrp] = useState("0");
  const [stock, setStock] = useState("0");
  const [rating, setRating] = useState("4.5");
  const [status, setStatus] = useState<PublishStatus>("draft");
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [specsText, setSpecsText] = useState("");
  const [deliveryMin, setDeliveryMin] = useState("2");
  const [deliveryMax, setDeliveryMax] = useState("5");
  const [codAvailable, setCodAvailable] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSlug(existing.slug);
      setVendor(existing.vendor);
      setCategory(existing.category);
      setSubcategory(existing.subcategory ?? "");
      setPrice(String(existing.price));
      setMrp(String(existing.mrp));
      setStock(String(existing.stock));
      setRating(String(existing.rating ?? 4.5));
      setStatus(existing.status);
      setFeatured(existing.featured);
      setDescription(existing.description ?? "");
      setTagsText((existing.tags ?? []).join(", "));
      setSpecsText(specsToText(existing.specs ?? {}));
      setDeliveryMin(String(existing.deliveryDaysMin ?? 2));
      setDeliveryMax(String(existing.deliveryDaysMax ?? 5));
      setCodAvailable(existing.codAvailable !== false);
      setImages(
        existing.images?.length
          ? existing.images
          : existing.image
            ? [existing.image]
            : [],
      );
    }
  }, [existing]);

  if (!isNew && !existing) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-gold">
          Back to products
        </Link>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const gallery = images.filter(Boolean);
    const savedId = saveProduct({
      id: isNew ? undefined : id,
      title: title.trim() || "Untitled product",
      slug: slug || slugify(title),
      vendor,
      category,
      subcategory: subcategory.trim(),
      price: Number(price),
      mrp: Number(mrp),
      stock: Number(stock),
      status,
      featured,
      images: gallery,
      image: gallery[0] ?? "",
      description: description.trim(),
      tags: tagsText
        .split(/,|\n/)
        .map((t) => t.trim())
        .filter(Boolean),
      specs: parseSpecs(specsText),
      deliveryDaysMin: Number(deliveryMin) || 2,
      deliveryDaysMax: Number(deliveryMax) || 5,
      codAvailable,
      rating: Number(rating) || 4.5,
    });
    setSavedMsg("Saved");
    window.setTimeout(() => {
      navigate(`/products/${savedId}`);
    }, 400);
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Catalog
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">
          {isNew ? "Add product" : "Edit product"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Match the storefront product page: gallery, description, specs,
          delivery, and COD.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="max-w-8xl space-y-4 border border-white/10 bg-background-secondary p-6"
      >
        <label className="block text-sm text-muted">
          Title *
          <input
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (isNew) setSlug(slugify(e.target.value));
            }}
            className={inputClass}
          />
        </label>
        <label className="block text-sm text-muted">
          Slug
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm text-muted">
            Vendor
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className={inputClass}
            >
              {VENDOR_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-muted">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-muted">
            Subcategory
            <input
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className={inputClass}
              placeholder="e.g. Coupe"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm text-muted">
            Price (₹)
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm text-muted">
            MRP (₹)
            <input
              type="number"
              min={0}
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm text-muted">
            Stock
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm text-muted">
            Rating (0–5)
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <label className="block text-sm text-muted">
          Description *
          <span className="mt-0.5 block text-xs text-muted/80">
            Shown under price on the product page
          </span>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={textareaClass}
            placeholder="Hand-finished coupe glasses with a thin rim…"
          />
        </label>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm text-muted">
            Specs
            <span className="mt-0.5 block text-xs text-muted/80">
              One per line as Key: Value
            </span>
            <textarea
              rows={5}
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              className={textareaClass}
              placeholder={"Material: Lead-free crystal\nCapacity: 180 ml\nPieces: 6"}
            />
          </label>
          <label className="block text-sm text-muted">
            Tags
            <span className="mt-0.5 block text-xs text-muted/80">
              Comma separated — used in search / filters
            </span>
            <textarea
              rows={5}
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className={textareaClass}
              placeholder="glassware, coupe, set"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm text-muted">
            Delivery min (days)
            <input
              type="number"
              min={1}
              value={deliveryMin}
              onChange={(e) => setDeliveryMin(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm text-muted">
            Delivery max (days)
            <input
              type="number"
              min={1}
              value={deliveryMax}
              onChange={(e) => setDeliveryMax(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm text-muted">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PublishStatus)}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <div className="flex flex-col justify-end gap-2 pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-[var(--gold)]"
              />
              Featured
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={codAvailable}
                onChange={(e) => setCodAvailable(e.target.checked)}
                className="accent-[var(--gold)]"
              />
              COD available
            </label>
          </div>
        </div>

        <div className="border border-white/10 bg-background/40 p-4">
          <CloudinaryGalleryField
            value={images}
            onChange={setImages}
            folder="lmb/products"
            label="Product gallery"
            max={8}
          />
        </div>

        {savedMsg && <p className="text-sm text-gold">{savedMsg}</p>}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="cursor-pointer bg-gold px-5 py-2.5 text-sm font-medium text-background hover:bg-gold-accent"
          >
            Save product
          </button>
          <Link
            to="/products"
            className="cursor-pointer border border-gold/50 px-5 py-2.5 text-sm text-gold hover:bg-gold/10"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
