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

// Route Guards and Layouts
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import Layout from "./components/Layout";

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // 2.5 seconds loading screen
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 z-[9999] px-4 text-center">
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide {
          animation: slide 1.5s infinite ease-in-out;
        }
      `}</style>
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 mb-8 bg-white/5 backdrop-blur-md rounded-[2rem] p-6 shadow-2xl shadow-yellow-500/20 border border-white/10 flex items-center justify-center">
          <img src="/logo_t.png" alt="QTechy Logo" className="w-full h-full object-contain drop-shadow-2xl animate-pulse" />
        </div>

        <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-200 tracking-tight mb-2">
          QTechy Ticketing System
        </h1>
        <p className="text-slate-400 font-medium tracking-widest uppercase text-sm mb-10">
          QTS Initializing...
        </p>

        {/* Custom Loading Bar */}
        <div className="w-64 max-w-[80vw] h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-slide rounded-full"></div>
        </div>
      </div>
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
