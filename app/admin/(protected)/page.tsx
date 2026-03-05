import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

async function getDashboardStats() {
  const [productsCount, categoriesCount, featuredCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { isFeatured: true } }),
  ]);

  return { productsCount, categoriesCount, featuredCount };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return <DashboardClient stats={stats} />;
}

