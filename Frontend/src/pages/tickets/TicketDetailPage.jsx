/**
 * Ticket Detail Page
 * Displays full details of a ticket including status history and comments.
 */

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchTicketAPI, addCommentAPI } from "../../api/ticketAPI";

export default function TicketDetailPage() {
  const { id } = useParams();

  // Extract auth token
  const token = useSelector((state) => state.auth.token);

  // Local state
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");

  /**
   * Fetch ticket details and load into state
   */
  const load = useCallback(() => {
    fetchTicketAPI(token, id).then((res) => setTicket(res.data.data));
  }, [token, id]);

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  /**
   * Handle comment submission
   */
  const handleComment = async () => {
    if (!comment.trim()) return;

    // Call the API to add the comment
    await addCommentAPI(token, id, comment);

    // Clear the input and reload ticket data
    setComment("");
    load();
  };

  // Loading state
  if (!ticket) {
    return <p className="p-6 text-slate-400">Loading ticket details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">

      {/* Ticket Header & Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400"></div>
        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
          {ticket.ticketNumber}
        </span>
        <h1 className="text-2xl font-extrabold mt-2 text-slate-900 tracking-tight">{ticket.title}</h1>
        <p className="text-slate-700 mt-3 whitespace-pre-wrap leading-relaxed">
          {ticket.description}
        </p>

        {/* Ticket Badges */}
        <div className="flex gap-3 mt-4">
          <span className="px-2 py-1 rounded text-xs font-bold tracking-wide uppercase border border-slate-200 bg-slate-50 text-slate-700">
            Status: {ticket.status}
          </span>
          <span className="px-2 py-1 rounded text-xs font-bold tracking-wide uppercase border border-slate-200 bg-slate-50 text-slate-700">
            Priority: {ticket.priority}
          </span>
          <span className="px-2 py-1 rounded text-xs font-bold tracking-wide uppercase border border-slate-200 bg-slate-50 text-slate-700">
            Category: {ticket.category}
          </span>
        </div>
      </div>

      {/* Status History Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-lg font-bold mb-4 text-slate-900 border-b border-slate-200 pb-2">Status History</h2>
        {ticket.statusHistory?.length > 0 ? (
          <div className="space-y-3">
            {ticket.statusHistory.map((history, i) => (
              <div key={i} className="text-sm text-slate-500 flex items-start gap-2">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                <div>
                  <b className="text-slate-900">{history.status}</b> by{" "}
                  <span className="font-medium text-slate-700">{history.changedBy?.name}</span>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">
                    {new Date(history.changedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No status changes recorded.</p>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-lg font-bold mb-4 text-slate-900 border-b border-slate-200 pb-2">Comments</h2>

        {/* Comment List */}
        <div className="space-y-4 mb-4">
          {ticket.comments?.map((c, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <b className="text-sm text-slate-900">{c.user?.name}</b>
                <span className="text-xs text-slate-500 font-medium">
                  {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.text}</p>
            </div>
          ))}

          {ticket.comments?.length === 0 && (
            <p className="text-sm text-slate-500 italic">No comments yet. Be the first to reply!</p>
          )}
        </div>

        {/* Add Comment Box */}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 shadow-sm resize-y"
            rows={3}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleComment}
              disabled={!comment.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
