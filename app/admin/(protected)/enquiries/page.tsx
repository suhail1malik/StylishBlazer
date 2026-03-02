"use client";
import { useEffect, useState } from "react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  productName: string | null;
  message: string;
  status: string;
  source: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  replied: "bg-green-100 text-green-700",
  closed: "bg-zinc-100 text-zinc-500",
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchEnquiries = () => {
    setLoading(true);
    fetch("/api/enquiries")
      .then((r) => r.json())
      .then((data) => {
        setEnquiries(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchEnquiries();
    };
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchEnquiries();
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Delete this enquiry? This cannot be undone.")) return;
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    fetchEnquiries();
  };

  const filtered =
    filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    replied: enquiries.filter((e) => e.status === "replied").length,
    closed: enquiries.filter((e) => e.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">📩 Enquiries</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Manage all customer enquiries and leads
            </p>
          </div>
          <button
            onClick={fetchEnquiries}
            className="text-sm border border-zinc-200 bg-white px-4 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", key: "all", color: "text-zinc-900" },
            { label: "New", key: "new", color: "text-blue-600" },
            { label: "Replied", key: "replied", color: "text-green-600" },
            { label: "Closed", key: "closed", color: "text-zinc-400" },
          ].map((s) => (
            <div
              key={s.key}
              className="bg-white rounded-2xl border border-zinc-200 p-4 text-center"
            >
              <p className={`text-2xl font-bold ${s.color}`}>
                {counts[s.key as keyof typeof counts]}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "new", "replied", "closed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === tab
                  ? "bg-zinc-900 text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {tab} ({counts[tab as keyof typeof counts]})
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-zinc-500 text-sm">No enquiries found.</p>
          </div>
        )}

        {/* Enquiries List */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden"
              >
                {/* Row */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 transition-colors"
                  onClick={() =>
                    setExpanded(expanded === enq.id ? null : enq.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {enq.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 text-sm">
                        {enq.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {enq.email} • {enq.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {enq.productName && (
                      <span className="hidden sm:block text-xs bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">
                        {enq.productName}
                      </span>
                    )}
                    <span className="text-xs text-zinc-400">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        statusColors[enq.status] || statusColors.new
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-zinc-400 text-sm">
                      {expanded === enq.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded === enq.id && (
                  <div className="border-t border-zinc-100 p-5 bg-zinc-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-zinc-500 mb-1">
                          Message
                        </p>
                        <p className="text-sm text-zinc-800 bg-white rounded-xl border border-zinc-200 p-3 leading-relaxed">
                          {enq.message}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-zinc-500 mb-1">
                            Source
                          </p>
                          <span className="text-xs bg-white border border-zinc-200 px-2.5 py-1 rounded-full capitalize text-zinc-600">
                            {enq.source === "product"
                              ? "🛍️ Product Page"
                              : "📋 Contact Form"}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-500 mb-1">
                            Quick Actions
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={`https://wa.me/${enq.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              💬 WhatsApp
                            </a>
                            <a
                              href={`mailto:${enq.email}`}
                              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              ✉️ Email
                            </a>
                            <a
                              href={`tel:${enq.phone}`}
                              className="text-xs bg-zinc-700 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              📞 Call
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status + Delete */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-zinc-500">
                          Update Status:
                        </p>
                        {["new", "replied", "closed"].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(enq.id, s)}
                            className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                              enq.status === s
                                ? "bg-zinc-900 text-white"
                                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => deleteEnquiry(enq.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
