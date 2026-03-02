import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductSizeSelector from "@/components/ProductSizeSelector";
import ProductActions from "@/components/ProductActions";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

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

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
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
            {product.category && (
              <>
                <Link
                  href={`/category/${product.category.slug}`}
                  className="hover:text-brand-600 capitalize"
                >
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-zinc-900">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image Gallery */}
            {/* Image Gallery */}
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              isFeatured={product.isFeatured}
            />

            {/* Product Info */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
                </span>
                In Stock
              </div>

              {/* Category Tag */}
              {product.category && (
                <div className="mt-3">
                  <Link
                    href={`/category/${product.category.slug}`}
                    className="text-xs font-semibold text-brand-600 uppercase tracking-widest hover:text-brand-700"
                  >
                    {product.category.name}
                  </Link>
                </div>
              )}

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                {product.name}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                {product.shortDescription}
              </p>

              {/* Price */}
              {product.price !== null && (
                <div className="mt-6 flex items-baseline gap-3">
                  <p className="text-4xl font-bold text-brand-600">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-zinc-500">per piece</p>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-zinc-100 text-zinc-600 text-xs px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Size Options */}
              <ProductSizeSelector sizes={product.sizes} />

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
                    <li key={i}>
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

              {/* CTA Buttons */}
              <div>
                <ProductActions productName={product.name} />
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
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p>
                  This premium {product.name.toLowerCase()} is manufactured
                  using high-quality wool blend fabric that provides warmth,
                  durability and a sophisticated look.
                </p>
              )}
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
