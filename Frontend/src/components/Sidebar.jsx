/**
 * Sidebar Component - Clean Light Sidebar
 * Displays navigation links dynamically based on the user's role.
 */

import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

// Icon map using inline SVGs per menu item
const iconMap = {
  Dashboard: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  "All Tickets": (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  "Assigned Tickets": (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  "My Tickets": (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  ),
  "Create Ticket": (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  "User Management": (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Settings: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const menuMap = {
  admin: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "All Tickets", path: "/tickets" },
    { label: "User Management", path: "/users" },
    { label: "Settings", path: "/settings" },
  ],
  agent: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Assigned Tickets", path: "/tickets" },
    { label: "Settings", path: "/settings" },
  ],
  user: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Tickets", path: "/tickets" },
    { label: "Settings", path: "/settings" },
  ],
};

const roleColors = {
  admin: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  agent: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  user: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
};

export default function Sidebar({ onClose }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const menu = menuMap[user?.role] || [];
  const role = user?.role || "user";
  const roleStyle = roleColors[role] || roleColors.user;

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden shadow-sm">
      
      {/* Header & Logo */}
      <div className="p-5 flex items-center gap-3">
        <div className="shrink-0">
          <img src="/logo_t.png" alt="QTechy Logo" className="h-9 w-auto object-contain" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">QTechy</h2>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${roleStyle.dot}`}></div>
            <p className={`text-[9px] uppercase tracking-wider font-bold ${roleStyle.text}`}>{role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 mt-4 overflow-y-auto">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-3">Menu</p>
        {menu.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            onClick={onClose}
            end={m.path === "/tickets"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                  {iconMap[m.label]}
                </span>
                {m.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-2">
        <div className="flex items-center gap-3 mb-3 cursor-default">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0 overflow-hidden ring-2 ring-white">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate leading-none">{user?.name}</p>
            <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 py-2 rounded-lg transition-all duration-200 border border-slate-200 hover:border-red-200 shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
