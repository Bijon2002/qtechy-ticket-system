/**
 * Register Page
 * Renders the registration form for new users to create accounts.
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../features/auth/authSlice";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Extract auth state from Redux store
  const { loading, error } = useSelector((state) => state.auth);

  // Local form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role
  });

  /**
   * Handle input changes and update local state
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission for registration
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Dispatch the async register thunk
    const res = await dispatch(registerUser(form));
    
    // Redirect to dashboard on successful registration
    if (registerUser.fulfilled.match(res)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full text-left">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h1>
        
        {/* Display Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="user">User (Submit tickets)</option>
              <option value="agent">Agent (Handle tickets)</option>
              <option value="admin">Admin (Manage system)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors mt-2 font-medium"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
