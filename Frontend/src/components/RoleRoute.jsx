/**
 * Role Route Guard
 * Ensures that the authenticated user has one of the allowed roles 
 * to access the wrapped components.
 */

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, roles }) => {
  const { user, token } = useSelector((state) => state.auth);
  
  // Fallback if not authenticated at all
  if (!token) return <Navigate to="/login" replace />;
  
  // If the user's role is not in the allowed list, redirect to their dashboard
  if (!roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, render the children components
  return children;
};

export default RoleRoute;
