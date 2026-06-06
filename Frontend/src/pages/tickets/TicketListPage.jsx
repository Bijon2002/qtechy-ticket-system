/**
 * Ticket List Page
 * Displays a paginated, filterable, and sortable list of tickets.
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets, deleteTicket } from "../../features/tickets/ticketSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function TicketListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extract state from Redux store
  const { list, total, pages, loading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  // Local state for pagination, search, and filtering
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    priority: "",
    sort: "-createdAt",
  });

  // State for delete confirmation modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch tickets whenever params change
  useEffect(() => {
    dispatch(fetchTickets(params));
  }, [params, dispatch]);

  /**
   * Handle search input change (resets to page 1)
   */
  const handleSearch = (e) => {
    setParams((p) => ({ ...p, search: e.target.value, page: 1 }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Tickets</h1>

        {/* Only Admin and User roles can create tickets */}
        {(user?.role === "admin" || user?.role === "user") && (
          <button
            onClick={() => navigate("/tickets/create")}
            className="btn-primary"
          >
            + New Ticket
          </button>
        )}
      </div>

      {/* Search & Filters Section */}
      <div className="flex gap-4 mb-6 flex-wrap bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-800">
        <input
          placeholder="Search tickets..."
          value={params.search}
          onChange={handleSearch}
          className="border border-slate-700 bg-slate-800 text-white rounded-xl px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-yellow-600/30 transition-all placeholder-slate-500"
        />
        <select
          value={params.status}
          onChange={(e) =>
            setParams((p) => ({ ...p, status: e.target.value, page: 1 }))
          }
          className="border border-slate-700 bg-slate-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600/30 min-w-[150px] transition-all"
        >
          <option value="">All Statuses</option>
          {["Open", "In Progress", "Resolved", "Closed"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={params.priority}
          onChange={(e) =>
            setParams((p) => ({ ...p, priority: e.target.value, page: 1 }))
          }
          className="border border-slate-700 bg-slate-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600/30 min-w-[150px] transition-all"
        >
          <option value="">All Priorities</option>
          {["Low", "Medium", "High", "Urgent"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 rounded-2xl shadow overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs border-b border-slate-800">
              <tr>
                {[
                  "#",
                  "Title",
                  "Category",
                  "Priority",
                  "Status",
                  "Created",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="px-5 py-4 font-semibold tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Loading tickets...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    No tickets found matching your criteria.
                  </td>
                </tr>
              ) : (
                list.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-yellow-500 bg-yellow-500/10 rounded-l-lg">
                      {ticket.ticketNumber}
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">
                      {ticket.title}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">
                      {ticket.category}
                    </td>
                    <td className="px-5 py-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 font-medium">
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/tickets/${ticket._id}`)}
                        className="text-yellow-500 hover:text-yellow-400 mr-3 transition-colors"
                      >
                        View
                      </button>

                      {/* Admin and Agent actions */}
                      {(user?.role === "admin" || user?.role === "agent") && (
                        <button
                          onClick={() => navigate(`/tickets/${ticket._id}/edit`)}
                          className="text-emerald-400 hover:text-emerald-300 mr-3 transition-colors"
                        >
                          Edit
                        </button>
                      )}

                      {/* Admin-only actions */}
                      {user?.role === "admin" && (
                        <button
                          onClick={() => setDeleteConfirmId(ticket._id)}
                          className="text-red-500 hover:text-red-400 transition-colors font-semibold ml-1"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && list.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-slate-400">
            Showing <span className="font-medium text-white">{list.length}</span> of <span className="font-medium text-white">{total}</span> tickets
          </p>
          <div className="flex gap-2 items-center">
            <button
              disabled={params.page <= 1}
              onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
              className="px-4 py-2 border border-slate-700 rounded-md disabled:opacity-40 hover:bg-slate-800 transition-colors text-sm font-medium text-white"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-slate-400 font-medium">
              Page {params.page} of {pages || 1}
            </span>
            <button
              disabled={params.page >= pages}
              onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
              className="px-4 py-2 border border-slate-700 rounded-md disabled:opacity-40 hover:bg-slate-800 transition-colors text-sm font-medium text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-red-500 bg-red-500/10 p-3 rounded-xl w-fit">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-xl tracking-tight mb-1">Delete Ticket?</h3>
                <p className="text-slate-400 text-sm">Are you sure you want to delete this ticket? This action cannot be undone and will permanently remove it from the system.</p>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-800/50">
                <button
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors w-full sm:w-auto"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all shadow-lg shadow-red-900/20 w-full sm:w-auto"
                  onClick={() => {
                    dispatch(deleteTicket(deleteConfirmId));
                    setDeleteConfirmId(null);
                    toast.success("Ticket deleted successfully", {
                      style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid #334155'
                      }
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PriorityBadge = ({ priority }) => {
  const colors = {
    Low: "bg-slate-800 text-slate-300 border border-slate-700",
    Medium: "bg-blue-900/30 text-blue-400 border border-blue-800/50",
    High: "bg-orange-900/30 text-orange-400 border border-orange-800/50",
    Urgent: "bg-red-900/30 text-red-400 border border-red-800/50 shadow-sm",
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${colors[priority] || colors.Low}`}>
      {priority}
    </span>
  );
};

/**
 * Reusable Badge for Ticket Status
 */
const StatusBadge = ({ status }) => {
  const colors = {
    Open: "bg-yellow-900/30 text-yellow-400 border border-yellow-800/50",
    "In Progress": "bg-indigo-900/30 text-indigo-400 border border-indigo-800/50",
    Resolved: "bg-emerald-900/30 text-emerald-400 border border-emerald-800/50",
    Closed: "bg-slate-800 text-slate-400 border border-slate-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${colors[status] || colors.Open}`}>
      {status}
    </span>
  );
};
