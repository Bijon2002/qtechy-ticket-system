/**
 * Dashboard Page
 * Displays statistical metrics (Ticket counts by status) 
 * tailored to the current user's role.
 */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../../features/dashboard/dashboardSlice";

/**
 * Reusable component for displaying individual statistics
 */
const StatCard = ({ label, value, color }) => (
  <div className="bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border border-slate-800 relative overflow-hidden group">
    <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
    <p className="text-4xl font-extrabold mt-3 text-white group-hover:scale-105 transition-transform origin-left">{value ?? 0}</p>
  </div>
);

export default function DashboardPage() {
  const dispatch = useDispatch();

  // Extract state from Redux store
  const { stats, loading } = useSelector((state) => state.dashboard);
  const user = useSelector((state) => state.auth.user);

  // Fetch statistics on component mount
  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-slate-400 text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Tickets"
          value={stats?.total}
          color="bg-blue-500"
        />
        <StatCard
          label="Open"
          value={stats?.open}
          color="bg-yellow-400"
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgress}
          color="bg-indigo-500"
        />
        <StatCard
          label="Resolved"
          value={stats?.resolved}
          color="bg-emerald-500"
        />
        <StatCard
          label="Closed"
          value={stats?.closed}
          color="bg-gray-400"
        />
        <StatCard
          label="Urgent"
          value={stats?.urgent}
          color="bg-red-500"
        />

        {/* Admin-only metrics */}
        {user?.role === "admin" && (
          <>
            <StatCard
              label="Total Users"
              value={stats?.totalUsers}
              color="bg-purple-500"
            />
            <StatCard
              label="Total Agents"
              value={stats?.totalAgents}
              color="bg-violet-500"
            />
          </>
        )}
      </div>
    </div>
  );
}
