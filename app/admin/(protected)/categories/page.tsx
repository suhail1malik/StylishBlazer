"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  X, 
  ArrowUpDown,
  Layers,
  ShoppingBag,
  Search
} from "lucide-react";
import CategoryListClient from "./CategoryListClient";
import ImageUploader from "@/components/admin/ImageUploader";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  isActive: boolean;
  order: number;
  _count: { products: number };
}

type FormState = { name: string; description: string; order: number; image: string; seoTitle: string; seoDescription: string };

const EMPTY_FORM: FormState = { name: "", description: "", order: 0, image: "", seoTitle: "", seoDescription: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleImageChange = (uploadedImages: { url: string; publicId: string }[]) => {
    if (uploadedImages.length > 0) {
      setForm((f) => ({ ...f, image: uploadedImages[0].url }));
    } else {
      setForm((f) => ({ ...f, image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      order: form.order,
      image: form.image || null,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
    };
    const res = editingId 
      ? await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchCategories();
    } else {
      const data = await res.json();
      alert(`Operation failed: ${data.error || 'Unknown error'}`);
    }
    setSaving(false);
  };

  const handleEdit = (cat: Category) => {
    setForm({ 
      name: cat.name, 
      description: cat.description, 
      order: cat.order, 
      image: cat.image ?? "",
      seoTitle: (cat as any).seoTitle || "",
      seoDescription: (cat as any).seoDescription || ""
    });
    setEditingId(cat.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, productCount: number) => {
    if (productCount > 0) return alert("Delete all products in this category first!");
    if (!confirm("Are you sure you want to delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const openAddForm = () => {
    setShowForm(true);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setUploadError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Categories
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Manage your product catalog structure and presentation.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="group inline-flex items-center gap-2 bg-emerald-950 text-emerald-50 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        )}
      </div>

      {/* ── Add / Edit Form ────────────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-[32px] shadow-premium border border-slate-200/60 overflow-hidden transition-all animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-8 md:p-10">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
              <h2 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <button 
                onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Image Upload */}
              <div className="lg:col-span-4 space-y-4">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">
                  Category Aesthetic
                </label>
                <ImageUploader 
                  images={form.image ? [{ url: form.image, publicId: "" }] : []} 
                  onChange={handleImageChange}
                  maxImages={1}
                />
              </div>

              {/* Right Column: Info */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">
                      Category Name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Artisanal Blazers"
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-base font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Collection Narrative
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe the essence of this category..."
                      rows={4}
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Display Hierarchy
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Lower numbers appear first on the storefront.</p>
                  </div>
                </div>

                {/* SEO Section for Category */}
                <div className="pt-8 border-t border-slate-100 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">SEO Optimization</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                        SEO Meta Title
                      </label>
                      <input
                        value={form.seoTitle}
                        onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                        placeholder="Recommended: 50-60 characters"
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                        SEO Meta Description
                      </label>
                      <textarea
                        value={form.seoDescription}
                        onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                        placeholder="Recommended: 150-160 characters"
                        rows={3}
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-8 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 active:scale-95 disabled:opacity-50"
                  >
                    {saving ? "Processing..." : editingId ? "Confirm Updates" : "Create Collection"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
                    className="px-8 py-4 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all"
                  >
                    Discard
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Categories List Section ──────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => (
            <div key={n} className="bg-white rounded-[32px] p-6 h-[200px] animate-pulse border border-slate-100">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl mb-4" />
              <div className="h-4 w-32 bg-slate-50 rounded mb-2" />
              <div className="h-3 w-48 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <CategoryListClient 
          categories={categories} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      {/* ── Stat Footer ───────────────────────────────────────────────── */}
      {!loading && (
        <div className="bg-emerald-950 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Collections</p>
              <p className="text-white text-3xl font-serif font-bold">{categories.length}</p>
            </div>
            <div>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Active Status</p>
              <p className="text-white text-3xl font-serif font-bold">{categories.filter(c => c.isActive).length}</p>
            </div>
            <div>
               <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Articles</p>
               <p className="text-white text-3xl font-serif font-bold">{categories.reduce((s, c) => s + c._count.products, 0)}</p>
            </div>
            <div className="flex items-center justify-end">
               <div className="hidden lg:block">
                 <ShoppingBag className="w-12 h-12 text-emerald-800" />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
