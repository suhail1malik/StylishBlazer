// components/CategoryGrid.tsx
import Link from "next/link";
import { categories } from "@/lib/dummy-data";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-8">
      {categories.map((category, index) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className="group relative overflow-hidden rounded-xl border-2 border-zinc-200 bg-white shadow-md transition-all duration-300 hover:border-brand-400 hover:shadow-xl md:rounded-3xl md:hover:-translate-y-2"
        >
          {/* Image Container */}
          <div className="relative aspect-4/3 w-full overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100">
            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03]">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id={`dots-${index}`}
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#dots-${index})`} />
              </svg>
            </div>

            {/* New Badge */}
            <div className="absolute right-2 top-2 z-10 md:right-4 md:top-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-zinc-900 shadow-lg ring-2 ring-zinc-900/10 md:gap-1.5 md:px-3.5 md:py-1.5 md:text-xs">
                <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse md:h-1.5 md:w-1.5" />
                New
              </span>
            </div>

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-xl ring-1 ring-zinc-900/5 transition-all duration-300 group-hover:scale-110 md:h-24 md:w-24 md:rounded-2xl">
                <svg
                  className="h-7 w-7 text-brand-600 md:h-12 md:w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 011.5 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative bg-white p-3 md:p-6">
            <h3 className="text-sm font-bold text-zinc-900 transition-colors duration-300 group-hover:text-brand-600 md:text-xl">
              {category.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-zinc-600 md:mt-2.5 md:text-sm md:leading-relaxed">
              {category.description}
            </p>

            {/* CTA Link */}
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-brand-700 transition-all duration-300 group-hover:gap-2 group-hover:text-brand-600 md:mt-5 md:gap-2 md:text-sm md:group-hover:gap-3">
              <span>Explore</span>
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 md:h-4 md:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>

            {/* Bottom Border Animation */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-brand-600 to-brand-700 transition-all duration-300 group-hover:w-full rounded-full md:h-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}
