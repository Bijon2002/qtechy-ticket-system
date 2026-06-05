import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../../features/tickets/ticketSlice';
import { useNavigate } from 'react-router-dom';
export default function TicketListPage() {
const dispatch = useDispatch();
const navigate = useNavigate();
const { list, total, pages, loading } = useSelector(s => s.tickets);
const { user } = useSelector(s => s.auth);
const [params, setParams] = useState({ page:1, limit:10, search:'', status:'', priority:'',
sort:'-createdAt' });
useEffect(() => { dispatch(fetchTickets(params)); }, [params]);
const handleSearch = (e) => setParams(p => ({ ...p, search: e.target.value, page: 1 }));
return (
<div className='p-6'>
<div className='flex justify-between mb-4'>
<h1 className='text-xl font-bold'>Tickets</h1>
{(user?.role==='admin'||user?.role==='user') &&
<button onClick={()=>navigate('/tickets/create')} className='bg-blue-600 text-white px-4 py-2 rounded'>
+ New Ticket
</button>}
</div>
{/* Search + Filters */}
<div className='flex gap-3 mb-4 flex-wrap'>
<input placeholder='Search...' value={params.search} onChange={handleSearch}
className='border rounded px-3 py-2 flex-1 min-w-[150px]' />
<select value={params.status} onChange={e=>setParams(p=>({...p,status:e.target.value,page:1}))}
className='border rounded px-3 py-2'>
<option value=''>All Status</option>
{['Open','In Progress','Resolved','Closed'].map(s=><option key={s}>{s}</option>)}
</select>
<select value={params.priority} onChange={e=>setParams(p=>({...p,priority:e.target.value,page:1}))}
className='border rounded px-3 py-2'>
<option value=''>All Priority</option>
{['Low','Medium','High','Urgent'].map(p=><option key={p}>{p}</option>)}
</select>
</div>
{/* Table */}
<div className='bg-white rounded-xl shadow overflow-x-auto'>
<table className='w-full text-sm'>
<thead className='bg-gray-50 text-gray-500 uppercase text-xs'>
<tr></tr>
{['#','Title','Category','Priority','Status','Created','Actions'].map(h=>(
<th key={h} className='px-4 py-3 text-left'>{h}</th>
))}
</tr>
</thead>
<tbody>
{loading ? (
<tr><td colSpan={7} className='text-center py-6'>Loading...</td></tr>
) : list.map(t => (
<tr key={t._id} className='border-t hover:bg-gray-50'>
<td className='px-4 py-3 font-mono text-xs text-blue-500'>{t.ticketNumber}</td>
<td className='px-4 py-3'>{t.title}</td>
<td className='px-4 py-3'>{t.category}</td>
<td className='px-4 py-3'><PriorityBadge p={t.priority} /></td>
<td className='px-4 py-3'><StatusBadge s={t.status} /></td>
<td className='px-4 py-3 text-xs text-gray-400'>{new Date(t.createdAt).toLocaleDateString()}</td>
<td className='px-4 py-3'>
<button onClick={()=>navigate(`/tickets/${t._id}`)} className='text-blue-600 mr-2'>View</button>
{user?.role==='admin' && <>
<button onClick={()=>navigate(`/tickets/${t._id}/edit`)} className='text-green-600 mr-2'>Edit</button>
<button onClick={()=>dispatch(deleteTicket(t._id))} className='text-red-500'>Del</button>
</>}
</td>
</tr>
))}
</tbody>
</table>
</div>
{/* Pagination */}
<div className='flex justify-between items-center mt-4'>
<p className='text-sm text-gray-500'>Showing {list.length} of {total}</p>
<div className='flex gap-2'>
<button disabled={params.page<=1} onClick={()=>setParams(p=>({...p,page:p.page-1}))}
className='px-3 py-1 border rounded disabled:opacity-40'>Prev</button>
<span className='px-3 py-1'>{params.page} / {pages}</span>
<button disabled={params.page>=pages} onClick={()=>setParams(p=>({...p,page:p.page+1}))}
className='px-3 py-1 border rounded disabled:opacity-40'>Next</button>
</div>
</div>
</div>
);
}
const PriorityBadge = ({ p }) => {
const c={Low:'bg-gray-100',Medium:'bg-blue-100 text-blue-700',High:'bg-orange-100
text-orange-700',Urgent:'bg-red-100 text-red-700'}
return <span className={`px-2 py-0.5 rounded text-xs font-medium ${c[p]}`}>{p}</span>;
};
const StatusBadge = ({ s }) => {
const c={Open:'bg-yellow-100 text-yellow-700','In Progress':'bg-blue-100
text-blue-700',Resolved:'bg-green-100 text-green-700',Closed:'bg-gray-100'}
return <span className={`px-2 py-0.5 rounded text-xs font-medium ${c[s]}`}>{s}</span>;
};