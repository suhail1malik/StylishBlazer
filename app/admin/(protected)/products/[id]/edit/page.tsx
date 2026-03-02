"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

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
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [form, setForm] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: "",
    categoryId: "",
    isFeatured: false,
    isActive: true,
    images: [] as { url: string; publicId: string; file?: File }[], // ✅ array with publicId
    sizes: "", // ✅ string (comma separated)
    tags: "", // ✅ string (comma separated)
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []));

    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((product: Product) => {
        if (product && product.id) {
          setForm({
            name: product.name || "",
            slug: product.slug || "",
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            price: product.price?.toString() || "",
            categoryId: product.categoryId || "",
            isFeatured: product.isFeatured || false,
            isActive: product.isActive !== undefined ? product.isActive : true,
            images: Array.isArray(product.images)
              ? product.images.map((img: any) =>
                  typeof img === "string"
                    ? { url: img, publicId: img }
                    : { url: img.url, publicId: img.publicId || img.url },
                )
              : [], // ✅ FIX
            sizes: product.sizes?.join(", ") || "", // ✅ string
            tags: product.tags?.join(", ") || "", // ✅ string
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name,
      slug: form.slug,
      shortDescription: form.shortDescription,
      description: form.description,
      price: parseInt(form.price),
      categoryId: form.categoryId,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      images: form.images.map((img) => img.url), // ✅ already array
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed");
      } else {
        setSuccess("Product updated successfully!");
        setTimeout(() => router.push("/admin/products"), 1500);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Edit Product</h1>
            <p className="text-sm text-zinc-500 mt-1">Update product details</p>
          </div>
          <Link
            href="/admin/products"
            className="text-sm text-zinc-500 hover:text-zinc-700 border border-zinc-200 px-4 py-2 rounded-lg bg-white"
          >
            ← Back
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-5">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Navy Blue Formal Blazer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="navy-blue-formal-blazer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="2499"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-5">
              Description
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({ ...form, shortDescription: e.target.value })
                  }
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="One line description shown on product card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
          </div>

          {/* Media & Details */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-5">
              Media & Details
            </h2>
            <div className="space-y-4">
              {/* ✅ ImageManager - no extra label or p tag */}
              <ImageUploader
                images={form.images}
                onChange={(imgs) => setForm({ ...form, images: imgs })}
                maxImages={5}
              />

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Sizes
                </label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="S, M, L, XL, XXL"
                />
                <p className="text-xs text-zinc-400 mt-1">Comma separated</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Tags
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="blazer, formal, mens"
                />
                <p className="text-xs text-zinc-400 mt-1">Comma separated</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-5">
              Settings
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    Featured Product
                  </p>
                  <p className="text-xs text-zinc-500">
                    Show on homepage featured section
                  </p>
                </div>
                <div
                  onClick={() =>
                    setForm({ ...form, isFeatured: !form.isFeatured })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    form.isFeatured ? "bg-brand-600" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      form.isFeatured ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Active</p>
                  <p className="text-xs text-zinc-500">
                    Show product on website
                  </p>
                </div>
                <div
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    form.isActive ? "bg-brand-600" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                "✅ Save Changes"
              )}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
