/**
 * Settings Page - Premium UI
 * Allows users to update their profile and change their password.
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, changePassword } from "../../features/auth/authSlice";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  // Profile form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: ""
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setForm({ ...form, avatar: compressedDataUrl });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(form)).unwrap();
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    try {
      await dispatch(changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })).unwrap();
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err || "Failed to change password");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-500 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your profile details and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Forms) */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Profile Card */}
          <div className="app-card overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">Update your basic profile details and profile picture.</p>
            </div>
            
            <form onSubmit={handleSubmitProfile} className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white text-2xl overflow-hidden shrink-0 ring-4 ring-white shadow-lg">
                  {form.avatar ? (
                    <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    form.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors file:cursor-pointer cursor-pointer border border-slate-200 rounded-lg p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white outline-none transition-all placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white outline-none transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Security Card */}
          <div className="app-card overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900">Security</h2>
              <p className="text-xs text-slate-500 mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
            </div>
            
            <form onSubmit={handleSubmitPassword} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (Info) */}
        <div className="md:col-span-1 space-y-6">
          <div className="app-card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Role Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-slate-900 capitalize">{user?.role} Access</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Account Created</p>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Just now"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
