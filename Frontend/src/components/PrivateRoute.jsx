/**
 * Private Route Guard
 * Ensures that only authenticated users (those with a token) can access the 
 * wrapped components. Unauthenticated users are redirected to the login page.
 */

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  // Render children if authenticated, otherwise redirect to login
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
