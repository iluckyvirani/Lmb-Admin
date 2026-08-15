import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCatalog } from "@/context/CatalogContext";
import {
  SERVICE_CATEGORIES,
  slugify,
  type PublishStatus,
} from "@/data/catalog";
import { CloudinaryGalleryField } from "@/components/ui/CloudinaryGalleryField";

const LMB_PARTNER = "LMB Official Store";

const inputClass =
  "mt-1 w-full border border-white/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-gold";

const textareaClass =
  "mt-1 w-full border border-white/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-gold";

function linesToList(text: string) {
  return text
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ServiceFormPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { getService, saveService } = useCatalog();
  const existing = !isNew ? getService(id) : undefined;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<string>(SERVICE_CATEGORIES[0]);
  const [priceFrom, setPriceFrom] = useState("0");
  const [durationHours, setDurationHours] = useState("4");
  const [bookingLeadDays, setBookingLeadDays] = useState("7");
  const [rating, setRating] = useState("4.8");
  const [status, setStatus] = useState<PublishStatus>("draft");
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [includesText, setIncludesText] = useState("");
  const [coverageText, setCoverageText] = useState("Delhi NCR");
  const [images, setImages] = useState<string[]>([]);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSlug(existing.slug);
      setCategory(existing.category);
      setPriceFrom(String(existing.priceFrom));
      setDurationHours(String(existing.durationHours));
      setBookingLeadDays(String(existing.bookingLeadDays));
      setRating(String(existing.rating ?? 4.8));
      setStatus(existing.status);
      setFeatured(existing.featured);
      setDescription(existing.description ?? "");
      setDetails(existing.details ?? "");
      setIncludesText((existing.includes ?? []).join("\n"));
      setCoverageText((existing.locationCoverage ?? []).join(", "));
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
        <p className="text-muted">Service not found.</p>
        <Link to="/services" className="mt-4 inline-block text-gold">
          Back to services
        </Link>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const gallery = images.filter(Boolean);
    const savedId = saveService({
      id: isNew ? undefined : id,
      title: title.trim() || "Untitled service",
      slug: slug || slugify(title),
      partner: LMB_PARTNER,
      category,
      priceFrom: Number(priceFrom),
      durationHours: Number(durationHours),
      bookingLeadDays: Number(bookingLeadDays),
      status,
      featured,
      images: gallery,
      image: gallery[0] ?? "",
      description: description.trim(),
      details: details.trim(),
      includes: linesToList(includesText),
      locationCoverage: linesToList(coverageText),
      rating: Number(rating) || 4.8,
    });
    setSavedMsg("Saved");
    window.setTimeout(() => navigate(`/services/${savedId}`), 400);
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Catalog
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">
          {isNew ? "Add service" : "Edit service"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Match the storefront service page: summary, details, includes,
          coverage, and gallery.
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="block text-sm text-muted">
            Brand
            <p className="mt-1 border border-white/10 bg-background/60 px-3 py-2.5 text-sm text-white">
              {LMB_PARTNER}
            </p>
            <p className="mt-1 text-xs text-muted">
              All services are listed as LMB on the website.
            </p>
          </div>
          <label className="block text-sm text-muted">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm text-muted">
            Price from (₹)
            <input
              type="number"
              min={0}
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm text-muted">
            Duration (hrs)
            <input
              type="number"
              min={1}
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm text-muted">
            Lead days
            <input
              type="number"
              min={1}
              value={bookingLeadDays}
              onChange={(e) => setBookingLeadDays(e.target.value)}
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
          Short description *
          <span className="mt-0.5 block text-xs text-muted/80">
            Shown under the title on the service page
          </span>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={textareaClass}
            placeholder="Elegant wedding bar service with tailored menus…"
          />
        </label>

        <label className="block text-sm text-muted">
          Full details
          <span className="mt-0.5 block text-xs text-muted/80">
            “About this service” section — use blank lines for paragraphs
          </span>
          <textarea
            rows={5}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className={textareaClass}
            placeholder="Longer copy about how the service runs…"
          />
        </label>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm text-muted">
            Includes
            <span className="mt-0.5 block text-xs text-muted/80">
              One item per line (bullets on the website)
            </span>
            <textarea
              rows={5}
              value={includesText}
              onChange={(e) => setIncludesText(e.target.value)}
              className={textareaClass}
              placeholder={"2–4 professional bartenders\nBar setup & glassware\nMenu consultation"}
            />
          </label>
          <label className="block text-sm text-muted">
            Location coverage
            <span className="mt-0.5 block text-xs text-muted/80">
              Cities / regions — comma or line separated
            </span>
            <textarea
              rows={5}
              value={coverageText}
              onChange={(e) => setCoverageText(e.target.value)}
              className={textareaClass}
              placeholder="Delhi NCR, Agra, Jaipur, Chandigarh"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
          <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-[var(--gold)]"
            />
            Featured on storefront
          </label>
        </div>

        <div className="border border-white/10 bg-background/40 p-4">
          <CloudinaryGalleryField
            value={images}
            onChange={setImages}
            folder="lmb/services"
            label="Service gallery"
            max={8}
          />
        </div>

        {savedMsg && <p className="text-sm text-gold">{savedMsg}</p>}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="cursor-pointer bg-gold px-5 py-2.5 text-sm font-medium text-background hover:bg-gold-accent"
          >
            Save service
          </button>
          <Link
            to="/services"
            className="cursor-pointer border border-gold/50 px-5 py-2.5 text-sm text-gold hover:bg-gold/10"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
