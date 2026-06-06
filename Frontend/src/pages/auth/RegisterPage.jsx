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
    <div className="min-h-screen flex items-center justify-center bg-mesh w-full text-left py-12">
      <div className="glass-panel p-10 rounded-3xl w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-8 text-center text-white tracking-tight">
          Create Account
        </h1>

        {/* Display Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="premium-input"
              required
            />
          </div>
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="premium-input"
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={handleChange}
              className="premium-input"
              minLength={6}
              required
            />
          </div>
          <div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="premium-input text-white"
            >
              <option value="user">User (Submit tickets)</option>
              <option value="agent">Agent (Handle tickets)</option>
              <option value="admin">Admin (Manage system)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-4"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-500 font-semibold hover:text-yellow-400 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
