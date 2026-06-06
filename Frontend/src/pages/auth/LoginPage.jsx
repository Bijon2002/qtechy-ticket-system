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
    <div className="min-h-screen flex items-center justify-center bg-mesh">
      <div className="glass-panel p-10 rounded-3xl w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-8 text-center text-white tracking-tight">Welcome Back</h1>

        {/* Display Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="premium-input"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="premium-input"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          No account?{" "}
          <Link to="/register" className="text-yellow-500 font-semibold hover:text-yellow-400 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
