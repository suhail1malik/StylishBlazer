// components/ProductGrid.tsx
import { products } from "@/lib/dummy-data";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  categorySlug?: string;
};

export function ProductGrid({ categorySlug }: ProductGridProps) {
  const filtered =
    categorySlug != null
      ? products.filter((p) => p.categorySlug === categorySlug)
      : products;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {filtered.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
