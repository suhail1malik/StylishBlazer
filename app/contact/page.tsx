// app/contact/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with LookLikeStitches for bulk orders, custom designs and manufacturing enquiries. We serve retailers and brands across India.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white">
      {/* Header */}
      <section className="border-b border-zinc-200 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Get In Touch
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Let&apos;s Discuss Your Requirements
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 md:text-lg">
            Share your requirements for women long coats, mens blazers or custom
            outerwear. Our team will respond with catalogue and pricing within
            24 hours.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-zinc-900">
                  📍 Our Location
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  LookLikeStitches Manufacturing Unit
                  <br />
                  Industrial Area Phase 2
                  <br />
                  Chandigarh, India - 160002
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-zinc-900">
                  📞 Contact Details
                </h2>
                <div className="mt-3 space-y-2 text-sm text-zinc-600">
                  <p>
                    <span className="font-medium text-zinc-900">Phone:</span>{" "}
                    +91-12345-67890
                  </p>
                  <p>
                    <span className="font-medium text-zinc-900">WhatsApp:</span>{" "}
                    +91-12345-67890
                  </p>
                  <p>
                    <span className="font-medium text-zinc-900">Email:</span>{" "}
                    sales@looklikestitches.com
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-zinc-900">
                  ⏰ Business Hours
                </h2>
                <div className="mt-3 space-y-2 text-sm text-zinc-600">
                  <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-2xl border border-brand-200 bg-linear-to-br from-brand-50 to-white p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-zinc-900">
                  🚀 Quick Actions
                </h2>
                <div className="mt-4 space-y-3">
                  <a
                    href="https://wa.me/911234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-brand-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-brand-50"
                  >
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <a
                    href="tel:+911234567890"
                    className="flex items-center gap-3 rounded-lg border border-brand-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-brand-50"
                  >
                    📞 Call Us Now
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-medium">
              <h2 className="text-xl font-semibold text-zinc-900">
                Send Us an Enquiry
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Fill out the form and we&apos;ll get back to you with catalogue
                and pricing details.
              </p>

              <form className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-900">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-zinc-900">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-900">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="+91-"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-900">
                    Product Interest
                  </label>
                  <select
                    name="category"
                    className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  >
                    <option>Women Long Coats</option>
                    <option>Mens Blazers</option>
                    <option>Woolen Jackets</option>
                    <option>Custom Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-900">
                    Your Requirements *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    placeholder="Please mention product type, quantity, size range, target delivery date and any other specific requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-lg bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:bg-brand-700 hover:shadow-xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Submit Enquiry
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 z-0 bg-linear-to-r from-brand-700 to-brand-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>

                <p className="text-xs text-zinc-500">
                  * We typically respond within 24 hours with catalogue and
                  pricing details.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (optional - can add Google Maps embed) */}
      <section className="border-t border-zinc-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <h2 className="text-center text-2xl font-bold text-zinc-900">
            Visit Our Manufacturing Unit
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Schedule an appointment to see our facility and product range
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 shadow-medium">
            <div className="aspect-video w-full bg-linear-to-br from-zinc-100 to-zinc-200">
              {/* Google Maps embed placeholder - replace with actual embed code */}
              <div className="flex h-full items-center justify-center text-zinc-500">
                <div className="text-center">
                  <p className="text-lg font-semibold">📍 Map Location</p>
                  <p className="mt-2 text-sm">
                    Google Maps will be embedded here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
