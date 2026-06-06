/**
 * Create Ticket Page
 * Renders a form for users to submit new support tickets.
 */

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../features/tickets/ticketSlice";

export default function CreateTicketPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Bug",
    priority: "Medium",
  });

  // UI state for loading and errors
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handle input changes and update local state
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission for creating a new ticket
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Dispatch the async thunk to create a ticket
      const res = await dispatch(createTicket(form));

      // On success, redirect to the ticket list
      if (createTicket.fulfilled.match(res)) {
        navigate("/tickets");
      } else {
        // On rejection, set the error message from the payload
        setError(res.payload || "Failed to create ticket");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-slate-200 mt-6 text-left animate-in fade-in duration-500">
      <h1 className="text-2xl font-extrabold mb-6 text-slate-900 tracking-tight">
        Create New Ticket
      </h1>

      {/* Display Error Message */}
      {error && <p className="text-red-600 font-medium text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Short summary of the issue"
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
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your issue in detail"
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 shadow-sm"
            rows={5}
            required
          />
        </div>

        {/* Category & Priority Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-2">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
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
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            >
              {["Low", "Medium", "High", "Urgent"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 mt-2 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex-1"
          >
            {loading ? "Creating..." : "Submit Ticket"}
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
