/**
 * Dashboard Page - Premium UI
 * Shows real-time system metrics, recent tickets, and active agents.
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../../features/dashboard/dashboardSlice';
import { fetchTickets } from '../../features/tickets/ticketSlice';
import { fetchUsers } from '../../features/users/userSlice';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const statCards = [
  {
    key: "total",
    label: "Total Tickets",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: "text-blue-600 bg-blue-50",
  },
  {
    key: "open",
    label: "Open Tickets",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: "text-red-600 bg-red-50",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "totalAgents",
    label: "Total Agents",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "text-violet-600 bg-violet-50",
  },
];

const priorityDot = {
  Urgent: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-blue-500",
  Low: "bg-slate-400",
};

const statusPill = {
  Open: "bg-red-50 text-red-700 border border-red-200",
  "In Progress": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Closed: "bg-slate-100 text-slate-500 border border-slate-200",
};

export default function DashboardPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const { stats, loading: statsLoading } = useSelector((s) => s.dashboard);
  const { list: recentTickets, loading: ticketsLoading } = useSelector((s) => s.tickets);
  const { list: agentsList } = useSelector((s) => s.users);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchTickets({ limit: 5, sort: "-createdAt" }));
    if (user?.role === 'admin') dispatch(fetchUsers({ role: 'agent', limit: 6 }));
  }, [dispatch, user]);

  const isLoading = statsLoading || ticketsLoading;

  const ticketData = [
    { name: 'Open', value: stats?.open || 0, color: 'url(#colorOpen)' },
    { name: 'In Progress', value: stats?.inProgress || 0, color: 'url(#colorInProgress)' },
    { name: 'Resolved', value: stats?.resolved || 0, color: 'url(#colorResolved)' },
    { name: 'Closed', value: stats?.closed || 0, color: 'url(#colorClosed)' },
  ];

  const priorityData = [
    { name: 'Urgent', value: stats?.urgent || 0 },
    { name: 'Standard', value: Math.max(0, (stats?.total || 0) - (stats?.urgent || 0)) },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 text-sm fade-in-up">
          <p className="font-bold text-slate-800">{payload[0].name}</p>
          <p className="text-slate-500 mt-1">
            <span className="font-bold text-slate-900">{payload[0].value}</span> tickets
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 space-y-6 fade-in-up">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening across the system.</p>
        </div>
        <button
          onClick={() => dispatch(fetchStats())}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.key} className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              {isLoading ? (
                <div className="h-6 w-16 rounded shimmer mt-1" />
              ) : (
                <p className="text-2xl font-bold text-slate-900 leading-none mt-1">
                  {stats?.[card.key] ?? 0}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden group hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />
          <h3 className="text-base font-black text-slate-900 tracking-tight">Ticket Status</h3>
          <p className="text-xs font-medium text-slate-500 mb-6">Current distribution of all tickets</p>
          <div className="h-[260px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="colorOpen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={1} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorInProgress" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorClosed" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={1} />
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Pie
                  data={ticketData}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {ticketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} cursor={false} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden group hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors duration-500" />
          <h3 className="text-base font-black text-slate-900 tracking-tight">Workload Priority</h3>
          <p className="text-xs font-medium text-slate-500 mb-6">Urgent vs Standard tickets</p>
          <div className="h-[260px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUrgent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Urgent' ? 'url(#colorUrgent)' : 'url(#colorStandard)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Recent Tickets</h2>
            <Link to="/tickets" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="space-y-2.5">
            {ticketsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="app-card p-4 h-20 shimmer" />
              ))
            ) : recentTickets?.length > 0 ? (
              recentTickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/tickets/${ticket._id}`}
                  className="app-card flex items-center gap-4 p-4 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200 group block"
                >
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${priorityDot[ticket.priority] || "bg-slate-300"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{ticket.ticketNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusPill[ticket.status] || statusPill.Open}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">{ticket.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {ticket.assignedTo ? `Assigned to ${ticket.assignedTo.name}` : "Unassigned"} · {ticket.category}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-[11px] text-slate-400 whitespace-nowrap font-medium">
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="app-card flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400 font-medium">No tickets yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Active Agents */}
        <div className="space-y-4">
          {/* Active Agents - Admin only */}
          {user?.role === 'admin' && (
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-bold text-slate-900">Active Agents</h2>
              <div className="app-card p-5 space-y-4">
                {agentsList?.length > 0 ? agentsList.map((agent) => (
                  <div key={agent._id} className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center font-bold text-white text-sm overflow-hidden ring-2 ring-white shadow-sm">
                        {agent.avatar ? (
                          <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                        ) : agent.name.charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{agent.name}</p>
                      <p className="text-xs text-slate-400 truncate">{agent.email}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      Active
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 text-center py-4">No agents found.</p>
                )}

                <Link
                  to="/users"
                  className="block text-center w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-100 transition-colors"
                >
                  Manage All Staff →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
