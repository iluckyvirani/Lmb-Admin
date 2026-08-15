import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { PeopleProvider } from "@/context/PeopleContext";
import { CommerceOpsProvider } from "@/context/CommerceOpsContext";
import { MoneyLogisticsProvider } from "@/context/MoneyLogisticsContext";
import { GrowthProvider } from "@/context/GrowthContext";
import { PlatformProvider } from "@/context/PlatformContext";
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from "@/components/auth/ProtectedRoute";
import { AdminShell } from "@/components/layout/AdminShell";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ProductFormPage } from "@/pages/ProductFormPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { ServiceFormPage } from "@/pages/ServiceFormPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { UsersPage } from "@/pages/UsersPage";
import { UserDetailPage } from "@/pages/UserDetailPage";
import { VendorsPage } from "@/pages/VendorsPage";
import { VendorDetailPage } from "@/pages/VendorDetailPage";
import { ServicePartnersPage } from "@/pages/ServicePartnersPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { UpcomingOrdersPage } from "@/pages/UpcomingOrdersPage";
import { BookingsPage } from "@/pages/BookingsPage";
import { PaymentsPage } from "@/pages/PaymentsPage";
import { ShippingPage } from "@/pages/ShippingPage";
import { CouponsPage } from "@/pages/CouponsPage";
import { BannersPage } from "@/pages/BannersPage";
import { ReviewsPage } from "@/pages/ReviewsPage";
import { SupportPage } from "@/pages/SupportPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AdminsPage } from "@/pages/AdminsPage";

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CatalogProvider>
        <PeopleProvider>
          <CommerceOpsProvider>
            <MoneyLogisticsProvider>
              <GrowthProvider>
                <PlatformProvider>{children}</PlatformProvider>
              </GrowthProvider>
            </MoneyLogisticsProvider>
          </CommerceOpsProvider>
        </PeopleProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/:id" element={<ProductFormPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/new" element={<ServiceFormPage />} />
              <Route path="services/:id" element={<ServiceFormPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="vendors/:id" element={<VendorDetailPage />} />
              <Route path="service-partners" element={<ServicePartnersPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/upcoming" element={<UpcomingOrdersPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="shipping" element={<ShippingPage />} />
              <Route path="coupons" element={<CouponsPage />} />
              <Route path="banners" element={<BannersPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admins" element={<AdminsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
