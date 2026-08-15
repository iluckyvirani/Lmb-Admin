import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_SERVICES,
  slugify,
  type AdminCategory,
  type AdminProduct,
  type AdminService,
  type PublishStatus,
} from "@/data/catalog";

type CatalogContextValue = {
  products: AdminProduct[];
  services: AdminService[];
  categories: AdminCategory[];
  getProduct: (id: string) => AdminProduct | undefined;
  getService: (id: string) => AdminService | undefined;
  saveProduct: (product: Omit<AdminProduct, "id"> & { id?: string }) => string;
  saveService: (service: Omit<AdminService, "id"> & { id?: string }) => string;
  setProductStatus: (id: string, status: PublishStatus) => void;
  setProductFeatured: (id: string, featured: boolean) => void;
  setServiceStatus: (id: string, status: PublishStatus) => void;
  setServiceFeatured: (id: string, featured: boolean) => void;
  toggleCategoryVisible: (id: string) => void;
  addCategory: (input: {
    label: string;
    kind: "product" | "service";
  }) => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>(SEED_PRODUCTS);
  const [services, setServices] = useState<AdminService[]>(SEED_SERVICES);
  const [categories, setCategories] =
    useState<AdminCategory[]>(SEED_CATEGORIES);

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  );
  const getService = useCallback(
    (id: string) => services.find((s) => s.id === id),
    [services],
  );

  const saveProduct: CatalogContextValue["saveProduct"] = useCallback(
    (input) => {
      const id = input.id ?? `p-${Date.now()}`;
      const images =
        input.images?.filter(Boolean).length
          ? input.images.filter(Boolean)
          : input.image
            ? [input.image]
            : [SEED_PRODUCTS[0].image];
      const next: AdminProduct = {
        id,
        title: input.title,
        slug: input.slug || slugify(input.title),
        vendor: input.vendor,
        category: input.category,
        subcategory: input.subcategory ?? "",
        price: Number(input.price) || 0,
        mrp: Number(input.mrp) || 0,
        stock: Number(input.stock) || 0,
        status: input.status,
        featured: input.featured,
        images,
        image: images[0] || SEED_PRODUCTS[0].image,
        description: input.description?.trim() || "",
        tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),
        specs: input.specs ?? {},
        deliveryDaysMin: Number(input.deliveryDaysMin) || 2,
        deliveryDaysMax: Number(input.deliveryDaysMax) || 5,
        codAvailable: input.codAvailable !== false,
        rating: Math.min(5, Math.max(0, Number(input.rating) || 4.5)),
      };
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = next;
          return copy;
        }
        return [next, ...prev];
      });
      return id;
    },
    [],
  );

  const saveService: CatalogContextValue["saveService"] = useCallback(
    (input) => {
      const id = input.id ?? `s-${Date.now()}`;
      const images =
        (input.images?.filter(Boolean).length
          ? input.images.filter(Boolean)
          : input.image
            ? [input.image]
            : [SEED_SERVICES[0].image]) ?? [];
      const next: AdminService = {
        id,
        title: input.title,
        slug: input.slug || slugify(input.title),
        partner: input.partner || "LMB Official Store",
        category: input.category,
        priceFrom: Number(input.priceFrom) || 0,
        durationHours: Number(input.durationHours) || 1,
        bookingLeadDays: Number(input.bookingLeadDays) || 7,
        status: input.status,
        featured: input.featured,
        images,
        image: images[0] || SEED_SERVICES[0].image,
        description: input.description?.trim() || "",
        details: input.details?.trim() || "",
        includes: (input.includes ?? []).map((x) => x.trim()).filter(Boolean),
        locationCoverage: (input.locationCoverage ?? [])
          .map((x) => x.trim())
          .filter(Boolean),
        rating: Math.min(5, Math.max(0, Number(input.rating) || 4.8)),
      };
      setServices((prev) => {
        const idx = prev.findIndex((s) => s.id === id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = next;
          return copy;
        }
        return [next, ...prev];
      });
      return id;
    },
    [],
  );

  const setProductStatus = useCallback((id: string, status: PublishStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p)),
    );
  }, []);

  const setProductFeatured = useCallback((id: string, featured: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured } : p)),
    );
  }, []);

  const setServiceStatus = useCallback((id: string, status: PublishStatus) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  }, []);

  const setServiceFeatured = useCallback((id: string, featured: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, featured } : s)),
    );
  }, []);

  const toggleCategoryVisible = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)),
    );
  }, []);

  const addCategory = useCallback(
    (input: { label: string; kind: "product" | "service" }) => {
      const label = input.label.trim();
      if (!label) return;
      setCategories((prev) => [
        {
          id: `c-${Date.now()}`,
          label,
          slug: slugify(label),
          kind: input.kind,
          visible: true,
          count: 0,
        },
        ...prev,
      ]);
    },
    [],
  );

  const value = useMemo(
    () => ({
      products,
      services,
      categories,
      getProduct,
      getService,
      saveProduct,
      saveService,
      setProductStatus,
      setProductFeatured,
      setServiceStatus,
      setServiceFeatured,
      toggleCategoryVisible,
      addCategory,
    }),
    [
      products,
      services,
      categories,
      getProduct,
      getService,
      saveProduct,
      saveService,
      setProductStatus,
      setProductFeatured,
      setServiceStatus,
      setServiceFeatured,
      toggleCategoryVisible,
      addCategory,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
