import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category (Admin only)
export async function POST(req: NextRequest) {
  try {
    const { name, description, order, image, seoTitle, seoDescription } = await req.json();
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        isActive: true,
        order: order || 0,
        image: image || null,
        seoTitle: seoTitle || '',
        seoDescription: seoDescription || '',
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}
