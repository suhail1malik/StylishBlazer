import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CategoryClient from "./CategoryClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://stylishblazer.com";
  const categoryUrl = `${baseUrl}/category/${slug}`;
  const imageUrl = category.image ? `${baseUrl}${category.image}` : `${baseUrl}/og-category.jpg`;

  return {
    title: `${category.name} | StylishBlazer Collection`,
    description: category.description || `Explore our premium ${category.name} collection at StylishBlazer.`,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: `${category.name} | Premium Collection`,
      description: category.description || `Discover meticulously crafted ${category.name}.`,
      url: categoryUrl,
      siteName: "StylishBlazer",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: category.name,
      description: category.description || `Explore the ${category.name} collection.`,
      images: [imageUrl],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <CategoryClient 
      initialCategory={category} 
      initialProducts={products} 
    />
  );
}
