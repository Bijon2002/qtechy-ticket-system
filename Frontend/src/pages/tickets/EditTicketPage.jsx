import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicketAPI } from '../../api/ticketAPI';
import { fetchTicketAPI } from '../../api/ticketAPI';
export default function EditTicketPage() {
const { id } = useParams();
const navigate = useNavigate();
const token = useSelector((s) => s.auth.token);
const [form, setForm] = useState(null);
useEffect(() => {
fetchTicketAPI(token, id).then(r => setForm(r.data.data));
}, [id]);
const handleSubmit = async (e) => {
e.preventDefault();
await updateTicketAPI(token, id, form);
navigate(`/tickets/${id}`);
};
if (!form) return <p>Loading...</p>;
return (
<div className='max-w-xl mx-auto p-6'>
<h1 className='text-xl font-bold mb-4'>Edit Ticket</h1>
<form onSubmit={handleSubmit} className='space-y-4'>
<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
className='w-full border rounded px-3 py-2' />
<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
className='w-full border rounded px-3 py-2' rows={4} />
{/* priority, category, status selects same pattern */}
<button type='submit' className='bg-blue-600 text-white px-6 py-2 rounded'>Save</button>
</form>
</div>
);
}
