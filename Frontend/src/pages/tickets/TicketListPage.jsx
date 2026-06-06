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
        <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>

        {/* Only Admin and User roles can create tickets */}
        {(user?.role === "admin" || user?.role === "user") && (
          <button
            onClick={() => navigate("/tickets/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            + New Ticket
          </button>
        )}
      </div>

      {/* Search & Filters Section */}
      <div className="flex gap-4 mb-6 flex-wrap bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <input
          placeholder="Search tickets..."
          value={params.search}
          onChange={handleSearch}
          className="border border-slate-300 bg-white text-slate-900 rounded-lg px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400"
        />
        <select
          value={params.status}
          onChange={(e) =>
            setParams((p) => ({ ...p, status: e.target.value, page: 1 }))
          }
          className="border border-slate-300 bg-white text-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] transition-all"
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
          className="border border-slate-300 bg-white text-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] transition-all"
        >
          <option value="">All Priorities</option>
          {["Low", "Medium", "High", "Urgent"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
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
                  <th key={header} className="px-5 py-4 font-bold tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
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
                  <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-blue-700 bg-blue-50 rounded-l-lg border-y border-transparent">
                      {ticket.ticketNumber}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {ticket.title}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">
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
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold">
                      <button
                        onClick={() => navigate(`/tickets/${ticket._id}`)}
                        className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                      >
                        View
                      </button>

                      {/* Admin and Agent actions */}
                      {(user?.role === "admin" || user?.role === "agent") && (
                        <button
                          onClick={() => navigate(`/tickets/${ticket._id}/edit`)}
                          className="text-emerald-600 hover:text-emerald-700 mr-3 transition-colors"
                        >
                          Edit
                        </button>
                      )}

                      {/* Admin-only actions */}
                      {user?.role === "admin" && (
                        <button
                          onClick={() => setDeleteConfirmId(ticket._id)}
                          className="text-red-600 hover:text-red-700 transition-colors ml-1"
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
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-900">{list.length}</span> of <span className="font-bold text-slate-900">{total}</span> tickets
          </p>
          <div className="flex gap-2 items-center">
            <button
              disabled={params.page <= 1}
              onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
              className="px-4 py-2 border border-slate-300 bg-white rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-slate-500 font-medium">
              Page {params.page} of {pages || 1}
            </span>
            <button
              disabled={params.page >= pages}
              onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
              className="px-4 py-2 border border-slate-300 bg-white rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-xl w-fit">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl tracking-tight mb-1">Delete Ticket?</h3>
                <p className="text-slate-500 text-sm">Are you sure you want to delete this ticket? This action cannot be undone and will permanently remove it from the system.</p>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors w-full sm:w-auto"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm w-full sm:w-auto"
                  onClick={() => {
                    dispatch(deleteTicket(deleteConfirmId));
                    setDeleteConfirmId(null);
                    toast.success("Ticket deleted successfully");
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
    Low: "bg-slate-100 text-slate-600 border border-slate-200",
    Medium: "bg-blue-50 text-blue-700 border border-blue-200",
    High: "bg-orange-50 text-orange-700 border border-orange-200",
    Urgent: "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${colors[priority] || colors.Low}`}>
      {priority}
    </span>
  );
};

/**
 * Reusable Badge for Ticket Status
 */
const StatusBadge = ({ status }) => {
  const colors = {
    Open: "bg-red-50 text-red-700 border border-red-200",
    "In Progress": "bg-indigo-50 text-indigo-700 border border-indigo-200",
    Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Closed: "bg-slate-100 text-slate-500 border border-slate-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${colors[status] || colors.Open}`}>
      {status}
    </span>
  );
};
