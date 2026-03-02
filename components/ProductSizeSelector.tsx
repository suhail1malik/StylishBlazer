"use client";
import { useState } from "react";

interface Props {
  sizes: string[];
}

export default function ProductSizeSelector({ sizes }: Props) {
  const [selectedSize, setSelectedSize] = useState("");

  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
          Available Sizes
        </h3>
        {selectedSize && (
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-full">
            Selected: {selectedSize}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
            className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              selectedSize === size
                ? "border-brand-600 bg-brand-600 text-white shadow-md scale-105"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-brand-400 hover:text-brand-600"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
