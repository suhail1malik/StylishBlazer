"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

type Product = {
  id: string;
  name: string;
  shortDescription: string;
  images: string[];
  slug: string;
};

export default function HeroSlider({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % products.length);
  }, [products.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    const timer = setInterval(next, 4500); // Slightly slower rotation
    return () => clearInterval(timer);
  }, [next]);

  // Swipe sensitivity
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };



  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl group touch-pan-y h-full">
      <div className="h-full w-full">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              next();
            } else if (swipe > swipeConfidenceThreshold) {
              prev();
            }
          }}
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex h-full w-full cursor-grab active:cursor-grabbing"
        >
          {products.map((product) => (
            <div key={product.id} className="relative min-w-full h-full">
              <Link href={`/products/${product.slug}`} className="block h-full w-full">
                <div className="relative aspect-[4/5] w-full h-full">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority
                    />
                  {/* cinematic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-sm">
                    <h3 className="font-serif font-bold text-lg md:text-2xl mb-1 line-clamp-1 italic tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-white/90 line-clamp-2 leading-relaxed max-w-[85%]">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows (Desktop) */}
      <button 
        onClick={(e) => { e.preventDefault(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-white hover:text-black z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-white hover:text-black z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* dots */}
      <div className="absolute bottom-4 left-6 flex gap-1.5 z-20">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
