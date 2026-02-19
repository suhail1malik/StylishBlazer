// lib/dummy-data.ts
export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string;
  price?: number;
  image: string;
};

export const categories: Category[] = [
  {
    slug: "women-long-coats",
    name: "Women Long Coats",
    description: "Elegant woolen long coats for women in custom sizes.",
    image: "/images/categories/women-coats.jpg",
  },
  {
    slug: "mens-blazers",
    name: "Mens Blazers",
    description: "Formal and semi-formal mens blazers for office and events.",
    image: "/images/categories/mens-blazers.jpg",
  },
  {
    slug: "woolen-jackets",
    name: "Woolen Jackets",
    description: "Warm woolen jackets suitable for daily winter wear.",
    image: "/images/categories/woolen-jackets.jpg",
  },
];

export const products: Product[] = [
  {
    slug: "women-wool-long-coat-brown",
    name: "Women Wool Long Coat - Brown",
    categorySlug: "women-long-coats",
    shortDescription: "Tailored wool coat in rich brown with full-length coverage.",
    price: 2499,
    image: "/images/products/women-coat-1.jpg",
  },
  {
    slug: "women-wool-long-coat-black",
    name: "Women Wool Long Coat - Black",
    categorySlug: "women-long-coats",
    shortDescription: "Classic black long coat, ideal for corporate and casual wear.",
    price: 2699,
    image: "/images/products/women-coat-2.jpg",
  },
  {
    slug: "mens-navy-slim-blazer",
    name: "Mens Navy Slim Blazer",
    categorySlug: "mens-blazers",
    shortDescription: "Slim-fit navy blazer perfect for office and formal meetings.",
    price: 2999,
    image: "/images/products/mens-blazer-1.jpg",
  },
  {
    slug: "mens-check-blazer-grey",
    name: "Mens Grey Check Blazer",
    categorySlug: "mens-blazers",
    shortDescription: "Grey check pattern blazer with modern cut and sharp lines.",
    price: 3199,
    image: "/images/products/mens-blazer-2.jpg",
  },
];
