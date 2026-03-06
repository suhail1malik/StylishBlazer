import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our full range of premium outerwear — women coats, woolen jackets, and mens blazers by StylishBlazer.",
  alternates: {
    canonical: "https://stylishblazer.in/products",
  },
};

export const revalidate = 60;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
    }),
  ]);

  return (
    <ProductsClient 
      initialProducts={products as any} 
      initialCategories={categories as any} 
    />
  );
}
