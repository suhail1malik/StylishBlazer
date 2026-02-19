// app/product/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/lib/dummy-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white">
      {/* Breadcrumb */}
      <section className="border-b border-zinc-200 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <nav className="flex items-center gap-2 text-sm text-zinc-600">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/category/${product.categorySlug}`}
              className="hover:text-brand-600"
            >
              {product.categorySlug.replace(/-/g, " ")}
            </Link>
            <span>/</span>
            <span className="text-zinc-900">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-zinc-200 bg-linear-to-br from-zinc-100 to-zinc-200 shadow-medium">
                <div className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                  Premium Quality
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    className="aspect-square overflow-hidden rounded-lg border-2 border-transparent bg-linear-to-br from-zinc-100 to-zinc-200 transition-all hover:border-brand-400"
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
                </span>
                In Stock
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                {product.name}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                {product.shortDescription}
              </p>

              {/* Price */}
              {product.price && (
                <div className="mt-6 flex items-baseline gap-3">
                  <p className="text-4xl font-bold text-brand-600">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-zinc-500">per piece</p>
                </div>
              )}

              {/* Features */}
              <div className="mt-8 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
                  Key Features
                </h3>
                <ul className="space-y-2 text-sm text-zinc-600">
                  {[
                    "Premium wool blend fabric",
                    "Custom sizing available",
                    "Durable stitching & finishing",
                    "Available in multiple colors",
                    "Bulk order discounts",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Size Options */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
                  Available Sizes
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["S", "M", "L", "XL", "XXL", "Custom"].map((size) => (
                    <button
                      key={size}
                      className="rounded-lg border-2 border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-all hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/911234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex-1 overflow-hidden rounded-lg bg-brand-600 px-6 py-3.5 text-center font-semibold text-white shadow-lg transition-all hover:bg-brand-700 hover:shadow-xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp Enquiry
                  </span>
                </a>
                <button className="rounded-lg border-2 border-zinc-300 bg-white px-6 py-3.5 font-semibold text-zinc-700 transition-all hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700">
                  Download Specs
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-center">
                  <p className="text-2xl">🚚</p>
                  <p className="mt-1 text-xs font-semibold text-zinc-900">
                    Pan-India Delivery
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">✅</p>
                  <p className="mt-1 text-xs font-semibold text-zinc-900">
                    Quality Assured
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">💬</p>
                  <p className="mt-1 text-xs font-semibold text-zinc-900">
                    24/7 Support
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-16 rounded-2xl border border-zinc-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-zinc-900">
              Product Description
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-600">
              <p>
                This premium {product.name.toLowerCase()} is manufactured using
                high-quality wool blend fabric that provides warmth, durability
                and a sophisticated look. Perfect for retailers looking to stock
                premium outerwear for their customers.
              </p>
              <p>
                We offer custom sizing, color options and branding solutions for
                bulk orders. Our manufacturing facility in Chandigarh ensures
                quality control at every step of production.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
                  Fabric Details
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                  <li>• 70% Wool, 30% Polyester blend</li>
                  <li>• GSM: 280-320</li>
                  <li>• Breathable & warm</li>
                  <li>• Easy care instructions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
                  Order Information
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                  <li>• MOQ: 50 pieces per design</li>
                  <li>• Lead time: 15-20 days</li>
                  <li>• Custom branding available</li>
                  <li>• Sample available on request</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
