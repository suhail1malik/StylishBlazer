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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          SELECT SIZE
        </h3>
        {selectedSize && (
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            Selected: {selectedSize}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
            className={`min-w-[56px] text-center rounded-xl border-2 py-3 px-4 text-xs font-bold transition-all duration-300 ${
              selectedSize === size
                ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-slate-100 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
