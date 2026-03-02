// app/(client)/products/page.tsx
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our full range of premium outerwear — women coats, woolen jackets, and mens blazers by StylishBlazer.",
  alternates: {
    canonical: "https://stylishblazer.in/products",
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
