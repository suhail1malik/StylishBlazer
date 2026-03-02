"use client";
import { useState } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with StylishBlazer for bulk orders, pricing, and catalogue. We respond within 24 hours.",
  alternates: {
    canonical: "https://stylishblazer.in/contact",
  },
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    productName: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-zinc-900 text-white py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">
          GET IN TOUCH
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Let&apos;s Discuss Your Requirements
        </h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Share your requirements and our team will respond with catalogue and
          pricing within 24 hours.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left - Info */}
          <div className="space-y-6">
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 mb-4">
                📍 Our Location
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                StylishBlazer Manufacturing Unit
                <br />
                Industrial Area Phase 2<br />
                Chandigarh, India - 160002
              </p>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 mb-4">
                📞 Contact Details
              </h3>
              <div className="space-y-2 text-sm text-zinc-600">
                <p>
                  Phone:{" "}
                  <a
                    href="tel:+911234567890"
                    className="text-brand-600 font-medium"
                  >
                    +91-12345-67890
                  </a>
                </p>
                <p>
                  WhatsApp:{" "}
                  <a
                    href="https://wa.me/911234567890"
                    className="text-brand-600 font-medium"
                  >
                    +91-12345-67890
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:sales@stylishblazer.in"
                    className="text-brand-600 font-medium"
                  >
                    sales@stylishblazer.in
                  </a>
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 mb-4">
                🕐 Business Hours
              </h3>
              <div className="space-y-1 text-sm text-zinc-600">
                <p>Monday – Saturday: 9:00 AM – 7:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              Send Us an Enquiry
            </h2>

            {success ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">
                  Enquiry Submitted!
                </h3>
                <p className="text-zinc-500 text-sm mb-6">
                  We&apos;ll get back to you within 24 hours with catalogue and
                  pricing.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-brand-600 font-semibold text-sm hover:underline"
                >
                  Submit another enquiry →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    ❌ {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="+91-"
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Product Interest
                  </label>
                  <select
                    value={form.productName}
                    onChange={(e) =>
                      setForm({ ...form, productName: e.target.value })
                    }
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="">Select a product category...</option>
                    <option value="Women Long Coats">Women Long Coats</option>
                    <option value="Mens Blazers">Mens Blazers</option>
                    <option value="Woolen Jackets">Woolen Jackets</option>
                    <option value="Custom Order">Custom Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Your Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Please mention product type, quantity, size range, target delivery date..."
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "📩 Send Enquiry"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
