"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  images: string[];
  sizes: string[];
  isFeatured: boolean;
  category: Category;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([productsData, categoriesData]) => {
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setLoading(false);
    });
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category?.slug === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-zinc-900 text-white py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">
          Our Collection
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">All Products</h1>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Browse our complete range of premium outerwear — coats, blazers and
          woolen jackets.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-800">
            Home
          </Link>
          <span>/</span>
          <span className="text-zinc-800 font-medium">All Products</span>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "all"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter(
                (p) => p.category?.slug === cat.slug,
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort + Count */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500">
              {sorted.length} Products
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && sorted.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">🧥</p>
            <p className="text-zinc-500 text-sm">No products found.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && sorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 text-4xl">
                      🧥
                    </div>
                  )}
                  {product.isFeatured && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2.5 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-zinc-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {product.category?.name}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 text-sm mb-1 group-hover:text-brand-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-3 line-clamp-1">
                    {product.shortDescription}
                  </p>
                  {product.sizes?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.sizes.slice(0, 3).map((size) => (
                        <span
                          key={size}
                          className="text-xs border border-zinc-200 rounded px-1.5 py-0.5 text-zinc-500"
                        >
                          {size}
                        </span>
                      ))}
                      {product.sizes.length > 3 && (
                        <span className="text-xs text-zinc-400">
                          +{product.sizes.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-zinc-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                    <span className="text-xs text-brand-600 font-semibold group-hover:underline">
                      Enquire →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && (
          <div className="mt-16 bg-zinc-900 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Need Custom Orders?</h2>
            <p className="text-zinc-400 text-sm mb-6">
              We manufacture in bulk for retailers, brands and corporates.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
            >
              Get in Touch
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
