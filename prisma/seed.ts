// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Categories
  const womenCoats = await prisma.category.create({
    data: {
      name: "Women Long Coats",
      slug: "women-long-coats",
      description: "Elegant woolen long coats for women in custom sizes.",
      isActive: true,
      order: 1,
    },
  });

  const mensBlazers = await prisma.category.create({
    data: {
      name: "Mens Blazers",
      slug: "mens-blazers",
      description: "Formal and semi-formal mens blazers for office and events.",
      isActive: true,
      order: 2,
    },
  });

  const woolenJackets = await prisma.category.create({
    data: {
      name: "Woolen Jackets",
      slug: "woolen-jackets",
      description: "Warm woolen jackets suitable for daily winter wear.",
      isActive: true,
      order: 3,
    },
  });

  console.log("✅ Categories created");

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: "Women Wool Long Coat - Brown",
        slug: "women-wool-long-coat-brown",
        shortDescription: "Tailored wool coat in rich brown with full-length coverage.",
        description: "Premium women wool long coat manufactured with high-quality fabric.",
        price: 2499,
        images: ["/images/products/women-coat-1.jpg"],
        sizes: ["S", "M", "L", "XL"],
        categoryId: womenCoats.id,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Women Wool Long Coat - Black",
        slug: "women-wool-long-coat-black",
        shortDescription: "Classic black long coat, ideal for corporate and casual wear.",
        price: 2699,
        images: ["/images/products/women-coat-2.jpg"],
        sizes: ["S", "M", "L", "XL"],
        categoryId: womenCoats.id,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Mens Navy Slim Blazer",
        slug: "mens-navy-slim-blazer",
        shortDescription: "Slim-fit navy blazer perfect for office and formal meetings.",
        price: 2999,
        images: ["/images/products/mens-blazer-1.jpg"],
        sizes: ["38", "40", "42", "44"],
        categoryId: mensBlazers.id,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Mens Grey Check Blazer",
        slug: "mens-check-blazer-grey",
        shortDescription: "Grey check pattern blazer with modern cut and sharp lines.",
        price: 3199,
        images: ["/images/products/mens-blazer-2.jpg"],
        sizes: ["38", "40", "42", "44"],
        categoryId: mensBlazers.id,
        isFeatured: true,
        isActive: true,
      },
    ],
  });

  console.log("✅ Products created");
  // Create default admin user (password: Admin@123)
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.adminUser.create({
    data: {
      email: "admin@looklikestitches.com",
      password: hashedPassword,
      name: "Admin",
    },
  });


  console.log("✅ Admin user created (email: admin@looklikestitches.com, password: Admin@123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
