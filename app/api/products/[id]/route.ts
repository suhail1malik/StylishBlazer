import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function finalizeImages(images: string[]) {
  if (!images || !Array.isArray(images)) return [];

  return Promise.all(images.map(async (url) => {
    if (url.includes('looklikestitches/temp/')) {
        const publicIdMatch = url.match(/(looklikestitches\/temp\/[^\.]+)/);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;
        if (publicId) {
          const newPublicId = publicId.replace('looklikestitches/temp/', 'looklikestitches/products/');
        try {
          const result = await cloudinary.uploader.rename(publicId, newPublicId, { invalidate: true, overwrite: true });
          return result.secure_url;
        } catch (e: any) {
          console.error("Cloudinary rename failed for:", publicId, "Error Details:", e?.message || e);
          return url;
        }
      }
    }
    return url;
  }));
}

function extractPublicId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(looklikestitches\/(?:temp|products)\/[^\.]+)/);
  return match ? match[1] : null;
}


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const oldProduct = await prisma.product.findUnique({ where: { id } });
    if (!oldProduct) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const finalizedImages = await finalizeImages(body.images || []);

    // Cleanup removed images from Cloudinary
    const oldImages = oldProduct.images || [];
    const imagesToDelete = oldImages.filter(img => !finalizedImages.includes(img) && img.includes('cloudinary.com'));
    
    for (const imgUrl of imagesToDelete) {
      const publicId = extractPublicId(imgUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.error(`Failed to delete orphaned image: ${publicId}`, e);
        }
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        shortDescription: body.shortDescription,
        description: body.description,
        price: parseInt(body.price),
        images: finalizedImages,
        sizes: body.sizes || [],
        tags: body.tags || [],
        isFeatured: body.isFeatured,
        isActive: body.isActive,
        categoryId: body.categoryId,
        fabric: body.fabric,
        moq: body.moq,
        care: body.care,
        finish: body.finish,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
      },
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    
    if (product && product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        const publicId = extractPublicId(imgUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (e) {
            console.error(`Failed to delete image during product delete: ${publicId}`, e);
          }
        }
      }
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath('/')
    revalidatePath('/products')
    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
