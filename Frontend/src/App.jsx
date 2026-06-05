/**
 * App Component
 * Defines the main routing structure for the application using React Router.
 * Handles public routes, protected routes, and role-based access.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

function App() {
  return (
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
  );
}

export default App;
