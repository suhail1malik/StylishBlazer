"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: string;
  name: string;
}

export default function DeleteProductButton({ id, name }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `"${name}" delete karna chahte ho? Yeh action undo nahi hoga.`,
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh(); // Page refresh karo - list update hogi
      } else {
        alert("Delete failed. Please try again.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "🗑️ Delete"}
    </button>
  );
}
