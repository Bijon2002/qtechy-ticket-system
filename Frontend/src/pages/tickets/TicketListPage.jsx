/**
 * Ticket List Page - Premium UI
 * Displays a paginated, filterable, and sortable list of tickets.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets, deleteTicket, updateTicket } from "../../features/tickets/ticketSlice";
import { fetchUsers } from "../../features/users/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import CreateTicketModal from "../../components/CreateTicketModal";

const priorityConfig = {
  Low:    { bg: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  Medium: { bg: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  High:   { bg: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  Urgent: { bg: "bg-red-50 text-red-700", dot: "bg-red-500" },
};

const statusConfig = {
  Open:         { bg: "bg-red-50 text-red-700 border border-red-200", dot: "bg-red-500" },
  "In Progress":{ bg: "bg-indigo-50 text-indigo-700 border border-indigo-200", dot: "bg-indigo-500" },
  Resolved:     { bg: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  Closed:       { bg: "bg-slate-100 text-slate-500 border border-slate-200", dot: "bg-slate-400" },
};

export default function TicketListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, total, pages, loading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);
  const { list: agents } = useSelector((state) => state.users);

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    priority: "",
    sort: "-createdAt",
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTickets(params));
  }, [params, dispatch]);

  useEffect(() => {
    if (user?.role === "admin") {
      dispatch(fetchUsers({ limit: 100 }));
    }
  }, [user, dispatch]);

  const handleSearch = (e) => {
    setParams((p) => ({ ...p, search: e.target.value, page: 1 }));
  };

  return (
    <div className="p-6 md:p-8 space-y-6 fade-in-up">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tickets</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} total tickets in the system</p>
        </div>
        {(user?.role === "admin" || user?.role === "user") && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="app-card p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[220px] relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search by title or ticket number..."
            value={params.search}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder-slate-400"
          />
        </div>

        {/* Status Filter */}
        <select
          value={params.status}
          onChange={(e) => setParams((p) => ({ ...p, status: e.target.value, page: 1 }))}
          className="border border-slate-200 bg-slate-50 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all font-medium min-w-[140px]"
        >
          <option value="">All Statuses</option>
          {["Open", "In Progress", "Resolved", "Closed"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={params.priority}
          onChange={(e) => setParams((p) => ({ ...p, priority: e.target.value, page: 1 }))}
          className="border border-slate-200 bg-slate-50 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all font-medium min-w-[140px]"
        >
          <option value="">All Priorities</option>
          {["Low", "Medium", "High", "Urgent"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Table Card */}
      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {(user?.role === "admin" 
                  ? ["#", "Title", "Category", "Priority", "Status", "Created By", "Assigned To", "Created", "Actions"]
                  : ["#", "Title", "Category", "Priority", "Status", "Assigned To", "Created", "Actions"]
                ).map((h) => (
                  <th key={h} className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {[...Array(user?.role === "admin" ? 9 : 8)].map((_, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-4 rounded shimmer" style={{ width: `${60 + (j * 7) % 30}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === "admin" ? 9 : 8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-slate-400 font-medium text-sm">No tickets found</p>
                      <p className="text-slate-400 text-xs">Try changing your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((ticket, idx) => (
                  <tr
                    key={ticket._id}
                    className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* Ticket # */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                        {ticket.ticketNumber}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-3 py-3 max-w-[140px]">
                      <button 
                        onClick={() => navigate(`/tickets/${ticket._id}`)}
                        className="text-xs font-semibold text-slate-900 truncate hover:text-blue-600 transition-colors text-left w-full hover:underline" 
                        title={ticket.title}
                      >
                        {ticket.title}
                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-slate-500 text-[11px] font-medium">{ticket.category}</span>
                    </td>

                    {/* Priority */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityConfig[ticket.priority]?.bg || "bg-slate-100 text-slate-600"}`}>
                        <span className={`w-1 h-1 rounded-full ${priorityConfig[ticket.priority]?.dot || "bg-slate-400"}`} />
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusConfig[ticket.status]?.bg || "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                        <span className={`w-1 h-1 rounded-full ${statusConfig[ticket.status]?.dot || "bg-slate-400"}`} />
                        {ticket.status}
                      </span>
                    </td>

                    {/* Created By (Only for Admin) */}
                    {user?.role === "admin" && (
                      <td className="px-3 py-3 min-w-[140px]">
                        {ticket.createdBy ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white text-[10px] overflow-hidden shrink-0 ring-1 ring-white">
                              {ticket.createdBy.avatar ? (
                                <img src={ticket.createdBy.avatar} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                ticket.createdBy.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[80px]" title={ticket.createdBy.name}>
                              {ticket.createdBy.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 italic">Unknown</span>
                        )}
                      </td>
                    )}

                    {/* Assigned To */}
                    <td className="px-3 py-3 min-w-[140px]">
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white text-[10px] overflow-hidden shrink-0 ring-1 ring-white">
                            {ticket.assignedTo.avatar ? (
                              <img src={ticket.assignedTo.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              ticket.assignedTo.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[80px]" title={ticket.assignedTo.name}>
                            {ticket.assignedTo.name}
                          </span>
                        </div>
                      ) : user?.role === "admin" ? (
                        <select
                          onChange={(e) => {
                            dispatch(updateTicket({ id: ticket._id, data: { assignedTo: e.target.value } }));
                            toast.success("Ticket assigned!");
                          }}
                          defaultValue=""
                          className="text-[10px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition-colors w-full"
                        >
                          <option value="" disabled>+ Assign</option>
                          {agents.filter(a => a.role === "agent").map((a) => (
                            <option key={a._id} value={a._id}>{a.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => navigate(`/tickets/${ticket._id}`)}
                          className="px-2 py-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-colors border border-blue-100"
                        >
                          View
                        </button>
                        {(user?.role === "admin" || user?.role === "agent") && (
                          <button
                            onClick={() => navigate(`/tickets/${ticket._id}/edit`)}
                            title="Edit ticket"
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        {user?.role === "admin" && (
                          <button
                            onClick={() => setDeleteConfirmId(ticket._id)}
                            title="Delete ticket"
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && list.length > 0 && (
          <div className="flex justify-between items-center px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-700">{list.length}</span> of <span className="font-bold text-slate-700">{total}</span> tickets
            </p>
            <div className="flex gap-2 items-center">
              <button
                disabled={params.page <= 1}
                onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
              >
                ← Previous
              </button>
              <span className="px-3 py-1.5 text-xs text-slate-500 font-medium bg-white border border-slate-200 rounded-lg">
                {params.page} / {pages || 1}
              </span>
              <button
                disabled={params.page >= pages}
                onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      {user?.role === "agent" && (
        <div className="mt-10 border-t border-slate-200 pt-8">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Board
            </h2>
          </div>
          
          {loading ? (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 md:overflow-visible">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-[85vw] shrink-0 md:w-auto md:shrink bg-slate-50/80 rounded-lg p-3 min-h-[400px] border border-slate-200/60 snap-center">
                  <div className="h-4 w-24 bg-slate-200 rounded mb-4 shimmer"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-24 bg-white rounded-md shimmer border border-slate-200"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 md:overflow-visible scrollbar-hide">
              {["Open", "In Progress", "Resolved", "Closed"].map((colStatus) => (
                <div 
                  key={colStatus}
                  className="w-[85vw] shrink-0 md:w-auto md:shrink bg-[#f8fafc] rounded-lg p-3 min-h-[500px] border border-slate-200 flex flex-col snap-center transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("bg-slate-100", "border-blue-300");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("bg-slate-100", "border-blue-300");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("bg-slate-100", "border-blue-300");
                    const ticketId = e.dataTransfer.getData("ticketId");
                    if (ticketId) {
                      const ticket = list.find(t => t._id === ticketId);
                      if (ticket && ticket.status !== colStatus) {
                        dispatch(updateTicket({ id: ticketId, data: { status: colStatus } }));
                        toast.success(`Moved to ${colStatus}`);
                      }
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        colStatus === 'Open' ? 'bg-red-500' :
                        colStatus === 'In Progress' ? 'bg-blue-500' :
                        colStatus === 'Resolved' ? 'bg-green-500' : 'bg-slate-400'
                      }`} />
                      {colStatus}
                    </h3>
                    <span className="bg-slate-200/70 text-slate-600 font-medium px-2 py-0.5 rounded text-xs">
                      {list.filter(t => t.status === colStatus).length}
                    </span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {list.filter(t => t.status === colStatus).map((ticket) => (
                      <div
                        key={ticket._id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("ticketId", ticket._id);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        className="bg-white rounded-md p-3 cursor-grab active:cursor-grabbing shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                            {ticket.ticketNumber}
                          </span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${priorityConfig[ticket.priority]?.bg || "bg-slate-100 text-slate-600"}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => navigate(`/tickets/${ticket._id}`)}
                          className="text-sm font-medium text-slate-900 mb-3 text-left w-full hover:text-blue-600 line-clamp-2"
                        >
                          {ticket.title}
                        </button>
                        
                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-xs text-slate-500 truncate max-w-[120px]">
                            {ticket.category}
                          </span>
                          {ticket.assignedTo ? (
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-medium text-slate-600 text-[10px] overflow-hidden border border-slate-200" title={ticket.assignedTo.name}>
                              {ticket.assignedTo.avatar ? (
                                <img src={ticket.assignedTo.avatar} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                ticket.assignedTo.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">Unassigned</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {list.filter(t => t.status === colStatus).length === 0 && (
                      <div className="h-24 flex items-center justify-center border border-dashed border-slate-300 rounded-md bg-slate-50/50">
                        <span className="text-sm text-slate-400">Drop tickets here</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-sm w-full fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete this ticket?</h3>
                <p className="text-slate-500 text-xs mt-0.5">This action is permanent and cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-sm shadow-red-200"
                onClick={() => {
                  dispatch(deleteTicket(deleteConfirmId));
                  setDeleteConfirmId(null);
                  toast.success("Ticket deleted");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <CreateTicketModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
