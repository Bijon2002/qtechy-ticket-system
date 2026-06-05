/**
 * Layout Component
 * Defines the main application layout, including the sidebar and a 
 * scrollable main content area for nested routes (Outlet).
 */

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100 w-full text-left">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto p-6">
        {/* The matched child route will render here */}
        <Outlet />
      </main>
    </div>
  );
}
