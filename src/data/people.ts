/** People mock — customers & vendors/partners */

export type UserStatus = "active" | "blocked";

export type AdminUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  joinDate: string;
  ordersCount: number;
  bookingsCount: number;
  status: UserStatus;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  recentOrders: { id: string; total: number; status: string; date: string }[];
};

export type VendorStatus = "pending" | "approved" | "rejected" | "suspended";

export type AdminVendor = {
  id: string;
  name: string;
  slug: string;
  city: string;
  email: string;
  phone: string;
  bio: string;
  logo: string;
  verified: boolean;
  status: VendorStatus;
  productCount: number;
  serviceCount: number;
  rating: number;
  joinedAt: string;
  payoutPending: number;
  listings: { id: string; title: string; type: "product" | "service" }[];
};

export const SEED_USERS: AdminUser[] = [
  {
    id: "u1",
    name: "Aarav Mehta",
    phone: "9876543210",
    email: "aarav@example.com",
    joinDate: "2026-03-12",
    ordersCount: 7,
    bookingsCount: 1,
    status: "active",
    address: {
      line1: "14, Golf Course Road",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001",
    },
    recentOrders: [
      { id: "LMB-1042", total: 7647, status: "Out for delivery", date: "2026-08-12" },
      { id: "LMB-1011", total: 3499, status: "Delivered", date: "2026-07-02" },
    ],
  },
  {
    id: "u2",
    name: "Neha Sharma",
    phone: "9811122233",
    email: "neha@example.com",
    joinDate: "2026-05-01",
    ordersCount: 3,
    bookingsCount: 2,
    status: "active",
    address: {
      line1: "22, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
    },
    recentOrders: [
      { id: "LMB-1041", total: 14999, status: "Packed", date: "2026-08-12" },
    ],
  },
  {
    id: "u3",
    name: "Rohan Kapoor",
    phone: "9900011223",
    email: "rohan@example.com",
    joinDate: "2026-01-20",
    ordersCount: 12,
    bookingsCount: 0,
    status: "active",
    address: {
      line1: "Indiranagar 100 Feet Rd",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
    recentOrders: [
      { id: "LMB-1040", total: 4298, status: "Shipped", date: "2026-08-11" },
    ],
  },
  {
    id: "u4",
    name: "Priya Nair",
    phone: "9777788899",
    email: "priya@example.com",
    joinDate: "2025-11-08",
    ordersCount: 5,
    bookingsCount: 3,
    status: "blocked",
    address: {
      line1: "Sector 18 Market",
      city: "Noida",
      state: "UP",
      pincode: "201301",
    },
    recentOrders: [
      { id: "LMB-1039", total: 8999, status: "Delivered", date: "2026-08-11" },
    ],
  },
  {
    id: "u5",
    name: "Kabir Singh",
    phone: "9123456780",
    email: "kabir@example.com",
    joinDate: "2026-08-01",
    ordersCount: 1,
    bookingsCount: 0,
    status: "active",
    address: {
      line1: "Civil Lines",
      city: "Delhi",
      state: "Delhi",
      pincode: "110054",
    },
    recentOrders: [
      { id: "LMB-1038", total: 3198, status: "Ordered", date: "2026-08-13" },
    ],
  },
  {
    id: "u6",
    name: "Sana Khan",
    phone: "9988776655",
    email: "sana@example.com",
    joinDate: "2026-04-18",
    ordersCount: 2,
    bookingsCount: 4,
    status: "active",
    address: {
      line1: "Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
    },
    recentOrders: [],
  },
];

export const SEED_VENDORS: AdminVendor[] = [
  {
    id: "v-lmb",
    name: "LMB Official Store",
    slug: "lmb-official-store",
    city: "Delhi NCR",
    email: "store@lmb.demo",
    phone: "9582810267",
    bio: "Flagship kits, molecular tools, and premium bar services.",
    logo: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&q=80",
    verified: true,
    status: "approved",
    productCount: 8,
    serviceCount: 5,
    rating: 4.9,
    joinedAt: "2025-06-01",
    payoutPending: 125000,
    listings: [
      { id: "p2", title: "Ultimate Bar Kit Pro", type: "product" },
      { id: "s5", title: "Molecular Bar Setup", type: "service" },
    ],
  },
  {
    id: "v-crystal",
    name: "Crystal Pour Supplies",
    slug: "crystal-pour-supplies",
    city: "Mumbai",
    email: "hello@crystalpour.demo",
    phone: "9812345678",
    bio: "Precision glassware for home bars and professionals.",
    logo: "https://images.unsplash.com/photo-1470337458703-46ad6014f7a5?w=100&q=80",
    verified: true,
    status: "approved",
    productCount: 6,
    serviceCount: 0,
    rating: 4.7,
    joinedAt: "2025-08-14",
    payoutPending: 42000,
    listings: [
      { id: "p1", title: "Crystal Coupe Set (6)", type: "product" },
    ],
  },
  {
    id: "v-shake",
    name: "ShakeCraft Tools",
    slug: "shakecraft-tools",
    city: "Bengaluru",
    email: "sales@shakecraft.demo",
    phone: "9900112233",
    bio: "Shakers, spoons, jiggers built for daily service.",
    logo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=100&q=80",
    verified: true,
    status: "approved",
    productCount: 7,
    serviceCount: 0,
    rating: 4.6,
    joinedAt: "2025-09-20",
    payoutPending: 18500,
    listings: [
      { id: "p3", title: "Boston Shaker Tin Set", type: "product" },
    ],
  },
  {
    id: "v-event",
    name: "Event Pour Co.",
    slug: "event-pour-co",
    city: "Delhi",
    email: "book@eventpour.demo",
    phone: "9876501234",
    bio: "Bartending for weddings, corporate nights, private parties.",
    logo: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&q=80",
    verified: true,
    status: "approved",
    productCount: 0,
    serviceCount: 5,
    rating: 4.8,
    joinedAt: "2025-07-11",
    payoutPending: 89000,
    listings: [
      { id: "s1", title: "Luxury Wedding Bartending", type: "service" },
    ],
  },
  {
    id: "v-pourhouse",
    name: "PourHouse Delhi",
    slug: "pourhouse-delhi",
    city: "Delhi",
    email: "apply@pourhouse.demo",
    phone: "9111223344",
    bio: "New applicant — mobile bar kits and event staffing.",
    logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&q=80",
    verified: false,
    status: "pending",
    productCount: 0,
    serviceCount: 0,
    rating: 0,
    joinedAt: "2026-08-12",
    payoutPending: 0,
    listings: [],
  },
  {
    id: "v-flair",
    name: "Flair & Foam Co.",
    slug: "flair-foam-co",
    city: "Jaipur",
    email: "hi@flairfoam.demo",
    phone: "9666778899",
    bio: "Flair bartending and foam workshops for parties.",
    logo: "https://images.unsplash.com/photo-1571266028241-203041f0f0e8?w=100&q=80",
    verified: false,
    status: "pending",
    productCount: 0,
    serviceCount: 2,
    rating: 0,
    joinedAt: "2026-08-10",
    payoutPending: 0,
    listings: [
      { id: "sx", title: "Flair Show Package (draft)", type: "service" },
    ],
  },
  {
    id: "v-old",
    name: "BarBasics Bulk",
    slug: "barbasics-bulk",
    city: "Agra",
    email: "ops@barbasics.demo",
    phone: "9555667788",
    bio: "Rejected for incomplete KYC documents.",
    logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&q=80",
    verified: false,
    status: "rejected",
    productCount: 0,
    serviceCount: 0,
    rating: 0,
    joinedAt: "2026-07-01",
    payoutPending: 0,
    listings: [],
  },
];

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  return phone;
}
