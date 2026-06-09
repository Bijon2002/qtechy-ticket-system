/**
 * User Management Page - Premium UI
 * Allows admins to view, search, filter, update roles, and delete users.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserRole, deleteUser } from "../../features/users/userSlice";
import { toast } from "react-hot-toast";

const rolePill = {
  admin: "bg-red-50 text-red-700 border border-red-200",
  agent: "bg-blue-50 text-blue-700 border border-blue-200",
  user:  "bg-slate-100 text-slate-600 border border-slate-200",
};

export default function UserManagementPage() {
  const dispatch = useDispatch();
  const { list, total, loading, error } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [params, setParams] = useState({ search: "", role: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers(params));
  }, [params, dispatch]);

  const handleRoleChange = (id, newRole) => {
    dispatch(updateUserRole({ id, role: newRole }));
    toast.success("Role updated");
  };

  const handleDeleteUser = (id, name) => {
    setDeleteConfirm({ id, name });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 fade-in-up">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">{total} registered users in the system</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="app-card p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[220px] relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search by name or email..."
            value={params.search}
            onChange={(e) => setParams((p) => ({ ...p, search: e.target.value }))}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder-slate-400"
          />
        </div>
        <select
          value={params.role}
          onChange={(e) => setParams((p) => ({ ...p, role: e.target.value }))}
          className="border border-slate-200 bg-slate-50 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all font-medium min-w-[140px]"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && list.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-4 rounded shimmer" style={{ width: `${50 + j * 10}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-400 font-medium text-sm">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((u) => (
                  <tr key={u._id} className="border-b border-slate-50 hover:bg-blue-50/20 transition-colors group">
                    {/* User */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center font-bold text-white text-[10px] overflow-hidden shrink-0 ring-1 ring-white shadow-sm">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                          ) : u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-[11px]">{u.name}</p>
                          {u._id === currentUser?._id && (
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded-full">You</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-3 py-3">
                      <span className="text-slate-500 text-[11px] font-medium">{u.email}</span>
                    </td>

                    {/* Role */}
                    <td className="px-3 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer transition-colors ${rolePill[u.role]}`}
                      >
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Joined */}
                    <td className="px-3 py-3">
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      {u._id !== currentUser?._id ? (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          title="Remove user"
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic px-1">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-sm w-full fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete user "{deleteConfirm.name}"?</h3>
                <p className="text-slate-500 text-xs mt-0.5">This action is permanent and cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-sm shadow-red-200"
                onClick={async () => {
                  try {
                    await dispatch(deleteUser(deleteConfirm.id)).unwrap();
                    toast.success("User removed");
                  } catch {
                    toast.error("Failed to remove user");
                  }
                  setDeleteConfirm(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
