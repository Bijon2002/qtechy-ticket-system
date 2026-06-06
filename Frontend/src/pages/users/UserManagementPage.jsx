/**
 * User Management Page
 * Allows admins to view all users, search/filter them, and update their roles.
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserRole } from "../../features/users/userSlice";

export default function UserManagementPage() {
  const dispatch = useDispatch();

  // Extract user state from Redux store
  const { list, loading, error } = useSelector((state) => state.users);

  // Local state for search and filtering
  const [params, setParams] = useState({
    search: "",
    role: ""
  });

  // Fetch users whenever params change
  useEffect(() => {
    dispatch(fetchUsers(params));
  }, [params, dispatch]);

  /**
   * Handle changing a user's role
   */
  const handleRoleChange = (id, newRole) => {
    dispatch(updateUserRole({ id, role: newRole }));
  };

  /**
   * Handle search input change
   */
  const handleSearch = (e) => {
    setParams((p) => ({ ...p, search: e.target.value }));
  };

  return (
    <div className="p-6 w-full text-left animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
      </div>

      {/* Display Error Message */}
      {error && <p className="text-red-600 font-medium mb-4 bg-red-50 border border-red-200 p-3 rounded-xl">{error}</p>}

      {/* Filters Section */}
      <div className="flex gap-4 mb-6 flex-wrap bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <input
          placeholder="Search by name or email..."
          value={params.search}
          onChange={handleSearch}
          className="border border-slate-300 bg-white text-slate-900 rounded-lg px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400 shadow-sm"
        />
        <select
          value={params.role}
          onChange={(e) => setParams((p) => ({ ...p, role: e.target.value }))}
          className="border border-slate-300 bg-white text-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] transition-all shadow-sm"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && list.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                list.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 border-l-4 border-transparent hover:border-blue-500 transition-colors">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{u.email}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-1 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
