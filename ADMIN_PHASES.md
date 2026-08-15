# LMB Admin — Phased Build Plan

**App:** `admin/` (React + TypeScript + Tailwind + Vite)  
**Design:** Match storefront — dark `#070707` / gold `#c9a227`, secondary `#111111`, muted `#a6a6a6`  
**Data (MVP):** Dummy/local mock data first; API later  
**Goal:** Full control panel for the multi-vendor products + services marketplace

---

## Modules (what admin manages)

| # | Module | Purpose |
|---|--------|---------|
| 1 | **Dashboard** | KPIs, sales, bookings, alerts, quick actions |
| 2 | **Users / Customers** | Buyer accounts, profiles, addresses, status |
| 3 | **Vendors / Partners** | Approve, verify, suspend sellers & service partners |
| 4 | **Products** | Catalog CRUD, stock, categories, featured |
| 5 | **Services** | Service packages, categories, featured, lead times |
| 6 | **Orders** | Product orders, upcoming shipments, status updates |
| 7 | **Bookings** | Service booking requests, confirm/reject, schedule |
| 8 | **Payments** | Payment history, methods, refunds, payouts |
| 9 | **Shipping** | Couriers/Rocket shipping, zones, rates, tracking IDs |
| 10 | **Categories** | Product + service category trees |
| 11 | **Reviews / Ratings** | Moderate product & service reviews |
| 12 | **Coupons / Offers** | Promo codes, flash deals |
| 13 | **CMS / Banners** | Home banners, mid-page promos |
| 14 | **Support / Tickets** | Customer care queries |
| 15 | **Reports / Analytics** | Sales, vendor performance, bookings |
| 16 | **Notifications** | Push/email/WhatsApp templates & logs |
| 17 | **Settings** | Brand, taxes, GST, pincodes, OTP, roles |
| 18 | **Admins / Roles** | Staff accounts & permissions |

**You asked for:** Dashboard, Users, Vendors, Products, Services, Payments, Upcoming orders, Bookings, Shipping/Rocket, Settings.  
**Also added (needed for e-com):** Categories, Reviews, Coupons, Banners, Support, Reports, Notifications, Admin roles.

---

## Phase overview

| Phase | Name | Outcome |
|-------|------|---------|
| **0** | Plan & scope | This document |
| **1** | Shell & design system | Layout, nav, routing, LMB theme, all page shells |
| **2** | Dashboard | Stats cards, charts placeholders, recent activity |
| **3** | Catalog | Products, Services, Categories (list + form stubs) |
| **4** | People | Users/Customers, Vendors/Partners (approve flow) |
| **5** | Commerce ops | Orders, Upcoming shipments, Bookings |
| **6** | Money & logistics | Payments history, Shipping/Rocket manage |
| **7** | Growth & content | Coupons, Banners, Reviews moderation |
| **8** | Platform | Settings, Notifications, Support, Reports, Roles |
| **9** | Polish & connect | Auth gate, empty/loading states, wire to website APIs |

---

## Phase 0 — Plan (done when this doc exists)

- [x] List all admin modules  
- [x] Split into phases  
- [x] Align with website brand tokens  

---

## Phase 1 — Shell & design system

**Deliverables**

- LMB tokens in CSS (`background`, `gold`, fonts if possible)
- React Router with sidebar layout
- Nav links for every module (placeholders OK)
- Top bar: search, admin avatar, logout stub
- Mobile-friendly sidebar collapse

**Routes**

```
/                    → Dashboard
/users               → Users
/vendors             → Vendors
/products            → Products
/services            → Services
/categories          → Categories
/orders              → Orders
/orders/upcoming     → Upcoming shipments
/bookings            → Service bookings
/payments            → Payments history
/shipping            → Shipping / Rocket
/coupons             → Coupons
/banners             → Banners
/reviews             → Reviews
/support             → Support
/reports             → Reports
/notifications       → Notifications
/settings            → Settings
/admins              → Admin roles
/login               → Admin login (stub)
```

---

## Phase 2 — Dashboard ✅

- [x] Revenue today / week / month (mock)
- [x] Orders count, booking requests, pending vendor approvals
- [x] Low stock alerts
- [x] Recent orders + recent bookings tables
- [x] Quick links + weekly revenue bars + activity feed
- [x] Mock module: `src/data/mock.ts`
- Login page deferred (after Phase 2 / Phase 9)

---

## Phase 3 — Catalog (Products / Services / Categories) ✅

- [x] Products list: image, title, vendor, price, stock, status, actions  
- [x] Product create/edit form (dummy save via CatalogContext)  
- [x] Services list: title, partner, priceFrom, category, featured  
- [x] Service create/edit form  
- [x] Categories: product + service tabs, add, show/hide  
- [x] Bulk publish / unpublish / feature  
- Mock: `src/data/catalog.ts` + `src/context/CatalogContext.tsx`

---

## Phase 4 — People (Users / Vendors) ✅

- [x] Users: phone, name, orders count, join date, block/unblock  
- [x] User detail drawer: addresses, order history  
- [x] Vendors: logo, city, products/services count, verified, status  
- [x] Vendor approval queue (pending → approved / rejected)  
- [x] Vendor detail drawer: listings, ratings, payouts stub, suspend  
- Mock: `src/data/people.ts` + `src/context/PeopleContext.tsx`

---

## Phase 5 — Commerce ops (Orders / Bookings) ✅

- [x] Orders list with filters (status, date, vendor)  
- [x] Order detail: lines, address, payment, timeline editor  
- [x] **Upcoming orders / shipments** board (packed → shipped → out for delivery)  
- [x] Bookings list: service, partner, date, guests, status  
- [x] Booking actions: confirm, request info, complete, cancel  
- [x] Status labels aligned with storefront track UI  
- Mock: `src/data/commerceOps.ts` + `src/context/CommerceOpsContext.tsx`

---

## Phase 6 — Money & logistics ✅

- [x] Payments history: order/booking id, method (UPI/card/COD), amount, status  
- [x] Refunds & failed payments  
- [x] Vendor payout schedule stub  
- [x] Shipping providers (incl. **Rocket** / Ekart-style)  
- [x] Shipping zones, pincode ETA rules, rate table  
- [x] Assign tracking ID to shipment  
- Mock: `src/data/moneyLogistics.ts` + `src/context/MoneyLogisticsContext.tsx`

---

## Phase 7 — Growth & content ✅

- [x] Coupons: code, %, flat, min cart, expiry  
- [x] Home banners / mid promo banners (match website carousel)  
- [x] Review moderation: approve / hide  
- [x] Featured products & featured services toggles (catalog — Phase 3)  
- Mock: `src/data/growth.ts` + `src/context/GrowthContext.tsx`

---

## Phase 8 — Platform ✅

- [x] Settings: store name, contact, GST, tax, COD rules, OTP demo flags  
- [x] Notification templates (order placed, booking enquiry, shipped)  
- [x] Support tickets inbox  
- [x] Reports: sales by category, top vendors, booking conversion  
- [x] Admin users & roles (Super Admin, Ops, Support, Finance)  
- Mock: `src/data/platform.ts` + `src/context/PlatformContext.tsx`

---

## Phase 9 — Polish & connect ✅

- [x] Admin login + protected routes  
- [x] Loading / empty / error UI  
- [x] Keep mock until backend exists (`API_MODE` in `src/lib/connect.ts`)  
- [x] ID conventions aligned with website commerce (`LMB-`, `BK-`, vendors, etc.)  
- Auth: `src/data/auth.ts` + `src/context/AuthContext.tsx`  
- Demo password: `lmbadmin` (e.g. `anika@lmb.demo`)

---

## Build order (step by step)

1. Write this doc ✅  
2. **Implement Phase 1** (shell + all routes) ← next  
3. Phase 2 Dashboard  
4. Phase 3 Catalog  
5. Phase 4 People  
6. Phase 5 Orders + Bookings  
7. Phase 6 Payments + Shipping  
8. Phase 7 Coupons / Banners / Reviews  
9. Phase 8 Settings + Roles + Reports  
10. Phase 9 Auth + API polish  

---

## Tech notes

| Item | Choice |
|------|--------|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind v4 + LMB tokens |
| Routing | `react-router-dom` |
| Icons | `lucide-react` |
| Charts (later) | `recharts` or similar |
| State (MVP) | Local mock modules; Zustand optional |

---

## Success criteria

- Admin looks like LMB (dark/gold), not generic SaaS purple  
- Every major e-com concern has a nav entry and a usable page  
- Ops can manage **products and service bookings** in one panel  
- Shipping (incl. Rocket) and payments are first-class, not afterthoughts  
