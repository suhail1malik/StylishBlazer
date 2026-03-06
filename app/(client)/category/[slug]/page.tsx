import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

const getCategory = cache(async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
  });
});
import CategoryClient from "./CategoryClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://stylishblazer.com";
  const categoryUrl = `${baseUrl}/category/${slug}`;
  const imageUrl = category.image ? `${baseUrl}${category.image}` : `${baseUrl}/og-category.jpg`;

  const seoTitle = (category as any).seoTitle || `${category.name} | StylishBlazer Collection`;
  const seoDescription = (category as any).seoDescription || category.description || `Explore our premium ${category.name} collection at StylishBlazer.`;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: (category as any).seoTitle || `${category.name} | Premium Collection`,
      description: seoDescription,
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
      title: (category as any).seoTitle || category.name,
      description: seoDescription,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export const revalidate = 60;

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);

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
