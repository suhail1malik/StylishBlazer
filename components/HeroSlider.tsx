// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";

// interface Product {
//   id: string;
//   name: string;
//   shortDescription: string;
//   images: string[];
//   slug: string;
// }

// interface Props {
//   products: Product[];
// }

// export default function HeroSlider({ products }: Props) {
//   const [current, setCurrent] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   // Auto slide - har 3 second baad
//   useEffect(() => {
//     if (products.length <= 1) return;

//     const timer = setInterval(() => {
//       goNext();
//     }, 3000);

//     return () => clearInterval(timer);
//   }, [current, products.length]);

//   function goNext() {
//     setIsTransitioning(true);
//     setTimeout(() => {
//       setCurrent((prev) => (prev + 1) % products.length);
//       setIsTransitioning(false);
//     }, 300);
//   }

//   function goPrev() {
//     setIsTransitioning(true);
//     setTimeout(() => {
//       setCurrent((prev) => (prev - 1 + products.length) % products.length);
//       setIsTransitioning(false);
//     }, 300);
//   }

//   function goTo(index: number) {
//     if (index === current) return;
//     setIsTransitioning(true);
//     setTimeout(() => {
//       setCurrent(index);
//       setIsTransitioning(false);
//     }, 300);
//   }

//   if (!products.length) {
//     return (
//       <div className="relative rounded-2xl overflow-hidden bg-white/10 aspect-[3/4] flex flex-col items-center justify-center text-white/60">
//         <span className="text-5xl mb-3">🛍️</span>
//         <p className="font-medium">Premium Product Image</p>
//         <p className="text-sm mt-1">Coming Soon</p>
//       </div>
//     );
//   }

//   const product = products[current];

//   return (
//     <div className="relative group">
//       {/* Main Image Container */}
//       <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-white/10 shadow-2xl">
//         <Image
//           key={current}
//           src={product.images?.[0] || ""}
//           alt={product.name}
//           width={600}
//           height={800}
//           className={`w-full h-full object-cover transition-all duration-300 ${
//             isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
//           }`}
//           priority
//         />

//         {/* Gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//         {/* Product info at bottom */}
//         <div
//           className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
//             isTransitioning
//               ? "opacity-0 translate-y-2"
//               : "opacity-100 translate-y-0"
//           }`}
//         >
//           <p className="text-white font-semibold text-sm line-clamp-1">
//             {product.name}
//           </p>
//           <p className="text-white/70 text-xs line-clamp-1 mt-0.5">
//             {product.shortDescription}
//           </p>
//         </div>

//         {/* Prev / Next arrows - desktop hover pe dikhein */}
//         {products.length > 1 && (
//           <>
//             <button
//               onClick={goPrev}
//               className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm"
//             >
//               ‹
//             </button>
//             <button
//               onClick={goNext}
//               className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm"
//             >
//               ›
//             </button>
//           </>
//         )}
//       </div>

//       {/* Dot indicators */}
//       {products.length > 1 && (
//         <div className="flex justify-center gap-1.5 mt-3">
//           {products.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => goTo(index)}
//               className={`rounded-full transition-all duration-300 ${
//                 index === current
//                   ? "w-6 h-2 bg-white"
//                   : "w-2 h-2 bg-white/40 hover:bg-white/70"
//               }`}
//             />
//           ))}
//         </div>
//       )}

//       {/* Image counter badge */}
//       {products.length > 1 && (
//         <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
//           {current + 1}/{products.length}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  shortDescription: string;
  images: string[];
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
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative aspect-[4/5]"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />

          {/* cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-white/80">{product.shortDescription}</p>
          </div>
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
