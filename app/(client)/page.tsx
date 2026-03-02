import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/HeroSlider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Women Coats & Mens Blazers Manufacturer",
  description:
    "StylishBlazer manufactures premium women coats, woolen jackets, and mens blazers. Wholesale & bulk orders from India.",
  alternates: {
    canonical: "https://stylishblazer.in",
  },
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  isNew: boolean;
  _count: { products: number };
};

type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number;
  isFeatured: boolean;
  images: string[];
  category: { id: string; name: string; slug: string };
};

async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    });
    // Add isNew property (customize logic as needed)
    return categories.map((category) => ({
      ...category,
      isNew: false, // or your logic to determine if it's new
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    // Ensure price is never null
    return products
      .filter((p) => p.price !== null)
      .map((p) => ({
        ...p,
        price: p.price ?? 0, // fallback to 0 if price is somehow null
      })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  const heroProducts = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    shortDescription: p.shortDescription ?? "",
    images: p.images,
    slug: p.slug,
  }));

  return (
    <main className="min-h-screen">
      {/* ✅ Hero Section - Same design + HeroSlider */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/20 blur-[120px] rounded-full hidden lg:block pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-[250px] h-[250px] bg-emerald-700/10 blur-[100px] rounded-full hidden lg:block pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Text (same as before) */}
            <div>
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm mb-4">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Premium Outerwear Manufacturer
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                Elevate Your Brand with
                <span className="text-emerald-400 block mt-2">
                  Premium Coats & Blazers
                </span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg mb-6 md:mb-8">
                StylishBlazer manufactures high-quality women long coats, mens
                blazers and custom woolen outerwear for retailers, brands and
                corporate clients across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/category/women-long-coats"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition text-center"
                >
                  View Women Collection
                </Link>
                <Link
                  href="/category/mens-blazers"
                  className="border-2 border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition text-center"
                >
                  Explore Mens Blazers
                </Link>
              </div>
            </div>

            {/* Right - HeroSlider (placeholder ki jagah) */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                {heroProducts.length > 0 ? (
                  <HeroSlider products={heroProducts} />
                ) : (
                  // Fallback - same as before
                  <div className="bg-slate-700/50 backdrop-blur rounded-2xl p-8 w-full">
                    <div className="bg-slate-600/50 rounded-xl h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🛍️</div>
                        <p className="text-slate-300">Premium Product Image</p>
                        <p className="text-slate-400 text-sm">Coming Soon</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - SAME */}
      <section className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-400">
                500+
              </div>
              <div className="text-slate-400 text-sm md:text-base">Designs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-400">
                50+
              </div>
              <div className="text-slate-400 text-sm md:text-base">
                Partners
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-400">
                15+
              </div>
              <div className="text-slate-400 text-sm md:text-base">
                Years Exp
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - SAME */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl mb-4">
                ✂️
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Custom Manufacturing
              </h3>
              <p className="text-slate-600 text-sm">
                Tailored designs to match your brand
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl mb-4">
                🎯
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-slate-600 text-sm">
                High-grade fabrics & craftsmanship
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl mb-4">
                📦
              </div>
              <h3 className="font-semibold text-lg mb-2">Bulk Orders</h3>
              <p className="text-slate-600 text-sm">
                Wholesale & retail pricing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - SAME */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-flex items-center gap-2 text-emerald-600 font-medium mb-2">
              <span className="text-xl">🏪</span> OUR COLLECTIONS
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Browse by Category
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Carefully crafted outerwear segments designed to match your store
              and customers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition">
                    🛍️
                  </div>
                  {category.isNew && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      New
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-slate-600 text-sm mb-3">
                  {category.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {category._count.products} styles
                  </span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    Explore{" "}
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - SAME */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-emerald-600 font-medium text-sm">
                POPULAR STYLES
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="text-emerald-600 font-medium flex items-center gap-1"
            >
              View All <span className="inline-block">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative bg-slate-100 aspect-[3/4]">
                  {product.isFeatured && (
                    <span className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      👔
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-sm md:text-base mb-1 group-hover:text-emerald-600 transition line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 text-xs md:text-sm mb-2 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 font-bold text-sm md:text-lg">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span className="text-emerald-600 text-xs md:text-sm font-medium">
                      Enquire →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - SAME */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Order?
          </h2>
          <p className="text-emerald-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Get premium quality outerwear manufactured for your brand. Contact
            us for custom orders and wholesale pricing.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
