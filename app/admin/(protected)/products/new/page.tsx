"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [tags, setTags] = useState("");

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setError("Categories load nahi huyi"));
  }, []);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  function toggleSize(size: string) {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !shortDescription || !price || !categoryId) {
      setError("Name, Short Description, Price aur Category required hain");
      return;
    }

    setLoading(true);

    try {
      const imageUrls = images.map((img) => img.url);
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: generateSlug(name),
          shortDescription,
          description,
          price: parseInt(price),
          categoryId,
          isFeatured,
          isActive,
          images: imageUrls,
          sizes,
          tags: tagsArray,
        }),
      });

      // ✅ Pehle text read karo
      const text = await res.text();
      let data: any = {};

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server response:", text);
        setError(`Server error: ${text.slice(0, 150)}`);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Product create nahi hua");
        return;
      }

      setSuccess("✅ Product successfully add ho gaya!");
      setTimeout(() => router.push("/admin/products"), 1500);
    } catch (err: any) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Fill in product details below
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic Black Long Coat"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {name && (
              <p className="text-xs text-gray-400 mt-1">
                Slug: <span className="font-mono">{generateSlug(name)}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. Premium black long coat for women"
              maxLength={150}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              {shortDescription.length}/150
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed product description..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Pricing & Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">
            Pricing & Category
          </h2>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2999"
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="border-b pb-3">
            <h2 className="font-semibold text-gray-900 text-lg">
              Product Images
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Ek ek karke upload karo • Crop karke set karo • Max 5 images
            </p>
          </div>
          <ImageUploader images={images} onChange={setImages} maxImages={5} />
        </div>

        {/* Sizes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">
            Available Sizes
          </h2>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  sizes.includes(size)
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {sizes.length > 0 && (
            <p className="text-xs text-gray-500">
              Selected: {sizes.join(", ")}
            </p>
          )}
        </div>

        {/* Tags & Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">
            Tags & Settings
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tags{" "}
              <span className="text-gray-400 text-xs">(comma separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="coat, winter, women, premium"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-700">Featured Product</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Homepage pe show hoga
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFeatured(!isFeatured)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                isFeatured ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isFeatured ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <p className="font-medium text-gray-700">Active / Visible</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Store me visible hoga
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                isActive ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isActive ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pb-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
