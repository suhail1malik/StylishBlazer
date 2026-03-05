import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    const categorySlug = searchParams.get('category')
    const slugParam = searchParams.get('slug')

    const where: any = {}
    if (featured === 'true') where.isFeatured = true
    if (categorySlug) where.category = { slug: categorySlug }
    if (slugParam) where.slug = slugParam

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log('Creating product:', body)

    if (!body.name || !body.slug || !body.shortDescription || !body.categoryId) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    const existing = await prisma.product.findUnique({ where: { slug: body.slug } })
    const finalSlug = existing ? `${body.slug}-${Date.now()}` : body.slug

    const finalizedImages = await finalizeImages(body.images || []);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: finalSlug,
        shortDescription: body.shortDescription,
        description: body.description || '',
        price: parseInt(body.price),
        images: finalizedImages,
        sizes: body.sizes || [],
        tags: body.tags || [],
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
        categoryId: body.categoryId,
        fabric: body.fabric || '',
        moq: body.moq || '',
        care: body.care || '',
        finish: body.finish || '',
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('POST product error:', error)
    return NextResponse.json({ error: error.message || 'Create failed' }, { status: 500 })
  }
}
