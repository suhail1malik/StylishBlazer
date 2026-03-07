"use client";

import { useState, useEffect } from "react";
import InvoiceGenerator from "@/components/admin/InvoiceGenerator";
import { 
  FileText, 
  Printer, 
  ShieldCheck, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  ChevronRight,
  RefreshCcw,
  IndianRupee,
  Calendar
} from "lucide-react";

interface SavedInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  clientName: string;
  total: number;
  taxType: string;
  createdAt: string;
}

export default function AdminInvoicesPage() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invoices");
      const data = await res.json();
      if (Array.isArray(data)) {
        setInvoices(data);
      } else {
        console.error("API Error or invalid format:", data);
        setInvoices([]);
      }
    } catch (err) {
      console.error("Fetch invoices failed:", err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice record?")) return;
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-32">
      {/* ── Header Area ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-1">
             <ShieldCheck className="w-3.5 h-3.5" />
             Verified Billing Studio
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {showGenerator ? "New Invoice" : "Billing Dashboard"}
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-lg">
            {showGenerator 
              ? "Draft a professional legal artifact with real-time tax calculations." 
              : "Manage your financial history and track all generated client invoices."}
          </p>
        </div>

        <button 
          onClick={() => {
            setSelectedInvoice(null);
            setShowGenerator(!showGenerator);
          }}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95 ${
            showGenerator 
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-200/20" 
              : "bg-emerald-950 text-emerald-50 hover:bg-emerald-900 shadow-emerald-900/40"
          }`}
        >
          {showGenerator ? (
            <>Cancel & Return</>
          ) : (
            <><Plus className="w-4 h-4" /> Generate New</>
          )}
        </button>
      </div>

      {showGenerator ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <InvoiceGenerator 
            initialData={selectedInvoice}
            onSaveSuccess={() => { setShowGenerator(false); setSelectedInvoice(null); fetchInvoices(); }} 
          />
        </div>
      ) : (
        <div className="space-y-6">
           {/* ── Search & Filter ── */}
           <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="relative group w-full max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search by invoice # or client name..." 
                    className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full font-medium"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                 />
              </div>
              <button 
                onClick={fetchInvoices}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"
              >
                <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
           </div>

           {/* ── Invoice List ── */}
           {loading ? (
             <div className="grid grid-cols-1 gap-4">
               {[1,2,3].map(n => (
                 <div key={n} className="h-24 bg-white rounded-3xl animate-pulse border border-slate-100" />
               ))}
             </div>
           ) : filteredInvoices.length > 0 ? (
             <div className="grid grid-cols-1 gap-4">
                {filteredInvoices.map((inv) => (
                  <div 
                    key={inv.id} 
                    onClick={() => {
                      setSelectedInvoice(inv);
                      setShowGenerator(true);
                    }}
                    className="group bg-white rounded-3xl p-5 md:p-6 border border-slate-200/60 hover:border-emerald-200 hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                           <FileText className="w-6 h-6" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{inv.invoiceNumber}</span>
                              <span className="text-[10px] font-bold text-slate-300">•</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{new Date(inv.date).toLocaleDateString()}</span>
                           </div>
                           <h3 className="font-serif font-bold text-slate-900 text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{inv.clientName}</h3>
                        </div>
                     </div>

                     <div className="flex items-center justify-between md:justify-end gap-8">
                        <div className="text-right">
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Valuation</p>
                           <p className="text-base font-bold text-slate-900 flex items-center gap-1">
                              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                              {inv.total.toLocaleString()}
                           </p>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               handleDelete(inv.id);
                             }}
                             className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                           {/* Add view/re-download button here if needed */}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>No Invoices Archived</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">You haven't generated any invoices yet. Start by clicking 'Generate New'.</p>
             </div>
           )}
        </div>
      )}

      {/* ── Statistics / Info Footer ── */}
      {!showGenerator && !loading && invoices.length > 0 && (
         <div className="bg-emerald-950 rounded-[32px] p-8 md:p-12 relative overflow-hidden mt-12">
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
           <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-8">
             <div>
               <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Archived Invoices</p>
               <p className="text-white text-3xl font-serif font-bold">{invoices.length}</p>
             </div>
             <div>
               <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Billing</p>
               <p className="text-white text-3xl font-serif font-bold flex items-center gap-2">
                 <IndianRupee className="w-6 h-6 text-emerald-600" />
                 {invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
               </p>
             </div>
             <div className="hidden md:block text-right">
                <Printer className="w-12 h-12 text-emerald-800 ml-auto" />
             </div>
           </div>
         </div>
      )}
    </div>
  );
}
