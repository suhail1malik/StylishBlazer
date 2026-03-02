"use client";
import { useState } from "react";
import Image from "next/image";

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
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-200 shadow-md">
        {images && images.length > 0 ? (
          <Image
            src={images[selectedImage]}
            alt={productName}
            fill
            className="object-cover transition-all duration-300"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-7xl text-zinc-300">
            🧥
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
          Premium Quality
        </div>
        {isFeatured && (
          <div className="absolute right-4 top-4 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-yellow-900 shadow-md">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === i
                  ? "border-brand-600 shadow-md scale-105"
                  : "border-transparent hover:border-brand-400"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
