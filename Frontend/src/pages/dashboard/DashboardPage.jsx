import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../../features/dashboard/dashboardSlice';
import { fetchTickets } from '../../features/tickets/ticketSlice';
import { fetchUsers } from '../../features/users/userSlice';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { stats, loading: statsLoading } = useSelector((state) => state.dashboard);
  const { list: recentTickets, loading: ticketsLoading } = useSelector((state) => state.tickets);
  const { list: agentsList, loading: usersLoading } = useSelector((state) => state.users);

  useEffect(() => {
    // Fetch stats
    dispatch(fetchStats());
    
    // Fetch recent high priority tickets (limit 5)
    dispatch(fetchTickets({ limit: 5, sort: "-createdAt" }));
    
    // Fetch active agents if admin (limit 5)
    if (user?.role === 'admin') {
      dispatch(fetchUsers({ role: 'agent', limit: 5 }));
    }
  }, [dispatch, user]);

  const isLoading = statsLoading || ticketsLoading;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time performance metrics for QTechy Support Ecosystem.</p>
        </div>
        <button 
          onClick={() => dispatch(fetchStats())}
          className="flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 font-bold px-4 py-2 rounded-md text-xs tracking-wider shadow-sm transition-colors uppercase"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          REFRESH
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading dashboard data...</div>
      ) : (
        <>
          {/* Top Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* TOTAL TICKETS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">TOTAL TICKETS</p>
                  <p className="text-4xl font-black text-slate-900">{stats?.total || 0}</p>
                </div>
                <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                </div>
              </div>
            </div>

            {/* OPEN TICKETS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">OPEN TICKETS</p>
                  <p className="text-4xl font-black text-red-600">{stats?.open || 0}</p>
                </div>
                <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-[11px] font-bold">{stats?.urgent || 0} Urgent items</p>
              </div>
            </div>

            {/* RESOLVED TICKETS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">RESOLVED</p>
                  <p className="text-4xl font-black text-slate-900">{stats?.resolved || 0}</p>
                </div>
                <div className="w-10 h-10 rounded bg-orange-50 flex items-center justify-center text-orange-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </div>

            {/* ACTIVE AGENTS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">TOTAL AGENTS</p>
                  <p className="text-4xl font-black text-slate-900">{stats?.totalAgents || 0}</p>
                </div>
                <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={`grid grid-cols-1 ${user?.role === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
            
            {/* Left Column (Main Content) */}
            <div className={`${user?.role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-8`}>
              
              {/* Recent High Priority Tickets */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black text-slate-900">Recent Tickets</h2>
                  <Link to="/tickets" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    View All Tickets
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {recentTickets && recentTickets.length > 0 ? (
                    recentTickets.map(ticket => (
                      <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="bg-white border border-slate-200 rounded-lg p-5 relative overflow-hidden flex justify-between items-center shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className={`absolute top-0 left-0 bottom-0 w-1 ${ticket.priority === 'Urgent' ? 'bg-red-600' : ticket.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                        <div className="flex-1 pl-2">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-xs text-slate-400 font-mono">#{ticket._id.substring(ticket._id.length - 6).toUpperCase()}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase border 
                              ${ticket.priority === 'Urgent' ? 'border-red-200 bg-red-50 text-red-600' : 
                                ticket.priority === 'High' ? 'border-orange-200 bg-orange-50 text-orange-700' : 
                                'border-blue-200 bg-blue-50 text-blue-700'}`}>
                              {ticket.priority}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase border border-slate-200 bg-slate-50 text-slate-600">
                              {ticket.status}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{ticket.title}</h3>
                          <p className="text-sm text-slate-600">
                            Assigned to: <span className="text-slate-900 font-medium">{ticket.assignedTo?.name || 'Unassigned'}</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 shadow-sm">
                      No recent tickets found.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Sidebars) - Only for Admin */}
            {user?.role === 'admin' && (
              <div className="space-y-6">
                
                {/* Active Agents Card */}
                <div className="bg-[#0f172a] rounded-xl p-6 shadow-lg border border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white">Active Agents</h2>
                    <span className="border border-blue-800/50 bg-blue-900/40 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">
                      {stats?.totalAgents || 0} Total
                    </span>
                  </div>

                  <div className="space-y-5">
                    {usersLoading ? (
                      <p className="text-slate-400 text-sm">Loading agents...</p>
                    ) : agentsList && agentsList.length > 0 ? (
                      agentsList.map(agent => (
                        <div key={agent._id} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {agent.avatar ? (
                                <img className="w-9 h-9 rounded-full object-cover border border-slate-700 bg-slate-800" src={agent.avatar} alt={agent.name} />
                              ) : (
                                <div className="w-9 h-9 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                                  {agent.name.charAt(0)}
                                </div>
                              )}
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#0f172a]"></div>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-100">{agent.name}</p>
                              <p className="text-[11px] text-slate-400 font-medium truncate w-32">{agent.email}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">No agents found.</p>
                    )}
                  </div>

                  <Link to="/users" className="block text-center w-full mt-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded transition-colors tracking-widest uppercase">
                    Manage All Staff
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
