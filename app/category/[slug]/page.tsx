// app/category/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/dummy-data";
import { ProductGrid } from "@/components/ProductGrid";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white">
      {/* Header */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <nav className="mb-4 flex items-center gap-2 text-sm text-zinc-600">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-zinc-900">{category.name}</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-zinc-600 md:text-lg">
            {category.description}
          </p>

          {/* Filter Pills (static for now) */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              All
            </button>
            <button className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-all hover:border-brand-300 hover:bg-brand-50">
              Wool
            </button>
            <button className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-all hover:border-brand-300 hover:bg-brand-50">
              Cotton Blend
            </button>
            <button className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-all hover:border-brand-300 hover:bg-brand-50">
              Premium
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <ProductGrid categorySlug={category.slug} />
        </div>
      </section>
    </div>
  );
}
