"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured: boolean;
  category: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const CATEGORY_HERO: Record<string, { bg: string; emoji: string }> = {
  "women-long-coats": {
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    emoji: "🧥",
  },
  "mens-blazers": {
    bg: "linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #1a0a0a 100%)",
    emoji: "🤵",
  },
  "woolen-jackets": {
    bg: "linear-gradient(135deg, #0a1a0a 0%, #152d15 50%, #0a1a0a 100%)",
    emoji: "🧤",
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!slug) return;

    // Fetch category info
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats: Category[]) => {
        const found = cats.find((c) => c.slug === slug);
        setCategory(found || null);
      });

    // Fetch products
    fetch(`/api/products?category=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  const hero = CATEGORY_HERO[slug] || {
    bg: "linear-gradient(135deg, #111 0%, #222 100%)",
    emoji: "🛍️",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Banner */}
      <div
        style={{ background: hero.bg }}
        className="py-16 px-6 text-center text-white"
      >
        <p className="text-xs tracking-widest uppercase mb-3 text-yellow-400 font-semibold">
          Premium Collection
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">
          {category?.name || slug}
        </h1>
        {category?.description && (
          <p className="text-white/70 text-base max-w-xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">
            {category?.name || slug}
          </span>
        </nav>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-6">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <p className="text-sm text-zinc-500">
            <span className="font-semibold text-zinc-900">{sorted.length}</span>{" "}
            Products
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm text-zinc-500">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-zinc-200 rounded-lg px-3 py-1.5 text-sm bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">{hero.emoji}</p>
            <h3 className="text-xl font-semibold text-zinc-700 mb-2">
              No products yet
            </h3>
            <p className="text-zinc-400 mb-6">
              Check back soon for new arrivals
            </p>
            <Link
              href="/"
              className="inline-block bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-64 bg-zinc-100 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl text-zinc-300">
              🧥
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                ⭐ Featured
              </span>
            )}
          </div>

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold tracking-widest text-sm">
                SOLD OUT
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-zinc-900 mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-zinc-500 text-xs mb-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="border border-zinc-200 text-zinc-500 text-xs px-2 py-0.5 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-zinc-400 text-xs px-1">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-brand-600">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-zinc-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-400">
              {product.stock > 0 ? `${product.stock} left` : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
