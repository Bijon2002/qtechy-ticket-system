/**
 * Sidebar Component
 * Displays navigation links dynamically based on the user's role.
 */

import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

// Navigation menu configurations per role
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
    { label: "Create Ticket", path: "/tickets/create" },
    { label: "Settings", path: "/settings" },
  ],
};

export default function Sidebar({ onClose }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Retrieve the correct menu for the current user's role, or an empty array
  const menu = menuMap[user?.role] || [];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col h-full md:m-3 md:rounded-2xl md:h-[calc(100vh-24px)] shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/10 to-transparent"></div>

      <div className="p-6 relative z-10 flex items-center gap-2">
        <div className="bg-white text-blue-600 rounded p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight leading-none">QTechy</h2>
          <p className="text-[10px] text-blue-400 uppercase tracking-widest mt-1 font-bold">{user?.role} Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 relative z-10 mt-4">
        {menu.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            {m.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 relative z-10 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center font-bold text-white shadow-lg shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="w-full text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors font-medium border border-gray-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
