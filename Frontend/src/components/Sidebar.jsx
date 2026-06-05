import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
const menuMap = {
admin: [
{ label: 'Dashboard', path: '/dashboard' },
{ label: 'All Tickets', path: '/tickets' },
{ label: 'User Management', path: '/users' },
],
agent: [
{ label: 'Dashboard', path: '/dashboard' },
{ label: 'Assigned Tickets', path: '/tickets' },
],
user: [
{ label: 'Dashboard', path: '/dashboard' },
{ label: 'My Tickets', path: '/tickets' },
{ label: 'Create Ticket', path: '/tickets/create' },
],
};
export default function Sidebar() {
const { user } = useSelector(s => s.auth);
const dispatch = useDispatch();
const menu = menuMap[user?.role] || [];
return (
<aside className='w-60 min-h-screen bg-gray-900 text-white flex flex-col p-4'>
<h2 className='text-xl font-bold mb-6'>QTechy</h2>
<nav className='flex-1 space-y-1'>
{menu.map(m => (
<NavLink key={m.path} to={m.path}
className={({isActive}) => `block px-3 py-2 rounded text-sm ${isActive ? 'bg-blue-600' :
'hover:bg-gray-700'}`}>
{m.label}
</NavLink>
))}
</nav>
<button onClick={()=>dispatch(logout())} className='mt-4 text-sm text-gray-400 hover:text-white text-left
px-3'>
Logout
</button>
</aside>
);
}
