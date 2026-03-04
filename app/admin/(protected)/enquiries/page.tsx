"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCcw,
  User as UserIcon,
  Tag,
  ShoppingBag
} from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  productName: string | null;
  productImage: string | null;
  productUrl: string | null;
  message: string;
  status: string;
  source: string;
  createdAt: string;
}

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  new: { color: "text-blue-600", bg: "bg-blue-50/50", icon: <Clock className="w-3 h-3" /> },
  replied: { color: "text-emerald-600", bg: "bg-emerald-50/50", icon: <CheckCircle2 className="w-3 h-3" /> },
  closed: { color: "text-slate-400", bg: "bg-slate-50/50", icon: <XCircle className="w-3 h-3" /> },
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
    fetchEnquiries();
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
    <div className="space-y-8 pb-12">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Inbox & Leads
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
            Manage your consultations and order enquiries.
          </p>
        </div>
        <button
          onClick={fetchEnquiries}
          className="group inline-flex items-center justify-center gap-2 bg-white text-slate-600 border border-slate-200 px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95 w-full md:w-auto"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
          Refresh Workspace
        </button>
      </div>

      {/* ── Stats Overview ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total", key: "all", color: "text-slate-900", bg: "bg-white", icon: <Mail className="w-5 h-5" /> },
          { label: "New", key: "new", color: "text-blue-600", bg: "bg-blue-50/30", icon: <Clock className="w-5 h-5" /> },
          { label: "Replied", key: "replied", color: "text-emerald-600", bg: "bg-emerald-50/30", icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: "Archived", key: "closed", color: "text-slate-400", bg: "bg-slate-50/50", icon: <XCircle className="w-5 h-5" /> },
        ].map((s) => (
          <div
            key={s.key}
            className={`${s.bg} rounded-[28px] border border-slate-200/60 p-4 md:p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-4`}
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center ${s.color} bg-white shadow-sm border border-slate-100 flex-shrink-0`}>
               {s.icon}
            </div>
            <div className="min-w-0">
              <p className={`text-xl md:text-2xl font-bold tracking-tight ${s.color}`}>
                {counts[s.key as keyof typeof counts]}
              </p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5 truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ───────────────────────────────────────────────── */}
      <div className="flex p-1.5 bg-slate-100/80 rounded-2xl w-full overflow-x-auto no-scrollbar">
        <div className="flex gap-1 min-w-max">
          {["all", "new", "replied", "closed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                filter === tab
                  ? "bg-white text-emerald-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
              <span className="ml-2 opacity-40">{counts[tab as keyof typeof counts]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Enquiries List ────────────────────────────────────────────── */}
      <div className="space-y-4">
        {loading && enquiries.length === 0 ? (
          [1,2,3].map(n => (
            <div key={n} className="h-24 bg-white rounded-[24px] border border-slate-100 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-6">
               <Mail className="w-10 h-10 stroke-[1.5]" />
             </div>
             <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Inbox is Empty</h3>
             <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
               There are no enquiries matching the current filter.
             </p>
          </div>
        ) : (
          filtered.map((enq) => {
            const isExpanded = expanded === enq.id;
            const status = statusConfig[enq.status] || statusConfig.new;
            
            return (
              <div
                key={enq.id}
                className={`group bg-white rounded-[24px] border transition-all duration-500 overflow-hidden ${
                  isExpanded ? "border-emerald-200 shadow-premium" : "border-slate-200/60 shadow-sm hover:border-emerald-200 hover:shadow-md"
                }`}
              >
                {/* Visual Row */}
                <div
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 cursor-pointer gap-4 ${isExpanded ? "bg-emerald-50/30" : ""}`}
                  onClick={() => setExpanded(isExpanded ? null : enq.id)}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex-shrink-0 flex items-center justify-center font-bold text-base md:text-lg shadow-lg shadow-emerald-900/10">
                      {enq.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 truncate">{enq.name}</h4>
                        {enq.source === "product" && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[7px] md:text-[8px] font-bold uppercase tracking-widest border border-emerald-100 flex-shrink-0">
                            Product Page
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] md:text-xs text-slate-400 font-medium truncate lowercase">
                        {enq.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    {enq.productName && !isExpanded && (
                      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 transition-colors group-hover:bg-white">
                        <Tag className="w-3 h-3 text-emerald-600" />
                        <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">
                          {enq.productName}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border transition-all ${status.bg} ${status.color} border-current`}>
                        {status.icon}
                        <span className="hidden xs:inline">{enq.status}</span>
                      </div>
                      <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <div className={`w-8 h-8 rounded-full bg-slate-50 flex-shrink-0 flex items-center justify-center transition-transform duration-300 ${isExpanded ? "rotate-180 bg-emerald-100 text-emerald-600" : "text-slate-400"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Expanded Management View */}
                {isExpanded && (
                  <div className="border-t border-emerald-50 p-8 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Narrative */}
                        <div className="lg:col-span-7 space-y-6">
                           <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Message History</p>
                              <div className="bg-slate-50 rounded-[20px] p-6 border border-slate-100 relative">
                                 <MessageSquare className="absolute right-4 top-4 w-12 h-12 text-slate-900/5 rotate-12" />
                                 <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                   &ldquo;{enq.message}&rdquo;
                                 </p>
                              </div>
                           </div>

                           {enq.productName && (
                             <div className="flex flex-col gap-3">
                               <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Linked Article</p>
                               {enq.productUrl ? (
                                 <a 
                                   href={enq.productUrl} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all group/prod"
                                 >
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-50 flex-shrink-0">
                                      {enq.productImage ? (
                                        <Image 
                                          src={enq.productImage} 
                                          alt={enq.productName || "Product"} 
                                          fill 
                                          className="object-cover group-hover/prod:scale-110 transition-transform duration-500" 
                                        />
                                      ) : (
                                        <div className="h-full flex items-center justify-center text-slate-300">
                                          <ShoppingBag className="w-8 h-8" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-slate-900 group-hover/prod:text-emerald-700 transition-colors line-clamp-1">{enq.productName}</p>
                                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 group-hover/prod:text-emerald-500 transition-colors">
                                        View on Website <ExternalLink className="w-2.5 h-2.5" />
                                      </p>
                                    </div>
                                 </a>
                               ) : (
                                 <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                   <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                                     <ShoppingBag className="w-6 h-6" />
                                   </div>
                                   <div>
                                     <p className="text-sm font-bold text-slate-900">{enq.productName}</p>
                                   </div>
                                 </div>
                               )}
                             </div>
                           )}
                        </div>

                        {/* Quick Reach */}
                        <div className="lg:col-span-5 space-y-6">
                           <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Client Connection</p>
                             <div className="grid grid-cols-1 gap-3">
                                <a
                                  href={`https://wa.me/${enq.phone.replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-lg shadow-emerald-500/10 group/wa"
                                >
                                  <div className="flex items-center gap-3">
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Connect on WhatsApp</span>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/wa:opacity-100 transition-opacity" />
                                </a>
                                <a
                                  href={`mailto:${enq.email}`}
                                  className="flex items-center justify-between px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all shadow-lg shadow-slate-900/10 group/ml"
                                >
                                  <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Official Email</span>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/ml:opacity-100 transition-opacity" />
                                </a>
                                <a
                                  href={`tel:${enq.phone}`}
                                  className="flex items-center gap-3 px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all"
                                >
                                  <Phone className="w-4 h-4" />
                                  <span className="text-xs font-bold uppercase tracking-widest tracking-widest">Voice Call</span>
                                </a>
                             </div>
                           </div>

                           <div className="pt-6 border-t border-slate-100">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Workflow Status</p>
                              <div className="flex flex-wrap gap-2">
                                {["new", "replied", "closed"].map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => updateStatus(enq.id, s)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                      enq.status === s
                                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                                        : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                                <button
                                  onClick={() => deleteEnquiry(enq.id)}
                                  className="ml-auto w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                  title="Permanently Delete"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Missing Lucide Icons
function MessageCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

