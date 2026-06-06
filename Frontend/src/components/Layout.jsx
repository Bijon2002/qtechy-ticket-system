/**
 * Layout Component
 * Defines the main application layout, including the sidebar and a 
 * scrollable main content area for nested routes (Outlet).
 */

import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { HiMenu, HiX } from "react-icons/hi";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-left overflow-hidden flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-20">
        <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-200 tracking-tight">QTechy QTS</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-300 p-2 focus:outline-none">
          {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto h-full pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
