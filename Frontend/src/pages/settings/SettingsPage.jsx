import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../features/auth/authSlice";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: ""
  });

  // Populate form with current user data on load
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(form)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900 tracking-tight">Settings</h1>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-200 pb-4">Profile Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview & URL Input */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white overflow-hidden shrink-0 shadow-md">
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-slate-400">{form.name.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Picture URL</label>
              <input
                type="url"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 shadow-sm"
              />
              <p className="text-xs text-slate-500 mt-2">Paste a direct image link (e.g., from Imgur) to update your profile picture.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
