import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTicket, fetchTickets } from "../features/tickets/ticketSlice";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";

export default function CreateTicketModal({ onClose }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Bug",
    priority: "Medium",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await dispatch(createTicket(form));
      if (createTicket.fulfilled.match(res)) {
        toast.success("Ticket created successfully!");
        // Refresh ticket list
        dispatch(fetchTickets({ page: 1, limit: 10, search: "", status: "", priority: "", sort: "-createdAt" }));
        onClose();
      } else {
        toast.error(res.payload || "Failed to create ticket");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-8 fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Form Header */}
        <div className="p-5 md:px-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create New Ticket</h2>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Submit a request to our support team.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 md:p-6">
          <form id="create-ticket-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Field */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Ticket Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Cannot access my billing dashboard"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 shadow-sm"
                required
              />
            </div>

            {/* Category & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-700 tracking-wider mb-2">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer font-semibold shadow-sm"
                  >
                    {["Bug", "Feature Request", "Technical Issue", "Payment Issue", "Account Issue", "Other"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-700 tracking-wider mb-2">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Priority Level
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer font-semibold shadow-sm"
                  >
                    {["Low", "Medium", "High", "Urgent"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Detailed Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Please describe the issue in as much detail as possible. Include steps to reproduce if applicable..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 resize-y shadow-sm"
                rows={5}
                required
              />
            </div>
          </form>
        </div>

        {/* Form Actions */}
        <div className="p-5 md:px-6 border-t border-slate-100 bg-slate-50 shrink-0 rounded-b-2xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors w-full sm:w-auto text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-ticket-form"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none w-full sm:w-auto"
          >
            {loading ? (
              "Creating..."
            ) : (
              <>
                Submit Ticket
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
