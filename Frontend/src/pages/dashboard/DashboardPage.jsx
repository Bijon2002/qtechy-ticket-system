import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../../features/dashboard/dashboardSlice';
const StatCard = ({ label, value, color }) => (
<div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
<p className='text-gray-500 text-sm'>{label}</p>
<p className='text-3xl font-bold mt-1'>{value ?? 0}</p>
</div>
);
export default function DashboardPage() {
const dispatch = useDispatch();
const { stats, loading } = useSelector(s => s.dashboard);
const user = useSelector(s => s.auth.user);
useEffect(() => { dispatch(fetchStats()); }, []);
if (loading) return <p className='p-6'>Loading...</p>;
return (
<div className='p-6'>
<h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
<StatCard label='Total Tickets' value={stats?.total} color='border-blue-500' />
<StatCard label='Open' value={stats?.open} color='border-yellow-500' />
<StatCard label='In Progress' value={stats?.inProgress} color='border-orange-500' />
<StatCard label='Resolved' value={stats?.resolved} color='border-green-500' />
<StatCard label='Closed' value={stats?.closed} color='border-gray-500' />
<StatCard label='Urgent' value={stats?.urgent} color='border-red-500' />
{user?.role === 'admin' && <>
<StatCard label='Total Users' value={stats?.totalUsers} color='border-purple-500' />
<StatCard label='Total Agents' value={stats?.totalAgents} color='border-indigo-500' />
</>}
</div>
</div>
);
}
