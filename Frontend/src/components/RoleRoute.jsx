import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
const RoleRoute = ({ children, roles }) => {
const { user, token } = useSelector((s) => s.auth);
if (!token) return <Navigate to='/login' replace />;
if (!roles.includes(user?.role)) return <Navigate to='/dashboard' replace />;
return children;
};
export default RoleRoute;