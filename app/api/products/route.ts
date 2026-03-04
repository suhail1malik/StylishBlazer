import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: finalSlug,
        shortDescription: body.shortDescription,
        description: body.description || '',
        price: parseInt(body.price),
        images: body.images || [],
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
