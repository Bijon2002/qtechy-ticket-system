import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
function App() {
return (
<BrowserRouter>
<Routes>
<Route path='/login' element={<LoginPage />} />
<Route path='/register' element={<RegisterPage />} />
<Route path='/dashboard' element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
<Route path='*' element={<Navigate to='/login' />} />
</Routes>
</BrowserRouter>
);
}
export default App;