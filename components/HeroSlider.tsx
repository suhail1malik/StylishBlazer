"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  shortDescription: string;
  images: string[];
  slug: string;
};

export default function HeroSlider({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [products.length]);

  const product = products[index];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative aspect-[4/5]"
        >
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />

            {/* cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="font-semibold text-sm md:text-lg line-clamp-1">{product.name}</h3>
              <p className="text-[10px] md:text-sm text-white/80 line-clamp-1 md:line-clamp-2">{product.shortDescription}</p>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* dots */}
      <div className="absolute bottom-3 right-4 flex gap-2">
        {products.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
