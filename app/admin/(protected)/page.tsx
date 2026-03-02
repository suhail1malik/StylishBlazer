// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getDashboardStats() {
  const [productsCount, categoriesCount, featuredCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { isFeatured: true } }),
  ]);

  return { productsCount, categoriesCount, featuredCount };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-600">
          Welcome back! Here&#39;s what&#39;s happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              👔
            </div>
            <span className="text-blue-600 text-sm font-medium">Total</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {stats.productsCount}
          </div>
          <div className="text-slate-600 text-sm">Products</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl">
              📁
            </div>
            <span className="text-emerald-600 text-sm font-medium">Active</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {stats.categoriesCount}
          </div>
          <div className="text-slate-600 text-sm">Categories</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
              ⭐
            </div>
            <span className="text-amber-600 text-sm font-medium">Featured</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {stats.featuredCount}
          </div>
          <div className="text-slate-600 text-sm">Featured Products</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition group"
          >
            <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-200 rounded-lg flex items-center justify-center text-2xl transition">
              ➕
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-1">
                Add New Product
              </div>
              <div className="text-sm text-slate-600">
                Create a new product listing
              </div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
          >
            <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center text-2xl transition">
              📁
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-1">
                Manage Categories
              </div>
              <div className="text-sm text-slate-600">
                Edit product categories
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
