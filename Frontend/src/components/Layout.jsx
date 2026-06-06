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
    <div className="flex h-screen w-full bg-slate-50 text-left overflow-hidden flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 z-20 shadow-sm">
        <div className="flex items-center gap-2">
           <div className="bg-blue-600 text-white rounded p-1">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
               <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
             </svg>
           </div>
           <h2 className="text-xl font-black text-slate-900 tracking-tight">QTechy</h2>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-600 p-2 focus:outline-none hover:bg-slate-100 rounded-lg">
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
