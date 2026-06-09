/**
 * Layout Component
 * Premium application shell with sidebar and main content area.
 */

import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { HiMenu, HiX } from "react-icons/hi";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#f0f4f8] text-left overflow-hidden flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 z-20 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 text-white rounded-lg p-1.5 shadow-sm shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">QTechy</h2>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-600 p-2 focus:outline-none hover:bg-slate-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto min-h-full pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
