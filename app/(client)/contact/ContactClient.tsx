"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { 
  FadeIn, 
  StaggerGrid, 
  StaggerItem, 
  SectionHeading 
} from "@/components/AnimatedSections";

interface Category {
  id: string;
  name: string;
}

export default function ContactClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    productName: "",
    message: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact" }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({
          name: "",
          email: "",
          phone: "",
          productName: "",
          message: "",
        });
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Dark Header */}
      <div 
        className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-12 text-center"
        style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a2e1f 45%, #0f2218 100%)" }}
      >
        {/* Grid Lines Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            eyebrow={<><Sparkles className="w-3.5 h-3.5" /> Direct Inquiry</>}
            title="Sartorial Consultations"
            subtitle="Let's discuss your specific requirements. Our team of experts is ready to assist you."
            light={true}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          {/* Left - Contact info with premium cards */}
          <div className="lg:col-span-5 space-y-8">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                Connect With Our <br />
                <span className="text-emerald-600 italic font-medium">Manufacturing Unit</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    title: "Our Atelier",
                    content: "StylishBlazer Manufacturing Unit, Industrial Area Phase 2, Chandigarh, India - 160002"
                  },
                  {
                    icon: <MessageSquare className="w-5 h-5" />,
                    title: "Digital Inquiries",
                    content: (
                      <div className="flex flex-col gap-2">
                        <a href="tel:+917906200663" className="hover:text-emerald-600 transition-colors">+91-79062-00663</a>
                        <a href="mailto:sales@stylishblazer.in" className="hover:text-emerald-600 transition-colors">sales@stylishblazer.in</a>
                      </div>
                    )
                  },
                  {
                    icon: <Clock className="w-5 h-5" />,
                    title: "Operating Hours",
                    content: "Mon – Sat: 9:00 AM – 7:00 PM | Sun: Closed"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-emerald-100 hover:shadow-premium transition-all duration-500 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{item.title}</h4>
                      <div className="text-slate-600 text-sm leading-relaxed font-medium">{item.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 mb-2">Service Excellence</p>
                  <p className="text-sm font-medium leading-relaxed opacity-80">
                    "We response to all professional inquiries with detailed catalogues and pricing within 24 business hours."
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right - Premium Form */}
          <div className="lg:col-span-1 lg:flex items-center justify-center hidden">
            <div className="w-px h-full bg-linear-to-b from-transparent via-slate-200 to-transparent" />
          </div>

          <div className="lg:col-span-6">
            <FadeIn>
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-premium p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full -mr-16 -mt-16" />
                
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 relative z-10">Request a Partnership</h3>

                {success ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Inquiry Received</h3>
                    <p className="text-slate-500 text-sm mb-10 max-w-xs mx-auto">
                      Thank you for reaching out. A specialist from our team will contact you shortly with the requested information.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-emerald-600 font-bold text-xs uppercase tracking-widest hover:text-emerald-700 flex items-center gap-2 mx-auto"
                    >
                      Send another enquiry
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Lord/Lady Hamilton"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500/30 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Mobile No.</label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91-"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500/30 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="excellence@brand.com"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500/30 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Collection Interest</label>
                      <div className="relative">
                        <select
                          value={form.productName}
                          onChange={(e) => setForm({ ...form, productName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500/30 transition-all font-medium appearance-none"
                        >
                          <option value="">Select a collection...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                          <option value="Custom Bespoke">Custom Bespoke</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Your Vision / Requirements</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Detail your requirements for bulk ordering, custom designs, or retail partnership..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500/30 transition-all font-medium resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 group"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          Send Inquiry
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
