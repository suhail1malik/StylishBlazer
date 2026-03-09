"use client";

import { useState } from "react";
import { User, Shield, LogOut, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface SettingsClientProps {
  initialUser: {
    name: string;
    email: string;
  };
}

export default function SettingsClient({ initialUser }: SettingsClientProps) {
  const [user, setUser] = useState(initialUser);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("profile");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(null);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    setLoading("password");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: "Password updated and sessions refreshed!" });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(null);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm("Are you sure? This will log you out from all other devices immediately.")) return;
    setLoading("logout-all");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/profile/logout-all", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: "Successfully logged out from all other devices." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Notifications */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Update your primary identity details</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading !== null}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading === "profile" && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Security & Password</h2>
              <p className="text-xs text-slate-500">Keep your account secure with a strong password</p>
            </div>
          </div>
        </div>
        <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading !== null}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading === "password" && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Session Management */}
      <div className="bg-red-50/30 rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manage Sessions</h2>
              <p className="text-xs text-slate-500">Sign out from all other active devices and browser sessions</p>
            </div>
          </div>
          <button
            onClick={handleLogoutAll}
            disabled={loading !== null}
            className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading === "logout-all" && <Loader2 className="w-4 h-4 animate-spin" />}
            Logout From All Other Devices
          </button>
        </div>
      </div>
    </div>
  );
}
