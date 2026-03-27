import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "../components/guards/RequireAuth";

// Pages
import PublicHomePage from "../pages/PublicHomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AdminLoginPage from "../pages/auth/AdminLoginPage";
import AdminRegisterPage from "../pages/auth/AdminRegisterPage";

import PublicLayout from "../layouts/PublicLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Customer pages
import DashboardOverviewPage from "../pages/customer/DashboardOverviewPage";
import CustomerCampaignsPage from "../pages/customer/CampaignsPage";
import CouponsPage from "../pages/customer/CouponsPage";
import TransactionsPage from "../pages/customer/TransactionsPage";
import RewardsPage from "../pages/customer/RewardsPage";
import OffersPage from "../pages/customer/OffersPage";
import TierPage from "../pages/customer/TierPage";
import ProfilePage from "../pages/customer/ProfilePage";

// Admin pages
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminCampaignsPage from "../pages/admin/CampaignsPage";
import AdminCampaignDetailPage from "../pages/admin/CampaignDetailPage";
import AdminCampaignCreatePage from "../pages/admin/CampaignCreatePage";
import AdminCampaignEditPage from "../pages/admin/CampaignEditPage";
import LogsPage from "../pages/admin/LogsPage";
import MembersPage from "../pages/admin/MembersPage";
import MemberDetailPage from "../pages/admin/MemberDetailPage";
import RulesPage from "../pages/admin/RulesPage";
import RewardsManagementPage from "../pages/admin/RewardsManagementPage";
import CouponsManagementPage from "../pages/admin/CouponsManagementPage";

// Fallback 404
const NotFoundPage = () => <div style={{ padding: 40, textAlign: 'center' }}>404 - Not Found</div>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />, // Wrap public routes
    children: [
      {
        index: true,
        element: <PublicHomePage />,
      },
      // ── Public Auth Routes ─────────────────────────────────────────────────────
      {
        path: "auth/customer/signup",
        element: <RegisterPage />,
      },
      {
        path: "auth/customer/login",
        element: <LoginPage />,
      },
      {
        path: "auth/admin/signup",
        element: <AdminRegisterPage />,
      },
      {
        path: "auth/admin/login",
        element: <AdminLoginPage />,
      },
    ]
  },

  // ── Customer Area ──────────────────────────────────────────────────────────
  {
    path: "/dashboard",
    element: (
      <RequireAuth role="customer">
        <CustomerLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardOverviewPage /> },
      { path: "campaigns", element: <CustomerCampaignsPage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "coupons", element: <CouponsPage /> },
      { path: "rewards", element: <RewardsPage /> },
      { path: "offers", element: <OffersPage /> },
      { path: "tier", element: <TierPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  // ── Admin Area ─────────────────────────────────────────────────────────────
  {
    path: "/admin",
    element: (
      <RequireAuth role="admin">
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "campaigns", element: <AdminCampaignsPage /> },
      { path: "campaigns/create", element: <AdminCampaignCreatePage /> },
      { path: "campaigns/:campaignId", element: <AdminCampaignDetailPage /> },
      { path: "campaigns/:campaignId/edit", element: <AdminCampaignEditPage /> },
      { path: "audit-logs", element: <LogsPage /> },
      { path: "members", element: <MembersPage /> },
      { path: "members/:memberId", element: <MemberDetailPage /> },
      { path: "rules", element: <RulesPage /> },
      { path: "rewards", element: <RewardsManagementPage /> },
      { path: "coupons", element: <CouponsManagementPage /> },
    ],
  },

  // ── Fallback ───────────────────────────────────────────────────────────────
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);