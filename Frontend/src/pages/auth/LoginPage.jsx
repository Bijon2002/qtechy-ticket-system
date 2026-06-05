/**
 * Login Page
 * Renders the login form and handles user authentication.
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Extract auth state from Redux store
  const { loading, error } = useSelector((state) => state.auth);
  
  // Local form state
  const [form, setForm] = useState({ 
    email: "", 
    password: "" 
  });
  
  /**
   * Handle input changes and update local state
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
    
  /**
   * Handle form submission for login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Dispatch the async login thunk
    const res = await dispatch(loginUser(form));
    
    // Redirect to dashboard on successful login
    if (loginUser.fulfilled.match(res)) {
      navigate("/dashboard");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        
        {/* Display Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          No account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
