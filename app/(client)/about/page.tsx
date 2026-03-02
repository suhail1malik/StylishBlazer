// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about StylishBlazer — a premium manufacturer of women coats and mens blazers based in India.",
  alternates: {
    canonical: "https://stylishblazer.in/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            About StylishBlazer
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Crafting Premium Outerwear Since 2010
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 md:text-lg">
            We are a Chandigarh-based manufacturer specializing in women long
            coats, mens blazers and custom woolen outerwear for retailers,
            brands and corporate clients across India.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "500+", label: "Unique Designs" },
              { value: "50+", label: "Retail Partners" },
              { value: "10K+", label: "Products Delivered" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-soft"
              >
                <p className="text-3xl font-bold text-brand-600 md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <div className="space-y-6 text-base leading-relaxed text-zinc-700">
            <p>
              StylishBlazer was founded in 2010 with a vision to bring premium
              quality outerwear manufacturing to the Indian market. What started
              as a small workshop in Chandigarh has grown into a full-scale
              manufacturing unit serving retailers and brands across the
              country.
            </p>
            <p>
              Our team of skilled craftsmen and designers work together to
              create coats and blazers that combine traditional tailoring
              techniques with modern design aesthetics. We believe in using only
              the finest fabrics and maintaining strict quality control at every
              stage of production.
            </p>
            <p>
              Today, we partner with over 50 retailers and have delivered more
              than 10,000 premium outerwear pieces. Our commitment to quality,
              timely delivery, and customer satisfaction has made us a trusted
              name in the industry.
            </p>
          </div>

          {/* Values */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-white to-zinc-50 p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-xl">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Quality First
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                We never compromise on fabric quality or craftsmanship.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-white to-zinc-50 p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-xl">
                🤝
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Customer Focus
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Your requirements drive our designs and processes.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-white to-zinc-50 p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-xl">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Timely Delivery
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                We respect deadlines and ensure on-time order fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
