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
  <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <p className="text-3xl font-bold mt-1 text-gray-800">{value ?? 0}</p>
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
        <p className="text-gray-500 text-lg">Loading dashboard data...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Tickets"
          value={stats?.total}
          color="border-blue-500"
        />
        <StatCard 
          label="Open" 
          value={stats?.open} 
          color="border-yellow-500" 
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgress}
          color="border-orange-500"
        />
        <StatCard
          label="Resolved"
          value={stats?.resolved}
          color="border-green-500"
        />
        <StatCard
          label="Closed"
          value={stats?.closed}
          color="border-gray-500"
        />
        <StatCard 
          label="Urgent" 
          value={stats?.urgent} 
          color="border-red-500" 
        />
        
        {/* Admin-only metrics */}
        {user?.role === "admin" && (
          <>
            <StatCard
              label="Total Users"
              value={stats?.totalUsers}
              color="border-purple-500"
            />
            <StatCard
              label="Total Agents"
              value={stats?.totalAgents}
              color="border-indigo-500"
            />
          </>
        )}
      </div>
    </div>
  );
}
