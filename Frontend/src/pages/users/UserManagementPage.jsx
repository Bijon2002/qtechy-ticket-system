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
    <div className="p-6 w-full text-left">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      </div>

      {/* Display Error Message */}
      {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded">{error}</p>}

      {/* Filters Section */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search by name or email..."
          value={params.search}
          onChange={handleSearch}
          className="border rounded px-4 py-2 flex-1 max-w-md focus:outline-none focus:border-blue-500"
        />
        <select
          value={params.role}
          onChange={(e) => setParams((p) => ({ ...p, role: e.target.value }))}
          className="border rounded px-4 py-2 bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b">
              <tr>
                <th className="px-6 py-4 tracking-wider">Name</th>
                <th className="px-6 py-4 tracking-wider">Email</th>
                <th className="px-6 py-4 tracking-wider">Created At</th>
                <th className="px-6 py-4 tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && list.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                list.map((u) => (
                  <tr key={u._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="border rounded px-3 py-1 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500"
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
