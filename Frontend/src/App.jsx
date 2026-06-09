/**
 * App Component
 * Defines the main routing structure for the application using React Router.
 * Handles public routes, protected routes, and role-based access.
 */

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Protected Pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import TicketListPage from "./pages/tickets/TicketListPage";
import TicketDetailPage from "./pages/tickets/TicketDetailPage";
import EditTicketPage from "./pages/tickets/EditTicketPage";
import CreateTicketPage from "./pages/tickets/CreateTicketPage";
import UserManagementPage from "./pages/users/UserManagementPage";
import SettingsPage from "./pages/settings/SettingsPage";

// Route Guards and Layouts
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import Layout from "./components/Layout";

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0f1728] z-[9999]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          </div>
          {/* Animated ring */}
          <div className="absolute -inset-2 rounded-2xl border-2 border-blue-500/30 animate-ping" />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">QTechy</h1>
          <p className="text-slate-500 text-sm font-medium tracking-widest uppercase mt-1">Ticket Management</p>
        </div>

        {/* Loading bar */}
        <div className="w-40 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full animate-[loading_1.4s_ease-in-out_forwards]"
            style={{ animation: "loadBar 1.4s ease-out forwards" }} />
        </div>
      </div>
      <style>{`
        @keyframes loadBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* ======================= */}
          {/*      Public Routes      */}
          {/* ======================= */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ======================= */}
          {/*     Protected Routes    */}
          {/* ======================= */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Redirect root to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Core Features */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tickets" element={<TicketListPage />} />
            <Route path="tickets/create" element={<CreateTicketPage />} />
            <Route path="tickets/:id" element={<TicketDetailPage />} />
            <Route path="tickets/:id/edit" element={<EditTicketPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Admin-Only Routes */}
            <Route
              path="users"
              element={
                <RoleRoute roles={["admin"]}>
                  <UserManagementPage />
                </RoleRoute>
              }
            />
          </Route>

          {/* ======================= */}
          {/*      Fallback Route     */}
          {/* ======================= */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
