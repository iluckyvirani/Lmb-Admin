/** Growth & content mock — coupons, banners, reviews */

export type CouponType = "percent" | "flat";
export type CouponStatus = "active" | "scheduled" | "expired" | "disabled";

export type AdminCoupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minCart: number;
  maxDiscount?: number;
  startsAt: string;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  status: CouponStatus;
  note?: string;
};

export type BannerPlacement = "home_carousel" | "mid_promo";
export type BannerStatus = "live" | "scheduled" | "draft" | "archived";

export type AdminBanner = {
  id: string;
  placement: BannerPlacement;
  sortOrder: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  status: BannerStatus;
  publishAt: string;
  unpublishAt?: string;
};

export type ReviewTargetType = "product" | "service";
export type ReviewStatus = "pending" | "approved" | "hidden";

export type AdminReview = {
  id: string;
  targetType: ReviewTargetType;
  targetId: string;
  targetTitle: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  status: ReviewStatus;
  vendorReply?: string;
  flagged?: boolean;
};

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCouponValue(c: AdminCoupon) {
  if (c.type === "percent") return `${c.value}% off`;
  return `${formatINR(c.value)} off`;
}

export const SEED_COUPONS: AdminCoupon[] = [
  {
    id: "cp1",
    code: "LMB10",
    type: "percent",
    value: 10,
    minCart: 2999,
    maxDiscount: 1500,
    startsAt: "2026-08-01",
    expiresAt: "2026-08-31",
    usageLimit: 500,
    usedCount: 128,
    status: "active",
    note: "Sitewide August",
  },
  {
    id: "cp2",
    code: "POUR500",
    type: "flat",
    value: 500,
    minCart: 4999,
    startsAt: "2026-08-10",
    expiresAt: "2026-09-15",
    usageLimit: 200,
    usedCount: 41,
    status: "active",
  },
  {
    id: "cp3",
    code: "WEDDING15",
    type: "percent",
    value: 15,
    minCart: 25000,
    maxDiscount: 10000,
    startsAt: "2026-09-01",
    expiresAt: "2026-10-31",
    usageLimit: 80,
    usedCount: 0,
    status: "scheduled",
    note: "Service bookings only (ops note)",
  },
  {
    id: "cp4",
    code: "LAUNCH999",
    type: "flat",
    value: 999,
    minCart: 9999,
    startsAt: "2026-06-01",
    expiresAt: "2026-07-31",
    usageLimit: 100,
    usedCount: 100,
    status: "expired",
  },
  {
    id: "cp5",
    code: "VIP20",
    type: "percent",
    value: 20,
    minCart: 15000,
    maxDiscount: 5000,
    startsAt: "2026-08-01",
    expiresAt: "2026-12-31",
    usageLimit: 50,
    usedCount: 12,
    status: "disabled",
    note: "Paused — abuse check",
  },
];

export const SEED_BANNERS: AdminBanner[] = [
  {
    id: "bn1",
    placement: "home_carousel",
    sortOrder: 1,
    eyebrow: "Ultimate kits",
    title: "Pro bar kits from ₹9,999",
    subtitle: "Everything behind the perfect pour",
    href: "/shop?category=ultimate-bar-kits",
    image: "/assets/banner_kits.png",
    status: "live",
    publishAt: "2026-08-01",
  },
  {
    id: "bn2",
    placement: "home_carousel",
    sortOrder: 2,
    eyebrow: "Molecular",
    title: "Smoke & nitrogen tools",
    subtitle: "Theatre-ready equipment for home & events",
    href: "/shop?category=molecular-tools",
    image: "/assets/banner_molecular.png",
    status: "live",
    publishAt: "2026-08-01",
  },
  {
    id: "bn3",
    placement: "home_carousel",
    sortOrder: 3,
    eyebrow: "Services",
    title: "Book wedding bars",
    subtitle: "Request booking — no cart needed",
    href: "/services?cat=wedding",
    image: "/assets/banner_wedding.png",
    status: "live",
    publishAt: "2026-08-01",
  },
  {
    id: "bn4",
    placement: "home_carousel",
    sortOrder: 4,
    eyebrow: "Glassware",
    title: "Crystal coupe sets",
    subtitle: "Flat deals on premium glassware",
    href: "/shop?category=glassware",
    image: "/assets/banner_glassware.png",
    status: "live",
    publishAt: "2026-08-01",
  },
  {
    id: "bn5",
    placement: "mid_promo",
    sortOrder: 1,
    eyebrow: "Tools & talent",
    title: "Everything behind the perfect pour",
    subtitle:
      "Shop premium equipment or book wedding, DJ, and catering services — one marketplace for both.",
    href: "/shop",
    image: "/assets/banner_molecular.png",
    status: "live",
    publishAt: "2026-08-01",
  },
  {
    id: "bn6",
    placement: "home_carousel",
    sortOrder: 5,
    eyebrow: "Diwali edit",
    title: "Gift kits that sparkle",
    subtitle: "Goes live mid-September",
    href: "/shop",
    image: "/assets/banner_kits.png",
    status: "scheduled",
    publishAt: "2026-09-15",
    unpublishAt: "2026-11-05",
  },
];

export const SEED_REVIEWS: AdminReview[] = [
  {
    id: "rv1",
    targetType: "product",
    targetId: "p1",
    targetTitle: "Crystal Coupe Set (6)",
    customerName: "Aarav Mehta",
    rating: 5,
    title: "Wedding-ready glassware",
    body: "Heavy base, zero chips on arrival. Looked premium on the bar.",
    createdAt: "2026-08-10T14:20:00",
    status: "approved",
    vendorReply: "Glad they made the toast!",
  },
  {
    id: "rv2",
    targetType: "product",
    targetId: "p8",
    targetTitle: "Pro Mobile Bar Cart",
    customerName: "Neha Sharma",
    rating: 4,
    title: "Solid cart, slow delivery",
    body: "Build quality is excellent. ETA slipped by a day in Mumbai.",
    createdAt: "2026-08-11T09:05:00",
    status: "pending",
  },
  {
    id: "rv3",
    targetType: "service",
    targetId: "s1",
    targetTitle: "Luxury Wedding Bartending",
    customerName: "Priya Nair",
    rating: 5,
    title: "Guests still talking about the bar",
    body: "Signature cocktails + styling were on point. Team was punctual.",
    createdAt: "2026-08-08T18:40:00",
    status: "approved",
  },
  {
    id: "rv4",
    targetType: "product",
    targetId: "p3",
    targetTitle: "Boston Shaker Tin Set",
    customerName: "Rohan Kapoor",
    rating: 2,
    title: "Dented tin",
    body: "One tin arrived dented. Packaging needs work.",
    createdAt: "2026-08-12T11:15:00",
    status: "pending",
    flagged: true,
  },
  {
    id: "rv5",
    targetType: "service",
    targetId: "s2",
    targetTitle: "Corporate Cocktail Night",
    customerName: "Kabir Singh",
    rating: 1,
    title: "Spam review?",
    body: "Buy cheap pills online click here…",
    createdAt: "2026-08-13T07:30:00",
    status: "hidden",
    flagged: true,
  },
  {
    id: "rv6",
    targetType: "product",
    targetId: "p2",
    targetTitle: "Ultimate Bar Kit Pro",
    customerName: "Sana Khan",
    rating: 5,
    title: "Worth every rupee",
    body: "Gifted this for a housewarming — complete kit, beautiful case.",
    createdAt: "2026-08-09T16:00:00",
    status: "approved",
  },
  {
    id: "rv7",
    targetType: "service",
    targetId: "s3",
    targetTitle: "Private Party Bar Setup",
    customerName: "Neha Sharma",
    rating: 3,
    title: "Good but short on ice",
    body: "Bartenders were great; ice ran out halfway. Note for ops.",
    createdAt: "2026-08-12T20:10:00",
    status: "pending",
  },
];

export const COUPON_STATUS_LABEL: Record<CouponStatus, string> = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
  disabled: "Disabled",
};

export const BANNER_STATUS_LABEL: Record<BannerStatus, string> = {
  live: "Live",
  scheduled: "Scheduled",
  draft: "Draft",
  archived: "Archived",
};

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  hidden: "Hidden",
};
