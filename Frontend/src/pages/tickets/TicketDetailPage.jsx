import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchTicketAPI, addCommentAPI } from '../../api/ticketAPI';
export default function TicketDetailPage() {
const { id } = useParams();
const token = useSelector(s => s.auth.token);
const [ticket, setTicket] = useState(null);
const [comment, setComment] = useState('');
const load = () => fetchTicketAPI(token, id).then(r => setTicket(r.data.data));
useEffect(() => { load(); }, [id]);
const handleComment = async () => {
if (!comment.trim()) return;
await addCommentAPI(token, id, comment);
setComment('');
load(); // refresh without page reload
};
if (!ticket) return <p className='p-4'>Loading...</p>;
return (
<div className='max-w-2xl mx-auto p-6 space-y-6'>
{/* Ticket header */}
<div className='bg-white rounded-xl shadow p-4'>
<span className='text-xs text-gray-400'>{ticket.ticketNumber}</span>
<h1 className='text-xl font-bold'>{ticket.title}</h1>
<p className='text-gray-600 mt-2'>{ticket.description}</p>
<div className='flex gap-3 mt-3'>
<span className='badge'>{ticket.status}</span>
<span className='badge'>{ticket.priority}</span>
<span className='badge'>{ticket.category}</span>
</div>
</div>
{/* Status History */}
<div className='bg-white rounded-xl shadow p-4'>
<h2 className='font-bold mb-2'>Status History</h2>
{ticket.statusHistory.map((h, i) => (
<div key={i} className='text-sm text-gray-500 border-b py-1'>
<b>{h.status}</b> by {h.changedBy?.name} — {new Date(h.changedAt).toLocaleString()}
</div>
))}
</div>
{/* Comments */}
<div className='bg-white rounded-xl shadow p-4'>
<h2 className='font-bold mb-2'>Comments</h2>
{ticket.comments.map((c, i) => (
<div key={i} className='bg-gray-50 rounded p-3 mb-2'>
<b>{c.user?.name}</b>: {c.text}
</div>
))}
<textarea value={comment} onChange={e=>setComment(e.target.value)}

placeholder='Add a comment...' className='w-full border rounded p-2 mt-2' rows={3} />
<button onClick={handleComment} className='mt-2 bg-blue-600 text-white px-4 py-1 rounded'>
Submit
</button>
</div>
</div>
);
}
