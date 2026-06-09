/**
 * Create Ticket Page - Premium UI
 * Renders a form for users to submit new support tickets.
 */

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../features/tickets/ticketSlice";
import { toast } from "react-hot-toast";

export default function CreateTicketPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        navigate("/tickets");
      } else {
        toast.error(res.payload || "Failed to create ticket");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Ticket</h1>
        </div>
        <p className="text-sm text-slate-500 ml-13 pl-1">Submit a request to our support team and we'll get back to you shortly.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Form Header Card */}
        <div className="p-6 md:px-8 md:py-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Ticket Details</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Please provide as much context as possible.</p>
            </div>
          </div>
          <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-flex self-start sm:self-auto border border-blue-100">
            Support Form
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Title Field */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Ticket Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Cannot access my billing dashboard"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 shadow-sm"
              required
            />
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider mb-2.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer font-semibold shadow-sm"
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
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 tracking-wider mb-2.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Priority Level
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer font-semibold shadow-sm"
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
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Detailed Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Please describe the issue in as much detail as possible. Include steps to reproduce if applicable..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 resize-y shadow-sm"
              rows={7}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="pt-6 mt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full sm:w-auto text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none w-full sm:w-auto"
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
        </form>
      </div>
    </div>
  );
}
