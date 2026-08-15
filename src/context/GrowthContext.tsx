import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SEED_BANNERS,
  SEED_COUPONS,
  SEED_REVIEWS,
  type AdminBanner,
  type AdminCoupon,
  type AdminReview,
  type BannerStatus,
  type CouponStatus,
  type ReviewStatus,
} from "@/data/growth";
import { apiRequest, hydrateGrowth } from "@/lib/hydrate";
import { useAuth } from "@/context/AuthContext";

type CouponInput = Omit<AdminCoupon, "id" | "usedCount" | "status"> & {
  status?: CouponStatus;
};

type GrowthContextValue = {
  coupons: AdminCoupon[];
  banners: AdminBanner[];
  reviews: AdminReview[];
  addCoupon: (input: CouponInput) => void;
  setCouponStatus: (id: string, status: CouponStatus) => void;
  updateCoupon: (id: string, patch: Partial<AdminCoupon>) => void;
  setBannerStatus: (id: string, status: BannerStatus) => void;
  updateBanner: (id: string, patch: Partial<AdminBanner>) => void;
  moveBanner: (id: string, direction: "up" | "down") => void;
  setReviewStatus: (id: string, status: ReviewStatus) => void;
  setVendorReply: (id: string, reply: string) => void;
};

const GrowthContext = createContext<GrowthContextValue | null>(null);

export function GrowthProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState(SEED_COUPONS);
  const [banners, setBanners] = useState(SEED_BANNERS);
  const [reviews, setReviews] = useState(SEED_REVIEWS);

  useEffect(() => {
    if (!user) return;
    void hydrateGrowth()
      .then((data) => {
        if (data.coupons.length) setCoupons(data.coupons);
        if (data.banners.length) setBanners(data.banners);
        if (data.reviews.length) setReviews(data.reviews);
      })
      .catch(() => undefined);
  }, [user]);

  const addCoupon = useCallback((input: CouponInput) => {
    const id = `cp${Date.now().toString().slice(-5)}`;
    const row = {
      ...input,
      id,
      usedCount: 0,
      status: input.status ?? ("active" as CouponStatus),
      code: input.code.trim().toUpperCase(),
    };
    setCoupons((prev) => [row, ...prev]);
    void apiRequest("/admin/coupons", {
      method: "POST",
      body: {
        id,
        code: row.code,
        type: row.type,
        value: row.value,
        minCart: row.minCart,
        maxDiscount: row.maxDiscount,
        startsAt: row.startsAt,
        expiresAt: row.expiresAt,
        usageLimit: row.usageLimit,
        status: row.status,
        note: row.note,
      },
    }).catch(() => undefined);
  }, []);

  const setCouponStatus = useCallback((id: string, status: CouponStatus) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  }, []);

  const updateCoupon = useCallback(
    (id: string, patch: Partial<AdminCoupon>) => {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      );
    },
    [],
  );

  const setBannerStatus = useCallback((id: string, status: BannerStatus) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
  }, []);

  const updateBanner = useCallback(
    (id: string, patch: Partial<AdminBanner>) => {
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      );
    },
    [],
  );

  const moveBanner = useCallback((id: string, direction: "up" | "down") => {
    setBanners((prev) => {
      const target = prev.find((b) => b.id === id);
      if (!target) return prev;
      const group = prev
        .filter((b) => b.placement === target.placement)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const idx = group.findIndex((b) => b.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= group.length) return prev;
      const a = group[idx];
      const b = group[swapIdx];
      return prev.map((item) => {
        if (item.id === a.id) return { ...item, sortOrder: b.sortOrder };
        if (item.id === b.id) return { ...item, sortOrder: a.sortOrder };
        return item;
      });
    });
  }, []);

  const setReviewStatus = useCallback((id: string, status: ReviewStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    void apiRequest(`/admin/reviews/${id}`, {
      method: "PATCH",
      body: { status },
    }).catch(() => undefined);
  }, []);

  const setVendorReply = useCallback((id: string, reply: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, vendorReply: reply.trim() || undefined } : r,
      ),
    );
    void apiRequest(`/admin/reviews/${id}`, {
      method: "PATCH",
      body: { vendorReply: reply.trim() },
    }).catch(() => undefined);
  }, []);

  const value = useMemo(
    () => ({
      coupons,
      banners,
      reviews,
      addCoupon,
      setCouponStatus,
      updateCoupon,
      setBannerStatus,
      updateBanner,
      moveBanner,
      setReviewStatus,
      setVendorReply,
    }),
    [
      coupons,
      banners,
      reviews,
      addCoupon,
      setCouponStatus,
      updateCoupon,
      setBannerStatus,
      updateBanner,
      moveBanner,
      setReviewStatus,
      setVendorReply,
    ],
  );

  return (
    <GrowthContext.Provider value={value}>{children}</GrowthContext.Provider>
  );
}

export function useGrowth() {
  const ctx = useContext(GrowthContext);
  if (!ctx) throw new Error("useGrowth must be used within GrowthProvider");
  return ctx;
}
