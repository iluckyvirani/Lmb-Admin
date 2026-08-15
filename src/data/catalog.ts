/** Catalog mock data — products, services, categories */

export type PublishStatus = "published" | "draft" | "archived";

export type AdminProduct = {
  id: string;
  title: string;
  slug: string;
  vendor: string;
  category: string;
  subcategory: string;
  price: number;
  mrp: number;
  stock: number;
  status: PublishStatus;
  featured: boolean;
  /** Cover / list thumbnail */
  image: string;
  /** Storefront gallery (first = cover) */
  images: string[];
  description: string;
  tags: string[];
  /** Spec key → value shown on product page */
  specs: Record<string, string>;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  codAvailable: boolean;
  rating: number;
};

export type AdminService = {
  id: string;
  title: string;
  slug: string;
  partner: string;
  category: string;
  priceFrom: number;
  durationHours: number;
  bookingLeadDays: number;
  status: PublishStatus;
  featured: boolean;
  /** Cover / list thumbnail (first gallery image) */
  image: string;
  /** Full storefront gallery (first = cover) */
  images: string[];
  /** Short summary under title on storefront */
  description: string;
  /** Longer “About this service” copy */
  details: string;
  /** What’s included — shown as bullets */
  includes: string[];
  /** Cities / regions covered */
  locationCoverage: string[];
  rating: number;
};

export type AdminCategory = {
  id: string;
  label: string;
  slug: string;
  kind: "product" | "service";
  parent?: string;
  visible: boolean;
  count: number;
};

export const PRODUCT_CATEGORIES = [
  "Glassware",
  "Cocktail Sets",
  "Bar Kits",
  "Mixing Tools",
  "Molecular",
  "Ice & Prep",
  "Apparel",
] as const;

export const SERVICE_CATEGORIES = [
  "Wedding",
  "Kitty Party",
  "Birthday",
  "Catering",
  "DJ Booking",
  "Molecular Bar",
  "Bartending",
  "Corporate",
  "Workshops",
] as const;

export const VENDOR_OPTIONS = [
  "LMB Official Store",
  "Crystal Pour Supplies",
  "ShakeCraft Tools",
  "Event Pour Co.",
] as const;

type SeedProductRow = {
  id: string;
  title: string;
  slug: string;
  vendor: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  status: PublishStatus;
  featured: boolean;
  image: string;
  description?: string;
  subcategory?: string;
  tags?: string[];
  specs?: Record<string, string>;
};

const SEED_PRODUCTS_BASE: SeedProductRow[] = [
  {
    id: "p1",
    title: "Crystal Coupe Set (6)",
    slug: "crystal-coupe-set-6",
    vendor: "Crystal Pour Supplies",
    category: "Glassware",
    price: 3499,
    mrp: 4499,
    stock: 42,
    status: "published",
    featured: true,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    description:
      "Hand-finished coupe glasses with a thin rim — ideal for champagne cocktails and classic sours.",
    tags: ["glassware", "coupe", "set"],
    specs: { Material: "Lead-free crystal", Capacity: "180 ml", Pieces: "6" },
  },
  {
    id: "p2",
    title: "Ultimate Bar Kit Pro",
    slug: "ultimate-bar-kit-pro",
    vendor: "LMB Official Store",
    category: "Bar Kits",
    price: 14999,
    mrp: 18999,
    stock: 5,
    status: "published",
    featured: true,
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80",
    description: "Complete pro bar kit for home and pop-up service.",
    tags: ["kit", "pro"],
    specs: { Pieces: "18+", Case: "Hard shell" },
  },
  {
    id: "p3",
    title: "Boston Shaker Tin Set",
    slug: "boston-shaker-tin-set",
    vendor: "ShakeCraft Tools",
    category: "Mixing Tools",
    price: 1499,
    mrp: 1999,
    stock: 80,
    status: "published",
    featured: false,
    image: "https://images.unsplash.com/photo-1470337458703-46ad6014f7a5?w=800&q=80",
    description: "Weighted Boston tins for everyday shaking.",
    tags: ["shaker", "tools"],
    specs: { Material: "Stainless steel", Size: "28 oz / 18 oz" },
  },
  {
    id: "p4",
    title: "Handheld Smoke Infuser",
    slug: "handheld-smoke-infuser",
    vendor: "LMB Official Store",
    category: "Molecular",
    price: 5499,
    mrp: 6999,
    stock: 3,
    status: "published",
    featured: true,
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=800&q=80",
    description: "Portable smoke gun for theatrical cocktail finishes.",
    tags: ["molecular", "smoke"],
    specs: { Power: "USB-C", Includes: "Wood chips sample" },
  },
  {
    id: "p5",
    title: "Martini Glass Pair",
    slug: "martini-glass-pair",
    vendor: "Crystal Pour Supplies",
    category: "Glassware",
    price: 1299,
    mrp: 1699,
    stock: 4,
    status: "draft",
    featured: false,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    description: "Classic V-stem martini glasses with a polished finish.",
    tags: ["martini", "glassware"],
    specs: { Capacity: "210 ml", Pieces: "2" },
  },
  {
    id: "p6",
    title: "Home Bartender Set",
    slug: "home-bartender-set",
    vendor: "ShakeCraft Tools",
    category: "Cocktail Sets",
    price: 3999,
    mrp: 4999,
    stock: 22,
    status: "published",
    featured: false,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
    description: "Starter set for hosts who want bar-quality tools at home.",
    tags: ["set", "home"],
    specs: { Pieces: "12", Case: "Gift box" },
  },
  {
    id: "p7",
    title: "Nitrogen Gloves Kit",
    slug: "nitrogen-gloves-kit",
    vendor: "LMB Official Store",
    category: "Molecular",
    price: 2499,
    mrp: 2999,
    stock: 2,
    status: "published",
    featured: false,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    description: "Cryo-safe gloves for nitrogen and molecular prep.",
    tags: ["molecular", "safety"],
    specs: { Size: "L/XL", Pairs: "1" },
  },
  {
    id: "p8",
    title: "Bartender Apron Canvas",
    slug: "bartender-apron-canvas",
    vendor: "LMB Official Store",
    category: "Apparel",
    price: 1899,
    mrp: 2299,
    stock: 35,
    status: "archived",
    featured: false,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    description: "Heavy canvas apron with tool pockets for service nights.",
    tags: ["apparel", "apron"],
    specs: { Material: "Canvas", Size: "One size" },
  },
];

export const SEED_PRODUCTS: AdminProduct[] = SEED_PRODUCTS_BASE.map((p) => ({
  ...p,
  subcategory: p.subcategory ?? "",
  images: [p.image],
  description: p.description ?? "",
  tags: p.tags ?? [],
  specs: p.specs ?? {},
  deliveryDaysMin: 2,
  deliveryDaysMax: 5,
  codAvailable: true,
  rating: 4.6,
}));

export const SEED_SERVICES: AdminService[] = [
  {
    id: "s1",
    title: "Luxury Wedding Bartending",
    slug: "luxury-wedding-bartending",
    partner: "LMB Official Store",
    category: "Wedding",
    priceFrom: 45000,
    durationHours: 6,
    bookingLeadDays: 14,
    status: "published",
    featured: true,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad6014f7a5?w=800&q=80",
      "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=800&q=80",
    ],
    description:
      "Elegant wedding bar service with tailored menus, polished presentation, and seamless guest flow.",
    details:
      "Luxury wedding bartending built around your reception timeline. We consult on signature cocktails, style the bar to match your décor, and staff professionals so queues stay short.\n\nGlassware styling and a clear service plan are included across Delhi NCR and nearby cities.",
    includes: [
      "2–4 professional bartenders",
      "Signature bride & groom cocktails",
      "Bar setup & glassware styling",
      "Menu consultation",
    ],
    locationCoverage: ["Delhi NCR", "Agra", "Jaipur", "Chandigarh"],
    rating: 4.9,
  },
  {
    id: "s2",
    title: "Full Wedding Bar Package",
    slug: "full-wedding-bar-package",
    partner: "LMB Official Store",
    category: "Wedding",
    priceFrom: 125000,
    durationHours: 8,
    bookingLeadDays: 30,
    status: "published",
    featured: true,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
    ],
    description: "End-to-end wedding bar — from tasting to late-night last call.",
    details:
      "A full wedding bar package covering tasting, décor-aligned bar design, molecular and classic stations, and complete staffing through the night.",
    includes: [
      "Molecular + classic stations",
      "Full staffing",
      "Decor-aligned bar design",
      "Tasting session",
    ],
    locationCoverage: ["Delhi NCR", "Agra", "Jaipur", "Udaipur"],
    rating: 5,
  },
  {
    id: "s3",
    title: "Kitty Party Bar Service",
    slug: "kitty-party-bar-service",
    partner: "LMB Official Store",
    category: "Kitty Party",
    priceFrom: 12000,
    durationHours: 3,
    bookingLeadDays: 5,
    status: "published",
    featured: true,
    image: "https://images.unsplash.com/photo-1470337458703-46ad6014f7a5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1470337458703-46ad6014f7a5?w=800&q=80",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    ],
    description: "Fun, stylish bar for kitty parties and intimate gatherings.",
    details:
      "Compact bar setup with a short curated menu, one bartender, and easy host coordination — perfect for afternoon or evening kitty parties.",
    includes: ["1 bartender", "Curated cocktail list", "Basic bar setup"],
    locationCoverage: ["Delhi NCR", "Gurgaon", "Noida"],
    rating: 4.7,
  },
  {
    id: "s4",
    title: "DJ Booking for Parties",
    slug: "dj-booking-party",
    partner: "LMB Official Store",
    category: "DJ Booking",
    priceFrom: 18000,
    durationHours: 4,
    bookingLeadDays: 7,
    status: "published",
    featured: false,
    image: "https://images.unsplash.com/photo-1571266028241-203041f0f0e8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571266028241-203041f0f0e8?w=800&q=80",
      "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=800&q=80",
    ],
    description: "Professional DJ for birthdays, corporate nights, and private parties.",
    details:
      "DJ with playlist consultation, basic lighting cues, and timed sets that keep the floor moving without overwhelming conversation areas.",
    includes: ["DJ + controller setup", "Playlist consultation", "4-hour set"],
    locationCoverage: ["Delhi NCR", "Mumbai", "Bengaluru"],
    rating: 4.6,
  },
  {
    id: "s5",
    title: "Molecular Bar Setup",
    slug: "molecular-bar-setup",
    partner: "LMB Official Store",
    category: "Molecular Bar",
    priceFrom: 65000,
    durationHours: 5,
    bookingLeadDays: 21,
    status: "published",
    featured: true,
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=800&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    ],
    description: "Showpiece molecular cocktails with smoke, spheres, and theatre.",
    details:
      "Molecular bar station with trained staff, signature effects, and a tasting-led menu for premium events and brand activations.",
    includes: [
      "Molecular station & tools",
      "2 specialists",
      "Signature effect drinks",
      "Setup & teardown",
    ],
    locationCoverage: ["Delhi NCR", "Jaipur", "Chandigarh"],
    rating: 4.9,
  },
  {
    id: "s6",
    title: "Mixology Workshop",
    slug: "mixology-workshop",
    partner: "LMB Official Store",
    category: "Workshops",
    priceFrom: 15000,
    durationHours: 2,
    bookingLeadDays: 10,
    status: "draft",
    featured: false,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
    ],
    description: "Hands-on cocktail workshop for teams and private groups.",
    details:
      "Guided mixology session covering classics and one signature drink, with ingredients, tools, and take-home recipe cards.",
    includes: ["Instructor", "Ingredients & tools", "Recipe cards"],
    locationCoverage: ["Delhi NCR"],
    rating: 4.8,
  },
];

export const SEED_CATEGORIES: AdminCategory[] = [
  ...PRODUCT_CATEGORIES.map((label, i) => ({
    id: `pc-${i}`,
    label,
    slug: label.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and"),
    kind: "product" as const,
    visible: true,
    count: SEED_PRODUCTS.filter((p) => p.category === label).length,
  })),
  ...SERVICE_CATEGORIES.map((label, i) => ({
    id: `sc-${i}`,
    label,
    slug: label.toLowerCase().replace(/\s+/g, "-"),
    kind: "service" as const,
    visible: label !== "Workshops",
    count: SEED_SERVICES.filter((s) => s.category === label).length,
  })),
];

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
