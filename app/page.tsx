// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Type Definitions
type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  isNew: boolean;
  _count: {
    products: number;
  };
};

type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number;
  isFeatured: boolean;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

// Server Functions
async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
    return products;
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

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm mb-4">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Premium Outerwear Manufacturer
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                Elevate Your Brand with
                <span className="text-emerald-400 block mt-2">
                  Premium Coats & Blazers
                </span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg mb-6 md:mb-8">
                LookLikeStitches manufactures high-quality women long coats,
                mens blazers and custom woolen outerwear for retailers, brands
                and corporate clients across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products?category=women-long-coats"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition text-center"
                >
                  View Women Collection
                </Link>
                <Link
                  href="/products?category=mens-blazers"
                  className="border-2 border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition text-center"
                >
                  Explore Mens Blazers
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-slate-700/50 backdrop-blur rounded-2xl p-8 w-full max-w-md">
                <div className="bg-slate-600/50 rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🛍️</div>
                    <p className="text-slate-300">Premium Product Image</p>
                    <p className="text-slate-400 text-sm">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Features Section */}
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

      {/* Categories Section - DYNAMIC */}
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
                  <span className="text-emerald-600 font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                    Explore{" "}
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - DYNAMIC */}
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
              className="text-emerald-600 font-medium hover:gap-2 flex items-center gap-1 transition-all"
            >
              View All{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative bg-slate-100 h-48 flex items-center justify-center">
                  {product.isFeatured && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
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
                    <div className="text-4xl">👔</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 group-hover:text-emerald-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 font-bold text-lg">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <button className="text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded text-sm font-medium transition">
                      Enquire →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
