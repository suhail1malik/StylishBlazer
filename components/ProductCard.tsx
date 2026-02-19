// components/ProductCard.tsx
import Link from "next/link";
import type { Product } from "@/lib/dummy-data";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border-2 border-zinc-200 bg-white shadow-md transition-all hover:border-brand-300 hover:shadow-strong md:rounded-2xl"
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Featured Badge */}
        <div className="absolute left-2 top-2 z-10 md:left-3 md:top-3">
          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[9px] font-semibold text-white shadow-md md:px-2.5 md:py-1 md:text-xs">
            Featured
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-900 shadow-lg md:px-4 md:py-2 md:text-sm">
            View Details →
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-2.5 md:p-4">
        <h3 className="line-clamp-2 text-xs font-semibold text-zinc-900 transition-colors group-hover:text-brand-600 md:text-sm">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[9px] leading-snug text-zinc-600 md:mt-2 md:text-xs md:leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Price & CTA */}
        <div className="mt-auto flex items-center justify-between pt-2 md:pt-4">
          {product.price && (
            <p className="text-sm font-bold text-brand-600 md:text-lg">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          )}
          <span className="text-[9px] font-semibold text-zinc-500 transition-colors group-hover:text-brand-600 md:text-xs">
            Enquire →
          </span>
        </div>
      </div>
    </Link>
  );
}
