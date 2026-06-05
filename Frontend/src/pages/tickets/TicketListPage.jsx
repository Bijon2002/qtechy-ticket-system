/**
 * Ticket List Page
 * Displays a paginated, filterable, and sortable list of tickets.
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets, deleteTicket } from "../../features/tickets/ticketSlice";
import { useNavigate } from "react-router-dom";

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
        <h1 className="text-2xl font-bold text-gray-800">Tickets</h1>
        
        {/* Only Admin and User roles can create tickets */}
        {(user?.role === "admin" || user?.role === "user") && (
          <button
            onClick={() => navigate("/tickets/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium shadow-sm"
          >
            + New Ticket
          </button>
        )}
      </div>
      
      {/* Search & Filters Section */}
      <div className="flex gap-3 mb-6 flex-wrap bg-white p-4 rounded-xl shadow-sm">
        <input
          placeholder="Search tickets..."
          value={params.search}
          onChange={handleSearch}
          className="border rounded px-3 py-2 flex-1 min-w-[200px] focus:outline-none focus:border-blue-500"
        />
        <select
          value={params.status}
          onChange={(e) =>
            setParams((p) => ({ ...p, status: e.target.value, page: 1 }))
          }
          className="border rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-white min-w-[150px]"
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
          className="border rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-white min-w-[150px]"
        >
          <option value="">All Priorities</option>
          {["Low", "Medium", "High", "Urgent"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      
      {/* Data Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b">
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
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    Loading tickets...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No tickets found matching your criteria.
                  </td>
                </tr>
              ) : (
                list.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-blue-600">
                      {ticket.ticketNumber}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {ticket.title}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {ticket.category}
                    </td>
                    <td className="px-5 py-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/tickets/${ticket._id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                      >
                        View
                      </button>
                      
                      {/* Admin-only actions */}
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => navigate(`/tickets/${ticket._id}/edit`)}
                            className="text-emerald-600 hover:text-emerald-900 mr-3 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if(window.confirm("Are you sure you want to delete this ticket?")) {
                                dispatch(deleteTicket(ticket._id));
                              }
                            }}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        </>
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
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{list.length}</span> of <span className="font-medium">{total}</span> tickets
          </p>
          <div className="flex gap-2 items-center">
            <button
              disabled={params.page <= 1}
              onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
              className="px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600 font-medium">
              Page {params.page} of {pages || 1}
            </span>
            <button
              disabled={params.page >= pages}
              onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
              className="px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Badge for Ticket Priority
 */
const PriorityBadge = ({ priority }) => {
  const colors = {
    Low: "bg-gray-100 text-gray-800",
    Medium: "bg-blue-100 text-blue-800",
    High: "bg-orange-100 text-orange-800",
    Urgent: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[priority] || colors.Low}`}>
      {priority}
    </span>
  );
};

/**
 * Reusable Badge for Ticket Status
 */
const StatusBadge = ({ status }) => {
  const colors = {
    Open: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Resolved: "bg-emerald-100 text-emerald-800",
    Closed: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.Open}`}>
      {status}
    </span>
  );
};
