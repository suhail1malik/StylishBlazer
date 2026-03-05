import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
      const publicId = url.match(/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]+)?$/)?.[1];
      if (publicId) {
        const newPublicId = publicId.replace('looklikestitches/temp/', 'looklikestitches/products/');
        try {
          const result = await cloudinary.uploader.rename(publicId, newPublicId, { invalidate: true });
          return result.secure_url;
        } catch (e) {
          console.error("Failed to rename image in cloudinary", e);
          return url;
        }
      }
    }
    return url;
  }));
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const finalizedImages = await finalizeImages(body.images || []);

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
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
