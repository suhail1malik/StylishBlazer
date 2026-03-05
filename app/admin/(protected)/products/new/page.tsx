"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Save, 
  Plus, 
  Image as ImageIcon, 
  Info, 
  Tag, 
  Settings, 
  Layers, 
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Search
} from "lucide-react";

import ImageUploader from "@/components/admin/ImageUploader";

interface Category {
  id: string;
  name: string;
}

export default function AdminProductNewPage() {
  const router = useRouter();

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
    tags: [] as string[],
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  // Simple sluggish generator
  useEffect(() => {
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm(f => ({ ...f, slug }));
  }, [form.name]);

  const handleImagesChange = (uploadedImages: { url: string; publicId: string }[]) => {
    setForm(prev => ({ ...prev, images: uploadedImages.map(img => img.url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Creation failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during product creation.");
    } finally {
      setSaving(false);
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setForm(prev => ({ ...prev, tags: newTags }));
  };

  const TagInput = ({ tags, onChange }: { tags: string[], onChange: (tags: string[]) => void }) => {
    const [input, setInput] = useState("");
    
    const addTag = () => {
      const trimmed = input.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
        setInput("");
      }
    };

    const removeTag = (tagToRemove: string) => {
      onChange(tags.filter(t => t !== tagToRemove));
    };

    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag..."
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-emerald-950 text-white px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-100/50 group">
              {tag}
              <button 
                type="button"
                onClick={() => removeTag(tag)}
                className="text-emerald-400 hover:text-emerald-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {tags.length === 0 && <p className="text-[10px] text-slate-400 font-medium px-1">No tags added yet.</p>}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Initializing Studio...</p>
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
            <span className="text-[10px] uppercase font-bold tracking-widest">Collection Overview</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            New Product
          </h1>
          <p className="text-slate-500 text-sm font-medium">Add a new masterpiece to your curated collection.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            form="product-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-emerald-950 text-emerald-50 hover:bg-emerald-900 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-900/10 active:scale-95 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {saving ? "Creating Art..." : "Publish Article"}
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
              images={(form.images || []).map(url => ({ url, publicId: "" }))} 
              onChange={handleImagesChange}
              maxImages={10}
            />
            
            <p className="mt-4 text-[10px] text-slate-400 leading-relaxed font-medium text-center">
              Upload multiple perspectives. The first image will be your main collection visual.
            </p>
          </section>

          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Initial State
            </h3>
            <div className="space-y-4">
              <label className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                form.isActive ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-100 hover:border-slate-200"
              }`}>
                <div>
                  <p className="text-xs font-bold text-slate-900">Publish Instantly</p>
                  <p className="text-[10px] text-slate-400">Makes the article live immediately</p>
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
                  <p className="text-xs font-bold text-slate-900">Premium Selection</p>
                  <p className="text-[10px] text-slate-400">Showcase in Premium Collections</p>
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
               <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Product Narrative</h3>
               <Layers className="w-5 h-5 text-slate-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600">Product Title</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50/80 border-none rounded-2xl px-6 py-5 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="e.g. Italian Silk Dinner Jacket"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Auto-Generated Slug</label>
                <div className="flex items-center gap-2 bg-slate-200/30 rounded-2xl px-5 py-4 border border-slate-100/50">
                   <input
                    required
                    type="text"
                    value={form.slug}
                    className="flex-1 bg-transparent border-none p-0 text-sm font-semibold text-slate-400 focus:ring-0 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Curated Category</label>
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
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Investment (Price)</label>
                <div className="relative">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-serif font-bold text-lg">₹</div>
                   <input
                    required
                    type="number"
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
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
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">The Narrative (Detailed Description)</label>
                <textarea
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50/80 border-none rounded-3xl px-6 py-5 text-sm text-slate-600 leading-relaxed focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  placeholder="Describe the silhouette, the feel, and the artisan details..."
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2">
               <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Technical Blueprint</h3>
               <Tag className="w-5 h-5 text-slate-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Fabric Blend", key: "fabric", placeholder: "e.g. Grade-A Merino Wool" },
                { label: "Execution Style", key: "finish", placeholder: "e.g. Hand-stitched Finish" },
                { label: "Standard MOQ", key: "moq", placeholder: "e.g. Bespoke Single Unit" },
                { label: "Preservation", key: "care", placeholder: "e.g. Specialized Dry Cleaning" },
              ].map((spec) => (
                <div key={spec.key} className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <Info className="w-3.5 h-3.5" /> {spec.label}
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
              
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <Tag className="w-3.5 h-3.5" /> Discovery Tags
                </label>
                <TagInput tags={form.tags} onChange={handleTagsChange} />
                <p className="text-[10px] text-slate-400 font-medium px-1">Helps in searching and grouping your articles.</p>
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
                  <Plus className="w-6 h-6" />
                  Publish to Collection
                </>
              )}
            </button>
          </div>
        </form>
    </div>
  );
}
