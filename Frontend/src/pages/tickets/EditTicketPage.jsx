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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-6">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Edit Ticket</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        {/* Description Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            rows={4}
            required
          />
        </div>
        
        {/* Category, Priority, and Status Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
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
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
            >
              {["Low", "Medium", "High", "Urgent"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
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
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Assign To
              </label>
              <select
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
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
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-100 border text-gray-700 px-6 py-2 rounded hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
