import { apiRequest } from "@/lib/connect";
import type { AdminProduct, AdminService, AdminCategory, PublishStatus } from "@/data/catalog";
import type { AdminUser, AdminVendor, VendorStatus } from "@/data/people";
import type {
  AdminOrder,
  AdminBooking,
  ShipmentStatus,
  BookingStatus,
  PaymentMethod,
} from "@/data/commerceOps";
import type {
  AdminPayment,
  VendorPayout,
  CourierProvider,
  ShippingZone,
  ShippingRateRow,
} from "@/data/moneyLogistics";
import { buildTimeline, statusLabelFor } from "@/data/commerceOps";
import type { AdminCoupon, AdminBanner, AdminReview } from "@/data/growth";
import type { StaffAdmin, StoreSettings, SupportTicket } from "@/data/platform";

function mapPublishStatus(status: string): PublishStatus {
  if (status === "active" || status === "published") return "published";
  if (status === "archived") return "archived";
  return "draft";
}

export async function hydrateCatalog() {
  const [productsRes, categoriesRes, servicesRes] = await Promise.all([
    apiRequest<{ products: Record<string, unknown>[] }>("/admin/products"),
    apiRequest<{ categories: Record<string, unknown>[] }>("/admin/categories"),
    apiRequest<{ services: Record<string, unknown>[]; mock?: boolean }>(
      "/admin/services",
    ),
  ]);

  const products: AdminProduct[] = productsRes.products.map((p) => {
    const images = Array.isArray(p.images)
      ? (p.images as unknown[]).map(String).filter(Boolean)
      : [];
    const tags = Array.isArray(p.tags)
      ? (p.tags as unknown[]).map(String).filter(Boolean)
      : [];
    const specs =
      p.specs && typeof p.specs === "object" && !Array.isArray(p.specs)
        ? Object.fromEntries(
            Object.entries(p.specs as Record<string, unknown>).map(([k, v]) => [
              k,
              String(v),
            ]),
          )
        : {};
    return {
      id: String(p.id),
      title: String(p.title),
      slug: String(p.slug),
      vendor: String(p.vendorName ?? p.vendorId ?? ""),
      category: String(p.category),
      subcategory: String(p.subcategory ?? ""),
      price: Number(p.price),
      mrp: Number(p.mrp),
      stock: Number(p.stock),
      status: mapPublishStatus(String(p.status)),
      featured: Boolean(p.featured),
      images,
      image: images[0] ?? "",
      description: String(p.description ?? ""),
      tags,
      specs,
      deliveryDaysMin: Number(p.deliveryDaysMin ?? 2),
      deliveryDaysMax: Number(p.deliveryDaysMax ?? 5),
      codAvailable: p.codAvailable !== false,
      rating: Number(p.rating ?? 4.5),
    };
  });

  const categories: AdminCategory[] = categoriesRes.categories.map((c) => ({
    id: String(c.slug),
    label: String(c.label),
    slug: String(c.slug),
    kind: "product" as const,
    visible: Boolean(c.visible),
    count: products.filter((p) => p.category === c.slug || p.category === c.label)
      .length,
  }));

  const services: AdminService[] = (servicesRes.services ?? []).map((s) => {
    const images = Array.isArray(s.images)
      ? (s.images as unknown[]).map(String).filter(Boolean)
      : [];
    const includes = Array.isArray(s.includes)
      ? (s.includes as unknown[]).map(String).filter(Boolean)
      : [];
    const locationCoverage = Array.isArray(s.locationCoverage)
      ? (s.locationCoverage as unknown[]).map(String).filter(Boolean)
      : [];
    return {
      id: String(s.id),
      title: String(s.title),
      slug: String(s.slug),
      partner: "LMB Official Store",
      category: String(s.category),
      priceFrom: Number(s.priceFrom),
      durationHours: Number(s.durationHours ?? 1),
      bookingLeadDays: Number(s.bookingLeadDays ?? 7),
      status: "published" as PublishStatus,
      featured: Boolean(s.featured),
      images,
      image: images[0] ?? "",
      description: String(s.description ?? ""),
      details: String(s.details ?? ""),
      includes,
      locationCoverage,
      rating: Number(s.rating ?? 4.8),
    };
  });

  return { products, categories, services };
}

export async function hydratePeople() {
  const [usersRes, vendorsRes] = await Promise.all([
    apiRequest<{ users: Record<string, unknown>[] }>("/admin/users"),
    apiRequest<{ vendors: Record<string, unknown>[] }>("/admin/vendors"),
  ]);

  const users: AdminUser[] = usersRes.users.map((u) => {
    const address = (u.address ?? {}) as Record<string, string>;
    return {
      id: String(u.id),
      name: String(u.name ?? u.phone ?? "Customer"),
      phone: String(u.phone ?? ""),
      email: String(u.email ?? ""),
      joinDate: String(u.createdAt ?? "").slice(0, 10),
      ordersCount: Number(u.ordersCount ?? 0),
      bookingsCount: Number(u.bookingsCount ?? 0),
      status: (u.status === "blocked" ? "blocked" : "active") as AdminUser["status"],
      address: {
        line1: address.addressLine1 ?? address.line1 ?? "",
        city: address.city ?? "",
        state: address.state ?? "",
        pincode: address.pincode ?? "",
      },
      recentOrders: [],
    };
  });

  const vendors: AdminVendor[] = vendorsRes.vendors.map((v) => ({
    id: String(v.id),
    name: String(v.name),
    slug: String(v.slug),
    city: String(v.city ?? ""),
    email: String(v.email ?? ""),
    phone: String(v.phone ?? ""),
    bio: String(v.bio ?? ""),
    logo: String(v.logo ?? ""),
    verified: Boolean(v.verified),
    status: String(v.status) as VendorStatus,
    productCount: Number(v.productCount ?? 0),
    serviceCount: Number(v.serviceCount ?? 0),
    rating: Number(v.rating ?? 0),
    joinedAt: String(v.createdAt ?? "").slice(0, 10),
    payoutPending: 0,
    listings: [],
  }));

  return { users, vendors };
}

function mapPaymentMethod(method: string): PaymentMethod {
  const m = method.toLowerCase();
  if (m === "cod") return "COD";
  if (m === "card") return "Card";
  return "UPI";
}

export async function hydrateCommerceOps() {
  const [ordersRes, bookingsRes] = await Promise.all([
    apiRequest<{ orders: Record<string, unknown>[] }>("/admin/orders"),
    apiRequest<{ bookings: Record<string, unknown>[]; mock?: boolean }>(
      "/admin/bookings",
    ),
  ]);

  const orders: AdminOrder[] = [];
  for (const order of ordersRes.orders) {
    const shipments = (order.shipments as Record<string, unknown>[]) ?? [];
    const address = (order.address ?? {}) as Record<string, string>;
    for (const sh of shipments) {
      const status = String(sh.status ?? "ordered") as ShipmentStatus;
      const lines = ((sh.lines as Record<string, unknown>[]) ?? []).map((l, i) => ({
        id: String(l.id ?? `li-${i}`),
        title: String(l.title ?? ""),
        qty: Number(l.quantity ?? 1),
        unitPrice: Number(l.unitPrice ?? 0),
      }));
      const subtotal = lines.reduce((n, l) => n + l.qty * l.unitPrice, 0);
      orders.push({
        id: String(order.id),
        createdAt: String(order.createdAt ?? ""),
        customerId: String(order.userId ?? ""),
        customerName: String(order.customerName ?? ""),
        customerPhone: String(order.customerPhone ?? ""),
        vendorId: String(sh.vendorId ?? ""),
        vendorName: String(sh.vendorName ?? ""),
        status,
        statusLabel: statusLabelFor(status),
        trackingId: String(sh.trackingId ?? ""),
        courier: String(sh.courier ?? ""),
        expectedDelivery: String(sh.expectedDelivery ?? ""),
        paymentMethod: mapPaymentMethod(String(order.paymentMethod ?? "upi")),
        paymentStatus:
          String(order.paymentMethod) === "cod" ? "cod" : "paid",
        subtotal,
        shipping: Number(order.shipping ?? 0),
        total: Number(order.total ?? subtotal),
        address: {
          line1: address.addressLine1 ?? "",
          city: address.city ?? "",
          state: address.state ?? "",
          pincode: address.pincode ?? "",
        },
        lines,
        timeline: buildTimeline(status, String(order.createdAt ?? "")),
        note: String(sh.note ?? ""),
        shipmentId: String(sh.id),
      });
    }
  }

  const bookingStatusMap: Record<string, BookingStatus> = {
    booked: "pending",
    vendor_confirmed: "confirmed",
    team_assigned: "confirmed",
    completed: "completed",
    cancelled: "cancelled",
  };

  const bookings: AdminBooking[] = (bookingsRes.bookings ?? []).map((b) => ({
    id: String(b.id),
    createdAt: String(b.createdAt ?? ""),
    serviceId: String(b.serviceId ?? ""),
    serviceTitle: String(b.serviceTitle ?? ""),
    partnerId: String(b.vendorId ?? "v-lmb"),
    partnerName: String(b.vendorName ?? "LMB Bar Market"),
    assignedTo: String(b.assignedTo ?? "lmb"),
    assignedName: String(b.assignedName ?? "LMB (self)"),
    customerId: "",
    customerName: String(b.customerName ?? ""),
    customerPhone: String(b.customerPhone ?? ""),
    eventDate: String(b.preferredDate ?? ""),
    guests: 0,
    city: String((b.address as Record<string, string>)?.city ?? ""),
    amount: Number(b.amount ?? 0),
    status: bookingStatusMap[String(b.status)] ?? "pending",
    message: String(b.note ?? ""),
  }));

  return { orders, bookings };
}

export async function hydrateMoney() {
  const [paymentsRes, payoutsRes, couriersRes, zonesRes] = await Promise.all([
    apiRequest<{ payments: Record<string, unknown>[] }>("/admin/payments"),
    apiRequest<{ payouts: Record<string, unknown>[] }>("/admin/payouts"),
    apiRequest<{ couriers: Record<string, unknown>[] }>("/admin/shipping/couriers"),
    apiRequest<{
      zones: Record<string, unknown>[];
      rates: Record<string, unknown>[];
    }>("/admin/shipping/zones"),
  ]);

  const payments: AdminPayment[] = paymentsRes.payments.map((p) => ({
    id: String(p.id),
    createdAt: String(p.createdAt ?? ""),
    refType: (p.refType === "booking" ? "booking" : "order") as AdminPayment["refType"],
    refId: String(p.refId),
    customerName: String(p.customerName ?? ""),
    vendorName: String(p.vendorName ?? ""),
    method: mapPaymentMethod(String(p.method ?? "upi")) as AdminPayment["method"],
    amount: Number(p.amount),
    status: String(p.status ?? "paid") as AdminPayment["status"],
    gatewayRef: p.gatewayRef ? String(p.gatewayRef) : undefined,
    note: p.note ? String(p.note) : undefined,
  }));

  const payouts: VendorPayout[] = payoutsRes.payouts.map((p) => ({
    id: String(p.id),
    vendorId: String(p.vendorId),
    vendorName: String(p.vendorName ?? ""),
    periodLabel: String(p.periodLabel ?? ""),
    amount: Number(p.amount),
    ordersCount: Number(p.ordersCount ?? 0),
    status: String(p.status) as VendorPayout["status"],
    scheduledFor: String(p.scheduledFor ?? "").slice(0, 10),
  }));

  const couriers: CourierProvider[] = couriersRes.couriers.map((c) => ({
    id: String(c.id),
    name: String(c.name),
    code: String(c.code),
    kind: String(c.kind) as CourierProvider["kind"],
    active: Boolean(c.active),
    trackingPrefix: String(c.tracking_prefix ?? c.trackingPrefix ?? ""),
    avgEtaDays: Number(c.avg_eta_days ?? c.avgEtaDays ?? 3),
    supportPhone: String(c.support_phone ?? c.supportPhone ?? ""),
  }));

  const zones: ShippingZone[] = zonesRes.zones.map((z) => ({
    id: String(z.id),
    name: String(z.name),
    pincodePrefixes: (z.pincode_prefixes ?? z.pincodePrefixes ?? []) as string[],
    etaMinDays: Number(z.eta_min_days ?? z.etaMinDays ?? 2),
    etaMaxDays: Number(z.eta_max_days ?? z.etaMaxDays ?? 5),
    baseRate: Number(z.base_rate ?? z.baseRate ?? 0),
    freeAbove: Number(z.free_above ?? z.freeAbove ?? 4999),
  }));

  const rates: ShippingRateRow[] = zonesRes.rates.map((r) => ({
    id: String(r.id),
    zoneId: String(r.zone_id ?? r.zoneId),
    zoneName: String(r.zone_name ?? r.zoneName),
    weightKgMax: Number(r.weight_kg_max ?? r.weightKgMax ?? 1),
    rate: Number(r.rate ?? 0),
    rocketSurcharge: Number(r.rocket_surcharge ?? r.rocketSurcharge ?? 0),
  }));

  return { payments, payouts, couriers, zones, rates };
}

export async function hydrateGrowth() {
  const [couponsRes, bannersRes, reviewsRes] = await Promise.all([
    apiRequest<{ coupons: Record<string, unknown>[] }>("/admin/coupons"),
    apiRequest<{ banners: Record<string, unknown>[] }>("/admin/banners"),
    apiRequest<{ reviews: Record<string, unknown>[] }>("/admin/reviews"),
  ]);

  const coupons: AdminCoupon[] = couponsRes.coupons.map((c) => ({
    id: String(c.id),
    code: String(c.code),
    type: String(c.type) as AdminCoupon["type"],
    value: Number(c.value),
    minCart: Number(c.min_cart ?? c.minCart ?? 0),
    maxDiscount: c.max_discount != null || c.maxDiscount != null
      ? Number(c.max_discount ?? c.maxDiscount)
      : undefined,
    startsAt: String(c.starts_at ?? c.startsAt ?? "").slice(0, 10),
    expiresAt: String(c.expires_at ?? c.expiresAt ?? "").slice(0, 10),
    usageLimit: Number(c.usage_limit ?? c.usageLimit ?? 100),
    usedCount: Number(c.used_count ?? c.usedCount ?? 0),
    status: String(c.status ?? "active") as AdminCoupon["status"],
    note: c.note ? String(c.note) : undefined,
  }));

  const banners: AdminBanner[] = bannersRes.banners.map((b) => ({
    id: String(b.id),
    placement: (String(b.placement ?? "home").includes("mid")
      ? "mid_promo"
      : "home_carousel") as AdminBanner["placement"],
    sortOrder: Number(b.sort_order ?? b.sortOrder ?? 1),
    eyebrow: String(b.eyebrow ?? ""),
    title: String(b.title),
    subtitle: String(b.subtitle ?? ""),
    href: String(b.href ?? "/shop"),
    image: String(b.image ?? ""),
    status: String(b.status ?? "live") as AdminBanner["status"],
    publishAt: String(b.publish_at ?? b.publishAt ?? "").slice(0, 10),
    unpublishAt: b.unpublish_at || b.unpublishAt
      ? String(b.unpublish_at ?? b.unpublishAt).slice(0, 10)
      : undefined,
  }));

  const reviews: AdminReview[] = reviewsRes.reviews.map((r) => ({
    id: String(r.id),
    targetType: String(r.target_type ?? r.targetType ?? "product") as AdminReview["targetType"],
    targetId: String(r.target_id ?? r.targetId ?? ""),
    targetTitle: String(r.target_title ?? r.targetTitle ?? ""),
    customerName: String(r.customer_name ?? r.customerName ?? ""),
    rating: Number(r.rating ?? 5),
    title: String(r.title ?? ""),
    body: String(r.body ?? ""),
    status: String(r.status ?? "pending") as AdminReview["status"],
    vendorReply: r.vendor_reply || r.vendorReply
      ? String(r.vendor_reply ?? r.vendorReply)
      : undefined,
    flagged: Boolean(r.flagged),
    createdAt: String(r.created_at ?? r.createdAt ?? ""),
  }));

  return { coupons, banners, reviews };
}

export async function hydratePlatform() {
  const [settingsRes, ticketsRes, staffRes] = await Promise.all([
    apiRequest<{ settings: Record<string, unknown> }>("/admin/settings"),
    apiRequest<{ tickets: Record<string, unknown>[] }>("/admin/support"),
    apiRequest<{ staff: Record<string, unknown>[] }>("/admin/staff"),
  ]);

  const s = settingsRes.settings ?? {};
  const settings: StoreSettings = {
    storeName: String(s.storeName ?? "LMB Bar Market"),
    tagline: String(s.tagline ?? ""),
    supportEmail: String(s.supportEmail ?? ""),
    supportPhone: String(s.supportPhone ?? ""),
    whatsapp: String(s.whatsapp ?? ""),
    gstin: String(s.gstin ?? ""),
    taxPercent: Number(s.taxPercent ?? 18),
    codEnabled: s.codEnabled !== false,
    codMaxAmount: Number(s.codMaxAmount ?? 15000),
    otpDemoMode: s.otpDemoMode !== false,
    otpFixedCode: String(s.otpFixedCode ?? "123456"),
    defaultDeliveryDaysMin: Number(s.defaultDeliveryDaysMin ?? 2),
    defaultDeliveryDaysMax: Number(s.defaultDeliveryDaysMax ?? 5),
    metroPincodePrefixes: String(s.metroPincodePrefixes ?? "11,12,40"),
    productCommissionPercent: Number(s.productCommissionPercent ?? 10),
  } as StoreSettings;

  const tickets: SupportTicket[] = ticketsRes.tickets.map((t) => ({
    id: String(t.id),
    subject: String(t.subject),
    customerName: String(t.customer_name ?? t.customerName ?? ""),
    customerPhone: String(t.customer_phone ?? t.customerPhone ?? ""),
    status: String(t.status ?? "open") as SupportTicket["status"],
    priority: String(t.priority ?? "medium") as SupportTicket["priority"],
    assignee: t.assignee ? String(t.assignee) : undefined,
    linkedOrderId: t.linked_order_id || t.linkedOrderId
      ? String(t.linked_order_id ?? t.linkedOrderId)
      : undefined,
    message: String(t.message ?? ""),
    channel: String(t.channel ?? "in_app") as SupportTicket["channel"],
    createdAt: String(t.created_at ?? t.createdAt ?? ""),
    updatedAt: String(t.updated_at ?? t.updatedAt ?? ""),
  }));

  const staff: StaffAdmin[] = staffRes.staff.map((a) => ({
    id: String(a.id),
    name: String(a.name),
    email: String(a.email),
    role: String(a.role) as StaffAdmin["role"],
    active: Boolean(a.active),
    lastActiveAt: String(a.lastActiveAt ?? a.last_active_at ?? ""),
  }));

  return { settings, tickets, staff };
}

export { apiRequest };
