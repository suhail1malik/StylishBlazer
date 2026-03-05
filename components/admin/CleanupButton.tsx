"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function CleanupButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCleanup = async () => {
    if (!confirm("Are you sure you want to delete all temporary images? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/cleanup-images", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(`Success: Deleted ${data.deletedCount} temporary images.`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleCleanup}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
        {loading ? "Cleaning..." : "Clear Temp Images"}
      </button>
      {message && (
        <span className={`text-[10px] font-bold ${message.startsWith("Error") ? "text-red-500" : "text-emerald-500"}`}>
          {message}
        </span>
      )}
    </div>
  );
}
