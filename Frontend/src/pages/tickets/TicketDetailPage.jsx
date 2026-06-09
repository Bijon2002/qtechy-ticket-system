/**
 * Ticket Detail Page - Premium UI
 * Displays full details of a ticket including status history and comments.
 */

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchTicketAPI, addCommentAPI } from "../../api/ticketAPI";
import { toast } from "react-hot-toast";

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

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    fetchTicketAPI(token, id)
      .then((res) => setTicket(res.data.data))
      .catch(() => toast.error("Failed to load ticket"));
  }, [token, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await addCommentAPI(token, id, comment);
      setComment("");
      load();
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        <div className="h-40 rounded-2xl app-card shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 rounded-2xl app-card shimmer" />
          <div className="md:col-span-1 h-64 rounded-2xl app-card shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Back Button & Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tickets
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ticket Header Card */}
          <div className={`app-card overflow-hidden border-t-[6px] ${
            ticket.status === 'Open' ? 'border-t-red-500' :
            ticket.status === 'In Progress' ? 'border-t-indigo-500' :
            ticket.status === 'Resolved' ? 'border-t-emerald-500' : 'border-t-slate-400'
          }`}>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {ticket.ticketNumber}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusConfig[ticket.status]?.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[ticket.status]?.dot}`} />
                  {ticket.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${priorityConfig[ticket.priority]?.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[ticket.priority]?.dot}`} />
                  {ticket.priority}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                {ticket.title}
              </h1>

              <div className="prose prose-slate prose-sm max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {ticket.createdBy?.avatar ? (
                      <img src={ticket.createdBy.avatar} alt="creator" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-slate-500">
                        {ticket.createdBy?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{ticket.createdBy?.name}</p>
                    <p className="text-xs text-slate-500 font-medium">Reporter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="app-card overflow-hidden flex flex-col min-h-[400px] max-h-[600px]">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Discussion ({ticket.comments?.length || 0})
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {ticket.comments?.length > 0 ? ticket.comments.map((c, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {c.user?.avatar ? (
                      <img src={c.user.avatar} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                      <span className="text-xs font-bold text-blue-700">{c.user?.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-bold text-slate-900">{c.user?.name}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {new Date(c.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{c.text}</p>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-slate-400">No comments yet</p>
                  <p className="text-xs text-slate-400 mt-1">Be the first to start the discussion.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-24 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white outline-none transition-all resize-none shadow-sm"
                  rows={2}
                />
                <button
                  onClick={handleComment}
                  disabled={!comment.trim() || loading}
                  className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? "Posting..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Data */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="app-card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assignee</p>
                {ticket.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {ticket.assignedTo.avatar ? (
                        <img src={ticket.assignedTo.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500">{ticket.assignedTo.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{ticket.assignedTo.name}</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-slate-400 italic">Unassigned</span>
                )}
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm font-semibold text-slate-900">{ticket.category}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Created</p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(ticket.createdAt).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="app-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Status History</h3>
            </div>
            <div className="p-6">
              {ticket.statusHistory?.length > 0 ? (
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                  {ticket.statusHistory.map((history, i) => (
                    <div key={i} className="relative pl-5">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-500" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{history.status}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          by <span className="font-semibold text-slate-700">{history.changedBy?.name}</span>
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
                          {new Date(history.changedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No status changes recorded.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
