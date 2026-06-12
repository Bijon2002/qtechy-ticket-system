import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordAPI, verifyResetCodeAPI, resetPasswordAPI } from "../../api/authAPI";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await forgotPasswordAPI({ email });
      setMessage(res.data.message || "Code sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await verifyResetCodeAPI({ email, code });
      setMessage("Code verified. Please set a new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await resetPasswordAPI({ email, code, newPassword });
      setMessage("Password reset successfully. You can now login.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
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
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Reset Password</h1>
          <p className="text-slate-300 mt-2 font-medium drop-shadow">Follow the steps to recover your account</p>
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

          {message && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-green-200">{message}</p>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 ml-1 drop-shadow">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="premium-input bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10 w-full"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2 shadow-blue-900/50">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send Reset Code"
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 ml-1 drop-shadow">Reset Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="premium-input bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10 w-full"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2 shadow-blue-900/50">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 ml-1 drop-shadow">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="premium-input bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 ml-1 drop-shadow">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="premium-input bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10 w-full"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2 shadow-blue-900/50">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-sm text-slate-300 drop-shadow">
              Remember your password?{" "}
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
