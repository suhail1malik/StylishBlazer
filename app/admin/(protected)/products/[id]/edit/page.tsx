"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Save, 
  Trash2, 
  Image as ImageIcon, 
  Plus, 
  Info, 
  Tag, 
  Settings, 
  Layers, 
  ExternalLink,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Search
} from "lucide-react";

import ImageUploader from "@/components/admin/ImageUploader";

interface Category {
  id: string;
  name: string;
}

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: 0,
    categoryId: "",
    images: [] as string[],
    isActive: true,
    isFeatured: false,
    fabric: "",
    care: "",
    moq: "",
    finish: "",
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch("/api/categories"),
        ]);
        const product = await pRes.json();
        const cats = await cRes.json();
        
        setCategories(cats);
        if (product) {
          setForm({
            name: product.name || "",
            slug: product.slug || "",
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            price: product.price || 0,
            categoryId: product.categoryId || "",
            images: product.images || [],
            isActive: product.isActive ?? true,
            isFeatured: product.isFeatured ?? false,
            fabric: product.fabric || "",
            care: product.care || "",
            moq: product.moq || "",
            finish: product.finish || "",
            seoTitle: product.seoTitle || "",
            seoDescription: product.seoDescription || "",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleImagesChange = (uploadedImages: { url: string; publicId: string }[]) => {
    setForm(prev => ({ ...prev, images: uploadedImages.map(img => img.url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This article will be permanently removed.")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Article Data...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <Link 
            href="/admin/products" 
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Back to Collection</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Edit Product
          </h1>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="text-emerald-600">ID: {id}</span>
            <span>•</span>
            <span className={form.isActive ? "text-emerald-500" : "text-red-400"}>
              {form.isActive ? "Live in Store" : "Hidden"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-3.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-emerald-950 text-emerald-50 hover:bg-emerald-900 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-900/10 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Secure Update"}
          </button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200/60">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" /> Product Gallery
            </h3>
            
            <ImageUploader 
              images={form.images.map(url => ({ url, publicId: "" }))} 
              onChange={handleImagesChange}
              maxImages={10}
            />
            
            <p className="mt-4 text-[10px] text-slate-400 leading-relaxed font-medium text-center">
              The first image will be the primary visual for catalog and search results.
            </p>
          </section>

          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Availability
            </h3>
            <div className="space-y-4">
              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                form.isActive ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-100 hover:border-slate-200"
              }`}>
                <div>
                  <p className="text-xs font-bold text-slate-900">Visibility Status</p>
                  <p className="text-[10px] text-slate-400">{form.isActive ? "Publicly Accessible" : "Hidden from Catalog"}</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-200"
                />
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                form.isFeatured ? "bg-amber-50/50 border-amber-100" : "bg-slate-50 border-slate-100 hover:border-slate-200"
              }`}>
                <div>
                  <p className="text-xs font-bold text-slate-900">Collection Spotlight</p>
                  <p className="text-[10px] text-slate-400">Featured in Hero Sections</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded-md text-amber-600 focus:ring-amber-500 border-slate-200"
                />
              </label>
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2">
               <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Narrative & Identification</h3>
               <Layers className="w-5 h-5 text-slate-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600">Article Title</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50/80 border-none rounded-2xl px-6 py-5 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="e.g. Royal Oxford bespoke Blazer"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">URL Slug (Computed)</label>
                <div className="flex items-center gap-2 bg-slate-50/80 rounded-2xl px-5 py-4 border border-slate-100/50">
                   <Link href={`/products/${form.slug}`} target="_blank" className="text-emerald-600 hover:scale-110 transition-transform">
                      <ExternalLink className="w-3.5 h-3.5" />
                   </Link>
                   <input
                    required
                    type="text"
                    value={form.slug}
                    className="flex-1 bg-transparent border-none p-0 text-sm font-semibold text-slate-500 focus:ring-0"
                    placeholder="article-slug"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Article Hierarchy (Category)</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full bg-slate-50/80 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                >
                  <option value="">Select Curated Collection</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-bold">Price Point</label>
                <div className="relative">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-serif font-bold text-lg">₹</div>
                   <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value.toString()) || 0 })}
                    className="w-full bg-slate-50/80 border-none rounded-2xl pl-12 pr-6 py-5 text-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Brief Highlights (Short Description)</label>
                <textarea
                  required
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full bg-slate-50/80 border-none rounded-2xl px-6 py-4 text-sm text-slate-600 leading-relaxed focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  placeholder="A one-sentence hook for this piece..."
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Descriptive Narrative (Detailed Description)</label>
                <textarea
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50/80 border-none rounded-3xl px-6 py-5 text-sm text-slate-600 leading-relaxed focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  placeholder="Tell the story of this piece..."
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2">
               <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Technical Detail</h3>
               <Tag className="w-5 h-5 text-slate-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Fabric & Composition", key: "fabric", placeholder: "e.g. 100% Italian Worsted Wool", icon: <Info className="w-3.5 h-3.5" /> },
                { label: "Garment Finish", key: "finish", placeholder: "e.g. Satin Silk Lapels", icon: <Info className="w-3.5 h-3.5" /> },
                { label: "Minimum Commitment (MOQ)", key: "moq", placeholder: "e.g. Single Bespoke Order", icon: <Info className="w-3.5 h-3.5" /> },
                { label: "Artisanal Care", key: "care", placeholder: "e.g. Professional Dry Clean Only", icon: <Info className="w-3.5 h-3.5" /> },
              ].map((spec) => (
                <div key={spec.key} className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {spec.icon} {spec.label}
                  </label>
                  <input
                    type="text"
                    value={(form as any)[spec.key]}
                    onChange={(e) => setForm({ ...form, [spec.key]: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder={spec.placeholder}
                  />
                </div>
              ))}
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                 <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-xs font-bold text-emerald-900 mb-1">Curated Specification</p>
                 <p className="text-[10px] text-emerald-700/70 leading-relaxed font-medium">
                   These details will be showcased in the technical tab of the article page, helping clients understand the artisanal value of the piece.
                 </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2">
               <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>SEO Optimization</h3>
               <Search className="w-5 h-5 text-slate-200" />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600">SEO Meta Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  className="w-full bg-slate-50/80 border-none rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="Recommended: 50-60 characters"
                />
                <p className="text-[10px] text-slate-400 font-medium px-2">Appears as the clickable headline in search results.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600">SEO Meta Description</label>
                <textarea
                  rows={3}
                  value={form.seoDescription}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  className="w-full bg-slate-50/80 border-none rounded-2xl px-6 py-4 text-sm text-slate-600 leading-relaxed focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  placeholder="Recommended: 150-160 characters"
                />
                <p className="text-[10px] text-slate-400 font-medium px-2">A concise summary of the page for search engine snippets.</p>
              </div>
            </div>
          </section>

          <div className="bg-slate-900 rounded-[32px] p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="flex gap-6 items-center">
                <div className="w-16 h-16 rounded-[20px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                   <AlertCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                   <h4 className="text-white font-serif font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Article Management</h4>
                   <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                     Ensure all metrics and descriptions are accurate before confirming updates. Changes are reflected synchronously across the storefront.
                   </p>
                </div>
             </div>
          </div>
          </div>

          <div className="lg:col-span-12 pt-8">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full bg-emerald-950 text-emerald-400 rounded-[32px] py-6 font-serif text-xl font-bold flex items-center justify-center gap-4 shadow-2xl shadow-emerald-900/40 hover:bg-emerald-900 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 border border-emerald-800/50"
            >
              {saving ? (
                <div className="w-6 h-6 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  Secure Article Update
                </>
              )}
            </button>
          </div>
        </form>
    </div>
  );
}
