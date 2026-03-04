"use client";
import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface Props {
  images: string[];
  productName: string;
  isFeatured: boolean;
}

export default function ProductImageGallery({
  images,
  productName,
  isFeatured,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails - Vertical on MD desktops */}
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 md:flex md:flex-col gap-3 md:w-20 lg:w-24">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                selectedImage === i
                  ? "border-emerald-600 ring-2 ring-emerald-500/20 scale-105"
                  : "border-slate-100 hover:border-emerald-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="relative flex-1 aspect-[3/4] md:aspect-square overflow-hidden rounded-[32px] md:rounded-[48px] border border-slate-100 bg-white shadow-premium">
        {images && images.length > 0 ? (
          <Image
            src={images[selectedImage]}
            alt={productName}
            fill
            className="object-cover transition-transform duration-1000"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-7xl text-slate-200">
            🧥
          </div>
        )}

        {isFeatured && (
          <div className="absolute right-6 top-6 bg-amber-400 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
            Signature Piece
          </div>
        )}
      </div>
    </div>
  );
}
