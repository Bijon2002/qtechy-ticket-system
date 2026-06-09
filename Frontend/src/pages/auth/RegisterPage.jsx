/**
 * Register Page - Premium UI with Video Background
 * Allows new users to create an account.
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    dispatch(registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role
    }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#0f1728]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/back.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md fade-in-up">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Create Account</h1>
          <p className="text-slate-300 mt-2 font-medium drop-shadow">Join QTechy Ticket Manager</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-t border-white/20 backdrop-blur-md bg-slate-900/40">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3 animate-pulse">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-semibold text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 ml-1 drop-shadow">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="premium-input bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10"
                required
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 ml-1 drop-shadow">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="premium-input bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10"
                required
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 ml-1 drop-shadow">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="premium-input bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 ml-1 drop-shadow">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="premium-input bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 ml-1 drop-shadow">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="premium-input bg-white/5 border-white/10 text-white focus:bg-white/10 w-full [&>option]:bg-slate-800"
                required
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2 shadow-blue-900/50">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-sm text-slate-300 drop-shadow">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors ml-1 drop-shadow">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
