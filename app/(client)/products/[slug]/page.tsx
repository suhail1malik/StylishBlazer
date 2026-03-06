import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ChevronRight, Truck, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { 
  FadeIn, 
  StaggerGrid, 
  StaggerItem, 
  SectionHeading 
} from "@/components/AnimatedSections";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductSizeSelector from "@/components/ProductSizeSelector";
import ProductActions from "@/components/ProductActions";

type Props = {
  params: Promise<{ slug: string }>;
};

const getProduct = cache(async (slug: string) => {
  return await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProduct(slug)) as any;

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://stylishblazer.com";
  const productUrl = `${baseUrl}/products/${slug}`;
  const imageUrl = product.images?.[0] ? `${baseUrl}${product.images[0]}` : `${baseUrl}/og-image.jpg`;

  const productTitle = product.seoTitle || `${product.name} | StylishBlazer`;
  const productDescription = product.seoDescription || product.shortDescription;

  return {
    title: productTitle,
    description: productDescription,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.seoTitle || `${product.name} | Premium Collection`,
      description: productDescription,
      url: productUrl,
      siteName: "StylishBlazer",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.name,
      description: productDescription,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export const revalidate = 60;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = (await getProduct(slug)) as any;

  if (!product || !product.isActive) {
    notFound();
  }

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.shortDescription,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "StylishBlazer"
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://stylishblazer.com"}/products/${slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "StylishBlazer"
      }
    }
  };

  // Related products logic
  const relatedProducts = (await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })) as any[];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Add JSON-LD to the head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Premium Dark Header / Breadcrumb */}
      <div 
        className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-12"
        style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a2e1f 45%, #0f2218 100%)" }}
      >
        {/* Grid Lines Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-slate-400 tracking-wider uppercase">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-emerald-400 transition-colors">Collections</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/category/${product.category.slug}`} className="hover:text-emerald-400 transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium truncate max-w-[150px] md:max-w-none">{product.name}</span>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          {/* Left Side: Images */}
          <div className="lg:col-span-7">
            <FadeIn>
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                isFeatured={product.isFeatured}
              />
            </FadeIn>
          </div>

          {/* Right Side: Product Details */}
          <div className="lg:col-span-5 flex flex-col">
            <FadeIn>
              {/* Category & Status */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  {product.category?.name || "Premium Collection"}
                </span>
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">In Stock</span>
                </div>
              </div>

              {/* Title & Price */}
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                {product.price && (
                  <p className="text-3xl md:text-4xl font-bold text-slate-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                )}
                <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold ml-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  MOQ: {product.moq || "50 Pcs"}
                </span>
              </div>

              {/* Enhanced Description Area */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                  PRODUCT STORY
                </h3>
                <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                  {product.description ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>
                      Meticulously crafted with premium fabrics and artisanal precision, this article is a testament 
                      to our heritage in Chandigarh. designed for those who command presence with a 
                      sophisticated silhouette.
                    </p>
                  )}
                </div>

                {/* Technical Specs - Compact Grid */}
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: "Fabric", value: product.fabric || "Premium Wool Blend" },
                    { label: "Care", value: product.care || "Dry Clean Only" },
                    { label: "MOQ", value: product.moq || "50 Pieces" },
                    { label: "Finish", value: product.finish || "Double Inspected" }
                  ].map((spec, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mb-1">{spec.label}</span>
                      <span className="text-[11px] font-medium text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-8">
                <ProductSizeSelector sizes={product.sizes} />
              </div>

              {/* Action Buttons */}
              <div className="mt-10">
                <ProductActions 
                  productName={product.name} 
                  productImage={product.images?.[0]}
                  productUrl={`${process.env.NEXT_PUBLIC_BASE_URL || "https://stylishblazer.com"}/products/${product.slug}`}
                />
              </div>

              {/* Delivery info / trust */}
              <div className="grid grid-cols-2 gap-4 pt-10 border-t border-slate-100 mt-10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-1">Pan-India Delivery</p>
                    <p className="text-[10px] text-slate-500">Ships within 15-20 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-1">Quality Assured</p>
                    <p className="text-[10px] text-slate-500">Double-inspected finish</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Related Products Section - Distinct Background */}
      {relatedProducts.length > 0 && (
        <div className="bg-[#f1f5f2] border-y border-emerald-100/50 py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
              eyebrow="You May Also Like"
              title="Similar Styles"
              subtitle="Curated pieces from the same collection that share this article's sophisticated silhouette."
            />
            
            <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12">
              {relatedProducts.map((item) => (
                <StaggerItem key={item.id}>
                  <Link
                    href={`/products/${item.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-soft hover:shadow-premium transition-all duration-500"
                  >
                    <div className="relative bg-slate-100 aspect-[3/4] overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-5xl opacity-30">
                          👔
                        </div>
                      )}
                      <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/10 transition-colors duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-semibold text-sm md:text-base text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                        {item.category?.name || "Premium Collection"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base font-bold text-emerald-600">
                          ₹{item.price?.toLocaleString("en-IN") || "N/A"}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
                          View
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">

        {/* Bottom Call to Action */}
        <FadeIn className="mt-20 md:mt-32 p-8 md:p-16 rounded-[48px] bg-emerald-900 border border-emerald-800 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Interested in Bulk Customization?</h2>
            <p className="text-emerald-100/80 mb-10 text-sm md:text-base">
              We offer bespoke manufacturing services for corporate brands and retail chains. 
              Let's create a collection that carries your unique identity.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-emerald-900 px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl"
            >
              Consult With Our Designers
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
