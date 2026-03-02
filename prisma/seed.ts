import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const womenCoats = await prisma.category.upsert({
    where: { slug: 'women-coats' },
    update: {},
    create: {
      name: 'Women Long Coats',
      slug: 'women-coats',
      description: 'Premium women long coats collection',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500',
    },
  })

  const mensBlazer = await prisma.category.upsert({
    where: { slug: 'mens-blazers' },
    update: {},
    create: {
      name: 'Mens Blazers',
      slug: 'mens-blazers',
      description: 'Premium mens blazers collection',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500',
    },
  })

  const woolenJackets = await prisma.category.upsert({
    where: { slug: 'woolen-jackets' },
    update: {},
    create: {
      name: 'Woolen Jackets',
      slug: 'woolen-jackets',
      description: 'Premium woolen jackets collection',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500',
    },
  })

  console.log('✅ Categories ready')

  await prisma.product.deleteMany({})

  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Black Long Coat',
        slug: 'classic-black-long-coat',
        shortDescription: 'Premium black long coat for women',
        description: 'Premium quality black long coat for women. Perfect for winter season.',
        price: 2999,
        images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500'],
        sizes: ['S', 'M', 'L', 'XL'],
        tags: ['coat', 'winter', 'women'],
        isFeatured: true,
        isActive: true,
        categoryId: womenCoats.id,
      },
      {
        name: 'Brown Wool Coat',
        slug: 'brown-wool-coat',
        shortDescription: 'Elegant brown wool coat for women',
        description: 'Elegant brown wool coat. Warm and stylish for winters.',
        price: 3499,
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'],
        sizes: ['S', 'M', 'L'],
        tags: ['coat', 'wool', 'women'],
        isFeatured: true,
        isActive: true,
        categoryId: womenCoats.id,
      },
      {
        name: 'Navy Blue Formal Blazer',
        slug: 'navy-blue-formal-blazer',
        shortDescription: 'Professional navy blue blazer for men',
        description: 'Professional navy blue blazer. Perfect for office and formal events.',
        price: 2499,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['blazer', 'formal', 'men'],
        isFeatured: true,
        isActive: true,
        categoryId: mensBlazer.id,
      },
      {
        name: 'Charcoal Grey Blazer',
        slug: 'charcoal-grey-blazer',
        shortDescription: 'Slim fit charcoal grey blazer',
        description: 'Slim fit charcoal grey blazer. Modern and elegant design.',
        price: 2799,
        images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500'],
        sizes: ['M', 'L', 'XL'],
        tags: ['blazer', 'slim-fit', 'men'],
        isFeatured: true,
        isActive: true,
        categoryId: mensBlazer.id,
      },
      {
        name: 'Camel Woolen Jacket',
        slug: 'camel-woolen-jacket',
        shortDescription: 'Premium camel woolen jacket unisex',
        description: 'Premium camel color woolen jacket. Unisex design for all occasions.',
        price: 1999,
        images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500'],
        sizes: ['S', 'M', 'L', 'XL'],
        tags: ['jacket', 'woolen', 'unisex'],
        isFeatured: false,
        isActive: true,
        categoryId: woolenJackets.id,
      },
    ],
  })

  console.log('✅ Products created')
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
