/**
 * Edit Ticket Page
 * Allows admins to modify ticket properties (e.g. status, priority).
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateTicketAPI, fetchTicketAPI } from "../../api/ticketAPI";
import { fetchUsersAPI } from "../../api/userAPI";

export default function EditTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Extract auth token and user
  const { token, user } = useSelector((state) => state.auth);

  // Local form state for the ticket being edited
  const [form, setForm] = useState(null);
  const [agents, setAgents] = useState([]);

  // Fetch ticket details on component mount
  useEffect(() => {
    fetchTicketAPI(token, id).then((res) => {
      const ticket = res.data.data;
      setForm({
        ...ticket,
        assignedTo: ticket.assignedTo?._id || ticket.assignedTo || "",
      });
    });

    if (user?.role === "admin") {
      fetchUsersAPI(token, { role: "agent", limit: 100 }).then((res) => {
        setAgents(res.data.data.users || []);
      });
    }
  }, [id, token, user]);

  /**
   * Handle form submission for updating the ticket
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTicketAPI(token, id, form);

    // Redirect back to the ticket detail page
    navigate(`/tickets/${id}`);
  };

  // Loading state
  if (!form) {
    return <p className="p-6">Loading ticket details...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-slate-200 mt-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-extrabold mb-6 text-slate-900 tracking-tight">Edit Ticket</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Title
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 shadow-sm"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 shadow-sm"
            rows={4}
            required
          />
        </div>

        {/* Category, Priority, and Status Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-2">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            >
              {[
                "Bug",
                "Feature Request",
                "Technical Issue",
                "Payment Issue",
                "Account Issue",
                "Other",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-2">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            >
              {["Low", "Medium", "High", "Urgent"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            >
              {["Open", "In Progress", "Resolved", "Closed"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {user?.role === "admin" && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-2">
                Assign To
              </label>
              <select
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              >
                <option value="">-- Unassigned --</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 mt-2 border-t border-slate-200">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex-1"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-lg border border-slate-200 transition-colors shadow-sm flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
